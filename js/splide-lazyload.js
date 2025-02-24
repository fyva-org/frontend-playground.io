
document.addEventListener('DOMContentLoaded', function () {
    var splide = new Splide(`.splide`, {
        autoplay: true,
        type: 'slide',
        gap: 0,
        lazyLoad: 'nearby'
    })
    splide.mount();
});

