

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
    successRedirect: 'back',
    failureRedirect: 'back' 
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
        
        successRedirect: '/',
        successFlash: ("sucess", "Welcome Back "),
        failureFlash: ("error", "Invalid user or password"), 
        failureRedirect: '/login'}),
        (req, res) => {
            
})

router.get('/logout', bodyParser.urlencoded({extended: true}), (req, res) => {
    
    req.logout();
    req.flash('success', 'Come back soon...');
    res.redirect('back');
});

// router.get('/users/:id', middleware.isLoggedIn, (req, res) => {
//     User.findById(req.params.id).populate('followers').populate('following').exec((err, foundUser) => {
//         if (err || !foundUser) {
//             req.flash('error', 'sorry, we could not find the user you are looking for. :/')
//             res.redirect('back')
//         } 
        
//         let memberSince = foundUser._id.getTimestamp().toDateString().split(' ', 4);

//         let isFollowing = false
//         if(req.user._id !== foundUser._id && foundUser.followers.length > 0){
//             for(var i = 0; i < foundUser.followers.length; i++){
//                 if(foundUser.followers[i].id === req.user.id){
//                     isFollowing = true
//                     break
//                 }
//             }
//         }
  
//         Scene.find().where('author.id').equals(foundUser._id).exec(function(err, scenes){
//             if (err || !scenes) {
//                 req.flash('error', 'sorry, we could not find you are looking for. :/')
//                 res.redirect('back')
//             }
//             Scene.find().where('saveScene').equals(foundUser._id).exec(function(err, foundScenes){
//                 if (err || !scenes) {
//                     req.flash('error', 'sorry, we could not find you are looking for. :/')
//                     res.redirect('back')
//                 }
//                 Scene.find().where('flag').equals(foundUser._id).exec(function(err, flag){
//                     if (err || !scenes) {
//                         req.flash('error', 'sorry, we could not find you are looking for. :/')
//                         res.redirect('back')
//                     }
                    
//                     res.render('user/show', {savedScene:foundScenes, flag, user: foundUser, scenes: scenes, isFollowing, memberSince})
//                 });
//             });
//         });
//     });
// });

router.get('/users/:id', middleware.isLoggedIn, (req, res) => {
    User.findById(req.params.id).populate('followers').populate('following').exec((err, foundUser) => {
        if (err || !foundUser) {
            req.flash('error', 'sorry, we could not find the user you are looking for. :/')
            res.redirect('back')
        } 
        
        let memberSince = foundUser._id.getTimestamp().toDateString().split(' ', 4);

        let isFollowing = false
        if(req.user._id !== foundUser._id && foundUser.followers.length > 0){
            for(var i = 0; i < foundUser.followers.length; i++){
                if(foundUser.followers[i].id === req.user.id){
                    isFollowing = true
                    break
                }
            }
        }
        var perPage = 4;
        var pageQuery = parseInt(req.query.page);
        var pageNumber = pageQuery ? pageQuery : 1;

        Scene.find({'author.id': foundUser._id}).skip((perPage * pageNumber) - perPage).limit(perPage).exec((err, allScenes) => {
           
            
            Scene.countDocuments({'author.id': foundUser._id}).exec(function (err, count) {
                
            if (err) {
                req.flash('error', 'sorry, we could not find you are looking for. :/')
                res.redirect('back')
            } else {
                Scene.find().where('saveScene').equals(foundUser._id).exec(function(err, savedScenes){
                    if (err || !savedScenes) {
                        req.flash('error', 'sorry, we could not find you are looking for. :/')
                        res.redirect('back')
                    }
                    Scene.find().where('flag').equals(foundUser._id).exec(function(err, flag){
                        if (err || !flag) {
                            req.flash('error', 'sorry, we could not find you are looking for. :/')
                            res.redirect('back')
                        }
                        
                        res.render('user/show', {
                            savedScene:savedScenes, 
                            flag, 
                            user: foundUser, 
                            scenes: allScenes, 
                            isFollowing, 
                            memberSince,
                            current: pageNumber,
                            pages: Math.ceil(count / perPage)
                        })                    
                    });
            });
                
                }
            })
        })
    });
});



router.get('/follow/:id', middleware.isLoggedIn, (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        if(err){
            req.flash('error', err.message);
            res.redirect('/back');
        }
        foundUser.followers.push(req.user._id);
        foundUser.save()

        User.findById(req.user._id, (err, currentUser) => {
            if(err){
                req.flash('error', err.message);
                res.redirect('/back');
            }
            currentUser.following.push(foundUser._id);
            currentUser.save();
        });



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

        
        req.flash('success', `You are now following ${foundUser.username}.`);
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

        User.findById(req.user.id).populate('following').exec((err, currentUser) => {
            if(err){
                req.flash('error', err.message);
                res.redirect('/back');
            }


            for(var i = 0; i < currentUser.following.length; i++){
                if(currentUser.following[i].id === foundUser.id){
                    currentUser.following.splice(i, 1);
                    currentUser.save()
                    break
                }
            }

            for(var j = 0; j < foundUser.followers.length; j++){
                if(foundUser.followers[j].id === currentUser._id){
                    foundUser.followers.splice(i, 1);
                    foundUser.save()
                    break
                }
            }
            
        });

        

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
        req.flash('success', `You do not follow ${foundUser.username} anymore.`);
        res.redirect(`/users/${req.params.id}`);
    });
});


