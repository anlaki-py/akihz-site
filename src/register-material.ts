// Client-only Material Web setup. Imported first by every client entry
// point. Never imported by ssr.tsx, so the prerender bundle stays DOM-free.
import '@material/web/button/filled-button.js'
import '@material/web/button/text-button.js'
import '@material/web/labs/card/elevated-card.js'
import '@material/web/list/list.js'
import '@material/web/list/list-item.js'
import '@material/web/progress/circular-progress.js'
