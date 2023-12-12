---===================================================----
---- VOLCADO DE DATOS DB <CREDENTIAL SERVICES> V1.0.0 ----
---===================================================----


DO $$ 
DECLARE
    success BOOLEAN := true;
BEGIN
    -- Start the transaction
    BEGIN
        ---======AUTH ROLES======---
        INSERT INTO public.auth_roles (data_created, id, description) 
        VALUES
            (now(), 1, 'admin'),---1
            (now(), 2, 'developer')---2
            ;

        ---======AUTH MODULES======---
        INSERT INTO public.auth_modules (data_created, id, description, endpoint)
        VALUES
            (now(), 1, 'Perfil de usuario', 'user-profile'), ---1
            (now(), 2, 'Visualización de Credenciales', 'credentials'),---2
            (now(), 3, 'Administración de Credenciales', 'manage-credentials'),---3
            (now(), 4, 'Administración de Usuarios', 'manage-users')---4
            ;

        ---======AUTH PERMISSIONS======---
        INSERT INTO public.auth_permissions (data_created, id, auth_role_id, auth_module_id) 
        VALUES
            (now(), 1, 1, 1),
            (now(), 2, 1, 2),
            (now(), 3, 1, 3),
            (now(), 4, 1, 4),
            (now(), 5, 2, 1),
            (now(), 6, 2, 2)
            ;


        ---======AUTH USER - ADMIN ROLE======---
        INSERT INTO public.auth_users (data_created, id, email, "name", last_name, auth_credential_id, auth_role_id) 
        VALUES
            (now(), 1, 'slescano@gett.mobi', 'Sebastian', 'Lescano', null, 1) ---1
            ;


    EXCEPTION
        WHEN OTHERS THEN
            -- An error occurred, set success to false
            success := false;
            RAISE EXCEPTION 'Error occurred during execution: %', SQLERRM;
    END;

    -- Check if the transaction was successful
    IF success THEN
        -- If successful, commit the transaction
        COMMIT;
    ELSE
        -- If there was an error, rollback the transaction
        ROLLBACK;
    END IF;
END $$;


DO $$ 
DECLARE
    success BOOLEAN := true;
BEGIN
    -- Start the transaction
    BEGIN

        ---======AUTH CREDENTIAL - CREDENTIAL ADMIN ID 1======---
        INSERT INTO public.auth_credentials (data_created,  id, "password", auth_user_id) 
        VALUES
            (now(), 1, '$2b$10$zR4NbnGsZRXzUv.CjIfwGewvQY15jxNfTRLbqYIazLcE58.JrCRM6', 1)
            ;

        ---======AUTH USER - UPDATE CREDENTIAL ID 1======---
        UPDATE public.auth_users  SET auth_credential_id=1 WHERE id=1;


                    ---======ALTER SEQUENCE=====---
        ALTER SEQUENCE auth_roles_id_seq RESTART WITH 3;
        ALTER SEQUENCE auth_modules_id_seq RESTART WITH 5;
        ALTER SEQUENCE auth_permissions_id_seq RESTART WITH 6;
        ALTER SEQUENCE auth_users_id_seq RESTART WITH 2;
        ALTER SEQUENCE auth_credentials_id_seq RESTART WITH 2;


    EXCEPTION
        WHEN OTHERS THEN
            -- An error occurred, set success to false
            success := false;
            RAISE EXCEPTION 'Error occurred during execution: %', SQLERRM;
    END;

    -- Check if the transaction was successful
    IF success THEN
        -- If successful, commit the transaction
        COMMIT;
    ELSE
        -- If there was an error, rollback the transaction
        ROLLBACK;
    END IF;
END $$;

