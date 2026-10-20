# Adarsh College of Nursing --- Backend Admin UI/UX Design Specification

**Project URL:** https://adarshnursingcollege.in/\
**Document:** `design.md`\
**Scope:** Backend/admin interface only\
**Primary rule:** Preserve the existing public-facing frontend exactly
as it is.

------------------------------------------------------------------------

## 1. Objective

Redesign the visual presentation, usability, layout, spacing, alignment,
navigation, tables, forms, and responsive behavior of the existing
backend/admin panel for Adarsh College of Nursing.

This is a **UI/UX-only backend redesign**. Do not redesign, restyle,
rewrite, or otherwise disturb the public website, including its
homepage, navigation, page content, images, typography, public CSS,
public JavaScript, SEO metadata, URLs, or existing frontend behavior.

The public website currently presents A.N.M., G.N.M., and B.Sc. Nursing
programmes, admissions information, facilities, gallery, careers, and
contact details. Backend modules should support these content areas only
where the existing application already supports them or where the owner
explicitly approves adding them.

## 2. Non-negotiable constraints

1.  **Do not change the original frontend.**
2.  Do not replace the public website theme, header, footer, menus,
    content, or assets.
3.  Do not apply global CSS selectors that can leak into the public
    website, such as broad `body`, `header`, `nav`, `button`, `table`,
    or `input` overrides shared across both interfaces.
4.  Keep admin assets, styles, scripts, components, and layout isolated
    from public assets.
5.  Do not change database schemas, business rules, API contracts,
    authentication logic, or existing workflows as part of a visual-only
    task.
6.  Reuse existing backend routes, APIs, data, permissions, and form
    actions.
7.  Do not invent data or show fake live metrics. Use real data; when no
    data is available, show a clear empty state.
8.  Preserve all existing working actions and links.
9.  Do not remove features because they do not fit the new layout.
10. Before implementation, inspect the repository and identify the
    actual framework, admin entry point, routes, stylesheets, API calls,
    and authentication setup. Do not assume a technology stack before
    inspection.

## 3. Visual direction

Create a polished, calm, trustworthy healthcare-education administration
interface.

-   **Primary:** Deep navy `#17324D`
-   **Secondary:** Teal `#168C8C`
-   **Page background:** `#F5F7FA`
-   **Surface/card:** `#FFFFFF`
-   **Main text:** `#1F2937`
-   **Secondary text:** `#667085`
-   **Borders:** `#E4E7EC`
-   **Success:** `#16803C`
-   **Warning:** `#B7791F`
-   **Error:** `#C93636`
-   **Info:** `#2563EB`

Use the existing college logo where available. Do not invent a new
institutional logo. Use a clean sans-serif font already available in the
project; otherwise use a system font stack. Use restrained shadows,
subtle borders, consistent corner radii, and minimal animation. Avoid
excessive gradients, glassmorphism, oversized cards, and decorative
effects that reduce readability.

## 4. Admin application shell

### Desktop layout

-   Fixed or sticky left sidebar: approximately 248--264 px wide.
-   Main content area fills remaining width.
-   Top header: approximately 64--72 px high.
-   Content padding: 24--32 px on desktop.
-   Main content max width should prevent overly stretched tables and
    forms.
-   Keep the sidebar and top bar consistent across all admin routes.

### Sidebar

Header area: - Existing college logo, if available. - Label: **Adarsh
College of Nursing** - Small sub-label: **Administration**

Navigation items should be shown only if the corresponding feature
exists and the signed-in user has permission:

1.  Dashboard
2.  Admissions / Enquiries
3.  Students
4.  Courses
5.  Faculty & Staff
6.  Notices & Announcements
7.  Gallery / Media
8.  Facilities / Pages
9.  Careers / Applications
10. Reports
11. Users & Roles
12. Settings

Requirements: - Use one consistent icon set already present in the
project, or an approved icon library. - Clearly distinguish the active
route with a light teal/navy highlight and a small accent indicator. -
Group related items under short section labels if the menu becomes
long. - Support collapse/expand on desktop. - On mobile, show the
sidebar as a drawer opened by a menu button. - Do not display links to
unavailable modules or unauthorized actions.

### Top header

-   Left: breadcrumb and current page title.
-   Right: notifications only if implemented, profile/avatar menu,
    account name/role, and logout.
-   Avoid placing too many controls in the header.
-   Use clear focus states and accessible labels.
-   Any existing logout behavior must remain intact.

## 5. Dashboard screen

Create a concise overview using existing database values only.

### Page heading

-   Title: `Dashboard`
-   Supporting text: `Overview of college administration`
-   Right-side actions: only useful existing actions, such as
    `Add Enquiry` or `Add Notice`, if supported by the application.

### Summary cards

Show only metrics supported by the backend, for example: - Total
admission enquiries - New / pending enquiries - Total students - Active
courses - Published notices

