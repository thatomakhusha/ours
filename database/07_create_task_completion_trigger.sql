CREATE FUNCTION update_task_completion_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.is_completed IS DISTINCT FROM OLD.is_completed THEN
        IF NEW.is_completed = TRUE THEN
            NEW.completed_at := statement_timestamp();
        ELSE
            NEW.completed_at := NULL;
        END IF;
    ELSE
        NEW.completed_at := OLD.completed_at;
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_update_task_completion_timestamp
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_task_completion_timestamp();