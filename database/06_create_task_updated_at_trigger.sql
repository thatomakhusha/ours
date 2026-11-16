CREATE FUNCTION update_task_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at := statement_timestamp();

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_update_task_timestamp
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_task_timestamp();

REVOKE ALL ON FUNCTION public.update_task_timestamp()
FROM PUBLIC;