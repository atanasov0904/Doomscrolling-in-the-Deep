const CARD_ID = 'doomscrolling-in-the-deep-card'
const SNOOZE_MS = 30 * 1000
const FOCUS_URL_KEY = 'focus-url'
const DEFAULT_FOCUS_URL = 'https://www.linkedin.com/jobs/'

type ExtensionStorage = {
  get: (keys: string[]) => Promise<Record<string, unknown>>
}

type ExtensionApi = {
  storage?: {
    local?: ExtensionStorage
    onChanged?: {
      addListener: (listener: (changes: Record<string, { newValue?: unknown }>) => void) => void
    }
  }
}

function extensionApi(): ExtensionApi | undefined {
  return (globalThis as typeof globalThis & { chrome?: ExtensionApi }).chrome
}

function storage(): ExtensionStorage | undefined {
  return extensionApi()?.storage?.local
}

function isSafeWebUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

async function getFocusUrl() {
  const saved = await storage()?.get([FOCUS_URL_KEY])
  const savedUrl = saved?.[FOCUS_URL_KEY]
  return isSafeWebUrl(savedUrl) ? savedUrl : DEFAULT_FOCUS_URL
}

async function renderCard() {
  if (document.getElementById(CARD_ID)) return

  const focusUrl = await getFocusUrl()
  if (document.getElementById(CARD_ID)) return

  const card = document.createElement('aside')
  card.id = CARD_ID
  card.setAttribute('aria-label', 'Doomscrolling intervention')
  card.innerHTML = `
    <p class="ditd-card__topline">DOOMSCROLLING IN THE DEEP</p>
    <div class="ditd-card__body">
      <p class="ditd-card__eyebrow">Career interruption</p>
      <h2 class="ditd-card__title">McDonald's<br>is hiring.</h2>
      <p class="ditd-card__copy">You have watched enough tiny videos for one sitting. Press the button to see your future.</p>
      <div class="ditd-card__actions">
        <a class="ditd-card__button ditd-card__button--primary" href="https://careers.mcdonalds.com/" target="_blank" rel="noopener noreferrer">View future opportunities</a>
        <a class="ditd-card__button ditd-card__button--secondary" data-focus-link href="${focusUrl}" target="_blank" rel="noopener noreferrer">Get into the zone now.</a>
        <button class="ditd-card__button ditd-card__button--secondary" type="button" data-snooze>Just a little break tho!</button>
      </div>
    </div>
  `

  card.querySelector<HTMLButtonElement>('[data-snooze]')?.addEventListener('click', () => {
    localStorage.setItem('ditd-snoozed-until', String(Date.now() + SNOOZE_MS))
    card.remove()
  })

  document.body.append(card)
}

extensionApi()?.storage?.onChanged?.addListener((changes) => {
  const newFocusUrl = changes[FOCUS_URL_KEY]?.newValue
  if (!isSafeWebUrl(newFocusUrl)) return

  document
    .querySelector<HTMLAnchorElement>('#doomscrolling-in-the-deep-card [data-focus-link]')
    ?.setAttribute('href', newFocusUrl)
})

function canInterrupt() {
  return Number(localStorage.getItem('ditd-snoozed-until') ?? 0) <= Date.now()
}

function isShortFormPage() {
  const { hostname, pathname } = location

  if (hostname === 'www.youtube.com') return pathname.startsWith('/shorts/')
  if (hostname === 'www.tiktok.com' || hostname === 'tiktok.com') {
    return pathname === '/' || pathname.startsWith('/en/') || pathname.startsWith('/following') || pathname.startsWith('/video/') || pathname.startsWith('/@')
  }
  if (hostname === 'www.instagram.com') return pathname.startsWith('/reel/') || pathname.startsWith('/reels')
  return false
}

function handleNavigation() {
  if (isShortFormPage() && canInterrupt()) void renderCard()
}

handleNavigation()
new MutationObserver(handleNavigation).observe(document.documentElement, { childList: true, subtree: true })
