# Copilot Instructions for Personal Finance Tracker

## Project Overview
- **Frontend:** React (functional components, hooks), Tailwind CSS, Vite
- **Backend:** Java/Spring Boot (external, not in repo)
- **Data:** Transactions and categories, with user separation via `X-Client-Id` header
- **API:** All data is fetched and mutated via REST endpoints (see `src/utils/api.js`)

## Architecture & Data Flow
- Main entry: `src/main.jsx` renders `App.jsx`
- Routing: React Router (`BrowserRouter`, `Routes`, `Route` in `App.jsx`)
- State: Managed in `App.jsx` (transactions, categories, errors, filters)
- Data fetch/update: Use functions from `src/utils/api.js` (e.g., `fetchTransactions`, `addTransaction`)

- Environment config: API base URL is set in `src/utils/config.js` and can be overridden via `.env` (`VITE_API_BASE_URL`)

## Developer Workflows
- **Install dependencies:** `npm install`
- **Run dev server:** `npm run dev` (Vite)
- **Build for production:** `npm run build`
- **Preview production build:** `npm run preview`
- **Environment override:** Create `.env` in project root to set API base URL
- **No test scripts or test files present**

## UI & Styling
- Tailwind CSS is used for all styling (`index.css`, `tailwind.config.cjs`)
- Dark mode: Managed via `useDarkMode` hook and toggled in UI (`ThemeToggle.jsx`)
- Reusable UI components: `src/components/UI/` (Button, Card, Input)

## Patterns & Conventions
- **Transactions:** Each transaction has `id`, `title`, `amount`, `date`, `category`, `type` (`income`/`expense`), and optional `tags`
- **Categories:** Managed via API, can be added/edited/deleted; deletion checks for linked transactions
- **CSV Export:** Use `toCSV` and `downloadCSV` from `src/utils/csv.js` (see `Transactions.jsx`)
- **Component structure:** Organized by feature (Transactions, Transaction, Categories, UI)
- **Error handling:** Minimal, mostly sets error state and displays messages in UI
- **Filtering:** Transactions can be filtered by year, category, and type in `Transactions.jsx`

## Integration Points
- **Backend endpoints:**
  - `/api/transactions` (CRUD)
  - `/api/categories` (CRUD)
  
- **External libraries:**
  - `react-router-dom` for routing
  - `recharts` for charts
  - `papaparse` (declared, not used in code)

## Key Files & Directories
- `src/App.jsx`: Main app logic, state, routing
- `src/utils/api.js`: All API communication
- `src/utils/config.js`: API base URL logic
- `src/components/Transactions/Transactions.jsx`: Main transaction list, filtering, CSV export
- `src/components/Transaction/TransactionForm.jsx`: Form logic and validation
- `src/components/Categories/CategoriesPage.jsx`: Category management
- `src/hooks/useDarkMode.js`: Dark mode state
- `src/components/UI/`: Reusable UI components

## Example: Adding a Transaction
- Use `addTransaction` from `api.js` to POST to backend
- Update state in `App.jsx` to include new transaction
- UI form: `TransactionForm.jsx` (validates fields, calls `onSubmit`)

## Example: Filtering Transactions
- In `Transactions.jsx`, filter by year, category, and type using local state and `useMemo`

---
**For AI agents:**
- Always use API helpers in `src/utils/api.js` for backend communication
- Respect user separation by including `X-Client-Id` in requests
- Follow existing component and file organization
- Use Tailwind classes for styling
- Do not add test files unless a test framework is introduced
