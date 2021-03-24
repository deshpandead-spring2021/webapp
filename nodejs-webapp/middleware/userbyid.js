const db = require("../models");
const User = db.user;

exports.findById = (userid) => {
    return User.findByPk(userid, {
        attributes: ["id","username", "first_name","last_name","account_created","account_updated"]
      })
      .then((user) => {
        return user;
      })
      .catch((err) => {

        var user_create_end_time = Date.now();
        client.timing('timing_user_create', user_create_end_time - user_create_start_time );
        // console.log(">> Error while finding Question: ", err);
         res.status(400).send("Cannot register user. Please check if you have entered correct data")
      });
  };
