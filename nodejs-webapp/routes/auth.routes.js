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

  app.post("/v1/user",

    [
      verifySignUp.checkDuplicateUsernameOrEmail
    
    ],
    controller.signup
  );


app.put("/v1/user/self",

[
  tokenauth.basictokenauthentication

],
updateuserinfo.updateuserinfo


);


app.get("/v1/user/self",

[
  tokenauth.basictokenauthentication

],
userinfocontroller.senduserinfo


);

app.post("/books",

[
  tokenauth.basictokenauthentication
],

postbook.postbook


);

app.get("/books/:id",
[
  tokenauth.basictokenauthentication
],
getbookid.getbookid

)

app.delete("/books/:id",
[
  tokenauth.basictokenauthentication
],
deletebookid.deletebook

)

app.get("/books",

allbooks.getallbooks

)


};