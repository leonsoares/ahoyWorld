const express = require('express');
const router = express.Router();
const Scene   = require('../models/scenes');
const Notification = require('../models/notification');
const User = require('../models/user');
const Review = require('../models/reviews');
// eval(require('locus')); DEBUGGIN PACKAGE
const formidableMiddleware        = require('express-formidable');
const middleware = require('../middleware');
var cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET
  });
// const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
// node-geocoder config

var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: "AIzaSyDIuLB4OpdqS823hdshWhlHZ04NSlySvvs",
  formatter: null
};
 
var geocoder = NodeGeocoder(options);


router.get('/welcome', (req, res) => {
    res.render('welcome');
})


// scenes Routes 
router.get('/', (req, res) =>{   
    Scene.find().where('author.id').equals("5f1b2ff044aa684d415946ea").exec(function(err, scenes){
    
        if (err || !scenes) {
            req.flash('error', 'sorry, we could not find you are looking for. :/')
            res.redirect('back')
        }
        Scene.find().where('isPopular').equals(true).exec(function(err, isPopular){
            if (err || !isPopular) {
            req.flash('error', 'sorry, we could not find you are looking for. :/')
            res.redirect('back')
            }
            User.find().where('highRank').equals(true).exec(function(err, highRank){
                if (err || !highRank) {
                req.flash('error', 'sorry, we could not find you are looking for. :/')
                res.redirect('back')
            }
            Scene.find((err, foundScene) => {
                if (err) {
                    req.flash('error', 'sorry, we could not find you are looking for. :/')
                    res.redirect('back')
                } else {
                    let features = [];
                    let location = {}
                    foundScene.forEach(scene => {
                        location.properties = {
                            title : scene.name,
                            type : scene.sceneType,
                            id : scene._id
                        }
                        location.geometry = {
                                type: "Point",
                                coordinates: [scene.lng, scene.lat]
                            }
                            
                            features.push(location)
                            location = {}
                            
                    });
                    
                    res.render('landing', {featuredScenes: scenes, isPopular, highRank , scenes:features});

                }
            })
            });
        });
    });
});


// scenes Routes 
router.get('/map', (req, res) =>{   
    Scene.find((err, foundScene) => {
        if (err) {
            req.flash('error', 'sorry, we could not find you are looking for. :/')
            res.redirect('back')
        } else {
            let features = [];
            let location = {}
            foundScene.forEach(scene => {
                location.type = scene.sceneType
                location._id = scene._id
                location.geometry = {
                        type: "Point",
                        coordinates: [scene.lng, scene.lat]
                    }
                    
                    features.push(location)
                    location = {}
                    
            });
            
            res.render('map', {scenes:features});
        }
    })
});


// render all scenes:
router.get('/scenes', (req , res) => {
    // eval(require('locus'));
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Scene.find({name: regex}).skip((perPage * pageNumber) - perPage).limit(perPage).exec((err, allScenes) => {
            Scene.countDocuments({name: regex}).exec(function (err, count) {
            if (err) {
                req.flash('error', 'sorry, we could not find you are looking for. :/')
                res.redirect('back')
            } else if(allScenes.length === 0) {
                Scene.find({location: regex}).skip((perPage * pageNumber) - perPage).limit(perPage).exec((err, allScenes) => {
                    Scene.countDocuments({location: regex}).exec(function (err, count) {
                    if (err) {
                        req.flash('error', 'sorry, we could not find you are looking for. :/')
                        res.redirect('back')
                    } else {
                        if(allScenes.length === 0){
                        noMatch = `Sorry, we could not find any matches for: ${req.query.search}`
                        res.render('scenes/index', {
                            scenes:allScenes,
                            resultsFor: "All Locations",
                            noMatch: noMatch,
                            current: pageNumber,
                            pages: Math.ceil(count / perPage)
                            });
                        } else {

                        res.render('scenes/index', {scenes:allScenes, resultsFor: "All Locations", current: pageNumber, pages: Math.ceil(count / perPage)});
                        }
                    }
                })
             })
            }
            else {
                res.render('scenes/index', {scenes:allScenes, resultsFor: "All Locations", current: pageNumber, pages: Math.ceil(count / perPage)});
            }
            })
        })
    } else {
            Scene.find().skip((perPage * pageNumber) - perPage).limit(perPage).exec((err, allScenes) => {
                Scene.countDocuments().exec(function (err, count) {
                if (err) {
                    req.flash('error', 'sorry, we could not find you are looking for. :/')
                    res.redirect('back')
                } else {
                    res.render('scenes/index', {
                        scenes:allScenes,
                        resultsFor: "All Locations",
                        current: pageNumber,
                        pages: Math.ceil(count / perPage)
                    });
                
                }
            })
        })
    }
});

