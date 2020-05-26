const express = require('express');
const router = express.Router();
const Scene   = require('../models/scenes');
const Comment = require('../models/comment');
const formidableMiddleware        = require('express-formidable');
const bodyParser        = require('body-parser');
const middleware = require('../middleware');

// ============ COMMENT ROUTES ====================

router.get('/scenes/:id/comments/new', middleware.isLoggedIn, (req, res) => {
    Scene.findById(req.params.id, (err, foundScene) =>{
        if(err){
            console.log(err)
        } else{
            res.render('comments/new', {scene:foundScene});
        } 
    })
});

router.post('/scenes/:id/comments', middleware.isLoggedIn, formidableMiddleware(), (req, res) => {
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
            
router.get('/scenes/:id/comments/:comment_id/edit', middleware.commentIsAuthorized, (req, res) => {
    
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
            res.redirect('back')
        } else {
            res.render('comments/edit', {scene_id: req.params.id, comment: foundComment});
        }
    });
});

router.put('/scenes/:id/comments/:comment_id', middleware.commentIsAuthorized, formidableMiddleware(), (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.fields, (err, foundComment) => {
        if (err) {
            console.log(err)
        } else {
    
            res.redirect('/scenes/' + req.params.id)
        }
    })
})

router.delete('/scenes/:id/comments/:comment_id', middleware.commentIsAuthorized, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err, deletedComment) => {
        if (err) {
            console.log(err)
        } else {
            res.redirect('back')
        }
    })
});


module.exports = router