function showDeleteModal(sceneId, deleteFrom){
    displayModalDelete(sceneId)
}


function displayModalDelete(sceneId){
    let modalDelete = `
        <div class="modal" id="deleteSceneModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header table-dark">
            <h5 class="modal-title" id="exampleModalLabel">Are you sure that you want to delete 
                <br> this post?</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>
            <div class="modal-footer table-dark">
                <input  onclick="deleteModal('${sceneId}')" type="submit" class="btn btn-xs btn-danger deleteLocation" value="Yes">
                <button onclick="destroyModal()" type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
            </div>
            
        </div>
        </div>
    </div>
    `
    document.querySelector("body").insertAdjacentHTML("beforeend", modalDelete)
    $("#deleteSceneModal").modal('show');

}


function destroyModal(){
    $("#deleteSceneModal").modal('hide');
    $("#deleteSceneModal").remove()
}


function deleteModal(sceneId){
    fetch(`/scene/deleteScene/${sceneId}/delete`, {method: "POST",})
    .then(response => response.json())
    .then(data => {
        document.getElementById(sceneId).remove()
        destroyModal()
    })
}