// var express = require('express');
// var app = express();

// app.get('/', function (req, res) {
//    res.send('Hello World');
// })
// app.get('/upload',function(req, res){
//   var fs = require('fs');
//   var mongo = require('mongodb');
//   var Grid = require('gridfs-stream');
   
//   // create or use an existing mongodb-native db instance
//   var db = new mongo.Db('Posts', new mongo.Server("127.0.0.1", 27017));
//   var gfs = Grid(db, mongo);
   
//   // streaming to gridfs
//   // var writestream = gfs.createWriteStream({
//   //     filename: 'my_file.txt'
//   // });
//   // fs.createReadStream('/some/path').pipe(writestream);
   
//   // streaming from gridfs
  
   
//   //error handling, e.g. file does not exist
//   // readstream.on('error', function (err) {
//   //   console.log('An error occurred!', err);
//   //   throw err;
//   // });
//   gfs.files.findOne({ _id: '5cfe73e6d121223fb8796039' }, function (err, file) {
//     console.log(file);
//     if (err) return res.status(400).send(err);
//     if (!file) return res.status(404).send('');

//     res.set('Content-Type', file.contentType);
//     res.set('Content-Disposition', 'attachment; filename="' + file.filename + '"');

//     var readstream = gfs.createReadStream({
//       _id: file._id
//     });

//     readstream.on("error", function(err) {
//       console.log("Got error while processing stream " + err.message);
//       res.end();
//     });

//     readstream.pipe(res);

//     console.log(readstream.pipe(res))
//   });   
//   try {
//     var readstream = gfs.createReadStream({
//       //_id: '5cfe73e6d121223fb8796039'
//       filename: 'aBlueWorld.jpg'
//     });
//     var result = {};
//     // readstream.on('data', function (data) {
//     //   var buf2 = new Buffer(data).toString('base64'); 
//     //   res.send(buf2.toString())
//     //   console.log(buf2.toString());
//     //   console.log(data);
//     // });
//     console.log(result);
//     //res.pipe(readstream);
//     console.log(result);
    
//   } catch (err) {
//     console.log(err);
    
//   }
// })


// app.listen(3885, () => {
//     console.log('应用实例，访问地址http://localhost:' + 3885);
// });






var express = require('express');
var fs = require('fs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// img path
var imgPath = 'C:/Users/lenovo/Pictures/wallpaper/snow.jpg';

// connect to mongo
mongoose.connect('mongodb://127.0.0.1:27017/Posts', { useNewUrlParser: true });

// example schema
var schema = new Schema({
    img: { data: Buffer, contentType: String }
});

// our model
var A = mongoose.model('A', schema);

mongoose.connection.on('open', function () {
  console.error('mongo is open');

  // empty the collection
  A.remove(function (err) {
    if (err) throw err;

    console.error('removed old docs');

    // store an img in binary in mongo
    var a = new A;
    a.img.data = fs.readFileSync(imgPath);
    a.img.contentType = 'image/png';
    a.save(function (err, a) {
      if (err) throw err;

      console.error('saved img to mongo');

      // start a demo server
      var server =express();
      server.get('/', function (req, res, next) {
        A.findById(a, function (err, doc) {
          if (err) return next(err);
          res.contentType(doc.img.contentType);
          res.send(doc.img.data);
        });
      });

      server.on('close', function () {
        console.error('dropping db');
        mongoose.connection.db.dropDatabase(function () {
          console.error('closing db connection');
          mongoose.connection.close();
        });
      });

      server.listen(3885, function (err) {
        //var address = server.address();
        console.error('server listening on http://loaclhost:', 3885);
        console.error('press CTRL+C to exit');
      });

      process.on('SIGINT', function () {
        server.close();
      });
    });
  });

});