CREATE TABLE IF NOT EXISTS t_user (
    f_id SERIAL,
    f_user_name VARCHAR(200***REMOVED***,
    f_user_avatar VARCHAR(200***REMOVED*** DEFAULT '',
    f_mobile VARCHAR(20***REMOVED***,
    f_auth_token VARCHAR(100***REMOVED***,
    f_lock_state INT DEFAULT '0',
    f_created_timestamp TIMESTAMP with time zone DEFAULT 'now'::timestamp,
    f_updated_timestamp TIMESTAMP with time zone DEFAULT 'now'::timestamp,
    CONSTRAINT "PKey" PRIMARY KEY ("f_id", "f_user_name"***REMOVED***
***REMOVED***;

CREATE TRIGGER t_updated_timestamp BEFORE UPDATE ON t_user FOR EACH ROW EXECUTE PROCEDURE update_f_updated_timestamp_column(***REMOVED***;