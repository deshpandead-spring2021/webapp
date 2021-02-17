const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const userinfocontroller = require("../controllers/auth.getuserinfo")
const updateuserinfo = require("../controllers/auth.updateuserinfo")
const {tokenauth} = require("../middleware");
const postbook= require("../controllers/auth.newbook")
const getbookid = require("../controllers/auth.bookbyid")
const deletebookid = require("../controllers/auth.deletebookid")
const allbooks = require("../controllers/auth.allbooks")

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  //Post new user
  app.post("/v1/user",

    [
      verifySignUp.checkDuplicateUsernameOrEmail
    
    ],
    controller.signup
  );

  // Change user info

app.put("/v1/user/self",

[
  tokenauth.basictokenauthentication

],
updateuserinfo.updateuserinfo


);

//Get user info
app.get("/v1/user/self",

[
  tokenauth.basictokenauthentication

],
userinfocontroller.senduserinfo


);

//Post a new book 

app.post("/books",

[
  tokenauth.basictokenauthentication
],

postbook.postbook


);

//Get book info from bookid

app.get("/books/:id",
getbookid.getbookid

)

//Delete book from database using bookid

app.delete("/books/:id",
[
  tokenauth.basictokenauthentication
],
deletebookid.deletebook

)


//Get all the books from the database without authentication.
app.get("/books",

allbooks.getallbooks

)


};