var mathUtils = {
    lerp: (a, b, n) => n * (a - b) + b,
    linear: t => t,
    easeInQuad: t => t * t,
    easeOutQuad: t => t * (2 - t),
    easeInOutQuad: t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    easeInCubic: t => t * t * t,
    easeOutCubic: t => --t * t * t + 1,
    easeInOutCubic: t =>
        t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    easeInQuart: t => t * t * t * t,
    easeOutQuart: t => 1 - --t * t * t * t,
    easeInOutQuart: t => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),
    easeInQuint: t => t * t * t * t * t,
    easeOutQuint: t => 1 + --t * t * t * t * t,
    easeInOutQuint: t =>
        t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,
}

class CurtainsGallery {
    // basic setup for curtains.js
    constructor(uniforms, vertexShader, fragmentShader) {
        this.init(uniforms, vertexShader, fragmentShader)
    }

    init(uniforms, vertexShader, fragmentShader) {
        var _this = this

        this.navPrev = document.getElementById('navigation-previous')
        this.navNext = document.getElementById('navigation-next')

        this.currentImage = CLICKED_ELEMENT
        this.imageTexture = ''
        this.fadeTexture = ''
        this.start = performance.now()
        this.fadingOut = false
        this.fadingIn = false
        this.forward = false
        this.backward = false

        this.curtains = new Curtains({
            container: 'slideshow-canvas',
            watchScroll: false,
        })

        this.curtains.onError(function() {
            // we will add a class to the document body to display original images
            document.body.classList.add('no-curtains')
        })

        // create planes
        this.planes = []
        this.planeElements = document.getElementsByClassName('slideshow-curtain')

        this.params = {
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: uniforms,
        }

        // add planes and handle them
        for (var i = 0; i < this.planeElements.length; i++) {
            this.planes.push(this.curtains.addPlane(this.planeElements[i], this.params))

            this.setupPlanes(i)
        }

        this.hideOtherPlanes(this.currentImage)
        this.initListeners()
        this.initStartState()
    }

    initStartState() {
        var plane = this.planes[this.currentImage]
        plane.uniforms.state.value = 3.0
        this.curtains.enableDrawing()
        this.curtains.render()
        this.curtains.disableDrawing()
    }

    // handle all the planes
    setupPlanes(index) {
        var plane = this.planes[index]
        this.curtains.needRender()

        // each plane has: a white image + image + a white image as its texture source
        this.imageTexture = plane.createTexture('imageTexture')
        this.fadeTexture = plane.createTexture('fadeTexture')

        this.whiteTexture = document.getElementById('white-image')

        // add white after the plane has been sized to the image
        plane.loadSource(this.whiteTexture)

        this.imageTexture.setSource(plane.images[0])
        this.fadeTexture.setSource(plane.images[1])
    }

    hideOtherPlanes(j) {
        // index j will not be hidden
        for (var i = 0; i < this.planeElements.length; i++) {
            if (i == j) {
                this.planes[i].visible = true
            } else {
                this.planes[i].visible = false
            }
        }
    }

    refreshIndex() {
        this.currentImage = CLICKED_ELEMENT
        this.curtains.enableDrawing()
        var plane = this.planes[this.currentImage]
        plane.uniforms.state.value = 3.0
        this.hideOtherPlanes(this.currentImage)
        this.curtains.render()
        this.curtains.disableDrawing()
    }

    initListeners() {
        var _this = this

        // only available when transition is not taking place
        this.navPrev.addEventListener(
            'click',
            function(event) {
                if (!_this.fadingOut && !_this.fadingIn) {
                    _this.onClick('previous')
                }
            },
            false
        )

        this.navNext.addEventListener(
            'click',
            function(event) {
                if (!_this.fadingOut && !_this.fadingIn) {
                    _this.onClick('next')
                }
            },
            false
        )
    }

    onClick(direction) {
        if (direction == 'next') this.forward = true
        if (direction == 'previous') this.backward = true

        this.curtains.enableDrawing()
        this.fadingOut = true
        this.start = performance.now()

        var plane = this.planes[this.currentImage]
        plane.uniforms.state.value = 1.0 // 1.0 = fading out, 2.0 = fading in, 3.0 start

        this.fadeOut() // fadeIn gets called from fadeOut once its completed
    }

    fadeOut() {
        var _this = this

        this.curtains.render()

        this.fadingOut = true

        const now = performance.now()
        const time = Math.min(1, (now - this.start) / FADE_OUT_DURATION)

        var plane = this.planes[this.currentImage]
        plane.uniforms.progress.value = mathUtils.easeOutCubic(time)

        if (time >= FADE_OUT_DURATION / 1000) {
            // animation completed
            // this is only executed once so performance isn't an issue
            this.fadingOut = false

            this.currentImage = this.getNextImage()

            this.start = performance.now()

            var newPlane = this.planes[this.currentImage]
            newPlane.uniforms.state.value = 2.0
            _this.fadeIn()
            this.hideOtherPlanes(this.currentImage)
        } else {
            window.requestAnimationFrame(function() {
                _this.fadeOut()
            })
        }
    }

    fadeIn() {
        var _this = this

        this.curtains.render()

        this.fadingIn = true

        const now = performance.now()
        const time = Math.min(1, (now - this.start) / FADE_OUT_DURATION)

        var plane = this.planes[this.currentImage]
        plane.uniforms.progress.value = mathUtils.easeOutCubic(time)

        if (time >= FADE_OUT_DURATION / 1000) {
            // this is only executed once so performance isn't an issue
            this.fadingIn = false
            this.curtains.disableDrawing()
        } else {
            window.requestAnimationFrame(function() {
                _this.fadeIn()
            })
        }
    }

    getNextImage() {
        var _nextImage = this.currentImage

        if (this.forward) {
            _nextImage += 1
            if (_nextImage > this.planeElements.length - 1) {
                _nextImage = 0
            }
            this.forward = false
        }

        if (this.backward) {
            _nextImage -= 1
            if (_nextImage < 0) {
                _nextImage = this.planeElements.length - 1
            }
            this.backward = false
        }

        return _nextImage
    }
}
