const express = require('express');
const router = express.Router();
const Scene   = require('../models/scenes');
// const Comment = require('./models/comment');
// const User    = require('./models/user')
const formidableMiddleware        = require('express-formidable');
const middleware = require('../middleware');

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



// show form to add new camp ground
router.get('/scenes/new', middleware.isLoggedIn, (req, res) =>{
    res.render('scenes/new.ejs')
})

router.get('/scenes/:id', (req, res) => {
    // res.send('this is the show page');
    Scene.findById(req.params.id).populate('comments').exec((err, foundScene) => {
        if (err) {
            console.log(err)
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
    Scene.create(req.fields, (err, item) => {
        if (err) {
            console.log('something went wrong')
        } else {
            console.log("New Scene Successifully created")
            console.log(item)
            res.redirect('/scenes')
        }
    });    
}) 


// Edit ROUTE
router.put('/scenes/:id', middleware.sceneIsAuthorized, formidableMiddleware(), (req, res) => {
    // add data from form to scenes array
    Scene.findByIdAndUpdate(req.params.id, req.fields, (err, updatedScene) =>{
        if(err){
            res.send(err)
        } else{
            // res.send('what?')
            // redirect back to scenes page
            res.redirect('/scenes/' + req.params.id)
        }
    })
})

// DELETE
router.delete('/scenes/:id', middleware.sceneIsAuthorized, (req, res) => {
    // add data from form to scenes array
    Scene.findByIdAndRemove(req.params.id, (err) => {
        if(err){
            res.send(err)
        } else{
            // redirect back to scenes page
            res.redirect('/scenes');
        }
    })
});



module.exports = router