Each card should have: - Short label - Clearly readable number - Small
contextual icon - Optional comparison only if reliable historical data
exists - Consistent height and padding

Do not hardcode sample counts as production metrics.

### Dashboard content

If data exists, use a balanced two-column layout for: - Recent admission
enquiries - Recent administrative activity - Enquiry status breakdown -
Upcoming events or latest notices

Use charts only when they provide useful information and the underlying
data is real. Avoid charts with fabricated data.

### Empty and loading states

-   Loading: restrained skeleton placeholders.
-   Empty: short explanation and a relevant action if permitted.
-   Error: clear message with retry where appropriate.
-   Never leave a large blank panel without explanation.

## 6. Table and listing standards

Apply the same layout rules to all management tables.

### Table toolbar

-   Page title and short description.
-   Primary action aligned consistently to the right.
-   Search field aligned with filters.
-   Filters should wrap cleanly on smaller screens.
-   Display result count where available.

### Table columns

-   Use concise column headings.
-   Align text to the left and numeric values consistently.
-   Keep date formats consistent, preferably `DD MMM YYYY`.
-   Use status badges with both text and color.
-   Place row actions in a consistent final column.
-   Do not overload each row with too many buttons; use an overflow menu
    when appropriate.

### Table behavior

-   Keep existing search, sorting, filters, pagination, and bulk actions
    working.
-   Use server-side pagination/search if the current API supports it.
-   On narrow screens, provide a safe horizontal scroll area or a
    deliberate compact row layout.
-   Keep table headers visually distinct.
-   Show a useful empty state and a clear reset-filters action.
-   Add confirmation for destructive actions.
-   Do not change the meaning of any existing action.

## 7. Forms and alignment

All create/edit forms should follow one consistent pattern.

-   Place the page title and breadcrumb above the form.
-   Use a centered form container with a sensible maximum width.
-   Group related fields into sections with clear labels.
-   Use a two-column grid on wide screens where appropriate; collapse to
    one column on mobile.
-   Align labels, inputs, helper text, and validation errors
    consistently.
-   Use a minimum comfortable input height of about 44 px.
-   Keep required-field indicators clear.
-   Use the same spacing between fields and sections.
-   Place primary and secondary actions together at the bottom, with the
    primary action visually dominant.
-   Keep action buttons visible on long forms without covering fields.
-   Preserve existing field names, validation rules, submission logic,
    and API payloads.

### Validation and feedback

-   Show errors beside the relevant field.
-   Preserve entered values after validation errors.
-   Show a clear success message after a successful save.
-   Prevent accidental double submission while a request is pending.
-   Confirm destructive or irreversible actions.
-   Use inline help only where it clarifies a field.

## 8. Module-specific UI guidance

Implement these layouts only for modules that already exist or have been
approved.

### Admissions / Enquiries

-   Listing with applicant name, contact, programme, enquiry date, and
    current status where available.
-   Detail view with all existing enquiry information.
-   Clear actions for viewing, editing, updating status, or contacting
    an applicant if supported.
-   Do not expose sensitive applicant data to roles that should not see
    it.

### Students

-   Searchable list with student identifier, name, programme, and status
    if available.
-   Student detail page organized into logical sections.
-   Keep personal information access permission-controlled.

### Courses

-   Clear course cards or a table for A.N.M., G.N.M., B.Sc. Nursing, and
    any other courses actually stored in the system.
-   Course editing must use existing fields and preserve public course
    content unless the existing system intentionally publishes updates.

### Faculty & Staff

-   Consistent profile list and edit form.
-   Reuse existing profile images and fields.
-   Do not publish private staff details to the public site
    unintentionally.

### Notices & Announcements

-   Listing with title, publication status, and date where available.
-   Editor form with preview only if the current content model supports
    it.
-   Preserve the existing public display and publication workflow.

### Gallery / Media

-   Thumbnail grid with consistent aspect ratios.
-   Clear upload progress, file validation, and error messages if upload
    functionality exists.
-   Preserve existing media paths and avoid deleting files
    automatically.

### Facilities / Pages

-   Provide a structured editor only for fields supported by the
    existing content model.
-   Do not introduce a new page builder that changes the public site
    architecture without explicit approval.

### Reports

-   Clean filters, date range, summary values, and export controls only
    where supported.
-   Exports must use actual authorized data.

### Users & Roles

-   Show roles and permissions clearly.
-   Restrict user-management actions to authorized administrators.
-   Never expose passwords, session tokens, API secrets, or sensitive
    authentication data.

## 9. Spacing, typography, and alignment tokens

Use a consistent spacing scale rather than arbitrary margins:

-   4 px: tiny icon/text separation
-   8 px: compact control spacing
-   12 px: related elements
-   16 px: standard field and card spacing
-   24 px: section spacing
-   32 px: major content separation

Typography: - Page title: approximately 24--30 px, semibold. - Section
title: approximately 16--20 px, semibold. - Body: approximately 14--16
px. - Table text: approximately 13--14 px, readable. - Helper text:
approximately 12--13 px.

