const CARD_ID = 'doomscrolling-in-the-deep-card'
const SNOOZE_MS = 5 * 60 * 1000

function renderCard() {
  if (document.getElementById(CARD_ID)) return

  const card = document.createElement('aside')
  card.id = CARD_ID
  card.setAttribute('aria-label', 'Doomscrolling intervention')
  card.innerHTML = `
    <p class="ditd-card__topline">DOOMSCROLLING IN THE DEEP</p>
    <div class="ditd-card__body">
      <p class="ditd-card__eyebrow">Career interruption</p>
      <h2 class="ditd-card__title">McDonald's<br>is hiring.</h2>
      <p class="ditd-card__copy">You have watched enough tiny videos for one sitting. Your future may come with fries.</p>
      <div class="ditd-card__actions">
        <a class="ditd-card__button ditd-card__button--primary" href="https://careers.mcdonalds.com/" target="_blank" rel="noopener noreferrer">View applications</a>
        <button class="ditd-card__button ditd-card__button--secondary" type="button" data-snooze>Give me 5 more minutes</button>
      </div>
    </div>
  `

  card.querySelector<HTMLButtonElement>('[data-snooze]')?.addEventListener('click', () => {
    localStorage.setItem('ditd-snoozed-until', String(Date.now() + SNOOZE_MS))
    card.remove()
  })

  document.body.append(card)
}

function canInterrupt() {
  return Number(localStorage.getItem('ditd-snoozed-until') ?? 0) <= Date.now()
}

function handleNavigation() {
  if (location.pathname.startsWith('/shorts/') && canInterrupt()) renderCard()
}

handleNavigation()
new MutationObserver(handleNavigation).observe(document.documentElement, {
  childList: true,
  subtree: true,
})
