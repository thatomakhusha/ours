CREATE TABLE user_account_control (
    control_id INTEGER PRIMARY KEY CHECK (control_id = 1)
);

INSERT INTO user_account_control (control_id) VALUES
    (1);