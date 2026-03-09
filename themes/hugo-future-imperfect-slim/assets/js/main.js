// Flyout Menu Functions
var toggles = {
  ".search-toggle": "#search-input",
  ".lang-toggle": "#lang-menu",
  ".share-toggle": "#share-menu",
  ".nav-toggle": "#site-nav-menu"
};

$.each(toggles, function(toggle, menu) {
  $(toggle).on("click", function() {
    if ($(menu).hasClass("active")) {
      $(".menu").removeClass("active");
      $("#wrapper").removeClass("overlay");
    } else {
      $("#wrapper").addClass("overlay");
      $(".menu").not($(menu + ".menu")).removeClass("active");
      $(menu).addClass("active");
      if (menu == "#search-input") {$("#search-results").toggleClass("active");}
    }
  });
});

// Click anywhere outside a flyout to close
$(document).on("click", function(e) {
  if ($(e.target).is(".lang-toggle, .lang-toggle span, #lang-menu, .share-toggle, .share-toggle i, #share-menu, .search-toggle, .search-toggle i, #search-input, #search-results .mini-post, .nav-toggle, .nav-toggle i, #site-nav") === false) {
    $(".menu").removeClass("active");
    $("#wrapper").removeClass('overlay');
  }
});

// Check to see if the window is top if not then display button
$(window).scroll(function() {
  if ($(this).scrollTop()) {
    $('#back-to-top').fadeIn();
  } else {
    $('#back-to-top').fadeOut();
  }
});

// Click event to scroll to top
$('#back-to-top').click(function() {
  $('html, body').animate({scrollTop: 0}, 1000);
  return false;
});

// Search
var idx = null;         // Lunr index
var resultDetails = []; // Will hold the data for the search results (titles and summaries)
var $searchResults;     // The element on the page holding search results
var $searchInput;       // The search box element

window.onload = function () {
  // Get dom objects for the elements we'll be interacting with
  $searchResults = document.getElementById('search-results');
  $searchInput   = document.getElementById('search-input');

  // Search UI may be disabled on some pages/configs.
  if (!$searchResults || !$searchInput) {
    return;
  }

  var searchDebug =
    window.location.search.indexOf('debugSearch=1') > -1 ||
    window.localStorage.getItem('debugSearch') === '1';
  function logSearch() {
    if (searchDebug && window.console && window.console.log) {
      window.console.log.apply(window.console, arguments);
    }
  }

  var searchAttempts = [];
  function renderSearchError(reason) {
    var detail = '';
    if (searchAttempts.length > 0) {
      var last = searchAttempts[searchAttempts.length - 1];
      detail = ' Last attempt: ' + last.path + ' (' + last.status + ').';
    }
    $searchResults.innerHTML = '<article class="mini-post"><main><p>Error loading search results.' +
      reason + detail + '</p></main></a></article>';
    logSearch('[search] failed', reason, 'attempts', searchAttempts);
  }

  var lang = (document.documentElement.lang || '').toLowerCase();
  var langCode = lang.split('-')[0];
  var pathLangMatch = (window.location.pathname || '').match(/^\/([a-z]{2})(\/|$)/i);
  var pathLang = pathLangMatch ? pathLangMatch[1].toLowerCase() : '';

  var candidatePaths = [];
  if (pathLang) candidatePaths.push('/' + pathLang + '/index.json');
  if (langCode) candidatePaths.push('/' + langCode + '/index.json');
  candidatePaths.push('/index.json');

  // Remove duplicates while preserving order.
  candidatePaths = candidatePaths.filter(function (path, index, arr) {
    return arr.indexOf(path) === index;
  });

  function buildIndex(documents) {
    if (typeof lunr !== 'function') {
      throw new Error('Lunr is not available');
    }
    idx = lunr(function () {
      this.ref('ref');
      this.field('title');
      this.field('data');
      this.field('description');
      this.field('body');

      documents.forEach(function(doc) {
        if (!doc || !doc.ref) {
          return;
        }
        this.add(doc);
        resultDetails[doc.ref] = {
          'title': doc.title,
          'date': doc.date,
          'description': doc.description,
        };
      }, this);
    });
  }

  function tryLoadIndex(pathIndex) {
    if (pathIndex >= candidatePaths.length) {
      renderSearchError(' Tried ' + candidatePaths.length + ' index path(s).');
      return;
    }

    var path = candidatePaths[pathIndex];
    var request = new XMLHttpRequest();
    request.open('GET', path, true);
    request.onload = function() {
      logSearch('[search] index request', path, 'status', request.status);
      searchAttempts.push({ path: path, status: request.status });
      if (request.status >= 200 && request.status < 400) {
        try {
          var documents = JSON.parse(request.responseText);
          buildIndex(documents);
          logSearch('[search] index loaded from', path, 'documents', documents.length);
        } catch (e) {
          logSearch('[search] invalid index payload at', path, e);
          tryLoadIndex(pathIndex + 1);
        }
      } else {
        tryLoadIndex(pathIndex + 1);
      }
    };
    request.onerror = function() {
      logSearch('[search] request failed for', path);
      searchAttempts.push({ path: path, status: 'network-error' });
      tryLoadIndex(pathIndex + 1);
    };
    request.send();
  }

  tryLoadIndex(0);

  // Register handler for the search input field
  registerSearchHandler();
};

function registerSearchHandler() {
  $searchInput.oninput = function(event) {
    var query = event.target.value;
    var results = search(query);  // Perform the search

    // Render search results
    renderSearchResults(results);

    // Remove search results if the user empties the search phrase input field
    if ($searchInput.value == '') {
      $searchResults.innerHTML = '';
    }
  }
}

function renderSearchResults(results) {
  // Create a list of results
  var container = document.createElement('div');
  if (results.length > 0) {
    results.forEach(function(result) {
      // Create result item
      container.innerHTML += '<article class="mini-post"><a href="' + result.ref + '"><header><h2>' + resultDetails[result.ref].title + '</h2><time class="published" datetime="">' + resultDetails[result.ref].date + '</time></header><main><p>' + resultDetails[result.ref].description + '</p></main></a></article>';
    });

    // Remove any existing content so results aren't continually added as the user types
    while ($searchResults.hasChildNodes()) {
      $searchResults.removeChild(
        $searchResults.lastChild
      );
    }
  } else {
    $searchResults.innerHTML = '<article class="mini-post"><main><p>No Results Found...</p></main></a></article>';
  }

  // Render the list
  $searchResults.innerHTML = container.innerHTML;
}

function search(query) {
  if (!idx) {
    return [];
  }
  return idx.search(query);
}
