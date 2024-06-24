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

    CREATE TABLE db.Section (
        Id Int NOT NULL PRIMARY KEY,
        Libelle VARCHAR(255),
        Description TEXT,
        Type Int,
        IdMonstre Int,
        Choix1 VARCHAR(255),
        Choix2 VARCHAR(255),
        Choix3 VARCHAR(255),
        Direction1 Int,
        Direction2 Int,
        Direction3 Int,
        TypeBonus1 Int,
        TypeBonus2 Int,
        TypeBonus3 Int,
        Question VARCHAR(255),
        Reponse VARCHAR(255)
    );

    CREATE TABLE db.TypeSection (
        Id SERIAL NOT NULL PRIMARY KEY,
        Libelle VARCHAR(50)
    );

    CREATE TABLE db.Monstre (
        Id SERIAL NOT NULL PRIMARY KEY,
        Nom VARCHAR(50),
        Endurance Int,
        Habilite Int
    );

    CREATE TABLE db.Bonus (
        Id SERIAL NOT NULL PRIMARY KEY,
        Nom VARCHAR(50)
    );

    CREATE TABLE db.Joueur (
    	Id SERIAL NOT NULL PRIMARY KEY,
        Nom VARCHAR(50),
        Section Int,
        Sections VARCHAR(250),
        MaxHabilite Int,
        Habilite Int,
        MaxEndurance Int,
        Endurance Int,
        MaxChance Int,
        Chance Int,
        PieceOr Int,
        Potion VARCHAR(50),
        Arme VARCHAR(50),
        Bouclier VARCHAR(50),
        Bijou VARCHAR(50),
        Isfinish Boolean default false
    );

    INSERT INTO db.Bonus (Nom) VALUES
        ('MaxEndurance'),
        ('2Endurance'),
        ('-2Endurance'),
        ('-1Habilite'),
        ('-2Habilite'),
        ('MaxChance'),
        ('-1Chance'),
        ('Bouclier'),
        ('Epee'),
        ('BijouHabilite'),
        ('BijouEndurance'),
        ('RechargePotion'),
        ('MaxEnduranceEpee'),
        ('ObjectSecret'),
        ('-10PieceEpee'),
        ('-10PieceBouclier');
 
    INSERT INTO db.Monstre(Nom,Endurance,Habilite) VALUES
        ('Slime',6,2),
        ('Gobelin',8,6),
        ('Orc',12,7),
        ('Fantome',10,6),
        ('Géant',1000,1000),
        ('Boss',30,10),
        ('Boss afflaibie',12,6);

    INSERT INTO db.TypeSection (Libelle) VALUES
        ('Gagner'),
        ('Mort'),
        ('Combat'),
        ('Choix'),
        ('Epreuve'),
        ('Question'),
        ('Marchand');

    INSERT INTO db.Section (Id,Libelle, Description, Type, IdMonstre, Choix1, Choix2, Choix3, Direction1, Direction2, Direction3, TypeBonus1, TypeBonus2, TypeBonus3, Question, Reponse) VALUES
        (1,'Le Début du Labyrinthe', 'Vous pénétrez dans le labyrinthe obscur, la lueur des torches vacillantes éclairant à peine votre chemin. Les écritures étranges, taillées dans la roche, vous observent comme des spectres silencieux. Votre regard se pose sur trois portes massives, chacune ornée d''une inscription en langue étrangère, une langue que vous parvenez étonnamment à déchiffrer : celle de votre peuple massacré. Porte de droite : La Mort vous attend : Les mots incisifs semblent presque vous glacer le sang. Derrière cette porte, un destin funeste vous guette, un destin que vous pourriez peut-être déjouer ou affronter de front. Porte du milieu : La Grande Épreuve : Ces mots suscitent en vous un mélange d''excitation et d''appréhension. Vous vous demandez quelle forme prendra cette épreuve, mais l''idée de défier les obstacles pour gagner votre liberté vous inspire. Porte de gauche : La Simplicité : Un choix qui semble sûr, mais les apparences sont souvent trompeuses. Ce chemin pourrait réserver des surprises, bonnes ou mauvaises. La simplicité cache-t-elle vraiment un chemin vers la liberté, ou est-ce un piège ? À vous de décider quel chemin emprunter dans ce labyrinthe mystérieux. Chacune des portes pourrait vous mener vers un destin différent, alors choisissez avec prudence.',
         4,NULL,'Porte de gauche','Porte du milieu','Porte de droite',15,6,2,NULL,NULL,NULL,NULL,NULL),
        (2,'Le Long Couloir Piégé','La porte de droite s''ouvre sur un long couloir sombre et étroit, où des haches suspendues oscillent de gauche à droite dans une macabre danse. La lueur des torches ne suffit pas à éclairer pleinement ce passage, ajoutant une touche sinistre à l''ensemble. Vous réalisez avec effroi qu''il n''y a pas de marche arrière possible - la porte derrière vous est bloquée. Vous êtes contraint de traverser ce couloir périlleux, mais vous ne pouvez ignorer le danger qui vous guette à chaque instant. Vous décidez de faire preuve de prudence et de concentration, essayant de synchroniser vos mouvements avec les oscillations des haches pour passer à travers le couloir sans encombre. La moindre erreur pourrait vous coûter cher, mais c''est un risque que vous êtes prêt à prendre pour atteindre la sécurité de l''autre côté.' ,
         5,NULL,'Courir',NULL,NULL,19,20,NULL,NULL,NULL,NULL,NULL,NULL),
        (19,'l''Évasion des Pièges','Après avoir réussi à éviter les pièges mortels dans la section 2, vous parvenez enfin à vous libérer des dangers qui vous guettaient. Les haches suspendues dans le couloir ne sont plus une menace, grâce à votre habileté et à votre vigilance. Vous avez triomphé des défis de cette section du labyrinthe avec adresse et persévérance.',
         4,NULL,'Continuer',NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
        (20,'Les Blessures des Haches Piégeuses','Malheureusement, votre tentative d''évasion des pièges dans la section 2 a été un échec cuisant. Les haches suspendues ont été plus rapides que vous ne l''aviez anticipé, et vous avez été touché par plusieurs d''entre elles. Les lames acérées ont laissé des blessures douloureuses sur votre corps, vous affaiblissant mais vous laissant encore en vie.',
         4,NULL,'Continuer',NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
        (3,'La Salle du Slime','Vous entrez dans une vaste salle obscure, éclairée par une lueur étrange provenant de flaques de liquide étrange dispersées sur le sol. L''air est épais et chargé d''une odeur nauséabonde. Au centre de la pièce se dresse un énorme slime, une masse gélatineuse qui vous fixe de ses yeux globuleux avec une intensité inquiétante. Vous savez que le combat est inévitable, car la créature semble prête à vous attaquer à tout moment. Votre destin est entre vos mains alors que vous vous préparez à combattre cette créature redoutable. Faites preuve de courage et de stratégie pour en sortir victorieux.',
         3,1,'Combattre',NULL,NULL,4,5,4,NULL,NULL,3,NULL,NULL),
        (4,'Confrontation avec le Destin','Vous avez triomphé du slime, mais votre victoire est de courte durée. Vous vous retrouvez désormais dans une salle encore plus imposante, où trône un géant massif, dont la silhouette colossale semble remplir toute la pièce. Ses yeux, empreints d''une aura sévère, fixent votre petit corps avec mépris. La confrontation est inévitable, mais à mesure que vous analysez la situation, vous réalisez l''insurmontable disparité de force entre vous et cette créature gigantesque. Chaque coup que vous pourriez porter serait futile face à sa puissance incommensurable. L''acceptation commence à s''immiscer dans votre esprit : peut-être que cette fois-ci, la mort est en effet votre seule issue. Les battements de votre cœur résonnent dans vos oreilles alors que vous contemplez votre destin avec résignation.',
         4,NULL,'Accepter le destin',NULL,NULL,99,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
        (99,'La fin','Tu es mort par le géant',
         2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
        (5,'Réflexions Après la Défaite contre le Slime','Une vague de désespoir vous submerge alors que vous réalisez que votre périple a pris fin de manière prématurée. Vous aviez sous-estimé la menace représentée par ce simple slime, et maintenant, cette erreur vous a coûté la vie. Le sentiment d''échec et de déception vous envahit alors que vous vous retrouvez face à l''impitoyable réalité du game over. Les regrets tourbillonnent dans votre esprit. Vous vous demandez ce que vous auriez pu faire différemment, comment vous auriez pu éviter ce funeste destin. Mais il est trop tard pour ces questions maintenant. Vous devez accepter que dans ce labyrinthe mortel, chaque erreur peut être fatale, et celle-ci a scellé votre sort. Alors que l''écran s''assombrit et que le game over s''affiche cruellement devant vous, vous comprenez que cette fois-ci, il n''y a pas de seconde chance. C''est la fin de votre aventure, mais peut-être que quelqu''un d''autre pourra réussir là où vous avez échoué. Votre histoire se termine ici, mais le labyrinthe continue d''attendre d''autres aventuriers, prêts à relever le défi avec plus de prudence et de détermination.',
         2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
        (6,'Devant le Mur Enorme','Vous vous trouvez devant un mur colossal, sa hauteur et sa largeur imposantes défiant toute tentative de passage direct. Cependant, un léger courant d''air vous chatouille, vous indiquant qu''il y a peut-être une voie à travers cette barrière apparente. Le mur semble s''élever jusqu''à toucher le ciel obscur du labyrinthe, mais l''air frais qui s''infiltre entre ses fissures suggère une possibilité d''évasion. Choix possibles : Escalader le mur : Vous décidez de défier la verticalité du mur en tentant de l''escalader. C''est un choix audacieux, mais si vous parvenez à grimper jusqu''au sommet, vous pourriez découvrir ce qui se cache de l''autre côté. Cependant, cela pourrait être une tâche périlleuse, nécessitant force et agilité. Suivre le courant d''air : Vous choisissez de suivre le courant d''air qui se faufile entre les fissures du mur. C''est une option plus mystérieuse, mais vous avez le pressentiment qu''elle pourrait vous mener vers une issue inattendue. Peut-être que cette brise légère cache une voie secrète ou une sortie cachée que vous pourriez découvrir en suivant son chemin.' ,
         5,NULL,'Escalader le mur',NULL,'Suivre le courant d''air',21,22,7,NULL,NULL,NULL,NULL,NULL),
        (21,'Succès de l''Escalade du Mur','Votre agilité et votre détermination ont porté leurs fruits. Avec une adresse remarquable, vous parvenez à escalader le mur imposant qui se dressait sur votre chemin. Vos mouvements sont fluides, vos muscles répondent avec grâce à chaque prise, et vous vous hissez rapidement vers le sommet sans encombre.' ,
         4,NULL,'Continuer',NULL,NULL,8,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
        (22,'Échec de l''Escalade du Mur','Malheureusement, vos tentatives pour escalader le mur se soldent par un échec cuisant. Alors que vous essayez de vous hisser vers le sommet, vos mains glissent sur les aspérités rugueuses de la paroi, et vous êtes incapable de maintenir votre prise. Vous tombez lourdement au sol, vos mains abîmées par l''effort et la chute.',
         4,NULL,'Continuer',NULL,NULL,7,NULL,NULL,3,NULL,NULL,NULL,NULL),
        (7,'Devant le Coffre Mystérieux','Vous vous retrouvez devant un coffre ordinaire après avoir suivi le courant d''air à travers les fissures du mur. Vous avez renoncé à l''idée d''escalader le mur, réalisant qu''il était bien trop imposant et compliqué à gravir pour vous. Son ombre massive vous domine, vous rappelant votre impuissance face à sa verticalité intimidante. Après cet échec, votre attention se porte maintenant sur le coffre qui se tient devant vous. Choix possibles : Ouvrir le coffre : Malgré vos réserves, la tentation de découvrir le contenu du coffre est trop grande. Vous décidez de prendre le risque et d''ouvrir le coffre, espérant qu''il renferme des trésors ou des indices utiles pour votre progression dans le labyrinthe. Cependant, vous êtes conscient que l''ouverture d''un coffre dans un tel endroit pourrait également déclencher des conséquences imprévues. Ne pas ouvrir le coffre : Vous décidez de laisser le coffre là où il se trouve, craignant les possibles pièges ou dangers qu''il pourrait contenir. Vous préférez ne pas prendre de risques inutiles et continuer votre exploration du labyrinthe sans l''encombrement supplémentaire que pourrait apporter le contenu du coffre.' ,
         4,NULL,'Ouvrir le coffre','Ne pas ouvrir le coffre',NULL,8,8,NULL,8,NULL,NULL,NULL,NULL),
        (8,'Deux Portes Mystérieuses','Vous vous retrouvez devant deux portes, chacune ornée d''une inscription dans la langue de votre peuple massacré. Les symboles gravés sur les portes semblent vous défier, vous invitant à faire un choix crucial. Vous comprenez que derrière chacune de ces portes se trouve un défi redoutable, mais aussi une récompense potentielle. Le destin vous offre une chance de prouver votre valeur dans ce labyrinthe impitoyable. Choix possibles : Combat Facile : Vous optez pour la voie du combat facile, espérant surmonter rapidement ce défi pour atteindre la récompense qui vous attend de l''autre côté. Vous savez que cette option pourrait vous offrir une victoire plus rapide, mais vous vous demandez si la récompense en vaudra vraiment la peine. Combat Difficile : Vous décidez de relever le défi du combat difficile, sachant que la route vers la récompense sera semée d''embûches. Vous êtes prêt à affronter les dangers et les adversaires redoutables qui vous attendent, convaincu que la récompense sera à la hauteur de vos efforts.',
         4,NULL,'Combat Facile','Combat Difficile',NULL,9,10,NULL,NULL,NULL,NULL,NULL,NULL),
        (9,'Le Gobelin','Vous avez choisi le combat simple, et devant vous se dresse un gobelin, petit mais déterminé. Son regard féroce et sa posture agressive trahissent sa volonté farouche de vous vaincre. Malgré sa taille modeste, vous sentez une aura de danger émaner de lui, une détermination à défendre son territoire contre toute intrusion. Affrontez le gobelin dans un combat qui pourrait sembler trivial, mais ne sous-estimez pas sa détermination à vous vaincre. Sa petite taille pourrait dissimuler une agilité surprenante et une ruse inattendue. Soyez prêt à faire face à tous les moyens qu''il pourrait utiliser pour vous battre.',
         3,2,'Combattre',NULL,NULL,14,11,14,NULL,NULL,3,NULL,NULL),
        (10,'l''Orc','Vous avez opté pour le défi du combat difficile, et maintenant vous faites face à un redoutable adversaire : un orc massif, une force brute dont la présence emplit la pièce. Son regard fier et ses muscles puissants laissent peu de place au doute : vous êtes confronté à un guerrier redoutable, prêt à tout pour vous terrasser. Affrontez l''orc dans un combat où chaque coup pourrait être fatal. Sa force impressionnante et sa maîtrise des armes font de lui un adversaire redoutable, et vous savez que la moindre erreur pourrait sceller votre destin. Vous sentez la pression de la bataille peser sur vos épaules alors que vous vous préparez à affronter cet adversaire redoutable.',
         3,3,'Combattre',NULL,NULL,13,12,13,NULL,NULL,3,NULL,NULL),
        (11,'Défaite dans le Combat','Votre combat contre l''adversaire s''est soldé par une défaite cuisante. Malgré vos efforts, votre adversaire était trop puissant, trop habile, et vous n''avez pas réussi à le vaincre. La douleur de votre défaite vous envahit alors que vous réalisez que c''est la fin de votre parcours dans ce labyrinthe impitoyable. Vous vous effondrez, épuisé et blessé, sur le sol de la salle où vous avez rencontré votre adversaire. Votre souffle est court, votre vision se trouble, et vous savez que c''est la fin de votre aventure. Votre quête pour la liberté s''achève ici, mais peut-être qu''une autre âme courageuse reprendra le flambeau là où vous avez échoué.',
         2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
        (12,'Objet Bonus','Description : Votre combat contre l''adversaire s''est soldé par une défaite cuisante. Malgré vos efforts, votre adversaire était trop puissant, trop habile, et vous n''avez pas réussi à le vaincre. La douleur de votre défaite vous envahit alors que vous réalisez que c''est la fin de votre parcours dans ce labyrinthe impitoyable.Conséquence : Vous vous effondrez, épuisé et blessé, sur le sol de la salle où vous avez rencontré votre adversaire. Votre souffle est court, votre vision se trouble, et vous savez que c''est la fin de votre aventure. Votre quête pour la liberté s''achève ici, mais peut-être qu''une autre âme courageuse reprendra le flambeau là où vous avez échoué.',
         4,NULL,'Récuperer l''objet',NULL,NULL,14,NULL,NULL,11,NULL,NULL,NULL,NULL),
        (13,'Source de Régénération','Après une lutte acharnée, vous parvenez finalement à terrasser l''orc imposant. Sa puissante épée gît à vos pieds, un trophée de votre victoire bien méritée. Vous la ramassez, sentant son poids et sa solidité entre vos mains, une arme redoutable qui pourrait s''avérer précieuse dans les batailles à venir. Cependant, votre exploration ne s''arrête pas là. Alors que vous avancez dans la salle, vous découvrez une source claire et limpide, émanant une aura de pureté et de revitalisation. Instinctivement, vous approchez et plongez vos mains dans l''eau fraîche. Une sensation de chaleur se propage dans votre corps alors que la source régénératrice restaure toute votre endurance épuisée par le combat. Vous vous sentez revigoré, prêt à affronter les défis restants avec une nouvelle énergie et une détermination renouvelée. Avec l''épée de l''orc à vos côtés et votre endurance restaurée, vous vous engagez à poursuivre votre quête avec courage et résolution.',
         4,NULL,'Prendre un bain',NULL,NULL,14,NULL,NULL,13,NULL,NULL,NULL,NULL),
        (14,'Rencontre avec le Personnage Mystérieux','Alors que vous progressez dans le labyrinthe, vous rencontrez un personnage énigmatique qui semble émerger des ombres. Son visage est partiellement dissimulé par une capuche sombre, ajoutant à son mystère. Il vous fixe de ses yeux pénétrants et vous adresse une question inattendue sur le nom du labyrinthe. Échange : Le personnage mystérieux vous interroge sur le nom du labyrinthe. C''est une question simple en apparence, mais vous ressentez qu''elle est chargée de significations plus profondes. Vous vous demandez quelles pourraient être les implications de votre réponse, mais vous comprenez que votre choix pourrait avoir des conséquences sur votre parcours dans ce dédale complexe. Prêt à relever ce défi intellectuel, vous vous apprêtez à répondre avec prudence et réflexion, sachant que chaque mot pourrait être crucial dans votre progression à travers le labyrinthe mystérieux.',
         6,NULL,NULL,NULL,NULL,23,24,NULL,12,7,NULL,'Quel est le nom du labyrinthe ?','Cayden'),
        (15,'Rencontre avec la Personne Enchaînée','Après avoir choisi la porte de gauche au début du labyrinthe, vous vous retrouvez face à une scène troublante. Une personne est enchaînée à un mur, semblant avoir été retenue prisonnière dans ce labyrinthe sinistre. Son regard épuisé vous implore silencieusement, implorant de l''aide. Choix possibles : Lui venir en aide : Vous décidez d''agir avec compassion et de libérer la personne enchaînée. Vous vous approchez d''elle, cherchant un moyen de briser ses chaînes et de lui offrir la liberté. Vous sentez que c''est la bonne chose à faire, même si cela implique de prendre un risque dans ce lieu dangereux. Rien faire : Vous hésitez à intervenir, craignant les possibles conséquences de votre action. Peut-être que cette personne est piégée pour une raison, et vous ne voulez pas vous impliquer dans des affaires qui pourraient vous causer des ennuis. Vous choisissez de passer outre et de continuer votre chemin, ignorant les appels à l''aide de la personne enchaînée.',
         4,NULL,'Lui venir en aide','Rien faire',NULL,23,24,NULL,10,NULL,NULL,NULL,NULL),
        (16,'Confrontation avec le Gobelin','Alors que vous avancez dans le labyrinthe, un gobelin surgit soudainement devant vous, prêt à vous attaquer. Sa silhouette frêle cache une férocité redoutable, et vous savez que le combat est inévitable. Les griffes acérées du gobelin scintillent à la lueur des torches, et ses yeux brillent d''une lueur malveillante.,Vous vous préparez mentalement à affronter le gobelin dans un duel à mort. Il n''y a pas de place pour la négociation ou la fuite dans ce combat. Votre seule option est de vaincre cet adversaire agile et imprévisible pour continuer votre progression à travers le labyrinthe. La victoire dépend de votre habileté au combat et de votre détermination à survivre.',
         3,NULL,'Combattre',NULL,NULL,18,17,18,NULL,NULL,3,NULL,NULL),
        (17,'Défaite contre le Gobelin','Malgré vos efforts, vous êtes finalement tombé face à la férocité du gobelin. Sa rapidité et son agilité ont eu raison de vous, et vous n''avez pas été en mesure de vous défendre efficacement contre ses attaques. Vous vous effondrez sur le sol du labyrinthe, sentant la vie vous quitter alors que vous réalisez que vous étiez trop faible pour surmonter les défis de ce lieu impitoyable. La défaite est amère alors que vous vous rendez compte que le labyrinthe a eu raison de vous. Votre aventure prend fin ici, votre corps reposant dans les ténèbres du dédale labyrinthique. Votre quête pour la liberté se termine tragiquement, mais peut-être que d''autres aventuriers seront plus aptes à relever le défi là où vous avez échoué.' ,
         2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
        (18,'Deux Statues','Après votre combat contre le gobelin, vous vous retrouvez devant deux statues imposantes. Leurs regards fixes semblent pénétrer votre âme, vous évaluant avec une attention intense. À leurs pieds, une inscription dans le langage de votre peuple est gravée dans la pierre, énigmatique et mystérieuse : "Priez une statue et le chemin s''ouvrira." Choix possibles : Prier la première statue : Vous décidez d''approcher la première statue et de vous agenouiller devant elle, formulant une prière silencieuse dans l''espoir que cela ouvrira le chemin devant vous. Vous ressentez une aura de solennité alors que vous vous engagez dans ce geste sacré, espérant que votre acte sera favorablement reçu par les puissances qui veillent sur ce labyrinthe. Prier la deuxième statue : Vous choisissez de vous tourner vers la deuxième statue et de lui adresser vos prières. Vous ressentez une certaine résonance avec cette statue, une connexion instinctive qui vous pousse à lui accorder votre dévotion. Avec une foi inébranlable, vous formulez vos vœux les plus sincères dans l''espoir que cela débloquera le chemin vers la liberté.',
         4,NULL,'Prier la première statue','Prier la deuxième statue',NULL,14,14,NULL,1,6,NULL,NULL,NULL),
        (23,'Récompense du Personnage Mystérieux','Après avoir répondu à la question du personnage mystérieux, il vous regarde attentivement, évaluant votre réponse. Puis, avec un sourire énigmatique, il vous tend la potion. Sans un mot, il vous indique que cette potion est une récompense pour votre sagacité ou votre bravoure, une offrande destinée à vous aider dans votre quête. Vous acceptez la potion avec reconnaissance, comprenant que c''est un précieux don qui pourrait vous être utile dans les épreuves à venir. Avec la potion maintenant à votre disposition, vous vous sentez mieux préparé pour affronter les défis du labyrinthe et poursuivre votre quête avec détermination.',
         4,NULL,'Prendre la potion et continuer',NULL,NULL,25,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
        (24,'Malédiction du Personnage Mystérieux','Après avoir donné une réponse qui ne satisfait pas le personnage mystérieux, son visage se tord de mécontentement. Ses yeux étincellent d''une lueur sombre alors qu''il profère des insultes cinglantes, emplies de colère et de mépris. Vous réalisez que vous avez froissé une sensibilité ou déçu une attente, déclenchant la colère du mystérieux individu. Dans un geste de vengeance, le personnage mystérieux lève sa main et prononce une incantation. Vous ressentez alors un frisson désagréable parcourir votre être, comme si quelque chose en vous changeait. Vous comprenez que vous avez été maudit, votre chance semblant soudainement diminuer, rendant chaque tâche future plus ardue.',
         4,NULL,'Fuir',NULL,NULL,25,NULL,NULL,7,NULL,NULL,NULL,NULL),
        (25,'Le Choix des Portes','Vous vous tenez devant deux portes, toutes deux semblant identiques. Aucun signe distinctif ne vous aide à déterminer quelle porte choisir, et aucune inscription ne vous guide dans votre décision. Vous ne percevez aucune indication quant à ce qui se trouve derrière chacune de ces portes.',
         4,NULL,'Porte 1','Porte2',NULL,26,27,NULL,NULL,NULL,NULL,NULL,NULL),
        (26,'Impasse','Vous avancez à travers la porte que vous avez choisie avec prudence, mais vous réalisez rapidement que vous vous trouvez dans une impasse. Les murs autour de vous semblent fermés et aucun autre chemin n''est visible. C''est un cul-de-sac, un point mort dans votre progression à travers le labyrinthe. Découverte : Cependant, alors que vous inspectez les environs, vous remarquez un petit objet abandonné près du mur. Il semble avoir été laissé là par un autre aventurier ou peut-être par un habitant du labyrinthe lui-même. Malgré l''impasse, cette découverte inattendue vous intrigue.',
         4,NULL,'Marche arriere',NULL,NULL,25,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
        (27,'Rencontre avec le Monstre','Vous vous retrouvez face à face avec un monstre redoutable, une créature dont l''apparence terrifiante en dit long sur sa dangerosité. Ses crocs acérés brillent d''une lueur menaçante, et son regard fixe vous transperce avec une intensité sinistre. Vous savez que vous devez prendre une décision rapidement pour assurer votre survie dans cette situation périlleuse. Options : Marcher doucement pour l''éviter : Vous choisissez d''adopter une approche furtive, espérant passer inaperçu devant le monstre. Vous vous déplacez avec précaution, essayant de ne pas attirer son attention alors que vous tentez de contourner la créature sans déclencher son courroux. Combattre fièrement : Vous décidez de faire face au monstre avec courage et détermination. Vous dégainez vos armes, prêt à engager le combat et à affronter la créature avec toute votre force. Vous êtes déterminé à vaincre le monstre et à prouver votre valeur dans cette confrontation dangereuse. Passer le fossé mortel : Vous remarquez un fossé profond près de la créature, une chute dans lequel serait certainement mortelle. Cependant, vous décidez de prendre le risque et de tenter de passer de l''autre côté, espérant que cette voie vous mènera à la sécurité sans avoir à affronter le monstre directement.',
         4,NULL,'Marcher doucement pour l''éviter','Combattez fièrement','Passer le fossé mortel',28,29,30,NULL,NULL,NULL,NULL,NULL),
        (28,'Traversée Lente et Prudente','Vous optez pour la stratégie de traverser lentement et prudemment, espérant éviter toute erreur fatale dans votre progression. Avec une concentration intense, vous avancez pas à pas, en surveillant attentivement votre environnement pour repérer tout danger potentiel.',
         5,NULL,'Prudence',NULL,NULL,42,29,NULL,NULL,NULL,NULL,NULL,NULL),
        (29,'Confrontation avec le Chevalier Fantome','Vous avez choisi de faire face au chevalier Fantome avec courage et détermination. Face à vous se tient un guerrier noble, vêtu d''une armure brillante et brandissant une épée imposante. Son regard est ferme, mais vous pouvez voir une lueur de défi dans ses yeux alors qu''il se prépare au combat. Déroulement : Vous vous engagez dans le combat avec résolution, déterminé à prouver votre valeur contre ce chevalier redoutable. Les lames s''entrechoquent dans une danse mortelle, chaque coup porté avec force et précision. Vous luttez avec habileté, cherchant les failles dans la défense de votre adversaire tout en protégeant vos propres points faibles.',
         3,4,'Combattre',NULL,NULL,42,41,42,NULL,NULL,3,NULL,NULL),
        (30,'Traversée du Fossé Mortel','Vous décidez de prendre le risque et de traverser le fossé mortel, espérant que cela vous mènera à la sécurité sans avoir à affronter le monstre. Le fossé s''étend devant vous, sombre et menaçant, et vous savez que chaque pas que vous ferez sera crucial pour votre survie. Déroulement : Avec précaution, vous vous approchez du bord du fossé, évaluant la distance et les dangers potentiels. Après un moment de réflexion, vous prenez une profonde inspiration et vous lancez dans une course déterminée, sautant par-dessus le fossé avec toute la force et l''agilité dont vous êtes capable.',
         5,NULL,'Traversée',NULL,NULL,31,32,NULL,NULL,NULL,NULL,NULL,NULL),
        (31,'Choix des Couloirs', 'Après avoir traversé avec succès le fossé mortel, vous vous retrouvez face à deux nouveaux couloirs. Chacun semble présenter ses propres défis uniques, et vous devez choisir lequel emprunter en fonction de votre intuition et de votre analyse de la situation. Options : Couloir avec des Murs qui Sifflent : Vous remarquez que le premier couloir est bordé de murs qui semblent émettre un sifflement menaçant. Des flèches sont gravées dans les parois, indiquant que ce chemin n''est pas sans danger. Vous vous demandez ce qui pourrait déclencher ces pièges et comment les éviter. Couloir avec des Murs qui se Serrent : Le deuxième couloir est quant à lui flanqué de murs qui se resserrent progressivement à mesure que vous avancez. Vous pouvez sentir la claustrophobie monter en vous rien qu''en imaginant être pris au piège dans ce passage étroit. Vous vous demandez si vous serez capable de traverser sans être écrasé.',
         4,NULL,'Couloir avec des Murs qui se Serrent','Couloir avec des Murs qui Sifflent',NULL,33,37,NULL,NULL,NULL,NULL,NULL,NULL),
        (32,'Mort dans le Fossé','Malheureusement, votre choix s''est avéré fatal. Alors que vous tentiez de traverser le fossé, vous avez commis une erreur fatale, conduisant à votre chute dans l''abîme mortel. Vous vous rendez compte trop tard que c''était le mauvais choix, et maintenant il n''y a plus d''échappatoire. Conséquences : Vous vous écrasez au fond du fossé, vos derniers moments emplis de regrets et de désespoir. Votre quête pour la liberté se termine tragiquement ici, dans les profondeurs sombres du labyrinthe, une leçon durement apprise sur les conséquences de vos décisions. C''est un triste destin, mais peut-être que d''autres aventuriers apprendront de votre erreur et parviendront à éviter le même sort funeste.',
         2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
        (33,'Couloir avec des Murs qui se Serrent','Vous choisissez le couloir flanqué de murs qui se resserrent progressivement à mesure que vous avancez. Vous ressentez une légère anxiété alors que les parois semblent se refermer lentement sur vous, mais vous continuez à avancer avec prudence, espérant trouver une issue de l''autre côté. Déroulement : À mesure que vous progressez dans le couloir, vous sentez les murs se rapprocher de plus en plus, vous obligeant à avancer avec encore plus de prudence pour éviter d''être écrasé. Chaque pas est calculé, chaque mouvement est mesuré, alors que vous luttez pour rester calme malgré la pression croissante des murs qui se referment autour de vous.',
         2,NULL,'Courir',NULL,NULL,35,34,NULL,NULL,NULL,NULL,NULL,NULL),
        (34,'Écrasé par les Murs','Malheureusement, le passage que vous avez choisi se révèle être un piège mortel. Alors que vous avancez dans le couloir, les murs commencent à se resserrer de plus en plus, vous laissant de moins en moins d''espace pour vous déplacer. Déroulement : Malgré vos efforts pour avancer rapidement, les murs continuent de se rapprocher inexorablement. Bientôt, ils se resserrent tellement que vous êtes écrasé contre eux, votre souffle coupé et vos os broyés par la pression implacable. Conséquences : Vous succombez à vos blessures dans l''étroitesse oppressante du couloir, réalisant trop tard que c''était un piège mortel. Votre quête pour la liberté se termine ici, ensevelie sous les murs du labyrinthe. C''est un triste destin, mais peut-être que d''autres aventuriers apprendront de votre erreur et choisiront un chemin plus sûr.',
         2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
        (35,'Rencontre avec le Personnage Secourable','Après avoir réussi à passer le piège mortel des murs qui se resserrent, vous vous retrouvez fatigué et épuisé. Alors que vous avancez, vous apercevez un personnage mystérieux qui tend la main vers vous. Son visage est bienveillant et sa présence apaise quelque peu votre fatigue. Déroulement : Vous vous approchez du personnage avec prudence, vous demandant ce qu''il veut de vous. Il vous regarde avec compassion, puis il vous fait signe de lui donner quelque chose. Vous réalisez que vous pourriez avoir quelque chose d''utile à échanger avec lui.',
         4,NULL,'Données Objet','Ignorer',NULL,36,39,NULL,NULL,NULL,NULL,NULL,NULL),
        (36,'Découverte du Chemin de Sortie','Après avoir interagi avec le personnage secourable, vous ressentez un soulagement mêlé d''espoir lorsque celui-ci vous montre un chemin caché qui semble mener à la sortie du labyrinthe. Vous êtes rempli d''une nouvelle détermination à échapper à ce dédale dangereux. Déroulement : Vous suivez attentivement le personnage à travers le chemin caché, restant sur vos gardes mais confiant dans la possibilité de trouver enfin la liberté. Le chemin est étroit et sombre, mais vous vous y engagez avec détermination, poussé par l''espoir d''une échappatoire. Résultat : Après un certain temps de marche, vous finissez par atteindre une sortie secrète, dissimulée aux yeux des autres prisonniers du labyrinthe. La lumière du jour vous aveugle lorsque vous émergez à l''extérieur, mais vous respirez profondément l''air frais de la liberté retrouvée. Vous remerciez le personnage pour son aide précieuse, reconnaissant d''avoir trouvé un allié dans ce dédale hostile. Victoire ! Vous avez échappé au labyrinthe et trouvé votre liberté.',
         1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
        (37,'Traversée du Mur de Flèches','Vous vous préparez mentalement à traverser le couloir bordé de murs qui sifflent et arborent des flèches menaçantes. Vous savez que ce sera un défi périlleux, mais vous êtes déterminé à surmonter les obstacles pour avancer dans le labyrinthe.',
         5,NULL,'Courrir',NULL,NULL,35,38,NULL,NULL,NULL,NULL,NULL,NULL),
        (38,'Transpercé par les Flèches','Malheureusement, malgré vos meilleures tentatives pour éviter les flèches, vous êtes finalement touché par l''une d''entre elles. La flèche transperce votre corps avec une force mortelle, vous laissant sans défense alors que vous vous effondrez sur le sol du couloir. Conséquences : Vous ressentez une douleur lancinante alors que vous sentez votre force vitale vous échapper. Vous comprenez que votre quête pour la liberté prend fin ici, dans ce couloir mortel du labyrinthe. Vos derniers instants sont emplis de douleur et de regrets, regrettant peut-être les choix qui vous ont conduit à cette fin tragique.',
         2,NULL,'Courrir',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
        (39,'Confrontation avec le Géant', 'Vous vous retrouvez face à un monstre gigantesque, un Géant dont la taille imposante remplit le couloir de son ombre menaçante. Son regard vous fixe avec une intensité redoutable, et vous savez que le combat contre une créature aussi colossale ne sera pas sans danger.Déroulement : Malgré le danger imminent, vous sentez une vague de détermination monter en vous. Vous savez que vous avez la possibilité de combattre le Géant, mais vous réalisez également que la mort pourrait vous attendre au bout de ce combat épique. Cependant, votre désir de continuer votre quête pour la liberté est plus fort que votre peur, et vous décidez de faire face au Géant avec courage.',
         3,5,'Combattre',NULL,NULL,40,40,40,NULL,NULL,3,NULL,NULL),
        (40,'Écrasé par le Géant','Face à la menace imposante du Géant, vous tentez courageusement de combattre la créature colossale. Cependant, malgré vos efforts vaillants, vous êtes submergé par sa force écrasante. Le Géant vous écrase impitoyablement sous son poids, mettant fin à votre quête dans le labyrinthe.Conséquences : Vous ressentez une douleur écrasante alors que vous êtes écrasé sous le pied du Géant. Vos derniers moments sont emplis de souffrance et de désespoir, réalisant que votre bravoure n''a pas été suffisante pour surmonter ce redoutable adversaire. Peut-être que si vous aviez cherché de l''aide auprès du personnage rencontré précédemment, votre destin aurait pu être différent.' , 
         2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
        (41,'Défaite contre le Chevalier Fantôme','Vous affrontez courageusement le chevalier fantôme, mais malgré vos efforts, vous êtes vaincu par sa puissance surnaturelle. Ses attaques spectrales vous submergent, et vous êtes incapable de résister à sa force implacable.Conséquences : Vous ressentez une douleur fantomatique alors que les attaques du chevalier fantôme vous traversent, laissant votre corps sans défense. Vos forces vous quittent peu à peu, et vous comprenez que vous n''avez pas réussi à vaincre ce redoutable adversaire. C''est une défaite amère qui met fin à votre aventure dans le labyrinthe.Game Over. Votre quête prend fin ici, vaincue par les forces surnaturelles du chevalier fantôme.' , 
         2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
        (42,'Rencontre avec le Marchand','Vous rencontrez un marchand dans le labyrinthe, une rare lueur d''espoir dans cet environnement hostile. Il vous propose deux objets : une épée et un bouclier, des outils qui pourraient être essentiels pour votre survie dans ce dédale dangereux.Options :Acheter l''Épée : Vous décidez d''acheter l''épée, espérant qu''elle vous aidera à affronter les dangers qui vous attendent. Vous remettez au marchand la somme demandée en échange de l''arme tranchante.Acheter le Bouclier : Vous optez pour l''achat du bouclier, pensant qu''il sera plus judicieux de vous défendre des attaques ennemies. Vous payez le marchand pour obtenir cette protection supplémentaire.Refuser d''Acheter : Vous décidez de ne pas acheter ni l''épée ni le bouclier, gardant votre argent pour d''autres éventualités. Vous remerciez poliment le marchand mais continuez votre chemin sans rien acheter.',
         7,NULL,'Epee 10 piece d''or','Bouclier 10 piece d''or ','Refuser d''Acheter',43,43,43,15,16,NULL,NULL,NULL),
        (43 ,'Confrontation avec le Boss du Labyrinthe','Vous avez finalement trouvé le boss redoutable du labyrinthe, une créature redoutable qui règne sur ce dédale dangereux. Vous vous tenez devant une porte massive, derrière laquelle se trouve le monstre redouté.Options :Ouvrir la Porte et Affronter le Boss : Vous choisissez de faire face au boss directement, ouvrant la porte et vous préparant à affronter la créature redoutable. Vous êtes prêt à tester votre courage et vos compétences dans un combat épique pour la liberté.Tenter une Attaque par Surprise : Vous décidez d''essayer une approche furtive en tentant une attaque par surprise contre le boss. Vous cherchez un moyen de contourner ses défenses et de l''attaquer quand il s''y attend le moins, espérant ainsi obtenir un avantage dans le combat à venir.',
         4,NULL,'Ouvrir la Porte et Affronter le Boss','Tenter une Attaque par Surprise',NULL,48,44,NULL,NULL,NULL,NULL,NULL,NULL),
        (44,'Attaque par Surprise depuis le Haut','Vous choisissez de tenter une attaque par surprise en escaladant par-dessus et en vous préparant à attaquer le boss depuis une position avantageuse.Déroulement : Avec agilité et discrétion, vous escaladez habilement jusqu''à une position en hauteur, vous permettant de surplomber le boss sans être remarqué. Vous observez la créature attentivement, cherchant le moment opportun pour lancer votre attaque.',
         5,NULL,'Attaque',NULL,NULL,45,46,NULL,NULL,NULL,NULL,NULL,NULL),
        (45,'Affrontement après une Attaque Surprise Réussie','Votre attaque surprise a porté ses fruits, mais malgré le bras coupé, le boss reste debout, prêt à poursuivre le combat. Vous devez maintenant affronter la créature blessée, sachant que votre victoire est loin d''être garantie.',
         4,NULL,'Combattre',NULL,NULL,47,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
        (46,'Échec de l''Attaque Surprise, Confrontation avec le Boss à Pleine Puissance','Malgré vos efforts pour lancer une attaque surprise réussie, vous êtes découvert par le boss avant de pouvoir exécuter votre plan. Maintenant, vous devez affronter le boss à pleine puissance, sans avoir pu profiter de l''avantage d''une attaque surprise.',
         4,NULL,'Combattre',NULL,NULL,48,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
        (47,'Affrontement avec le Boss Affaibli','Le combat fait rage entre vous et le boss, qui montre des signes d''affaiblissement après avoir subi des blessures précédentes. Vous ressentez un mélange d''excitation et de détermination alors que vous réalisez que la victoire est à portée de main.',
        3,7,'Combattre',NULL,NULL,49,50,49,NULL,NULL,3,NULL,NULL),
        (48,'Affrontement avec le Boss','Le combat fait rage entre vous et le boss, qui montre des signes d''affaiblissement après avoir subi des blessures précédentes. Vous ressentez un mélange d''excitation et de détermination alors que vous réalisez que la victoire est à portée de main.',
        3,6,'Combattre',NULL,NULL,49,50,49,NULL,NULL,3,NULL,NULL),
        (50,'Mort contre le Boss','Malheureusement, malgré vos efforts acharnés, le combat contre le boss s''avère être votre dernière bataille. Vous êtes submergé par la force implacable de la créature, vos blessures devenant trop graves pour que vous puissiez continuer à vous battre. Vous sentez vos forces vous quitter alors que vous succombez aux attaques dévastatrices du boss. Votre vision se brouille alors que vous tombez au sol, réalisant que votre quête pour la liberté s''achève tragiquement ici, dans les profondeurs du labyrinthe.',
         2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
        (49,'Victoire et Découverte du Trésor','Après un combat acharné et une victoire sur le dernier ennemi, vous vous retrouvez dans une salle étincelante au trésor, votre récompense pour avoir surmonté tous les défis du labyrinthe. La lumière dorée réfléchie par les richesses vous éblouit, et un sentiment d''espoir et de triomphe remplit votre cœur. Vous avancez avec prudence dans la salle, admirant les trésors qui s''étalent devant vous. Des coffres ornés de joyaux précieux, des artefacts anciens et des montagnes de pièces d''or vous entourent, témoignant de la richesse accumulée dans ce lieu mystérieux. Vous savez que parmi ces trésors se trouve ce que vous devez ramener au roi pour obtenir votre liberté tant désirée. Vous fouillez la salle à la recherche de l''objet précieux que vous devez rapporter au roi. Après avoir cherché un moment, vous le découvrez enfin, brillant de mille feux parmi les autres trésors. Vous le ramassez avec précaution, sachant que c''est la clé de votre libération. Avec le trésor en votre possession, vous vous préparez à retourner auprès du roi, espérant que votre bravoure et vos exploits seront récompensés par votre liberté retrouvée.',
         1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL)
    ;

-- Test pour les statistique
-- INSERT INTO db.Joueur (Nom, Section, Sections, MaxHabilite, Habilite, MaxEndurance, Endurance, MaxChance, Chance, PieceOr, Potion, Arme, Bouclier, Bijou, Isfinish)
-- VALUES 
-- ('Joueur1', 49, '1,2,3,24,36,49', 10, 10, 10, 10, 10, 10, 10, 'Potion1', 'Arme1', 'Bouclier1', 'Bijou1', TRUE),
-- ('Joueur2', 5, '1,2,3,23,5', 10, 10, 10, 10, 10, 10, 10, 'Potion2', 'Arme2', 'Bouclier2', 'Bijou2', TRUE)
-- ;


END
$$;