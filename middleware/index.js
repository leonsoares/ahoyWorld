const Scene   = require('../models/scenes');
const Comment = require('../models/comment');


const middleware = {}

middleware.sceneIsAuthorized  = function(req, res, next){
    if(req.isAuthenticated()){
        Scene.findById(req.params.id, (err, foundScene) => {
            if(err){
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
            if(err){
                res.redirect('back')
            }else {
                if(foundComment.author.id.equals(req.user._id)){
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


middleware.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()){
        return next()
    }
    req.flash('error', 'Please, login.')
    res.redirect('/login')
}

module.exports = middleware