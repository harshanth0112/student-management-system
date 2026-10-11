You are a senior React engineer and a senior UI designer with an editorial
design sensibility. Build a professional PROTOTYPE web app called
"Favourite Student List" exactly according to the architecture document at
the bottom and the design system below. Follow the architecture strictly
(folders, routes, contexts, services, data models, flows). Do not invent a
different structure, and do not produce a generic "AI dashboard" look.

=== 1. PROJECT SUMMARY ===
A role-based single-page React app with two roles: TEACHER and STUDENT.
- Teacher: logs in, views the student list, adds students by Gmail,
  edits/deletes/disables students, favourites/unfavourites students, sees
  dashboard stats, invitations and activity.
- Student: logs in with the Gmail the teacher added and can ONLY see their own
  dashboard and profile. Students must NEVER see the student list, other
  students, or favourites.
- Prototype: authentication, roles and invitation emails are SIMULATED. All
  data comes from mock files and persists in localStorage via a service layer.

=== 2. TECH STACK (use exactly this) ===
React (functional components + hooks) + Vite, React Router v6 (use <Link>,
nested routes, <Outlet />), Context API + useReducer, Tailwind CSS,
React Hook Form + Zod, lucide-react, react-hot-toast, Recharts,
localStorage. JavaScript, not TypeScript.
Load Google Fonts: Playfair Display (300, 400 + italic), Space Grotesk
(400, 500, 600), Space Mono (400, 700), with sensible fallbacks.

=== 3. FEATURES ===
Teacher:
- Dashboard: stat cards (total, active, invited, favourites), charts
  (students per department / per class), recent additions, recent activity
- Student list: debounced search, filters (class, department, status), sort,
  pagination, table/grid toggle
- Add student by Gmail: validate Gmail format, unique Gmail, unique roll
  number, required name/class/department; create with status "invited";
  generate a temporary password; show a simulated invitation email in a
  preview modal and on an Invitations outbox page
- Edit, delete (confirm dialog), disable, resend invite
- Favourites: heart toggle per student, duplicates prevented, remove,
  clear all (confirm), navbar count badge, empty state text exactly:
  "No favourite students added yet"
- Activity log page and a "Reset demo data" button
Student:
- Login with Gmail + temporary password, forced password change on first
  login (status becomes active), personal dashboard (own details +
  announcements), profile with limited editing, logout
Both:
- Single login page redirecting by role, dark/light mode, toasts, loading
  skeletons, 404 and 403 pages, error boundary, session expiry, responsive,
  accessible

=== 4. ENGINEERING RULES ===
1. Route guards: PublicOnlyRoute, ProtectedRoute (remembers intended URL),
   RoleRoute (wrong role -> /unauthorized), first-login guard.
2. StudentContext and FavouritesContext are mounted ONLY inside the teacher
   layout, so student pages never load the roster.
3. Favourites store student IDs only. Deleting a student removes them from
   favourites. A disabled student cannot log in.
4. Layers talk only downward: pages -> components -> contexts/hooks ->
   services -> data/localStorage. Components never import mock data or touch
   localStorage. Services return promises with a small artificial delay so
   loading states are real.
5. Filtered/sorted/paginated lists are derived, never stored. Memoise
   context values.
6. Build reusable UI components (Button, Input, Select, Modal, Badge, Toast,
   Skeleton, EmptyState, ConfirmDialog, Pagination, Avatar, StatCard,
   ScanLoader, WordReveal, GridBackground). Pages compose them and never
   restyle from scratch.
7. Put ALL design tokens in tailwind.config and CSS variables. No hard-coded
   hex values inside components.
8. Short comments only where logic is non-obvious. Code must pass ESLint and
   Prettier defaults.

=== 5. DESIGN SYSTEM: "EDITORIAL TECH" ===
Overall feel: a sophisticated editorial interface: warm paper background,
high-contrast serif headlines, technical monospace metadata, muted forest
green accent, hairline borders instead of shadows. Calm, precise, premium.

5.1 Colour tokens (light)
- background #f7f6f2 (never pure white as the page background)
- foreground #1c1c1c
- primary #3d7068 (buttons, active states, highlights, links)
- border #e5e4de (1px hairlines)
- surface-hover #ffffff (cards/cells on hover)
- muted text #6b6b66 (functional secondary text; must meet WCAG AA contrast)
- decorative-only muted #B4B4B4 (italic emphasis words in big headlines only,
  never for readable text)
- status colours (muted, solid, no gradients): Active = deep green #3d7068,
  Invited = ochre #a77a1f, Disabled = brick #9a3b34 / grey #8a8a85
