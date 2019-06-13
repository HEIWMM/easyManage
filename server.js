
const Koa = require('koa');
const app = new Koa();
const User = require('./server/controller/user.js');
const path = require('path');
//上传前对文件进行重新修改
const fc = require('./unit/parseload');
//koa-body
const koaBody = require('koa-body');
app.use(koaBody({
    multipart: true,
    encoding: 'gzip',
    formidable: {
        uploadDir: path.join(__dirname, 'static/upload'),
        keepExtensions: true,//是否覆盖后缀
        maxFieldsSize: 2 * 1024 * 1024,//上传大小设置
        onFileBegin: (name, file) => {
            // 获取文件后缀
            const ext = fc.getUploadFileExt(file.name);
            let avatarName = file.name + fc.getUploadFileName();
            // 最终要保存到的文件夹目录
            const dir = path.join(__dirname, `static/upload`);
            // 检查文件夹是否存在如果不存在则新建文件夹
            fc.checkDirExist(dir);
            // 重新覆盖 file.path 属性
            file.path = `@/../static/upload/${avatarName}.${ext}`;
            console.log(name, file);
        },
        onError: (err) => {
            console.log(err);
        }
    }
}));
//router
const Router = require('koa-router');

//父路由
const router = new Router();

//bodyparser:该中间件用于post请求的数据
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());

const userRouter = new Router();
userRouter.get('/user', User.getUser);
const addRouter = new Router();
addRouter.get('/add', User.addPost);
const updateRouter = new Router();
addRouter.get('/update', User.updateUser);
const deleteRouter = new Router();
addRouter.get('/delete', User.deleteUser);
//利用mongodb存入二进制文件来完成上传，但是读取时候不方便，有待研究
const uploadRouter = new Router();
addRouter.post('/upload', User.upload);
//利用formidable对于koa来说该上传解决方法不好（比如会遇到上传限制128kb问题，还没有解决），更适用于express
const upRouter = new Router();
addRouter.post('/up', async (ctx) => {
    var formidable = require('formidable');
    const path = require('path');
    const fs = require('fs');
    //详细处理上传图片的代码：

    let form = new formidable.IncomingForm();
    form.encoding = 'utf-8';//编码
    form.uploadDir = "./static/images";
    //可以修改为自己保存上传图片的文件地址，这里的关系看如下图片
    form.keepExtensions = true;//保留后缀
    form.maxFieldsSize = 4 * 1024 * 1024;//上传图片大小2m
    form.multiples = true;//开启该功能，当调用form.parse()方法时，回调函数的files参数将会是一个file数组，数组每一个成员是一个File对象，此功能需要 html5中multiple特性支持。
    console.log('first');
    //处理图片
    try {
        form.parse(ctx.req, function (err, fields, files) {
            if (err) {
                console.log(err);
            }
            console.log('second');
            console.log(fields);
            console.log(files.file.name);
            let filename = files.file.name//文件名字
            let nameArray = filename.split('.');//分割
            let type = nameArray[nameArray.length - 1];
            let name = '';
            for (let i = 0; i < nameArray.length - 1; i++) {
                name = name + nameArray[i];
            }
            let date = new Date();
            let time = '_' + date.getFullYear() + "_" + date.getMonth() + "_" + date.getDay() + "_" + date.getHours() + "_" + date.getMinutes();
            let avatarName = name + time + '.' + type;
            let newPath = form.uploadDir + "/" + avatarName;
            fs.renameSync(files.file.path, newPath);  //重命名
            console.log(avatarName);

        });
    } catch (err) {
        console.log(err);
    };

    ctx.status = 200;
    ctx.body = {
        status: 'success'
    }
})
//利用koa-body对于koa更优质，效果更好
const upaRouter = new Router();
addRouter.post('/upa', User.upa)
const recordRouter = new Router();
addRouter.get('/recordc', User.record);
const recordDelRouter = new Router();
addRouter.get('/recordDel', User.deleteUpPath);

//装载上面四个子路由

router.use('/api', userRouter.routes(), userRouter.allowedMethods());
router.use('/api', addRouter.routes(), addRouter.allowedMethods());
router.use('/api', updateRouter.routes(), updateRouter.allowedMethods());
router.use('/api', deleteRouter.routes(), deleteRouter.allowedMethods());
//mongodb
router.use('/api', uploadRouter.routes(), uploadRouter.allowedMethods());
//formidable
router.use('/api', upRouter.routes(), upRouter.allowedMethods());
//koa-body
router.use('/api', upaRouter.routes(), upaRouter.allowedMethods());
router.use('/api', recordRouter.routes(), recordRouter.allowedMethods());
router.use('/api', recordDelRouter.routes(), recordDelRouter.allowedMethods());

//加载路由中间件
app.use(router.routes()).use(router.allowedMethods());

app.listen(8885, () => {
    console.log('The server is running at http://localhost:' + 8885);
});