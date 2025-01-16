$(document).ready(function() {
  console.log("Document is ready");

  bindProjectNavArrows();
  fadePageIn();

  // Sticky header logic
  let lastScrollTop = 0;         // Tracks the previous scroll position
  const scrollThreshold = window.innerHeight * 0.032;   // Number of pixels before the header becomes fixed
  const fadeDuration = 7;
  let ticking = false;

  $(window).on('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  function handleScroll() {
    const currentScroll = $(window).scrollTop();

    // Check if the user has scrolled at least scrollThreshold pixels
    if (currentScroll >= scrollThreshold) {
      // Make header sticky
      $('.site-header').addClass('sticky');
      $('.nav-placeholder').show();

      // If user scrolls down quickly (for example, more than 5px at once),
      // add a quick fade to smooth the transition.
      if (currentScroll - lastScrollTop > 5) {
        $('.site-header').addClass('fading');
        $('.nav-placeholder').show(); // Show the placeholder

        // Remove the fading class after the fade duration
        setTimeout(function() {
          $('.site-header').removeClass('fading');
        }, fadeDuration);
      }

      // Add shrink class to make the navigation bar smaller
      $('.site-header').addClass('shrink');
      
    } else {
      // If back up near the top, remove sticky + any fade
      $('.site-header').removeClass('sticky fading');
      $('.nav-placeholder').hide();
      // Remove shrink class to restore the navigation bar size
      $('.site-header').removeClass('shrink');
    }

    // Update last scroll position
    lastScrollTop = currentScroll;
  }
});

function bindProjectNavArrows() {
  console.log("Binding project nav arrows");
  $(".next-project, .prev-project").click(function(evt) {
    evt.preventDefault();
    fadePageOut($(this).attr('href'));
  });
}

function fadePageOut(targetHref) {
  console.log("Fading page out to:", targetHref);
  $("#main").fadeOut(200, function() {
    $("#main").load(targetHref + " #container #main", function(response, status, xhr) {
      if (status === "error") {
        console.error("Failed to load page:", xhr.status, xhr.statusText);
        $("#main").fadeIn(200);
        return;
      }
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

function fadePageIn() {
  console.log("Fading page in");
  $("body").fadeIn(200);
}