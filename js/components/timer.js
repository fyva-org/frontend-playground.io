import { parseTime, parseCurrentTime, currentDate, normalizeDate } from '../util/func-utils.js';

/**
 * create a simple checker for a slide dataset (works for DOM element.dataset or parsed HTML dataset)
 */
function createTimerChecker(dataset) {
  const startDate = dataset.startDate;
  const endDate = dataset.endDate;
  const startTime = dataset.startTime;
  const endTime = dataset.endTime;
  const timerEnabled = dataset.timerCheckbox === 'true';

  function isInWindow() {
    if (!startDate || !endDate || !startTime || !endTime) return false;
    const s = normalizeDate(startDate);
    const e = normalizeDate(endDate);
    const dateOk = currentDate() >= s && currentDate() <= e;
    const timeOk = parseCurrentTime() >= parseTime(startTime) && parseCurrentTime() < parseTime(endTime);
    return dateOk && timeOk;
  }

  return {
    isTimerEnabled: () => timerEnabled,
    shouldShow: () => timerEnabled && isInWindow(),
    isExpired: () => endDate ? currentDate() > normalizeDate(endDate) : false
  };
}

/**
 * Attach timer logic to a mounted Splide instance.
 * Usage:
 *   const splide = new Splide('.splide', options).mount();
 *   const controller = attachSplideTimer(splide, { pollInterval: 1000 });
 *
 * Returns { stop() } so you can stop polling if needed.
 */
export function attachSplideTimer(splideInstance, { pollInterval = 1000 } = {}) {
  if (!splideInstance || !splideInstance.root) {
    console.warn('attachSplideTimer: pass a mounted Splide instance (after .mount())');
    return { stop: () => {} };
  }

  const root = splideInstance.root;
  // assign stable ids and remember original order
  const initialSlides = Array.from(root.querySelectorAll('.splide__slide'));
  const originalOrder = initialSlides.map((s, i) => {
    if (!s.dataset.timerId) s.dataset.timerId = `timer-${i}-${Date.now()}`;
    return s.dataset.timerId;
  });
  const originalIndexMap = new Map(originalOrder.map((id, idx) => [id, idx]));

  // store removed slides: id -> { html, originalIndex }
  const removedMap = new Map();

  function computeInsertionIndex(originalIndex) {
    const currentIds = Array.from(root.querySelectorAll('.splide__slide')).map(s => s.dataset.timerId);
    let pos = 0;
    for (const id of currentIds) {
      const idx = originalIndexMap.get(id);
      if (idx < originalIndex) pos++;
      else break;
    }
    return pos;
  }

  function removeSlideElement(el) {
    const slidesNow = Array.from(root.querySelectorAll('.splide__slide'));
    const idx = slidesNow.indexOf(el);
    if (idx === -1) return;
    const id = el.dataset.timerId;
    removedMap.set(id, { html: el.outerHTML, originalIndex: originalIndexMap.get(id) ?? slidesNow.length });
    splideInstance.remove(idx);
  }

  function addSlideById(id) {
    const data = removedMap.get(id);
    if (!data) return;
    const insertionIndex = computeInsertionIndex(data.originalIndex);
    splideInstance.add(data.html, insertionIndex);
    removedMap.delete(id);
  }

  // initial pass: remove timer slides that shouldn't show now
  Array.from(root.querySelectorAll('.splide__slide')).forEach(slide => {
    // only manage slides with explicit timer enabled
    if (slide.dataset.timerCheckbox !== 'true') return;
    const checker = createTimerChecker(slide.dataset);
    if (!checker.shouldShow()) removeSlideElement(slide);
  });

  // poll for changes (slides becoming valid/invalid)
  const interval = setInterval(() => {
    // 1) remove visible slides that became invalid
    Array.from(root.querySelectorAll('.splide__slide')).forEach(slide => {
      if (slide.dataset.timerCheckbox !== 'true') return;
      const checker = createTimerChecker(slide.dataset);
      if (!checker.shouldShow()) removeSlideElement(slide);
    });

    // 2) add back removed slides that became valid
    for (const [id, payload] of Array.from(removedMap.entries())) {
      // parse payload.html to inspect dataset without adding to DOM
      const tmp = document.createElement('div');
      tmp.innerHTML = payload.html.trim();
      const slideEl = tmp.firstElementChild;
      if (!slideEl) { removedMap.delete(id); continue; }
      const checker = createTimerChecker(slideEl.dataset);
      if (checker.shouldShow()) {
        addSlideById(id);
      } else if (checker.isExpired()) {
        // if the slide's end date has passed, we can permanently drop it from the pool
        removedMap.delete(id);
      }
    }

    // optional stop: if nothing left to monitor, clear
    const anyManagedStillPresent = Array.from(root.querySelectorAll('.splide__slide')).some(s => s.dataset.timerCheckbox === 'true');
    if (!anyManagedStillPresent && removedMap.size === 0) {
      clearInterval(interval);
    }
  }, pollInterval);

  return {
    stop() { clearInterval(interval); }
  };
}



