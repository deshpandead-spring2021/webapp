const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const userinfocontroller = require("../controllers/auth.getuserinfo")
const updateuserinfo = require("../controllers/auth.updateuserinfo")
const {tokenauth} = require("../middleware");

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


};