router.get('/scenes/tag/:tag', formidableMiddleware(), (req , res) => {
    // eval(require('locus'));
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    
    if(req.params.tag){
        const regex = new RegExp(escapeRegex(req.params.tag), 'gi');
        Scene.find({sceneType: regex}).skip((perPage * pageNumber) - perPage).limit(perPage).exec((err, allScenes) => {
            Scene.countDocuments({sceneType: regex}).exec(function (err, count) {
            if (err) {
                req.flash('error', 'sorry, we could not find you are looking for. :/')
                res.redirect('back')
            } else if(allScenes.length === 0) {
                Scene.find({location: regex}).skip((perPage * pageNumber) - perPage).limit(perPage).exec((err, allScenes) => {
                    Scene.countDocuments({location: regex}).exec(function (err, count) {
                    if (err) {
                        req.flash('error', 'sorry, we could not find you are looking for. :/')
                        res.redirect('back')
                    } else {
                        if(allScenes.length === 0){
                        noMatch = `Sorry, we could not find any matches for: ${req.query.search}`
                        res.render('scenes/index', {
                            scenes:allScenes,
                            resultsFor: req.params.tag,
                            noMatch: noMatch,
                            current: pageNumber,
                            pages: Math.ceil(count / perPage)
                            });
                        } else {

                        res.render('scenes/index', {scenes:allScenes, resultsFor: req.params.tag, current: pageNumber, pages: Math.ceil(count / perPage)});
                        }
                    }
                })
             })
            }
            else {
                res.render('scenes/index', {scenes:allScenes, resultsFor: req.params.tag, current: pageNumber, pages: Math.ceil(count / perPage)});
            }
            })
        })
    } else {
            Scene.find().skip((perPage * pageNumber) - perPage).limit(perPage).exec((err, allScenes) => {
                Scene.countDocuments().exec(function (err, count) {
                if (err) {
                    req.flash('error', 'sorry, we could not find you are looking for. :/')
                    res.redirect('back')
                } else {
                    res.render('scenes/index', {
                        scenes:allScenes,
                        current: pageNumber,
                        resultsFor: "Nothing Found",
                        pages: Math.ceil(count / perPage)
                    });
                
                }
            })
        })
    }
});



// show form to add new scene ground
// router.get('/scenes/new', middleware.isLoggedIn, (req, res) =>{
//     res.render('scenes/new.ejs')
// })

router.get('/scenes/:id', (req, res) => {
    Scene.findById(req.params.id).populate({
            
            path:'flag comments likes reviews',
            options: {sort: {createAt: -1}
        }
    }).exec((err, foundScene) => {
        if (err || !foundScene) {
            req.flash('error', 'Scene not found')
            res.redirect('back')
        } else {
            var hasReviewd = false
            if(req.user){
                foundScene.reviews.forEach(element => {
                    if(req.user.id == element.author.id){
                        hasReviewd = true
                    }
                });
            }
            // render show template with that 
            let created = foundScene._id.getTimestamp().toDateString().split(' ', 4).join(' ')
            res.render('scenes/show', {scene:foundScene, created, hasReviewd} )
        }
    })
})

// EDIT ROUTE
router.get('/scenes/:id/edit', middleware.sceneIsAuthorized, (req, res) => {
    Scene.findById(req.params.id, (err, foundScene) => {
        if (err) {
            req.flash('error', 'sorry, we could not find you are looking for. :/')
            res.redirect('back')
        } else {
            res.render('scenes/edit', {scene:foundScene});
        }
    })
});

// creates new scene from front end

