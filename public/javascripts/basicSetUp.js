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


