const Employee = require('../db.js').Employee;
const Pic = require('../db.js').Pic;
const Record = require('../db.js').Record;
const RecordPic = require('../db.js').RecordPic;


//数据库的操作

// 格式化时间方法，结果类型 yy-mm-dd
const formatDate = function (date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('-');
}
//创建图片路径记录
const recordPath = function(imgpath){
  return new Promise((resolve,reject)=>{
    let path = new RecordPic({
      'imgpath':imgpath
    }) 
    path.save((err,doc)=>{
      if(err){
        reject(err);
      }
      resolve(doc);
    });
  })
}
//删除图片路径记录
const deletePath = function(imgpath){
  return new Promise((resolve,reject)=>{
    RecordPic.remove({'imgpath':imgpath},(err,doc)=>{
      resolve(doc);
    })
  })
}
//找到所有图片路径
const findAllPath = function(imgpath){
  return new Promise((resolve,reject)=>{
    RecordPic.find({},(err,doc)=>{
      resolve(doc);
    })
  })
}
//该天没有进行数据更改创建新的记录
const recordNew = function (date) {
  return new Promise((resolve, reject) => {
    let r = new Record({
      count: 1,
      date: date
    })
    r.save()
  })
}
//增加一次修改次数
const recordAdd = function (date, count) {
  return new Promise((resolve, reject) => {
    Record.update({ 'date': date }, { 'count': count + 1 }, (err, res) => {
      if (err) {
        reject(err);
      }

      resolve(res);
    });
  })
}
//数据修改记录更新
const recordUpdate = (date) => {
  return new Promise((resolve, reject) => {
    Record.findOne({ 'date': date }, (err, doc) => {
      if (err) {
        console.log('err-----');
        reject(err);
       
      }
      else if(doc == null){
        recordNew(date);
        resolve(1);
      }
      else {
        console.log(doc);
        resolve(doc.count);
      }
    })
  })
}
//找到所有用户
const findAllUsers = () => {
  return new Promise((resolve, reject) => {
    Employee.find({}, (err, doc) => {
      if (err) {
        reject(err);
      }
      resolve(doc);
    });
  });
};
//新增用户
const addpost = (form) => {
  return new Promise((resolve, reject) => {
    try {
      let p = new Employee({
        "date": form.date,
        "name": form.name,
        "province": form.province,
        "city": form.city,
        "address": form.address,
        "zip": form.zip
      });
      p.save();
      resolve(1);
    } catch (e) {
      reject(e);
    }
  }
  )
}
//更新用户
const updateUsers = (wherestr, updatestr) => {
  return new Promise((resolve, reject) => {
    Employee.update(wherestr, updatestr, (err, res) => {
      if (err) {
        reject(err);
      }

      resolve(res);
    });
  });
};
//删除用户
const deleteUsers = (wherestr) => {
  return new Promise((resolve, reject) => {
    Employee.remove(wherestr, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
}
//上传图片
const uploadPic = (path) => {
  return new Promise((resolve, reject) => {
    var fs = require('fs');
    var path = require("path");
    // img path
    var imgPath = 'C:/Users/lenovo/Pictures/wallpaper/snow.jpg';
    // connect to mongo
    // start a demo server
    console.log('path----' + path);
    console.log(__dirname);
    //var msg = fs.readFileSync(path);
    //console.log('msg----'+msg);
    var pic = new Pic;
    pic.img.data = fs.readFileSync(imgPath);
    pic.img.contentType = 'image/png';
    pic.img.imgsrc = imgPath;
    pic.save(function (err, doc) {
      if (err) {
        console.log(err);
      }
      else {
        console.log('save：' + doc);
        resolve(doc);
      }
    });
    // Pic.findById({_id:'5cff3b568a82fb4c148439b1'}, function (err, doc) {
    //   if (err) 
    //     console.log(err);
    //   else
    //     console.log(doc);
    //     resolve(doc);
    // });
  })
}

//上传图片


const upload = async (ctx) => {
  let query = ctx.request.query;
  let add = await uploadPic(query.path);
  console.log(add)
  ctx.status = 200;
  //ctx.type = 'jpg';
  ctx.body = add.img;
}

//添加用户
const addPost = async (ctx) => {
  let query = ctx.request.query;
  let addstr = {
    date: formatDate(query.date),
    name: query.name,
    province: query.province,
    city: query.city,
    address: query.address,
    zip: query.zip,
  }
  let add = await addpost(addstr);
  let doc = await findAllUsers();
  ctx.status = 200;
  ctx.body = {
    succsess: '插入成功',
    result: doc
  };
}
//查找用户
const getUser = async (ctx) => {
  let date = formatDate(new Date());
  let doc = await findAllUsers();
  let allpath = await findAllPath();
  ctx.status = 200;
  ctx.body = {
    succsess: '成功',
    result: {
      users: doc,
      imgpaths:allpath
    }
  };

  console.log(doc);
}
//更新用户
const updateUser = async (ctx) => {
  let date = formatDate(new Date());
  let query = ctx.request.query;
  let wherestr = { '_id': query._id };
  let updatestr = {
    "date": formatDate(query.date),
    "name": query.name,
    "province": query.province,
    "city": query.city,
    "address": query.address,
    "zip": query.zip,
  };
  let doc = await updateUsers(wherestr, updatestr);
  let r = await recordUpdate(date);
  let radd = await recordAdd(date, r);
  ctx.status = 200;
  ctx.body = {
    succsess: '成功',
    result: doc
  };
  console.log(doc);
}
//删除某个用户
const deleteUser = async (ctx) => {
  let date = formatDate(new Date());
  console.log(date);
  let query = ctx.request.query;
  let wherestr = { '_id': query._id };
  let doc = await deleteUsers(wherestr);
  let r = await recordUpdate(date);
  let radd = await recordAdd(date, r);
  ctx.status = 200;
  ctx.body = {
    succsess: '成功',
    result: doc
  };
  console.log(doc);
}
//查找数据修改情况
const recordDate = () => {
  return new Promise((resolve, reject) => {
    Record.find({}, (err, doc) => {
      if (err) {
        reject(err);
      }
      resolve(doc);
    });
  });
};
//记录数据修改
const record = async (ctx) => {
  //let date = formatDate(new Date());
  let arr = await recordDate();
  console.log(arr);

  ctx.status = 200;
  ctx.body = {
    succsess: '成功',
    result: arr
  }
}
//上传图片
const upa = async (ctx) => {
  const file = ctx.request.files.file;
  //let rep = JSON.stringify(ctx.request.files);
  let a = await recordPath(file.path)
  //console.log(ctx.request.files);
  //console.log(ctx.request.body);
  console.log(file.path);
  ctx.status = 200;
  ctx.body = JSON.stringify(ctx.request.files);
}
//删除图片路径
const deleteUpPath = async(ctx)=>{
  let query = ctx.request.query;
  let a = await deletePath(query.imgpath);
  console.log(query.imgpath);
  ctx.status = 200;
  ctx.body = {
    succsess: '成功',
    result: {
      imgpath:query.imgpath,
      msg:a
    }
  }
}
module.exports = {
  getUser,
  addPost,
  updateUser,
  deleteUser,
  upload,
  record,
  upa,
  deleteUpPath
};
