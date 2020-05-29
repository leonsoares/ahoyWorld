<!DOCTYPE html>

<html>

<head>
    <title>ahoy World</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous"></link>
    <link rel="stylesheet" href="/stylesheets/main.css"></link>

</head>


<body>
<nav class="navbar navbar-expand-lg navbar-light bg-light ">
    <div class="container-fluid">
            <a class="navbar-brand " href="/">Ahoy World</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
        <div class="collapse navbar-collapse justify-content-end id="navbarNav">
            <ul class="navbar-nav ">
            <% if(!currentUser){ %>
                <li class="nav-item active">
                    <a class="nav-link" href="/login">Login <span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/register">Sign up</a>
                </li>
            <% } else { %>
                <li class="nav-item">
                    logged in as:
                </li>

                <li class="nav-item">                
                    <a class="nav-link" href="/users/<%= currentUser._id%>"> <%= currentUser.username%></a>
                </li>

                <li class="nav-item">
                    <a class="nav-link" href="/logout">logout</a>
                </li>
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

