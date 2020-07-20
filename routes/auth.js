

const express = require('express');
const router = express.Router();
const Scene   = require('../models/scenes');
const Comment = require('../models/comment');
const User    = require('../models/user');
const Notification = require('../models/notification');
const passport          = require('passport');
const formidableMiddleware        = require('express-formidable');
const bodyParser        = require('body-parser');
const async = require('async');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const middleware = require('../middleware');




// Show Register form
router.get('/register', (req, res) => {
    res.render('user/register');
});

// sign up logic
// app.post("/register", function(req, res){
//     var newUser = new User({username: req.fields.username});
//     var passw = req.fields.password
//     User.register(newUser, passw, function(err, user){
//         if(err){
//             console.log(err);
//             return res.render("register");
//         }else{
//             passport.authenticate("local")(req, res, function(){
//                 res.redirect("/scenes"); 
//              });
//         }
//     });
// });

router.post("/register", bodyParser.urlencoded({extended: true}), function (req, res, next) {
    var newUser = new User({
        username: req.body.username,
        email: req.body.email
    });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message)
            return res.redirect('/register');
        }
        // go to the next middleware
        next();
    });
}, passport.authenticate('local', { 
    successRedirect: '/scenes',
    failureRedirect: '/' 
}));


// Log in route
router.get('/login', (req, res) => {
    res.render('user/login');
})

// app.post('/login', (req, res) => {
//     var test = req.fields.username
//     res.send(test)
// })

router.post('/login', bodyParser.urlencoded({extended: true}), passport.authenticate('local', 
    {   
        
        successRedirect: '/scenes',
        successFlash: ("sucess", "Welcome Back"),
        failureFlash: "Invalid user or password", 
        failureRedirect: '/login'}),
        (req, res) => {
            
})

router.get('/logout', bodyParser.urlencoded({extended: true}), (req, res) => {
    
    req.logout();
    req.flash('sucess', 'see ya...');
    res.redirect('/scenes');
});

router.get('/users/:id', middleware.isLoggedIn, (req, res) => {
    User.findById(req.params.id).populate('followers').exec((err, foundUser) => {
        if (err || !foundUser) {
            req.flash('error', 'sorry, we could not find the user you are looking for. :/')
            res.redirect('back')
        } 
        let isFollowing = false

        if(req.user._id !== foundUser._id && foundUser.followers.length > 0){
            for(var i = 0; 0 < foundUser.followers.length; i++){
                if(foundUser.followers[i].id === req.user.id){
                    isFollowing = true
                    break
                }
            }
        }
  
        Scene.find().where('author.id').equals(foundUser._id).exec(function(err, scenes){
            if (err || !scenes) {
                req.flash('error', 'sorry, we could not find you are looking for. :/')
                res.redirect('back')
            }
            Scene.find().where('saveScene').equals(req.user._id).exec(function(err, foundScenes){
                if (err || !scenes) {
                    req.flash('error', 'sorry, we could not find you are looking for. :/')
                    res.redirect('back')
                }
                res.render('user/show', {savedScene:foundScenes, user: foundUser, scenes: scenes, isFollowing})
            });
        });
    });
});

router.get('/follow/:id', middleware.isLoggedIn, (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        if(err){
            req.flash('error', err.message);
            res.redirect('/back');
        }
        foundUser.followers.push(req.user._id);

        let newNotification = {
            username: req.user.username,
            message: "Is following you.",
            goTo: `/users/${req.user._id}`
        }

        Notification.create(newNotification, (err, createdNotif)=>{
            if(err){
                req.flash('error', err.message);
            }
                foundUser.notifications.push(createdNotif);
                foundUser.save();
        });

        
        req.flash('sucess', `You are now following ${foundUser.username}.`);
        res.redirect(`/users/${req.params.id}`);
    });
});

router.get('/unfollow/:id', middleware.isLoggedIn, (req, res) => {
    User.findById(req.params.id).populate('followers').exec((err, foundUser) => {
        if(err || !foundUser){
            req.flash('error', err.message);
            res.redirect('/back');
        }
        let newNotification = {
            username: req.user.username,
            message: "Unfollowed you.",
            goTo: `/users/${req.user._id}`
        }

        for(var i = 0; i < foundUser.followers.length; i++){
            if(foundUser.followers[i].id === req.user.id){
                foundUser.followers.splice(i, 1);
                Notification.create(newNotification, (err, createdNotif) =>{
                    if(err){
                        req.flash('error', err.message);
                    }
                    foundUser.notifications.push(createdNotif);
                    foundUser.save() 
                });
                break
            }
        }
        req.flash('sucess', `You do not follow ${foundUser.username} anymore.`);
        res.redirect(`/users/${req.params.id}`);
    });
});



