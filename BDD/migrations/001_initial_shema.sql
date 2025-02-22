SET search_path TO db;

    CREATE TABLE db.Login (
    Id SERIAL PRIMARY KEY,
    Dc TIMESTAMP,
    Dm TIMESTAMP,
    Bin BOOLEAN,
    LastLogin TIMESTAMP,
    Login VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Pseudo VARCHAR(255)
);


CREATE TABLE db.PersonPhysic (
    Id SERIAL PRIMARY KEY,
    Dc TIMESTAMP,
    Dm TIMESTAMP,
    Bin BOOLEAN,
    Name VARCHAR(255) NOT NULL,
    NaissanceDate DATE,
    PhoneNumber VARCHAR(20),
    EmailAddress VARCHAR(255),
    LoginId INT,
    GeneralConditions BOOLEAN,
    PrivacyPolicy BOOLEAN,
    FOREIGN KEY (LoginId) REFERENCES db.Login(Id)
);

CREATE TABLE db.Address (
    Id SERIAL PRIMARY KEY,
    Dc TIMESTAMP,
    Dm TIMESTAMP,
    Bin BOOLEAN,
    Street VARCHAR(255),
    City VARCHAR(255),
    State VARCHAR(255),
    PostalCode VARCHAR(20),
    Country VARCHAR(100),
    ReferenceId INT,
    Private BOOLEAN,
    Validate BOOLEAN
);

CREATE TABLE db.CreditCard (
    Id SERIAL PRIMARY KEY,
    Dc TIMESTAMP,
    Dm TIMESTAMP,
    PersonPhysicId INT,
    EncryptedCardNumber TEXT,
    EncryptedExpirationDate TEXT,
    EncryptedCVV TEXT,
    LastFourDigits VARCHAR(4),
    CardType VARCHAR(50),
    FOREIGN KEY (PersonPhysicId) REFERENCES db.PersonPhysic(Id)
);

CREATE TABLE db.PersonMoral (
    Id SERIAL PRIMARY KEY,
    Dc TIMESTAMP,
    Dm TIMESTAMP,
    Bin BOOLEAN,
    Name VARCHAR(255),
    Rib VARCHAR(255),
    RnaNumber VARCHAR(11),
    Siren VARCHAR(10),
    Siret VARCHAR(15),
    Plan VARCHAR(255) NOT NULL DEFAULT 'Basique' -- 'Basique', 'Essentiel', 'Pro'
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
    Bin BOOLEAN,
    Label VARCHAR(255) NOT NULL,
    Description TEXT,
    EventTypeId INT,
    Dd TIMESTAMP,
    Df TIMESTAMP,
    AddressId INT,
    MaxPerson INT,
    IsMatch BOOLEAN,
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
    Bin BOOLEAN,
    Private BOOLEAN,
    Duration INT,
    Label VARCHAR(255) NOT NULL,
    ClubId INT,
    Price FLOAT,
    Basic BOOLEAN,
    FOREIGN KEY (ClubId) REFERENCES db.Club(Id)
);

CREATE TABLE db.Role (
    Id SERIAL PRIMARY KEY,
    Dc TIMESTAMP,
    Dm TIMESTAMP,
    Bin BOOLEAN,
    Label VARCHAR(255) NOT NULL,
    Level INT,
    ClubId INT,
    FOREIGN KEY (ClubId) REFERENCES db.Club(Id)
);

CREATE TABLE db.Licence (
    Id SERIAL PRIMARY KEY,
    Dc TIMESTAMP,
    Dm TIMESTAMP,
    Bin BOOLEAN,
    Label VARCHAR(255) NOT NULL,
    Dd TIMESTAMP,
    Df TIMESTAMP,
    LicenceFederation VARCHAR(255),
    LicenceTypeId INT,
    PersonPhysicId INT,
    RoleId INT,
    FOREIGN KEY (LicenceTypeId) REFERENCES db.LicenceType(Id),
    FOREIGN KEY (PersonPhysicId) REFERENCES db.PersonPhysic(Id),
    FOREIGN KEY (RoleId) REFERENCES db.Role(Id)
);

