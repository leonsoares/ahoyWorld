const express = require('express');
const router = express.Router();
const Scene   = require('../models/scenes');
const Comment = require('../models/comment');
const formidableMiddleware        = require('express-formidable');
const bodyParser        = require('body-parser');
const middleware = require('../middleware');

// ============ COMMENT ROUTES ====================

// router.get('/scenes/:id/comments/new', middleware.isLoggedIn, (req, res) => {
//     Scene.findById(req.params.id, (err, foundScene) => {
//         if(err || !foundScene){
//             req.flash('error', 'Sorry, we were not able to find this scene');
//             res.redirect('back');
//         }
//         Scene.findById(req.params.id, (err, foundScene) =>{
//             if(err){
//                 req.flash('error', 'sorry, we could not find you are looking for. :/')
//                 res.redirect('back')
//             } else{
//                 res.render('comments/new', {scene:foundScene});
//             } 
//         })
//     })
// });

router.post('/scenes/:id/comments', middleware.isLoggedIn, formidableMiddleware(), (req, res) => {
    var newComment = {
        text: req.fields[0].comment,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    }
    Comment.create(newComment, (err, comment) => {
        if(err) {
            req.flash('error', 'sorry, we could not find you are looking for. :/')
            res.redirect('back')
        } else {
            Scene.findById(req.params.id).populate('comments').exec((err, scene) =>{
                if(err || !scene){
                    req.flash('error', 'Sorry, sothing went wrong :/')
                    return res.redirect('back');
                } else{
                    scene.comments.push(comment);
                    scene.save();
                    res.send({comment, sceneId: scene._id, commentsLength: scene.comments.length, message: "Your comment was successfully added."});
                }
            })
        }
    })
});



            
// router.get('/scenes/:id/comments/:comment_id/edit', middleware.commentIsAuthorized, (req, res) => {
//     Scene.findById(req.params.id, (err, foundScene) => {
//         if(err || !foundScene){
//             res.flash('error', 'sorry, we could no find this scene!');
//             return res.redirect('back')
//         }
//         Comment.findById(req.params.comment_id, (err, foundComment) => {
//             if (err) {
//                 res.redirect('back')
//             } else {
//                 res.render('comments/edit', {scene_id: req.params.id, comment: foundComment});
//             }
//         });
//     })
// });

router.post('/scene/comment/edit/:commentId', formidableMiddleware(), (req, res) => {
    const commentId = req.fields[0].commentid
    const commentText = req.fields[0].commentText
    let message = ""
    Comment.findById(commentId).populate('author').exec((err, comment) => {
        if (err) {
            req.flash('error', 'Sorry, something went wrong.');
            res.redirect('back')
            message = "You can not do that!"
            res.send({message})
        } else {  
            let userId = toString(req.user._id) 
            let commentAuthor = toString(comment.author.id)
            if(userId === commentAuthor){
            comment.text = commentText
            comment.save()
            message = "Edited"
            res.send({message, editedComment: comment.text})
            } else {
                message = "This comment is not your to edit it"
                res.send({message})
            }
        }
    })
})

router.post('/scene/comment/delete/:commentId', middleware.isLoggedIn, formidableMiddleware(), (req, res) => {

    const commentId = req.fields[0].commentid
    const sceneId = req.fields[0].scene
    
    let message = ""

    Comment.findById(commentId).populate('author').exec((err, comment) => {
        if (err) {
            req.flash('error', 'Sorry, something went wrong.');
            res.redirect('back')
            message = "You can not do that!"
            res.send({message})
        } else {  
            let userId = toString(req.user._id) 
            let commentAuthor = toString(comment.author.id)
            if(userId === commentAuthor){
            comment.remove()
            message = "comment deleted."
            
            Scene.findById(sceneId).populate('comments').exec( (err, foundScene) =>{
                if(err || !foundScene){
                    req.flash('error', 'Sorry, sothing went wrong :/')
                    return res.redirect('back');
                } else{
                    console.log(foundScene.comments.length)
                    res.send({message, commentsLength: foundScene.comments.length})
                }
            })
            } else {
                message = "This comment is not your to delete"
                console.log(scene.comments.length)
                
            }
        }
    })

});






module.exports = router