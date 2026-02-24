# Loan Eligibility Simulator

## Overview

This project is a Loan Eligibility Simulator built as a production-grade frontend application.

It allows users to:

- Select a loan product
- Enter personal and financial details
- Validate eligibility dynamically
- View risk categorization
- Review recommended loan details
- See affordability analysis with numeric guidance

The application simulates realistic financial decision logic using a mocked API layer.

The focus of this implementation is:

- Clean architecture
- Strong TypeScript domain modeling
- Product-driven validation
- Transparent financial decisioning
- Production-ready packaging using Docker

## Tech Stack

- React (Vite)
- TypeScript
- React Hook Form
- Zod (schema validation)
- MSW (Mock Service Worker) – simulated backend
- Tailwind CSS
- Docker (multi-stage build + nginx)

## Key Features

### 1. Product-Driven Validation

Validation rules are dynamically built using:

- Global validation rules (fetched from API)
- Selected loan product constraints

The effective validation range is computed as:

```
effectiveMin = max(globalMin, productMin)
effectiveMax = min(globalMax, productMax)
```

This ensures accurate, product-specific financial constraints.

### 2. Dynamic Eligibility Logic

Eligibility is calculated based on:

- Disposable income
- Debt-to-income ratio
- Employment status
- Requested loan amount

The simulator returns:

- Eligibility status
- Risk category (low / medium / high)
- Approval likelihood
- Numeric improvement suggestions
- Recommended loan breakdown
- Affordability analysis

### 3. Transparent Financial Feedback

If a user is not eligible, the system provides:

- Numeric explanation (e.g., DTI percentage)
- Disposable income analysis
- Actionable improvement suggestions

This ensures the system behaves like a financial advisory tool rather than a simple validator.

### 4. Clean Architecture

The project follows a feature-based structure:

```
features/
  loan/
    components/
    hooks/
    domain/
    validation/
    mocks/
```

Separation of concerns:

- UI components handle rendering
- Hooks manage data fetching and mutations
- Domain types define strict contracts
- Validation schema is dynamically constructed
- MSW simulates a backend layer

## Running the Application Locally

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

Open: http://localhost:5173

## Running with Docker

### Build Docker image

```bash
docker build -t loan-simulator .
```

### Run container

```bash
docker run -p 3000:80 loan-simulator
```

Open: http://localhost:3000

The app will run using an optimized production build served via nginx.

## Docker Implementation

The project uses a multi-stage Docker build:

- **Builder stage**: Installs dependencies, builds optimized production bundle
- **Nginx stage**: Serves static files, lightweight Alpine-based image

This ensures a small, production-ready container image.
