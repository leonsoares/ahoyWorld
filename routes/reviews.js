const express = require("express");
const router = express.Router({mergeParams: true});
const Scene = require("../models/scenes");
const Review = require("../models/reviews");
const middleware = require("../middleware");
const formidableMiddleware        = require('express-formidable');
const bodyParser        = require('body-parser');


// Reviews Create
router.post("/scenes/:id/reviews", middleware.isLoggedIn, formidableMiddleware(), function (req, res) {
    
    Scene.findById(req.params.id).populate("reviews").exec(function (err, scene) {
        if (err || !scene) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        var userHasReview = false
        
        
        scene.reviews.forEach(function(item){
            if(JSON.stringify(item.author.id) == JSON.stringify(req.user._id)){
              
                 userHasReview = true
                
                 item.rating = parseInt(req.fields[0])
                 item.save()
                 scene.rating = calculateAverage(scene.reviews)
                 scene.save()
                 var message = "Your rate was updated"
                 var ratingLength = scene.reviews.length
                 return res.send({message, user: req.user, ratingLength, userRate:req.fields[0], sceneRate : scene.rating})
            }
        });


        if(userHasReview === false){
            let newReview = {
                rating: parseInt(req.fields[0]),
                author: {
                    id: req.user._id,
                    username: req.user.username
                },
                scene: scene
            }


            Review.create(newReview, function(err, createdReview){
                if(err || !createdReview){
                }
                var message = "Thanks for Rating this location"
          
                scene.reviews.push(createdReview)
                
                
                scene.rating = calculateAverage(scene.reviews)
                scene.save()
                var ratingLength = scene.reviews.length
                let createdAt = createdReview._id.getTimestamp().toDateString().split(' ', 4).join(' ')

                return res.send({message, user: req.user, ratingLength, userRate:req.fields[0], createdAt, sceneRate : scene.rating})
            })
        }
    });
});


router.get("/scenes/:id/reviews/list", formidableMiddleware(), function (req, res) {
    
    Scene.findById(req.params.id).populate("reviews").exec(function (err, scene) {
        if (err || !scene) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
    return res.send({rate: scene.reviews})
    })
});

function calculateAverage(reviews) {
    if (reviews.length === 0) {
        return 0;
    }
    var sum = 0;
    reviews.forEach(function (element) {
        sum += element.rating;
    });
    return sum / reviews.length;
}

module.exports = router;