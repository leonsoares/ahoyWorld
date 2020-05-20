const express = require('express');
const router = express.Router();
const Scene   = require('../models/scenes');
const Comment = require('../models/comment');
const User    = require('../models/user')
const formidableMiddleware        = require('express-formidable');


// ============ COMMENT ROUTES ====================

router.get('/scenes/:id/comments/new', isLoggedIn, (req, res) => {
    Scene.findById(req.params.id, (err, foundScene) =>{
        if(err){
            console.log(err)
        } else{
            res.render('comments/new', {scene:foundScene});
        } 
    })
});

router.post('/scenes/:id/comments', isLoggedIn, formidableMiddleware(), (req, res) => {
    var newComment = req.fields
    Scene.findById(req.params.id, (err, scene) =>{
        if(err){
            console.log(err)
        } else{
            Comment.create(newComment, (err, comment) => {
                if(err) {
                    console.log(err)
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    scene.comments.push(comment);
                    scene.save();
                    res.redirect('/scenes/' + req.params.id);
                }
            })
        }
    })
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

module.exports = router