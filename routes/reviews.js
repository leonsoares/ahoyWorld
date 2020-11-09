const express = require("express");
const router = express.Router({mergeParams: true});
const Scene = require("../models/scenes");
const Review = require("../models/reviews");
const middleware = require("../middleware");
const formidableMiddleware        = require('express-formidable');
const bodyParser        = require('body-parser');

// Reviews Index
// router.get("/scenes/:id/reviews", function (req, res) {
//     Scene.findById(req.params.id).populate({
//         path: "reviews",
//         options: {sort: {createdAt: -1}} // sorting the populated reviews array to show the latest first
//     }).exec(function (err, foundScene) {
//         if (err || !foundScene) {
//             req.flash("error", err.message);
//             return res.redirect("back");
//         }
//         res.render("reviews/index", {scene: foundScene});
//     });
// });

// Reviews New
// router.get("/scenes/:id/reviews/new", middleware.isLoggedIn, middleware.checkReviewExistence, function (req, res) {
    // middleware.checkReviewExistence checks if a user already reviewed the scene, only one review per user is allowed
//     Scene.findById(req.params.id, function (err, scene) {
//         if (err) {
//             req.flash("error", err.message);
//             return res.redirect("back");
//         }
//         res.render("reviews/new", {scene});

//     });
// });

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
                console.log("**********************************")
                console.log("OKAY LETS UPDATE YOUR RATE")
                console.log("**********************************")
                 userHasReview = true
                 console.log("this is item before update " + item)
                 console.log("this is the scene rating before update: " + scene.rating )
                 item.rating = parseInt(req.fields[0])
                 item.save()
                 scene.rating = calculateAverage(scene.reviews)
                 scene.save()
                 console.log("this is the item after update: " + item )
                 console.log("this is the scene rating after update: " + scene.rating )
                 var message = "Your rate was updated"
                 var ratingLength = scene.reviews.length
                 console.log(scene.reviews.length)
                 return res.send({message, user: req.user, ratingLength, userRate:req.fields[0], sceneRate : scene.rating})
            }
        });


        if(userHasReview === false){
            console.log("**********************************")
            console.log("OKAY LETS CREAT A NEW RATE")
            console.log("**********************************")
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
                    console.log(err)
                }
                var message = "Thanks for Rating this location"
                // console.log("this is the new review: " + createdReview)
                // console.log("this is scene.reviews without new review: " + scene.reviews)
                // console.log("this scene rating without review: " + scene.rating)

                scene.reviews.push(createdReview)
                console.log("reviwes length is: " + scene.reviews.length)
                
                
                scene.rating = calculateAverage(scene.reviews)
                scene.save()
                var ratingLength = scene.reviews.length

                // Scene.findById(req.params.id).populate("reviews").exec(function (err, updatedscene) {
                //     if(err || !updatedscene){
                //         message = "Something went wrong"
                //     }
                    
                //     updatedscene = scene.reviews.length

                // })
                console.log("scene review length: " + scene.reviews.length)
                // console.log("this is the new review: " + createdReview)
                // console.log("this is scene.reviews WITH NEW review: " + scene.reviews)
                // console.log("this scene rating WITH NEW review: " + scene.rating)
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
    console.log(scene.reviews)
    return res.send({rate: scene.reviews})
    })
});



// ------------------------- WORKS --------------------------
// Review.find().where("author.id").equals(req.user.id).exec(function (err, review) {
//     if (err) {
//         req.flash("error", err.message);
//         return res.redirect("back");
//     } 
//     review.forEach(function(item){
//         if(JSON.stringify(item.scene) === JSON.stringify(req.params.id)){
//             console.log("yes it is ")
//         }
//     })
//     console.log(req.fields[0])
// });
// -------------------------------------------------------------
    
    


// middleware.checkReviewExistence,
            
// Reviews Edit
// router.get("/scenes/:id/reviews/:review_id/edit", middleware.isLoggedIn, middleware.checkReviewOwnership, function (req, res) {
//     Review.findById(req.params.review_id, function (err, foundReview) {
//         if (err) {
//             req.flash("error", err.message);
//             return res.redirect("back");
//         }
//         res.render("reviews/edit", {scene_id: req.params.id, review: foundReview});
//     });
// });

// Reviews Update
// router.put("/scenes/:id/reviews/edit", middleware.isLoggedIn, bodyParser.urlencoded({extended: true}), function (req, res) {

//     Review.findOneAndUpdate().where("author.id").equals(req.user.id).exec({$set: {rating: parseInt(req.body.review.rating)}}, function (err, updatedReview) {
//         if (err) {
//             req.flash("error", err.message);
//             return res.redirect("back");
//         }
//         console.log("you selected - "  + req.body.review.rating)

//         console.log("updatedReview.rating is - " + updatedReview.rating)
//         // updatedReview.rating = parseInt(req.body.review.rating)
//         // updatedReview.save()
//         console.log("updatedReview.rating has been change and now is - " + updatedReview.rating)


//         Scene.findByIdAndUpdate(req.params.id).populate("reviews").exec(function (err, scene) {
//             if (err) {
//                 req.flash("error", err.message);
//                 return res.redirect("back");
//             }
//             // recalculate review average
//             console.log("this is the length - " + scene.reviews)

//             console.log("scene.rating now is - " + scene.rating)

//             scene.rating = calculateAverage(scene.reviews);
//             console.log("scene.rating has been change and now is - " + scene.rating)

//             console.log("this is the length - " + scene.reviews)


//             //save changes
            
//             scene.save()
//             req.flash("success", "Your review was successfully edited.");
//             res.redirect('/scenes/' + scene._id);
//         });
//     });
// });

// router.put("/scenes/:id/reviews/edit", middleware.isLoggedIn, bodyParser.urlencoded({extended: true}), function (req, res) {

//     Review.findOneAndUpdate({"author.id": req.user.id}, {$set: {rating: parseInt(req.body.review.rating)}}, {new: true}, function (err, updatedReview) {
//         if (err) {
//             req.flash("error", err.message);
//             return res.redirect("back");
//         }
//         updatedReview.save()

//         Scene.findById(req.params.id).populate("reviews").exec(function (err, scene) {
//             if (err) {
//                 req.flash("error", err.message);
//                 return res.redirect("back");
//             }
//             scene.reviews.forEach(function(review){
//                 if(review.author.id == req.user.id){
//                     review.rating = parseInt(req.body.review.rating)
//                     scene.rating = calculateAverage(scene.reviews);
//                     scene.save()
//                 }
//             })
//             // recalculate review average
//             req.flash("success", "Thank for rating this location");
//             res.redirect('/scenes/' + scene._id);
//         });
//     });
// });

// Reviews Delete
// router.delete("/scenes/:id/reviews/:review_id", middleware.isLoggedIn, middleware.checkReviewOwnership, function (req, res) {
//     Review.findByIdAndRemove(req.params.review_id, function (err) {
//         if (err) {
//             req.flash("error", err.message);
//             return res.redirect("back");
//         }
//         Scene.findByIdAndUpdate(req.params.id, {$pull: {reviews: req.params.review_id}}, {new: true}).populate("reviews").exec(function (err, scene) {
//             if (err) {
//                 req.flash("error", err.message);
//                 return res.redirect("back");
//             }
//             // recalculate review average
//             scene.rating = calculateAverage(scene.reviews);
//             //save changes
//             scene.save();
//             req.flash("success", "Your review was deleted successfully.");
//             res.redirect("/scenes/" + req.params.id);
//         });
//     });
// });

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