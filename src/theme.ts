import {
  applyTheme,
  argbFromHex,
  hexFromArgb,
  themeFromSourceColor,
} from '@material/material-color-utilities'

// Purple seed. Generates the full M3 dark color scheme at startup.
const theme = themeFromSourceColor(argbFromHex('#6750a4'))

if (typeof document !== 'undefined') {
  const root = document.documentElement
  applyTheme(theme, { target: root, dark: true })
  // AMOLED black: page background and resting surfaces go pure black.
  // Raised containers keep their generated tones so cards still lift.
  const black = hexFromArgb(argbFromHex('#000000'))
  for (const token of [
    '--md-sys-color-background',
    '--md-sys-color-surface',
    '--md-sys-color-surface-dim',
    '--md-sys-color-surface-container-lowest',
    '--md-sys-color-surface-container-low',
  ]) {
    root.style.setProperty(token, black)
  }
}
