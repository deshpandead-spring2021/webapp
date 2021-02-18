const db = require("../models");
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    where: {
      username: req.body.username
    }
  })
  .then(user => {
    if (user) {
      res.status(400).send({
        message: "Failed! Username is already in use!"
      });
      return;
    }

      next();
    
  })
  .catch((err) => {
    console.log(">> Error while registering user: ", err);
    res.status(400).send("Cannot register user. Please check if you have entered correct data. Enter the user data in JSON format as follows :-  username,first_name,last_name,password")
  });

  
};


const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail
};

module.exports = verifySignUp;

