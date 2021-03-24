var DataTypes = require('sequelize/lib/data-types');
const bcrypt = require ("bcryptjs")
const saltrounds =8;
const logger = require('../config/logger')
var SDC = require('statsd-client');
client = new SDC();


module.exports = (sequelize, Sequelize) => {


  const User = sequelize.define("user", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },

    username: {
      type: Sequelize.STRING,
      allowNull: false,
      validate:{
        isEmail:{
            message:"wrong email format"
            },
        
        notEmpty:{
            message:'Username cannot be null'
        }

        
      }
      
      
    },
    password: {
      type:DataTypes.STRING,
       allowNull:false,
      validate:{
        is:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{9,}$/
/**
 * Minimum nine characters, at least one uppercase letter,one lowercase letter,one number and one special character
 */


}



      },

    first_name:{
      type:Sequelize.STRING,
      allowNull: false,
    },
    last_name:{
      allowNull: false,
      type:Sequelize.STRING
    }
    
  },

  {
    hooks:{

      beforeCreate: async function (user) {
        const salt = bcrypt.genSaltSync();    
        user.password = bcrypt.hashSync(user.password, saltrounds);
      },

      beforeUpdate: async function (user) {
        console.log("Printing user password>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        console.log(user.password)
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.password, saltrounds);
        
      }
    },
    freezeTableName: true, // Model tableName will be the same as the model name
    createdAt:'account_created',
    updatedAt:'account_updated',

    instanceMethods:{
      validPassword: function(password) {
        return bcrypt.compareSync(password, this.password);
    },
  }
  },
    
);

  return User;
};