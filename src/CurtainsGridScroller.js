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

class CurtainsGridScroller {
    // basic setup for curtains.js
    constructor(uniforms, vertexShader, fragmentShader) {
        this.init(uniforms, vertexShader, fragmentShader)
    }

    init(uniforms, vertexShader, fragmentShader) {
        var _this = this

        this.progress = 0.0
        this.fadeOut = false
        this.frameCounter = 0

        this.curtains = new Curtains({
            container: 'grid-canvas',
        })

        this.curtains.onError(function() {
            // we will add a class to the document body to display original images
            document.body.classList.add('no-curtains')
        })

        // create planes
        this.planes = []
        this.planeElements = document.getElementsByClassName('grid-curtain')

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

        //this.initListeners()
        this.curtains.enableDrawing
        this.curtains.needRender()
    }

    setupPlanes(index) {
        var plane = this.planes[index]

        this.imageTexture = plane.createTexture('uImageTexture')

        this.imageTexture.setSource(plane.images[0])
    }

    updateUniforms() {
        for (var i = 0; i < this.planes.length; i++) {
            var plane = this.planes[i]
            plane.uniforms.progress.value = mathUtils.easeOutCubic(this.progress)
        }
    }

    initListeners() {
        var _this = this
        this.gridImages = document.getElementsByClassName('grid-image')

        for (var i = 0; i < this.gridImages.length; i++) {
            this.gridImages[i].addEventListener('click', function() {
                _this.handleClick()
            })
        }
    }

    handleClick() {
        var _this = this

        let fadeOutTimerID = setInterval(function() {
            _this.progress += FADE_OUT_DURATION / (60 * 1000)
            _this.updateUniforms()
            _this.curtains.render()
        }, FADE_OUT_DURATION / 60)

        setTimeout(() => {
            clearInterval(fadeOutTimerID)
            _this.progress = 0.0
            _this.updateUniforms()
            _this.curtains.render()
        }, FADE_OUT_DURATION)
    }
}