CREATE TABLE db.Team (
    Id SERIAL PRIMARY KEY,
    Dc TIMESTAMP,
    Dm TIMESTAMP,
    Bin BOOLEAN,
    Label VARCHAR(255) NOT NULL,
    Public BOOLEAN,
    ClubId INT,
    FOREIGN KEY (ClubId) REFERENCES db.Club(Id)
);

CREATE TABLE db.TeamMember (
    Id SERIAL PRIMARY KEY,
    Dc TIMESTAMP,
    Dm TIMESTAMP,
    Bin BOOLEAN,
    TeamId INT,
    PersonPhysicId INT,
    FOREIGN KEY (TeamId) REFERENCES db.Team(Id),
    FOREIGN KEY (PersonPhysicId) REFERENCES db.PersonPhysic(Id)
);

CREATE TABLE db.Conversation (
    Id SERIAL PRIMARY KEY,
    Dc TIMESTAMP,
    Dm TIMESTAMP,
    EventId INT,
    TeamId INT,
    FOREIGN KEY (EventId) REFERENCES db.Event(Id),
    FOREIGN KEY (TeamId) REFERENCES db.Team(Id)
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

CREATE TABLE db.InfoBanner (
    Id SERIAL PRIMARY KEY,
    Dc TIMESTAMP NOT NULL,
    Dm TIMESTAMP,
    Bin BOOLEAN NOT NULL,
    Title VARCHAR(255) NOT NULL,
    Description TEXT,
    Dd TIMESTAMP NOT NULL,
    Df TIMESTAMP NOT NULL,
    HeaderImage VARCHAR(255),
    ClubId INTEGER NOT NULL,
    CreatedBy INTEGER NOT NULL,
    EventId INTEGER NULL,
    FOREIGN KEY (ClubId) REFERENCES db.Club(Id),
    FOREIGN KEY (CreatedBy) REFERENCES db.PersonPhysic(Id),
    FOREIGN KEY (EventId) REFERENCES db.Event(Id)
);

CREATE TABLE db.MatchScore (
    Id SERIAL PRIMARY KEY,
    Dc TIMESTAMP NOT NULL,
    Dm TIMESTAMP,
    Bin BOOLEAN NOT NULL,
    EventId INT,
    TeamId INT,
    Score INT,
    Result VARCHAR(255),
    FOREIGN KEY (EventId) REFERENCES db.Event(Id),
    FOREIGN KEY (TeamId) REFERENCES db.Team(Id)
);

CREATE TABLE db.MatchTeam (
    Id SERIAL PRIMARY KEY,
    Dc TIMESTAMP NOT NULL,
    Dm TIMESTAMP,
    Bin BOOLEAN NOT NULL,
    EventId INT,
    TeamId INT,
    FOREIGN KEY (EventId) REFERENCES db.Event(Id),
    FOREIGN KEY (TeamId) REFERENCES db.Team(Id)
);

CREATE TABLE db.Photos (
    Id SERIAL PRIMARY KEY,
    Dc TIMESTAMP NOT NULL,
    Dm TIMESTAMP,
    Bin BOOLEAN NOT NULL,
    Filename VARCHAR(255) NOT NULL,
    Originalname VARCHAR(255) NOT NULL,
    Mimetype VARCHAR(100) NOT NULL,
    Size INTEGER NOT NULL,
    Url VARCHAR(255) NOT NULL,
    ReferenceId INTEGER,
    ReferenceType VARCHAR(50),
    CreatedBy INTEGER,
    ClubId INTEGER,
    FOREIGN KEY (CreatedBy) REFERENCES db.PersonPhysic(Id),
    FOREIGN KEY (ClubId) REFERENCES db.Club(Id)
);