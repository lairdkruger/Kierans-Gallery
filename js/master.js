window.addEventListener('load', function () {
    init()
})

function init() {
    document.body.classList.add('no-curtains')

    var tableTop = new Tabletop()
    loadTransitions()
}
