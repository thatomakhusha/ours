CREATE FUNCTION protect_task_original_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.task_id IS DISTINCT FROM OLD.task_id THEN
        RAISE EXCEPTION 'Task ID cannot be changed';
    END IF;
    
    IF NEW.created_by IS DISTINCT FROM OLD.created_by THEN
        RAISE EXCEPTION 'Task creator cannot be changed';
    END IF;

    IF NEW.created_at IS DISTINCT FROM OLD.created_at THEN
        RAISE EXCEPTION 'Task creation timestamp cannot be changed';
    END IF;

    IF NEW.owner_id IS DISTINCT FROM OLD.owner_id THEN
        RAISE EXCEPTION 'Task owner cannot be changed';
    END IF;

    IF NEW.is_shared IS DISTINCT FROM OLD.is_shared THEN
        RAISE EXCEPTION 'Task sharing status cannot be changed';
    END IF;

    RETURN NEW;    
END;
$$;

CREATE TRIGGER trg_protect_task_original_fields
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION protect_task_original_fields();

REVOKE ALL ON FUNCTION public.protect_task_original_fields()
FROM PUBLIC;