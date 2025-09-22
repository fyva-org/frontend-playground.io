import { timerFuncForSplide } from './components/timer.js'


document.addEventListener('DOMContentLoaded', function () {
    var splide = new Splide(`.splide`, {
        autoplay: true,
        type: 'slide',
        gap: 0,
        lazyLoad: 'nearby'
    })
    var instance = splide.mount();

    timerFuncForSplide(instance)

    var splide = new Splide(`.splidetwo`, {
        autoplay: true,
        type: 'slide',
        gap: 0,
        lazyLoad: 'nearby'
    })
    var instance = splide.mount();

    timerFuncForSplide(instance)
});