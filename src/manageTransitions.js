function loadTransitions() {
    let currentIndex
    const itemsWrapper = document.getElementById('items-wrapper')
    const thumbs = [...itemsWrapper.querySelectorAll('.grid-curtain')]
    const descriptions = document.querySelectorAll('.image-description-box')

    console.log(descriptions)

    const transitionEffectDuration = 1.8

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
            descriptions[currentIndex].style.display = 'block'

            toggleFullview()
        },

        onToGridFinish: ({index, lastIndex}) => {
            thumbs[lastIndex].style.opacity = 1
            descriptions[currentIndex].style.display = 'none'
        },

        easings: {
            toFullscreen: Quint.easeOut,
            toGrid: Quint.easeOut,
        },
    })

    transitionEffect.init()

    const toggleFullview = () => {
        if (transitionEffect.isFullscreen) {
            transitionEffect.toGrid()
        }
    }

    document.addEventListener('click', () => {
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
