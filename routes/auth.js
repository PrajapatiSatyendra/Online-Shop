const express=require('express');
const User=require('../models/users');
const router=express.Router();
const {check,body}=require('express-validator');
const authControllers=require('../controllers/auth');
const isAuth=require('../middleware/is-auth');

router.get('/getSignup',authControllers.getSignup);
router.get('/getLogin',authControllers.getLogin);
router.post('/logout',isAuth,authControllers.postLogout)

router.post('/postLogin',[
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .normalizeEmail(),
    body('password', 'Password has to be valid.')
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim()
  ],authControllers.postLogin);


router.post('/postSignup',[
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject(
              'E-Mail exists already, please pick a different one.'
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      'password',
      'Please enter a password with only numbers and text and at least 5 characters.'
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match!');
        }
        return true;
      })
  ],authControllers.postSignup);

module.exports=router;