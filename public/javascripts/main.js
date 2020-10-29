document.getElementById("markRead").addEventListener("click", function(){
    fetch('/clicked', {method: 'GET'})
      .then(function() {
        document.getElementsByClassName("notificationIcon").innerHTML = ' 0 <i class="far fa-envelope" data-toggle="tooltip" data-placement="top" title="Notifications">  </i>'
      })
});

const notificationBtn = document.getElementById("all-notifications")
notificationBtn.addEventListener("click", function(){
fetch('/notifications', {method: "GET"})
.then(response => response.json())
.then(data => {
    var notificatioModal = document.getElementById("notification-modal-body")
    notificatioModal.innerHTML = ""
    data.allNotifications.forEach(notification => {
        const notificationDiv = `
          <li class="notification-item"><a class="notification-link" href="${notification.goTo}" >${notification.username} ${notification.message}</a></li>`
        notificatioModal.insertAdjacentHTML('beforeend', notificationDiv);
        });
    });   
});


    const modalBody = document.getElementById("share-location-modal")
    let toggleBtn = document.querySelectorAll("#share-btn")
    
      toggleBtn.forEach(item => {
      item.addEventListener("click", function(){
        modalBody.innerHTML = " "
        var sceneId = item.parentNode.id
  
    fetch('/users/scenes/share')
    .then(response => response.json())
    .then(data => {
        data.data.forEach(user => {
          const followingUser = `
          <div id="${sceneId}">
            <div class="followinguser-container" id="${user._id}">
                <div class="user-avatar-pic-container">
                  <img src="${user.avatar}" class="user-avatar">
                </div>
                <div class="user-infor-container">
                  <h6 class="following-user-name">${user.username}</h6>
                </div>
                <div class="sent-container" id="${user._id}">
                  <button class="btn btn-outline-primary send-share-form">send</button>
                </div>
              </div>
          </div>
          `
          modalBody.insertAdjacentHTML('beforeend', followingUser);
          shareLocation()
        });
      });   
    });
  });
  
  
  function shareLocation(){
      let sendShareBtn = document.querySelectorAll(".send-share-form")
      sendShareBtn.forEach(item => {
      item.addEventListener("click", function(){

        var sceneId = item.parentNode.parentNode.parentNode.id
        var userId =  item.parentNode.id
    fetch(`/scene/share/${sceneId}/${userId}`, {method: "POST"})
    .then(response => response.json())
    .then(data => {
          item.classList.add('btn-outline-success');
          item.classList.add('disabled');
          item.innerHTML = "sent";
      });
    });
    });
  }

function flagLocation(){
    let flag = document.querySelectorAll(".btn-flag")
    flag.forEach(item => {
        item.addEventListener("click", function(){
            var sceneId = item.parentNode.parentNode.id
            var icon = item.childNodes
            fetch(`/scenes/${sceneId}/flag`, {method: "POST"})
            .then(response => response.json())
            .then(data => {
              let link = 'data-toggle="modal" data-target="#showAllVisited"'
            displayFlashMsg(data.message, link, "Plces Visited List", "locations/flagged", ".flaggedPlaces")
            icon[1].classList.toggle('fas')
            icon[1].classList.toggle('fa-map-marked-alt')
            icon[1].classList.toggle('far')
            icon[1].classList.toggle('fa-map')
            item.classList.toggle('action-buttons-selected')
            removeFlashMsg() 
        });
     });
  });
}
flagLocation()

function saveLocation(){
    let saveBtn = document.querySelectorAll(".btn-save")
    saveBtn.forEach(item => {
        item.addEventListener("click", function(){
            var sceneId = item.parentNode.parentNode.id
            var icon = item.childNodes
            let link = 'data-toggle="modal" data-target="#showAllSaved"'
            
            fetch(`/scenes/${sceneId}/saveScene`, {method: "POST"})
            .then(response => response.json())
            .then(data => {
              
            displayFlashMsg(data.message, link, "Saved List", "locations/saved", ".savedPlaces")
            icon[1].classList.toggle('far')
            icon[1].classList.toggle('fas')
            item.classList.toggle('action-buttons-selected')
            removeFlashMsg() 
        });
     });
  });
}
saveLocation()

function displayFlashMsg(msg, link, toggle, id, modalType){
  let flashContainer = document.querySelector(".flash-msg")
  var flashmsg =`
    <div class="alert alert-success alert-dismissible fade show" id="${id}" role="alert">
    ${msg} <a href="#" class="alert-link" ${link}>${toggle}</a>
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  `
  flashContainer.insertAdjacentHTML('beforeend', flashmsg);
  getLocationsSaved(modalType)
}


function removeFlashMsg() {
  let flashContainer = document.querySelector(".alert")
  setTimeout(function(){ 
      flashContainer.remove()
  }, 3300);
}

function getLocationsSaved(modalType, ){
  let getLocations = document.querySelectorAll(".alert-link")
    getLocations.forEach(item => {
      item.addEventListener("click", function(){
        var url = item.parentNode.id
        var addTo = document.querySelector(modalType)
        addTo.innerHTML = " "
        fetch(`/user/${url}`, {method: "GET"})
        .then(response => response.json())
        .then(data => {
          data.locations.forEach(location => {
            const node = `
            <h6 class=""> 
              <a href="../scenes/${location._id}">${location.name}</a>
            </h6>
            `
            addTo.insertAdjacentHTML('beforeend', node);
          });
      });
    });
  });
}

function userShowSaved(){
  let getLocations = document.querySelector(".seeAllSaved")

  getLocations.addEventListener("click", function(){
    console.log('clicked')
      var addTo = document.querySelector(".savedPlaces")
      
      fetch("/user/locations/saved", {method: "GET"})
      .then(response => response.json())
      .then(data => {
        addTo.innerHTML = " "
        data.locations.forEach(location => {
          const node = `
          <h6 class=""> 
            <a href="../scenes/${location._id}">${location.name}</a>
          </h6>
          `
          addTo.insertAdjacentHTML('beforeend', node);
        });
        document.getElementById("showAllSaved").style.display = "block"
    });
    
  });
}

function userShowflagged(){
  let getLocations = document.querySelector(".seeAllFlagged")

  getLocations.addEventListener("click", function(){
    console.log('clicked')
      var addTo = document.querySelector(".flaggedPlaces")
      
      fetch("/user/locations/flagged", {method: "GET"})
      .then(response => response.json())
      .then(data => {
        addTo.innerHTML = " "
        data.locations.forEach(location => {
          const node = `
          <h6 class=""> 
            <a href="../scenes/${location._id}">${location.name}</a>
          </h6>
          `
          addTo.insertAdjacentHTML('beforeend', node);
        });
        document.getElementById("showAllVisited").style.display = "block"
    });
    
  });
}

