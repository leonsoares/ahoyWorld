document.addEventListener('click', function (event) {
    
	// If the clicked element doesn't have the right selector, bail
    if (event.target.matches('.addImgUrl')){
        inserImgUrl(event.target)
        // console.log(event.target.parentElement)

    }else if (event.target.matches('.addImgfile')){
        inserImgFile(event.target)
    } else if(event.target.matches('.fa-exchange-alt')){
        restoreDefault(event.target)
    }


}, false);


function inserImgUrl(element){
    // console.log("1")
    // console.log(element.parentElement.parentElement.childNodes)
    let parent = element.parentElement
    let label = element.parentElement.parentElement.childNodes[1]
    let inputName = element.parentElement.parentElement.childNodes[1].htmlFor
    // console.log("2")
    // console.log(inputName)
    let replaceIcon = `
    <i class="fas fa-exchange-alt"></i>
    `
    element.parentElement.innerHTML = ""
    let urlInput = `
    <input type="url" name="${inputName}" class="form-control" placeholder="Paste Image URL here!" id="image" required>
    `
    parent.insertAdjacentHTML('beforeend', urlInput)
    label.insertAdjacentHTML('afterend', replaceIcon)
}

function inserImgFile(element){
    let parent = element.parentElement
    let label = element.parentElement.parentElement.childNodes[1]
    let inputName = element.parentElement.parentElement.childNodes[1].htmlFor
    let replaceIcon = `
    <i class="fas fa-exchange-alt"></i>
    `
    element.parentElement.innerHTML = ""
    let urlInput = `
    <input onchange="ValidateSize(this)" type="file" name="${inputName}" class="form-control-file" id="${inputName}" accept="image/png, image/jpeg">

    `
    parent.insertAdjacentHTML('beforeend', urlInput)
    label.insertAdjacentHTML('afterend', replaceIcon)
}

function restoreDefault(element){
    let allNodes = element.parentElement.childNodes
    let inputFields = ""
    allNodes.forEach(element => {
        if(element.className === "selectImgType"){
            inputFields = element
        }
    })

    inputFields.innerHTML = ""
    let defaultConfig = `
    <button type="button" class="btn btn-secondary addImgUrl">Add Image URL</button> Or
    <button type="button" class="btn btn-secondary addImgfile">Upload from your device</button>
    `
    inputFields.innerHTML = defaultConfig
    element.remove()
}

function ValidateSize(file) {
    // console.log("3")
    // console.log(file.parentNode.childNodes)
    var FileSize = file.files[0].size / 1024 / 1024; // in MB
    let parent = file.parentNode.parentNode.childNodes
    // let form = file.parentNode.parentNode.parentNode.childNodes
    let msg = " "
    parent.forEach(element =>{
    if(element.className === "feedBack"){
        msg = element
        }
    })

    if (FileSize > 3) {
        msg.style.display = "inline-block"
        msg.textContent = "File size exceeds 3 MB"
       $(file).val(''); 
    }  else{
        msg.textContent = ""
        msg.style.display = "none"

        var split = file.files[0].name.split('.');
        var filename = split[0];
        var extension = split[1];

        if (filename.length > 10) {
            filename = filename.substring(filename.length - 10, filename.length);
        }
        
        var result = "..." + filename + '.' + extension;
        let fileParent = file.parentNode
        
        // fileParent.innerHTML = ""
        file.style.display = "none"


        fileParent.insertAdjacentHTML('beforeend',result)
        // let image1 = document.getElementById("image1").files.length
        // console.log("4")
        // console.log("image1: " + image1)
        // if(document.getElementById("image2")){
        //     console.log("5")
        //     console.log("image2: " + document.getElementById("image2").files.length)
        //         }
        // if(document.getElementById("image3")){
        //     console.log("6")
        //     console.log("image3: " + document.getElementById("image3").files.length)
        // }
    }
}

function msgNotValid(element){
    let inputName = document.getElementsByName(element)
    let parent = inputName[0].parentNode.childNodes
    // console.log(parent)
    parent.forEach(element => {
        if(element.className === "feedBack"){
            // console.log("this is element: ")
            // console.log(element)
            element.style.display = "inline-block"
        }
    })
}


function clearMsg(element){
    
    let inputName = document.getElementsByName(element)
    let parent = ''

    if(element === "image1" || element === "image2" || element === "image3" ){
        parent = inputName[0].parentNode.parentNode.childNodes
    }else{
        parent = inputName[0].parentNode.childNodes
    }
    parent.forEach(element => {
        if(element.className === "feedBack"){
            element.style.display = "none"
        }
    })
}

function msgAddImage(){
    let image = document.querySelector('.image-form-1').childNodes

    image.forEach(element =>{
        if(element.className === "feedBack"){
            element.style.display = "inline-block"
            element.textContent = "You must add at least one valid image to your post"
        }
    })
}

function hasImageOnFile(){
    let files = []
    let image1 = document.getElementById("image1")
    let image2 = document.getElementById("image2")
    let image3 = document.getElementById("image3")
    if(image1){
        if(image1.files.length > 0){
        files.push(image1.files[0])
        
        }
    }if(image2){
        if(image2.files.length > 0) files.push(image2.files[0])
    }if(image3){
        if(image3.files.length > 0) files.push(image3.files[0])
    } 
    return files
}

function checkInputValues(formData){
    var hasAllFields = []
    formData.forEach(element => {
        if(element.value.trim().length == 0) {
            hasAllFields.push(false)
            msgNotValid(element.name)
        }else if (element.value.trim().length != 0){
            hasAllFields.push(true)
            clearMsg(element.name)
        }
    })
    return hasAllFields.some(function (arrVal) { 
        return arrVal === false; 
    }); 
}

function checkImageUrl(formData){
    let values = []
    formData.forEach(element => {
        if(element.name === "image1" || element.name === "image2" || element.name === "image3" ) {
            if(element.value.match(/^http.*\.(jpeg|jpg|gif|png)$/) != null){
            values.push(true)
            clearMsg(element.name)
            }else{
             msgNotValid(element.name)
            }
        } 
    })
    return values.some(function (arrVal) { 
        return arrVal === true; 
    }); 
}

function validateForm(){
    event.preventDefault()
    var formData = $('#addNewSceneForm').serializeArray()

    var hasImageUrl = checkImageUrl(formData) 
    let files = hasImageOnFile()
    console.log(files)
    let hasImageFile = files.length > 0 ? true : false
    
    let hasAllfields = !checkInputValues(formData)
    console.log("hasImageUrl " + hasImageUrl)
    console.log("hasImageFile " + hasImageFile)
    console.log("hasAllfields " + hasAllfields)
    
    if(hasImageUrl === false && hasImageFile === false) msgAddImage()

    if(hasImageFile === true && hasAllfields === true || hasImageUrl === true && hasAllfields === true){
        console.log(files)
        let data = new FormData()
        formData.forEach(element => {
            data.append(element.name, element.value)
        })
        if(hasImageFile === true){
            files.forEach(img => {
                console.log(img.name)
                data.append(img.name, img)
            })
        }
        // for (var [key, value] of data.entries()) { 
        //     console.log(key, value);
        //   }
        // console.log(data)
        // console.log(formData)
        sendPost(data)
        
    }
}

function sendPost(formData){
   
    fetch("/scenes/newScene", {method: "POST", body: formData})
    .then(data => {
      console.log(data)
  });
}