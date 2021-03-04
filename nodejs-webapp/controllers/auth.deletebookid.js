const db = require("../models");
const User = db.user;
const Book =db.book;
const bookbyid =  require("../middleware/bookbyid");
const { user } = require("../models");
const sleep = ms => new Promise(res => setTimeout(res, ms));


exports.deletebook = async (req, res) => {

const base64Credentials =  req.headers.authorization.split(' ')[1];
const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
const [loginname, userpassword] = credentials.split(':');
// console.log("loginname >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+loginname)
// console.log("userpassword "+userpassword)

const bookidfromparam = req.params.id

const userinfo= await User.findOne({
    where: {
      username: loginname
    }
    ,
    attributes:["id"]
  })
  .then(user => {
    if (user) {
      // console.log("Printing user>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
      // console.log(user)
      return user;
    }

    else{
      console.log("Error here in fetching user data>>>>>")
        res.status(400).json("Error while fetching user data. Please check if the user is registered for posting new book");
    }
    
  });


  const bookinfo= await Book.findOne({
    where: {
      id: bookidfromparam
    }
    ,
    attributes:["user_id"]
  })
  .then(user => {
    if (user) {
      // console.log("Printing user>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
      // console.log(user)
      return user;
    }

    else{
      console.log("Error here in fetching user data>>>>>")
        res.status(404).json("Error while fetching book. Please check if the book is posted.");
    }
    
  });

  console.log("Printing existing userid>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> "+bookinfo.user_id)
  console.log("Printing new userid >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> "+ userinfo.id)

  const existinguserid =bookinfo.user_id
  const enteruserid = userinfo.id

  if(existinguserid==enteruserid){

    //Delete book from database if userid is matching

 const book = await Book.destroy({
    where: {
      id:bookidfromparam
    }
})
.then(book => {
      
    res.status(204).json("Book deleted successfully")

  })
  
  .catch(err=>{
    res.status(401).send({message :err.message })
  })
  }

  else{
      res.status(401).json("Error make sure that you have authority to perform this action.")
  }

// await sleep(100);


// const _book = await bookbyid.findBybookid(book.id)

// res.status(204);

};