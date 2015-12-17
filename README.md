# Zembo

## Final Project Document
https://docs.google.com/document/d/1QAY0uNoGbssk_nWpT-EiKctfoWRgb0gmmcVC5dHICgY/edit?usp=sharing

## Videos
Source Code Overview: https://www.youtube.com/watch?v=e8KgI_KwYnc

Web Application Demo: https://www.youtube.com/watch?v=qZ4uVgucyEI

Presentation: https://www.youtube.com/watch?v=FBM9yEhTqYk

## Overview
Many people today have their heads dug deep into the screens of their phones and computers, even when studying. Rather than getting together with others to study together, you can easily send them a message and start up a conversation. With Zembo though, you can easily create study session events and get together with just about anyone who wants to work on related topics and material. For those who want to join in on the study session, they can still join in on the event and keep in touch by sending posts and having others comment on your posts.

Overall, this web-based software application assists college students in getting together to collaborate on group-based assignments and engage in study sessions, allowing for better learning techniques.

## How To Run
Make sure you have Node.js installed on your system.

You can download it [here](https://nodejs.org/en/download/)
(required for Windows) or follow these commands in the terminal:

On Linux:
```bash
$ sudo apt-get update
$ sudo apt-get install nodejs
$ sudo apt-get install npm
```
On Mac OS:
```bash
$ brew install node
```

After you have Node.js installed,
```bash
$ git clone https://github.com/AnthLi/team-duck
$ cd path/to/repository
$ npm install
```

#### Usage
```bash
$ cd path/to/repository
$ nodemon app.js
```
The application is now running on localhost:3000.

If ```nodemon app.js``` isn't working, try ```npm install -g nodemon```, then re-run ```nodemon app.js```.

## Libraries
- [body-parser](https://github.com/expressjs/body-parser) to retrieve submitted form data
- [connect-flash](https://github.com/jaredhanson/connect-flash) to flash messages to certain pages
- [express](http://expressjs.com/) to provide the main web framework
- [express-handlebars](https://github.com/ericf/express-handlebars) to provide templating and styling via injection
- [express-session](https://www.npmjs.com/package/express-session) to support session states
- [multer](https://github.com/expressjs/multer) to upload files to the file system
- [nodemon](https://github.com/remy/nodemon) to automatically reload the server on any changes
- [pg](https://github.com/brianc/node-postgres) to access the PostgreSQL database
- [course-parser](https://github.com/AnthLi/course-parser) external library written in Python to extract SPIRE's HTML files containing all UMass Amherst classes offered for the current semester (the data from the script is used in the web application, which is stored in the database, but the script itself is executed manually)

## Views
- ```/index```: the home page
- ```/about```: what we're about
- ```/team```: the devs and who we are
- ```/class```: individual class pages
- ```/class/content```: events and posts for each individual class page
- ```/class/students```: a list of all students in the class
- ```/group/createEvent```: event creation page for an individual class
- ```/group/createPost```: post submission for an individual class
- ```/user/login```: logging into the application
- ```/user/registration```: registering for an account
- ```/user/profile```: the user profile
- ```/admin/online```: a list of all online users
- ```/admin/users```: a list of every user and all of their attributes
- ```/admin/controls```: various admin controls

## Statefulness
Statefulness is maintained by using the [express-session](https://www.npmjs.com/package/express-session) library. There are various GET requests throughout all routes that check both the user session state through ```req.session.user``` and if the user is online through ```/lib/online.js```.

If the user session state exists, then that means they are currently logged in. Otherwise, it would be ```undefined```. Therefore, no user session exists. The library ```/lib/online.js``` simply stores a list of every user logged in. If a user isn't in the list, then either they are not logged in, or the server restarted and ended their session.

## Persistence
This application uses a PostgreSQL database. The database contains multiple tables: blacklist, classes, comments, events, posts, subjects, team, and users. Blacklist contains the emails of all banned users. Classes contains rows of every class along with an array for each class containing every student enrolled. Comments contains all of the comments made in every post. Events and posts holds all of the events and posts created for every class. Subjects is the entire list of subjects offered at UMass. Team and users are the table of each developer and the table of all users registerted in the app.

The library ```/lib/database.js``` contains the connection to the database and various query functions such as adding, deleting, and updating tables in the datable. A file containing the password to the database is stored locally and ignored by bit on each developer's computer and parsed in order to create a successful connection to the database. (Hint: the password in old commits is not the same, so don't try to be clever!)

## The Team
- Anthony Li
- Harsh Keswani
- Ben Cheung
- Zachary Milrod
- Jonathan Gatley
