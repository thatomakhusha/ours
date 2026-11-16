CREATE FUNCTION protect_note_original_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.note_id IS DISTINCT FROM OLD.note_id THEN
        RAISE EXCEPTION 'Note ID cannot be changed';
    END IF;

    IF NEW.sender_id IS DISTINCT FROM OLD.sender_id THEN
        RAISE EXCEPTION 'Note sender cannot be changed';
    END IF;

    IF NEW.recipient_id IS DISTINCT FROM OLD.recipient_id THEN
        RAISE EXCEPTION 'Note recipient cannot be changed';
    END IF;

    IF NEW.created_at IS DISTINCT FROM OLD.created_at THEN
        RAISE EXCEPTION 'Note creation timestamp cannot be changed';
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_protect_note_original_fields
BEFORE UPDATE ON notes
FOR EACH ROW
EXECUTE FUNCTION protect_note_original_fields();

REVOKE ALL ON FUNCTION public.protect_note_original_fields()
FROM PUBLIC;