router.get('/notifications', middleware.isLoggedIn, (req, res) => {
    User.findById(req.user._id).populate({
        path: 'notifications',
        options: { sort: {'_id': -1}}
    }).exec( (err, foundUser) => {
        if (err) {
            req.flash('error', err.message)
            res.redirect('back');
        }
        foundUser.notifications.forEach(function(notification){
            notification.isRead = true;
            notification.save();
        })
        // let allNotifications = foundUser.allNotifications;
        res.render('notifications/index', {allNotifications: foundUser.notifications});
    });
});

// router.post('/clicked', (req, res) => {

//     db.collection('clicks').save(click, (err, result) => {
//       if (err) {
//         return console.log(err);
//       }
//       console.log('click added to db');
//       res.sendStatus(201);
//     });
//   });


router.get('/clicked', middleware.isLoggedIn, (req, res) => {
    User.findById(req.user._id).populate('notifications').exec((err, foundUser) => {
        if (err) {
            req.flash('error', err.message)
            res.redirect('back');
        }
        foundUser.notifications.forEach(function(notification){
            notification.isRead = true;
            notification.save();
        })
        res.sendStatus(201);
    });
});

router.get('/notifications/isread', middleware.isLoggedIn, (req, res) => {
    User.findById(req.user._id).populate('notifications').exec((err, foundUser) => {
        if (err) {
            req.flash('error', err.message)
            res.redirect('back');
        }
        foundUser.notifications.forEach(function(notification){
            notification.isRead = true;
            notification.save();
        })
        res.redirect('back')
    });
});




// router.get('/users/:id', (req, res) => {
//     User.findById(req.params.id, (err, foundUser) => {
//         if (err || !foundUser) {
//             req.flash('error', 'sorry, we could not find the user you are looking for. :/')
//             res.redirect('back')
//         } 
//         Scene.find().where('author.id').equals(foundUser._id).exec(function(err, scenes){
//             if (err || !scenes) {
//                 req.flash('error', 'sorry, we could not find you are looking for. :/')
//                 res.redirect('back')
//             }
//             res.render('user/show', {user: foundUser, scenes: scenes})
//         })
        
//     });
// })

router.get('/forgot', (req, res) =>{
    res.render('user/forgot');
    
});

router.post('/forgot', bodyParser.urlencoded({extended: true}), (req, res) => {
    async.waterfall([
        function(done){
            crypto.randomBytes(20, function(err, buf){
                const token = buf.toString('hex');
                done(err, token)
            });
        },
        function(token, done){
            User.findOne({email: req.body.email}, function(err, user){
                if(!user){
                    req.flash('error', "User does not exists.");
                    return res.redirect('/forgot')
                }
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000

                user.save(function(err){
                    done(err, token, user);
                });
            });
        },
        function(token, user, done){
            const smtpTransport = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: 'ahoyworld.contact@gmail.com',
                    pass: process.env.GMAILPW2
                }
            });
            const mailOptions = {
                to: user.email,
                from: 'ahoyworld.contact@gmail.com',
                subject: 'Ahoy World - Password Reset',
                text: `Ahoy ${user.username}, we are sending you a link to reset your password
                click on the following link to reset your password:
                http://${req.headers.host}/reset/${token} \n\n`
            };
            smtpTransport.sendMail(mailOptions, function(err){
                console.log('email sent');
                req.flash('success', `An email verification was sent to ${user.email}`);
                done(err, 'done');
            })
        }
    ], function(err){
        if(err) return next(err)
            res.redirect('/forgot');
    });
});


router.get('/reset/:token', (req, res) => {
    User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now()}}, (err, foundUser) => {
        if(!foundUser){
            req.flash('error', 'Password reset token is invalid or is expired.');
            return res.redirect('/forgot');
        }
        res.render('user/reset', {token: req.params.token});
    });
});

router.post('/reset/:token', bodyParser.urlencoded({extended: true}),function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
          if(req.body.password === req.body.confirm) {
            user.setPassword(req.body.password, function(err) {
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
  
              user.save(function(err) {
                req.logIn(user, function(err) {
                  done(err, user);
                });
              });
            })
          } else {
              req.flash("error", "Passwords do not match.");
              return res.redirect('back');
          }
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: 'ahoyworld.contact@gmail.com',
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'ahoyworld.contact@gmail.com',
          subject: 'Your password has been changed',
          text: `Hello, ${user.username}' +
            This is a confirmation that the password for your account  user.email has just been changed.\n`
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/scenes');
    });
  });



  
module.exports = router