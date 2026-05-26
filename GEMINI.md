# Akrabiolab Project Instructions

## Running the Project

To run the project, you need to start both the backend and the frontend.

### 1. Backend (Django)
Open a terminal in the `backend` folder:
```bash
python manage.py runserver 0.0.0.0:8000
```

### 2. Frontend (Next.js)
Open another terminal in the `frontend` folder:
```bash
npm run dev
```

## Dashboard & Public UI
- **Emerald Green & Vibrant Orange:** Light professional theme for the dashboard; Luxurious cinematic theme for the public site.
- **Luxe Interface:** Large product cards, smooth cinematic transitions, and high-end typography.
- **Premium Navigation:** Custom smooth-scroll with cinematic delay for a high-end user experience.

## Financial Logic & Security
- **Strict Debt Tracking:** Debt is **only** added to a client's balance when an order status is changed to `DELIVERED`.
- **Safe Deletion:** Deleting a `PENDING` order has no impact on finances. Deleting a `DELIVERED` order triggers a mandatory warning and automatically subtracts the amount from the client's total debt to maintain perfect accounting integrity.
- **Smart Warnings:** The dashboard now distinguishes between these two states, showing financial alerts only when relevant.

## Inventory & Stock
- **Finished Goods Tracking:** Full stock management for both Raw Materials and Finished Products (Liters, Kilograms, or Units).
- **Precision:** Quantity field uses `FloatField` for decimal measurements (e.g., 5.5L).
- **Smart Inputs:** Numeric fields automatically select content on focus.

## Features
- **Professional PDFs:** Invoices and BLs include the laboratory logo, detailed client info, and total amounts written in French words.
- **Auto-Description:** Marketing text is automatically generated for new products.
- **Local Photo Uploads:** Supported for adding/editing products.

## Technology Stack
- **Backend:** Django 6, DRF, Pillow, ReportLab, num2words.
- **Frontend:** Next.js 16 (Turbopack), React 19, Framer Motion, TailwindCSS 4.
