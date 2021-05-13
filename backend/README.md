# Backend

This directory holds the source code for our backend. We are using ExpressJS to provide the backend API interface.

<br/>

# Technologies

Language: JavaScript (ExpressJS)
Database: mySQL

<br/>

# Setting up the server

# Generating an authorized key to access the server
SSH (Secure Shell)
- Open terminal
- Type ssh-keygen (generates public/private rsa key pair)
- Enter a file in which to save the key
- Type cd .ssh (navigates into ssh directory)
- Type cat id_rsa.pub (displays public key that will be used to access the server)
- Copy your public key shown and send to another team member with current access to the server
- Another team member will be able to add a new public key in the server under authorized_keys to grant it access to the server

# Instructions for connecting to the server
- Open terminal
- Type ssh root@165.232.156.120
- When asked to Enter passphrase for key, type 'pala160din#'
- The server should now be running and listening for requests at our ip address 165.232.156.120 at port 3000

Instructions for opening up the server using VSCode
- https://code.visualstudio.com/docs/remote/ssh

<br/>

# Connecting to the mySQL database
- Open the mySQL workbench
- Navigate to Setup New Connection
- Change the connection method to Standard TCP/IP over SSH
- Input the following

<img width="598" alt="Screen Shot 2021-05-07 at 9 54 40 PM" src="https://user-images.githubusercontent.com/68493152/117527391-88291300-af80-11eb-8d6a-339a3f9365c5.png">

