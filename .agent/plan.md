# Feature Plan: Supabase Voucher System

## Objective
Transition the Tropical Holidays Secure Ledger from Firebase to Supabase for data persistence and multi-role access management.

## Current State
- **Logic**: Firebase Firestore for voucher storage.
- **Data Model**: `Voucher` and `Ledger` types defined in `src/lib/types.ts`.
- **UI**: Dashboard and voucher entry forms are functional but wired to Firebase.

## Proposed Changes
1. **Infrastructure**: Initialize Supabase client and environment.
2. **Database Schema**:
   - `employees` table: `id`, `email`, `role` (admin/employee).
   - `vouchers` table: Matching the `Voucher` interface in `src/lib/types.ts`.
3. **Authentication**: Implement Supabase Auth for secure login.
4. **Data Sync**: Rewrite `voucher-actions.ts` to use Supabase instead of Firestore.
5. **UI Polish**: Ensure all forms and tables correctly display data from Supabase.

## Tasks
- [ ] Initialize Supabase environment variables.
- [ ] Install `@supabase/supabase-js`.
- [ ] Create PostgreSQL migration for `vouchers` and `employees`.
- [ ] Implement `src/lib/supabase.ts` client.
- [ ] Migrate authentication logic.
- [ ] Migrate CRUD operations in `voucher-actions.ts`.
- [ ] Final verification and performance check.