Use consistent line heights, button heights, input heights, border
radii, and icon sizes. Avoid one-off alignment fixes when a reusable
layout rule can solve the problem.

## 10. Responsive behavior

### Desktop: 1200 px and above

-   Full sidebar and spacious content.
-   Summary cards in a consistent grid.
-   Tables show their important columns.

### Tablet: 768--1199 px

-   Collapsible sidebar.
-   Summary cards in two columns.
-   Forms use two columns only when fields remain comfortable to read.
-   Table controls may wrap to multiple rows.

### Mobile: below 768 px

-   Sidebar becomes a drawer.
-   Single-column page layout.
-   Summary cards in one or two columns depending on available width.
-   Form fields stack vertically.
-   Buttons have comfortable touch targets.
-   Tables scroll horizontally within their own container.
-   No page-wide horizontal overflow.
-   Modals and dropdowns must fit within the viewport.

## 11. Accessibility and usability

-   Maintain readable contrast.
-   Provide visible keyboard focus indicators.
-   Use semantic headings and correctly associated form labels.
-   Support keyboard navigation in menus, dialogs, dropdowns, and
    tables.
-   Do not rely on color alone to communicate status.
-   Use meaningful icon labels for icon-only buttons.
-   Respect reduced-motion preferences.
-   Ensure validation messages are understandable and associated with
    the relevant field.

## 12. Implementation isolation strategy

Before coding: 1. Inspect the repository and identify public frontend
files versus backend/admin files. 2. Map admin routes, shared layouts,
stylesheets, components, API services, and authentication. 3. Record a
baseline screenshot of the public homepage and representative public
pages. 4. Identify any shared CSS or components that could cause
frontend regressions. 5. Implement changes only within the isolated
admin layout, admin components, and admin stylesheet where possible.

Recommended isolation pattern, adapted to the actual framework:

-   Separate admin layout and route group.
-   Admin-specific stylesheet or CSS-module scope.
-   Admin-specific reusable components for sidebar, header, cards,
    tables, forms, dialogs, and notifications.
-   Existing backend APIs and data models remain the source of truth.
-   Avoid broad global CSS changes.
-   If the admin and public site share a stylesheet, scope all new rules
    beneath a unique admin root class, for example `.admin-app`, and
    verify no public page receives those styles.

Do not introduce a new frontend framework or replace the current stack
just to achieve the redesign.

## 13. Security and data integrity

Although this task is visual-only: - Keep authentication and
authorization enforced by the server. - Do not rely on hiding buttons as
the only access-control mechanism. - Do not expose private data in
dashboard widgets, URLs, browser storage, or logs. - Preserve CSRF
protection, secure session handling, input validation, and existing
upload restrictions. - Do not change production database records during
visual testing. - Never place database credentials or API secrets in
frontend code.

## 14. Quality assurance checklist

### Backend UI

-   [ ] Sidebar active state matches the current route.
-   [ ] Header, breadcrumb, title, and content align consistently.
-   [ ] Cards use consistent spacing and heights.
-   [ ] Tables have aligned columns, filters, pagination, and action
    controls.
-   [ ] Forms have aligned labels, inputs, errors, and footer actions.
-   [ ] Loading, empty, success, and error states are covered.
-   [ ] Desktop, tablet, and mobile layouts are usable.
-   [ ] Keyboard focus and contrast are accessible.
-   [ ] All existing admin workflows still work.
-   [ ] No fake statistics or placeholder production data are shown.

### Public frontend regression protection

-   [ ] Homepage appearance remains unchanged.
-   [ ] Public header, navigation, footer, and typography remain
    unchanged.
-   [ ] Public courses, admissions, facilities, gallery, careers, and
    contact pages remain unchanged.
-   [ ] Existing public forms and links still work.
-   [ ] Public URLs, SEO metadata, and assets remain unchanged.
-   [ ] Compare before/after screenshots at the same viewport sizes.
-   [ ] Check browser console and network errors.
-   [ ] Verify that admin CSS does not leak into public pages.

## 15. Definition of done

The work is complete only when: 1. The backend has a coherent,
professional, responsive visual system. 2. Spacing, alignment, tables,
forms, and navigation are consistent across admin screens. 3. Existing
backend functionality and permissions are preserved. 4. No public-facing
frontend changes are introduced. 5. Before/after checks confirm that the
public website is visually and functionally unchanged. 6. The
implementation notes identify any requested module that could not be
redesigned because its route or functionality does not exist in the
supplied codebase.

------------------------------------------------------------------------

## Final instruction for the implementation agent

**Redesign only the existing backend/admin UI/UX of Adarsh College of
Nursing. Preserve the original public frontend exactly. Inspect the
actual codebase before making changes, reuse existing routes and data,
isolate admin styles and components, and validate the public site for
regressions. Do not rebuild the application, alter business logic, or
change the database schema as part of this design task.**
