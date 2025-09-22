import { parseTime, parseCurrentTime, currentDate, normalizeDate } from '../util/func-utils.js';

const createUtilFunc = () => {
  let splideInstance;
  let originalOrder = new Map();
  let removedSlides = new Map();
  let timerActivated = false;

  return {
    initializer: function (splide) {
      if (!splide) return;
      splideInstance = splide;

      const slides = splideInstance.root.querySelectorAll('.splide__slide');
      slides.forEach((slide, index) => {
        if (!slide.dataset.timerId) slide.dataset.timerId = `timer-${index}-${Date.now()}`;
        originalOrder.set(slide.dataset.timerId, index);
      });

      this._initialPass();
      this.pollCompDisplayProps();
    },

    _getCompDateAndTime: function (dataset) {
      const startDate = dataset.startDate;
      const endDate = dataset.endDate;
      const startTime = dataset.startTime;
      const endTime = dataset.endTime;
      const timerEnabled = dataset.timerCheckbox === 'true';
      return { startDate, endDate, startTime, endTime, timerEnabled };
    },

    _getDisplayProps: function (dataset) {
      const { startDate, endDate, startTime, endTime, timerEnabled } = this._getCompDateAndTime(dataset);
      if (!timerEnabled || !startDate || !endDate || !startTime || !endTime) return false;

      const sDate = normalizeDate(startDate);
      const eDate = normalizeDate(endDate);
      const isDateValid = currentDate() >= sDate && currentDate() <= eDate;
      const isTimeValid = parseCurrentTime() >= parseTime(startTime) && parseCurrentTime() < parseTime(endTime);
      return isDateValid && isTimeValid;
    },

    _toggleParentSection: function(hide = true) {
        if(hide) {
          splideInstance.root.closest('.timer--section').classList.add('hidden--timer--section');
          return
        }
        splideInstance.root.closest('.timer--section').classList.remove('hidden--timer--section');
    },

    pollCompDisplayProps: function () {
      const interval = setInterval(() => {
        // Remove slides that are invalid now
        const currentSlides = splideInstance.root.querySelectorAll('.splide__slide');
        const activeVisibleSlides = [...currentSlides].map(slide => {
          if (slide.dataset.timerCheckbox !== 'true') return false;
          const shouldShow = this._getDisplayProps(slide.dataset);
          if (!shouldShow) this._removeSlide(slide);
          return shouldShow
        });

        // Re-add removed slides that became valid
        for (const [id, payload] of Array.from(removedSlides.entries())) {
          const tmp = document.createElement('div');
          tmp.innerHTML = payload.html.trim();
          const slideEl = tmp.firstElementChild;
          if (!slideEl) {
            removedSlides.delete(id);
            continue;
          }
          const shouldShow = this._getDisplayProps(slideEl.dataset);
          if (shouldShow) {
            this._addSlide(id);
          }
        }

        (!activeVisibleSlides.includes(true)) ? this._toggleParentSection(true) : this._toggleParentSection(false)
        
        if (!timerActivated && removedSlides.size === 0) {
          clearInterval(interval);
        }
      }, 1000);
    },

    _initialPass: function () {
      const slides = Array.from(splideInstance.root.querySelectorAll('.splide__slide'));

      const activeVisibleSlides = slides.map(slide => {
        if (slide.dataset.timerCheckbox === 'true') {
          const shouldShow = this._getDisplayProps(slide.dataset);
          if (!shouldShow) this._removeSlide(slide);
          return shouldShow
        }
        return false
      });

      timerActivated = slides.some(s => s.dataset.timerCheckbox === 'true');
      if(!activeVisibleSlides.includes(true)) { this._toggleParentSection(true) }
    },

    _removeSlide: function (slide) {
      const slidesNow = Array.from(splideInstance.root.querySelectorAll('.splide__slide'));
      const idx = slidesNow.indexOf(slide);
      if (idx === -1) return;
      const id = slide.dataset.timerId;
      removedSlides.set(id, { html: slide.outerHTML, originalIndex: originalOrder.get(id) });
      splideInstance.remove(idx);
    },

    _addSlide: function (id) {
      const data = removedSlides.get(id);
      if (!data) return;
      const insertionIndex = this._computeInsertionIndex(data.originalIndex);
      splideInstance.add(data.html, insertionIndex);
      removedSlides.delete(id);
    },

    _computeInsertionIndex: function (originalIndex) {
      const currentIds = Array.from(splideInstance.root.querySelectorAll('.splide__slide')).map(s => s.dataset.timerId);
      let pos = 0;
      for (const id of currentIds) {
        const idx = originalOrder.get(id);
        if (idx < originalIndex) pos++;
        else break;
      }
      return pos;
    }
  };
}

// Usage example
export function timerFuncForSplide(splideInstance) {
  const utilFunc = createUtilFunc()
  utilFunc.initializer(splideInstance);
  return utilFunc
}
