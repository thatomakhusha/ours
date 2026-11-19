-- ============================================
-- Ours: Application Role Permissions
-- Application role: ours_user
-- Database: ours
-- ============================================


-- 1. Schema access

GRANT USAGE ON SCHEMA public TO ours_user;

REVOKE CREATE ON SCHEMA public FROM ours_user;


-- 2. Remove existing table-level permissions

REVOKE ALL PRIVILEGES
ON TABLE public.users
FROM ours_user;

REVOKE ALL PRIVILEGES
ON TABLE public.tasks, public.notes
FROM ours_user;

REVOKE ALL PRIVILEGES
ON TABLE public.user_account_control
FROM ours_user;


-- 3. User table permissions

GRANT SELECT
ON TABLE public.users
TO ours_user;

REVOKE INSERT (
    user_id,
    first_name,
    display_name,
    email,
    password_hash,
    must_change_password,
    password_changed_at,
    created_at
)
ON TABLE public.users
FROM ours_user;

REVOKE UPDATE (
    user_id,
    first_name,
    display_name,
    email,
    password_hash,
    must_change_password,
    password_changed_at,
    created_at
)
ON TABLE public.users
FROM ours_user;

GRANT INSERT (
    first_name,
    display_name,
    email,
    password_hash,
    must_change_password,
    password_changed_at
)
ON TABLE public.users
TO ours_user;

GRANT UPDATE (
    display_name,
    password_hash,
    must_change_password,
    password_changed_at
)
ON TABLE public.users
TO ours_user;


-- 4. Task and Note permissions

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.tasks, public.notes
TO ours_user;


-- 5. User account control permissions

GRANT SELECT
ON TABLE public.user_account_control
TO ours_user;


-- 6. Identity sequence permissions

GRANT USAGE, SELECT
ON SEQUENCE
    public.users_user_id_seq,
    public.tasks_task_id_seq,
    public.notes_note_id_seq
TO ours_user;