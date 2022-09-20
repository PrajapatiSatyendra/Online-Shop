const Product=require('../models/products');

exports.postHome=(req,res,next)=>{
    res.redirect('/getProducts');
};

exports.getProducts=(req,res,next)=>{
     
    Product
    .find()
    .then(result=>{
        if (!result) {
            const error=new Error('No Products Found!');
            error.statusCode=422;
            throw error;
        }
        res.render('shop/home',{
            products:result
        });
    })
    .catch(err=>{
        next(err);
    });

};

exports.searchKey=(req,res,next)=>{

    console.log(req.query.key,req.query.category,req.query.min,req.query.max);
    let query={};
    if (req.query.key) {
        query.$or=[
            {title:{$regex:req.query.key}},
            {description:{$regex:req.query.key}},
            {category:{$regex:req.query.key}}
        ];
    }
    if (req.query.category) {
        query.category=req.query.category; 
    }
    if (req.query.max) {
        query.price={$lte:req.query.max};
    }
    if (req.query.min) {
        query.price={$gte:req.query.min};
    }
    
     Product.find(query)
    .then(result=>{
        res.render('shop/searchProduct',{
            products:result
        })
    })
    .catch(err=>{
        next(err);
    });
};