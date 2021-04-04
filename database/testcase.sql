DROP DATABASE IF EXISTS nodeTest;
CREATE DATABASE nodeTest;
USE nodeTest; 

Create Table Users (
	email varchar(50),
	pass varchar(100),
	PRIMARY KEY (email)
);

SET GLOBAL local_infile = true;		# Allows for local infile

# ----------------------------------------------------------------------
# mysql --local-infile -u root -p
# source testcase.sql

# Users Data
LOAD DATA LOCAL INFILE 'testcases.csv'  # Get your path for the csv file to load
INTO TABLE Users
FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\r\n'
IGNORE 1 LINES
(email, pass);
