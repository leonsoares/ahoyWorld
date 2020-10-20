
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


mongoose
     .connect(process.env.MONGO_API_KEY, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true , useFindAndModify: false})
     .then(() => console.log( 'Database Connected' ))
     .catch(err => console.log( err ));

app.use(commentRoutes);
app.use(authRoutes);
app.use(scenesRoutes);
app.use(reviewsRoutes)

app.use((req, res) => {
    res.status(404).render("notFoundPage")
})

const port = process.env.PORT || 8000;

app.listen(port, () => { 
    console.log('Ahoy Wolrd '); 
    console.log(`Server listening on port ${port}`); 
});

// for development:
// app.listen(8000, () => { 
//     console.log('Ahoy Wolrd '); 
//     console.log('Server listening on port 8000'); 
// });