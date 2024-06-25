DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = 'docker') THEN
        CREATE USER docker;
    END IF;

    IF NOT EXISTS (SELECT FROM pg_catalog.pg_database WHERE datname = 'docker') THEN
        CREATE DATABASE docker;
    END IF;

    GRANT ALL PRIVILEGES ON DATABASE docker TO docker;

    DROP SCHEMA IF EXISTS db CASCADE;
    CREATE SCHEMA db;
    SET search_path TO db;

    CREATE TABLE db.Address (
        Id SERIAL PRIMARY KEY,
        Street VARCHAR(255),
        City VARCHAR(255),
        State VARCHAR(255),
        PostalCode VARCHAR(20),
        Country VARCHAR(100),
        Validate BOOLEAN,
        OutputAsLabel VARCHAR(255)
    );

    CREATE TABLE db.PersonPhysic (
        Id SERIAL PRIMARY KEY,
        Name VARCHAR(255) NOT NULL,
        PhoneNumber VARCHAR(20),
        EmailAddress VARCHAR(255),
        AddressId INT,
        FOREIGN KEY (AddressId) REFERENCES db.Address(Id)
    );

    CREATE TABLE db.PersonMoral (
        Id SERIAL PRIMARY KEY,
        Name VARCHAR(255) NOT NULL,
    );

    INSERT INTO db.PersonMoral(Name) VALUES
        ('Vol en Oust');

    CREATE TABLE db.Club (
        Id SERIAL PRIMARY KEY,
        Label VARCHAR(255) NOT NULL,
        PersonMoralId INT,
        FOREIGN KEY (PersonMoralId) REFERENCES db.PersonMoral(Id)
    );

    INSERT INTO db.Club(Label,PersonMoralId) VALUES
        ('La Claie',1),
        ('Vol en Pleuc',1);

    CREATE TABLE db.ProduitType (
        Id SERIAL PRIMARY KEY,
        Label VARCHAR(255) NOT NULL,
        ClubId INT,
        FOREIGN KEY (ClubId) REFERENCES db.Club(Id)
    );

    INSERT INTO db.ProduitType(Label,ClubId) VALUES
        ('Tee-Shirt',1),
        ('Mug',1),
        ('Tee-Shirt',2),
        ('Mug',2),
        ('SweatShirt',1),
        ('SweatShirt',2);

    CREATE TABLE db.Produit (
        Id SERIAL PRIMARY KEY,
        Label VARCHAR(255) NOT NULL,
        Description TEXT,
        ProduitTypeId INT,
        Dd DATE,
        Df DATE,
        Price DECIMAL(10, 2),
        Stock INT,
        FOREIGN KEY (ProduitTypeId) REFERENCES db.ProduitType(Id),
    );

     INSERT INTO db.Produit(Label,Description, ProduitTypeId, Dd, Df, Price, Stock) VALUES
        ('Tee-Shirt La Claie',"Taille L", 1, "2023-09-01 08:00:00.000", "2024-08-31 00:00:00.000", 15, 20),
        ('Tee-Shirt La Claie',"Taille M", 1, "2023-09-01 08:00:00.000", "2024-08-31 00:00:00.000", 15, 20),
        ('Tee-Shirt La Claie',"Taille S", 1, "2023-09-01 08:00:00.000", "2024-08-31 00:00:00.000", 15, 20),
        ('Mug La Claie',"Mug avec une Capacité de 33cl", 2, "2023-09-01 08:00:00.000", "2024-08-31 00:00:00.000", 10, 5),
        ('Tee-Shirt Vol en Pleuc',"Taille L", 3, "2023-09-01 08:00:00.000", "2024-08-31 00:00:00.000", 15, 20),
        ('Tee-Shirt Vol en Pleuc',"Taille M", 3, "2023-09-01 08:00:00.000", "2024-08-31 00:00:00.000", 15, 20),
        ('Tee-Shirt Vol en Pleuc',"Taille S", 3, "2023-09-01 08:00:00.000", "2024-08-31 00:00:00.000", 15, 20),
        ('Mug Vol en Pleuc',"Mug avec une Capacité de 33cl", 4, "2023-09-01 08:00:00.000", "2024-08-31 00:00:00.000", 10, 5),
        ('SweatShirt La Claie',"Taille L", 5, "2023-09-01 08:00:00.000", "2024-08-31 00:00:00.000", 20, 30),
        ('SweatShirt La Claie',"Taille M", 5, "2023-09-01 08:00:00.000", "2024-08-31 00:00:00.000", 20, 30),
        ('SweatShirt La Claie',"Taille S", 5, "2023-09-01 08:00:00.000", "2024-08-31 00:00:00.000", 20, 30),
        ('SweatShirt Vol en Pleuc',"Taille L", 6, "2023-09-01 08:00:00.000", "2024-08-31 00:00:00.000", 20, 30),
        ('SweatShirt Vol en Pleuc',"Taille M", 6, "2023-09-01 08:00:00.000", "2024-08-31 00:00:00.000", 20, 30),
        ('SweatShirt Vol en Pleuc',"Taille S", 6, "2023-09-01 08:00:00.000", "2024-08-31 00:00:00.000", 20, 30);

    CREATE TABLE db.EventType (
        Id SERIAL PRIMARY KEY,
        Label VARCHAR(255) NOT NULL,
        ClubId INT,
        FOREIGN KEY (ClubId) REFERENCES db.Club(Id)
    );

    INSERT INTO db.EventType(Label, ClubId) VALUES
        ('Entrainement', 1),
        ('Cours', 1),
        ('Tournois', 1),
        ('Rencontre', 1),
        ('Repas', 1),
        ('Entrainement', 2),
        ('Cours', 2),
        ('Tournois', 2),
        ('Rencontre', 2),
        ('Repas', 2);

    CREATE TABLE db.Event (
        Id SERIAL PRIMARY KEY,
        Label VARCHAR(255) NOT NULL,
        Description TEXT,
        EventTypeId INT,
        Dd TIMESTAMP,
        Df TIMESTAMP,
        InscritIds TEXT,
        FOREIGN KEY (EventTypeId) REFERENCES db.EventType(Id)
    );

    -- Cours pour le club 1
    INSERT INTO db.Event(Label, Description, EventTypeId, Dd, Df, InscritIds) VALUES
        ('Cours', 'Cours le 10/01 à 19h', 2, '2024-01-10 19:00:00', '2024-01-10 21:00:00', ''),
        ('Cours', 'Cours le 12/02 à 19h', 7, '2024-02-12 19:00:00', '2024-02-12 21:00:00', ''),
        ('Cours', 'Cours le 13/03 à 19h', 2, '2024-03-13 19:00:00', '2024-03-13 21:00:00', ''),
        ('Cours', 'Cours le 15/04 à 19h', 7, '2024-04-15 19:00:00', '2024-04-15 21:00:00', ''),
        ('Cours', 'Cours le 15/05 à 19h', 2, '2024-05-15 19:00:00', '2024-05-15 21:00:00', ''),
        ('Cours', 'Cours le 17/06 à 19h', 7, '2024-06-17 19:00:00', '2024-06-17 21:00:00', '');

    -- Entrainement pour le club 1 (lundi et mercredi de chaque semaine du 01/01 au 31/08)
    DO $$
    DECLARE
        start_date DATE := '2024-01-01';
        end_date DATE := '2024-08-31';
        current_date DATE;
    BEGIN
        current_date := start_date;
        WHILE current_date <= end_date LOOP
            IF EXTRACT(DOW FROM current_date) = 1 THEN -- Lundi
                INSERT INTO db.Event(Label, Description, EventTypeId, Dd, Df, InscritIds) VALUES
                    ('Entrainement', 'Entrainement le lundi', 1, current_date + TIME '19:00', current_date + TIME '21:00', '');
            ELSIF EXTRACT(DOW FROM current_date) = 3 THEN -- Mercredi
                INSERT INTO db.Event(Label, Description, EventTypeId, Dd, Df, InscritIds) VALUES
                    ('Entrainement', 'Entrainement le mercredi', 1, current_date + TIME '19:30', current_date + TIME '21:30', '');
            END IF;
            current_date := current_date + INTERVAL '1 day';
        END LOOP;
    END $$;

    -- Entrainement pour le club 2 (jeudi de chaque semaine du 01/01 au 31/08)
    DO $$
    DECLARE
        start_date DATE := '2024-01-01';
        end_date DATE := '2024-08-31';
        current_date DATE;
    BEGIN
        current_date := start_date;
        WHILE current_date <= end_date LOOP
            IF EXTRACT(DOW FROM current_date) = 4 THEN -- Jeudi
                INSERT INTO db.Event(Label, Description, EventTypeId, Dd, Df, InscritIds) VALUES
                    ('Entrainement', 'Entrainement le jeudi', 6, current_date + TIME '19:00', current_date + TIME '22:00', '');
            END IF;
            current_date := current_date + INTERVAL '1 day';
        END LOOP;
    END $$;


    CREATE TABLE db.LicenceType (
        Id SERIAL PRIMARY KEY,
        Label VARCHAR(255) NOT NULL,
        ClubId INT,
        Price DECIMAL(10, 2),
        FOREIGN KEY (ClubId) REFERENCES db.Club(Id)
    );

    CREATE TABLE db.Role (
        Id SERIAL PRIMARY KEY,
        Label VARCHAR(255) NOT NULL,
        ClubId INT,
        FOREIGN KEY (ClubId) REFERENCES db.Club(Id)
    );

    CREATE TABLE db.Licence (
        Id SERIAL PRIMARY KEY,
        Label VARCHAR(255) NOT NULL,
        Dd DATE,
        Df DATE,
        LicenceTypeId INT,
        ClubId INT,
        PersonPhysicId INT,
        RoleId INT,
        FOREIGN KEY (LicenceTypeId) REFERENCES db.LicenceType(Id),
        FOREIGN KEY (ClubId) REFERENCES db.Club(Id),
        FOREIGN KEY (PersonPhysicId) REFERENCES db.PersonPhysic(Id),
        FOREIGN KEY (RoleId) REFERENCES db.Role(Id)
    );

    CREATE TABLE db.Login (
        Id SERIAL PRIMARY KEY,
        Login VARCHAR(255) NOT NULL,
        Password VARCHAR(255) NOT NULL,
        Pseudo VARCHAR(255),
        PersonPhysicId INT,
        FOREIGN KEY (PersonPhysicId) REFERENCES db.PersonPhysic(Id)
    );

END
$$;
