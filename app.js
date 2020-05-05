
const express = require('express')
const app = express();

app.set('view engine', 'ejs')
app.use(express.static("public"));


app.get('/', (req, res) =>{
    res.render('landing')
})

app.get('/scenes', (req , res) =>{
    let scenes = [
        {name: 'Tunnel of Love', location:'Ukraine', image: 'images/Tunnel_of_Love.jpg'},
        {name: 'Hitachi Seaside Park', location:'Japan', image: 'images/Hitachi_Seaside_Park.jpg'},
        {name: 'Lake Hillier', location:'Australia', image: 'images/Lake_Hillier.jpg'},
        {name: 'Bamboo Forest', location:'Japan', image: 'images/Bamboo_Forest.jpg'},
        {name: 'Tianzi Mountains', location:'China', image: 'images/Tianzi_Mountains.jpg'}
    ]
    res.render('scenes', {scenes:scenes});
})



app.listen(3000, () => { 
    console.log('Ahoy Wolrd '); 
    console.log('Server listening on port 3000'); 
  });