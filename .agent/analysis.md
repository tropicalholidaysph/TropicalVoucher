# Supabase Migration Analysis

## Firebase Source Logic
The current system uses Firebase Firestore for data persistence and role-based access control.

### Key Components:
- **Firestore Collections**: `vouchers`, `ledgers`, `user_roles`, `activity_logs`.
- **Sequential Numbering**: Currently handled client-side in `voucher-actions.ts` by fetching existing vouchers and calculating `max + 1`.
- **RBAC**: Handled via a `user_roles` collection and client-side checks in `voucher-actions.ts`.

## Supabase Requirements
To transition to Supabase, the following changes are required:

### Dependencies:
```bash
npm install @supabase/supabase-js
```

### Infrastructure Changes:
1. **Client Initialization**: Create `src/lib/supabase.ts` to initialize the Supabase client using environment variables.
2. **Database Schema**: Transition from NoSQL collections to relational tables with proper foreign key constraints.
3. **Sequential IDs**: Implement PostgreSQL sequences for `voucher_no` to ensure atomicity and prevent race conditions.
4. **Security**: Implement Row Level Security (RLS) policies in Supabase to replace Firestore security rules.

### Action Plan:
1. Initialize the database schema using the provided SQL migration.
2. Update `.env` with actual Supabase credentials.
3. Replace Firebase imports and logic in `src/lib/voucher-actions.ts` with Supabase calls.
