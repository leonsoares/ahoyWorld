<!DOCTYPE html>

<head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous"></link>
        <link rel="stylesheet" href="/stylesheets/landing.css"></link>
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css"></link>
        <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Ubuntu:wght@500&display=swap" rel="stylesheet">
        <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
    
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css">
  
  
  <meta content="width=device-width, initial-scale=1" name="viewport">
  
  <title>Ahoy World</title>
</head>
<body>
    <div class="container-fluid menubar">
        <nav class="navbar navbar-expand-lg navbar-light  sticky-top menubar">
    
        <a class="navbar-brand " href="/" >
        <img src="/images/Ahoy-world-logo-2.png" width="111"  alt="" loading="lazy"></img>
        </a>

        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul class="navbar-nav ">
                <li class="nav-item active mid-btn">
                    <a class="nav-link"  data-toggle="modal" data-target="#staticBackdrop" href="#">Sign in </a>
                </li>
            </ul>
        </div>
        
        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                
            <ul class="navbar-nav ">
                    
            <% if(!currentUser){ %>
                
                <li class="nav-item active">
                    <a class="nav-link"  data-toggle="modal" data-target="#staticBackdrop" href="#">Sign in </a>
                </li>
                <li class="nav-item active"></li>
                    <a class="nav-link dark-btn" id="dark-btn" data-toggle="modal" data-target="#staticBackdrop1" href="#">Become a AhoyTraveler </a>
                </li>
                <% } else { %>

                <div class="dropdown"  id="markRead">
                            
                    <button  class="btn btn-secondary dropdown-toggle"  type="submit" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i  class="far fa-envelope" data-toggle="tooltip" data-placement="top" title="Notifications"></i> <span class="badge" id="demo"> <%= notifications.length %></span>
                    </button>
                            
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                    <li>
                            <a class="dropdown-item" href="/notifications">See passed Notifications</a>
                    </li>
                            <% notifications.forEach(function(notification) { %>
                            <li>                                     
                                <a class="dropdown-item" href="<%=notification.goTo%>">
                                    <%= `${notification.username} - ${notification.message}` %>
                                </a>
                            </li>
                        <% })%>
                    </ul>
                </div>
                
                

        
                
                <div class="dropdown ">
                    
                        <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <%= currentUser.username%></a>
                        
                        <img src="<%=currentUser.avatar%>" class="card-img-top avatar " alt="..."></img>
                         

                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                        <li>
                            <a class="dropdown-item" href="/users/<%= currentUser._id%>">Account</a>
                        </li>
                            
                        <li>                                     
                            <a class="dropdown-item" href="/logout">
                            Log out
                            </a>
                        </li>
                    </ul>
                </div>            
            <% } %>
            </ul>
        </div>
    </nav>
</div>


<%- include("models.js") %>

<script>
    window.addEventListener('scroll',function(e) {
        var Wlocation = window.pageYOffset
        if(Wlocation > 20){
        document.querySelector('.container-fluid').style.backgroundColor = "white"
        } else if(Wlocation < 20){
        document.querySelector('.container-fluid').style.backgroundColor = "rgba(0, 0, 0, 0)"
        }
    });
</script>

