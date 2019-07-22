## Setup

1. Install [MongoDB](https://docs.mongodb.com/manual/administration/install-community/)
2. Install [Node](https://nodejs.org/en/)
3. Open a terminal and run the following commands:
4. `mongod` to start the MongoDB server
5. Go to the /Database folder and run:
6. `mongoimport --db ThePriceIsRightDatabase --collection users --authenticationDatabase admin --drop --file users.json` to insert users
7. and `mongoimport --db ThePriceIsRightDatabase --collection products --authenticationDatabase admin --drop --file products.json` to insert 3 products.

Your database is now seeded and ready to go.

## Run the project

1. Open the project in VS Code and select `Debug -> Start debugging` (or F5).

This project was bootstrapped on the client side with [Create React App](https://github.com/facebook/create-react-app) and on the server side with .net core.

## Available Scripts in the client

In the client directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder and, additionally, copies those files to `wwwroot`.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


## Available commands in the server

In the server directory, run:

### `mongoimport --db ThePriceIsRightDatabase --collection users --authenticationDatabase admin --drop --file users.json`