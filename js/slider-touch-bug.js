
document.addEventListener('DOMContentLoaded', function () {
    var splide = new Splide(`.splide`, {
        type: 'slide',
        gap: 0,
        pagination: false,
        flickPower: 400,
        snap: false,
        interval: 3000,
        speed: 1000,
        breakpoints: {
            1920: {
                pagination: false,
                padding: {
                    left: 0,
                    right: 0
                }
            },
            600: {
                arrows: false,
                pagination: true
            }
        }
    })
    splide.mount();
});

