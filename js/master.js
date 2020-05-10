// var mathUtils = {
//     lerp: (a, b, n) => n * (a - b) + b,
//     linear: (t) => t,
//     easeInQuad: (t) => t * t,
//     easeOutQuad: (t) => t * (2 - t),
//     easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
//     easeInCubic: (t) => t * t * t,
//     easeOutCubic: (t) => --t * t * t + 1,
//     easeInOutCubic: (t) =>
//         t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
//     easeInQuart: (t) => t * t * t * t,
//     easeOutQuart: (t) => 1 - --t * t * t * t,
//     easeInOutQuart: (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),
//     easeInQuint: (t) => t * t * t * t * t,
//     easeOutQuint: (t) => 1 + --t * t * t * t * t,
//     easeInOutQuint: (t) =>
//         t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,
// }

// function map(x, a, b, c, d) {
//     return c + (d - c) * ((x - a) / (b - a)) || 0
// }

// var ACCELERATION = 0.05

// var MOUSECOORDS = {
//     x: 0,
//     y: 0,
// }

// var POS = {
//     x: 0,
//     y: 0,
// }

// var VW = 0
// var VH = 0

// var EXTRASPACE = 1.0

// window.onbeforeunload = function () {
//     window.scrollTo(0, 0)
// }

window.addEventListener('load', function () {
    document.body.classList.add('no-curtains')

    new Tabletop()
    // var tabletop = new Tabletop()
})

// var grid = {
//     element: document.getElementsByClassName('grid')[0],
//     xMax: 0,
//     yMax: 0,
//     x: 0,
//     y: 0,
// }

// function sizeGrid() {
//     var grid = document.getElementsByClassName('grid')[0]
//     var gridContainer = document.getElementsByClassName('grid-container')[0]
//     // height after filled with images
//     var height = grid.clientHeight
//     var width = grid.clientWidth

//     // make grid 25% larger than screen
//     gridContainer.style.width = String(width * 1.25) + 'px'
//     gridContainer.style.width = width * 1.25
//     gridContainer.style.height = String(height * 1.25) + 'px'
//     gridContainer.style.height = height * 1.25

//     gridContainer.style.left = String(-width * 0.125) + 'px'
//     gridContainer.style.top = String(-height * 0.125) + 'px'
// }

// function initMasonry() {
//     var grid = document.querySelector('.grid')
//     var msnry = new Masonry(grid, {
//         itemSelector: '.grid-curtain',
//         percentPosition: true,
//     })

//     var msnry = new Masonry('.grid')
// }

// function initListeners() {
//     var gridWidth = grid.element.clientWidth
//     var windowWidth = window.innerWidth

//     var gridHeight = grid.element.clientHeight
//     var windowHeight = window.innerHeight

//     TweenLite.set(grid.element, {x: 0, y: 0})

//     TweenMax.to(grid.element, 1, {
//         x: 0,
//         y: 0,
//         repeat: -1,
//         ease: Linear.easeNone,
//         modifiers: {
//             x: function () {
//                 var currentX = gsap.getProperty(grid.element, 'x')

//                 grid.x = map(MOUSECOORDS.x, 0, windowWidth, gridWidth / 2, -gridWidth / 2)
//                 var easeX = currentX + (grid.x - currentX) * ACCELERATION

//                 TweenLite.set(grid.element, {x: easeX})

//                 return easeX
//             },
//             y: function (y) {
//                 var currentY = gsap.getProperty(grid.element, 'y')

//                 grid.y = map(
//                     MOUSECOORDS.y,
//                     0,
//                     windowHeight,
//                     gridHeight / 2,
//                     -gridHeight / 2
//                 )
//                 var easeY = currentY + (grid.y - currentY) * ACCELERATION

//                 TweenLite.set(grid.element, {y: easeY})

//                 var string = String(easeY) + 'px'

//                 return string
//             },
//         },
//     })

//     window.addEventListener('mousemove', mouseMove)
//     window.addEventListener('touchmove', mouseMove)
//     window.addEventListener('resize', resize)
// }

// function resize() {
//     VW = window.innerWidth
//     VH = window.innerHeight

//     grid.xMax = VW - grid.element.naturalWidth
//     grid.yMax = VH - grid.element.naturalHeight
// }

// function mouseMove(event) {
//     if (event.targetTouches && event.targetTouches[0]) {
//         event.preventDefault()
//         MOUSECOORDS.x = event.targetTouches[0].clientX
//         MOUSECOORDS.y = event.targetTouches[0].clientY
//     } else {
//         MOUSECOORDS.x = event.clientX
//         MOUSECOORDS.y = event.clientY
//     }
// }
