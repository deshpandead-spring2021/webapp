
const sequelize = require("sequelize");
const db = require("../models"); 
const File = db.file;

exports.findByFileid = (file_id) => {
    return File.findByPk(file_id, {
        attributes: ["file_id","s3_object_name","file_name","createdAt","user_id",]
        
      })
      .then((file_id) => {
        return file_id;
      })
      .catch((err) => {
         console.log(">> Error while finding File: ", err);
         res.status(400).send("Cannot fetch the file. Make sure this book has file.")
      });
  };