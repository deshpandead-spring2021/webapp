var DataTypes = require('sequelize/lib/data-types');


module.exports = (sequelize, Sequelize) => {


  const Book = sequelize.define("book", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },

    title: {
      type: Sequelize.STRING,
      allowNull: false
      
    },
    author: {
      type:DataTypes.STRING,
       allowNull:false
      },

    isbn:{
      type:DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    published_date:{
        type:DataTypes.DATEONLY
    },
    user_id:{
        type:DataTypes.UUID
    }
    
  },

  {
    freezeTableName: true, // Model tableName will be the same as the model name
    createdAt:'book_created',
    updatedAt:'book_updated',
  },
    
);

  return Book;
};