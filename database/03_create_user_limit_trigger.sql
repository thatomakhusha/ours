CREATE OR REPLACE FUNCTION public.check_user_account_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
DECLARE
    v_control_id INTEGER;
    v_user_count BIGINT;
BEGIN
    SELECT control_id
    INTO v_control_id
    FROM public.user_account_control
    WHERE control_id = 1
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User account control record is missing';
    END IF;

    SELECT COUNT(*)
    INTO v_user_count
    FROM public.users;

    IF v_user_count >= 2 THEN
        RAISE EXCEPTION 'Only two user accounts are allowed';
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_check_user_account_limit
BEFORE INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION public.check_user_account_limit();

REVOKE ALL ON FUNCTION public.check_user_account_limit() FROM PUBLIC;