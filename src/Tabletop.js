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

        this.gridWidth = 0
        this.gridHeight = 0
        this.windowWidth = 0
        this.windowHeight = 0

        this.acceleration = 0.05
        this.mouse = {
            x: this.windowWidth / 2,
            y: this.windowHeight / 2,
        }

        this.velocity = 0.0

        this.init()
    }

    map(x, a, b, c, d) {
        return c + (d - c) * ((x - a) / (b - a)) || 0
    }

    init() {
        this.sizeGrid()
        this.initListeners()
        this.render()
    }

    sizeGrid() {
        this.windowWidth = window.innerWidth
        this.windowHeight = window.innerHeight

        this.gridWidth = this.grid.element.clientWidth
        this.gridHeight = this.grid.element.clientHeight

        this.mouse.x = this.windowWidth / 2
        this.mouse.y = this.windowHeight / 2
    }

    initListeners() {
        var _this = this

        document.addEventListener('mousemove', function (e) {
            _this.mouseMove(e)
        })
        window.addEventListener('touchmove', function (e) {
            _this.touchMove(e)
        })
        window.addEventListener('resize', function (e) {
            _this.sizeGrid()
        })
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

    touchMove(event) {
        if (event.targetTouches && event.targetTouches[0]) {
            event.preventDefault()
            this.mouse.x = event.targetTouches[0].clientX
            this.mouse.y = event.targetTouches[0].clientY
        } else {
            this.mouse.x = event.clientX
            this.mouse.y = event.clientY
        }
    }

    moveTabletop() {
        var currentX = this.grid.oldX
        var currentY = this.grid.oldY

        this.grid.x = this.map(
            this.mouse.x,
            0,
            this.windowWidth,
            this.gridWidth / 2,
            -this.gridWidth / 2
        )

        this.grid.y = this.map(
            this.mouse.y,
            0,
            this.windowHeight,
            this.gridHeight / 2,
            -this.gridHeight / 2
        )

        var easeX = currentX + (this.grid.x - currentX) * this.acceleration
        var easeY = currentY + (this.grid.y - currentY) * this.acceleration

        this.velocity = Math.sqrt(
            Math.abs(easeY - this.grid.oldY) ** 2 + Math.abs(easeX - this.grid.oldX) ** 2
        )

        this.grid.oldX = easeX
        this.grid.oldY = easeY

        this.grid.container.style.transform =
            'translate(' + String(easeX) + 'px, ' + String(easeY) + 'px)'
    }

    render() {
        this.moveTabletop()

        window.requestAnimationFrame(this.render.bind(this))
    }
}
