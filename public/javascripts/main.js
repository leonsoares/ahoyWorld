
// modal config

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
  
  // **************** SHARE LOCATIONS WITH PEOPLE YOU FOLLOW ONLY ****************

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
          item.setAttribute("disabled", true);
          item.innerHTML = "sent";
      });
    });
    });
  }

  // **************** MARK A LOCATION AS VISITED ****************


function flagLocation(){
    let flag = document.querySelectorAll(".btn-flag")
    let isShowPage = document.querySelector('.isShowPage')
    flag.forEach(item => {
        item.addEventListener("click", function(){
            var sceneId = item.parentNode.parentNode.id
            var icon = item.childNodes
            fetch(`/scenes/${sceneId}/flag`, {method: "POST"})
            .then(response => response.json())
            .then(data => {
              let link = 'data-toggle="modal" data-target="#showAllVisited"'
            displayFlashMsg(data.message, link, "Places Visited List ", "locations/flagged", ".flaggedPlaces")
            icon[1].classList.toggle('fas')
            icon[1].classList.toggle('fa-map-marked-alt')
            icon[1].classList.toggle('far')
            icon[1].classList.toggle('fa-map')
            item.classList.toggle('action-buttons-selected')
            removeFlashMsg()

            if(isShowPage && data.scene.flag.length === 0){
              let noVisitors = `
              <div class="noComments">
                <div class="noCommentsContent">
                  <h5 class="textNoComments">No Ahoy Traveler has visited  <br>this  place as  yet. </h5>
                 </div>
              </div>
              `
              document.querySelector(".allFlags").innerHTML = noVisitors

            } else if(isShowPage && data.scene.flag.length === 5){
              addSeeMoreBtn(data.scene._id)
            }else if(isShowPage && data.userFlag && data.scene.flag.length <= 4){
              if(data.scene.flag.length == 1){
                let singleUser = '<div class="travelers-block users-flagged"> </div>'
                document.querySelector(".allFlags").innerHTML = ""
                document.querySelector(".allFlags").insertAdjacentHTML("beforeend", singleUser)
              }
                addFlagLocationUser(data.user)
              
            } else if (isShowPage && !data.userFlag){
              removeFlagLocationUser(data.user._id)
              
            }
        });
     });
  });
}
flagLocation()

// **************** ADD A USER TO VISITORS TO A LOCATION BANNER ****************


function addFlagLocationUser(user){
  let inserTo = document.querySelector(".users-flagged")
  let data = `
      <a href="../users/${user._id}" id="flagId${user._id}"class="travelers-item-block ">
        <div class="travelers-prof-pic-container">
          <img src="${user.avatar}"  class="traveler-prof-pic">
        </div>
        <div class="travelers-info-block">
          <h1 class="traveler-name link-tag">${user.username}</h1>
          <h1 class="traveler-place">${user.location.country}</h1>
        </div>
      </a>
    `
    inserTo.insertAdjacentHTML('beforeend', data);
}

function removeFlagLocationUser(flagId){
  let removeItem = document.getElementById(`flagId${flagId}`)
  removeItem.remove()
}

// **************** ADD SEE MORE BTN TO SEE ALL VISITORS ****************

function addSeeMoreBtn(id){
  let inserTo = document.querySelector(".users-flagged")

  let btn = `
  <div class="see-all-visites" onclick="getAllVisitors('${id}')">
    <a class="nav-link heading-7"  data-toggle="modal" data-target="#showAllFlaged" href="#">
      <p>See all...</p>
    </a>
  </div>
  `
  inserTo.insertAdjacentHTML('afterend', btn);
}



// **************** ADD A LOCATION TO FLAGGED PLACES LIST ****************

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

// **************** DISPLAY FLASH MESSAGES ****************
function displayFlashMsg(msg, link, toggle, id, modalType){
  var w = window.innerWidth
  || document.documentElement.clientWidth
  || document.body.clientWidth;

  let flashContainerMobile = document.querySelector(".flash-msg-mobile")

  let flashContainer = document.querySelector(".flash-msg")
  var flashmsg =`
    <div class="alert alert-success alert-dismissible fade show" id="${id}" role="alert">
    ${msg } <a class="alert-link" ${link}>${toggle}</a>
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  `
  if(w > 991){
    flashContainer.insertAdjacentHTML('beforeend', flashmsg);
    } else{
      flashContainerMobile.insertAdjacentHTML('beforeend', flashmsg);
    }
  getLocationsSaved(modalType)
  
}

