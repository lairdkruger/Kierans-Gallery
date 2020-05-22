function init() {
    document.body.classList.add('no-curtains')

    if (window.innerWidth > 480) {
        var tableTop = new Tabletop()
    } else {
        document.getElementsByTagName('body')[0].style.overflowX = 'auto'
        document.getElementsByTagName('body')[0].style.overflowY = 'auto'
    }

    loadTransitions()
}
