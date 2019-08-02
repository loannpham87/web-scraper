// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});

// When you click the savenote button
$(document).on("click", ".save", function(event) {
  event.preventDefault();
  console.log("click!");
  // Grab the id associated with the article from the submit button
  var id = $(this).attr("data-id");
  // console.log(thisId);

  // Run a PUT request to save articles
  $.ajax({
    method: "PUT",
    url: "/api/articles/" + id,
    data: {
      saved: true
    }
  })
    // With that done
    .then(function(err, data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
      location.reload();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});


$(document).on("click", ".deleteArticle", function(event) {
  event.preventDefault();

    console.log("delete!");
  // Grab the id associated with the article from the submit button
  var id = $(this).attr("data-id");
  // console.log(thisId);

  // Run a PUT request to delete the article
  $.ajax({
    method: "PUT",
    url: "/api/articles/" + id,
  })
    // With that done
    .then(function(err, data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
      location.reload();
    });
})




