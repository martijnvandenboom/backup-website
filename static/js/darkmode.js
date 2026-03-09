const themeSwitch = document.getElementById('theme-switch')
const themeOptions = document.querySelectorAll('.theme-option')
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
const THEME_PREF_KEY = 'themePreference'

function getSavedThemePreference() {
  const value = localStorage.getItem(THEME_PREF_KEY)
  if (value === 'dark' || value === 'light' || value === 'system') {
    return value
  }
  // Backward compatibility with previous key.
  if (localStorage.getItem('darkmode') === 'active') {
    return 'dark'
  }
  return 'system'
}

function isDarkThemeActive(preference) {
  if (preference === 'dark') return true
  if (preference === 'light') return false
  return mediaQuery.matches
}

function applyThemePreference(preference) {
  const enableDark = isDarkThemeActive(preference)
  document.body.classList.toggle('darkmode', enableDark)

  document.body.classList.remove('theme-pref-system', 'theme-pref-dark', 'theme-pref-light')
  document.body.classList.add('theme-pref-' + preference)

  localStorage.setItem(THEME_PREF_KEY, preference)
  localStorage.removeItem('darkmode')

  if (themeSwitch) {
    const titleMap = {
      system: 'Theme: System',
      dark: 'Theme: Dark',
      light: 'Theme: Light'
    }
    themeSwitch.setAttribute('title', titleMap[preference])
    themeSwitch.setAttribute('aria-label', titleMap[preference])
  }

  if (themeOptions && themeOptions.length) {
    themeOptions.forEach(function (option) {
      option.classList.toggle('theme-option-active', option.getAttribute('data-theme') === preference)
    })
  }
}

const initialPreference = getSavedThemePreference()
applyThemePreference(initialPreference)

if (themeOptions && themeOptions.length) {
  themeOptions.forEach(function (option) {
    option.addEventListener('click', function () {
      const selected = option.getAttribute('data-theme')
      applyThemePreference(selected)
    })
  })
}

function handleSystemThemeChange() {
  if (getSavedThemePreference() === 'system') {
    applyThemePreference('system')
  }
}

if (typeof mediaQuery.addEventListener === 'function') {
  mediaQuery.addEventListener('change', handleSystemThemeChange)
} else if (typeof mediaQuery.addListener === 'function') {
  mediaQuery.addListener(handleSystemThemeChange)
}

window.toggleDarkMode = function () {}