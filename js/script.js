$(document).ready(function(){
  console.log("Document is ready");

  bindProjectNavArrows();
  fadePageIn();

  // Sticky header logic
  let lastScrollTop = 0;         // Tracks the previous scroll position
  const scrollThreshold = 40;   // Number of pixels before the header becomes fixed
  const fadeDuration = 7;
  
  
  $(window).on('scroll', function() {
    const currentScroll = $(this).scrollTop();
    console.log("Current scroll position:", currentScroll);

    // Check if the user has scrolled at least scrollThreshold pixels
    if (currentScroll >= scrollThreshold) {
      // Make header sticky
      $('.site-header').addClass('sticky');
      console.log("Header is sticky");

      // If user scrolls down quickly (for example, more than 5px at once),
      // add a quick fade to smooth the transition.
      if (currentScroll - lastScrollTop > 5) {
        $('.site-header').addClass('fading');
        console.log("Header is fading");

        // Remove the fading class after the fade duration
        setTimeout(function() {
          $('.site-header').removeClass('fading');
          console.log("Header fade removed");
        }, fadeDuration);
      }

      // Add shrink class to make the navigation bar smaller
      $('.site-header').addClass('shrink');
      console.log("Header is shrinking");
      
    } else {
      // If back up near the top, remove sticky + any fade
      $('.site-header').removeClass('sticky fading');
      console.log("Header is not sticky or fading");

      // Remove shrink class to restore the navigation bar size
      $('.site-header').removeClass('shrink');
      console.log("Header is not shrinking");
    }

    // Update last scroll position
    lastScrollTop = currentScroll;
  });
});

function bindProjectNavArrows(){
  console.log("Binding project nav arrows");
  $(".next-project, .prev-project").click(function(evt){
    evt.preventDefault();
    fadePageOut($(this).attr('href'));
  });
}

function fadePageOut(targetHref){
  console.log("Fading page out to:", targetHref);
  $("#main").fadeOut(200, function(){
    $("#main").load(targetHref + " #container #main", function(response, status, xhr){
      bindProjectNavArrows();
      var stateObj = {
        html: $("#main").html()
      };
      document.title = $(response).filter("title").text();
      window.history.pushState(stateObj, document.title, targetHref);
      $("#main").fadeIn(200);
      bindPasswordDetect();
    });
  });
}

function fadePageIn(){
  console.log("Fading page in");
  $("body").fadeIn(200);
}