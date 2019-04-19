# navomi-challenge

### Full Stack Engineer Coding Exercise: Movie App

Instructions are below. Please contact Eric Newland at newlandericj@gmail.com if you have any questions.

#### Installation
* This application uses Node, NPM, and Yarn
* Use `yarn run yarn-install` to install all modules both for the Express server and the React client.
* Use `yarn run dev` to compile all code and concurrently launch the server and the client.
* A browser window should launch automatically, otherwise you can navigate to the frontend interface at https://localhost:3000
#### Security
* This app uses a self-signed SSL certificate for HTTPS, and as a result most browsers will prompts you to proceed.
* All database calls except user registration and signin require a JWT cookie generated by logging in.
* There is a dummy user already in the system, username `eric` and password `abcdefG1`.
* Password requirement is minimum 8 characters, including capital and lowercase letters and a number. This follows the "simple" password spec found at https://www.owasp.org/index.php/OWASP_Validation_Regex_Repository
* If you are logged out, you will be redirected to https://localhost:3000/login
* New users with unique usernames can be freely registered.
* Once logged in, an HTTP-only JWT cookie will be set and used to authenticate API requests that read and modify the movie database, and you will be redirected to the app.
* You can freely log out. The login cookie expires after one hour.
* The client secret is in the repo in the .env file for demonstration purposes.
#### Front-end interface
* The React client uses an editable table to add, update, and delete movies from the database.
* The client and server both validate input.
 * Title and Director should not be blank.
 * Release Date should parse correctly when used to instantiate a JavaScript `Date()`.
 * Rating should be a number between 1 and 5. It will be rounded to the nearest tenth.
* Currently, only one row can be added or saved at a time. The save icon at the end of each row will either save an updated entry or add a new entry to the database. Saving one row will revert all other changes.
* The X at the end of existing rows will delete them from the database after confirmation.
* /data/database-reset.json can be manually copied into database/database.json to reset it to its initial state.
#### API
* Postman collection is in the root of the repo as postman.json.
* Database row indexes simulate a serial primary key and increment indefinitely. A third-party interface would need to first fetch the rows to know which index to modify or delete.

### Challenge Instructions for reference

1. Create a Movie app (REST service) using ​ **NodeJS** ​ framework.
    a. The app is responsible to list, create, update, delete movie information through the APIs
    b. Movie data should contain at least Name, Rating, Release Date, Directors.
2. An app should perform CURD operations (ie. Crate, Update, Read, Delete)
3. Please choose your own Database; for testing JSON data file should work too.
4. All endpoints must be secure (please choose your own process to secure the endpoints)
5. Create a POSTMAN collection with all endpoints and share it with the requester
6. Upload the application on GitHub and share the repository with the requester. Application’s readme
    should have all the necessary information to run the application.
7. The application MUST follow OWSAP Standards
8. An Application must be multi-tenant
9. Create a Front End to an application using Front-End Framework.