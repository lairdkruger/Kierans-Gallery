var mathUtils = {
    lerp: (a, b, n) => n * (a - b) + b,
    linear: (t) => t,
    easeInQuad: (t) => t * t,
    easeOutQuad: (t) => t * (2 - t),
    easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    easeInCubic: (t) => t * t * t,
    easeOutCubic: (t) => --t * t * t + 1,
    easeInOutCubic: (t) =>
        t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    easeInQuart: (t) => t * t * t * t,
    easeOutQuart: (t) => 1 - --t * t * t * t,
    easeInOutQuart: (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),
    easeInQuint: (t) => t * t * t * t * t,
    easeOutQuint: (t) => 1 + --t * t * t * t * t,
    easeInOutQuint: (t) =>
        t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,
}

class Tabletop {
    constructor() {
        this.grid = {
            element: document.getElementsByClassName('grid')[0],
            container: document.getElementsByClassName('grid-container')[0],
            xMax: 0,
            yMax: 0,
            x: 0,
            y: 0,
            oldX: 0,
            oldY: 0,
        }

        this.gridWidth = this.grid.element.clientWidth
        this.gridHeight = this.grid.element.clientHeight

        this.windowWidth = window.innerWidth
        this.windowHeight = window.innerHeight

        this.acceleration = 1.0
        this.mouse = {
            x: this.windowWidth / 2,
            y: this.windowHeight / 2,
        }

        // grid 25% larger than screen
        this.size = 1.5
        this.extraSpace = 1.0

        this.init()
    }

    map(x, a, b, c, d) {
        return c + (d - c) * ((x - a) / (b - a)) || 0
    }

    init() {
        this.sizeGrid()
        this.initMasonry()

        // this.resize()

        this.initListeners()

        this.render()
    }

    sizeGrid() {
        // height after filled with images
        var width = this.grid.container.clientWidth
        var height = this.grid.container.clientHeight

        // make grid 25% larger than screen
        this.grid.container.style.width = String(width * this.size) + 'px'
        this.grid.container.style.width = width * this.size
        this.grid.container.style.height = String(height * this.size) + 'px'
        this.grid.container.style.height = height * this.size

        this.gridWidth = this.grid.element.clientWidth
        this.gridHeight = this.grid.element.clientHeight

        this.grid.element.style.marginLeft = String(-width * ((this.size - 1) / 4)) + 'px'

        this.grid.container.style.marginTop =
            String(-height * ((this.size - 1) / 4)) + 'px'

        console.log((this.size - 1) / 2)
    }

    initMasonry() {
        var grid = this.grid.element
        var msnry = new Masonry(grid, {
            itemSelector: '.grid-curtain',
            percentPosition: true,
        })
    }

    initListeners() {
        var _this = this

        TweenMax.set(this.grid.element, {x: 0, y: 0})

        window.addEventListener('mousemove', function (e) {
            _this.mouseMove(e)
        })
        window.addEventListener('touchmove', function (e) {
            _this.mouseMove(e)
        })
        window.addEventListener('resize', function (e) {
            _this.resize(e)
        })
    }

    resize() {
        window.location.reload()
    }

    mouseMove(event) {
        if (event.targetTouches && event.targetTouches[0]) {
            event.preventDefault()
            this.mouse.x = event.targetTouches[0].clientX
            this.mouse.y = event.targetTouches[0].clientY
        } else {
            this.mouse.x = event.clientX
            this.mouse.y = event.clientY
        }
    }

    updateTabletop() {
        var _this = this

        var currentX = this.grid.oldX

        _this.grid.x = _this.map(
            _this.mouse.x,
            0,
            _this.windowWidth,
            _this.gridWidth / 4,
            -_this.gridWidth / 4
        )

        var easeX = currentX + (_this.grid.x - currentX) * _this.acceleration

        this.grid.oldX = easeX

        var currentY = this.grid.oldY

        _this.grid.y = _this.map(
            _this.mouse.y,
            0,
            _this.windowHeight,
            _this.gridHeight / 4,
            -_this.gridHeight / 4
        )

        var easeY = currentY + (_this.grid.y - currentY) * _this.acceleration

        console.log('mouse:' + _this.mouse.y, 'grid:' + _this.grid.y)

        this.grid.oldY = easeY

        _this.grid.container.style.transform =
            'translate(' + String(easeX) + 'px, ' + String(easeY) + 'px)'
    }

    render() {
        this.updateTabletop()

        window.requestAnimationFrame(this.render.bind(this))
    }
}
