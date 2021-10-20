const express = require('express');
const userRouter = require('./router/user');
const productRouter = require('./router/product');
const bodyParser = require('body-parser'); // 获取post请求提交的信息
let session = require('express-session')

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
// 配置session
app.use(session({
    secret: 'this is a mimi', //用来加密的 
    resave: false, //强制保存session，即使session没有变化也要强制保存，默认为true，通常写成false
    saveUninitialized: true, //强制将未初始化的session存储，默认为true，通常写成true
    cookie: { //cookie过期了，session就自动消失
        // secure: true  https协议
        maxAge: 30 * 60 * 1000
    },
    rolling: true //重新记录cookie的过期时间
}))
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static('public'));
app.use('/api', express.static('public'));

app.use((req, res, next) => {
    if (req.url != "/api/login" && req.url != "/api/doLogin" && req.url != "/api/doSign" && req.url != "/api/sign" && !req.session.user_name) {
        res.redirect("/api/login")
    } else {
        next();
    }
})
app.use('/api', userRouter);
app.use('/api', productRouter);

app.listen(3000, () => {
    console.log('3000running');
})