window.addEventListener('load', function () {
    document.body.classList.add('no-curtains')

    var tableTop = new Tabletop()

    var curtainsTabletop = new CurtainsTabletop(
        scrollShader.uniforms,
        scrollShader.vertexShader,
        scrollShader.fragmentShader
    )
})
