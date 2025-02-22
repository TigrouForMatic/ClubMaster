-- Dans psql
INSERT INTO db.Objet (Name, Description, Dc, Dm) 
VALUES ('Production Object', 'Test en production', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Vérification
SELECT * FROM db.Objet;