router.post('/scenes/newScene',  formidableMiddleware(), async(req, res) => {
    let imgs = req.files

    let imgsPath = []
    for (const property in imgs) {
        imgsPath.push(imgs[property].path)
    }

    let multipleUpload = new Promise(async (resolve, reject) => {
        let upload_len = imgsPath.length
            ,upload_res = new Array();
  
          for(let i = 0; i <= upload_len + 1; i++)
          {
              await cloudinary.uploader.upload(imgsPath[i], (error, result) => {
  
                  if(upload_res.length === upload_len)
                  {
                    /* resolve promise after upload is complete */
                    resolve(upload_res)
                  }else if(result)
                  {
                    upload_res.push(result.url);
                  } else if(error) {
                    console.log(error)
                    reject(error)
                  }
  
              })
  
          } 
      })
      .then((result) => result)
      .catch((error) => error)
  
      let upload = await multipleUpload;
      if(req.fields.image1) upload.push(req.fields.image1)
      if(req.fields.image2) upload.push(req.fields.image2)
      if(req.fields.image3) upload.push(req.fields.image3)
      
      let newLocation = {
          images: {
              img1: upload[0] || undefined,
              img2: upload[1] || undefined,
              img3: upload[2] || undefined
          },
          location: {
              country: req.fields.country,
              state: req.fields.state
          },
          author:{
            id: req.user._id,
            username: req.user.username
        }
      }

      newLocation.name = req.fields.name,
      newLocation.knownAs = req.fields.knownAs,
      newLocation.sceneType = req.fields.sceneType,
      newLocation.description = req.fields.description

      


        let geoData = new Promise(async (resolve, reject) => {
            let place = ""
            if(req.fields.knownAs !== ""){
                place = req.fields.knownAs  + ", " + req.fields.country + ", " + req.fields.state
                } else {
                    place = req.fields.country + ", " + req.fields.state
                } 
              {
                await geocoder.geocode(place, (err, data) => {
                if (err || !data.length) {
                    reject(err)
                }
                if(data){
                    resolve(data)
                }
                    
                })
              } 
          })
          .then((result) => result)
          .catch((error) => error)
          let geoLocation = await geoData;

          newLocation.lat = geoLocation[0].latitude
          newLocation.lng = geoLocation[0].longitude
          console.log(geoLocation)
        
    

        console.log(newLocation)

        Scene.create(newLocation, (err, foundScene) => {
            if (err) {
                req.flash('error', 'Something went wrong');
                res.redirect('back')
            } else {
                User.findById(req.user._id).populate('followers').exec((err, foundUser) => {
                    if(err){
                        req.flash('error', 'Something went wrong');
                        req.flash('error', err.message)
                    }
                    let newNotification = {
                        username: req.user.username,
                        sceneId: foundScene._id,
                        message: "Created a new scene",
                        goTo: `/scenes/${foundScene._id}`
                    }
                    if(foundUser.followers.length > 0){
                        for(const follower of foundUser.followers){
                            Notification.create(newNotification, (err, createdNotif) => {
                                if(err){
                                req.flash("error", err.message)
                                }
                                follower.notifications.push(createdNotif);
                                follower.save();

                            });
                    }
                    
                    }
                })
            }
            req.flash('success', 'New Location created, Thank you for contributing with our community');
            res.redirect(`/scenes/${foundScene.id}`)
        });
});






// // Create New Scene
// router.post('/scenes', middleware.isLoggedIn, formidableMiddleware(), (req, res) => {

//     // add data from form to scenes array
//     req.fields.author = {
//         id: req.user._id,
//         username: req.user.username
//     }
   
//     var def = "/images/default.png"
//     if(req.fields.image === "") req.fields.image = def
//     if(req.fields.description === "") req.fields.description = "Beautiful"


//     var place = ""
//     if(req.fields.knownAs !== ""){
//         place = req.fields.knownAs  + ", " + req.fields.country + ", " + req.fields.state
//     } else {
//         place = req.fields.country + ", " + req.fields.state
//     }    

    
    
//     geocoder.geocode(place, (err, data) => {
//         if (err || !data.length) {
//           req.flash('error', 'Invalid address');
//           return res.redirect('back');
//         }
//         // req.fields.location.country = data[0].formattedAddress;
     
//         var newScene = {
//             name: req.fields.name,
//             knownAs: req.fields.knownAs,
//             sceneType: req.fields.sceneType,
//             location:{
//                 country: req.fields.country,
//                 state: req.fields.state,
//             },
//             lat: data[0].latitude,
//             lng: data[0].longitude,
//             description: req.fields.description,
//             image: req.fields.image,
//             author:{
//                 id: req.user._id,
//                 username: req.user.username
//             },
//         }



//         // Create a new scene and save to DB
//         Scene.create(newScene, (err, foundScene) => {
//             if (err) {
//                 req.flash('error', 'Something went wrong');
//                 res.redirect('back')
//             } else {
//                 User.findById(req.user._id).populate('followers').exec((err, foundUser) => {
//                     if(err){
//                         req.flash('error', 'Something went wrong');
//                         req.flash('error', err.message)
//                     }
//                     let newNotification = {
//                         username: req.user.username,
//                         sceneId: foundScene._id,
//                         message: "Created a new scene",
//                         goTo: `/scenes/${foundScene._id}`
//                     }
//                     if(foundUser.followers.length > 0){
//                         for(const follower of foundUser.followers){
//                             Notification.create(newNotification, (err, createdNotif) => {
//                                 if(err){
//                                 req.flash("error", err.message)
//                                 }
//                                 follower.notifications.push(createdNotif);
//                                 follower.save();

//                             });
//                     }
                    
//                     }
//                     req.flash('success', 'New Location created, Thank you for contributing with our community');
//                     res.redirect(`/scenes/${foundScene.id}`)
//                 })
//             }
//         }); 
//     });
// });


