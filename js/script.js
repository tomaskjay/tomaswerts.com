$(document).ready(function() {
  console.log("Document is ready");

  initializeMasonryPosts();
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
    var $header = $('.site-header');
    var $placeholder = $('.nav-placeholder');

    // Check if the user has scrolled at least scrollThreshold pixels
    if (currentScroll >= scrollThreshold) {
      // Make header sticky
      $header.addClass('sticky');
      $placeholder
        .height($header.outerHeight())
        .show();

      // If user scrolls down quickly (for example, more than 5px at once),
      // add a quick fade to smooth the transition.
      if (currentScroll - lastScrollTop > 5) {
        $header.addClass('fading');
        $placeholder
          .height($header.outerHeight())
          .show();

        // Remove the fading class after the fade duration
        setTimeout(function() {
          $header.removeClass('fading');
        }, fadeDuration);
      }

      // Add shrink class to make the navigation bar smaller
      $header.addClass('shrink');
      $placeholder.height($header.outerHeight());
      
    } else {
      // If back up near the top, remove sticky + any fade
      $header.removeClass('sticky fading');
      $placeholder
        .height(0)
        .hide();
      // Remove shrink class to restore the navigation bar size
      $header.removeClass('shrink');
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
      initializeMasonryPosts();
      $("#main").fadeIn(200);
      bindPasswordDetect();
    });
  });
}

function fadePageIn() {
  console.log("Fading page in");
  $("body").fadeIn(200);
}

function initializeMasonryPosts() {
  var $grid = $(".posts-grid");
  if (!$grid.length) {
    return;
  }

  var $items = $grid.find(".post-item");
  if (!$items.length) {
    return;
  }

  function getColumnCount() {
    if (window.matchMedia("(max-width: 650px)").matches) {
      return 1;
    }
    if (window.matchMedia("(max-width: 1000px)").matches) {
      return 2;
    }
    return 3;
  }

  function parsePxValue(value, fallback) {
    var parsed = parseFloat(value);
    if (Number.isNaN(parsed)) {
      return fallback;
    }
    return parsed;
  }

  function layoutMasonry() {
    var columnCount = getColumnCount();
    var gridWidth = $grid.innerWidth();
    var gap = parsePxValue(getComputedStyle($grid[0]).gap, 20);
    var totalGaps = gap * (columnCount - 1);
    var cardWidth = (gridWidth - totalGaps) / columnCount;
    var columnHeights = new Array(columnCount).fill(0);

    $grid.addClass("masonry-enhanced");
    $items.each(function() {
      $(this).css("width", cardWidth + "px");
    });

    $items.each(function() {
      var minColumnHeight = Math.min.apply(Math, columnHeights);
      var columnIndex = columnHeights.indexOf(minColumnHeight);
      var top = minColumnHeight;
      var left = (cardWidth + gap) * columnIndex;
      var itemHeight = $(this).outerHeight();

      $(this).css({
        left: left + "px",
        top: top + "px"
      });

      columnHeights[columnIndex] = top + itemHeight + gap;
    });

    var finalHeight = Math.max.apply(Math, columnHeights) - gap;
    $grid.css("height", Math.max(finalHeight, 0) + "px");
  }

  var debouncedLayout = (function() {
    var timeoutId;
    return function() {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(layoutMasonry, 50);
    };
  })();

  $(window).off("resize.postsMasonry").on("resize.postsMasonry", debouncedLayout);

  var $images = $grid.find("img");
  if (!$images.length) {
    layoutMasonry();
    return;
  }

  var loadedCount = 0;
  $images.each(function() {
    if (this.complete) {
      loadedCount += 1;
      return;
    }

    $(this).one("load error", function() {
      loadedCount += 1;
      if (loadedCount >= $images.length) {
        layoutMasonry();
      }
    });
  });

  if (loadedCount >= $images.length) {
    layoutMasonry();
  }
}