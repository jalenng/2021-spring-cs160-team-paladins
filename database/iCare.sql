DROP DATABASE IF EXISTS iCare;
CREATE DATABASE iCare;
USE iCare; 

# Table of Users
CREATE TABLE Users (
	id int NOT NULL AUTO_INCREMENT,
	email varchar(50) NOT NULL UNIQUE,
	pass varchar(300) NOT NULL,
    displayName varchar(50) NOT NULL,
    dateCreated date,
	PRIMARY KEY (id)
);

# Table of User Preferences
CREATE TABLE UserPreferences (
	email varchar(50),
    notiInterval int DEFAULT 20,
    notiSound varchar(200) DEFAULT '../../sounds/Long Expected.mp3',
    notiSoundOn boolean DEFAULT TRUE,
    timerUsageOn bool DEFAULT TRUE,
    appUsageOn bool DEFAULT TRUE,
    PRIMARY KEY (email),
    FOREIGN KEY (email) REFERENCES Users (email)  ON DELETE CASCADE ON UPDATE CASCADE
);

# Table of Timer Usage
CREATE TABLE TimerUsage (
	email varchar(50),
    screenTime int DEFAULT 0,				# Tracks amount of screentime in milliseconds
    timerCount int DEFAULT 0,			# Tracks amount of times the timer has been used
    usageDate date,					
    PRIMARY KEY (email, usageDate),
    FOREIGN KEY (email) REFERENCES Users (email)  ON DELETE CASCADE ON UPDATE CASCADE
);

# Table of AppUsage
CREATE TABLE AppUsage (
	email varchar(50),
    appName varchar(50) NOT NULL,
    appTime int DEFAULT 0,				# Tracks amount of apptime in milliseconds
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
# - creates a starting timerusage entry for the new user
DROP TRIGGER IF EXISTS AfterInsertUsers; 
DELIMITER $$
CREATE TRIGGER AfterInsertUsers AFTER INSERT ON Users
FOR EACH ROW BEGIN
		INSERT INTO UserPreferences (email) VALUES (NEW.email);
        INSERT INTO TimerUsage (email, usageDate) VALUES (NEW.email, CURDATE());
END;
$$
DELIMITER ;

# Trigger: Creating a new TimerUsage entry - sets the usageDate for the new TimerUsage entry
DROP TRIGGER IF EXISTS BeforeInsertTimerUsage; 
DELIMITER $$
CREATE TRIGGER BeforeInsertTimerUsage BEFORE INSERT ON TimerUsage
FOR EACH ROW BEGIN
	
    DECLARE usageOn bool;
    SELECT timerUsageOn INTO usageOn FROM UserPreferences WHERE email=NEW.email;
    
    IF (!usageOn) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "Timer Usage is Disabled";
    END IF;
END;
$$
DELIMITER ;

# Trigger: Updating a TimerUsage entry - updates the screentime/timesTimerUsed for the TimerUsage entry
DROP TRIGGER IF EXISTS BeforeUpdateTimerUsage; 
DELIMITER $$
CREATE TRIGGER BeforeUpdateTimerUsage BEFORE Update ON TimerUsage
FOR EACH ROW BEGIN
	
    DECLARE usageOn bool;
    SELECT timerUsageOn INTO usageOn FROM UserPreferences WHERE email=NEW.email;
    
    IF (!usageOn) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "Timer Usage is Disabled";
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
    
    IF (!usageOn) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "App Usage is Disabled";
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
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "App Usage is Disabled";
    END IF;
END;
$$
DELIMITER ;

# ----------------------------------------------------------------------
# mysql --local-infile -u root -p
# source iCare.sql

ALTER TABLE Users AUTO_INCREMENT = 1000;
