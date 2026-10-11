# Favourite Student List — Technical Blueprint Prototype

A high-fidelity prototype and management system built with an editorial **Technical Blueprint** aesthetic inspired by architectural wireframes and precision technical interfaces.

---

## 📐 Design Philosophy & System Architecture

- **Visual Theme**: Technical Blueprint / Architectural Wireframe
  - **Substrate**: Paper background (`#F7F7F5`) in Light Mode, Technical Ink (`#141615`) in Dark Mode.
  - **Brand Primary**: Prestige Forest Green (`#1A3C2B`) in Light Mode, Technical Mint (`#9EFFBF`) in Dark Mode.
  - **Structural Hairlines**: 1px dividers with 10px L-shaped corner markers (`CornerMarkers`).
  - **Zero Shadows / Gradients**: Flat 2D geometry, crisp borders, max 2px border radius.
  - **Typography Pairing**:
    - **Display/Headings**: Space Grotesk (8xl / 4xl / 2xl)
    - **Body & Data**: General Sans (loaded via Fontshare, `font-display: swap`)
    - **Badges, Metadata & Telemetry**: JetBrains Mono uppercase tracking
- **Role Isolation & Security**:
  - **Teacher Role**: Full CRUD student roster, private favourites bookmarking, outbox invitation dispatching with temporary passwords, telemetry dashboard with flat-fill Recharts, and immutable activity logs.
  - **Student Role**: Isolated portal view, zero access to rosters or favourites contexts, first-login password enforcement (`FirstLoginGuard`), and institutional announcements feed.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation & Execution
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run automated Vitest test suite
npm test

# Build production bundle
npm run build
```

---

## 🔑 Demo Access Credentials

The prototype initializes with seeded data in `localStorage`. You can switch between roles or reset demo data anytime in the **Activity Log** view:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Faculty Lead** | `evelyn.reed@gmail.com` | `password123` | Dr. Evelyn Reed (Computer Science) |
| **Faculty Member** | `julian.vance@gmail.com` | `password123` | Prof. Julian Vance (Mathematics) |
| **Student (Active)** | `alex.turner@gmail.com` | `password123` | Alex Turner (`CS-2026-001`) |
| **Student (First Login)** | `maya.lin@gmail.com` | `TMP-MY92-4410` | Maya Lin (Redirects to password reset) |

---

## 🧪 Verified Tests

The suite includes 8 automated tests (`npm test`):
- Teacher & Student authentication validation
- Credential mismatch rejection
- Roster seeding & retrieval
- Favourites toggle persistence
- Student disable/re-enable state management
