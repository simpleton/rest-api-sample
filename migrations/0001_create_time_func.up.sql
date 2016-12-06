CREATE FUNCTION update_f_updated_timestamp_column() RETURNS trigger
LANGUAGE plpgsql
AS $$
  BEGIN
    NEW.f_updated_timestamp = NOW();
    RETURN NEW;
  END;
$$;