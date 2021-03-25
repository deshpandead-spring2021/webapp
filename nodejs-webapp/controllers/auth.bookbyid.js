const db = require("../models");
const User = db.user;
const Book =db.book;
const bookbyid =  require("../middleware/bookbyid")
const sleep = ms => new Promise(res => setTimeout(res, ms));
const logger = require('../config/logger')
var SDC = require('statsd-client');
client = new SDC();



exports.getbookid = async (req, res) => {

    var get_bookid_start_time= Date.now()

    client.increment("counter_get_bookbyid")

const bookid = req.params.id
// console.log("Console log >>>>>>>>>>>>>>>>>>>>>>>>> "+ bookid)

await sleep(100);

var db_book_byid_start_time=Date.now();



const _book = await bookbyid.findBybookid(bookid)
if(_book== undefined){

var db_book_byid_stop_time=Date.now();

client.timing('timing_db_book_byid',db_book_byid_stop_time-db_book_byid_start_time);
    res.status(404).send("There is no such book in the database")
}

else{
    var db_book_byid_stop_time=Date.now();
    var get_bookid_stop_time= Date.now();
    client.timing('timing_getbook_byid',db_book_byid_stop_time-get_bookid_start_time)

    client.timing('timing_db_book_byid',db_book_byid_stop_time-db_book_byid_start_time);
    res.status(200).send(_book);
}



};