// **************** DISPLAY FLASH MESSAGES AFTER ACTIONS ****************


function displayFlashMsgOpt(msg){
  var w = window.innerWidth
  || document.documentElement.clientWidth
  || document.body.clientWidth;
  let flashContainerMobile = document.querySelector(".flash-msg-mobile")
  let flashContainer = document.querySelector(".flash-msg")
  var flashmsg =`
    <div class="alert alert-success alert-dismissible fade show"  role="alert">
    ${msg} <a href="#" class="alert-link" ></a>
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  `
  if(w > 991){
    flashContainer.insertAdjacentHTML('beforeend', flashmsg);
    } else{
      flashContainerMobile.insertAdjacentHTML('beforeend', flashmsg);
    }
}

// **************** REMOVES FLASH MESSAGE ****************


function removeFlashMsg() {
  let flashContainer = document.querySelector(".alert")
  setTimeout(function(){ 
      flashContainer.remove()
  }, 3300);
}

// **************** DISPLAY ALL LOCATIONS FLAGGED BY USER ON ALL PAGES ****************

function getLocationsSaved(modalType){
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

// **************** DISPLAY ALL LOCATIONS SAVED BY USER ON USER PROFILE ****************

function userSeeAllSaved(){
let seeAllSaved = document.querySelector(".seeAllSaved")

    
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
        
    }).then($('#showAllSaved').modal('show'))

}


// **************** DISPLAY ALL LOCATIONS FLAGGED BY USER ON USER PROFILE ****************
function userSeeAllFlagged(){
  let seeAllFlagged = document.querySelector(".seeAllFlagged")

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
    }).then($('#showAllVisited').modal('show'))
}


// **************** DELETE SCENE ****************
    let deleteBtn = document.querySelectorAll('.deleteLocation')
    deleteBtn.forEach(item => {
    item.addEventListener("click", function(){
      const parent = item.parentNode.parentNode.parentNode.parentNode.parentNode
      const sceneId = parent.id
      fetch(`../scenes/${sceneId}/delete/user`, {method: "POST"})
        .then(response => response.json())
        .then(data => {
          parent.remove();
          displayFlashMsgOpt(data.message)
          removeFlashMsg()
      });
    })
  })

// **************** POST COMMENT ****************


