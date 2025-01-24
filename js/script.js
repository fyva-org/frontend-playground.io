
document.addEventListener('DOMContentLoaded', function () {
    var splide = new Splide(`.splide`, {
        type: 'slide',
        gap: 0,
        pagination: false,
        flickPower: 400,
        snap: false,
        interval: 3000,
        speed: 1000,
        waitForTransition: true,
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

/*
window.addEventListener('touchstart', (e) => {
    // console.log('userScrolled -->')
    console.log('-- e.target --')
    console.log(e.target)
    const ElemBeingSwiped = e.target
    const isSplideElem = ElemBeingSwiped.closest('.splide')
    console.log('isSplideElem')
    console.log(isSplideElem)
    if (isSplideElem) {
         
    }
    // console.log(_.de)
    // window.scrollBy(0 , parseInt(userScrolled, 10))
})

function scrollCorrectionSplide() {
    _.debouce(() => {
        let userScrolled = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        window.scrollBy(0 , parseInt(userScrolled, 10))
    }, 1000);
}
*/


setTimeout(() => {

    const splideContainer = document.querySelector('.splide__slide');

count = 10;

    // Prevent hijacking vertical scrolling
   splideContainer?.addEventListener('touchstart', (event) => {
    console.log('HERE')
  
    if(count === 10) {
      alert(count)
      count = count + 1
    }
    // Store the initial touch position
    splideContainer.startY = event.touches[0].clientY;
    splideContainer.startX = event.touches[0].clientX;
  }, { passive: true });
  
  splideContainer?.addEventListener('touchmove', (event) => {
    console.log('INSIDE HERE')
    const deltaY = Math.abs(event.touches[0].clientY - splideContainer.startY);
    const deltaX = Math.abs(event.touches[0].clientX - splideContainer.startX);
  
    // Allow vertical scrolling if it's more significant than horizontal
    if (deltaY > deltaX) {
      event.stopPropagation(); // Stop carousel event propagation
    }
  }, { passive: true });

}, 3000)