- The path to your SSH Key File may be different from the one listed in the image
- Make sure to store the SSH password (pala160din#) in vault
- Click OK
- You should now be connected to the virtual database

# Guide to running the project in the backend
After creating a copy of the project:

To keep your copy of the project updated, remember to run `git pull` often.

To update any changes made to the project
- `cd backend`
- `npm install`

To start running the backend server (ExpressJS runs on our VPS)
- Make sure you are first connected to the server and inside the correct repository (2021-spring-cs160-team-paladins)
- `cd backend`
- `npm start`

<br/>

# Source Files 

# `api_methods.js`
Contains the backend API methods
# `db.js`
Contains the database class methods 
# `index.js`
Listens & handles requests from server, handles backend API response codes
# `package-lock.json`
Keeps track of package versions installed
# `package.json`
Holds relevant project metadata such as project dependencies, scripts, version, etc.
# `README.md`
Instructions for running the backend
# `test.js`
Contains the backend test cases
# `token.js`
Contains the token class methods

<br/>

# Backend Testing Files

# `iCare_Environment.json`
Required environment for backend testing
# `iCare_Tests.json`
Contains required backend testing configuration/necessary parameter values

<br/>

# Index of Commands

# npm commmands

## `npm start`
Starts the backend process.

## `npm watch`
Starts the backend process with nodemon. Updating backend source files will automatically reload the backend.

## `npm test`
Starts Mocha to the backend.

## `npm install`
Updates the backend dependencies.

<br/>

# Database commands

# Restarting the MySQL server
- To check status: sudo systemctl status mysql.service
- To start MySQL service: sudo systemctl start mysql.service

# Viewing all users in the database
mysql --local-infile -u root -p
no password so just press enter
select * from iCare.Users;

<br/>

# Running Tests
The backend API testing is done using Postman.
The link below consists of the Postman collection of backend API tests for our iCare application. You will not be able to run it because it requires the environment, which I cannot share. As such, I have an image of the runner in Postman successfully running the tests.

POSTMAN: [Backend API Tests](https://www.getpostman.com/collections/fcd8a3e81ecbc02034b1)

In this backend folder, there are two JSON files that I exported from Postman that will run the tests when you npm start in the backend.
This should give you the result below:

```
iCare Testing (Local Host)

→ Create Account (Success)
  POST localhost:3000/user [201 Created, 523B, 166ms]
  √  Create Account test - Success

→ Create Account (Existing Email)
  POST localhost:3000/user [201 Created, 524B, 84ms]
  √  Create Account test -Existing Email

→ Create Account (Bad Passsword)
  POST localhost:3000/user [401 Unauthorized, 332B, 4ms]
  √  Create Account test -Bad Password

→ Create Account (No Email)
  POST localhost:3000/user [401 Unauthorized, 299B, 5ms]
  √  Create Account test - No Email

→ Create Account (No Password)
  POST localhost:3000/user [401 Unauthorized, 305B, 5ms]
  √  Create Account test - No Password

→ Create Account (No Display Name)
  POST localhost:3000/user [401 Unauthorized, 313B, 3ms]
  √  Create Account test - No Display Name

→ Log in (Success)
  POST localhost:3000/auth [200 OK, 517B, 80ms]
  √  Login test - Success

→ Login (Bad email)
  POST localhost:3000/auth [401 Unauthorized, 313B, 4ms]
  √  Login test - Bad email

→ Log in (Bad password)
  POST localhost:3000/auth [401 Unauthorized, 313B, 75ms]
  √  Login test - Bad password

→ Log in (No Password)
  POST localhost:3000/auth [401 Unauthorized, 313B, 77ms]
  √  Login test - No password

→ Log in (No Email)
  POST localhost:3000/auth [401 Unauthorized, 299B, 3ms]
  √  Login test - No email

→ Get Data/App Usage (Empty Array)
  GET localhost:3000/data [200 OK, 336B, 6ms]
  √  Get Data/App Usage test - Success

→ Set Data/App Usage (Undefined Values)
  PUT localhost:3000/data [504 Gateway Timeout, 321B, 4ms]
  √  Set Data/App Usage test - undefined values

→ Set Data/App Usage (Success)
  PUT localhost:3000/data [200 OK, 290B, 54ms]
  √  Set Data/App Usage test - Success

→ Get Data/App Usage (Success)
  GET localhost:3000/data [200 OK, 336B, 6ms]
  √  Get Data/App Usage test - Success

→ Set Preferences (No Token)
  PUT localhost:3000/prefs [401 Unauthorized, 311B, 4ms]
  √  Set Preferences test - No Token

→ Set Preferences (Invalid Token)
  PUT localhost:3000/prefs [401 Unauthorized, 311B, 5ms]
  √  Set Preferences test - Invalid Token

→ Set Preferences (Success)
  PUT localhost:3000/prefs [200 OK, 295B, 38ms]
  √  Set Preferences test - Success

→ Get Preferences (No Token)
  GET localhost:3000/prefs [401 Unauthorized, 311B, 4ms]
  √  Get Preferences test - No Token

→ Get Preferences (Invalid Token)
  GET localhost:3000/prefs [401 Unauthorized, 311B, 3ms]
  √  Get Preferences test - Invalid Token

→ Get Preferences (Success)
  GET localhost:3000/prefs [200 OK, 377B, 15ms]
  √  Get Preferences test - Success

→ Get Email/DN (No Token)
  GET localhost:3000/user [401 Unauthorized, 311B, 5ms]
  √  Get Preferences test - Success

→ Get Email/DN (Invalid Token)
  GET localhost:3000/user [401 Unauthorized, 311B, 7ms]
  √  Get Preferences test - Success

→ Get Email/DN (Success)
  GET localhost:3000/user [200 OK, 296B, 4ms]
  √  Get Preferences test - Success

→ Change Email/DN (No Token)
  PUT localhost:3000/user [401 Unauthorized, 311B, 6ms]
  √  Change Email/DN test - no token

→ Change Email/DN (Invalid Token)
  PUT localhost:3000/user [401 Unauthorized, 311B, 3ms]
  √  Change Email/DN test - invalid token

→ Change Email/DN (No DN)
  PUT localhost:3000/user [401 Unauthorized, 313B, 5ms]
  √  Change Email/DN test - empty display name

→ Change Email/DN (No Email)
  PUT localhost:3000/user [401 Unauthorized, 299B, 4ms]
  √  Change Email/DN test - empty email

→ Change Email/DN (No Password)
  PUT localhost:3000/user [401 Unauthorized, 308B, 76ms]
  √  Change Email/DN test - empty password

→ Change Email/DN (Bad Password)
  PUT localhost:3000/user [401 Unauthorized, 308B, 75ms]
  √  Change Email test - bad password

→ Change Email/DN (Existing Email)
  PUT localhost:3000/user [401 Unauthorized, 308B, 93ms]
  √  Change Email/DN test - new email is existing email

→ Change Email/DN (Success)
  PUT localhost:3000/user [202 Accepted, 304B, 85ms]
  √  Change Email test - Success

→ Delete Account (NoToken)
  DELETE localhost:3000/user [401 Unauthorized, 311B, 4ms]
  √  Delete Account test - No Token

→ Delete Account (Invalid Token)
  DELETE localhost:3000/user [401 Unauthorized, 311B, 3ms]
  √  Delete Account test - Invalid Token

→ Delete Account (Wrong Password)
  DELETE localhost:3000/user [401 Unauthorized, 308B, 76ms]
  √  Delete Account test - Wrong Password

→ Delete Account (Success)
  DELETE localhost:3000/user [200 OK, 283B, 83ms]
  √  Delete Account test - Success

→ Log in (Existing Email)
  POST localhost:3000/auth [200 OK, 519B, 77ms]
  √  Login test - Success

→ Delete Account (Existing Email)
  DELETE localhost:3000/user [200 OK, 283B, 82ms]
  √  Delete Account test - Success

┌─────────────────────────┬───────────────────┬──────────────────┐
│                         │          executed │           failed │
├─────────────────────────┼───────────────────┼──────────────────┤
│              iterations │                 1 │                0 │
├─────────────────────────┼───────────────────┼──────────────────┤
│                requests │                38 │                0 │
├─────────────────────────┼───────────────────┼──────────────────┤
│            test-scripts │                76 │                0 │
├─────────────────────────┼───────────────────┼──────────────────┤
│      prerequest-scripts │                43 │                0 │
├─────────────────────────┼───────────────────┼──────────────────┤
│              assertions │                38 │                0 │
├─────────────────────────┴───────────────────┴──────────────────┤
│ total run duration: 4.7s                                       │
├────────────────────────────────────────────────────────────────┤
│ total data received: 3.35KB (approx)                           │
├────────────────────────────────────────────────────────────────┤
│ average response time: 35ms [min: 3ms, max: 166ms, s.d.: 40ms] │
└────────────────────────────────────────────────────────────────┘
iCare Collection Run Complete!
```
