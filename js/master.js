var MOUSECOORDS

window.addEventListener('load', function () {
    document.body.classList.add('no-curtains')

    initMasonry()
    initListeners()
    var tabletop = new Tabletop()
    // CURTAINS_GRID = new CurtainsTabletopScroller(
    //     scrollShader.uniforms,
    //     scrollShader.vertexShader,
    //     scrollShader.fragmentShader
    // )
})

function initMasonry() {
    var grid = document.querySelector('.grid')
    var msnry = new Masonry(grid, {
        itemSelector: '.grid-curtain',
        columnWidth: 200,
        percentPosition: true,
    })

    var msnry = new Masonry('.grid')
}

function initListeners() {
    var _this = this

    $(window).on('mousemove', function (e) {
        onMouseMove(e)
        console.log(MOUSECOORDS)
    })
}

function onMouseMove(e) {
    var windowWidth = $(window).width()
    var windowHeight = $(window).height()
    var x = e.clientX - windowWidth / 2
    var y = e.clientY - windowHeight / 2

    var normalX = x / (windowWidth / 2)
    var normalY = y / (windowHeight / 2)

    MOUSECOORDS = [normalX, normalY]
}
