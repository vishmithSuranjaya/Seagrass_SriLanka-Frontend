# Seagrass Sri Lanka – Frontend

Seagrass Sri Lanka is a React + Vite frontend for a conservation-focused web platform. It provides public content (news, blogs, products, gallery), a shopping cart with PayHere payments, user dashboards, and an admin portal for managing news, products, blogs, media, and users.

This README covers setup, features, routes, tech stack, scripts, environment and integration notes.

**Live backend currently referenced in code:** `https://seagrass-backend-d6fuesa6gpe8fnan.centralus-01.azurewebsites.net`


**Screenshots**


| | |
|---|---|
| [![](screenshots/Screenshot%20%2869%29.png)](screenshots/Screenshot%20%2869%29.png) | [![](screenshots/Screenshot%20%2870%29.png)](screenshots/Screenshot%20%2870%29.png) |
| [![](screenshots/Screenshot%20%2871%29.png)](screenshots/Screenshot%20%2871%29.png) | [![](screenshots/Screenshot%20%2872%29.png)](screenshots/Screenshot%20%2872%29.png) |
| [![](screenshots/Screenshot%20%2873%29.png)](screenshots/Screenshot%20%2873%29.png) | [![](screenshots/Screenshot%20%2874%29.png)](screenshots/Screenshot%20%2874%29.png) |
| [![](screenshots/Screenshot%20%2875%29.png)](screenshots/Screenshot%20%2875%29.png) | [![](screenshots/Screenshot%20%2876%29.png)](screenshots/Screenshot%20%2876%29.png) |
| [![](screenshots/Screenshot%20%2877%29.png)](screenshots/Screenshot%20%2877%29.png) | [![](screenshots/Screenshot%20%2878%29.png)](screenshots/Screenshot%20%2878%29.png) |
| [![](screenshots/Screenshot%20%2879%29.png)](screenshots/Screenshot%20%2879%29.png) | [![](screenshots/Screenshot%20%2880%29.png)](screenshots/Screenshot%20%2880%29.png) |

**Features**
- **Public pages:** Home, News with filters, Blogs with search + pagination, Gallery, Courses, Products, About, Seagrass Identify, Game Zone.
- **Blog details:** Full view with likes and comments UI.
- **News details:** Full view from list or calendar.
- **Calendar:** Event calendar linked to news items.
- **E‑commerce:** Product listing, product detail view, cart with quantity updates, checkout form.
- **Payments:** PayHere sandbox checkout integrated via backend session creation and payment recording.
- **Auth:** Email/password login, registration, forgot password; JWT tokens stored in `localStorage`.
- **User dashboard:** Orders history, personal blogs section, settings, profile layout with sidebar.
- **Admin portal:** Dashboard, News, Orders, Products, Research Articles, Users, Blogs, Gallery, Settings (protected; staff only).
- **UI/UX:** Tailwind CSS, dark mode toggle (persists), Framer Motion animations, responsive navbar with modals.


**Tech Stack**
- **Runtime/build:** `Vite 6`, `Node >= 20`
- **Framework:** `React 19`, `react-router-dom 7`
- **Styling:** `tailwindcss 4` (via `@tailwindcss/vite`), optional `bootstrap`/`react-bootstrap`
- **Data/HTTP:** `axios`, native `fetch`
- **UI/UX libs:** `framer-motion`, `lucide-react`, `react-icons`, `react-toastify`, `react-loading-skeleton`
- **Calendar:** `react-big-calendar` (+ `moment` localizer)
- **Linting:** `eslint` with React hooks + refresh plugins


**Quick Start**
- **Prereqs:** `Node 20+` and `npm`

```powershell
# Install dependencies
npm install

# Start dev server (Vite)
npm run dev

# Lint
npm run lint

# Production build
npm run build

# Preview built app
npm run preview
```

Vite serves on a dynamic local port by default. The app expects the backend to be reachable from the browser for API requests.


**Project Structure**
- `src/main.jsx`: App bootstrap
- `src/App.jsx`: Routing, theme, layout
- `src/Pages/*`: Top-level pages (Home, News, Blog, Products, etc.)
- `src/components/*`: Reusable UI and feature modules (Navbar, Footer, Auth, Calendar, Payments, etc.)
- `public/*`: Static assets and route helpers
- `vite.config.js`: Vite + Tailwind plugin config
- `eslint.config.js`: ESLint settings

Selected directories:
- `components/Login_Register/`: `AuthContext`, `LoginForm`, `RegisterForm`, `ProtectedRoute`, `ForgotPassword`
- `components/Payment/`: `CheckoutForm`, `PayButton`
- `components/userProfile/`: `DashboardLayout`, `Sidebar`, `Orders`, `BlogsPage`, `UserHome`, `UserSettings`
- `components/calender/`: `Calender`, `NewsDetailView`
- `components/blogs_Homepage/` and `components/news_homepage/`: home widgets


