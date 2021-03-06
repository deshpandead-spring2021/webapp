const { ConnectionRefusedError } = require('sequelize');
var DataTypes = require('sequelize/lib/data-types');
const { file } = require('.');


module.exports = (sequelize, Sequelize) => {


  const File = sequelize.define("file", {
  file_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      readOnly:true,
      primaryKey: true
    },

    file_name: {
      type: Sequelize.STRING,
      // allowNull: false,
    //   defaultValue:Sequelize.STRING
      
    },
    s3_object_name:{
        type:Sequelize.STRING,
        readOnly:true,
        // allowNull: false,
    },
    user_id:{
        type:DataTypes.UUID
    }
    
  },
  {
		hooks:{
			beforeCreate: async function (file) {
				console.log("In hook>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
				console.log(file.bookId)
				console.log(file.file_id+"File_id>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
				file.s3_object_name=file.bookId+ "/"+ file.file_id + "/" + file.file_name
			  }
		}
  },


  {
    freezeTableName: true, // Model tableName will be the same as the model name
    createdAt:'created_date'
  },
    
);

  return File;
};