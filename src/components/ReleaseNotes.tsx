import { CHANGELOG_URL, REPO_URL } from '../constants'

type Props = {
  version?: string
  notes?: string
  loading: boolean
}

// GitHub release notes use headings, bullet lists, and paragraphs. Keep their
// text escaped by React rather than trusting HTML supplied by a release body.
function NotesBody({ notes }: { notes: string }) {
  const blocks = notes.replace(/\r\n/g, '\n')
    .replace(/^\[Full changelog\]\(https:\/\/github\.com\/anlaki-py\/akihz\/[^\s)]+\)\s*$/gim, '')
    .trim().split(/\n\s*\n/)

  return blocks.map((block, index) => {
    if (/^#{1,6} /.test(block)) {
      return <h3 key={index}>{block.replace(/^#{1,6} /, '')}</h3>
    }
    const lines = block.split('\n')
    if (lines.every((line) => /^[-*] /.test(line))) {
      return <ul key={index}>{lines.map((line, item) => <li key={item}>{line.slice(2)}</li>)}</ul>
    }
    return <p key={index}>{block}</p>
  })
}

export function ReleaseNotes({ version, notes, loading }: Props) {
  const releaseUrl = version
    ? `${REPO_URL}/releases/tag/${encodeURIComponent(`v${version}`)}`
    : `${REPO_URL}/releases/latest`

  return (
    <section className="release-notes" aria-labelledby="release-notes-title">
      <h2 id="release-notes-title">{version ? `What's new in ${version}` : 'Release notes'}</h2>
      {notes ? <NotesBody notes={notes} /> : (
        <p role="status">{loading ? 'Loading release notes…' : 'Release notes are unavailable here.'} <a href={releaseUrl}>Read on GitHub</a>.</p>
      )}
      <a className="full-changelog" href={CHANGELOG_URL}>View full changelog</a>
    </section>
  )
}
