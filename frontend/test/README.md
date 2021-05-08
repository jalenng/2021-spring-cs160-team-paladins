# Frontend test

The files in this folder are test scripts that test our frontend. The scripts use Mocha and Spectron/Webdriver.io to run the tests.

## Running the tests 
1. Navigate to the project directory
    - Ensure the working directory is `.../2021-spring-cs160-team-paladins/frontend` with `pwd`
2. Run `npm i && npm test`

## Test suites and test cases
- App launch
  - Ensure app window is initialized correctly
- Authentication
  - Sign in with no email and password
  - Sign in with invalid credentials
  - Sign in with valid credentials
  - Click "Already have an account?" to return to sign in screen
  - Sign up with empty fields
  - Sign up with email that already exists
  - Sign up with password that does not meet requirements
  - Sign up with password that does not match confirmation password
  - Sign up with valid email and password
- Timer functionality
  - Start and pause timer with button
  - Reset timer
- Preferences functionality
  - Toggling enable sound notifications.
  - Playing selected notification sound.
  - Modifying Timer Duration
  - Toggling open iCare on startup.
  - Toggling track app usage statistics.
  - Toggling track data usage statistics.
