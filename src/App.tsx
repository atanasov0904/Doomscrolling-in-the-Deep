import { useEffect, useState } from 'react'
import './App.css'

const FOCUS_URL_KEY = 'focus-url'
const DEFAULT_FOCUS_URL = 'https://www.linkedin.com/jobs/'

type ExtensionStorage = {
  get: (keys: string[]) => Promise<Record<string, unknown>>
  set: (items: Record<string, string>) => Promise<void>
}

function storage(): ExtensionStorage | undefined {
  return (globalThis as typeof globalThis & { chrome?: { storage?: { local?: ExtensionStorage } } })
    .chrome?.storage?.local
}

function isWebUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

function App() {
  const [focusUrl, setFocusUrl] = useState(DEFAULT_FOCUS_URL)
  const [message, setMessage] = useState('')

  useEffect(() => {
    void storage()?.get([FOCUS_URL_KEY]).then((saved) => {
      if (typeof saved[FOCUS_URL_KEY] === 'string') setFocusUrl(saved[FOCUS_URL_KEY])
    })
  }, [])

  async function saveSettings() {
    const cleanedUrl = focusUrl.trim()
    if (!isWebUrl(cleanedUrl)) {
      setMessage('Enter a full website address, starting with https://')
      return
    }

    const extensionStorage = storage()
    if (!extensionStorage) {
      setMessage('Open this page from the extension icon after loading the dist folder.')
      return
    }

    await extensionStorage.set({ [FOCUS_URL_KEY]: cleanedUrl })
    setFocusUrl(cleanedUrl)
    setMessage('Saved. Your next interruption has a destination.')
  }

  return (
    <main className="settings-page">
      <p className="wordmark">DOOMSCROLLING IN THE DEEP</p>
      <section className="settings-card">
        <p className="eyebrow">Chrome extension · v0.1</p>
        <h1>Give your<br />scroll a job.</h1>
        <p className="intro">
          Choose the site you would rather open when it is time to get into the zone.
        </p>

        <label className="focus-field" htmlFor="focus-url">
          <span>Your focus destination</span>
          <input
            id="focus-url"
            type="url"
            value={focusUrl}
            onChange={(event) => {
              setFocusUrl(event.target.value)
              setMessage('')
            }}
            placeholder="https://notion.so/your-workspace"
          />
          <small>Try Notion, a course, your portfolio, or a job board.</small>
        </label>

        <div className="status">
          <span className="status-dot" aria-hidden="true" />
          <div>
            <strong>Short-form intervention</strong>
            <span>YouTube Shorts, TikTok, and Instagram Reels</span>
          </div>
        </div>

        <button className="save-button" type="button" onClick={() => void saveSettings()}>
          Save focus destination
        </button>
        {message && <p className="save-message" role="status">{message}</p>}
      </section>
      <p className="footer-note">No tracking. No cloud. Just career pressure.</p>
    </main>
  )
}

export default App
