const express = require('express');
const router = express.Router();
const Scene   = require('../models/scenes');
const Comment = require('../models/comment');
const User    = require('../models/user')
const passport          = require('passport');

// Show Register form
router.get('/register', (req, res) => {
    res.render('register')
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

router.post("/register", function (req, res, next) {
    var newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            return res.send(err);
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
    res.render('login')
})

// app.post('/login', (req, res) => {
//     var test = req.fields.username
//     res.send(test)
// })

router.post('/login', passport.authenticate('local', 
    {
        successRedirect: '/scenes', 
        failureRedirect: '/login'}), 
        
        (req, res) => {
})

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/scenes')
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

module.exports = router