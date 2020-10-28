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