document.querySelectorAll(".preventDefault").forEach(btn => {
    btn.addEventListener("click", function(event) {
         event.preventDefault();
  })
});


  window.addEventListener('scroll',function(e) {
      var Wlocation = window.pageYOffset
      if(Wlocation > 40){
      document.querySelector('.navbar').style.backgroundColor = "rgba(47, 46, 46, 0.637)"
      } else if(Wlocation < 40){
      document.querySelector('.navbar').style.backgroundColor = "rgba(47, 46, 46, 0)"

      }
  });


  function getAllRates(id) {
    let removeModal = document.querySelector('#showAllRates')
    if(removeModal) removeModal.remove()
    let allReviewsModal = `
            <div id="showAllRates" class="modal fade" role="dialog">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header table-dark">
                      <h5 class="modal-title">Rates:</h5>
                      <button type="button" class="close" data-dismiss="modal">&times;</button>
                  </div>
                  <div class="modal-body table-dark " id="rateBodyContent">
                  
  
  
                    
                  </div>
                  <div class="modal-footer table-dark">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    </div>
                </div>
              </div>
            </div>
          `
        document.querySelector(".page-container").insertAdjacentHTML("beforeend", allReviewsModal)
    
        fetch(`../scenes/${id}/reviews/list`, {method: "GET"})
        .then(response => response.json())  
        .then(data => {
          
          $("#showAllRates").modal('show')
          let modalBody = document.querySelector('#rateBodyContent')
  
          data.rate.forEach(function(rate){
            let date = new Date(rate.updatedAt)
            
            let rateDiv = `
            
                <div class="reviews-block-foot">
                  <p class="stars-review action-buttons-selected">
                    <span class="far fa-star fa "></span>
                    ${rate.rating > 1.5 ? '<span class="far fa-star fa"></span>' : '<span class="far fa-star"></span>'}
                    ${rate.rating > 2.5 ? '<span class="far fa-star fa"></span>' : '<span class="far fa-star"></span>'}
                    ${rate.rating > 3.5 ? '<span class="far fa-star fa"></span>' : '<span class="far fa-star"></span>'}
                    ${rate.rating > 4.5 ? '<span class="far fa-star fa"></span>' : '<span class="far fa-star"></span>'}
                  </p>
                </div>
                <div>
                  by: <a class="link-tag" href="../users/${rate.author.id}"><strong>${rate.author.username}</strong></a>
                </div>
                <span><em>${date.toDateString().split(' ', 4).join(' ')}</em></span> 
                <hr>  
            `
            modalBody.insertAdjacentHTML("beforeend", rateDiv)
          })
      });
  }



// **************** DISPLAY ALL USERS THAT HAVE VISITED A LOCATION ****************

function getAllVisitors(id){
  let addTo = document.querySelector(".showUsersFlagged")
  fetch(`/scenes/${id}/flag/users`, {method: "GET"})
  .then(response => response.json())
  .then(data => {
  
    addTo.innerHTML = ""
  data.scene.forEach(function(flag){
    
    let users = `
    <a href="../users/${flag._id}" class="travelers-item-block w-inline-block">
      <div class="travelers-prof-pic-container">
        <img src="${flag.avatar}" alt="" class="traveler-prof-pic">
      </div>
      <div class="travelers-info-block">
        <h1 class="traveler-name">${flag.username}</h1>
        <h1 class="traveler-place">${flag.location.country}</h1>
      </div>
    </a>
  `
    addTo.insertAdjacentHTML('afterbegin', users);
  })
       
    });
}



  var box = $(".feature-img-container"), x;
  $(".arrow").click(function() {
    if ($(this).hasClass("arrow-right")) {
      x = ((box.width() / 2)) + box.scrollLeft();
      box.animate({
        scrollLeft: x,
      })
    } else {
      x = ((box.width() / 2)) - box.scrollLeft();
      box.animate({
        scrollLeft: -x,
      })
    }
  })


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
    let domModal = document.querySelector("#seeAllCommentsModal")
    if(domModal) domModal.remove()
    let modal = `
      <div class="modal " id="seeAllCommentsModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
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

