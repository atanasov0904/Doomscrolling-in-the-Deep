import { useState } from 'react'
import './App.css'

function App() {
  const [saved, setSaved] = useState(false)

  return (
    <main className="settings-page">
      <p className="wordmark">DOOMSCROLLING IN THE DEEP</p>
      <section className="settings-card">
        <p className="eyebrow">Chrome extension · v0.1</p>
        <h1>Your intervention<br />is ready.</h1>
        <p className="intro">
          On YouTube Shorts, we will remind you that McDonald's is hiring.
        </p>

        <div className="status">
          <span className="status-dot" aria-hidden="true" />
          <div>
            <strong>YouTube Shorts</strong>
            <span>Active when loaded as an extension</span>
          </div>
        </div>

        <button className="save-button" type="button" onClick={() => setSaved(true)}>
          {saved ? 'Saved. Now close this tab.' : 'Save settings'}
        </button>
      </section>
      <p className="footer-note">No tracking. No cloud. Just career pressure.</p>
    </main>
  )
}

export default App
