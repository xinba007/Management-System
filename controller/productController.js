const mongoose = require('mongoose');
const formidable = require('formidable');
const path = require('path');
const { log } = require('console');
mongoose.connect('mongodb://127.0.0.1:27017/xue').then(() => {
    console.log('数据库连接成功');
}).catch((err) => {
    console.log(err);
});;

const productSchema = new mongoose.Schema({
    p_name: String,
    p_price: Number,
    p_sort: String,
    p_pic: String
});
const Pro = mongoose.model('products', productSchema);



exports.product = async(req, res) => {
    let page = req.query.page ? Number(req.query.page) : 1;
    let size = req.query.size ? Number(req.query.size) : 6;
    let count = await Pro.find().countDocuments();
    let length = Math.ceil(count / size);
    let data = await Pro.find().skip((page - 1) * size).limit(size);
    res.render('product/product', {
        data: data,
        size: size,
        page: page,
        count: count,
        length: length
    });
}
exports.addProduct = async(req, res) => {
    res.render('product/addProduct');
}
exports.doAddProduct = async(req, res) => {
    let form = formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '../', 'public', 'upload');
    form.keepExtensions = true;
    form.parse(req, async(err, fields, files) => {
        let pic = files.pro_pic.path.split('public')[1];
        let s = await Pro.find({ p_name: fields.pro_name });
        if (!s) {
            await Pro.create({
                p_name: fields.pro_name,
                p_price: fields.pro_price,
                p_sort: fields.pro_sort,
                p_pic: pic
            });
            res.redirect('/api/product');
        } else {
            res.send('<script>alert("该产品已存在");location.href="/api/product"</script>');
        }
    })
}
exports.removePro = async(req, res) => {
    await Pro.findOneAndDelete({ p_name: req.query.p_name });
    res.send('<script>alert("删除成功");location.href="/api/product"</script>');
}
exports.updatePro = async(req, res) => {
    let form = formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '../', 'public', 'upload');
    form.keepExtensions = true;
    form.parse(req, async(err, fields, files) => {
        let pic = files.pro_pic.path.split('public')[1];
        await Pro.updateOne({ p_name: fields.pro_name }, {
            p_price: fields.pro_price,
            p_sort: fields.pro_sort,
            p_pic: pic
        });
        res.send('<script>alert("修改成功");location.href="/api/product"</script>');
    });
}