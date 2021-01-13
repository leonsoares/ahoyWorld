

document.addEventListener('click', function (event) {
    
	// If the clicked element doesn't have the right selector, bail
    if (event.target.matches('.addImgUrl')){
        inserImgUrl(event.target)

    }else if (event.target.matches('.addImgfile')){
        inserImgFile(event.target)
    } else if(event.target.matches('.fa-exchange-alt')){
        restoreDefault(event.target)
    }


}, false);


function inserImgUrl(element){
  
    let parent = element.parentElement

    let label
    
    let inputName 


    let allElements = element.parentElement.parentElement.childNodes
    allElements.forEach(element =>{
        if(element.localName === "label") {
            label = element
            inputName = label.htmlFor
        }
    })
    
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
    let allElements = element.parentElement.parentElement.childNodes
    let label 
    allElements.forEach(element => {
        if(element.localName === "label") label = element
    })
    
    let inputName = label.htmlFor
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
        
        file.style.display = "none"


        fileParent.insertAdjacentHTML('beforeend',result)
  
    }
}

function msgNotValid(element, form){
    let selectedForm = document.querySelector("#"+form).children
    for (let i = 0; i < selectedForm.length; i++) {
        selectedForm[i].childNodes.forEach(childrenEl => {
            if(childrenEl.name == element){

                childrenEl.parentNode.childNodes.forEach(div =>{
                    if(div.className === "feedBack"){
                        div.style.display = "inline-block"
                    }
                })
            } 
        });
      }
}


