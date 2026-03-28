<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTeamMemberRequest;
use App\Http\Requests\Admin\UpdateTeamMemberRequest;
use App\Models\TeamMember;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeamMemberController extends Controller
{
    /**
     * Display a listing of team members ordered by sort_order.
     */
    public function index()
    {
        $members = TeamMember::with('photo')
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('admin/team/index', [
            'members' => $members,
        ]);
    }

    /**
     * Show the form for creating a new team member.
     */
    public function create()
    {
        $nextSortOrder = (TeamMember::max('sort_order') ?? 0) + 1;

        return Inertia::render('admin/team/create', [
            'nextSortOrder' => $nextSortOrder,
        ]);
    }

    /**
     * Store a newly created team member.
     */
    public function store(StoreTeamMemberRequest $request)
    {
        TeamMember::create(
            $request->validated() + ['sort_order' => (TeamMember::max('sort_order') ?? 0) + 1]
        );

        return redirect()->route('admin.team.index')
            ->with('success', 'Team member created.');
    }

    /**
     * Show the form for editing the specified team member.
     */
    public function edit(TeamMember $teamMember)
    {
        $teamMember->load('photo');

        return Inertia::render('admin/team/edit', [
            'member' => $teamMember,
        ]);
    }

    /**
     * Update the specified team member.
     */
    public function update(UpdateTeamMemberRequest $request, TeamMember $teamMember)
    {
        $teamMember->update($request->validated());

        return redirect()->route('admin.team.index')
            ->with('success', 'Team member updated.');
    }

    /**
     * Remove the specified team member.
     */
    public function destroy(TeamMember $teamMember)
    {
        $teamMember->delete();

        return redirect()->route('admin.team.index')
            ->with('success', 'Team member deleted.');
    }

    /**
     * Reorder a team member by swapping sort_order with adjacent item.
     */
    public function reorder(Request $request, TeamMember $teamMember)
    {
        $request->validate([
            'direction' => 'required|in:up,down',
        ]);

        $current = $teamMember->sort_order;

        if ($request->direction === 'up') {
            $swapWith = TeamMember::where('sort_order', '<', $current)
                ->orderByDesc('sort_order')
                ->first();
        } else {
            $swapWith = TeamMember::where('sort_order', '>', $current)
                ->orderBy('sort_order')
                ->first();
        }

        if ($swapWith) {
            $teamMember->update(['sort_order' => $swapWith->sort_order]);
            $swapWith->update(['sort_order' => $current]);
        }

        return redirect()->back();
    }
}
