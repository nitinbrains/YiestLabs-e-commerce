# Yeastman 2.0

This repo contains the source code for the refurbished version of _yeastman.com_. The project was created using [React](https://reactjs.org) in combination with [NextJS](https://nextjs.org/) as a toolchain for rendering server-side pages and supporting client-side routing. The application connects to the original [yeastman.com](https://yeastman.com) website for user login, registration, and password functionality. For everything else, it integrates with NetSuite. Data is retrieved using an express node server and funnelled through Redux-Saga which manages the global state of the app. Screens are broken down into pages according to NextJS 

### How To Run

Clone the repository. Run `npm i` to install all required modules. Run `npm run dev` to start website in development mode 

### Tech Stack

##### Front-End Libraries

* Material-ui
* JSS

##### Back-End Libraries
* NextJS
* Redux-Saga
* JavaScript/SuiteScript
* Express


##### `npm run dev`

Runs the website in development mode.

##### `npm run build` 

Build a distribution bundle

##### `npm run start` 

Run website in production mode.

##### `npm run test`

Runs the [jest](https://github.com/facebook/jest) test runner on your tests.
