DROP DATABASE IF EXISTS iCare;
CREATE DATABASE iCare;
USE iCare; 

# Table of Users
CREATE TABLE Users (
	email varchar(50) NOT NULL,
	pass varchar(300) NOT NULL,
    dateCreated date,
	PRIMARY KEY (email)
);

# Table of Notification Sounds
CREATE TABLE NotificationSounds (
	soundName varchar(50) NOT NULL,
    path varchar(200) NOT NULL,
    PRIMARY KEY (soundName)
);

# Table of User Preferences
CREATE TABLE UserPreferences (
	email varchar(50),
    displayName varchar(50) DEFAULT "Display Name",
    notiInterval int DEFAULT 20,
    notiSound varchar(50),				# DEFAULT
    notiSoundOn boolean DEFAULT TRUE,
    dataUsageOn bool DEFAULT TRUE,
    appUsageOn bool DEFAULT TRUE,
    PRIMARY KEY (email),
    FOREIGN KEY (email) REFERENCES Users (email)  ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (notiSound) REFERENCES NotificationSounds (soundName)
);

# Table of Data Usage
CREATE TABLE DataUsage (
	email varchar(50),
    screenTime int DEFAULT 0,				# Tracks amount of screentime in minutes
    timerCount int DEFAULT 0,			# Tracks amount of times the timer has been used
    usageDate date,					
    PRIMARY KEY (email, usageDate),
    FOREIGN KEY (email) REFERENCES Users (email)  ON DELETE CASCADE ON UPDATE CASCADE
);

# Table of AppUsage
CREATE TABLE AppUsage (
	email varchar(50),
    appName varchar(50) NOT NULL,
    appTime int DEFAULT 0,				# Tracks amount of apptime in minutes
    usageDate date,					
    PRIMARY KEY (email, appName, usageDate),
    FOREIGN KEY (email) REFERENCES Users (email)  ON DELETE CASCADE ON UPDATE CASCADE
);

#--------------------------------------
# Trigger: Before creating a new user - sets the dateCreated for the new user
DROP TRIGGER IF EXISTS BeforeInsertUsers; 
DELIMITER $$
CREATE TRIGGER BeforeInsertUsers BEFORE INSERT ON Users
FOR EACH ROW BEGIN
		SET NEW.dateCreated=CURDATE() ;
END;
$$
DELIMITER ;

# Trigger: After creating a new user 
# - creates the UserPreferences entry for the new user
# - creates a starting datausage entry for the new user
DROP TRIGGER IF EXISTS AfterInsertUsers; 
DELIMITER $$
CREATE TRIGGER AfterInsertUsers AFTER INSERT ON Users
FOR EACH ROW BEGIN
		INSERT INTO UserPreferences (email) VALUES (NEW.email);
        INSERT INTO DataUsage (email) VALUES (NEW.email);
END;
$$
DELIMITER ;

# Trigger: Before creating the UserPreferences entry
# - sets the default notifcation sound (Leaf)
DROP TRIGGER IF EXISTS BeforeInsertUserPreferences; 
DELIMITER $$
CREATE TRIGGER BeforeInsertUserPreferences BEFORE INSERT ON UserPreferences
FOR EACH ROW BEGIN
		SET NEW.notiSound='Leaf';
END;
$$
DELIMITER ;

# Trigger: Creating a new DataUsage entry - sets the usageDate for the new DataUsage entry
DROP TRIGGER IF EXISTS BeforeInsertDataUsage; 
DELIMITER $$
CREATE TRIGGER BeforeInsertDataUsage BEFORE INSERT ON DataUsage
FOR EACH ROW BEGIN
	
    DECLARE usageOn bool;
    SELECT dataUsageOn INTO usageOn FROM UserPreferences WHERE email=NEW.email;
    
    IF (usageOn) THEN
		SET NEW.usageDate=CURDATE();
	ELSE
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "Data Usage is Disabled";
    END IF;
END;
$$
DELIMITER ;

# Trigger: Updating a DataUsage entry - updates the screentime/timesTimerUsed for the DataUsage entry
DROP TRIGGER IF EXISTS BeforeUpdateDataUsage; 
DELIMITER $$
CREATE TRIGGER BeforeUpdateDataUsage BEFORE Update ON DataUsage
FOR EACH ROW BEGIN
	
    DECLARE usageOn bool;
    SELECT dataUsageOn INTO usageOn FROM UserPreferences WHERE email=NEW.email;
    
    IF (!usageOn) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "Data Usage is Disabled";
    END IF;
END;
$$
DELIMITER ;

# Trigger: Creating a new AppUsage entry - sets the usageDate for the new AppUsage entry
DROP TRIGGER IF EXISTS BeforeInsertAppUsage; 
DELIMITER $$
CREATE TRIGGER BeforeInsertAppUsage BEFORE INSERT ON AppUsage
FOR EACH ROW BEGIN
	
    DECLARE usageOn bool;
    SELECT appUsageOn INTO usageOn FROM UserPreferences WHERE email=NEW.email;
    
    IF (usageOn) THEN
		SET NEW.usageDate=CURDATE();
	ELSE
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "Data Usage is Disabled";
    END IF;
END;
$$
DELIMITER ;

# Trigger: Updating a AppUsage entry - updates the screentime/timesTimerUsed for the AppUsage entry
DROP TRIGGER IF EXISTS BeforeUpdateAppUsage; 
DELIMITER $$
CREATE TRIGGER BeforeUpdateAppUsage BEFORE Update ON AppUsage
FOR EACH ROW BEGIN
	
    DECLARE usageOn bool;
    SELECT appUsageOn INTO usageOn FROM UserPreferences WHERE email=NEW.email;
    
    IF (!usageOn) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "Data Usage is Disabled";
    END IF;
END;
$$
DELIMITER ;



# ----------------------------------------------------------------------
# mysql --local-infile -u root -p
# source iCare.sql

# Basic Notification Sound Inserts 
INSERT INTO NotificationSounds VALUES ('Leaf', '/root/2021-spring-cs160-team-paladins/database/Sounds/Leaf.ogg');
INSERT INTO NotificationSounds VALUES ('Butterfly', '/root/2021-spring-cs160-team-paladins/database/Sounds/Butterfly.ogg');
INSERT INTO NotificationSounds VALUES ('Party Favor', '/root/2021-spring-cs160-team-paladins/database/Sounds/PartyFavor.ogg');

# Basic Inserts
INSERT INTO Users (email, pass) VALUES ('default@gmail.com', 'pass');
INSERT INTO Users (email, pass) VALUES ('hello@gmail.com', 'pass');
INSERT INTO Users (email, pass) VALUES ('basic@gmail.com', 'pass');
