-- init.sql
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

     CREATE TABLE db.Login (
        Id SERIAL PRIMARY KEY,
        Dc TIMESTAMP,
        Dm TIMESTAMP,
        Login VARCHAR(255) NOT NULL,
        Password VARCHAR(255) NOT NULL,
        Pseudo VARCHAR(255)
    );


    CREATE TABLE db.PersonPhysic (
        Id SERIAL PRIMARY KEY,
        Dc TIMESTAMP,
        Dm TIMESTAMP,
        Name VARCHAR(255) NOT NULL,
        NaissanceDate DATE,
        PhoneNumber VARCHAR(20),
        EmailAddress VARCHAR(255),
        LoginId INT,
        FOREIGN KEY (LoginId) REFERENCES db.Login(Id)
    );

    CREATE TABLE db.Address (
        Id SERIAL PRIMARY KEY,
        Dc TIMESTAMP,
        Dm TIMESTAMP,
        Street VARCHAR(255),
        City VARCHAR(255),
        State VARCHAR(255),
        PostalCode VARCHAR(20),
        Country VARCHAR(100),
        ReferenceId INT,
        Private BOOLEAN,
        Validate BOOLEAN
    );

    CREATE TABLE db.PersonMoral (
        Id SERIAL PRIMARY KEY,
        Dc TIMESTAMP,
        Dm TIMESTAMP,
        Name VARCHAR(255),
        Rib VARCHAR(255),
        RnaNumber VARCHAR(11),
        Siren VARCHAR(10),
        Siret VARCHAR(15)
    );

    CREATE TABLE db.Club (
        Id SERIAL PRIMARY KEY,
        Dc TIMESTAMP,
        Dm TIMESTAMP,
        Label VARCHAR(255) NOT NULL,
        PersonMoralId INT,
        OldLabel VARCHAR(255),
        CreationDate DATE
    );

    CREATE TABLE db.ProductType (
        Id SERIAL PRIMARY KEY,
        Dc TIMESTAMP,
        Dm TIMESTAMP,
        Label VARCHAR(255) NOT NULL,
        ClubId INT,
        FOREIGN KEY (ClubId) REFERENCES db.Club(Id)
    );

    CREATE TABLE db.Product (
        Id SERIAL PRIMARY KEY,
        Dc TIMESTAMP,
        Dm TIMESTAMP,
        Label VARCHAR(255) NOT NULL,
        Description TEXT,
        ProductTypeId INT,
        Dd TIMESTAMP,
        Df TIMESTAMP,
        ImageUrl VARCHAR(255),
        Price FLOAT,
        Stock INT,
        FOREIGN KEY (ProductTypeId) REFERENCES db.ProductType(Id)
    );

    CREATE TABLE db.EventType (
        Id SERIAL PRIMARY KEY,
        Dc TIMESTAMP,
        Dm TIMESTAMP,
        Label VARCHAR(255) NOT NULL,
        ClubId INT,
        FOREIGN KEY (ClubId) REFERENCES db.Club(Id)
    );

    CREATE TABLE db.Event (
        Id SERIAL PRIMARY KEY,
        Dc TIMESTAMP,
        Dm TIMESTAMP,
        Label VARCHAR(255) NOT NULL,
        Description TEXT,
        EventTypeId INT,
        Dd TIMESTAMP,
        Df TIMESTAMP,
        AddressId INT,
        MaxPerson INT,
        FOREIGN KEY (AddressId) REFERENCES db.Address(Id),
        FOREIGN KEY (EventTypeId) REFERENCES db.EventType(Id)
    );

    CREATE TABLE db.Inscription (
        Id SERIAL PRIMARY KEY,
        Dc TIMESTAMP,
        Dm TIMESTAMP,
        EventId INT,
        PersonPhysicId INT,
        FOREIGN KEY (EventId) REFERENCES db.Event(Id),
        FOREIGN KEY (PersonPhysicId) REFERENCES db.PersonPhysic(Id)
    );

    CREATE TABLE db.LicenceType (
        Id SERIAL PRIMARY KEY,
        Dc TIMESTAMP,
        Dm TIMESTAMP,
        Label VARCHAR(255) NOT NULL,
        ClubId INT,
        Price FLOAT,
        FOREIGN KEY (ClubId) REFERENCES db.Club(Id)
    );

    CREATE TABLE db.Role (
        Id SERIAL PRIMARY KEY,
        Dc TIMESTAMP,
        Dm TIMESTAMP,
        Label VARCHAR(255) NOT NULL,
        Level INT,
        ClubId INT,
        FOREIGN KEY (ClubId) REFERENCES db.Club(Id)
    );

    CREATE TABLE db.Licence (
        Id SERIAL PRIMARY KEY,
        Dc TIMESTAMP,
        Dm TIMESTAMP,
        Label VARCHAR(255) NOT NULL,
        Dd TIMESTAMP,
        Df TIMESTAMP,
        LicenceTypeId INT,
        PersonPhysicId INT,
        RoleId INT,
        FOREIGN KEY (LicenceTypeId) REFERENCES db.LicenceType(Id),
        FOREIGN KEY (PersonPhysicId) REFERENCES db.PersonPhysic(Id),
        FOREIGN KEY (RoleId) REFERENCES db.Role(Id)
    );

    CREATE TABLE db.Conversation (
        Id SERIAL PRIMARY KEY,
        Dc TIMESTAMP,
        Dm TIMESTAMP,
        EventId INT,
        Person1Id INT,
        Person2Id INT,
        Type VARCHAR(50),
        FOREIGN KEY (EventId) REFERENCES db.Event(Id),
        FOREIGN KEY (Person1Id) REFERENCES db.PersonPhysic(Id),
        FOREIGN KEY (Person2Id) REFERENCES db.PersonPhysic(Id)
    );

    CREATE TABLE db.Message (
        Id SERIAL PRIMARY KEY,
        Dc TIMESTAMP,
        Dm TIMESTAMP,
        Content TEXT NOT NULL,
        ConversationId INT,
        PersonPhysicId INT,
        FOREIGN KEY (ConversationId) REFERENCES db.Conversation(Id),
        FOREIGN KEY (PersonPhysicId) REFERENCES db.PersonPhysic(Id)
    );

    -- Insert test data
    INSERT INTO db.Address (Dc, Dm, Street, City, State, PostalCode, Country, ReferenceId, Private, Validate) VALUES
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', '4 Av. du Stade', 'Bohal', 'Bretagne', '56140', 'France', null, false, true),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Complexe polyvalent', 'Pleucadeuc', 'Bretagne', '56140', 'France', 2, false, true),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Le Daufresne', 'Malestroit', 'Bretagne', '56140', 'France', 1, false, true),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', '29 rue saint roch','Ploermel','Bretagne','56800','France', 1, true, true),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Rue Pierre de Coubertin','Ploermel','Bretagne','56800','France', null, false, true);

    INSERT INTO db.PersonMoral (Dc, Dm, Name, Rib, RnaNumber, Siren, Siret) VALUES
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Vol en Oust', null, null, null, null);

    INSERT INTO db.Club (Dc, Dm, Label, PersonMoralId, OldLabel, CreationDate) VALUES
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'La Claie', null, null, '2022-08-01T00:00:00.000Z'),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Vol en Pleuc', null, null, '2022-08-01T00:00:00.000Z');

    INSERT INTO db.ProductType (Dc, Dm, Label, ClubId) VALUES
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Tee-Shirt', 1),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Mug', 1),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Tee-Shirt', 2),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Mug', 2),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'SweatShirt', 1),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'SweatShirt', 2);

    INSERT INTO db.Product (Dc, Dm, Label, Description, ProductTypeId, Dd, Df, ImageUrl, Price, Stock) VALUES
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Tee-Shirt La Claie', 'Taille L', 1, '2023-09-01 08:00:00', '2024-08-31 00:00:00', 'https://pics.craiyon.com/2023-11-21/Zwc901p9SqqrxhW3TTrCBA.webp', 15, 20),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Tee-Shirt La Claie', 'Taille M', 1, '2023-09-01 08:00:00', '2024-08-31 00:00:00', 'https://pics.craiyon.com/2023-11-21/Zwc901p9SqqrxhW3TTrCBA.webp', 15, 20),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Tee-Shirt La Claie', 'Taille S', 1, '2023-09-01 08:00:00', '2024-08-31 00:00:00', null , 15, 20),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Mug La Claie', 'Mug avec une Capacité de 33cl', 2, '2023-09-01 08:00:00', '2024-08-31 00:00:00', 'https://img.craiyon.com/2024-07-21/5n-2nQZ6Rlu-IrlE1KQrsg.webp', 10, 5),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Tee-Shirt Vol en Pleuc', 'Taille L', 3, '2023-09-01 08:00:00', '2024-08-31 00:00:00', 'https://pics.craiyon.com/2023-11-21/Zwc901p9SqqrxhW3TTrCBA.webp', 15, 20),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Tee-Shirt Vol en Pleuc', 'Taille M', 3, '2023-09-01 08:00:00', '2024-08-31 00:00:00', 'https://pics.craiyon.com/2023-11-21/Zwc901p9SqqrxhW3TTrCBA.webp', 15, 20),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Tee-Shirt Vol en Pleuc', 'Taille S', 3, '2023-09-01 08:00:00', '2024-08-31 00:00:00', 'https://pics.craiyon.com/2023-11-21/Zwc901p9SqqrxhW3TTrCBA.webp', 15, 20),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Mug Vol en Pleuc', 'Mug avec une Capacité de 33cl', 4, '2023-09-01 08:00:00', '2024-08-31 00:00:00', 'https://img.craiyon.com/2024-07-21/5n-2nQZ6Rlu-IrlE1KQrsg.webp', 10, 5),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'SweatShirt La Claie', 'Taille L', 5, '2023-09-01 08:00:00', '2024-08-31 00:00:00', 'https://img.craiyon.com/2024-07-21/WwNkdoY5SEmX1qBRsvn8Rw.webp', 20, 30),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'SweatShirt La Claie', 'Taille M', 5, '2023-09-01 08:00:00', '2024-08-31 00:00:00', 'https://img.craiyon.com/2024-07-21/WwNkdoY5SEmX1qBRsvn8Rw.webp', 20, 30),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'SweatShirt La Claie', 'Taille S', 5, '2023-09-01 08:00:00', '2024-08-31 00:00:00', 'https://img.craiyon.com/2024-07-21/WwNkdoY5SEmX1qBRsvn8Rw.webp', 20, 30),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'SweatShirt Vol en Pleuc', 'Taille L', 6, '2023-09-01 08:00:00', '2024-08-31 00:00:00', 'https://img.craiyon.com/2024-07-21/WwNkdoY5SEmX1qBRsvn8Rw.webp', 20, 30),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'SweatShirt Vol en Pleuc', 'Taille M', 6, '2023-09-01 08:00:00', '2024-08-31 00:00:00', 'https://img.craiyon.com/2024-07-21/WwNkdoY5SEmX1qBRsvn8Rw.webp', 20, 30),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'SweatShirt Vol en Pleuc', 'Taille S', 6, '2023-09-01 08:00:00', '2024-08-31 00:00:00', 'https://img.craiyon.com/2024-07-21/WwNkdoY5SEmX1qBRsvn8Rw.webp', 20, 30);

    INSERT INTO db.EventType (Dc, Dm, Label, ClubId) VALUES
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Entrainement', 1),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Cours', 1),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Tournoi', 1),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Rencontre', 1),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Repas', 1),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Entrainement', 2),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Cours', 2),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Tournoi', 2),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Rencontre', 2),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Repas', 2);

    INSERT INTO db.Event (Dc, Dm, Label, Description, EventTypeId, Dd, Df, AddressId, MaxPerson) VALUES
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Cours', 'Cours le 10/01 à 19h', 2, '2024-01-10 19:00:00', '2024-01-10 21:00:00', 3 ,  null),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Cours', 'Cours le 12/02 à 19h', 7, '2024-02-12 19:00:00', '2024-02-12 21:00:00', 2 , null),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Cours', 'Cours le 13/03 à 19h', 2, '2024-03-13 19:00:00', '2024-03-13 21:00:00', 3 , null),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Cours', 'Cours le 15/04 à 19h', 7, '2024-04-15 19:00:00', '2024-04-15 21:00:00', 2 , null),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Cours', 'Cours le 15/05 à 19h', 2, '2024-05-15 19:00:00', '2024-05-15 21:00:00', 3 , null),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Cours', 'Cours le 17/06 à 19h', 7, '2024-06-17 19:00:00', '2024-06-17 21:00:00', 1 , null),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Repas', 'Repas de fin d année le 28/06 à 19h', 4, '2024-06-28 19:00:00', '2024-06-28 21:00:00', 3 , null),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Repas', 'Repas de fin d année le 28/06 à 19h', 9, '2024-06-28 19:00:00', '2024-06-28 21:00:00', 3 , null),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Rencontre', 'Rencontre avec Serent', 4, '2024-08-19 19:00:00', '2024-08-19 23:00:00', 1 , null),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Tournois Amical', 'Tournois a Ploermel', 3, '2024-08-28 19:00:00', '2024-08-28 22:30:00', 5 , null),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Cours', 'Cours de fin d année', 2, '2024-08-31 19:00:00', '2024-08-31 22:30:00', 3 , null);

     INSERT INTO db.Login (Dc, Dm, Login, Password, Pseudo) VALUES
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'jules@clubmaster.bzh','$2b$10$UPJSSFgJOfhsVzuYsQ4HCeF3ilCMfV0Vm2yQLi1pJE0HLgnQj4HVu','Le Coach'),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'amandine@clubmaster.bzh','$2b$10$UPJSSFgJOfhsVzuYsQ4HCeF3ilCMfV0Vm2yQLi1pJE0HLgnQj4HVu','Le PLus Belle');

    INSERT INTO db.PersonPhysic (Dc, Dm, Name, NaissanceDate, PhoneNumber, EmailAddress, LoginId) VALUES
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Jules Chassany','2003-10-25T00:00:00.000Z','0677332963','jules@clubmaster.bzh',1),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Amandine Moncoiffé','2003-10-25T00:00:00.000Z','0677332963','amandine@clubmaster.bzh',1);


    INSERT INTO db.LicenceType (Dc, Dm, Label, ClubId, Price) VALUES
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Licence Visiteur',1, null),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Licence Complete',1, 20),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Demi-Licence',1, 10),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Licence Spécifique',1,null),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Licence Visiteur',2, null),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Licence Complete',2, 20),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Demi-Licence',2, 10),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Licence Spécifique',2,null);

    INSERT INTO db.Role (Dc, Dm, Label, Level, ClubId) VALUES
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Visiteur',0,1),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Président',4,1),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Secrétaire',3,1),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Trésorier',3,1),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Coach',2,1),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Adhérent',1,1);

    INSERT INTO db.Licence (Dc, Dm, Label, Dd, Df, LicenceTypeId, PersonPhysicId, RoleId) VALUES
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Licence Visiteur','2024-07-15T00:00:00.000Z','2024-08-31T00:00:00.000Z',1,1,1);

    INSERT INTO db.Inscription (Dc, Dm, EventId, PersonPhysicId) VALUES
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 7, 1),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 9, 1),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 11, 1),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 2, 1);

    INSERT INTO Conversation (Dc, Dm, EventId, Person1Id, Person2Id, Type) VALUES
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 1, null, null, 'Event'),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 2, null, null, 'Event'),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 3, null, null, 'Event'),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 4, null, null, 'Event'),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 5, null, null, 'Event'),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 6, null, null, 'Event'),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 7, null, null, 'Event'),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 8, null, null, 'Event'),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 9, null, null, 'Event'),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 10, null, null, 'Event'),
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 11, null, null, 'Event');

    INSERT INTO Message (Dc, Dm, Content, ConversationId, PersonPhysicId) VALUES
    ('2024-06-30T00:00:00.000Z', '2024-06-30T00:00:00.000Z', 'Hello', 11,1),
    ('2024-07-30T00:00:00.000Z', '2024-07-30T00:00:00.000Z', 'Chaud pour un petit Bad?', 11,1),
    ('2024-08-08T00:00:00.000Z', '2024-08-08T00:00:00.000Z', 'Pourquoi pas :)', 11,2);
    
END
$$;