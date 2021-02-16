const db = require("../models");
const User = db.user;
const Book =db.book;
const bookbyid =  require("../middleware/bookbyid")
const sleep = ms => new Promise(res => setTimeout(res, ms));


exports.getbookid = async (req, res) => {

const bookid = req.params.id
// console.log("Console log >>>>>>>>>>>>>>>>>>>>>>>>> "+ bookid)

await sleep(100);


const _book = await bookbyid.findBybookid(bookid)
if(_book== undefined){
    res.status(404).send("There is no such book in the database")
}

else{
    res.status(201).send(_book);
}



};
