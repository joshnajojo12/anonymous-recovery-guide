-- Fix the handle_new_user function to handle duplicate usernames
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Generate unique username by appending random number if needed
  DECLARE
    base_username text := NEW.raw_user_meta_data ->> 'username';
    final_username text := base_username;
    counter int := 1;
  BEGIN
    -- If no username provided, use email prefix
    IF base_username IS NULL OR base_username = '' THEN
      base_username := split_part(NEW.email, '@', 1);
      final_username := base_username;
    END IF;
    
    -- Check if username exists and append number if needed
    WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
      final_username := base_username || '_' || counter::text;
      counter := counter + 1;
    END LOOP;
    
    -- Insert profile with unique username
    INSERT INTO public.profiles (user_id, username, full_name, user_type)
    VALUES (
      NEW.id, 
      final_username,
      COALESCE(NEW.raw_user_meta_data ->> 'full_name', final_username),
      COALESCE(NEW.raw_user_meta_data ->> 'user_type', 'patient')
    );
    
    RETURN NEW;
  END;
END;
$function$