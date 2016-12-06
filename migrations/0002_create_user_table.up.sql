CREATE TABLE IF NOT EXISTS t_user (
    f_id SERIAL,
    f_user_name VARCHAR(256),
    f_user_avatar VARCHAR(256) DEFAULT '',
    f_mobile VARCHAR(32),
    f_password VARCHAR(256),
    f_lock_state INT DEFAULT '0',
    f_created_timestamp TIMESTAMP with time zone DEFAULT 'now'::timestamp,
    f_updated_timestamp TIMESTAMP with time zone DEFAULT 'now'::timestamp,
    CONSTRAINT "PKey" PRIMARY KEY ("f_id", "f_user_name")
);

CREATE TRIGGER t_updated_timestamp BEFORE UPDATE ON t_user FOR EACH ROW EXECUTE PROCEDURE update_f_updated_timestamp_column();