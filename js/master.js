window.addEventListener('load', function () {
    document.body.classList.add('no-curtains')

    var tableTop = new Tabletop()

    var transition = new GridToFullscreenEffect(
        document.getElementById('transition-canvas'),
        Array.from(document.getElementsByClassName('grid-curtain'))
    )
})
