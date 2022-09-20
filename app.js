const express=require('express');
const path=require('path');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const session=require('express-session');
const MongoDBStore=require('connect-mongodb-session')(session);
const multer=require('multer');
const {v4:uuidv4}=require('uuid');

const fileStorage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'images');
    },
    filename:function(req,file,cb){
        cb(null,uuidv4());
    }

});

const fileFilter=(req,file,cb)=>{
     if (file.mimetype === 'image/png' ||
         file.mimetype === 'image/jpg '||
         file.mimetype === 'image/jpeg') {
            cb(null,true);
     }
     else{
        cb(null,false);
     }
};

const MONGODB_URI='mongodb://0.0.0.0:27017/shop';


const mainRoutes=require('./routes/main.js');
const authRoutes=require('./routes/auth.js');
const shopRoutes=require('./routes/shop.js');
const adminRoutes=require('./routes/admin.js');


const app=express();
const store=MongoDBStore({
    uri:MONGODB_URI,
    collection:'sessions'
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));
app.use(multer({storage:fileStorage,fileFilter:fileFilter}).single('image'));


app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname, 'images')));


app.set('view engine','ejs');
app.set('views','views');

app.use(session({
    secret:'my secret',
    resave:false,
    saveUninitialized:false,
    store:store
}));

app.use(mainRoutes);
app.use(authRoutes);
app.use(shopRoutes);
app.use(adminRoutes);

mongoose
.connect(MONGODB_URI)
.then(result=>{
    app.listen(8080);
})
.catch(err=>{
    console.log(err);
});