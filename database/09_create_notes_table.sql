CREATE TABLE notes (
    note_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    sender_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    recipient_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,

    content TEXT NOT NULL,
    is_edited BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,

    CONSTRAINT chk_notes_different_users CHECK (sender_id <> recipient_id),
    CONSTRAINT chk_notes_content CHECK (content = TRIM(content) AND content <> ''),

    CONSTRAINT chk_notes_edited_status
    CHECK (
        (is_edited = FALSE AND updated_at IS NULL)
        OR
        (is_edited = TRUE AND updated_at IS NOT NULL)
    )
);