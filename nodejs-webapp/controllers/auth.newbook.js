const db = require("../models");
const User = db.user;
const Book =db.book;
const bookbyid =  require("../middleware/bookbyid")
const sleep = ms => new Promise(res => setTimeout(res, ms));


exports.postbook = async (req, res) => {

const base64Credentials =  req.headers.authorization.split(' ')[1];
const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
const [loginname, userpassword] = credentials.split(':');
// console.log("loginname >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+loginname)
// console.log("userpassword "+userpassword)


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




  // Save Book to Database

 const book = await Book.create({
    title: req.body.title,
    author:req.body.author,
    isbn:req.body.isbn,
    published_date:req.body.published_date,
    user_id:userinfo.id,
  })

  
  .catch(err=>{
    res.status(400).send({message :err.message })
  })
  

await sleep(100);


const _book = await bookbyid.findBybookid(book.id)

res.status(201).send(_book);

};