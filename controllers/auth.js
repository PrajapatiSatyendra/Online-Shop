const User=require('../models/users');
const bcrypt=require('bcryptjs');
const {validationResult}=require('express-validator');

exports.getSignup=(req,res,next)=>{
    res.render('auth/signup');
};


exports.postSignup=(req,res,next)=>{
    const errors=validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        const error=new Error('Validation failed');
        error.statusCode=422;
        error.data=errors.array();
        throw error;
    }
    const fullname=req.body.fullname;
    const email=req.body.email;
    const password=req.body.password;
    bcrypt
    .hash(password,12)
    .then(hashPassword=>{
        const user=new User({
            fullname:fullname,
            email:email,
            password:hashPassword
        });
     return user.save();
    })
    .then(result=>{
        res.redirect('/getLogin');
    })
    .catch(err=>{
        console.log(err);
    });
};



exports.getLogin=(req,res,next)=>{
    res.render('auth/login');
}

exports.postLogin=(req,res,next)=>{
    const errors=validationResult(req);
    if (!errors.isEmpty()) {
        const error=new Error('Validation failed');
        error.statusCode=422;
        error.data=errors.array();
        throw error;
    }

    const email=req.body.email;
    const password=req.body.password;
    console.log(email);

    User
    .findOne({email:email})
    .then(user=>{
        if(!user)
        {
            const error=new Error("A user with this user Id does not exist.");
            error.statusCode=401;
            throw error;
        }
        bcrypt
            .compare(password,user.password)
            .then(doMatch=>{
                if(doMatch)
                {
                    req.session.isLoggedIn=true;
                    req.session.user=user;
                    return req.session.save(err=>{
                        console.log(err);
                        console.log(req.session.true);
                        res.status(200).redirect('/home');
                    });
                }
               return res.status(422).redirect('/getLogin');
               
            })
            .catch(err=>{
                console.log(err);
                res.redirect('/getLogin');
            });

    })
    .catch(err=>{
        if (!err.statusCode) {
            err.statusCode=500;
        }
        next(err);
    });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
      console.log(err);
      res.redirect('/shop.com');
    });
};
