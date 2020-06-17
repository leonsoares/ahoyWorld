const Scene   = require('../models/scenes');
const Comment = require('../models/comment');
const Review = require('../models/reviews');


const middleware = {}

middleware.sceneIsAuthorized  = function(req, res, next){
    if(req.isAuthenticated()){
        Scene.findById(req.params.id, (err, foundScene) => {
            if(err || !foundScene){
                req.flash('error', 'Scene not found.')
                res.redirect('back')
            }else {
                if(foundScene.author.id.equals(req.user._id)){
                    next();
                } else{
                    res.redirect('back');
                }
            }
        })
    }
    else{
        res.redirect('back')
    }
}

middleware.commentIsAuthorized  = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err || !foundComment){
                req.flash('error', 'Sorry, comment not found')
                res.redirect('back')
            }else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else{
                    req.flash('error', 'Sorry, You do not have permission to do that')
                    res.redirect('back');
                }
            }
        })
    }
    else {
        req.flash('error', 'you need to be logged in to do that')
        res.redirect('back')
    }
}


middleware.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()){
        return next()
    }
    req.flash('error', 'Please, login.')
    res.redirect('/login')
}

middleware.checkReviewOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Review.findById(req.params.review_id, function(err, foundReview){
            if(err || !foundReview){
                res.redirect("back");
            }  else {
                // does user own the comment?
                if(foundReview.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middleware.checkReviewExistence = function (req, res, next) {
    if (req.isAuthenticated()) {
        Scene.findById(req.params.id).populate("reviews").exec(function (err, foundScene) {
            if (err || !foundScene) {
                req.flash("error", "Scene not found.");
                res.redirect("back");
            } else {
                // check if req.user._id exists in foundScene.reviews
                var foundUserReview = foundScene.reviews.some(function (review) {
                    return review.author.id.equals(req.user._id);
                });
                if (foundUserReview) {
                    req.flash("error", "You already wrote a review.");
                    return res.redirect("/scenes/" + foundScene._id);
                }
                // if the review was not found, go to the next middleware
                next();
            }
        });
    } else {
        req.flash("error", "You need to login first.");
        res.redirect("back");
    }
};



module.exports = middleware