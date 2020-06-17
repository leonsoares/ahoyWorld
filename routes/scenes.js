const express = require('express');
const router = express.Router();
const Scene   = require('../models/scenes');
const Notification = require('../models/notification');
// const User    = require('./models/user')
const bodyParser        = require('body-parser');
const User = require('../models/user');
const Review = require('../models/reviews');

const formidableMiddleware        = require('express-formidable');
const middleware = require('../middleware');

// node-geocoder config

var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: "AIzaSyDIuLB4OpdqS823hdshWhlHZ04NSlySvvs", //process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);


// scenes Routes 
router.get('/', (req, res) =>{
    res.render('landing')
})

// render all scenes:
router.get('/scenes', (req , res) => {
    Scene.find({}, (err, allScenes) => {
        if (err) {
            console.log('err')
        } else {
            res.render('scenes/index', {scenes:allScenes});
        }
    })
});



// show form to add new scene ground
router.get('/scenes/new', middleware.isLoggedIn, (req, res) =>{
    res.render('scenes/new.ejs')
})

router.get('/scenes/:id', (req, res) => {
    // res.send('this is the show page');
    Scene.findById(req.params.id).populate({
        
            path:'comments likes reviews',
            options: {sort: {createAt: -1}
        }
    }).exec((err, foundScene) => {
        if (err || !foundScene) {
            req.flash('error', 'Scene not found')
            res.redirect('back')
        } else {
            // render show template with that scene
            res.render('scenes/show', {scene:foundScene})
        }
    })
})

// EDIT ROUTE
router.get('/scenes/:id/edit', middleware.sceneIsAuthorized, (req, res) => {
    Scene.findById(req.params.id, (err, foundScene) => {
        if (err) {
            console.log(err)
        } else {
            res.render('scenes/edit', {scene:foundScene});
        }
    })
});


// Create New Scene
router.post('/scenes', middleware.isLoggedIn, formidableMiddleware(), (req, res) => {

    // add data from form to scenes array
    req.fields.author = {
        id: req.user._id,
        username: req.user.username
    }
   
    var def = "/images/default.png"
    if(req.fields.image === "") req.fields.image = def
    if(req.fields.description === "") req.fields.description = "Beautiful"

    
    geocoder.geocode(req.fields.location, (err, data) => {
        console.log(data)
        if (err || !data.length) {
          req.flash('error', 'Invalid address');
          return res.redirect('back');
        }
        req.fields.lat = data[0].latitude;
        req.fields.lng = data[0].longitude;
        req.fields.location = data[0].formattedAddress;
     
        // Create a new scene and save to DB
        Scene.create(req.fields, (err, foundScene) => {
            if (err) {
                console.log('something went wrong')
            } else {
                console.log("New Scene Successifully created")
                console.log(foundScene);
    
                User.findById(req.user._id).populate('followers').exec((err, foundUser) => {
                    if(err){
                        req.flash('error', err.message)
                    }
                    let newNotification = {
                        username: req.user.username,
                        sceneId: foundScene._id
                    }
                    if(foundUser.followers.length > 0){
                        for(const follower of foundUser.followers){
                            Notification.create(newNotification, (err, createdNotif) => {
                                if(err){
                                req.flash("error", err.message)
                                }
                                follower.notifications.push(createdNotif);
                                follower.save();

                            });
                    }
                    
                    }
                    res.redirect(`/scenes/${foundScene.id}`)
                })
            }
        }); 
    });
});


// Edit ROUTE
router.put('/scenes/:id', middleware.sceneIsAuthorized, formidableMiddleware(), (req, res) => {
    geocoder.geocode(req.fields.location, function (err, data) {
        console.log(req.fields.location)
        if (err || !data.length) {
          req.flash('error', 'Invalid address');
          return res.redirect('back');
        }
        req.fields.lat = data[0].latitude;
        req.fields.lng = data[0].longitude;
        req.fields.location = data[0].formattedAddress;
    
    
    // add data from form to scenes array
        Scene.findByIdAndUpdate(req.params.id, req.fields, (err, updatedScene) =>{
            if(err){
                res.send(err)
            } else{
                res.redirect('/scenes/' + req.params.id)
            }
        });
    })
})

// DELETE
router.delete('/scenes/:id', middleware.sceneIsAuthorized, (req, res) => {
    // add data from form to scenes array
    Scene.findById(req.params.id, function (err, scene) {
        if (err) {
            res.redirect("/scenes");
        } else {
            // deletes all comments associated with the scene
            Comment.remove({"_id": {$in: scene.comments}}, function (err) {
                if (err) {
                    console.log(err);
                    return res.redirect("/scenes");
                }
                // deletes all reviews associated with the scene
                Review.remove({"_id": {$in: scene.reviews}}, function (err) {
                    if (err) {
                        console.log(err);
                        return res.redirect("/scenes");
                    }
                    //  delete the Scene
                    scene.remove();
                    req.flash("success", "Scene deleted successfully!");
                    res.redirect("/scenes");
                });
            });
        }
    });
});

router.post('/scenes/:id/like', middleware.isLoggedIn, (req, res) => {
    Scene.findById(req.params.id, (err, foundScene) => {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        let foundUserLike = foundScene.likes.some(function (like) {
            return like.equals(req.user._id);
        });

        if (foundUserLike) {
            // user already liked, removing like
            foundScene.likes.pull(req.user._id);
        } else {
            // adding the new user like
            foundScene.likes.push(req.user);
        }

            foundScene.save(function (err) {
            if (err) {
                console.log(err);
                return res.redirect("/scenes");
            }
            return res.redirect("/scenes/" + foundScene._id);
        });

    })
});

module.exports = router