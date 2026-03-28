# Phase 3: Admin Panel - Research

**Researched:** 2026-03-28
**Domain:** Laravel + Inertia.js + React admin CRUD, rich text editing (Tiptap), media library, role-based access, site settings
**Confidence:** HIGH

## Summary

Phase 3 builds a full admin panel on the existing Laravel 13 + Inertia.js 3 + React 19 stack. The codebase already has the sidebar-based AppLayout, Radix UI component library, Inertia form handling patterns, and existing Contact/NewsletterSubscriber models. The admin panel extends this foundation with 7 new database tables, 10+ CRUD controllers, a Tiptap rich text editor with native RTL support, a media library with Intervention Image v4 thumbnail generation, and a simple role-based access system using Laravel Gates.

The critical finding is that Tiptap v3.21.0 has **native RTL/text-direction support built into the core editor** -- the `textDirection: 'auto'` option resolves the blocker concern from STATE.md (GitHub #3957). No separate extension is needed for Arabic text direction.

**Primary recommendation:** Follow the existing Inertia.js CRUD pattern (Controller -> Inertia::render -> React page with useForm) for all admin sections. Extend the AppSidebar with grouped nav items per D-02. Use Tiptap StarterKit + Image extension for the editor. Use Intervention Image v4 with GD driver for thumbnails. Keep role system simple with enum column + Gates (no Spatie package).

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Reuse existing AppLayout with sidebar (`app-sidebar.tsx`). Extend `mainNavItems` array with grouped sections. No new layout needed.
- **D-02:** Sidebar groups: Content (Blog Posts, Portfolio/Case Studies), Website (Services, Testimonials, Team Members), Communication (Contact Leads, Newsletter Subscribers), System (Site Settings, Media Library, Users/Roles). Dashboard stays as top-level nav item.
- **D-03:** Each admin section gets index (list) page and create/edit form pages. Consistent pattern: list with search/filter -> create/edit form -> delete confirmation dialog.
- **D-04:** Admin pages live under `resources/js/pages/admin/` directory. Routes grouped under `/admin/` prefix with auth middleware.
- **D-05:** Use Tiptap as rich text editor. Standard content toolbar: headings (H2, H3, H4), bold, italic, strikethrough, ordered/unordered lists, blockquote, code block, links, images (via media library), horizontal rule.
- **D-06:** Bilingual editing uses tabbed interface -- EN and AR tabs on the same form. Both locales saved together on form submit.
- **D-07:** Image insertion in Tiptap triggers media library modal. Uploaded/selected images inserted as responsive `<img>` tags with alt text.
- **D-08:** Blog post preview opens post rendered with public site layout in a new tab.
- **D-09:** Media library is a modal overlay browser accessible from any image upload field. Also available as standalone page under System section.
- **D-10:** Upload via drag-and-drop zone or file picker. Multiple file upload. Server generates thumbnails (150x150, 400x300) using Intervention Image or native GD.
- **D-11:** Files stored in `storage/app/public/media/` with year/month subdirectories. Public URL via storage symlink.
- **D-12:** Media library list view shows thumbnail grid with file name, dimensions, size, upload date. Search by filename.
- **D-13:** New database tables: `blog_posts`, `portfolio_items`, `testimonials`, `service_pages`, `team_members`. Bilingual columns (e.g., `title_en`, `title_ar`).
- **D-14:** Database seeders populate initial content from Phase 02 JSON translation files.
- **D-15:** Frontend controllers pass database content as Inertia props. Public pages read from database once admin panel is live. JSON translations remain for UI strings only.
- **D-16:** A `media` table stores uploaded file metadata.
- **D-17:** Simple `role` enum column on `users` table: `admin`, `editor`. Default is `editor`. No Spatie package.
- **D-18:** Authorization via Laravel Gates and Policies. Middleware `role:admin` protects admin-only routes. Editor accesses blog posts and portfolio only.
- **D-19:** Sidebar dynamically shows/hides sections based on user role.
- **D-20:** No self-registration. Admins create editor accounts through Users management.
- **D-21:** Single `site_settings` table with `key` (string, unique) and `value` (JSON) columns.
- **D-22:** Color picker for brand colors. Hex values stored. Applied at runtime via CSS custom property overrides injected through HandleInertiaRequests middleware.
- **D-23:** Logo upload uses media library. Site name editable.
- **D-24:** Settings cached in Laravel application cache. Cache busted on update. Shared via HandleInertiaRequests.

### Claude's Discretion
- Dashboard widget design and metric card styling
- Exact sidebar icon choices for each section (Lucide icons)
- Table component design for list views
- Form validation UX details (inline errors, toast notifications)
- Tiptap extension selection and configuration details
- Thumbnail generation sizing and quality settings
- Admin pagination style

### Deferred Ideas (OUT OF SCOPE)
- Content scheduling and workflow (draft -> review -> publish) -- v2 ADMN-12
- Activity log / audit trail for admin actions -- v2 ADMN-11
- Analytics dashboard with traffic data -- v2 ADMN-13
- Content versioning / revision history -- v2 BLOG-11
- Advanced search when blog exceeds 50+ posts -- v2 ENGM-02
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ADMN-01 | Admin dashboard with key metrics (recent leads, post count, portfolio count) | Inertia::render with aggregated DB counts; Card UI components exist; replace PlaceholderPattern in dashboard.tsx |
| ADMN-02 | Blog post CRUD with rich text editor (Tiptap), bilingual fields, image upload, preview | Tiptap v3.21.0 StarterKit + Image extension; native textDirection support; tabbed EN/AR form; Inertia useForm pattern |
| ADMN-03 | Portfolio/case study CRUD with images, service category, bilingual content | Same CRUD pattern as blog; media library modal for images; select/dropdown for service category |
| ADMN-04 | Contact lead list with status tracking and filtering | Existing Contact model already has status enum; add admin controller with index/show/update actions |
| ADMN-05 | Testimonial management -- add, edit, reorder, show/hide | New testimonials table with sort_order + is_visible columns; move-up/move-down buttons or drag sort |
| ADMN-06 | Service page content editing -- structured fields | New service_pages table with bilingual structured columns; admin form with repeatable process steps |
| ADMN-07 | Site settings -- logo, colors, contact info, social links | site_settings key-value table; SettingsService with caching; react-colorful for color picker; HandleInertiaRequests shares settings |
| ADMN-08 | Media library -- upload, browse, reuse with thumbnails | Intervention Image v4 with GD; media table; drag-drop upload zone; modal browser component |
| ADMN-09 | Multi-role access -- admin (everything) and editor (blog + portfolio only) | Role enum on users table; EnsureUserHasRole middleware; Laravel Gates; sidebar conditional rendering |
| ADMN-10 | Team member management -- add, edit, reorder with photos and bios | New team_members table with bilingual fields + sort_order; media library for photos |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- **Tech stack**: Laravel 12+ (currently 13.2.0) + Inertia.js 3 + React 19 + Tailwind CSS 4 -- no alternatives
- **Bilingual**: All admin-managed content must have EN and AR fields
- **Admin UX**: Non-technical users must manage content without code
- **Naming**: React components PascalCase, hooks use- prefix kebab-case, files kebab-case
- **Imports**: Always use `@/*` path aliases, never relative imports
- **Code style**: Prettier (4-space, single quotes, semicolons), ESLint flat config, Pint for PHP
- **Exports**: Default exports for page components, named exports for utilities/hooks
- **Type imports**: Use `import type` for type-only imports
- **Error handling**: Validation via InputError component, no console.error in catch blocks
- **Testing attributes**: `data-test="kebab-case"` on critical interactive elements

## Standard Stack

### Core (New Dependencies)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@tiptap/react` | 3.21.0 | Rich text editor React bindings | Leading headless WYSIWYG for React; ProseMirror-based; native RTL support |
| `@tiptap/pm` | 3.21.0 | ProseMirror dependencies | Required peer dependency for Tiptap |
| `@tiptap/starter-kit` | 3.21.0 | Pre-assembled extension bundle | Includes bold, italic, strike, heading, lists, blockquote, code-block, horizontal-rule, link |
| `@tiptap/extension-image` | 3.21.0 | Image node extension | Enables image insertion in editor (D-07) |
| `intervention/image-laravel` | 4.0.0 | PHP image processing for Laravel | Official Laravel integration; GD driver available; thumbnail generation |
| `react-colorful` | 5.6.1 | Hex color picker | 2.8KB gzipped; no dependencies; hooks-based; React 16.8+ compatible |

### Existing (Already Installed -- Use These)

| Library | Version | Purpose | Admin Usage |
|---------|---------|---------|-------------|
| `@inertiajs/react` | 3.0.0 | Server-client bridge | useForm for CRUD forms, Link for navigation, usePage for shared data |
| `radix-ui` | 1.4.3 | Headless UI primitives | Dialog (delete confirm, media modal), Select, Checkbox, Separator, Tooltip |
| `@radix-ui/react-accordion` | 1.2.12 | Accordion | FAQ editing, collapsible sections |
| `lucide-react` | 0.475.0 | Icons | Sidebar section icons, toolbar buttons, action icons |
| `class-variance-authority` | 0.7.1 | CSS variants | Component variant patterns |
| `tailwind-merge` | 3.0.1 | Class merging | `cn()` utility throughout |
| `@headlessui/react` | 2.2.0 | Transition animations | Transition for save confirmations |

### New UI Primitives Needed (Add via shadcn CLI)

| Component | Source | Purpose |
|-----------|--------|---------|
| `table` | shadcn/ui | Admin list views for all CRUD sections |
| `tabs` | shadcn/ui (Radix Tabs) | Bilingual EN/AR tabbed editing interface (D-06) |
| `textarea` | shadcn/ui | Multi-line text fields in admin forms |
| `switch` | shadcn/ui (Radix Switch) | Toggle visibility (testimonials show/hide) |
| `popover` | shadcn/ui (Radix Popover) | Color picker container |
| `pagination` | custom (Tailwind) | Admin list pagination |
| `toast` | custom or sonner | Save success/error notifications |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Tiptap | CKEditor 5, Quill | Tiptap is headless (best for custom UI), native RTL, ProseMirror-based, active development |
| react-colorful | react-color | react-color is 7x larger (19KB vs 2.8KB), react-colorful is simpler for hex-only use |
| Intervention Image | Native GD functions | Intervention provides fluent API, auto-orientation, format conversion; manual GD is verbose and error-prone |
| Simple role enum | Spatie/laravel-permission | Two roles don't justify Spatie's tables/cache overhead; Gates + middleware is Laravel-native |
| Move up/down buttons | @dnd-kit/sortable | dnd-kit adds complexity; admin reordering 5-10 items works fine with simple buttons |

**Installation:**
```bash
# PHP dependencies
composer require intervention/image-laravel

# JS dependencies
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-image react-colorful

# shadcn UI components (using project's components.json config)
npx shadcn@latest add table tabs textarea switch popover
```

**Version verification:** All versions confirmed via npm registry and composer show on 2026-03-28.

## Architecture Patterns

### Recommended Project Structure
```
app/
  Http/
    Controllers/
      Admin/
        DashboardController.php
        BlogPostController.php
        PortfolioItemController.php
        ContactLeadController.php
        TestimonialController.php
        ServicePageController.php
        TeamMemberController.php
        SiteSettingController.php
        MediaController.php
        UserController.php
    Middleware/
      EnsureUserHasRole.php
    Requests/
      Admin/
        StoreBlogPostRequest.php
        UpdateBlogPostRequest.php
        StorePortfolioItemRequest.php
        ... (one per form action)
  Models/
    BlogPost.php
    PortfolioItem.php
    Testimonial.php
    ServicePage.php
    TeamMember.php
    Media.php
    SiteSetting.php
  Services/
    SettingsService.php
    MediaService.php
database/
  migrations/
    2026_03_28_000003_add_role_to_users_table.php
    2026_03_28_000004_create_blog_posts_table.php
    2026_03_28_000005_create_portfolio_items_table.php
    2026_03_28_000006_create_testimonials_table.php
    2026_03_28_000007_create_service_pages_table.php
    2026_03_28_000008_create_team_members_table.php
    2026_03_28_000009_create_media_table.php
    2026_03_28_000010_create_site_settings_table.php
  seeders/
    ContentSeeder.php       # Seeds from JSON translations
    SiteSettingsSeeder.php  # Default settings
resources/
  js/
    pages/
      admin/
        dashboard.tsx
        blog/
          index.tsx
          create.tsx
          edit.tsx
        portfolio/
          index.tsx
          create.tsx
          edit.tsx
        contacts/
          index.tsx
          show.tsx
        testimonials/
          index.tsx
          create.tsx
          edit.tsx
        services/
          index.tsx
          edit.tsx
        team/
          index.tsx
          create.tsx
          edit.tsx
        settings/
          index.tsx
        media/
          index.tsx
        users/
          index.tsx
          create.tsx
          edit.tsx
    components/
      admin/
        tiptap-editor.tsx        # Reusable Tiptap wrapper
        tiptap-toolbar.tsx       # Editor toolbar component
        media-library-modal.tsx  # Modal media browser
        media-upload-zone.tsx    # Drag-drop upload area
        bilingual-tabs.tsx       # EN/AR tab wrapper
        data-table.tsx           # Reusable table with search/filter
        admin-pagination.tsx     # Pagination component
        metric-card.tsx          # Dashboard metric cards
        color-picker-field.tsx   # Hex color picker with popover
        image-picker-field.tsx   # Image field with media modal trigger
        sortable-list.tsx        # List with move-up/move-down controls
routes/
  admin.php                      # All admin routes
```

### Pattern 1: Admin CRUD Controller (Resource Pattern)

**What:** Standard Laravel resource controller returning Inertia responses with paginated/filtered data.
**When to use:** Every admin section (blog, portfolio, testimonials, team, etc.)

```php
// app/Http/Controllers/Admin/BlogPostController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBlogPostRequest;
use App\Http\Requests\Admin\UpdateBlogPostRequest;
use App\Models\BlogPost;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogPostController extends Controller
{
    public function index(Request $request)
    {
        $posts = BlogPost::query()
            ->when($request->search, fn ($q, $search) =>
                $q->where('title_en', 'like', "%{$search}%")
                  ->orWhere('title_ar', 'like', "%{$search}%")
            )
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/blog/index', [
            'posts' => $posts,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/blog/create');
    }

    public function store(StoreBlogPostRequest $request)
    {
        BlogPost::create($request->validated());

        return redirect()->route('admin.blog.index')
            ->with('success', 'Post created successfully.');
    }

    public function edit(BlogPost $blogPost)
    {
        return Inertia::render('admin/blog/edit', [
            'post' => $blogPost,
        ]);
    }

    public function update(UpdateBlogPostRequest $request, BlogPost $blogPost)
    {
        $blogPost->update($request->validated());

        return redirect()->route('admin.blog.index')
            ->with('success', 'Post updated successfully.');
    }

    public function destroy(BlogPost $blogPost)
    {
        $blogPost->delete();

        return redirect()->route('admin.blog.index')
            ->with('success', 'Post deleted successfully.');
    }
}
```

### Pattern 2: Admin Route Group with Role Middleware

**What:** Route grouping under `/admin` prefix with auth + role middleware.
**When to use:** The routes/admin.php file.

```php
// routes/admin.php
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard -- accessible to all authenticated users
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Editor-accessible routes (blog + portfolio)
    Route::resource('blog', BlogPostController::class);
    Route::resource('portfolio', PortfolioItemController::class);

    // Admin-only routes
    Route::middleware('role:admin')->group(function () {
        Route::resource('testimonials', TestimonialController::class);
        Route::post('testimonials/{testimonial}/reorder', [TestimonialController::class, 'reorder'])->name('testimonials.reorder');
        Route::resource('services', ServicePageController::class)->only(['index', 'edit', 'update']);
        Route::resource('team', TeamMemberController::class);
        Route::post('team/{teamMember}/reorder', [TeamMemberController::class, 'reorder'])->name('team.reorder');
        Route::get('contacts', [ContactLeadController::class, 'index'])->name('contacts.index');
        Route::get('contacts/{contact}', [ContactLeadController::class, 'show'])->name('contacts.show');
        Route::patch('contacts/{contact}/status', [ContactLeadController::class, 'updateStatus'])->name('contacts.status');
        Route::resource('users', UserController::class)->except(['show']);
        Route::get('settings', [SiteSettingController::class, 'index'])->name('settings.index');
        Route::put('settings', [SiteSettingController::class, 'update'])->name('settings.update');
    });

    // Media -- accessible to editors and admins (needed for blog/portfolio image uploads)
    Route::post('media/upload', [MediaController::class, 'store'])->name('media.store');
    Route::get('media', [MediaController::class, 'index'])->name('media.index');
    Route::delete('media/{media}', [MediaController::class, 'destroy'])->name('media.destroy');
});
```

### Pattern 3: Bilingual Form with Tabs (React)

**What:** EN/AR tabbed interface using Radix Tabs for bilingual content entry.
**When to use:** Blog posts, portfolio items, service pages, testimonials, team members.

```tsx
// Conceptual pattern for bilingual form
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from '@inertiajs/react';

function BilingualForm() {
    const { data, setData, post, processing, errors } = useForm({
        title_en: '',
        title_ar: '',
        content_en: '',
        content_ar: '',
        // ... other fields
    });

    return (
        <Tabs defaultValue="en">
            <TabsList>
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="ar">Arabic</TabsTrigger>
            </TabsList>
            <TabsContent value="en">
                {/* English fields: data.title_en, data.content_en */}
            </TabsContent>
            <TabsContent value="ar" dir="rtl">
                {/* Arabic fields: data.title_ar, data.content_ar */}
            </TabsContent>
        </Tabs>
    );
}
```

### Pattern 4: Tiptap Editor with RTL Support

**What:** Reusable Tiptap editor component with toolbar and bilingual text direction.
**When to use:** Blog post content, portfolio descriptions, any rich text field.

```tsx
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

type Props = {
    content: string;
    onChange: (html: string) => void;
    direction?: 'ltr' | 'rtl' | 'auto';
};

function TiptapEditor({ content, onChange, direction = 'ltr' }: Props) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3, 4] },
            }),
            Image.configure({
                HTMLAttributes: { class: 'max-w-full h-auto rounded-lg' },
            }),
        ],
        content,
        textDirection: direction,
        immediatelyRender: false, // SSR safety
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    return (
        <div className="rounded-md border">
            {/* Toolbar component here */}
            <EditorContent editor={editor} className="prose max-w-none p-4" />
        </div>
    );
}
```

### Pattern 5: Settings Service with Cache

**What:** Laravel service class for reading/writing site settings with application cache.
**When to use:** Site settings (ADMN-07), shared data in HandleInertiaRequests.

```php
// app/Services/SettingsService.php
namespace App\Services;

use App\Models\SiteSetting;
use Illuminate\Support\Facades\Cache;

class SettingsService
{
    private const CACHE_KEY = 'site_settings';
    private const CACHE_TTL = 3600; // 1 hour

    public static function all(): array
    {
        return Cache::remember(self::CACHE_KEY, self::CACHE_TTL, function () {
            return SiteSetting::pluck('value', 'key')->toArray();
        });
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        $settings = self::all();
        return $settings[$key] ?? $default;
    }

    public static function set(string $key, mixed $value): void
    {
        SiteSetting::updateOrCreate(['key' => $key], ['value' => $value]);
        Cache::forget(self::CACHE_KEY);
    }

    public static function setMany(array $settings): void
    {
        foreach ($settings as $key => $value) {
            SiteSetting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
        Cache::forget(self::CACHE_KEY);
    }
}
```

### Pattern 6: Media Upload with Thumbnails

**What:** Media upload controller that stores files and generates thumbnails.
**When to use:** Media library (ADMN-08), all image uploads.

```php
// Conceptual pattern
use Intervention\Image\Laravel\Facades\Image;
use Illuminate\Support\Facades\Storage;

public function store(Request $request)
{
    $request->validate([
        'file' => 'required|image|mimes:jpeg,png,webp,gif|max:10240',
    ]);

    $file = $request->file('file');
    $yearMonth = now()->format('Y/m');
    $filename = uniqid() . '.' . $file->getClientOriginalExtension();

    // Store original
    $path = $file->storeAs("media/{$yearMonth}", $filename, 'public');

    // Generate thumbnails
    $image = Image::decode($file);
    $small = clone $image;
    $medium = clone $image;

    $small->cover(150, 150);
    Storage::disk('public')->put(
        "media/{$yearMonth}/thumbs/sm_{$filename}",
        $small->encodeByExtension($file->getClientOriginalExtension(), quality: 80)
    );

    $medium->cover(400, 300);
    Storage::disk('public')->put(
        "media/{$yearMonth}/thumbs/md_{$filename}",
        $medium->encodeByExtension($file->getClientOriginalExtension(), quality: 80)
    );

    // Store metadata
    return Media::create([
        'filename' => $file->getClientOriginalName(),
        'path' => $path,
        'mime_type' => $file->getMimeType(),
        'size' => $file->getSize(),
        'width' => $image->width(),
        'height' => $image->height(),
        'thumbnail_sm' => "media/{$yearMonth}/thumbs/sm_{$filename}",
        'thumbnail_md' => "media/{$yearMonth}/thumbs/md_{$filename}",
    ]);
}
```

### Pattern 7: Layout Assignment for Admin Pages

**What:** Admin pages use AppLayout (same as dashboard/settings) with breadcrumbs.
**When to use:** All admin pages.

```tsx
// app.tsx already routes pages starting with 'admin/' to AppLayout via default case
// No changes needed to app.tsx -- admin/* pages automatically get AppLayout

// Each admin page sets breadcrumbs:
export default function BlogIndex({ posts, filters }) {
    // ... component body
}

BlogIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Blog Posts', href: '/admin/blog' },
    ],
};
```

### Pattern 8: CSS Custom Property Override for Theme Colors

**What:** Inject admin-configured brand colors as CSS custom property overrides.
**When to use:** Site settings color picker values applied to frontend.

```php
// In HandleInertiaRequests::share()
'siteSettings' => fn () => \App\Services\SettingsService::all(),
```

```tsx
// In a layout component or app.tsx, apply color overrides:
const { siteSettings } = usePage().props;

useEffect(() => {
    if (siteSettings?.primary_color) {
        document.documentElement.style.setProperty('--primary', siteSettings.primary_color);
    }
    if (siteSettings?.secondary_color) {
        document.documentElement.style.setProperty('--secondary', siteSettings.secondary_color);
    }
}, [siteSettings]);
```

Note: The existing `app.css` uses oklch color values for `--primary` and `--secondary`. The color picker stores hex values. A hex-to-oklch conversion utility is needed, or the CSS variables can accept hex directly if the Tailwind config maps them appropriately. The simplest approach is to override the `--color-primary` Tailwind theme variable directly since CSS custom properties accept any color format.

### Anti-Patterns to Avoid
- **Separate SPA for admin:** The admin panel MUST use the same Inertia.js stack as the public site. No separate React Router or API-based SPA.
- **JSON file storage for content:** Phase 02 established JSON -> database migration (D-14). All admin-managed content goes in database tables, not JSON files.
- **Complex permission system:** Two roles do not justify Spatie/laravel-permission. Use simple enum + Gates.
- **Inline rich text HTML:** Never store raw unvalidated HTML. Tiptap outputs sanitized HTML, but always validate server-side before storage.
- **Separate layout for admin:** Reuse AppLayout. Don't create AdminLayout -- the sidebar-based layout already exists.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Rich text editing | Custom contentEditable + toolbar | Tiptap StarterKit | ProseMirror schema validation, sanitized output, 50+ community extensions |
| Image thumbnails | Manual GD resize functions | Intervention Image v4 | Auto-orientation, format detection, fluent API, GD/Imagick abstraction |
| Color picker | Custom HSL/RGB input fields | react-colorful HexColorPicker | Accessibility, touch support, 2.8KB, no deps |
| Drag-drop upload | Custom drag event handlers | Native HTML5 input[type=file] + accept attr | Drag-drop is nice-to-have; file input with accept is sufficient and accessible |
| Data table pagination | Custom offset calculation | Laravel built-in paginate() + Inertia | Laravel pagination returns all metadata; Inertia preserves query strings |
| Form state management | useState for each field | Inertia useForm hook | Built-in validation errors, processing state, transform, flash messages |
| Auth middleware | Custom authentication checks | Laravel auth + verified middleware stack | Already configured via Fortify |
| Cache invalidation | Manual file/memory management | Laravel Cache::forget() | Atomic, driver-agnostic, tag support if needed later |

**Key insight:** The existing Inertia.js + Laravel stack already provides the CRUD scaffolding patterns. The admin panel is 90% applying the same patterns (Controller -> Inertia::render -> React form with useForm) repeatedly across 10 content types.

## Common Pitfalls

### Pitfall 1: Tiptap Content Loss on Tab Switch
**What goes wrong:** Switching between EN/AR tabs re-mounts the Tiptap editor, losing unsaved content.
**Why it happens:** React unmounts TabsContent children when switching tabs by default.
**How to avoid:** Use `forceMount` on TabsContent or keep both editors mounted but visually hidden. Alternatively, sync editor content to useForm data on every `onUpdate` so the form state always has the latest content regardless of which tab is visible.
**Warning signs:** Content disappears when switching tabs before saving.

### Pitfall 2: Storage Symlink Not Created
**What goes wrong:** Uploaded images return 404 because `/storage` symlink doesn't exist.
**Why it happens:** `php artisan storage:link` was never run on the development machine.
**How to avoid:** Run `php artisan storage:link` as the first step of the media library setup. Verify with `ls -la public/storage`.
**Warning signs:** Public URL `/storage/media/...` returns 404; the `public/storage` symlink is missing.

### Pitfall 3: Inertia Form Data Size Limits
**What goes wrong:** Blog posts with large rich text content and embedded base64 images exceed PHP `post_max_size`.
**Why it happens:** Tiptap Image extension defaults can inline images as base64 in the HTML content.
**How to avoid:** Always upload images to the media library first, then insert them as `<img src="/storage/media/...">` URLs. Never allow base64 image insertion in the editor. Configure Tiptap Image extension to only accept URL sources.
**Warning signs:** 413 Request Entity Too Large errors on post save.

### Pitfall 4: Race Condition on Settings Cache
**What goes wrong:** Two admins update settings simultaneously; one update is lost because cache returns stale data.
**Why it happens:** Read-then-write pattern without locking.
**How to avoid:** The SettingsService::setMany() writes directly to DB then busts cache. Since settings are key-value, each `updateOrCreate` is atomic. The only risk is stale reads between cache bust and next request, which is acceptable for site settings.
**Warning signs:** Settings appear to "revert" after save.

### Pitfall 5: Missing Role Middleware on API-Style Routes
**What goes wrong:** An editor accesses admin-only routes by directly visiting the URL.
**Why it happens:** Route middleware `role:admin` not applied consistently, or new routes added without middleware.
**How to avoid:** Group all admin-only routes under a single `Route::middleware('role:admin')` group. Never add admin-only routes outside this group. The sidebar hiding sections (D-19) is UI-only; server-side middleware is the actual security layer.
**Warning signs:** 200 responses when an editor visits admin-only URLs.

### Pitfall 6: Bilingual Validation Asymmetry
**What goes wrong:** English content validates but Arabic content doesn't, or vice versa; admin doesn't understand which locale has the error.
**Why it happens:** Validation rules reference `title_en` but the error message doesn't indicate which language field failed.
**How to avoid:** Use descriptive validation attribute names: `'title_en' => 'Title (English)'`, `'title_ar' => 'Title (Arabic)'`. Display errors near the specific locale tab and highlight the tab that has errors.
**Warning signs:** Generic "The title field is required" without indicating which language.

### Pitfall 7: Intervention Image Memory on Large Uploads
**What goes wrong:** Thumbnail generation fails with memory exhaustion on large images (10MB+ DSLR photos).
**Why it happens:** GD loads the entire decompressed image into memory. A 20MP JPEG decompresses to ~60MB in memory.
**How to avoid:** Set `upload_max_filesize` and validate max file size (10MB). For GD, ensure `memory_limit` is at least 256MB. Intervention Image v4 with GD handles most cases within standard limits.
**Warning signs:** PHP Fatal: Allowed memory size exhausted during image upload.

### Pitfall 8: Wayfinder Route Generation for Admin Routes
**What goes wrong:** TypeScript route helpers for admin routes are not generated or not importable.
**Why it happens:** Wayfinder generates routes from `routes/*.php` files on Vite dev server start. A new `routes/admin.php` file needs to be included in the route service provider.
**How to avoid:** Ensure `routes/admin.php` is loaded in `bootstrap/app.php` or `routes/web.php` (via `require`). Then restart Vite dev server to regenerate route helpers. Import admin routes from `@/routes/admin/*`.
**Warning signs:** TypeScript errors on `import { index } from '@/routes/admin/blog'` -- file not found.

## Code Examples

### Database Migration: blog_posts Table

```php
// database/migrations/xxxx_create_blog_posts_table.php
Schema::create('blog_posts', function (Blueprint $table) {
    $table->id();
    $table->string('title_en');
    $table->string('title_ar');
    $table->string('slug')->unique();
    $table->text('excerpt_en')->nullable();
    $table->text('excerpt_ar')->nullable();
    $table->longText('content_en');
    $table->longText('content_ar');
    $table->foreignId('featured_image_id')->nullable()->constrained('media')->nullOnDelete();
    $table->foreignId('author_id')->constrained('users');
    $table->enum('status', ['draft', 'published'])->default('draft');
    $table->timestamp('published_at')->nullable();
    $table->timestamps();
});
```

### Database Migration: site_settings Table

```php
Schema::create('site_settings', function (Blueprint $table) {
    $table->id();
    $table->string('key')->unique();
    $table->json('value')->nullable();
    $table->timestamps();
});
```

### Database Migration: media Table

```php
Schema::create('media', function (Blueprint $table) {
    $table->id();
    $table->string('filename');
    $table->string('path');
    $table->string('mime_type');
    $table->unsignedBigInteger('size');
    $table->unsignedInteger('width')->nullable();
    $table->unsignedInteger('height')->nullable();
    $table->string('thumbnail_sm')->nullable();
    $table->string('thumbnail_md')->nullable();
    $table->timestamps();
});
```

### EnsureUserHasRole Middleware

```php
// app/Http/Middleware/EnsureUserHasRole.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, string ...$roles)
    {
        if (! $request->user() || ! in_array($request->user()->role, $roles)) {
            abort(403);
        }

        return $next($request);
    }
}
```

### Admin Sidebar Extension

```tsx
// Modified app-sidebar.tsx (conceptual)
import { usePage } from '@inertiajs/react';

const contentNavItems: NavItem[] = [
    { title: 'Blog Posts', href: '/admin/blog', icon: FileText },
    { title: 'Portfolio', href: '/admin/portfolio', icon: FolderOpen },
];

const websiteNavItems: NavItem[] = [
    { title: 'Services', href: '/admin/services', icon: Briefcase },
    { title: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
    { title: 'Team Members', href: '/admin/team', icon: Users },
];

// ... conditionally render groups based on auth.user.role
```

### HandleInertiaRequests Extension

```php
// Share site settings and user role
public function share(Request $request): array
{
    return [
        ...parent::share($request),
        'name' => config('app.name'),
        'auth' => [
            'user' => $request->user(),
        ],
        'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        'locale' => fn () => app()->getLocale(),
        'direction' => fn () => app()->getLocale() === 'ar' ? 'rtl' : 'ltr',
        'translations' => fn () => $this->loadTranslations(app()->getLocale()),
        'siteSettings' => fn () => \App\Services\SettingsService::all(),
    ];
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tiptap v2 RTL via community extension | Tiptap v3 native `textDirection` option | v3.0 (2024-2025) | No separate RTL extension needed; resolves STATE.md blocker |
| Intervention Image v3 `Image::read()` | Intervention Image v4 `Image::decode()` | v4.0.0 (2026) | New API methods: `decode()`, `encodeByExtension()`, `cover()` instead of `fit()` |
| Spatie/laravel-permission for any RBAC | Simple enum + Gates for 2-3 roles | Always (Laravel best practice) | Avoid unnecessary package overhead for simple role systems |
| Separate admin SPA | Same Inertia stack for admin and public | Inertia v2+ pattern | Single codebase, shared components, server-side routing |

**Deprecated/outdated:**
- `intervention/image` v2.x: Incompatible with PHP 8.3. Use v4.x.
- `tiptap-text-direction` community extension: Unnecessary with Tiptap v3's built-in `textDirection` option.
- React class components: Project uses function components with hooks exclusively.

## Open Questions

1. **Hex to oklch color conversion for CSS custom properties**
   - What we know: The existing `app.css` uses oklch values for `--primary`. Admin stores hex from color picker.
   - What's unclear: Whether Tailwind CSS 4 can accept hex values in oklch-defined custom properties, or if conversion is needed.
   - Recommendation: Test whether setting `--color-primary: #hexvalue` works alongside the existing oklch definitions. If not, implement a simple hex-to-oklch conversion utility. Alternatively, add a parallel set of CSS custom properties (e.g., `--admin-primary`) that override the Tailwind theme mapping.

2. **Blog post preview route (D-08)**
   - What we know: Preview should render the post with the public site layout in a new tab.
   - What's unclear: Whether to use a dedicated preview route with draft data or save-then-redirect.
   - Recommendation: Use a dedicated `/admin/blog/{post}/preview` route that renders the public blog post template with draft data (unsaved). This requires passing form data via a POST to the preview route and rendering it in a new window. Simpler alternative: auto-save as draft, then link to the public post URL.

3. **Content seeder data mapping (D-14)**
   - What we know: Phase 02 JSON files contain hardcoded content keyed like `testimonials.0.quote`, `services.development.title`, etc.
   - What's unclear: Exact mapping between JSON keys and new database table columns.
   - Recommendation: During implementation, read the JSON files, extract content blocks by key pattern, and map to the corresponding table columns. This is a one-time migration step.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| PHP | Backend | Yes | 8.3.27 | -- |
| Composer | PHP packages | Yes | 2.8.6 | -- |
| Node.js | Frontend build | Yes | 20.19.5 (LTS) | -- |
| npm | JS packages | Yes | 10.8.2 | -- |
| Laravel | Framework | Yes | 13.2.0 | -- |
| GD extension | Image processing | Yes | 2.3.3 | -- |
| Imagick extension | Image processing | No | -- | GD (already available, sufficient) |
| Storage symlink | Media public URLs | No | -- | Run `php artisan storage:link` |
| SQLite | Dev database | Yes | (via Laravel config) | -- |

**Missing dependencies with no fallback:**
- None -- all required dependencies are available.

**Missing dependencies with fallback:**
- Storage symlink needs to be created (`php artisan storage:link`).
- Imagick not available -- use GD driver (works fine for JPEG/PNG/WebP/GIF thumbnails).

## Sources

### Primary (HIGH confidence)
- Tiptap official docs (tiptap.dev) -- RTL support, React integration, extension API, StarterKit contents
- Intervention Image v4 docs (image.intervention.io/v4) -- Laravel integration, GD driver, decode/encode API
- Laravel 13.x official docs (laravel.com/docs/13.x) -- Authorization, Cache, Middleware, Gates
- npm registry -- verified package versions for @tiptap/*, react-colorful, react-dropzone, @radix-ui/*
- Composer registry -- verified intervention/image-laravel v4.0.0 compatibility with Laravel 13

### Secondary (MEDIUM confidence)
- Tiptap GitHub Issue #3957 -- confirmed resolved via native textDirection in v3
- GitHub community extensions (tiptap-text-direction) -- verified unnecessary for v3+
- LaravelDaily patterns -- settings table with caching pattern

### Tertiary (LOW confidence)
- None -- all critical claims verified against primary sources.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all packages verified against npm/composer registries with version checks
- Architecture: HIGH -- patterns follow established Inertia.js + Laravel conventions already used in codebase
- Pitfalls: HIGH -- based on direct codebase analysis and known framework behaviors
- Tiptap RTL: HIGH -- verified native support in v3 via official docs (textDirection option)
- Intervention Image v4 API: MEDIUM -- v4 just released; API verified via docs but fewer community examples

**Research date:** 2026-03-28
**Valid until:** 2026-04-28 (stable ecosystem, major versions settled)