function clearMsg(element, form){


    let selectedForm = document.querySelector("#"+form).children
    for (let i = 0; i < selectedForm.length; i++) {
        selectedForm[i].childNodes.forEach(childrenEl => {
            if(childrenEl.name == element){
                childrenEl.parentNode.childNodes.forEach(div =>{
                    if(div.className === "feedBack"){
                        div.style.display = "none"
                    }
                })
            } 
        });
      }
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

function checkInputValues(formData, formType){
    var hasAllFields = []
    formData.forEach(element => {
        if(element.value.trim().length == 0) {
            hasAllFields.push(false)
            msgNotValid(element.name, formType)
        }else if (element.value.trim().length != 0){
            hasAllFields.push(true)
            clearMsg(element.name, formType)
        }
    })
    return hasAllFields.some(function (arrVal) { 
        return arrVal === false; 
    }); 
}

function checkImageUrl(formData, form){
    let values = []
    formData.forEach(element => {
        if(element.name === "image1" || element.name === "image2" || element.name === "image3" ) {
            if(element.value.match(/^http.*\.(jpeg|jpg|gif|png)$/) != null){
            values.push(true)
            clearMsg(element.name, form)
            }else{
             msgNotValid(element.name, form)
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
    let formType = "addNewSceneForm"
    var hasImageUrl = checkImageUrl(formData, formType) 
    let files = hasImageOnFile()
    let hasImageFile = files.length > 0 ? true : false
    
    let hasAllfields = !checkInputValues(formData, formType)

    
    if(hasImageUrl === false && hasImageFile === false) msgAddImage()

    if(hasImageFile === true && hasAllfields === true || hasImageUrl === true && hasAllfields === true){
        let data = new FormData()
        formData.forEach(element => {
            data.append(element.name, element.value)
        })
        if(hasImageFile === true){
            files.forEach(img => {
                data.append(img.name, img)
            })
        }
        renderLoader("#addNewSceneForm")
        sendPost(data)
        
    }
}

function sendPost(formData){
   
    fetch("/scenes/newScene", {method: "POST", body: formData})
    .then(data => {
        window.location.href = data.url
      
  });
}


// ________________________ EDIT POST___________________

async function fetchCountries() {
    let key = await getKey()
    const response = await fetch('https://www.universal-tutorial.com/api/countries/', {method: "GET", 
    headers: {"Authorization": `leon ${key.auth_token}`}});
    const countries = await response.json();
    return countries;
    
}

async function getKey(){

        const response = await fetch('https://www.universal-tutorial.com/api/getaccesstoken', {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "api-token": "YNSIl9w8m3L5EZfhhDyFK-AbIfA2n1rffbTps-BqEdmD2bldV5YrGm55diaHZVEgIf8",
            "user-email": "leonsoares3@gmail.com"
        }
    })
    const key  = response.json()
    return key
}


function addCountriesOpt(countries){
    let inpuPlace = document.querySelector('#editcountryId')
    countries.forEach(element => {
        let opt = `
        <option value="${element.country_name}">${element.country_name}</option>
        `
        if(inpuPlace) inpuPlace.insertAdjacentHTML("beforeend", opt)
    })
}

function addStatesOpt(states){ 
    if(states !== false){
        let inpuPlace = document.querySelector('#editState')
        states.forEach(element => {
            let opt = `
            <option value="${element.state_name}">${element.state_name}</option>
            `
            if(inpuPlace)inpuPlace.insertAdjacentHTML("beforeend", opt)
            
        })
    }
}

async function getStates(query){
    
    if(query){
        let key = await getKey()
        const response = await fetch(`https://www.universal-tutorial.com/api/states/${query}`, {method: "GET", 
        headers: {"Authorization": `leon ${key.auth_token}`}});
        const states = await response.json();
        return states;
    } else return false   
}




function editPost(sceneId, editingFrom){
    loadModal()

    $(".closeModal").click(function(){
        $("#editSceneModal").modal('hide');
        $("#editSceneModal").remove()
        
   })

    fetch(`/scene/${sceneId}/edit`, {method: "GET", headers: {'Content-Type': 'application/json'}})
    .then(response => response.json())
    .then(data => {
      let sceneType = document.querySelector(".editSceneType")
      let selectContry = document.querySelector(".selectContry")
      let selectState = document.querySelector("#editState")
      let knownAs = document.querySelector('.knownAs')
      let sceneTitle = document.querySelector(".sceneTitle")
      let sceneDescription = document.querySelector(".sceneDescription")
      let editImage1 = document.querySelector(".editImage1")
      let editImage2 = document.querySelector(".editImage2")
      let editImage3 = document.querySelector(".editImage3")
      $("#editSceneModal").modal('show')
        sceneType.childNodes.forEach(element => {
            if(element.innerHTML && element.innerHTML.toLowerCase() == data.scene.sceneType){
                element.setAttribute("selected", "selected")
            }
        })

        fetchCountries().then(countries => {
            addCountriesOpt(countries)
          }).then(countries => {
            selectContry.childNodes[1].innerHTML = "Select Country: "
            selectContry.childNodes.forEach(element => {
                if(element.innerHTML && element.innerHTML == data.scene.location.country){
                    element.setAttribute("selected", "selected")
                }
            })
          }).then(()=>{
            getStates(`${data.scene.location.country}`).then(states => {
                addStatesOpt(states)
              }).then(states => {
                selectState.childNodes[1].innerHTML = "Select State/Province: "
                selectState.childNodes.forEach(element => {
                    if(element.innerHTML && element.innerHTML == data.scene.location.state){
                        element.setAttribute("selected", "selected")
                    }
                })
              })
          })
        
        let changeCountry = document.querySelector("#editcountryId")
          changeCountry.addEventListener('change', (event) => {
            selectState.innerHTML = `
            <option value="" selected = "selected">Select State / Province</option>
            `
            getStates(`${event.target.value}`).then(states => {
                addStatesOpt(states)
              }).then(states => {
                selectState.childNodes.forEach(element => {
                    if(element.innerHTML && element.innerHTML == data.scene.location.state){
                        element.setAttribute("selected", "selected")
                    }
                })
              })
          })
        
        knownAs.value = data.scene.knownAs
        sceneTitle.value = data.scene.name
        sceneDescription.value = data.scene.description

        showImgForm(data, editImage1, ".editImage1", data.scene.images.img1)
       if(data.scene.images.img2) showImgForm(data, editImage2, ".editImage2", data.scene.images.img2)
       if(data.scene.images.img3) showImgForm(data, editImage3, ".editImage3", data.scene.images.img3)

       let submitForm = document.querySelector('.submitEditForm')
       submitForm.addEventListener('click', function(){
        renderLoader(".submitEditForm")
        editScene(sceneId, editingFrom)
       })

    });
}


function renderLoader(modal){
    let parent = document.querySelector(modal)
    const loader = `
        <div class="loader">
            <svg>
                <use href="/images/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
};






function loadModal(){
    let modalForm = `
    <div class="modal" id="editSceneModal" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content ">
        <div class="modal-header table-dark">
          <h5 class="modal-title" id="exampleModalLabel">Editing</h5>
          <button type="button" class="close closeModal" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body table-dark">
        
        <form id="editSceneForm" class="needs-validation editModalFormBody" novalidate>
            <div class="form-group sceneType">
                <h6> * Pick a tag that best describes your scene:</h6>
  
                <select name="sceneType" class="form-control editSceneType" id="sceneType" required>
                  <option value="">Select Location Type:</option>
                  <option value="beach">Beach</option>
                  <option value="waterfall">Waterfall</option>
                  <option value="forest">Forest</option>
                  <option value="island">Island</option>
                  <option value="city">City</option>
                  <option value="lake">Lake</option>
                </select>
                <div class="feedBack">
                    Select a Tag!
                </div>
            </div>
            <br>
                
            <div class="form-group ">
                <label  for="title">* Scene Title</label> <i class="far fa-question-circle"  data-placement="top" delay='{"show":"0", "hide":"0"}' title="You can say something like: Secret waterfall"></i>
                <input type="text" id="name" class="form-control sceneTitle" value="" maxlength="40" name="name" required>
                <div class="feedBack">
                    Give you scene a Title
                </div>
             </div>
  
              
                <div class="form-group autoFill">
                    <label for="country"> * Scene Location:</label>
                    <select name="country" class="form-control countries order-alpha selectContry" id="editcountryId" required>
                        <option value="">Please Wait</option>
                    </select>
                    <select name="state" class="form-control states order-alpha selectState" id="editState">
                        <option value="">Please Wait</option>
                    </select>
                    <div class="feedBack">
                        You must select country and State/Province
                    </div>
                </div>
  
                <div class="form-group ">
                  <label  for="title">Place known as</label> <i class='far fa-question-circle' data-toggle='tooltip' data-placement='top' delay='{"show":"0", "hide":"3000"}' title='Filling this field helps pin point you location on the map'></i>
                  <input type="text" id="knownAs" class="form-control knownAs" value="" maxlength="40" name="knownAs" required>
                  <div class="feedBack">
                      This field is important because helps us pin point this scene's location on the map<br>
                      How does the locals call this scene? How can it be Found?
  
                  </div>
                </div>
  
                <br>
                <div class="form-group">
                    <label for="sceneDescriptiom">* Scene Description</label>
                    <textarea class="form-control sceneDescription" id="sceneDescriptiom" rows="3" name="description" required></textarea>
                    <div class="feedBack">
                      You must add a description to this scene!
                    </div>
                </div>
  
                <div class="form-group image-form-1 editImage1">
                    <label for="image1">* Image 1</label>
                    <br>
                    <div class="selectImgType">
                      <button type="button" class="btn btn-secondary addImgUrl">Add Image URL</button> Or
                      <button type="button" class="btn btn-secondary addImgfile">Upload from your device</button>
                    </div>
                    <div class="feedBack">
                      
                    </div>
                </div>
                
                <div class="form-group editImage2">
                  <label for="image2">Image 2</label> 
                  <br>
                  <div class="selectImgType">
                    <button type="button" class="btn btn-secondary addImgUrl">Add Image URL</button> Or
                    <button type="button" class="btn btn-secondary addImgfile">Upload from your device</button>
                  </div>
                  <div class="feedBack">
                        
                  </div>
                </div>
  
                <div class="form-group editImage3">
                  <label for="image3">Image 3</label> 
                  <br>
                  <div class="selectImgType">
                    <button type="button" class="btn btn-secondary addImgUrl">Add Image URL</button> Or
                    <button type="button" class="btn btn-secondary addImgfile">Upload from your device</button>
                  </div>
                  <div class="feedBack">
                        
                  </div>
                </div>
  
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary closeModal" data-dismiss="modal">Cancel</button>
                  <button type="submit" class="btn btn-primary submitEditForm">Post</button>
                </div>
            </form>
        </div>
      </div>
    </div>
  </div>
    `
    document.querySelector("body").insertAdjacentHTML("beforeend", modalForm)
}




function showImgForm(data, editImage, editing, src){
    editImage.childNodes.forEach(element =>{
        if(element.className === "selectImgType"){
            
        element.innerHTML = 
            `
        <div class="img-thumb-form">
        <img  src="${src}" alt="" class="img-thumbnail">
        <button onclick="changeImg('${editing}')" type="button" class="btn btn-secondary">Replace Image</button> 
        </div>
        `
        }
    })
}

function changeImg(element){
 
    let imgChange = document.querySelector(element).childNodes
    let remove = document.querySelector(".img-thumb-form")
    let inserImgsBtn = `
        <button type="button" class="btn btn-secondary addImgUrl">Add Image URL</button> Or
        <button type="button" class="btn btn-secondary addImgfile">Upload from your device</button>
    `
    imgChange.forEach(element => {
        if(element.className === "selectImgType"){
            element.innerHTML = ""
            element.insertAdjacentHTML("beforeend", inserImgsBtn)
        }
    })
}


function editScene(sceneId, editingFrom){
    event.preventDefault()
    var formData = $('#editSceneForm').serializeArray()
    let formType = "editSceneForm"

    var hasImageUrl = checkImageUrl(formData, formType) 
    let files = hasImageOnFile()
    
    let hasImageFile = files.length > 0 ? true : false
    
    let hasAllfields = !checkInputValues(formData, formType)
    
    if(hasAllfields === true){
        let data = new FormData()
        formData.forEach(element => {
            if(element.value) data.append(element.name, element.value)
        })
        if(hasImageFile === true){
            let imagesFile = hasNewImageFile()
            data.append("hasNewFiles", imagesFile)
            files.forEach(img => {
                data.append(img.name, img)
            })
        }
        fetch(`/scene/editScene/${sceneId}/edit`, {method: "POST", body: data})
        .then(response => response.json())
        .then(data => {
            if(editingFrom === "userPage"){
                changeDataViewUserPage(data)
            }else if(editingFrom === "showPage"){
                changeDataViewShowPage(data)
            }
            
            // window.location.href = data.url
            
        })
    }
}


function changeDataViewUserPage(data){
    $("#editSceneModal").modal('hide');
    $("#editSceneModal").modal('dispose')
    $(".loader").remove()
   
    let changeWith = `
        <div class="popular-item-container-img">
            <div class="category-tag-${data.sceneType}">
                <h1 class="search-tag">${data.sceneType}</h1>
            </div>
           

            <div class="mobile-settings preventDefault">
            <i class="fas fa-cog fa-lg fa-2x "  id="editDeleteDropDown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false""></i>
            <div class="dropdown-menu mobile-setting-items" aria-labelledby="editDeleteDropDown">
                 <a onclick="showDeleteModal('${data._id}', 'userPage') "class="dropdown-item item" >Delete</a>
                    <a onclick="editPost('${data._id}', 'userPage')" class="dropdown-item item"  href="#">Edit</a>
            </div>
            </div>
           

            
            <a href="/scenes/${data._id}">
            <img src="${data.images.img1}" alt="" class="image-2">
            </a>
        </div>
        
        <div class="categori-description-block">
            <a href="/scenes/${data._id}">
            <h1 class="category-title">${data.name}</h1>
            <div class="category-description">
            ${data.description.substring(0,215)}[...]
            </div>
            </a>
            
        </div>

    `
    let sceneId = data._id
    let showDiv = document.getElementById(sceneId)
    showDiv.innerHTML = ""
    showDiv.insertAdjacentHTML("beforeend", changeWith)

}
function changeDataViewShowPage(data){
    $("#editSceneModal").modal('hide')
    $("#editSceneModal").modal('dispose')
    $(".loader").remove()


    let sceneHeader = document.querySelector('.sceneHeader')
    let sceneHeaderContent = `
    <div class="div-block sceneHeader">
      <h1 class="heading">${data.name}</h1>
      <h1 class="heading">${data.location.country}</h1>
      <h6 class="card-title"> Post By @<a class="link-tag" href="/users/${data.author.id}"><${data.author.username}</a></h6>
    </div>
    `
    sceneHeader.innerHTML = sceneHeaderContent


    let img1 =`
        <div id="carouselExampleControls" class="carousel slide " data-ride="carousel">
            <div class="carousel-inner sceneImgs">
                <div class="carousel-item active ">
                    <img class="d-block  w-100 image" src="${data.images.img1}" alt="First slide">
                </div>
            </div>
        </div>
    `
    let img2 = `
        <div id="carouselExampleControls" class="carousel slide " data-ride="carousel">
            <div class="carousel-inner sceneImgs">
                <div class="carousel-item active ">
                    <img class="d-block  w-100 image" src="${data.images.img1}" alt="First slide">
                </div>
                <div class="carousel-item">
                    <img class="d-block w-100 image" src="${data.images.img2}" alt="Second slide">
                </div>
        </div>
    
            <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="sr-only">Previous</span>
            </a>
            <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="sr-only">Next</span>
            </a>
        </div>
    `
    let img3 = `
        <div id="carouselExampleControls" class="carousel slide " data-ride="carousel">
            <div class="carousel-inner sceneImgs">
                <div class="carousel-item active ">
                    <img class="d-block  w-100 image" src="${data.images.img1}" alt="First slide">
                </div>
                <div class="carousel-item">
                    <img class="d-block w-100 image" src="${data.images.img2}" alt="Second slide">
                </div>
                <div class="carousel-item">
                    <img class="d-block w-100 image" src="${data.images.img3}" alt="Third slide">
                </div>
            </div>

            <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="sr-only">Previous</span>
            </a>
            <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="sr-only">Next</span>
            </a>
        </div>
    `

    let newChild 
    if(data.images.img3) newChild = img3
    else if (data.images.img2) newChild = img2
    else newChild = img1

    let carousel = document.getElementById("carouselExampleControls");
    carousel.parentNode.childNodes.forEach(element => {
        if(element.id === "carouselExampleControls"){
            let brother = element.previousElementSibling
            element.remove()
            brother.insertAdjacentHTML("afterend", newChild)
            let map = document.querySelector('.initializeMap')
            initializeMap(data)
        }
    })
    
    

    let sceneDescription = document.querySelector('.scene-description')
    sceneDescription.innerHTML = `<p>${data.description}</p>`

    let visitersTitle = document.querySelector('.visiters-title')
    visitersTitle.value = `Ahoy's Visitors to ${data.name}:`


    let categoryTags = document.querySelector(".categoryTags")
    
    let newCatetegoryTags = `
    <a href="#" class="category-tag-${data.sceneType}">
        <form action="/scenes/tag/${data.sceneType}" method="GET">
            <button type="submit" class="btn btn-primary category-tag-${data.sceneType}">${data.sceneType}</button>
        </form>
    </a>
    `
    categoryTags.innerHTML = newCatetegoryTags
    

}


    function initializeMap(data) {
      const fenway = { lat: data.lat, lng: data.lng };
      const map = new google.maps.Map(document.getElementById("map"), {
        center: fenway,
        zoom: 14,
      });
      const panorama = new google.maps.StreetViewPanorama(
        document.getElementById("pano"),
        {
          position: fenway,
          pov: {
            heading: 34,
            pitch: 10,
          },
        }
      );
      map.setStreetView(panorama);
    }






function hasNewImageFile(){
    let files = []
    let image1 = document.getElementById("image1")
    let image2 = document.getElementById("image2")
    let image3 = document.getElementById("image3")
    image1 && image1.files.length > 0 ? files.push(true) : files.push(false)
    image2 && image2.files.length > 0 ? files.push(true) : files.push(false)
    image3 && image3.files.length > 0 ? files.push(true) : files.push(false)
    
    return files
}


