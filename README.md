![image](https://user-images.githubusercontent.com/42555186/117086037-530e8d80-ad00-11eb-9ed7-77f48001290f.png)

# iCare
**SJSU CS 160 Spring 2021 Project - Team Paladins**

<br/>

## Vision
### FOR
users who often spend long periods of time on digital devices 
### WHO 
are concerned about eye strain and potential long-term vision issues from computer usage, 
### THE 
iCare app is a native application 
### THAT 
motivates users to develop good habits to avoid eye strain without being too intrusive to their schedule. 
### UNLIKE 
Pomodoro timers and other native applications, 
### OUR PRODUCT 
integrates with the user’s calendar, has a modern UI, syncs usage data and preferences, provides usage data, provides insights into usage habits, and reminds the user to take breaks in a customizable and unobtrusive way

<br/>

# Directories

### `./frontend`
This directory holds the source code for our frontend application.

### `./backend`
This directory holds the source code for our backend.

### `./database`
This directory holds the source code for our backend.

<br/>

# Getting started

1. Clone this repository to create a local instance that you can work on.
    - `git clone https://github.com/jalenng/2021-spring-cs160-team-paladins.git`
2. Navigate into the backend or frontend directory
    - `cd backend` or `cd frontend`
3. Follow the directions in `README.md` to run the project.

<br/>

# Workflow

## Synchronizing changes

### `git pull`
Copies changes from the remote repository to the local repository.
*Think of this as "downloading."*

### `git push`
Copies changes from the local repository to the remote repository. 
*Think of this as "uploading."*

<br/>

## Branching

Whenever you are starting work on a **new feature or issue**, create a branch from one of these development branches:
* `frontend-dev`
* `backend-dev`

### `git checkout -b <new-branch-name> <dev-branch-name>`
Creates a new branch from the specified development branch.

<br/>

## Testing
Test the changes you made before creating your PR.

Frontend Automation Testing (Electron)
1. Navigate to the frontend directory.
    - `cd frontend`
2. Run the Spectron tests 
    - `npm run test`

Backend Automation Testing (Postman)
1. Navigate to the backend directory
    - `cd backend`
2. Run the Postman tests.
    - `npm test`

If all the tests pass, you're ready to make a PR.

<br/>

## Creating pull requests

When your branch/feature is complete and ready for merging:
1. Make a pull request (PR) on GitHub. 
    - *https://github.com/jalenng/2021-spring-cs160-team-paladins/pulls*
    - Set the base to either `backend-dev` or `frontend-dev`.
    - Describe your changes in the title and description.
2. Resolve the file conflicts, if any.
3. Wait for us to perform code reviews and request changes if needed.

<br />

## Code Reviews

In addition to reading the changed code in a PR, we can also run it to verify that it works.

1. `git pull`
2. `git checkout <branch-name>`
3. Navigate into the backend or frontend directory.
    - `cd backend` or `cd frontend`
4. Follow the directions in `README.md` to run the project.
5. Check for bugs and potential issues.
6. Comment on the GitHub PR with your findings.

When the issues are resolved, the branch is ready to be merged. Once the branch is merged and no longer needed, go ahead and delete it.

<br />

## Pair Programming
2+ people will work on the same feature. One shares their screen and codes, while the others watch and review the code. All members should be actively engaged for best results, and roles should be switched frequently. 

