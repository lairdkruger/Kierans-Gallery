// global variables
var IMAGE_INDICES = {}
var CLICKED_ELEMENT = 0
var CURTAINS_SLIDESHOW = null
var CURTAINS_GRID = null
var FADE_OUT_DURATION = 1000

// window.addEventListener('resize', function() {
//     // force a reload to fix curtain.js visibility bug
//     window.location.reload()
// })

window.addEventListener('load', function() {
    // CURTAINS_GRID = new CurtainsGridScroller(
    //     scrollShader.uniforms,
    //     scrollShader.vertexShader,
    //     scrollShader.fragmentShader
    // )

    CURTAINS_SLIDESHOW = new CurtainsGallery(
        morphShader.uniforms,
        morphShader.vertexShader,
        morphShader.fragmentShader
    )

    document.getElementById('slideshow-canvas').style.display = 'none'

    document.body.classList.add('no-curtains')

    handleClicks()
})

function handleClicks() {
    // ig
    var ig = document.getElementById('ig-logo')
    ig.addEventListener('click', function() {
        window.location = 'https://www.instagram.com/kierankruger/?hl=en'
    })

    // home
    var back = document.getElementsByClassName('title-box')[0]
    back.addEventListener('click', function() {
        window.location.reload()
    })

    // grid image clicks
    var images = document.getElementsByClassName('grid-image')

    for (var i = 0; i < images.length; i++) {
        IMAGE_INDICES[images[i].src] = i

        images[i].addEventListener('click', function(event) {
            var target = event.target.src
            CLICKED_ELEMENT = IMAGE_INDICES[target]

            CURTAINS_SLIDESHOW.refreshIndex()

            document.getElementById('grid-canvas').style.display = 'none'
            document.getElementById('hero-box').style.display = 'none'
            document.getElementsByClassName('grid-aligner')[0].style.opacity = 0

            document.getElementById('slideshow-canvas').style.display = 'block'
            document.getElementById('navigation').style.pointerEvents = 'all'
        })
    }

    // back click
    var back = document.getElementById('navigation-back')
    back.addEventListener('click', function() {
        document.getElementById('slideshow-canvas').style.display = 'none'
        document.getElementsByClassName('grid-aligner')[0].style.opacity = 1
        document.getElementById('grid-canvas').style.display = 'block'
        document.getElementById('hero-box').style.display = 'flex'
        document.getElementById('navigation').style.pointerEvents = 'none'
    })
}