function postComment(){
  
    let postCommentBtn = document.querySelector(".postComment")
      const sceneId = postCommentBtn.parentNode.id
      const testString = document.querySelector("#commenText").value
      const insertTo = document.querySelector(".comments")
      var data = [{comment:document.querySelector("#commenText").value}]
      const bts = `
      <div class="btnAddComment">
          <button type="button" class="btn btn-info" data-toggle="modal" data-target="#addComment">Add Comment</button>
        </div>
      `
      if(testString.replace(/\s/g,"") == ""){
        displayFlashMsgOpt("Comment Can not be empty")
        removeFlashMsg()
      } else {
      document.querySelector("#commenText").value === ""
      $('#addComment').modal('hide')
      document.querySelector("#commenText").value = ""
      fetch(`/scenes/${sceneId}/comments`, {method: "POST", body: JSON.stringify(data), headers: {'Content-Type': 'application/json',}})
      .then(response => response.json())
      .then(data => {
        let commentDom = "";
      commentDom = `
          <div class="div-block-8" id="${data.comment._id}">
        <div class="div-block-9">
          <a href="../users/${data.comment.author.id}">
            <h1 class="heading-6 link-tag">${data.comment.author.username}</h1>
          </a>
        </div>
        <div class="div-block-11 newComment">
          <div class="comment-block">
            <div class="commentContent" id="commentContent${data.comment._id}">
            ${data.comment.text}
            </div>
          </div>
          <div class="div-block-12">
                    
                  <div class="editCommentContainer" title="Edit/delete">
                    <i class="fas fa-cog fa-lg fa-2x "  id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false""></i>
                      <div class="dropdown-menu dropdown-menu-right mobile-setting-items" aria-labelledby="dropdownMenuButton">
                          <a class="dropdown-item item" data-toggle="modal" data-target="#deleteComment${data.comment._id}" href="#">Delete</a>
                          <a class="dropdown-item item" data-toggle="modal" data-target="#editComment${data.comment._id}"href="#">Edit</a>
                      </div>
                  </div>
  
                <!-- Modal Edit -->
                <div class="modal fade" id="editComment${data.comment._id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                      <div class="modal-content">
                        <div class="modal-header table-dark">
                          <h5 class="modal-title" id="exampleModalLabel">Edit Comment</h5>
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>

                        <div class="modal-body table-dark">
                            <textarea id="commentText${data.comment._id}" class="form-control" type="textarea" rows="4" cols="4" maxlength="10" name="text">${data.comment.text}</textarea>
                            <br>
                            <br>
                            
                            <div class="modal-footer table-dark">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                <button onclick="editComment('${data.comment._id}')" type="button" class="btn btn-primary">Save changes</button>
                            </div>
                        </div>
                        
                      </div>
                    </div>
                  </div>

                  <!-- modal delete -->

                  <div class="modal fade" id="deleteComment${data.comment._id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                      <div class="modal-dialog">
                        <div class="modal-content">
                          <div class="modal-header table-dark">
                            
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <div class="modal-body table-dark">
                              <h4 class="modal-title" id="exampleModalLabel">Are you sure that 
                                  <br>you want to delete this comment?</h4>
                          </div>
                          <div class="modal-footer table-dark">
                              
                              <input onclick="deleteComment('${data.comment._id}', '${data.sceneId}')" type="submit" class="btn btn-xs btn-danger" value="Yes">
                              <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
                            </div>
                        </div>
                      </div>
                    </div>
          </div>
        </div>
      </div>
      `
      if(data.commentsLength === 1){
        insertTo.innerHTML = ""
        insertTo.insertAdjacentHTML('afterend', bts)
        
      }
      if(data.commentsLength < 8){
        insertTo.insertAdjacentHTML('beforeend', commentDom)
        displayFlashMsgOpt(data.message)
        removeFlashMsg()
      }
      if(data.commentsLength === 8){
        addSeeAllCommentsBtn(data, sceneId)
      }

      
    });
  }
}

function addSeeAllCommentsBtn(data, sceneId){
  let btn = `
    <button onclick="renderAllCommentsModal('${sceneId}')" type="button" class="btn btn-info seeAllComments">See All ${data.commentsLength} Comments</button>
  `
  let parent = document.querySelector(".btnAddComment")
  parent.insertAdjacentHTML("beforeend", btn)
}

let seeAllComent = document.querySelector(".seeAllComments")




function renderAllCommentsModal(id){
  let data = {sceneId: id}
  let modal = `
    <div class="modal fade" id="seeAllCommentsModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header table-dark">
          <h5 class="modal-title" id="exampleModalLongTitle">All Comments</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body seeAllCommentsBody table-dark">
          
        </div>
        <div class="modal-footer table-dark">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
  `
  let body = document.querySelector('body')
  body.insertAdjacentHTML("beforeend", modal)
  let modalBody = document.querySelector('.seeAllCommentsBody')

  fetch(`/../scenes/${id}/comments/get`, {method: "POST", body: JSON.stringify(data), headers: {'Content-Type': 'application/json'}})
      .then(response => response.json())
      .then(data => {
        $('#seeAllCommentsModal').modal('show')
        console.log(data)
        data.comments.forEach(function(element){
          let eachComment =  `
          <h5><a href="../users/${element.author.id}" class="tooltip-test" title="Tooltip">${element.author.username}</a></h5>
            <p> ${element.text}</p>
          <hr>
          `
          modalBody.insertAdjacentHTML("beforeend", eachComment)
        })
      })

}



// **************** DELETE COMMENT ****************

function deleteComment(id, sceneId){
  const data = [{commentid:id, scene: sceneId}]
  

  let commentDiv = document.getElementById(id)
  const modalId = `#deleteComment${id}`
  const insertTo = document.querySelector(".comments")
  $(modalId).modal('hide')
    fetch(`/scene/comment/delete/${id}`, {method: "POST", body: JSON.stringify(data), headers: {'Content-Type': 'application/json'}})
    .then(response => response.json())  
    .then(data => {
      
      if(data.commentsLength === 0 || !data.commentsLength){
        insertTo.innerHTML = `
          <div class="noComments">
            <div class="noCommentsContent">
              <h5 class="textNoComments">No Comments for this scene yet. <br> 
                Be the first to comment</h5>
                  <button type="button" class="btn btn-info" data-toggle="modal" data-target="#addComment">Add Comment</button>
            </div>
          </div>
        `
        document.querySelector(".btnAddComment").innerHTML = ""
      }
        commentDiv.remove()
        displayFlashMsgOpt(data.message)
        removeFlashMsg()
  });
}

