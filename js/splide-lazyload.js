
document.addEventListener('DOMContentLoaded', function () {
    var splide = new Splide(`.splide`, {
        type: 'slide',
        gap: 0,
        lazyLoad: 'nearby'
    })
    splide.mount();
});

