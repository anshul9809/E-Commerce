const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ECommerce');

const db = mongoose.connection;

db.on('error',console.error.bind(console,"Error connecting to MongoDB ......"));

db.once('open',function(){
    console.log('Connected to Database :: Mongodb')
});

module.exports = db;