const mongoose = require('mongoose');
mongoose.connect('mongodb://148.70.235.23:27017/Posts', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, '连接数据库失败'));
db.once('open', () => {
    console.log('连接成功');//成功连接
});
const postSchema = mongoose.Schema({
    date: String,
    name: String,
    province: String,
    city: String,
    address: String,
    zip: String
});
const Picschema = mongoose.Schema({
    img: { 
        data: Buffer, 
        contentType: String ,
        imgsrc: String
    }
});
const recordSchema = mongoose.Schema({
    count: Number,
    date: String 
    
});
const recordPicSchema = mongoose.Schema({
    imgpath:String
    
});

// our model
const model = {
    Employee: mongoose.model('Employee', postSchema),
    Pic: mongoose.model('pic', Picschema),
    Record: mongoose.model('record', recordSchema),
    RecordPic: mongoose.model('recordpic', recordPicSchema),
};

module.exports = model;
