var myAPI = '64f14bfc62f718d2cf962fe150e5bc40' 
var suggestions = [];
var Title = ""

$(document).ready(function() {
    
    $.getJSON('Malayalam_data/new_json.json', function(data) {
      $.each(data.data, function(index, val){
        suggestions.push(val.Title);
      });
    });
  });
  
  
  // Function to display the movie details
  function displaymovie(movie) {
    if (movie.Title) {
      
      const container = document.getElementById("poster");
      container.height = 400;
      container.width = 280;

      document.getElementById("poster").src = movie.Poster_url;
      document.getElementById("output").textContent = movie.Title;
      
      document.getElementById("genre").textContent = "GENRE : " + movie.Genres;
      document.getElementById("plot").textContent = "PLOT : "+movie.overview;
      document.getElementById("director").textContent = "DIRECTOR : "+movie.Directors;
      document.getElementById("actors").textContent = "TOP CAST : "+movie.cast;
      document.getElementById("year").textContent = "RELEASE YEAR : " + movie.Year;
      
    } else {
      document.getElementById("poster").src = "";
      document.getElementById("output").textContent = "";
      document.getElementById("year").textContent = "";
      document.getElementById("genre").textContent = "";
      document.getElementById("director").textContent = "";
      document.getElementById("actors").textContent = "";
      document.getElementById("plot").textContent = "";
    }
  }

//   $('#movie-name').on('input', function() {
//     var userInput = $(this).val();
//     var movie = suggestions.find(movie => movie.Title.toLowerCase() === userInput.toLowerCase());
//     if (movie) {
//       displaymovie(movie);
//     } else {
//       displaymovie({});
//     }
//   });



$( "#movie-name" ).autocomplete({
  source: suggestions,
  appendTo: "#suggestion-box",
  response: function(event, ui) {
      // clear existing list items
      $("#suggestion-box ul").empty();
      // add new list items
      $.each(ui.content, function() {
          $("#suggestion-box ul").append('<li><a href="#">' + this.label + '</a></li>');
      });
  },
  focus: function(event, ui) {
      $("#movie-name").val(ui.item.label);
      return false;
  },
  select: function(event, ui) {
      $("#movie-name").val(ui.item.label);
      return false;
  }
}).data("ui-autocomplete")._renderItem = function(ul, item) {
  return $("<li>")
      .append("<a>" + item.label + "</a>")
      .appendTo(ul);
};

if ($("#suggestion-box").length == 0) {
  $("body").append('<div id="suggestion-box"><ul></ul></div>');
}


$("#suggestion-box").on("click", "li a", function(event) {
  event.preventDefault();
  $("#movie-name").val($(this).text());
  $(this).closest("ul").empty();
});






  $('#submit-button').on('click', function() {
    var searchTerm = $('#movie-name').val().toLowerCase();

    // var url = "templates/recommend.html?movie=" + encodeURIComponent(searchTerm);

    // Redirect the browser to recommend.html with the query parameter
    // window.location.href = url;
      
    $.getJSON("Malayalam_data/new_json.json", function(data) {
      var movieFound = false;
      var movieDetails = "";

      
      $.each(data.data, function(index, item) {
        var title = item.Title.toLowerCase(); // Title in lowercase for comparison

        
          if (title === searchTerm) {
              displaymovie(item);
              get_recommendation(item);
              movieFound = true;
              return; 
          }
      });

      
      $("#current-movie").html(movieFound ? movieDetails : "Movie not found.");
    });
  });

  function get_recommendations(movie_title) {
    rec_movies = [];
    
    // $.ajax({
    //   type: 'GET',
    //   url: "https://api.themoviedb.org/3/search/movie?api_key="+my_api_key+"&query="+movie_title, 
    //   success: function(movie){

    //   }
    // })


    $.ajax({
      type:'POST',
      url:"/similarity",
      data:{'name':movie_title},
      success: function(recs){
        if(recs=="Sorry! The movie you requested is not in our database. Please check the spelling or try with some other movies"){
          $('.fail').css('display','block');
          $('.results').css('display','none');
          $("#loader").delay(500).fadeOut();
        }
        else {
          $('.fail').css('display','none');
          $('.results').css('display','block');
          var movie_arr = recs.split('---');
          var arr = [];
          for(const movie in movie_arr){
            arr.push(movie_arr[movie]);
            rec_movies.push(movie_arr[movie]);
          }
          rec_posters = get_movie_posters(rec_movies);
          get_movie_details(movie_id,my_api_key,arr,movie_title);
        }
      },
      error: function(){
        alert("error recs");
        $("#loader").delay(500).fadeOut();
      },
    }); 
    return {rec_movies:rec_movies, rec_posters:rec_posters};
  }