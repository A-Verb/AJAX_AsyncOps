//API URL endpoint 
let url  = "http://localhost:8080/api/";
let movies = [];

// Process AJAX call
function processAJAX(type='GET',id='',data=null) {
   
       //create AJAX call
       if(type == 'GET' || type == 'DELETE') {
          data = null;
       } else {
          data = JSON.stringify(data);
       }

       
       let ajaxType = $("#ajax-type input:checked").val();

       if (ajaxType == 'ajax'){
         var xhr = new XMLHttpRequest();
         xhr.open(type, url + id, true);
         xhr.setRequestHeader('Content-type', 'application/json', 'char-set=utf-8');
         xhr.send(data);
         xhr.onreadystatechange = () => {
            if(xhr.readyState == 4 && xhr.status == 200) {
               //convert data to JS object
               movies = JSON.parse(xhr.responseText);
               processResult(movies,type);
            };
         };
         xhr.error = () => {
            $("#result").html("Error! Could not retrieve data.");
         }
       }else {
          //jquery
          
          $.ajax({
             method: type,
             url: url + id,
             data: data,
             async: true,
          }).done((data)=>{
            movies = data;
               processResult(movies, type);
          }).fail((data)=>{
            $("#result").html("Error! Could not retrieve data.");
          })
       }
      
};

$().ready(() => {

   // GET button 
   $("#btn-get").click(() =>{
      $("#ajax-form").show();
      $("#result").hide();
      $("#ajax-form").html(getDeleteForm('get') )
      $("#go-get-delete").click(() =>{
         //get id from form 
         let id = $("#form-get-delete #id").val();
         processAJAX('GET',id,'');
      });
   });

   // DELETE button 
   $("#btn-delete").click(() =>{
      $("#ajax-form").show();
      $("#result").hide();
      $("#ajax-form").html(getDeleteForm('delete') )
      $("#go-get-delete").click(() =>{
         //get id from form 
         let id = $("#form-get-delete #id").val();
         processAJAX('DELETE',id,'');

      });
   })
   // POST button 
   $("#btn-post").click(() =>{
      $("#ajax-form").show();
      $("#result").hide();
      $("#ajax-form").html(postPutForm('post') )
      $("#go-post").click( () => {
         let movie = buildMovieObject();
         processAJAX('POST','', movie);
      });
   });
   // PUT button 
   $("#btn-put").click(() =>{     
      $("#result").hide();
      processAJAX('GET');
   });
});



function getDeleteForm (type){
   message = "Get Movies";
   if(type =='delete'){
      message = "Delete Movies";
   };


   return(`
      <h1>${message}</h1>
      <form id="form-get-delete" onsubmit="return false">
      <div class="form-controls">
            <label for="id">ID:</label>
            <input name="id" id="id">
            <p>(Leave blank for all records)</p>
      </div>
      <div class="form-controls">
            <button id="go-get-delete">GO!</button>
      </div>
      </form>
      `
   );
}

function postPutForm(type){
   message = "Insert a New Movie";
   disabled = "";
   if(type=='put'){
      message="Update a Movie";
      disabled="disabled";
   }

   return(
      `
      <h1>${message}</h1>
      <form id="form-put-post" onsubmit="return-false">
      <div class="form-controls">
            <label for="id">ID:</label>
            <input name="id" id="id" ${disabled}>
         </div>
         <div class="form-controls">
            <label for="title">Title:</label>
            <input name="title" id="title">
      </div>
      <div class="form-controls">
            <label for="director">Director:</label>
            <input name="director" id="director">
      </div>
      <div class="form-controls">
            <label for="actor">Actor:</label>
            <input name="actor" id="actor">
      </div>
      <div class="form-controls">
            <label for="year">Year</label>
            <input name="year" id="year">
      </div>
      <div class="form-controls"></div>
            <button id="go-${type.toLowerCase()}">GO!</button>
      </form>

      `
   )
}



//Build Movie Table 

function movieTable(movies) {
   str = `
   <h1>Movies</h1>
      <table class="table-movies" cellpadding="0" cellspacing="0">
      <thead>
         <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Director</th>
            <th>Actor</th>
            <th>Year</th>
            <th>Actions</th>                
         </tr>
      </thead>
      <tbody>`;

         // Works for ARRAY only
   movies.forEach(movie => {
      str +=`
      <tr>
         <td>${movie.id}</td>
         <td>${movie.title}</td>
         <td>${movie.director}</td>
         <td>${movie.actor}</td>
         <td>${movie.year}</td>
         <td>
            <button onclick="prepareUpdate(${movie.id})">Edit</button>
            <button onclick="prepareDelete(${movie.id})">Delete</button>
         </td>
      </tr>   
      `
   });
        
   str += `</tbody></table>`;
   return str;
};


//Process Result
function processResult(movies, method) {
   $("#ajax-form").hide();
   $("#result").show();
   switch(method) {
      case 'GET':
         $("#result").html(movieTable(movies));
         break;
      case 'PUT':
         $("#result").html(movies);
         break;
      case 'POST':
         $("#result").html(movies);
         break;
      case 'DELETE':
         $("#result").html(movies);
         break;
   }
}

//Prepare Delete
function prepareDelete(id) {
   processAJAX('DELETE',id,'');
}

//Prepare Update
function prepareUpdate(id) {
   $("#ajax-form").html(postPutForm('put') )
   $("#ajax-form").show();
   $("#result").hide();

   let index = movies.findIndex(movie => movie.id==id);
   if(index != -1) {
      let movie = movies[index];

      //Prefill form 
      $("#form-put-post #id").val(movie.id);
      $("#form-put-post #title").val(movie.title);
      $("#form-put-post #director").val(movie.director);
      $("#form-put-post #actor").val(movie.actor);
      $("#form-put-post #year").val(movie.year);
   }
   $("#go-put").click( () => {
      let newMovie = buildMovieObject();
      processAJAX('PUT', newMovie.id, newMovie);

   });
};

//build movie object

function buildMovieObject() {
   return{
         "id":$("#form-put-post #id").val(),
         "title":$("#form-put-post #title").val(),
         "director":$("#form-put-post #director").val(),
         "actor":$("#form-put-post #actor").val(),
         "year":$("#form-put-post #year").val(),
      };
};
