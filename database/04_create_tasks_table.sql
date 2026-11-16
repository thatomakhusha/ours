CREATE TABLE tasks (
    task_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    
    title VARCHAR(150) NOT NULL,
    description TEXT,
    priority VARCHAR(10) NOT NULL DEFAULT 'MEDIUM',

    due_date DATE,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,

    completed_at TIMESTAMPTZ,

    owner_id BIGINT REFERENCES users(user_id) ON DELETE RESTRICT,
    is_shared BOOLEAN NOT NULL DEFAULT FALSE,

    created_by BIGINT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    updated_by BIGINT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_tasks_title CHECK (title = TRIM(title) AND title <> ''),
    CONSTRAINT chk_tasks_description CHECK (description = TRIM(description) AND description <> ''),
    CONSTRAINT chk_tasks_priority CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')),
    
    CONSTRAINT chk_tasks_ownership
    CHECK (
        (is_shared = FALSE AND owner_id IS NOT NULL)
        OR
        (is_shared = TRUE AND owner_id IS NULL)
    ),
    CONSTRAINT chk_tasks_completion_status
    CHECK (
        (is_completed = FALSE AND completed_at IS NULL)
        OR
        (is_completed = TRUE AND completed_at IS NOT NULL)
    )
);