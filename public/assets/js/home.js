$(document).ready(function() {
	
	// Responsive hamburger menu
	$(".navbar-burger").on("click", function() {
		$(".navbar-burger").toggleClass("is-active");
		$(".dropdown").toggle();
		$(".dropdown").toggleClass("is-open");
	});

	// Grab the articles as a json when page loads, append to the page
	$.getJSON("/all", function(data) {
	  // For each one
	  for (var i = 0; i < data.length; i++) {
	    // Display the information on the page
	    $("#scrape-results").prepend("<div class='result-div'><img class='result-pic' src='" + data[i].imageURL + "'><div class='result-text'><div class='article-title'>" +data[i].title + "</div><br><div class='artcle-description'>" + data[i].description +
	    	"</div></div><button class='pin-article button is-success is-medium' data-id='" + data[i]._id + "'><span class='icon'><i class='fa fa-map-pin'></i></span>Pin Article</button></div></div><br>");
	  }
	});

	// Save article button changes the saved property of the article model from false to true
	$(document).on("click", ".pin-article", function() {
		// change icon to check mark
		$(this).children("span.icon").children("i.fa-map-pin").removeClass("fa-map-pin").addClass("fa-check-circle");
		// Get article id
		var articleID = $(this).attr("data-id");
		console.log(articleID);
		// Run a POST request to update the article to be saved
	  $.ajax({
	    method: "POST",
	    url: "/pinned/" + articleID,
	    data: {
	      saved: true
	    }
	  }).done(function(data) {
      // Log the response
      console.log("data: ", data);
		});
	});


});