CREATE FUNCTION update_f_updated_timestamp_column(***REMOVED*** RETURNS trigger
LANGUAGE plpgsql
AS $$
  BEGIN
    NEW.f_updated_timestamp = NOW(***REMOVED***;
    RETURN NEW;
  END;
$$;