**Routing**
Top-level routes (`src/App.jsx`):
- `/`: Home
- `/news`: News listing + filters
- `/reports`: Reports
- `/blog`: Blogs listing + search + pagination
- `/gallery`: Gallery
- `/courses`: Courses
- `/product`: Products listing
- `/about`: About
- `/identify seagrass`: Seagrass Identify
- `/productfulldetails/:product_id`: Product details
- `/blogFullView/:id`: Blog details
- `/viewFullNews`: News details (via navigation state)
- `/calender`: Calendar view
- `/newsdetails/:news_id`: Calendar -> News details
- `/cart`: Cart
- `/game zone`: Game Zone
- `/checkout`: Checkout form

Protected user area:
- `/user/*` guarded by `ProtectedRoute`
	- `/user/dashboard` (layout)
	- `/user/blogs`
	- `/user/settings`
	- `/user` (home)
	- `/user/orders`

Protected admin area (requires `user.is_staff`):
- `/admin/*` guarded by `ProtectedRoute adminOnly`
	- `/admin/adminDashboard`
	- `/admin/adminnews`
	- `/admin/adminorders`
	- `/admin/adminProducts`
	- `/admin/adminResearch`
	- `/admin/adminusers`
	- `/admin/adminblogs`
	- `/admin/admingallery`
	- `/admin/adminsettings`


**Authentication**
- Login posts to `/api/auth/token/` and stores `access_token` and `refresh_token` in `localStorage`.
- Logged-in user profile fetched from `/api/auth/profile/` and stored via `AuthContext`.
- Logout clears tokens and user state.
- Forgot password posts to `/api/auth/forgot-password/`.
- `ProtectedRoute` redirects unauthenticated users to `/` and enforces `is_staff` for admin routes.


**Data Flows & APIs**
- The code references a live Azure backend for most features:
	- Products: `/api/products/list/`, product images (prefix with backend URL), product details, cart CRUD and totals, orders fetch
	- Blogs: `/api/blogs/`, `/api/blogs/post/` (multipart form), `/api/blogs/:id/`
	- News: `/api/news/`, `/api/news/:news_id/`
	- Payments (via backend-managed PayHere):
		- Create: `/api/products/payment/create_payment/`
		- Save: `/api/products/payment/save_payment/`
- Calendar uses a local endpoint in `Calender.jsx`:
	- `http://127.0.0.1:8000/api/news/api/calendar/events/` (adjust if using remote backend)


**Payments (PayHere)**
- The PayHere sandbox SDK is loaded in `index.html` and again dynamically in `PayButton.jsx`.
- Payment flow:
	1. Frontend sends `items`, `total_amount`, and `checkoutData` to backend `/create_payment/`.
	2. Backend returns PayHere payment payload.
	3. Frontend calls `window.payhere.startPayment(payload)`.
	4. On success, frontend posts to `/save_payment/` to record order + payment.
- Note: `index.html` currently includes both live and sandbox scripts; use only one for the target environment.


**Environment & Configuration**
- No `.env` is used today; API URLs are hardcoded in components.
- To switch environments, search for hardcoded URLs and update to your backend base URL. Typical places:
	- `src/Pages/Products.jsx`, `CartPage.jsx`, `Orders.jsx`
	- `src/Pages/Blog.jsx`, `BlogFullView.jsx`
	- `src/Pages/News.jsx`, `ViewNews.jsx`, `components/news_homepage/NewsHomepage.jsx`
	- `components/Login_Register/*`
	- `components/Payment/*`
	- `components/calender/Calender.jsx` (uses localhost)
- Optional enhancement: introduce `VITE_API_BASE_URL` and centralize an axios instance for consistency.


**Development Notes**
- Dark mode: persisted via `localStorage('theme')` and toggles the `dark` class on `html`.
- Styles: Tailwind 4 via `@tailwindcss/vite` plugin; `src/index.css` imports Tailwind and overrides theme colors in dark mode.
- Linting: `npm run lint` with ESLint (React hooks rules, refresh rules) and ignores `dist/`.


**Troubleshooting**
- PayHere SDK not loaded: ensure only one script tag is included (sandbox vs live) and that the domain is allowed in PayHere settings.
- 401s on protected endpoints: confirm `access_token` in `localStorage` and `Authorization: Bearer <token>` being sent.
- Mixed backend URLs: align calendar endpoint with the rest of the backend or parameterize via env.
- CORS errors: configure CORS on the backend for your dev origin (e.g., `http://localhost:*`).


**Contributing**
- Use feature branches and conventional commits where possible.
- Keep changes focused; avoid unrelated refactors in the same PR.
- Run `npm run lint` before pushing.


**License**
- Licensed under the Apache License 2.0. See `LICENSE` for details.


**Credits**
- Built with React, Vite, and Tailwind by the pasan ramyanath's team.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
