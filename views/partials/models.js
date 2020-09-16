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