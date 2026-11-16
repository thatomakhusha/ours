CREATE TABLE users(
    user_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    first_name VARCHAR(50) NOT NULL,
    display_name VARCHAR(50) NOT NULL,

    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,

    must_change_password BOOLEAN NOT NULL DEFAULT TRUE,
    password_changed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_users_first_name CHECK (first_name = TRIM(first_name) AND first_name <> ''),
    CONSTRAINT chk_users_display_name CHECK (display_name = TRIM(display_name) AND display_name <> ''),
    CONSTRAINT chk_users_email CHECK (email = TRIM(email) AND email <> ''),
    CONSTRAINT chk_users_password_hash CHECK (password_hash = TRIM(password_hash) AND password_hash <> ''),
    CONSTRAINT chk_users_password_change_status CHECK (
        (must_change_password = TRUE AND password_changed_at IS NULL)
        OR
        (must_change_password = FALSE AND password_changed_at IS NOT NULL)
    )
);

CREATE UNIQUE INDEX idx_users_email_lower
ON users (LOWER(email));