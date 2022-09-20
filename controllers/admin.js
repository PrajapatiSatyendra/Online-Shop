const Product=require('../models/products');
const path=require("path");

exports.addProduct=(req,res,next)=>{
      const title=req.body.title;
      const category=req.body.category;
      const price=req.body.price;
      const description=req.body.description;
      const image=req.file;
      const imageUrl=image.path;

      const products=new Product({
        title:title,
        category:category,
        price:price,
        description:description,
        imageUrl:imageUrl,
      });
      products
      .save()
      .then(result=>{
        if (!result) {
            const error=new Error('Something Went Wrong!!');
            throw error;
        }
        res.status(201).json({message:'Product added successfully',posts:result});
      })
      .catch(err=>{
        if (!err.statusCode) {
            err.statusCode=500;
        }
        next(err);
      })
};