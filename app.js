
const express = require('express');
const bodyParser = require('body-parser');
const formidable = require('formidable');
const fs = require('fs');
const mongoose = require('mongoose');

const app = express();

mongoose.connect("mongodb://localhost/ahoy_world");
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use(express.static("public"));



// SCHEMA SETUP

const sceneSchema = new mongoose.Schema({
    name: "",
    location: "string",
    image: "string",
    description: 'string'
})

const Scene = mongoose.model('Scene', sceneSchema)

Scene.create({
    name: "Chapada Does",
    location: "Brasilia",
    description: 'this is a good place to go in the summer'

}, (err, item) => {
    if (err) {
        console.log('something went wrong')
    } else {
        console.log("New Scene Successifully created")
        console.log(item)
    }
});


app.get('/', (req, res) =>{
    res.render('landing')
})

// let scenes = [
//     {name: 'Tunnel of Love', location:'Ukraine', image: 'images/Tunnel_of_Love.jpg'},
//     {name: 'Hitachi Seaside Park', location:'Japan', image: 'images/Hitachi_Seaside_Park.jpg'},
//     {name: 'Bamboo Forest', location:'Japan', image: 'images/Bamboo_Forest.jpg'},
//     {name: 'Tianzi Mountains', location:'China', image: 'images/Tianzi_Mountains.jpg'}
// ]

// render all scenes:
app.get('/scenes', (req , res) => {
    Scene.find({}, (err, allScenes) => {
        if (err) {
            console.log('err')
        } else {
            res.render('index', {scenes:allScenes});
        }
    })
});



// show form to add new camp ground
app.get('/scenes/new', (req, res) =>{
    res.render('new.ejs')
})

app.get('/scenes/:id', (req, res) => {
    // res.send('this is the show page');
    Scene.findById(req.params.id, (err, foundScene) => {
        if (err) {
            console.log(err)
        } else {
            // render show template with that scene
            res.render('show', {scene:foundScene})
        }
    })
})



// create a new scene
app.post('/scenes', (req, res) => {
        // npm formidable used to save image from user device
        const formData = new formidable.IncomingForm();
        formData.parse(req, (error, fields, files) => {
            // get data from form
            
            const location = fields.location
            const name = fields.name
            let extension = files.file.name.substr(files.file.name.lastIndexOf("."));
            const newPath = 'public/images/' + fields.name + extension;
            const image = `images/${name}${extension}`
            const newScene = {name: name, location: location, image: image}

            fs.rename(files.file.path, newPath, (e) => {
                // add data from form to scenes array
                Scene.create(newScene, (err, item) => {
                    if (err) {
                        console.log('something went wrong')
                    } else {
                        console.log("New Scene Successifully created")
                        console.log(item)
                    }
                });
                // redirect back to scenes page
                res.redirect('/index') 
            }) 
        });
    })


app.listen(3000, () => { 
    console.log('Ahoy Wolrd '); 
    console.log('Server listening on port 3000'); 
  });