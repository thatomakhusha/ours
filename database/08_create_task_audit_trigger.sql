CREATE FUNCTION validate_task_audit_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.created_by IS DISTINCT FROM NEW.updated_by THEN
        RAISE EXCEPTION 'Task creator and initial updater must be the same user';
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_task_audit_fields
BEFORE INSERT ON tasks
FOR EACH ROW
EXECUTE FUNCTION validate_task_audit_fields();

REVOKE ALL ON FUNCTION public.validate_task_audit_fields()
FROM PUBLIC;