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
            xMax: 0,
            yMax: 0,
            x: 0,
            y: 0,
            oldX: 0,
            oldY: 0,
        }

        this.gridWidth = this.grid.element.clientWidth
        this.gridHeight = this.grid.element.clientHeight

        this.acceleration = 0.05
        this.mouse = {
            x: 0,
            y: 0,
        }

        this.windowWidth = window.innerWidth
        this.windowHeight = window.innerHeight

        this.extraSpace = 1.5

        this.init()
    }

    map(x, a, b, c, d) {
        return c + (d - c) * ((x - a) / (b - a)) || 0
    }

    init() {
        this.sizeGrid()
        this.initMasonry()

        this.resize()

        this.initListeners()

        this.render()
    }

    sizeGrid() {
        var gridContainer = document.getElementsByClassName('grid-container')[0]

        // height after filled with images
        var height = this.grid.element.clientHeight
        var width = this.grid.element.clientWidth

        // make grid 25% larger than screen
        gridContainer.style.width = String(width * 1.25) + 'px'
        gridContainer.style.width = width * 1.25
        gridContainer.style.height = String(height * 1.25) + 'px'
        gridContainer.style.height = height * 1.25

        gridContainer.style.left = String(-width * 0.125) + 'px'

        gridContainer.style.top = String(-height * 0.125) + 'px'
    }

    initMasonry() {
        var grid = document.querySelector('.grid')
        var msnry = new Masonry(grid, {
            itemSelector: '.grid-curtain',
            percentPosition: true,
        })
    }

    initListeners() {
        var _this = this

        var tween = new TweenMax.set(this.grid.element, {x: 0, y: 0})

        //add listener
        // tween.ticker.addEventListener()

        // render()

        function myFunction(event) {
            //executes on every tick after the core engine updates
        }

        // infinite tween acting as a render loop
        // TweenMax.to(this.grid.element, 1000, {
        //     x: 0,
        //     y: 0,
        //     repeat: -1,
        //     ease: Linear.easeNone,
        //     modifiers: {
        //         x: function (x) {
        //             var currentX = gsap.getProperty(_this.grid.element, 'x')

        //             _this.grid.x = _this.map(
        //                 _this.mouse.x,
        //                 0,
        //                 _this.windowWidth,
        //                 _this.gridWidth / 2,
        //                 -_this.gridWidth / 2
        //             )

        //             // var easeX = currentX + (_this.grid.x - currentX) * _this.acceleration

        //             _this.grid.element.style.transform =
        //                 'translateX(' + String(easeX) + 'px)'

        //             return easeX
        //         },
        //         y: function (y) {
        //             var currentY = gsap.getProperty(_this.grid.element, 'y')

        //             _this.grid.y = _this.map(
        //                 _this.mouse.y,
        //                 0,
        //                 _this.windowHeight,
        //                 _this.gridHeight / 2,
        //                 -_this.gridHeight / 2
        //             )

        //             console.log(_this.grid.y)
        //             var easeY = currentY + (_this.grid.y - currentY) * _this.acceleration

        //             _this.grid.element.style.transform =
        //                 'translateY(' + String(easeY) + 'px)'

        //             return easeY
        //         },
        //     },
        // })

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
        this.windowWidth = window.innerWidth
        this.windowHeight = window.innerHeight

        this.gridWidth = this.grid.element.clientWidth
        this.gridHeight = this.grid.element.clientHeight

        this.grid.xMax = this.windowWidth - this.gridWidth
        this.grid.yMax = this.windowHeight - this.gridHeight
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
            _this.gridWidth / 2,
            -_this.gridWidth / 2
        )

        var easeX = currentX + (_this.grid.x - currentX) * _this.acceleration

        this.grid.oldX = easeX

        var currentY = this.grid.oldY

        _this.grid.y = _this.map(
            _this.mouse.y,
            0,
            _this.windowHeight,
            _this.gridHeight / 2,
            -_this.gridHeight / 2
        )

        var easeY = currentY + (_this.grid.y - currentY) * _this.acceleration

        this.grid.oldY = easeY

        _this.grid.element.style.transform =
            'translate(' + String(easeX) + 'px, ' + String(easeY) + 'px)'
    }

    render() {
        this.updateTabletop()

        window.requestAnimationFrame(this.render.bind(this))
    }
}
