(function () {
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on('init', function (user) {
      if (!user) {
        window.netlifyIdentity.on('login', function () {
          document.location.href = '/admin/';
        });
      }
    });
  }

  var featuredImages = document.querySelectorAll('a.image[data-bg-image]');
  featuredImages.forEach(function (el) {
    var src = el.getAttribute('data-bg-image');
    if (src) {
      el.style.setProperty('--bg-image', "url('" + src + "')");
    }
  });

  var themeSwitch = document.getElementById('theme-switch');
  var themeOptions = document.querySelectorAll('.theme-option');
  var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  var THEME_PREF_KEY = 'themePreference';

  function getSavedThemePreference() {
    var value = localStorage.getItem(THEME_PREF_KEY);
    if (value === 'dark' || value === 'light' || value === 'system') {
      return value;
    }
    if (localStorage.getItem('darkmode') === 'active') {
      return 'dark';
    }
    return 'system';
  }

  function isDarkThemeActive(preference) {
    if (preference === 'dark') return true;
    if (preference === 'light') return false;
    return mediaQuery.matches;
  }

  function applyThemePreference(preference) {
    var enableDark = isDarkThemeActive(preference);
    document.body.classList.toggle('darkmode', enableDark);

    document.body.classList.remove('theme-pref-system', 'theme-pref-dark', 'theme-pref-light');
    document.body.classList.add('theme-pref-' + preference);

    localStorage.setItem(THEME_PREF_KEY, preference);
    localStorage.removeItem('darkmode');

    if (themeSwitch) {
      var titleMap = {
        system: 'Theme: System',
        dark: 'Theme: Dark',
        light: 'Theme: Light'
      };
      themeSwitch.setAttribute('title', titleMap[preference]);
      themeSwitch.setAttribute('aria-label', titleMap[preference]);
    }

    themeOptions.forEach(function (option) {
      option.classList.toggle('theme-option-active', option.getAttribute('data-theme') === preference);
    });
  }

  var initialPreference = getSavedThemePreference();
  applyThemePreference(initialPreference);

  themeOptions.forEach(function (option) {
    option.addEventListener('click', function () {
      var selected = option.getAttribute('data-theme');
      applyThemePreference(selected);
    });
  });

  function handleSystemThemeChange() {
    if (getSavedThemePreference() === 'system') {
      applyThemePreference('system');
    }
  }

  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', handleSystemThemeChange);
  } else if (typeof mediaQuery.addListener === 'function') {
    mediaQuery.addListener(handleSystemThemeChange);
  }

  window.toggleDarkMode = function () {};
})();
