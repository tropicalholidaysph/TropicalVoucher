# Tropical Holidays - Secure Ledger

Professional internal voucher management and financial ledger system for Tropical Holidays. This application streamlines the payment voucher workflow with real-time synchronization and secure multi-role access.

## System Overview

The Tropical Holidays Secure Ledger is designed for high-efficiency financial tracking. It allows staff to manage payment vouchers across different ledger sheets with automated processing and robust security.

### Core Features
- **Voucher Management:** Create, view, edit, and search payment vouchers with automated sequential numbering.
- **Multi-Ledger Sheets:** Organize vouchers into separate tabs powered by Firebase Firestore.
- **Excel Integration:** Support for bulk importing from and exporting to formatted Excel workbooks.
- **Automated Processing:** Real-time conversion of numerical amounts to professional text representations.
- **Modern UI:** Responsive, high-performance interface with dark mode support.

## Access Control

The system uses a two-tiered role-based access control (RBAC) model:

- **Admin:** Full system access, including ledger management (creating/renaming/deleting sheets), data imports, and record deletion.
- **Employee:** Operational access to create, view, edit, and export data. Restricted from administrative and destructive actions.

## Deployment

### Vercel + Supabase (Recommended)

1. **Supabase Setup:**
   - Create a new project on [Supabase](https://supabase.com).
   - Run the initial schema SQL (found in your Supabase dashboard or provided SQL files).
   - Enable **Anonymous Sign-ins** in Authentication > Providers.
   - Create the necessary tables: `vouchers`, `ledgers`, `user_roles`, and `activity_logs`.

2. **Vercel Deployment:**
   - Import your GitHub repository to [Vercel](https://vercel.com).
   - Add the following environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `NEXT_PUBLIC_ADMIN_KEY`
     - `NEXT_PUBLIC_EMPLOYEE_KEY`
   - Deploy.

### Local Development

1. **Clone and Install:**
   ```bash
   git clone <repo-url>
   npm install
   ```

2. **Environment Variables:**
   - Copy `.env.example` to `.env.local` and fill in your Supabase credentials.

3. **Run:**
   ```bash
   npm run dev
   ```

---
© 2026 Tropical Holidays. Confidential and Proprietary.
