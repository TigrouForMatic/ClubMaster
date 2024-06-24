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
        PhoneNumber VARCHAR(20),
        EmailAddress VARCHAR(255)
    );

    CREATE TABLE db.Club (
        Id SERIAL PRIMARY KEY,
        Label VARCHAR(255) NOT NULL,
        PersonMoralId INT,
        FOREIGN KEY (PersonMoralId) REFERENCES db.PersonMoral(Id)
    );

    CREATE TABLE db.ProduitType (
        Id SERIAL PRIMARY KEY,
        Label VARCHAR(255) NOT NULL,
        ClubId INT,
        FOREIGN KEY (ClubId) REFERENCES db.Club(Id)
    );

    CREATE TABLE db.Produit (
        Id SERIAL PRIMARY KEY,
        Label VARCHAR(255) NOT NULL,
        Description TEXT,
        ProduitTypeId INT,
        ClubId INT,
        Dd DATE,
        Df DATE,
        Price DECIMAL(10, 2),
        Stock INT,
        FOREIGN KEY (ProduitTypeId) REFERENCES db.ProduitType(Id),
        FOREIGN KEY (ClubId) REFERENCES db.Club(Id)
    );

    CREATE TABLE db.EventType (
        Id SERIAL PRIMARY KEY,
        Label VARCHAR(255) NOT NULL,
        ClubId INT,
        FOREIGN KEY (ClubId) REFERENCES db.Club(Id)
    );

    CREATE TABLE db.Event (
        Id SERIAL PRIMARY KEY,
        Label VARCHAR(255) NOT NULL,
        Description TEXT,
        EventTypeId INT,
        ClubId INT,
        Dd DATE,
        Df DATE,
        InscritIds TEXT,
        FOREIGN KEY (EventTypeId) REFERENCES db.EventType(Id),
        FOREIGN KEY (ClubId) REFERENCES db.Club(Id)
    );

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
