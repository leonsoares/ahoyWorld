const Scene   = require('../models/scenes');
const Comment = require('../models/comment');


const middleware = {}

middleware.sceneIsAuthorized  = function(req, res, next){
    if(req.isAuthenticated()){
        Scene.findById(req.params.id, (err, foundScene) => {
            if(err || !foundScene){
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
                req.flash('error', 'Sorry, scene not found')
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

module.exports = middleware