// Edit ROUTE
router.put('/scenes/:id', middleware.sceneIsAuthorized, formidableMiddleware(), (req, res) => {
    
    
    var place = ""
    if(req.fields.knownAs !== ""){
        place = req.fields.knownAs  + ", " + req.fields.country + ", " + req.fields.state
    } else {
        place = req.fields.country + ", " + req.fields.state
    }    
    
    geocoder.geocode(place, (err, data) => {
        if (err || !data.length) {
          req.flash('error', 'Invalid address');
          return res.redirect('back');
        }
        // req.fields.location.country = data[0].formattedAddress;
     
        var editScene = {
            name: req.fields.name,
            knownAs: req.fields.knownAs,
            sceneType: req.fields.sceneType,
            location:{
                country: req.fields.country,
                state: req.fields.state,
            },
            lat: data[0].latitude,
            lng: data[0].longitude,
            description: req.fields.description,
            image: req.fields.image,
            author:{
                id: req.user._id,
                username: req.user.username
            },
        }
    
    // add data from form to scenes array
        Scene.findByIdAndUpdate(req.params.id, editScene, (err, foundScene) =>{
            if(err){
                req.flash('error', 'Sorry, Somthing went wrong.');
                res.redirect(`/scenes/${foundScene.id}`)
            } else{
                req.flash('success', 'New changes saved!');
                res.redirect(`/scenes/${foundScene.id}`)
            }
        });
    });
});

// DELETE
router.delete('/scenes/:id', middleware.sceneIsAuthorized, (req, res) => {
    // add data from form to scenes array
    Scene.findById(req.params.id).populate('followers').populate('review').exec((err, scene) => {
        if (err) {
            res.redirect("/scenes");
        } else {
            // deletes all comments associated with the scene
            
                // deletes all reviews associated with the scene
                Review.deleteMany({"_id": {$in: scene.reviews}}, function (err) {
                    if (err) {
                        req.flash('error', 'sorry, we could not find you are looking for. :/')
                        return res.redirect("/scenes");
                    }
                    //  delete the Scene
                    scene.remove();
                    req.flash("success", "Location deleted successfully!");
                    res.redirect("back");
                });
            
        }
    });
});

router.post('/scenes/:id/delete/user', middleware.sceneIsAuthorized, (req, res) => {

    Scene.findById(req.params.id).populate('review').exec((err, scene) => {
        if (err) {
            res.redirect("/scenes");
        } else {
            Review.deleteMany({"_id": {$in: scene.reviews}}, function (err) {
                if (err) {
                    req.flash('error', 'sorry, we could not find you are looking for. :/')
                    return res.redirect("/scenes");
                }
                //  delete the Scene
                scene.remove();
                res.send({data: scene._id, message: "Location deleted"})
            });
        }
    });
});




// FLAG / Place Visited

router.post('/scenes/:id/flag', middleware.isLoggedIn, (req, res) => {
    Scene.findById(req.params.id).populate('flag').exec((err, foundScene) => {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        let foundUserFlag = foundScene.flag.some(function (flag) {
            return flag.equals(req.user._id);
        });
        let msg = ""
        let succesError = ""
        let userFlag = false

        if (foundUserFlag) {
            // user already liked, removing like
            foundScene.flag.pull(req.user._id);
            msg = "Location removed from your "
            succesError = "error"
        } else {
            // adding the new user like
            foundScene.flag.push(req.user);
            msg = "Location add to your "
            succesError = "success"
            userFlag = true
        }

            foundScene.save(function (err) {
            if (err) {
                req.flash('error', 'sorry, we could not find you are looking for. :/')
                return res.redirect("/scenes");
            }
            return res.send({scene:foundScene, message: msg, userFlag, user: req.user});
        });

    });
});

             
router.get('/scenes/:id/flag/users', (req, res) => {
    
    Scene.findById(req.params.id).populate('flag').exec((err, foundScene) => {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        console.log(foundScene)
        return res.send({scene:foundScene.flag});

    });
});




router.post('/scenes/:id/saveScene', middleware.isLoggedIn, (req, res) => {
    Scene.findById(req.params.id, (err, foundScene) => {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        let foundUserSave = foundScene.saveScene.some(function (save) {
            return save.equals(req.user._id);
        });
        let msg = ""
        let toggle = ""
        if (foundUserSave) {
            // user already liked, removing like
            foundScene.saveScene.pull(req.user._id);
            msg = "Location removed from your " 
            
        } else {
            // adding the new user like
            foundScene.saveScene.push(req.user);
            msg = "Location add to your " 
            
        }
            foundScene.save(function (err) {
            if (err) {
                req.flash('error', 'sorry, we could not find you are looking for. :/')
                return res.redirect("/scenes");
            }
            return res.send({data:"done", message: msg});
        });
    });
});



function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router