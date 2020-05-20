
// semanticUI?

const express           = require('express');
const bodyParser        = require('body-parser');
const methodOverride    = require('method-override'); // trick the GET method To a PUT (update) Method
const formidableMiddleware        = require('express-formidable');
// const sanitizer = require('express-sanitizer')  use sanitizer to clean code from malicius input
const mongoose          = require('mongoose');
const passport          = require('passport');
const localStrategy     = require('passport-local');

const app = express();
// app.use(formidable());


// App Config
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');

// importing Models
const User    = require('./models/user')
const Scene   = require('./models/scenes');
const Comment = require('./models/comment');
// const User    = require('./models/user');
const seedDB  = require('./seeds')



// Passport Config
app.use(require("express-session")({
    secret: 'This is something',
    resave: false,
    saveUninitialized: false

}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use( (req, res, next) => {
    res.locals.currentUser = req.user // this makes the if(user) available to all the routes
    next();
})



// seedDB();

// app.use(expressSanitizer()); use sanitizer to clean code from malicius input

app.use(require('sanitize').middleware);
// mongo set up

// create application/json parser
// var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
// app.use(bodyParser.urlencoded({ extended: true }))



app.use(methodOverride("_method"))

mongoose.connect("mongodb://localhost/ahoy_world", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));

// mongoose.connect("mongodb://localhost/ahoy_world", { useNewUrlParser: true });
// mongoose.createConnection("mongodb://localhost/ahoy_world", { useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);



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
            res.render('scenes/index', {scenes:allScenes});
        }
    })
});



// show form to add new camp ground
app.get('/scenes/new', isLoggedIn, (req, res) =>{
    res.render('scenes/new.ejs')
})

app.get('/scenes/:id', (req, res) => {
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
app.get('/scenes/:id/edit', isLoggedIn, (req, res) => {
    
    Scene.findById(req.params.id, (err, foundScene) => {
        if (err) {
            console.log(err)
        } else {
            res.render('scenes/edit', {scene:foundScene});
        }
    })
});



app.post('/scenes', isLoggedIn, formidableMiddleware(), (req, res) => {

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
app.put('/scenes/:id', isLoggedIn, formidableMiddleware(), (req, res) => {
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
app.delete('/scenes/:id', isLoggedIn, (req, res) => {
    // add data from form to scenes array
    Scene.findByIdAndRemove(req.params.id, (err) =>{
        if(err){
            res.send(err)
        } else{
            // redirect back to scenes page
            res.redirect('/scenes');
        }
    })
}) 

// ============ COMMENT ROUTES ====================

app.get('/scenes/:id/comments/new', isLoggedIn, (req, res) => {
    Scene.findById(req.params.id, (err, foundScene) =>{
        if(err){
            console.log(err)
        } else{
            res.render('comments/new', {scene:foundScene});
        } 
    })
});

app.post('/scenes/:id/comments', isLoggedIn, (req, res) => {
    var newComment = req.fields
    Scene.findById(req.params.id, (err, scene) =>{
        if(err){
            console.log(err)
        } else{
            Comment.create(newComment, (err, comment) => {
                if(err) {
                    console.log(err)
                } else {
                    scene.comments.push(comment);
                    scene.save();
                    res.redirect('/scenes/' + req.params.id);
                }
            })
        }
    })
});

// Show Register form
app.get('/register', (req, res) => {
    res.render('register')
});

// sign up logic
// app.post("/register", function(req, res){
//     var newUser = new User({username: req.fields.username});
//     var passw = req.fields.password
//     User.register(newUser, passw, function(err, user){
//         if(err){
//             console.log(err);
//             return res.render("register");
//         }else{
//             passport.authenticate("local")(req, res, function(){
//                 res.redirect("/scenes"); 
//              });
//         }
//     });
// });

app.post("/register", function (req, res, next) {
    var newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            return res.send(err);
        }

        // go to the next middleware
        next();

    });
}, passport.authenticate('local', { 
    successRedirect: '/scenes',
    failureRedirect: '/' 
}));


// Log in route
app.get('/login', (req, res) => {
    res.render('login')
})

// app.post('/login', (req, res) => {
//     var test = req.fields.username
//     res.send(test)
// })

app.post('/login', passport.authenticate('local', 
    {
        successRedirect: '/scenes', 
        failureRedirect: '/login'}), 
        
        (req, res) => {
})

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/scenes')
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

app.listen(3000, () => { 
    console.log('Ahoy Wolrd '); 
    console.log('Server listening on port 3000'); 
});



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