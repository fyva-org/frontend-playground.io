console.log("playground__running...")

document.addEventListener('DOMContentLoaded', function () {
    var splide = new Splide(`.splide`, {
        type: 'slide',
        perPage: 1,
        arrows: true,
        mediaQuery: 'max',
        breakpoints: {
            768: {
                arrows: false,
                pagination: true,
            },
        },
        pagination: false
    })
    splide.mount();
});

