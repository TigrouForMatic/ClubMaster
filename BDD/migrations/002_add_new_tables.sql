SET search_path TO db;

CREATE TABLE IF NOT EXISTS db.Objet (
    Id SERIAL PRIMARY KEY,
    Dc TIMESTAMP,
    Dm TIMESTAMP,
    Bin BOOLEAN DEFAULT false,
    Name VARCHAR(255) NOT NULL,
    Description TEXT,
    ClubId INT,
    FOREIGN KEY (ClubId) REFERENCES db.Club(Id)
);