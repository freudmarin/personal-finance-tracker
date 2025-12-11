
# Personal Finance Tracker

A modern finance tracker app built with React, Tailwind CSS, Vite, and a Java/Spring Boot backend.

## Features
- Authentication and authorization
- Add, edit, delete transactions (supports both incomes and expenses)
- Dual monthly charts for incomes and expenses
- CSV export
- Responsive UI with dark mode
- Category management (add, edit, delete categories)
- Backend integration (Java/Spring Boot)
- Environment-aware API configuration

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn

### Installation
```bash
npm install
```

### Running Locally (Frontend)
```bash
npm run dev
```

### Backend
- The backend is a Java/Spring Boot app with endpoints:
	- `GET /api/transactions`
	- `POST /api/transactions`
	- `GET /api/transactions/{id}`
	- `PUT /api/transactions/{id}`
	- `DELETE /api/transactions/{id}`
	- `GET /api/categories`
	- `POST /api/categories`
	- `PUT /api/categories/{id}`
	- `DELETE /api/categories/{id}`
- Deployed backend: `https://expense-tracker-be-tocc.onrender.com/`

