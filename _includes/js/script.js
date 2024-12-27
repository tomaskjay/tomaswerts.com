console.log("Document ready!");

$(document).ready(function(){
  
  console.log("Document ready!");

  bindProjectNavArrows();
  fadePageIn();

  // Sticky header logic
  let lastScrollTop = 0;         // Tracks the previous scroll position
  const scrollThreshold = 10;    // Number of pixels before the header becomes fixed
  
  $(window).on('scroll', function() {
    const currentScroll = $(this).scrollTop();

    // Check if the user has scrolled at least scrollThreshold pixels
    if (currentScroll >= scrollThreshold) {
      // Make header sticky
      $('.site-header').addClass('sticky');
      
      // If user scrolls down quickly (for example, more than 5px at once),
      // add a quick fade to smooth the transition.
      if (currentScroll - lastScrollTop > 5) {
        $('.site-header').addClass('fading');
      }
      
    } else {
      // If back up near the top, remove sticky + any fade
      $('.site-header').removeClass('sticky fading');
    }

    // If scrolling up, remove the fading class
    if (currentScroll < lastScrollTop) {
      $('.site-header').removeClass('fading');
    }

    // Update last scroll position
    lastScrollTop = currentScroll;
  });
}); 

function bindProjectNavArrows(){
  $(".next-project, .prev-project").click(function(evt){
    evt.preventDefault();
    fadePageOut($(this).attr('href'));
  });
}

function fadePageOut(targetHref){
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
  $("body").fadeIn(200);
}
