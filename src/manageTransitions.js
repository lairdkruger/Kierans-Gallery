function loadTransitions() {
    let currentIndex
    const itemsWrapper = document.getElementById('items-wrapper')
    const thumbs = [...itemsWrapper.querySelectorAll('.grid-curtain')]
    const fullviewItems = [...document.querySelectorAll('.fullview__item')]
    const backToGridCtrl = document.querySelector('.fullview__close')
    const transitionEffectDuration = 1.8

    console.log(fullviewItems)

    const transitionEffect = createDemoEffect({
        activation: {type: 'closestCorner'},
        timing: {
            duration: transitionEffectDuration,
        },
        transformation: {
            type: 'flipX',
        },
        flipBeizerControls: {
            c0: {
                x: 0.4,
                y: -0.8,
            },
            c1: {
                x: 0.5,
                y: 0.9,
            },
        },
        onToFullscreenStart: ({index}) => {
            currentIndex = index
            thumbs[currentIndex].style.opacity = 0

            /*
                        TweenLite.to(itemsWrapper, .5, {
                            ease: Quint.easeInOut,
                            scale: 0.5,
                            opacity: 0
                        });
                        */

            toggleFullview()
        },
        /*
                    onToGridStart: ({ index }) => {
                        TweenLite.to(itemsWrapper, 1, {
                            ease: Quint.easeOut,
                            scale: 1,
                            opacity: 1
                        });
                        toggleFullview();
                    },
                    */
        onToGridFinish: ({index, lastIndex}) => {
            thumbs[lastIndex].style.opacity = 1
            fullviewItems[currentIndex].classList.remove('fullview__item--current')
        },
        easings: {
            toFullscreen: Quint.easeOut,
            toGrid: Quint.easeOut,
        },
    })

    transitionEffect.init()

    const toggleFullview = () => {
        if (transitionEffect.isFullscreen) {
            TweenLite.to(
                fullviewItems[currentIndex].querySelector('.fullview__item-title'),
                0.2,
                {
                    ease: Quad.easeOut,
                    opacity: 0,
                    x: '5%',
                }
            )
            TweenLite.to(backToGridCtrl, 0.2, {
                ease: Quad.easeOut,
                opacity: 0,
                scale: 0,
            })

            transitionEffect.toGrid()
        } else {
            fullviewItems[currentIndex].classList.add('fullview__item--current')

            TweenLite.to(
                fullviewItems[currentIndex].querySelector('.fullview__item-title'),
                0.8,
                {
                    ease: Expo.easeOut,
                    startAt: {x: '5%'},
                    opacity: 1,
                    x: '0%',
                    delay: transitionEffectDuration * 0.3,
                }
            )
            TweenLite.to(backToGridCtrl, 0.8, {
                ease: Expo.easeOut,
                startAt: {scale: 0},
                opacity: 1,
                scale: 1,
                delay: transitionEffectDuration * 0.3,
            })
        }
    }

    backToGridCtrl.addEventListener('click', () => {
        if (transitionEffect.isAnimating) {
            return
        }
        toggleFullview()
    })

    // Preload all the images in the pageI
    imagesLoaded(document.querySelectorAll('img'), (instance) => {
        //https://www.techrepublic.com/article/preloading-and-the-javascript-image-object/

        // document.body.classList.remove('loading')

        // Make Images sets for creating the textures.
        let images = []
        for (var i = 0, imageSet = {}; i < instance.elements.length; i++) {
            let image = {
                element: instance.elements[i],
                image: instance.images[i].isLoaded ? instance.images[i].img : null,
            }
            if (i % 2 === 0) {
                imageSet = {}
                imageSet.small = image
            }

            if (i % 2 === 1) {
                imageSet.large = image
                images.push(imageSet)
            }
        }

        transitionEffect.createTextures(images)
    })
}