// **************** EDIT COMMENT ****************

function editComment(id){
  var commentText = document.querySelector(`#commentText${id}`).value
  const data = [{commentid:id, commentText}]
  let commentContent = document.getElementById(`commentContent${id}`)
  if(commentText .replace(/\s/g,"") == ""){
    displayFlashMsgOpt("Comment Can not be empty")
    removeFlashMsg()
  } else {
    $(`#editComment${id}`).modal('hide')
      fetch(`/scene/comment/edit/${id}`, {method: "POST", body: JSON.stringify(data), headers: {'Content-Type': 'application/json'}})
      .then(response => response.json())  
      .then(data => {
        commentContent.textContent = data.editedComment
        displayFlashMsgOpt(data.message)
        removeFlashMsg()
      
    });
  }
}


function rateScene(id){
  let insertTo = document.querySelector(".ratings")

  var form = document.querySelectorAll('.ratingForm')
  let rating = 0
  for (i = 0; i < form.length; i++) {
    if (form[i].checked) {
      rating = form[i].value
    }
  }
  if(rating !== 0){
    $("#ratings").modal('hide')
      fetch(`../scenes/${id}/reviews`, {method: "POST", body: JSON.stringify(rating), headers: {'Content-Type': 'application/json'}})
      .then(response => response.json())  
      .then(data => {
        
        let userRating = `
            <div class="review-content">
              <div class="reviews-block-foot">
                <p class="stars-review">
                  <span class="far fa-star fa"></span>
                  ${data.userRate > 1.5 ? '<span class="far fa-star fa"></span>' : '<span class="far fa-star"></span>'}
                  ${data.userRate > 2.5 ? '<span class="far fa-star fa"></span>' : '<span class="far fa-star"></span>'}
                  ${data.userRate > 3.5 ? '<span class="far fa-star fa"></span>' : '<span class="far fa-star"></span>'}
                  ${data.userRate > 4.5 ? '<span class="far fa-star fa"></span>' : '<span class="far fa-star"></span>'}
                </p>
              </div>
              <div>
                by: <a class="link-tag" href="../users/${data.user._id}"><strong>${data.user.username}</strong></a>
              </div>
              <span><em>${data.createdAt}</em></span>
            </div>
          `
        if(data.ratingLength == 1){
          let noRatingDiv = document.querySelector(".noRating")
          let ratingContainer = `
          <div class="review-container"></div>
          `
          insertTo.innerHTML = ""
          insertTo.insertAdjacentHTML('beforeend', ratingContainer)
          let inserContent = document.querySelector(".review-container")
          inserContent.insertAdjacentHTML('beforeend', userRating)   
        } else if (data.ratingLength < 6 && data.ratingLength > 0){
          let inserContent = document.querySelector(".review-container")
          inserContent.insertAdjacentHTML('beforeend', userRating)
          
        } else if (data.ratingLength == 6){

        }
        let newStarReview = `
          <a href="#" class="nav-link"  data-toggle="modal" data-target="#ratings" > 
            <p>
            <span class="far fa-star fa"></span>
            ${data.sceneRate > 1.5 ? '<span class="far fa-star fa"></span>' : '<span class="far fa-star"></span>'}
            ${data.sceneRate > 2.5 ? '<span class="far fa-star fa"></span>' : '<span class="far fa-star"></span>'}
            ${data.sceneRate > 3.5 ? '<span class="far fa-star fa"></span>' : '<span class="far fa-star"></span>'}
            ${data.sceneRate > 4.5 ? '<span class="far fa-star fa"></span>' : '<span class="far fa-star"></span>'}
            <em class="sceneTotalRatings">(${data.ratingLength} - ratings )</em>
            </p>
          </a>
        `
        document.querySelector(".reviews-block").innerHTML = ""
        document.querySelector(".reviews-block").insertAdjacentHTML("beforeend", newStarReview)
        displayFlashMsgOpt(data.message)
        removeFlashMsg()
      
    });
  }  
}

