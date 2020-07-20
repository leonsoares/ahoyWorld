<!DOCTYPE html>

<html>

<head>
    <title>ahoy World</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous"></link>
    <link rel="stylesheet" href="/stylesheets/main.css"></link>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css"></link>
    
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>

<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css">
</head>


<body>
<nav class="navbar navbar-expand-lg navbar-light bg-light sticky-top">
    <div class="container-fluid">
        <a class="navbar-brand" href="/" >
        <img src="/images/Ahoy-world-logo-2.png" width="111"  alt="" loading="lazy"></img>
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul class="navbar-nav ">
            <% if(!currentUser){ %>
                <li class="nav-item active">
                    <a class="nav-link" data-toggle="modal" data-target="#staticBackdrop" href="#">Log in <span class="sr-only">(current)</span></a>
                </li>

                <a class="nav-link" data-toggle="modal" data-target="#staticBackdrop1" href="#">Sign up <span class="sr-only">(current)</span></a>
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
                
                

      
                
                <div class="dropdown">
                    <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <%= currentUser.username%> <span class="badge"> </span>
                    <img src="<%=currentUser.avatar%>" class="card-img-top avatar" alt="..."></img>
                    </a>

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
    </div>
</nav>

    <% if(error && error.length > 0){ %> 
        <div class=" alert alert-danger" role="alert">
        <%= error %>
        </div>
    <%}%>

    <% if(success && success.length > 0){ %> 
        <div class=" alert alert-seccess" role="alert">
        <%= success %>
        </div> 
    <% } %>




<!-- Log In Modal -->
<div class="modal fade" id="staticBackdrop" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-size">
 
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="staticBackdropLabel">Log in</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      
      <div class="modal-body">
      <form action="/login" method="POST">
       <% if(error && error.length > 0){ %> 
            <p><%= error %></p>
        <%}%>
        <div class="form-group row">
        <label for="inputEmail3" class="col-sm-2 field">Username:</label>
        <div class="col-sm-10">
            <input type="text" name="username" class="form-control" placeholder="username">
        </div>
        </div>
        <div class="form-group row">
        <label for="inputPassword3" class="col-sm-2 col-form-label">Password:</label>
        <div class="col-sm-10">
            <input type="password" name="password" class="form-control" id="inputPassword3" placeholder="password">
        </div>
        </div>
        
            <button type="submit" class="btn btn-primary">Log in</button>
            
    </form>
      </div>
        <div class="modal-footer"></div>
            <p class="model-js">Don’t have an account? <a href="/register">Sign up</a></p>
            <p class="model-js">Forgot password? <a href="/forgot">Reset password</a></p>
        </div>
    </div>
  </div>
</div>

<!-- Sign up Model -->
<div class="modal fade" id="staticBackdrop1" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-size">
 
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="staticBackdropLabel">Sign up</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      
      <div class="modal-body">
      <form action="/register" method="POST">
        <div class="form-group row">
            <label for="email" class="col-sm-2 col-form-label">Email:</label>
            <div class="col-sm-10">
                <input type="email" name="email" class="form-control" placeholder="Email">
            </div>
        </div>

        <div class="form-group row">
        <label for="UserName" class="col-sm-2 col-form-label">User Name:</label>
        <div class="col-sm-10">
            <input type="text" name="username" class="form-control" placeholder="Username">
        </div>
        </div>
        <div class="form-group row">
        <label for="inputPassword" class="col-sm-2 col-form-label">Password:</label>
        <div class="col-sm-10">
            <input type="password" name="password" class="form-control" id="inputPassword3" placeholder="password">
        </div>
        </div>
        
        
        <div class="form-group row">
        <div class="col-sm-10">
            <button type="submit" class="btn btn-primary">Sign Up</button>
        </div>
        </div>
    </form>
      </div>
      
        <div class="modal-footer"></div>
            <p class="model-js" data-toggle="modal" data-target="#staticBackdrop">Already have an account? <a href="/login">Log in</a></p>
        </div>
      
      
    </div>
  </div>
</div>

