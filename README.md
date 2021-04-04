# Run the project
## Running the server (ExpressJS runs on our VPS)
### Listens at our ip address 165.232.156.120 at port 3000
`ssh root@165.232.156.120`

`pala160din#`

`cd 2021-spring-cs160-team-paladins`

`cd backend`

`npm start`

### The server should now be running and listening for requests at 165.232.156.120:3000
#
## Running the app (Electron & React)
`cd frontend`

`npm run dev`

<br />

# Getting Started
## Create copy of the project.
`git clone https://github.com/jalenng/2021-spring-cs160-team-paladins.git`
## Update any changes made to the project.
`git pull`
## Update the frontend
`cd /frontend`

`npm install`
## Update the backend
`cd /backend`

`npm install`

### To keep your copy of the project updated, remember to run `git pull` and `npm install` often.

<br />

# Branching | Working on Features
####  Create a separate branch for each feature or issue you work on. We have two main branches, frontend-dev & backend-dev. Every branch we create should be branched from one of these.
## Opening an existing branch
`git checkout branchName`
## Working on front-end features
`git checkout -b branchName frontend-dev`
## Working on back-end features
`git checkout -b branchName backend-dev`
#
## Creating a pull request for your branch
####  When your branch/feature is complete and ready to merge, we can review the changes as a team next meeting. To accomplish this, make a pull request on github. With a PR, you can compare the changes you made and check to see if there's any merge conflicts.. 

####  Navigate to `https://github.com/jalenng/2021-spring-cs160-team-paladins/pulls` and create a new pull request. The base option should be set to the frontend-dev branch & compare option set to your branch & create the PR. Then, write a quick comment listing the changes you made and why. 

<br />

# Code Reviews
####  Our next meeting, we'll code review as a team. One team member can share their screen and test the branch along with resolving any merge conflicts. First, update any changes or missing packages.
### Open the branch
`git checkout branchName`
### Update the project & dependencies. See 'Getting Started' for commands.
####  Run the project & check for bugs or potential issues. Open the pull request on Github and leave a comment, listing the issues. When the issues are resolved, the branch is ready to be merged. Upon merge, go ahead and delete the branch. 

<br />

# Pair Programming
#### 2+ people work on same feature. One person shares their screen & codes while the other watches & reviews the code. Roles should be switched frequently.
