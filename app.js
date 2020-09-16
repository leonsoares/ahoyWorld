
// semanticUI?

require('dotenv').config(); // tool to keep track of 


const express           = require('express');
const bodyParser        = require('body-parser');
const methodOverride    = require('method-override'); // trick the GET method To a PUT (update) Method
// const sanitizer = require('express-sanitizer')  use sanitizer to clean code from malicius input
const mongoose          = require('mongoose');
const passport          = require('passport');
const localStrategy     = require('passport-local');

// const jsdom = require("jsdom");
const flash = require('connect-flash'); // use to display msgs to user

// import routes
const commentRoutes = require('./routes/comments');
const authRoutes    = require('./routes/auth');
const scenesRoutes  = require('./routes/scenes');
const reviewsRoutes       = require('./routes/reviews');
const Scene   = require('./models/scenes');
const Comment = require('./models/comment');
const User    = require('./models/user')
const formidableMiddleware        = require('express-formidable');

const events = require('events');

const client    = require('./middleware/client')

const app = express();
// Passport Config
app.use(require("express-session")({
    secret: 'This is something',
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

// App Config
app.use(express.static("public"));
app.set('view engine', 'ejs');

// importing Models

// const User    = require('./models/user');
const seedDB  = require('./seeds')





app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use( async (req, res, next) => {
    res.locals.currentUser = req.user // this makes the if(user) available to all the routes
    if(req.user){
        try{
            let user = await User.findById(req.user._id).populate('notifications', null, {isRead: false}).exec();
            res.locals.notifications = user.notifications.reverse()
        } catch(err){
            console.log(err.message)
        }
    }
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
   
    next();
})



// seedDB();

// app.use(expressSanitizer()); use sanitizer to clean code from malicius input

app.use(require('sanitize').middleware);
// mongo set up





app.use(methodOverride("_method"))


// mongoose.connect("mongodb://localhost/ahoy_world", {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.connect(process.env.MONGO_API_KEY, {useNewUrlParser: true, useUnifiedTopology: true});

mongoose
     .connect(process.env.MONGO_API_KEY, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
     .then(() => console.log( 'Database Connected' ))
     .catch(err => console.log( err ));

// app.use(formidableMiddleware());

// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true);

// app.use(bodyParser.urlencoded({extended: true}));

app.use(commentRoutes);
app.use(authRoutes);
app.use(scenesRoutes);
app.use(reviewsRoutes)



app.listen(9000, () => { 
    console.log('Ahoy Wolrd '); 
    console.log('Server listening on port 9000'); 
});

// create application/json parser
// var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
// app.use(bodyParser.urlencoded({ extended: true }))

// let scenes = [
//     {name: 'Tunnel of Love', location:'Ukraine', image: 'images/Tunnel_of_Love.jpg'},
//     {name: 'Hitachi Seaside Park', location:'Japan', image: 'images/Hitachi_Seaside_Park.jpg'},
//     {name: 'Bamboo Forest', location:'Japan', image: 'images/Bamboo_Forest.jpg'},
//     {name: 'Tianzi Mountains', location:'China', image: 'images/Tianzi_Mountains.jpg'}
// ]

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