router.get('/users/scenes/share', middleware.isLoggedIn, (req, res) => {
    User.findById(req.user._id).populate({
        path: 'following',
        options: { sort: {'_id': -1}}
    }).exec( (err, foundUser) => {
        if (err) {
            req.flash('error', err.message)
            res.redirect('back');
        }
        // foundUser.notifications.forEach(function(notification){
        //     notification.isRead = true;
        //     notification.save();
        // })
        // let allNotifications = foundUser.allNotifications;
        console.log("grom back end: ");
        console.log(foundUser.following);
        res.send({data:foundUser.following});
    });
});

router.post('/scene/share/:sceneId/:userId', middleware.isLoggedIn, (req, res) => {
    User.findById(req.params.userId).populate({
        path: 'notifications',
        options: { sort: {'_id': -1}}
    }).exec( (err, foundUser) => {
        if (err) {
            req.flash('error', err.message)
            res.redirect('back');
        }
        let newNotification = {
            username: req.user.username,
            message: "shared a location with you",
            goTo: `/scenes/${req.params.sceneId}`
        }
    
        Notification.create(newNotification, (err, createdNotif)=>{
            if(err){
                req.flash('error', err.message);
            }
                foundUser.notifications.push(createdNotif);
                foundUser.save();
                res.send({data:createdNotif})
        });
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
        res.send({allNotifications: foundUser.notifications});
    });
});



router.get('/user/locations/saved', middleware.isLoggedIn, (req, res) => {
    Scene.find({saveScene: req.user._id}).populate('saveScene').exec((err, locations) => {
        if (err) {
            res.redirect("/scenes");
        } else {
           res.send({locations})
        }
    });
});

router.get('/user/locations/flagged', middleware.isLoggedIn, (req, res) => {
    Scene.find({flag: req.user._id}).populate('flag').exec((err, locations) => {
        if (err) {
            res.redirect("/scenes");
        } else {
           res.send({locations})
        }
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
            crypto.randomBytes(3, function(err, buf){
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
                text: `Ahoy ${user.username}, we are sending you a token to reset your password.
                Your token: ${token}`
            };
            smtpTransport.sendMail(mailOptions, function(err){
                req.flash('success', `An email verification was sent to ${user.email}`);
                done(err, 'done');
            })
        }
    ], function(err){
        if(err) {
            res.redirect('/forgot');
        } else {
            
            res.redirect('/token');
        }
    });
});

router.get('/token', (req, res) => {
    req.flash('success', 'An email verification token was sent to your email.');
    res.render('user/token');
})
            
router.post('/forgot/secret', formidableMiddleware(),  (req, res) => {
    var token = req.fields.token

    User.findOne({resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now()}}, (err, foundUser) => {
        if(!foundUser){
            req.flash('error', 'Token is invalid or is expired.');
            return res.redirect('/forgot');
        }
        req.flash('success', 'Paste or type your token to change your password');
        res.render('user/reset', {token});
    });
});

router.post('/reset/secret/:token', bodyParser.urlencoded({extended: true}),function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Token is invalid or has expired.');
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
          req.flash('success', 'Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/scenes');
    });
  });

router.post('/users/:id/edit', formidableMiddleware(), (req, res) => {

    function validURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
          '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(str);
      }

    User.findById(req.params.id, (err, foundUser) => {
        if (err || !foundUser) {
            req.flash('error', 'sorry, we could not find the user you are looking for. :/')
            res.redirect('back')
        } 
        if(req.fields.facebook !== foundUser.facebook && req.fields.facebook !== "") {
            if(validURL(req.fields.facebook) !== true){
                foundUser.facebook = req.fields.facebook
            }
        }

        if(req.fields.instagram !== foundUser.instagram && req.fields.instagram !== ""){
            
                foundUser.instagram = req.fields.instagram
        }
        if(req.fields.description !== foundUser.description && req.fields.description !== "") foundUser.description = req.fields.description
        
        var avatar = req.fields.avatar1

        if(avatar !== undefined && avatar !== foundUser.avatar && avatar !== ""){
            foundUser.avatar = "/images/avatars/" + req.fields.avatar1.toString() + ".png"
        }
        var countryChange = false
        if(req.fields.country !== foundUser.location.country && req.fields.country !== ""){
            foundUser.location.country = req.fields.country
            countryChange = true
        }
        if(countryChange === true ){
            foundUser.location.state = req.fields.state
        } 

        if(req.fields.description !== foundUser.description) foundUser.description = req.fields.description
        
        foundUser.save();
        req.flash('success', `Your profile info has been updated.`)
        res.redirect('back')
    });
});





  
module.exports = router