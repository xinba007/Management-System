const mongoose = require('mongoose');
const events = require('events');
const { log } = require('console');
const bus = new events.EventEmitter();
const formidable = require('formidable');
const path = require('path');
const { stringify } = require('querystring');


mongoose.connect('mongodb://127.0.0.1:27017/xue').then(() => {
    console.log('数据库xue连接成功');
}).catch((err) => {
    console.log(err)
});
const userSchema = new mongoose.Schema({
    user_name: String,
    user_psw: String,
    user_tel: Number,
    power: String,
    user_pic: String

})
const Users = mongoose.model('Users', userSchema);


exports.login = (req, res) => {
    if (req.url == '/api/login?t') {
        req.session.user_name.destroy((err) => {
            res.redirect('/api/login');
        })
    } else {
        res.render('user/login')
    }
}

exports.doLogin = async(req, res) => {
    let data = await Users.find({ user_name: req.body.user_name, user_psw: req.body.user_psw })

    if (data[0]) {
        req.app.locals.user_name = data[0].user_name;
        req.app.locals.power = data[0].power;
        req.session.user_name = data[0].user_name;

        res.send(`<script>alert("欢迎 ${data[0].user_name} 登录");location.href="/api/index"</script>`);
    } else {
        res.send('<script>alert("用户名或密码错误");location.href="/api/login"</script>');
    }


}

exports.index = async(req, res) => {
    let count = await Users.find().countDocuments();
    let size = req.query.size ? Number(req.qurery.size) : 6;
    let page = req.query.page ? Number(req.query.page) : 1;

    req.app.locals.data = await Users.find().skip((page - 1) * size).limit(size);
    req.app.locals.data2 = Math.ceil(count / size);

    res.render('user/index', {
        page: page,
        size: size
    });
}
exports.addIndex = (req, res) => {
    res.render('user/addIndex');
}

exports.doSign = async(req, res) => {
    let data = await Users.find({ user_name: req.body.user_name });
    let num = 0;

    if (num == 0) {
        num++
        if (Boolean(data[0])) {
            res.send('<script>alert("该用户已存在");location.href="/api/sign"</script>');
        } else {
            res.send('<script>alert("注册成功");location.href="/api/login"</script>');
            // 向数据库中添加信息
            Users.create({
                user_name: req.body.user_name,
                user_psw: req.body.user_psw,
                user_tel: req.body.user_tel,
                power: req.body.power
            });
        }
    }

}
exports.sign = (req, res) => {
    res.render('user/sign', {
        str: ''
    })
}
exports.error = (req, res) => {
    res.render('/user/error')
}
exports.remove = async(req, res) => {
    await Users.findOneAndDelete({ user_name: req.query.user_name });
    res.redirect(`/api/index?page=${req.query.page}`);
}
exports.update = async(req, res) => {
    const form = new formidable.IncomingForm();

    form.uploadDir = path.join(__dirname, '../', 'public', 'upload');

    form.keepExtensions = true;
    form.parse(req, async(err, fields, files) => {
        let pic = files.user_pic.path.split('public')[1];
        await Users.updateOne({ user_name: fields.user_name }, { user_psw: fields.user_psw, user_tel: fields.user_tel, power: fields.power, user_pic: pic });
        res.send('<script>alert("修改成功");location.href="/api/index"</script>');
    })

}
exports.add = (req, res) => {
    // 创建一个form对象
    const form = new formidable.IncomingForm();
    // 上传的文件存储的位置 public下的upload文件夹中
    form.uploadDir = path.join(__dirname, '../', 'public', 'upload');
    // 保留后缀名
    form.keepExtensions = true;
    // 接收信息
    form.parse(req, async(err, fields, files) => {
        let pic = files.user_pic.path.split('public')[1];
        let isTrue = await Users.find({ user_name: fields.user_name });
        if (isTrue[0]) {
            res.send('<script>alert("该用户已存在");location.href="/api/index"</script>');
        } else {
            Users.create({
                user_name: fields.user_name,
                user_psw: fields.user_psw,
                user_tel: fields.user_tel,
                power: fields.power,
                user_pic: pic
            });
            res.send('<script>alert("添加成功");location.href="/api/index"</script>');
        }
    });
}
exports.search = async(req, res) => {
    let username = req.query.user_name;
    let re = new RegExp(username);
    let data = await Users.find({ user_name: re }).sort({ power: -1 });
    if (data[0]) {
        req.app.locals.data = data;
        res.send(`<script>location.href="searchIndex?uname=${username}"</script>`);
    } else {
        res.send(`<script>alert("未查询到相关数据");location.href="/api/index"</script>`);
    }
}
exports.searchIndex = async(req, res) => {
    let page = req.query.page ? Number(req.query.page) : 0;
    let size = req.query.size ? Number(req.qurery.size) : 6;
    if (!req.query.uname) {
        req.app.locals.data = await Users.find().sort({ power: -1 }).skip(page * size).limit(size);
        req.app.locals.data2 = Math.ceil((await Users.find().countDocuments() / size));
    } else {
        let re = new RegExp(req.query.uname);
        req.app.locals.data = await Users.find({ user_name: re }).sort({ power: -1 }).skip(page * size).limit(size);
        req.app.locals.data2 = Math.ceil((await Users.find({ user_name: re }).countDocuments() / size));
    }
    res.render('user/searchIndex', {
        page: page,
        size: size,
        uname: req.query.uname
    });
}