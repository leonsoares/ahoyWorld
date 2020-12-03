const express = require('express');
const router = express.Router();
const Scene   = require('../models/scenes');
const Notification = require('../models/notification');
const User = require('../models/user');
const Review = require('../models/reviews');
const Comment = require('../models/comment')
// eval(require('locus')); DEBUGGIN PACKAGE
const formidableMiddleware        = require('express-formidable');
const middleware = require('../middleware');
var cloudinary = require('cloudinary').v2;
const bodyParser        = require('body-parser');
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET
  });


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
router.get('/scenes',  (req , res) => {
    // eval(require('locus'));
 
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;

    Scene.find().skip((perPage * pageNumber) - perPage).limit(perPage).exec((err, allScenes) => {
        Scene.countDocuments().exec(function (err, count) {
        if (err) {
            req.flash('error', 'sorry, we could not find you are looking for. :/')
            res.redirect('back')
        } else {
            if(allScenes.length === 0){
                noMatch = `Sorry, we could not find any matches for: ${req.fields.search}`
                res.render('scenes/index', {
                    scenes:allScenes,
                    resultsFor: "All Locations",
                    noMatch: noMatch,
                    current: pageNumber,
                    pages: Math.ceil(count / perPage)
                });
            } else {
                res.render('scenes/index', {
                    scenes:allScenes, 
                    resultsFor: "All Locations", 
                    current: pageNumber, 
                    pages: Math.ceil(count / perPage)
                    });
                }
            }
        })
    })
});

// FIND SCENES BASED ON SEARCH
router.post('/scenes/query/search', formidableMiddleware(), async(req , res) => {
    let checkContent = req.fields.search.trim()
    if(checkContent.length === 0 ){
        res.redirect('/scenes')
    } else {
    

    const regex = new RegExp(escapeRegex(req.fields.search), 'gi');
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;

    var findByScneType = () => {
        return new Promise((resolve, reject) => {
            Scene.find( { sceneType: { $regex: regex } } ).exec((err, allScenes) => {
                if(err || !allScenes) reject(err)
                if(allScenes) resolve(allScenes) 
            })
     })
    }

    var findByScneCountry = () => {
        return new Promise((resolve, reject) => {
            Scene.find( { "location.country": { $regex: regex } } ).exec((err, allScenes) => {
                if(err || !allScenes) reject(err)
                if(allScenes) resolve(allScenes) 
            })
     })
    }

    var findByScnestate = () => {
        return new Promise((resolve, reject) => {
            Scene.find( { "location.state": { $regex: regex } } ).exec((err, allScenes) => {
                if(err || !allScenes) reject(err)
                if(allScenes) resolve(allScenes) 
            })
     })
    }


     var scenesByType    = await findByScneType();
     var scenesBycountry = await findByScneCountry();
     var scenesByState   = await findByScnestate();

     let allScenes = []

     scenesByType.forEach(scene => {
         allScenes.push(scene)
     })

     scenesBycountry.forEach(scene => {
        allScenes.push(scene)
    })

    scenesByState.forEach(scene => {
        allScenes.push(scene)
    })



    for(let i = 0; i < allScenes.length - 1; i++){        
        for(let j = i+1; j < allScenes.length; j++){
            if(allScenes[j]._id.toString() == allScenes[i]._id.toString()){
                allScenes.splice(j, 1)
            }
        }
    }

    res.render('scenes/index', {
        scenes:allScenes,
        resultsFor: req.fields.search,
        current: pageNumber,
        pages: Math.ceil(allScenes.length / perPage)
    });
}
});


