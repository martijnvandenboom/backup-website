/*
  This js file is for individual users to modify the scripts for their personal site,
  or for the implementation of features specifically for their site. Anything that
  is an official part of the theme (ex. Pull Requests) should be included in main.js
  and follow the formatting and style given.
*/

(function () {
  var hashMapEl = document.getElementById("service-hash-map");
  if (hashMapEl && window.location.hash) {
    var key = window.location.hash.replace(/^#/, "");
    var spans = hashMapEl.querySelectorAll("[data-hash]");
    for (var i = 0; i < spans.length; i++) {
      if (spans[i].getAttribute("data-hash") === key && spans[i].getAttribute("data-url")) {
        window.location.replace(spans[i].getAttribute("data-url"));
        return;
      }
    }
  }

  var form = document.getElementById("contact");
  if (!form) {
    return;
  }

  var params = new URLSearchParams(window.location.search);
  var subject = params.get("subject");
  var service = params.get("service");
  var subjectInput = form.querySelector('input[name="_subject"]');

  if (subject && subjectInput && !subjectInput.value) {
    subjectInput.value = subject;
  }

  if (service === "familielfilm") {
    var hint = document.getElementById("contact-form-hint");
    if (hint) {
      hint.hidden = false;
    }
  }
})();
