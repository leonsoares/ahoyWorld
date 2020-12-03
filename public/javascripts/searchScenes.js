let searchByTag = document.querySelector(".tags-container-indexPage")

if( searchByTag){
    searchByTag.addEventListener('click', async function(element){
        event.preventDefault()
        let data = await fetchScenes(element.target.innerHTML)
        console.log(data)
        changeDomElements(data)
        
        console.log(data)
    })
}

let sendSearch = document.querySelector(".sendSearch")
if(sendSearch){
    sendSearch.addEventListener("click", async function(element){
        event.preventDefault()
        let searchForm = $('.form-all-cenes').serializeArray()
        let data = await fetchScenes(searchForm[0].value)
        changeDomElements(data)
        console.log("fromBack")
        
        console.log(data)
    })
}





async function fetchScenes(tag) {
    let data = {tagSearch : tag}
    return fetch(`/scenes/searchbytag`, {method: "POST", body: JSON.stringify(data), headers: {'Content-Type': 'application/json'}})
        .then(response => response.json())
        .then(data => {
            return data 
        })
}


function changeDomElements(data){
    let scenesContainer = document.querySelector(".scenes-all-posts")
    
    scenesContainer.innerHTML = ""
    data.scenes.forEach(scene => {
        inserDomElement(scene, scenesContainer, data.user)
    });

    document.querySelector(".resultsFor").innerHTML = data.resultsFor
}

function inserDomElement(scene, parent, user){
    let sceneFlag = `
        <div class="action-buttons action-buttons-selected preventDefault btn-flag" data-toggle="tooltip" data-placement="top" title="You marked this place as visited">
            <i class="fas fa-map-marked-alt fa-2x"></i>
        </div>
    `
    let notFlag =  `
        <div class="action-buttons preventDefault btn-flag">
            <i class="far fa-map fa-2x" data-toggle="tooltip" data-placement="top" title="Mark as visited"></i>
        </div>
    `
    let notUserFlag = `
        <div  class="action-buttons preventDefault " data-toggle="modal" data-target="#staticBackdrop">
            <i class="far fa-map fa-2x" data-toggle="tooltip" data-placement="top" title="Mark as visited"></i>
        </div>
    `
    let flag
    if (user && scene.flag.some(function (flag) {
        return flag === user._id
    })) { 
        flag = sceneFlag
    }else if(user){
        flag = notFlag
    } else {
        flag = notUserFlag
    }

    // -------------- if user saved the scene logic ------------------
    let sceneSaved = `
        <div  class="mark-visited action-buttons action-buttons-selected btn-save preventDefault" data-toggle="tooltip" data-placement="top" title="Remove it from your saved Places">
            <i class="fas fa-clipboard fa-2x"></i>
        </div>
    `

    let notSaved = `
        <div class="mark-visited action-buttons btn-save preventDefault">
            <i class="far fa-clipboard fa-2x" data-toggle="tooltip" data-placement="top" title="Save this place"></i>
        </div>
    `

    let notUserSaved =`
        <div class="mark-visited action-buttons preventDefault" data-toggle="modal" data-target="#staticBackdrop">
            <i class="far fa-clipboard fa-2x" data-toggle="tooltip" data-placement="top" title="Save this place"></i>
        </div>
    `
    let saved
    if (user && scene.saveScene.some(function (hasSaved) {
        return hasSaved === user._id
    })) { 
        saved = sceneSaved
    }else if(user){
        saved = notSaved
    } else {
        saved = notUserSaved
    }

    let share =`
        <div class="mark-visited action-buttons preventDefault" id="share-btn"  data-toggle="modal" data-target="#sharedScene" title="Share Location">
            <i class="far fa-paper-plane fa-2x"></i>  
        </div>
    `

    let shareNotUser = `
        <div  class="mark-visited action-buttons preventDefault" id="share-btn"  data-toggle="modal" data-target="#staticBackdrop" title="Share Location">
            <i class="far fa-paper-plane fa-2x"></i>  
        </div>
    `
    let shareScene = ""

    if(user) shareScene = share
    else shareScene = shareNotUser
    

    let sceneDom = `
    <div class="scene-item-container">
        <div class="actions-box" id="${scene._id}">
        <div >
            ${flag}
        </div>
        <div >
            ${saved}
        </div>
        <div >
            ${shareScene}
        </div>
         
        </div>

        <div class="scene-item-container-img"><a href="/scenes/${scene.id}"><img src="${scene.images.img1}" alt="" class="icon-1"></a>
        <form action="/scenes/tag/${scene.sceneType}" method="GET">

            <button type="submit" class="btn btn-primary category-tag-${scene.sceneType}">${scene.sceneType}</button>

        </form>
        <a href="/scenes/${scene.id}" class="categori-description-block w-inline-block">
            <h1 class="category-title">${scene.name}</h1>
            <br>
            <h4 class="category-title">${scene.location.country}</h4>
        </a>
        </div>
        
        <div class="category-description">
        ${scene.description}<a class="link-more" href="/scenes/${scene.id}[...]</a>
        </div>   
    </div>
    `
        parent.insertAdjacentHTML("beforeend", sceneDom)
    
}

