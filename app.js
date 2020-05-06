
const express = require('express');
const bodyParser = require('body-parser');
const formidable = require('formidable');
const fs = require('fs')

const app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use(express.static("public"));


app.get('/', (req, res) =>{
    res.render('landing')
})

let scenes = [
    {name: 'Tunnel of Love', location:'Ukraine', image: 'images/Tunnel_of_Love.jpg'},
    {name: 'Hitachi Seaside Park', location:'Japan', image: 'images/Hitachi_Seaside_Park.jpg'},
    {name: 'Bamboo Forest', location:'Japan', image: 'images/Bamboo_Forest.jpg'},
    {name: 'Tianzi Mountains', location:'China', image: 'images/Tianzi_Mountains.jpg'}
]

// render all scenes:
app.get('/scenes', (req , res) => {
    res.render('scenes', {scenes:scenes});
});

// show form to add new camp ground
app.get('/scenes/new', (req, res) =>{
    res.render('new.ejs')
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
                scenes.push(newScene)
                // redirect back to scenes page
                res.redirect('/scenes') 
            }) 
        });
    })



    




app.listen(3000, () => { 
    console.log('Ahoy Wolrd '); 
    console.log('Server listening on port 3000'); 
  });