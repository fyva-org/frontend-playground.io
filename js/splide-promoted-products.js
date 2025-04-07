
document.addEventListener('DOMContentLoaded', function () {
    var splide = new Splide(`.splide`, {
        autoplay: false,
        type: 'slide',
        gap: 8,
        perPage: 2,
        lazyLoad: 'nearby',
        drag: 'free',
        arrows: false,
        pagination: false,
        fixedWidth: 200,
        // padding: { right: '5%' }
    })
    splide.mount();
});