<div class="modal fade" id="addNewScene" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">New message</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
      <form  action="/scenes" method="POST" enctype="multipart/form-data">
          <br>

          <div class="form-group">
              <h6> Pick a tag that best describes your scene:</h6>
              <div class="form-check form-check-inline">
                  <input type="radio" class="form-check-input" name="searchTach"  value="beach" id="beach"/><label class="form-check-label" for="beach">beach</label> 
              </div>
              
              <div class="form-check form-check-inline">
                  <input type="radio" class="form-check-input" name="searchTach"  value="waterfall" id="waterfall"/><label for="waterfall">waterfall</label> 
              </div>

              <div class="form-check form-check-inline">
                  <input type="radio" class="form-check-input" name="searchTach"  value="forest" id="forest"/><label for="forest">forest</label> 
              </div>

              <div class="form-check form-check-inline">
                  <input type="radio" class="form-check-input" name="searchTach"  value="island" id="island"/><label for="island">island</label>
              </div>

              <div class="form-check form-check-inline">
                  <input type="radio" class="form-check-input" name="searchTach"  value="city" id="city"/><label for="city">city</label> 
              </div> 

              <div class="form-check form-check-inline">
                  <input type="radio" class="form-check-input" name="searchTach"  value="lake" id="lake"/><label for="lake">lake</label> 
              </div>
          </div>
              
              
          <div class="form-group">
              <label for="title">Scene Title</label>
              <input type="text" id="title" class="form-control" value="" maxlength="40" name="title">
          </div>

              
              
              <div class="form-group">
                  <label for="country">Scene Location:</label>
                  <select name="country" class="form-control countries order-alpha" id="countryId">
                      <option value="">Select Country:</option>
                  </select>
                  <select name="state" class="form-control states order-alpha" id="stateId">
                      <option value="">Select State:</option>
                  </select>
                  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script> 
                  <script src="//geodata.solutions/includes/countrystate.js"></script>
              </div>

              <br>
              <div class="form-group">
                  <label for="exampleFormControlTextarea1">Scene Description</label>
                  <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
              </div>
              

              <div class="form-group">
                  <label for="image">Image</label>
                  <input type="url" name="image1" placeholder="url"  class="form-control" placeholder="" id="image">
              </div>

          </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Send message</button>
      </div>
    </div>
  </div>
</div>