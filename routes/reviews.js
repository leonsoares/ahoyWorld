const express = require("express");
const router = express.Router({mergeParams: true});
const Scene = require("../models/scenes");
const Review = require("../models/reviews");
const middleware = require("../middleware");
const formidableMiddleware        = require('express-formidable');
const bodyParser        = require('body-parser');

// Reviews Index
router.get("/scenes/:id/reviews", function (req, res) {
    Scene.findById(req.params.id).populate({
        path: "reviews",
        options: {sort: {createdAt: -1}} // sorting the populated reviews array to show the latest first
    }).exec(function (err, foundScene) {
        if (err || !foundScene) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        res.render("reviews/index", {scene: foundScene});
    });
});

// Reviews New
router.get("/scenes/:id/reviews/new", middleware.isLoggedIn, middleware.checkReviewExistence, function (req, res) {
    // middleware.checkReviewExistence checks if a user already reviewed the scene, only one review per user is allowed
    Scene.findById(req.params.id, function (err, scene) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        res.render("reviews/new", {scene});

    });
});

// Reviews Create
router.post("/scenes/:id/reviews", middleware.isLoggedIn, middleware.checkReviewExistence, bodyParser.urlencoded({extended: true}), function (req, res) {
    //lookup Scene using ID
    Scene.findById(req.params.id).populate("reviews").exec(function (err, scene) {
        if (err || !scene) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        Review.create(req.body.review, function (err, review) {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
            //add author username/id and associated scene to the review
            review.author.id = req.user._id;
            review.author.username = req.user.username;
            review.scene = scene;
            //save review
            review.save();
            scene.reviews.push(review);
            // calculate the new average review for the scene
            scene.rating = calculateAverage(scene.reviews);
            //save Scene
            scene.save();
            req.flash("success", "Your review has been successfully added.");
            res.redirect('/scenes/' + scene._id);
        });
    });
});
            
// Reviews Edit
router.get("/scenes/:id/reviews/:review_id/edit", middleware.isLoggedIn, middleware.checkReviewOwnership, function (req, res) {
    Review.findById(req.params.review_id, function (err, foundReview) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        res.render("reviews/edit", {scene_id: req.params.id, review: foundReview});
    });
});

// Reviews Update
router.put("/scenes/:id/reviews/:review_id", middleware.isLoggedIn, middleware.checkReviewOwnership, bodyParser.urlencoded({extended: true}), function (req, res) {
    Review.findByIdAndUpdate(req.params.review_id, req.body.review, {new: true}, function (err, updatedReview) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        Scene.findById(req.params.id).populate("reviews").exec(function (err, scene) {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
            // recalculate review average
            scene.rating = calculateAverage(scene.reviews);
            //save changes
            scene.save();
            req.flash("success", "Your review was successfully edited.");
            res.redirect('/scenes/' + scene._id);
        });
    });
});

// Reviews Delete
router.delete("/scenes/:id/reviews/:review_id", middleware.isLoggedIn, middleware.checkReviewOwnership, function (req, res) {
    Review.findByIdAndRemove(req.params.review_id, function (err) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        Scene.findByIdAndUpdate(req.params.id, {$pull: {reviews: req.params.review_id}}, {new: true}).populate("reviews").exec(function (err, scene) {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
            // recalculate review average
            scene.rating = calculateAverage(scene.reviews);
            //save changes
            scene.save();
            req.flash("success", "Your review was deleted successfully.");
            res.redirect("/scenes/" + req.params.id);
        });
    });
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