



</body>



<footer>
<h4>@2020</h4>
</footer>
<script >
    
    document.getElementById("markRead").addEventListener("click", function(){
        fetch('/clicked', {method: 'GET'})
          .then(function() {
            document.getElementById("demo").innerHTML = 0
          })
          
});
  
    
</script>
</html>