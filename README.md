## This is a nodejs application built as a part of Assignment 1 and 2 for CSYE6225 Spring 20201 course. 

The application currently signs up a user using basic token authentication, user can signup and change his/her details after signing up.Also, application posts a new book with fields like title, author, published date and ISBN number which is an unique field. Books can only be posted if a user is an authenticated user. A book can be deleted as well but by the same user who has posted it and not by any other user. There are also two seperate API's to get book information from books's uuid. Also, there is a seperate API to get all the books that have already been posted. 

An option to add image files also has been added to the application. Only the user who has posted the book will be able to add an image file for that book. The file image will be saved in Amazon S3.

## Following are the prerequisites for building and deploying application locally.

1) npm and nodejs should be installed on the machine that you need to run the application on. Also the machine should have MYSQL database installed.
2) npm install
3) npm install dotenv
4) npm install mysql

## Build and Deploy instructions for web application

Make sure your application is connected to the MYSQL database and then move to nodejs-webapp folder and run the command "node server.js". This command will start your application on port 8080.  

## Testing 

A simple mocha test written as a part of assignment, which send a GET request to the application and checks if it recieves a HTTP 200 status. The command to run test is 
mocha apptest.js

cHANGE is here.
also ghere 
also gere