- danger = brick #9a3b34 for destructive actions
Dark theme (design the equivalents yourself in the same spirit): background
#151513, foreground #ecebe5, border #2c2c28, primary lifted to
~#6fa89e for contrast, same hairline-border logic, same muted status hues.

5.2 Typography
- Playfair Display (light 300, tight tracking): page titles, section
  headings, large stat numbers, greetings. DISPLAY USE ONLY, never in
  tables, forms or dense text.
- Space Grotesk: body text, table cells, form values, descriptions.
- Space Mono: ALL metadata and technical data: labels, buttons, badges,
  roll numbers, IDs, dates, counts, column headers, nav links. Uppercase with
  tracking 0.2em-0.3em for labels and buttons.
- Minimum sizes: 11px for uppercase mono labels, 14px for body, 16px for form
  inputs (no smaller than 11px anywhere functional).

5.3 Shape, borders, motion
- 1px borders (#e5e4de) for all separation: cards, tables, inputs, sidebar,
  sections. Do NOT use shadows to separate sections.
- Border radius maximum 2px everywhere (buttons, inputs, cards, modals,
  badges). No pill shapes except where a tab switcher is explicitly specified
  below.
- No gradients. Solid fills and simple opacity transitions only.
- All transitions: cubic-bezier(0.16, 1, 0.3, 1), 700ms-1000ms for
  entrances and reveals, 200-300ms for small hover feedback.
- Respect prefers-reduced-motion: disable reveals, scan-line and
  letter-spacing animation.

5.4 Structural background (GridBackground, behind the app)
- Fixed layer, pointer-events none, z-index below content.
- Vertical 1px lines (#e5e4de) at 25%, 50%, 75% of viewport width.
- Overlay a 40px square grid pattern with a radial mask: ~40% opacity at the
  centre fading to 0% at the edges.
- On screens under 768px, keep only the 50% vertical line and a lower-opacity
  grid.
- Content sits in a max-w-7xl container with generous 40px section padding.

5.5 Special components
- ScanLoader: 2px-high track (#e5e4de) with an inner line (primary colour;
  optional prop for #3b82f6) animating from -100% to 100% in a 2s infinite
  cubic-bezier(0.8, 0, 0.2, 1) slide. Use it for page loads, table loading
  and the "sending invitation" simulation.
- Animated CTA button: primary background, white text, Space Mono 11px,
  tracking 0.25em. On hover, animate tracking to 0.4em WITHOUT changing the
  button width (set a fixed or min width so nothing shifts) and slide a
  white/20% overlay up from the bottom (translate-y-full -> 0). Variants:
  primary, outline (1px border, transparent), ghost, danger.
- WordReveal: split text into per-word spans at opacity 0.15; opacity rises
  to 1 as the container scrolls through the viewport (IntersectionObserver or
  scroll listener). Use only for the login-page statement and the empty-state
  or announcement headline, not for data. With reduced motion, show full
  opacity.
- Inputs: bottom-border-only (1px #e5e4de, primary colour on focus), 10-11px
  mono uppercase labels above, mono placeholders, clear error text in
  danger colour, visible focus ring for accessibility.
- StatCard: bordered cell (1px dividers in a grid, no gaps), 40px padding,
  48px bordered icon box, large Playfair number (4xl), uppercase mono label,
  transitions to white background on hover.
- Badge: 1px border, 2px radius, mono uppercase, coloured by status.
- Tables: 1px row dividers, mono uppercase column headers, Space Grotesk
  cells, mono for roll numbers and dates, hover row turns white.
- Modal / ConfirmDialog: bordered panel on a dimmed backdrop, serif title,
  mono action buttons, focus trapped, Esc closes.
- Toasts: bordered, 2px radius, mono text, no shadows.
- Charts (Recharts): flat solid fills in primary and muted tints, 1px grid
  lines, mono axis labels, no gradients, sharp corners.

=== 6. SCREEN-BY-SCREEN UI ===
Login: two-column layout. Left: serif H1 (large, light, uppercase, e.g.
"Know your class.") with one italic #B4B4B4 emphasis word, plus a WordReveal
statement. Right: login form with underline inputs, show/hide password, a
full-width CTA, and a bordered "Demo credentials" panel in mono. A pulse-dot
badge reads "Prototype / simulated login".
Header (all layouts): fixed top bar with backdrop blur and #f7f6f2/80
background; transparent at the top of the page, gaining a bottom border on
scroll. Brand wordmark "FAVOURITE STUDENT LIST" in Playfair (20px) flanked by
two short horizontal bars (24px and 32px). Links in 10-11px mono uppercase,
tracking 0.3em. Theme toggle, favourites count badge (teacher), profile menu.
Teacher layout: desktop sidebar with 1px right border (Dashboard, Students,
Favourites, Invitations, Activity), mono uppercase links, active item marked
with a primary left border. On mobile the sidebar becomes a drawer.
Teacher dashboard: Playfair greeting, 4-cell stat grid, two bordered chart
panels, "Recent additions" and "Recent activity" lists divided by 1px lines.
Student list: filter bar with underline inputs and selects, table/grid toggle
(simple bordered segmented control), sortable column headers, paginated
table; rows show Avatar, name, mono roll number, class, department, status
badge, heart toggle, edit/delete actions. Under 768px, table rows become
bordered cards.
Add/Edit student: two-column form, with the large serif heading on the left
("Add a student") and fields on the right: Gmail, name, roll number, class,
department, phone. On submit show ScanLoader, then the simulated invitation
email modal (styled like a plain mono email).
Student detail: serif name, status badge, mono metadata grid, invitation
info, favourite toggle, that student's recent activity.
Favourites: card grid or table with remove buttons and "Clear all"; empty
state with a large faint (5% opacity, ~240px) ghost heart icon, the serif
line "No favourite students added yet", and a CTA to the student list.
Invitations: outbox table (mono) with status badges and resend action.
Student layout: minimal top bar. Dashboard: serif greeting, bordered
own-details card, announcements list (WordReveal for the newest headline).
Profile: limited editable fields, change-password section.
403 / 404: large serif code number, short sentence, CTA back home.

=== 7. MOCK DATA ===
- mockTeachers: 2 (name, Gmail, password, avatar, subject)
- mockStudents: 25 with name, roll number, Gmail, class, department, phone,
  avatar, createdAt; 4 departments, several classes; mostly active, some
  invited, 1-2 disabled
- mockFavourites: 4 pre-favourited students
- mockInvitations: a few sent / accepted / expired with temp passwords
- mockActivity: 12 entries; mockAnnouncements: 4 notices
- Provide demo credentials (one teacher, one active student, one invited
  student) and show them on the login page.

=== 8. QUALITY BAR ===
- Responsive from 360px to wide desktop; no horizontal page scroll.
- Accessibility: semantic HTML, labelled inputs, visible focus, keyboard
  navigation, ARIA on dialogs and toasts, WCAG AA contrast in both themes.
- Loading skeletons (bordered, flat, no shimmer gradients; use ScanLoader or
  opacity pulse), friendly error states, error boundary.
- Lazy-load route pages. Debounce search. Memoise context values.
- Consistent spacing scale and component variants; no one-off styling.

=== 9. WORKING METHOD ===
Do NOT output everything at once. Work in these phases and STOP after each
one until I say "continue":
 1. Setup: Vite + Tailwind config with all tokens, fonts, folder structure,
    constants, GridBackground, and ALL reusable UI components, plus a temporary
    "design preview" page showing every component in light and dark mode
 2. Mock data files + services layer with localStorage seeding
 3. AuthContext, login page, route guards, layouts (header, sidebar, drawer),
    403/404 pages
 4. Teacher core: student list, add by Gmail + invitation preview, edit,
    delete, disable
 5. Favourites: context, toggle, favourites page, empty state
 6. Student side: forced password change, dashboard, profile
 7. Teacher dashboard charts, activity log, announcements, invitations
 8. Polish: search/filter/sort/pagination, dark mode, toasts, skeletons,
    responsiveness, accessibility, reduced-motion
 9. Tests (Vitest + React Testing Library: validators, services, guards,
    favourite toggle, empty state) and README
For every phase: list files created or changed, give COMPLETE code for each
file (no placeholders, no "...", no "rest of code here"), and tell me how to
run and verify that phase. Each phase must run without errors before the next
begins.

=== 10. README ===
Features, tech stack, setup steps, demo credentials, folder structure,
design-system notes, and a clear statement that authentication, roles and
emails are SIMULATED and that a real version needs a backend with hashed
passwords and server-side role checks.

=== 11. ARCHITECTURE DOCUMENT (source of truth) ===
[PASTE YOUR FULL ARCHITECTURE DOCUMENT HERE]

If any instruction conflicts with the architecture document on structure,
routes or data flow, follow the architecture document. If it conflicts on
visual style, follow the design system in section 5.
Start with Phase 1 only.

=== 10B. LANDING PAGE ADDENDUM (supersedes earlier instructions where they conflict) ===

PURPOSE
Add a public marketing/landing page at "/" that introduces the product and
routes visitors to login or a request-access form. The landing page uses the
same "Editorial Tech" design system (Section 5) and the same architecture
layers. It must be honest: this is a prototype, so show NO fake testimonials,
NO fake customer logos, and NO invented metrics. Any numbers shown come from
the demo seed data and are labelled as demo.

DESIGN OVERRIDES
- Border radius is max 2px EVERYWHERE, including tab switchers. Remove the
  earlier "pill shapes for tabs" exception. Tabs are rectangular, bordered
  segments.
- No shadows anywhere, including the submit button. Use 1px borders and the
  primary fill only.
- Brand wordmark is "FAVOURITE STUDENT LIST" (Playfair, 20px) flanked by two
  short horizontal bars (24px and 32px). Never use any other brand name.
- No external or stock photos. Visuals are built from CSS/React (bordered mock
  UI panels), so the page loads fast and works offline.
- The #B4B4B4 italic emphasis is decorative only, used on large display words
  whose absence does not change the meaning of the sentence.
- Respect prefers-reduced-motion on every animation below.

ROUTES AND ARCHITECTURE ADDITIONS
- Route "/" -> Landing (public). Logged-in visitors may view it; the nav
  shows "Open dashboard" (role-aware link) instead of "Log in".
- "/login" remains the login page, with a "Back to home" link.
- Nav anchors: #how-it-works, #roles, #request-access (smooth scroll with
  header offset; respect reduced motion).
- Folders to add:
  pages/public/Landing.jsx
  components/landing/PublicNav, Hero, StatsGrid, WorkflowSteps,
    WorkflowPreview, UseCaseTabs, RequestAccessForm, LandingFooter
  components/ui/WordReveal (already in Phase 1), ScanLoader (already in Phase 1)
  hooks/useScrollProgress, useInView, useActiveSection
  services/accessRequestService (+ landingService for demo stat counts)
  data/landingContent (all copy, steps, tab content, benefits) and
  data/mockAccessRequests (3 sample requests)
- PublicLayout wraps Landing, Login, ForgotPassword and error pages and
  renders PublicNav (anchor links shown on Landing only) and LandingFooter.
- Below-the-fold sections (workflow, tabs, form, footer) are lazy-loaded.
- All copy lives in data/landingContent. Components never hard-code copy.
- New data model: AccessRequest = id, name, email (Gmail), role
  (teacher | student), message (optional), status (new | contacted), createdAt.

LANDING SECTIONS (in order)

1. Header navigation (PublicNav)
   - Starts 32px from the top, transparent. After scrolling, it becomes a
     fixed bar with a bottom 1px border, #f7f6f2/80 background and backdrop
     blur (dark equivalent in dark mode).
   - Left: wordmark with the two bars. Centre/right: links "How it works",
     "Roles", "Request access" in 10-11px Space Mono uppercase, tracking 0.3em,
     with an active-section indicator. Right: theme toggle and a primary CTA
     ("Log in", or "Open dashboard" when authenticated).
   - Under 768px: collapses to a menu button opening a bordered drawer with
     focus trap and Esc to close.

2. Hero
   - Centre-aligned. Pulse-dot badge in mono: "PROTOTYPE / SIMULATED LOGIN".
   - H1 in Playfair, light weight, uppercase, tight tracking, sized with
     clamp(2.75rem, 9vw, 9rem), line-height ~0.95, max 3 lines:
     "Know your class. *Keep* your favourites." where *Keep* is italic and
     #B4B4B4 (light theme) with an adjusted muted tone in dark theme.
   - One supporting sentence in Space Grotesk (max-w-xl): "An invite-only
     student directory. Teachers add students by Gmail and keep a private list
     of favourites. Students see only their own profile."
   - CTAs: primary "Log in" (Animated CTA, fixed width, tracking 0.2em -> 0.4em
     on hover without layout shift) and outline "Request access" (anchors to
     the form). Small mono link beneath: "View demo credentials" opening a
     bordered modal with the demo logins.

3. Statistics grid (StatsGrid)
   - 3-column grid, 1px #e5e4de dividers, no gaps. Each cell: 40px padding,
     48px bordered icon box, large Playfair number (4xl), mono uppercase label;
     turns white on hover.
   - Values read from the seed data through landingService: demo students
     count, departments count, roles count (2). Labels: "DEMO STUDENTS",
     "DEPARTMENTS", "ROLES, STRICTLY SEPARATED". Numbers count up once on first
     view (skip under reduced motion). Add a mono caption "Figures from demo
     data."
   - Under 768px: stack to 1 column with horizontal dividers.

4. Text reveal statement
   - A large Playfair paragraph (text-3xl to text-6xl) using WordReveal: each
     word moves from opacity 0.15 to 1 as the section scrolls through the
     viewport. Copy: "Students never see each other. Favourites stay with
     the teacher. Every account begins with an invitation, so the right people
     get in and nobody else does."
   - Reduced motion: render at full opacity.

5. Interactive workflow ("How it works", id="how-it-works")
   - Two columns (stacked on mobile). Left: vertical steps 01 / 02 / 03 in
     Space Mono. Clicking a step expands its description and reduces inactive
     steps to opacity 0.4. Steps:
     01 "Teacher adds a student": enter the student's Gmail, class and
        department.
     02 "Student accepts the invite": the student logs in with the temporary
        password and sets their own.
     03 "Teacher keeps favourites": favourite, filter and manage the class
        from one dashboard.
   - Right: a sticky bordered card (sticky below the header) containing
     WorkflowPreview, a CSS-built mock UI that changes per step (a mini
     add-student form, a mini invitation email, a mini favourites list with a
     filled heart). No photos.
   - Under the card, a 2px scan-line progress bar (primary colour,
     optional #3b82f6) that fills in time with an auto-advance of ~6s per step.
     Auto-advance pauses on hover/focus and is off under reduced motion.
   - Accessibility: steps are buttons with aria-expanded; the preview is an
     aria-live="polite" region.

6. Use-case tabs ("Roles", id="roles")
   - Centred tablist with two rectangular bordered tabs: "For teachers" and
     "For students" (role="tablist", arrow-key navigation, aria-selected).
   - Below, a large bordered card (#f7f6f2) with a massive 240px ghost icon at
     5% opacity in the background and a 3-column benefit grid at the bottom:
     Teachers: "Invite by Gmail" / "Private favourites" / "Status at a glance".
     Students: "Only your own profile" / "Secure first login" /
     "Announcements from your teacher".
   - Each benefit: mono uppercase title + one Space Grotesk sentence.
   - Under 768px the grid becomes 1 column.

7. Request access ("id=request-access")
   - Two-column grid. Left: huge Playfair heading "Request Access" and a mono
     note: "Invite-only. A teacher must add you before you can log in."
   - Right: form with bottom-bordered inputs (#e5e4de, primary on focus), 10-11px
     mono labels/placeholders: Full name, Gmail address, I am a (Teacher /
     Student), Message (optional).
   - React Hook Form + Zod: required name, valid Gmail format, role required.
     Inline mono error text.
   - Submit: full-width primary button, 0.4em letter-spacing, fixed width, NO
     shadow. On submit show ScanLoader, then a success state: Playfair
     "Request received", mono reference ID, and a "Send another" link.
   - accessRequestService saves the request to localStorage (simulated).
   - Teacher side: add an "Access requests" tab on the Invitations page
     listing these requests with status badges, "Mark contacted", and, for
     student-role requests, "Add as student" which opens the Add Student form
     pre-filled with the name and Gmail.
   - README must note that a public form writing to localStorage only
     demonstrates the flow; a real version posts to a server.

8. Footer (LandingFooter)
   - 1px top border, wordmark, mono links (How it works, Roles, Request
     access, Log in), theme toggle, and the line "Prototype: authentication
     and emails are simulated."

SEO, PERFORMANCE AND QUALITY
- One H1 only, logical heading order, document title and meta description,
  Open Graph title/description tags, skip-to-content link.
- Fonts preloaded with display=swap; no layout shift when fonts load.
- No horizontal scroll from 360px up; the background grid reduces on mobile as
  already specified.
- Both themes fully designed for every landing section (dark mode keeps the
  same borders, grid and muted status tones).

PHASE CHANGES
- Phase 1 additionally builds the landing-specific UI helpers
  (useInView, useScrollProgress) and previews them on the design preview page.
- Insert a NEW "Phase 3.5: Landing page" after Phase 3 (auth, guards,
  layouts). It builds PublicNav, all eight sections, landingContent,
  landingService, accessRequestService and the footer, wires "/" in the route
  config, and verifies both themes and mobile.
- Phase 7 additionally adds the "Access requests" tab on the Invitations
  page and the "Add as student" prefill.
- Phase 9 tests additionally cover: request-access form validation, the
  accessRequestService, the use-case tab keyboard navigation, and WordReveal
  under reduced motion.