router.post('/scenes/searchbytag', formidableMiddleware(), async(req , res) => {
    let checkContent = req.fields.tagSearch
    if(checkContent.length === 0 ){
        res.redirect('/scenes')
    } else {
    

    const regex = new RegExp(escapeRegex(checkContent), 'gi');
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;

    var findByScneType = () => {
        return new Promise((resolve, reject) => {
            Scene.find( { sceneType: { $regex: regex } } ).exec((err, allScenes) => {
                if(err || !allScenes) reject(err)
                if(allScenes) resolve(allScenes) 
            })
     })
    }

    var findByScneCountry = () => {
        return new Promise((resolve, reject) => {
            Scene.find( { "location.country": { $regex: regex } } ).exec((err, allScenes) => {
                if(err || !allScenes) reject(err)
                if(allScenes) resolve(allScenes) 
            })
     })
    }

    var findByScnestate = () => {
        return new Promise((resolve, reject) => {
            Scene.find( { "location.state": { $regex: regex } } ).exec((err, allScenes) => {
                if(err || !allScenes) reject(err)
                if(allScenes) resolve(allScenes) 
            })
     })
    }


     var scenesByType    = await findByScneType();
     var scenesBycountry = await findByScneCountry();
     var scenesByState   = await findByScnestate();

     let allScenes = []

     scenesByType.forEach(scene => {
         allScenes.push(scene)
     })

     scenesBycountry.forEach(scene => {
        allScenes.push(scene)
    })

    scenesByState.forEach(scene => {
        allScenes.push(scene)
    })



    for(let i = 0; i < allScenes.length - 1; i++){        
        for(let j = i+1; j < allScenes.length; j++){
            if(allScenes[j]._id.toString() == allScenes[i]._id.toString()){
                allScenes.splice(j, 1)
            }
        }
    }

    res.send({
        user: req.user,
        scenes: allScenes,
        resultsFor: checkContent,
        current: pageNumber,
        pages: Math.ceil(allScenes.length / perPage)
    });
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
router.get('/scene/:id/edit', middleware.sceneIsAuthorized, (req, res) => {

    Scene.findById(req.params.id, (err, foundScene) => {
        if (err) {
            req.flash('error', 'sorry, we could not find you are looking for. :/')
            res.redirect('back')
        } else {
            res.send({scene:foundScene});
        }
    })
});

router.post('/scene/editScene/:id/edit',  formidableMiddleware(), async(req, res) => {
    let editScene = new Promise(async (resolve, reject) => {
        Scene.findById(req.params.id, (err, foundScene) => {
            if (err || !foundScene) {
                reject(err)
                return err
            } else {
                resolve(foundScene)
            }
        })
    })
    .then((result) => result)
    .catch((error) => error)
                  
    let foundScene = await editScene.then((result) => result)
    .catch((error) => error)

        let changeAddress = false

        if(req.fields.name !== foundScene.name) foundScene.name = req.fields.name
        if(req.fields.sceneType !== foundScene.sceneType) foundScene.sceneType = req.fields.sceneType
        if(req.fields.knownAs !== foundScene.knownAs) {
            foundScene.knownAs = req.fields.knownAs
            changeAddress = true
        }
        if(req.fields.description !== foundScene.description) foundScene.description = req.fields.description
        if(req.fields.country !== foundScene.location.country) {
            foundScene.location.country = req.fields.country
            changeAddress = true
        }
        if(req.fields.state !== foundScene.location.state) {
            foundScene.location.state = req.fields.state
            changeAddress = true
        }

        if(changeAddress === true){
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
            let geoLocation = await geoData.then(response => response).catch(error => error)
            foundScene.lat = geoLocation[0].latitude
            foundScene.lng = geoLocation[0].longitude
    
        }
        
    let hasImg = [false, false, false]
  
      
      if(req.fields.image1){
          foundScene.images.img1 = req.fields.image1
          hasImg[0] = true
      }
      if(req.fields.image2){
          foundScene.images.img2 = req.fields.image2
          hasImg[1] = true
      }
      if(req.fields.image3) {
          foundScene.images.img3 = req.fields.image3
          hasImg[2] = true
      }

    let imgs = req.files

    if(imgs !== {} && req.fields.hasNewFiles){
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
                    reject(error)
                  }
  
              })
  
          } 
      })
      .then((result) => result)
      .catch((error) => error)
  
      let upload = await multipleUpload;


        var hasNewImages = req.fields.hasNewFiles.split(',')

         
        let count = 0
        for(let i = 0; i < upload.length; i++){
            for(let j = count; j < hasNewImages.length; j++){
                if(hasNewImages[j] === "true" && hasImg[j] === false && j == 0) {
                    foundScene.images.img1 = upload[i]
                    count =+1
                    break
                }if(hasNewImages[j] === "true" && hasImg[j] === false && j == 1) {
                    foundScene.images.img2 = upload[i]
                    count =+2
                    break
                }if(hasNewImages[j] === "true" && hasImg[j] === false && j == 2) {
                    foundScene.images.img3 = upload[i]
                    break
                }
            }
        }
    }


    Scene.findById(req.params.id, (err, changeInfoScene) => {
        if (err || !foundScene) {
            return err
        } else {
            changeInfoScene.name = foundScene.name,
            changeInfoScene.knownAs = foundScene.knownAs,
            changeInfoScene.sceneType = foundScene.sceneType,
            changeInfoScene.description = foundScene.description

            changeInfoScene.images.img1 = foundScene.images.img1
            changeInfoScene.images.img2 = foundScene.images.img2
            changeInfoScene.images.img3 = foundScene.images.img3
            
            changeInfoScene.location.country = foundScene.location.country
            changeInfoScene.location.state = foundScene.location.state
            changeInfoScene.lat = foundScene.lat
            changeInfoScene.lng = foundScene.lng
            changeInfoScene.save()
            res.send(changeInfoScene)
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
router.post('/scene/deleteScene/:id/delete', async (req, res) => {
    // add data from form to scenes array
    Scene.findById(req.params.id).populate('followers').populate('review').populate('comments').exec((err, scene) => {
        if (err) {
            res.redirect("/scenes");
        } else {

            let imgsPath = []
            let finalPath = []
            imgsPath.push(scene.images.img1)
            if(scene.images.img2 !== undefined) imgsPath.push(scene.images.img2)
            if(scene.images.img3 !== undefined) imgsPath.push(scene.images.img3)

            if(imgsPath.length > 0){
                imgsPath.forEach(path => {
                    let newPath = path.split('/')
                    for(let i = 0; i < newPath.length; i++){
                        if(newPath[i] === "res.cloudinary.com"){
                            let publicId = newPath[newPath.length - 1].split('.')
                            finalPath.push(publicId[0])
                        }
                    }
                    
                })
            }
            

            if(finalPath.length > 0) {
            let deleteImgs = new Promise(async (resolve, reject) => {
                let upload_len = finalPath.length
                    ,upload_res = new Array();
          
                  for(let i = 0; i <= upload_len + 1; i++)
                  {
                      await cloudinary.uploader.destroy(finalPath[i], (error, result) => {
          
                          if(upload_res.length === upload_len)
                          {
                            /* resolve promise after upload is complete */
                            resolve(upload_res)
                          }else if(result)
                          {
                            upload_res.push(result.url);
                          } else if(error) {
                            reject(error)
                          }
          
                      })
          
                  } 
              })
              deleteImgs.then(response => response)
              
            }
              
              
              
            // deletes all comments associated with the scene
            Comment.deleteMany({"_id": {$in: scene.comments}}, function (err) {
                if (err) {
                    req.flash('error', 'sorry, we could not find you are looking for. :/')
                    return res.redirect("/scenes");
                }
                return
               
            });
                // deletes all reviews associated with the scene
            Review.deleteMany({"_id": {$in: scene.reviews}}, function (err) {
                if (err) {
                    req.flash('error', 'sorry, we could not find you are looking for. :/')
                    return res.redirect("/scenes");
                }
                return
            });
            
        }
        scene.remove();
        req.flash("success", "Location deleted successfully!");
        res.send({data: "delete"});
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