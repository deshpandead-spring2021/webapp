const verifySignUp = require("./verifySignUp");

const findById = require("./userbyid")
const tokenauth = require("./basicauthentication")

module.exports = {
  verifySignUp,
  findById,
  tokenauth
};
