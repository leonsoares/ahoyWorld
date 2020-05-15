
// semanticUI?

const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override'); // trick the GET method To a PUT (update) Method
const formidable = require('express-formidable');
// const sanitizer = require('express-sanitizer')  use sanitizer to clean code from malicius input
const mongoose = require('mongoose');
const app = express();
app.use(formidable());
// app.use(expressSanitizer()); use sanitizer to clean code from malicius input

app.use(require('sanitize').middleware);
// mongo set up

// create application/json parser
// var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
// app.use(bodyParser.urlencoded({ extended: true }))



app.use(methodOverride("_method"))

mongoose.connect("mongodb://localhost/ahoy_world", {useNewUrlParser: true, useUnifiedTopology: true});

// mongoose.connect("mongodb://localhost/ahoy_world", { useNewUrlParser: true });
// mongoose.createConnection("mongodb://localhost/ahoy_world", { useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// App Config
app.use(express.static("public"));
app.set('view engine', 'ejs');






// Mongoose / Model Config SCHEMA SETUP

const sceneSchema = new mongoose.Schema({
    
    name: String,
    location: String,
    description: { type: String, default: "what a incredible place"} ,
    image: {type: String, default:"images/default.png"}
})

const Scene = mongoose.model('Scene', sceneSchema)

// RESTFUL Routes
// Scene.create({
//     name: "Chapada Does",
//     location: "Brasilia",
//     description: 'this is a good place to go in the summer'

// }, (err, item) => {
//     if (err) {
//         console.log('something went wrong')
//     } else {
//         console.log("New Scene Successifully created")
//         console.log(item)
//     }
// });


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

// EDIT ROUTE
app.get('/scenes/:id/edit', (req, res) => {
    
    Scene.findById(req.params.id, (err, foundScene) => {
        if (err) {
            console.log(err)
        } else {
            res.render('edit', {scene:foundScene});
        }
    })
});

app.post('/scenes', (req, res) => {

    // add data from form to scenes array
    var def = "/images/default.png"
    if(req.fields.image === "") req.fields.image = def
    if(req.fields.description === "") req.fields.description = "Beautiful"
    console.log(req.fields)
    Scene.create(req.fields, (err, item) => {
        if (err) {
            console.log('something went wrong')
        } else {
            console.log("New Scene Successifully created")
            res.redirect('/scenes')
        }
    });    
}) 

// UPDATE ROUTE
app.put('/scenes/:id', (req, res) => {
    // add data from form to scenes array
    Scene.findByIdAndUpdate(req.params.id, req.fields, (err, updatedScene) =>{
        if(err){
            res.send(err)
        } else{
            // res.send('what?')
            res.redirect('/scenes/' + req.params.id)
        }
    })
    // redirect back to scenes page
})

// DELETE
app.delete('/scenes/:id', (req, res) => {
    // add data from form to scenes array
    Scene.findByIdAndDelete(req.params.id, req.fields, (err) =>{
        if(err){
            res.send(err)
        } else{
            // res.send('what?')
            res.redirect('/scenes')
        }
    })
    // redirect back to scenes page
}) 

    
app.listen(3000, () => { 
    console.log('Ahoy Wolrd '); 
    console.log('Server listening on port 3000'); 
  });






  // create a new scene with imagefrom user local storage
// app.post('/scenes', (req, res) => {
//         // npm formidable used to save image from user device
//         const formData = new formidable.IncomingForm();
//         formData.parse(req, (error, fields, files) => {
//             // get data from form
            
//             const location = fields.location
//             const name = fields.name
//             const description = fields.description
//             let extension = files.file.name.substr(files.file.name.lastIndexOf("."));
//             const newPath = 'public/images/' + fields.name + extension;
//             const image = `images/${name}${extension}`
//             const newScene = {name: name, location: location, image: image, description: description}

//             fs.rename(files.file.path, newPath, (e) => {
//                 // add data from form to scenes array
//                 Scene.create(newScene, (err, item) => {
//                     if (err) {
//                         console.log('something went wrong')
//                     } else {
//                         console.log("New Scene Successifully created")
//                         console.log(item)
//                     }
//                 });
//                 // redirect back to scenes page
//                 res.redirect('/scenes') 
//             }) 
//         });
//     })