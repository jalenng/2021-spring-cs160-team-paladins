# README.md for backend automation tests required for Sprint 5
# 
The backend api testing is done using Postman.
###### The link below consists of the Postman collection of backend api tests for our iCare application. You will not be able to run it because it requires the environment, which I cannot share. As such, I have an image of the runner in Postman successfully running the tests.
###### POSTMAN: [Backend API Tests](https://www.getpostman.com/collections/fcd8a3e81ecbc02034b1)
# 
###### In this backend folder, there are two JSON files that I exported from Postman that will run the tests when you npm start in the backend.
###### This should give you the result below:
###### iCare Testing (Local Host)
###### 
###### → Create Account (Success)
######   POST localhost:3000/user [201 Created, 523B, 166ms]
######   √  Create Account test - Success
###### 
###### → Create Account (Existing Email)
######   POST localhost:3000/user [201 Created, 524B, 84ms]
######   √  Create Account test -Existing Email
###### 
###### → Create Account (Bad Passsword)
######   POST localhost:3000/user [401 Unauthorized, 332B, 4ms]
######   √  Create Account test -Bad Password
###### 
###### → Create Account (No Email)
######   POST localhost:3000/user [401 Unauthorized, 299B, 5ms]
######   √  Create Account test - No Email
###### 
###### → Create Account (No Password)
######   POST localhost:3000/user [401 Unauthorized, 305B, 5ms]
######   √  Create Account test - No Password
###### 
###### → Create Account (No Display Name)
######   POST localhost:3000/user [401 Unauthorized, 313B, 3ms]
######   √  Create Account test - No Display Name
###### 
###### → Log in (Success)
######   POST localhost:3000/auth [200 OK, 517B, 80ms]
######   √  Login test - Success
###### 
###### → Login (Bad email)
######   POST localhost:3000/auth [401 Unauthorized, 313B, 4ms]
######   √  Login test - Bad email
###### 
###### → Log in (Bad password)
######   POST localhost:3000/auth [401 Unauthorized, 313B, 75ms]
######   √  Login test - Bad password
###### 
###### → Log in (No Password)
######   POST localhost:3000/auth [401 Unauthorized, 313B, 77ms]
######   √  Login test - No password
###### 
###### → Log in (No Email)
######   POST localhost:3000/auth [401 Unauthorized, 299B, 3ms]
######   √  Login test - No email
###### 
###### → Get Data/App Usage (Empty Array)
######   GET localhost:3000/data [200 OK, 336B, 6ms]
######   √  Get Data/App Usage test - Success
###### 
###### → Set Data/App Usage (Undefined Values)
######   PUT localhost:3000/data [504 Gateway Timeout, 321B, 4ms]
######   √  Set Data/App Usage test - undefined values
###### 
###### → Set Data/App Usage (Success)
######   PUT localhost:3000/data [200 OK, 290B, 54ms]
######   √  Set Data/App Usage test - Success
###### 
###### → Get Data/App Usage (Success)
######   GET localhost:3000/data [200 OK, 336B, 6ms]
######   √  Get Data/App Usage test - Success
###### 
###### → Set Preferences (No Token)
######   PUT localhost:3000/prefs [401 Unauthorized, 311B, 4ms]
######   √  Set Preferences test - No Token
###### 
###### → Set Preferences (Invalid Token)
######   PUT localhost:3000/prefs [401 Unauthorized, 311B, 5ms]
######   √  Set Preferences test - Invalid Token
###### 
###### → Set Preferences (Success)
######   PUT localhost:3000/prefs [200 OK, 295B, 38ms]
######   √  Set Preferences test - Success
###### 
###### → Get Preferences (No Token)
######   GET localhost:3000/prefs [401 Unauthorized, 311B, 4ms]
######   √  Get Preferences test - No Token
###### 
###### → Get Preferences (Invalid Token)
######   GET localhost:3000/prefs [401 Unauthorized, 311B, 3ms]
######   √  Get Preferences test - Invalid Token
###### 
###### → Get Preferences (Success)
######   GET localhost:3000/prefs [200 OK, 377B, 15ms]
######   √  Get Preferences test - Success
###### 
###### → Get Email/DN (No Token)
######   GET localhost:3000/user [401 Unauthorized, 311B, 5ms]
######   √  Get Preferences test - Success
###### 
###### → Get Email/DN (Invalid Token)
######   GET localhost:3000/user [401 Unauthorized, 311B, 7ms]
######   √  Get Preferences test - Success
###### 
###### → Get Email/DN (Success)
######   GET localhost:3000/user [200 OK, 296B, 4ms]
######   √  Get Preferences test - Success
###### 
###### → Change Email/DN (No Token)
######   PUT localhost:3000/user [401 Unauthorized, 311B, 6ms]
######   √  Change Email/DN test - no token
###### 
###### → Change Email/DN (Invalid Token)
######   PUT localhost:3000/user [401 Unauthorized, 311B, 3ms]
######   √  Change Email/DN test - invalid token
###### 
###### → Change Email/DN (No DN)
######   PUT localhost:3000/user [401 Unauthorized, 313B, 5ms]
######   √  Change Email/DN test - empty display name
###### 
###### → Change Email/DN (No Email)
######   PUT localhost:3000/user [401 Unauthorized, 299B, 4ms]
######   √  Change Email/DN test - empty email
###### 
###### → Change Email/DN (No Password)
######   PUT localhost:3000/user [401 Unauthorized, 308B, 76ms]
######   √  Change Email/DN test - empty password
###### 
###### → Change Email/DN (Bad Password)
######   PUT localhost:3000/user [401 Unauthorized, 308B, 75ms]
######   √  Change Email test - bad password
###### 
###### → Change Email/DN (Existing Email)
######   PUT localhost:3000/user [401 Unauthorized, 308B, 93ms]
######   √  Change Email/DN test - new email is existing email
###### 
###### → Change Email/DN (Success)
######   PUT localhost:3000/user [202 Accepted, 304B, 85ms]
######   √  Change Email test - Success
###### 
###### → Delete Account (NoToken)
######   DELETE localhost:3000/user [401 Unauthorized, 311B, 4ms]
######   √  Delete Account test - No Token
###### 
###### → Delete Account (Invalid Token)
######   DELETE localhost:3000/user [401 Unauthorized, 311B, 3ms]
######   √  Delete Account test - Invalid Token
###### 
###### → Delete Account (Wrong Password)
######   DELETE localhost:3000/user [401 Unauthorized, 308B, 76ms]
######   √  Delete Account test - Wrong Password
###### 
###### → Delete Account (Success)
######   DELETE localhost:3000/user [200 OK, 283B, 83ms]
######   √  Delete Account test - Success
###### 
###### → Log in (Existing Email)
######   POST localhost:3000/auth [200 OK, 519B, 77ms]
######   √  Login test - Success
###### 
###### → Delete Account (Existing Email)
######   DELETE localhost:3000/user [200 OK, 283B, 82ms]
######   √  Delete Account test - Success
###### 
###### ┌─────────────────────────┬───────────────────┬──────────────────┐
###### │                         │          executed │           failed │
###### ├─────────────────────────┼───────────────────┼──────────────────┤
###### │              iterations │                 1 │                0 │
###### ├─────────────────────────┼───────────────────┼──────────────────┤
###### │                requests │                38 │                0 │
###### ├─────────────────────────┼───────────────────┼──────────────────┤
###### │            test-scripts │                76 │                0 │
###### ├─────────────────────────┼───────────────────┼──────────────────┤
###### │      prerequest-scripts │                43 │                0 │
###### ├─────────────────────────┼───────────────────┼──────────────────┤
###### │              assertions │                38 │                0 │
###### ├─────────────────────────┴───────────────────┴──────────────────┤
###### │ total run duration: 4.7s                                       │
###### ├────────────────────────────────────────────────────────────────┤
###### │ total data received: 3.35KB (approx)                           │
###### ├────────────────────────────────────────────────────────────────┤
###### │ average response time: 35ms [min: 3ms, max: 166ms, s.d.: 40ms] │
###### └────────────────────────────────────────────────────────────────┘
###### iCare Collection Run Complete!
