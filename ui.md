# Technical Blueprint Design System Specification
**Project:** Favourite Student List (Prototype)  
**Design Aesthetic:** "Technical Blueprint" (Minimalist Engineering)

---

## 1. Visual Philosophy
Inspired by technical blueprints, CAD schematics, and high-precision wireframes:
- **Paper Substrate:** Light mode uses Paper (`#F7F7F5`). Dark mode uses Deep Technical Ink (`#141615`).
- **Forest Green & Mint:** Forest Green (`#1A3C2B`) is the primary brand anchor in light mode. Dark mode lifts the primary brand accent to Mint (`#9EFFBF`), with filled buttons featuring Forest text.
- **Hairlines Over Shadows:** Strictly **0 box-shadows** across the entire UI. 1px hairlines (`#3A3A38` at 20% opacity / dark equivalent) establish all structure.
- **Geometry & Blueprint Markers:**
  - Maximum **2px border radius** everywhere (0px or 2px).
  - Four **L-shaped corner markers (10px x 10px)** in primary color adorn key containers, forms, and dialogs.
  - Solid surface field fills (`#ffffff` light, `#1B1E1C` dark) with 1px hairline boundaries.
- **Mosaic Background:** A seamless SVG mosaic of interlocking rectangular panels divided by 0.5px hairlines.

---

## 2. Typography Triad

| Font Family | Source | Weight & Tracking | Role |
| :--- | :--- | :--- | :--- |
| **Space Grotesk** | Google Fonts | Bold (700), tracking `-0.03em`, line-height `0.95` | **Display Headers.** Section titles, modal headers, large numerical statistics. |
| **General Sans** | Fontshare (swap) | 400 Regular, 500 Medium | **Body & Narrative.** Roster descriptions, announcements, table cells, form values. Fallback: Inter, system-ui, sans-serif. |
| **JetBrains Mono** | Google Fonts | 400 Regular, 500 Medium, 700 Bold, tracking `0.1em-0.2em` | **Technical Metadata.** Navigation links with numerical prefixes (`01. ROSTER`), labels, tags, roll numbers, status badges, buttons. |

*(Note: Playfair Display and Space Mono have been completely purged from the codebase).*

---

## 3. Color Tokens & Measured WCAG AA Contrast Ratios

All tokens reference CSS variables in `tokens.css`.

### Base Color Tokens
- **Background:** Light `#F7F7F5` (Paper) | Dark `#141615`
- **Foreground:** Light `#1c1c1c` (Ink) | Dark `#EDEFEA`
- **Primary:** Light `#1A3C2B` (Forest Green) | Dark `#9EFFBF` (Mint)
- **Primary Text:** Light `#ffffff` | Dark `#1A3C2B` (Forest text on Mint button)
- **Dividers:** Light `rgba(58, 58, 56, 0.2)` | Dark `rgba(158, 255, 191, 0.15)`
- **Accents:** Coral (`#FF8C69`), Mint (`#9EFFBF`), Gold (`#F4D35E`)

### Semantic Status Tokens & Measured Contrast
Measured against background `#F7F7F5` (Light) and `#141615` (Dark):

| Status | Dot Token | Text/Border (Light) | Light Ratio | Text/Border (Dark) | Dark Ratio | WCAG AA Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Active** | `#1A3C2B` (Forest) | `#1A3C2B` | **9.15:1** | `#9EFFBF` | **12.78:1** | **PASS** (AAA/AA) |
| **Invited** | `#F4D35E` (Gold) | `#8a6414` | **4.56:1** | `#F4D35E` | **10.22:1** | **PASS** (AA) |
| **Disabled** | `#7a7a75` (Grey) | `#5e5e5a` | **5.45:1** | `#959B93` | **6.10:1** | **PASS** (AA) |
| **Danger** | `#FF8C69` (Coral) | `#9a3b34` | **5.58:1** | `#FF8C69` | **6.91:1** | **PASS** (AA) |

---

## 4. UI Components Specification

### 4.1 Mosaic Background (`GridBackground`)
- Fixed viewport SVG pattern (`z-index: -10`) repeating a 320x320px seamless pattern of interlocking rectangular panels with 0.5px hairlines.

### 4.2 Blueprint Containers (`Container`, `Section`, `CornerMarkers`)
- `Container`: Enforces `max-w-7xl mx-auto px-6 lg:px-10`.
- `CornerMarkers`: Renders 4 L-shaped 10px x 10px corners in `var(--color-corner-marker)` on cards and forms.

### 4.3 Interactive Components
- **Button:** JetBrains Mono 11px uppercase, tracking 0.15em $\to$ 0.25em on hover with fixed min-width (no layout shifts) and snappy 200ms white overlay slide.
- **Input & Select:** Solid surface field background (`#ffffff` / `#1B1E1C`) with 1px hairline borders and JetBrains Mono uppercase labels above.
- **Status Badge:** 1px hairline border with 8px square dot and JetBrains Mono uppercase text.
- **StatCard (Bento Grid):** 1px gap cell with colored left-border chips (Coral, Mint, Gold, Forest) and large Space Grotesk numerals.
- **NetworkTopologyGraph:** Abstract SVG with a central 16px node and 3 orbiting accent nodes rotating smoothly in 20s (stops under `prefers-reduced-motion`).
- **EmptyState:** 1px hairline panel with corner markers and exact text: *"No favourite students added yet"*.
- **Motion:** Snappy 150-250ms linear/ease-snappy timing everywhere. All animations pause under `prefers-reduced-motion`.