<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Shared CRUD behaviour for the homepage ("landing") content lists.
 *
 * Each subclass manages one landing_* table. HomeController reads these
 * tables on every request (no server-side cache), so any write here shows
 * up on the next public page load.
 */
abstract class LandingContentController extends Controller
{
    /** @return class-string<Model> */
    abstract protected function modelClass(): string;

    /** URL / page folder segment, e.g. "faqs". */
    abstract protected function section(): string;

    /** Human label used in flash messages, e.g. "FAQ". */
    abstract protected function label(): string;

    public function index(): Response
    {
        return Inertia::render("admin/landing/{$this->section()}/index", [
            'items' => $this->ordered()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render("admin/landing/{$this->section()}/create", $this->formProps());
    }

    public function edit(string $item): Response
    {
        return Inertia::render("admin/landing/{$this->section()}/edit", [
            'item' => $this->find($item),
        ] + $this->formProps());
    }

    public function destroy(string $item): RedirectResponse
    {
        $this->find($item)->delete();

        return $this->toIndex("{$this->label()} deleted.");
    }

    /**
     * Move an item one place up or down. The whole list is renumbered so
     * duplicate or gapped sort_order values cannot make a move a no-op.
     */
    public function reorder(Request $request, string $item): RedirectResponse
    {
        $request->validate(['direction' => 'required|in:up,down']);

        $ids = $this->ordered()->pluck('id')->all();
        $from = array_search((int) $item, $ids, true);

        abort_if($from === false, 404);

        $to = $request->input('direction') === 'up' ? $from - 1 : $from + 1;

        if ($to >= 0 && $to < count($ids)) {
            [$ids[$from], $ids[$to]] = [$ids[$to], $ids[$from]];

            DB::transaction(function () use ($ids) {
                foreach ($ids as $position => $id) {
                    $this->modelClass()::whereKey($id)->update(['sort_order' => $position]);
                }
            });
        }

        return redirect()->back();
    }

    /**
     * Flip is_visible. Only routed for tables that have the column.
     */
    public function toggleVisibility(string $item): RedirectResponse
    {
        $model = $this->find($item);
        $model->update(['is_visible' => ! $model->is_visible]);

        return redirect()->back()->with(
            'success',
            $model->is_visible ? "{$this->label()} is now visible." : "{$this->label()} is now hidden.",
        );
    }

    /**
     * Extra props for the create/edit forms (e.g. select options).
     *
     * @return array<string, mixed>
     */
    protected function formProps(): array
    {
        return [];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    protected function storeValidated(array $data): RedirectResponse
    {
        $class = $this->modelClass();
        $class::create($data + ['sort_order' => (int) $class::max('sort_order') + 1]);

        return $this->toIndex("{$this->label()} created.");
    }

    /**
     * @param  array<string, mixed>  $data
     */
    protected function updateValidated(string $item, array $data): RedirectResponse
    {
        $this->find($item)->update($data);

        return $this->toIndex("{$this->label()} updated.");
    }

    protected function find(string $id): Model
    {
        return $this->modelClass()::findOrFail($id);
    }

    /** @return Builder<Model> */
    protected function ordered()
    {
        return $this->modelClass()::query()->orderBy('sort_order')->orderBy('id');
    }

    private function toIndex(string $message): RedirectResponse
    {
        return redirect()->route("admin.landing.{$this->section()}.index")
            ->with('success', $message);
    }
}
