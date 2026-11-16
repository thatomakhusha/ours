CREATE FUNCTION update_note_edit_status()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.content IS DISTINCT FROM OLD.content THEN
        NEW.is_edited := TRUE;
        NEW.updated_at := statement_timestamp();
    ELSE
        NEW.is_edited := OLD.is_edited;
        NEW.updated_at := OLD.updated_at;
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_update_note_edit_status
BEFORE UPDATE ON notes
FOR EACH ROW
EXECUTE FUNCTION update_note_edit_status();

REVOKE ALL ON FUNCTION public.update_note_edit_status()
FROM PUBLIC;