/*
Based on the epic study by Daniel Velasquez
https://tympanus.net/codrops/2019/05/22/creating-grid-to-fullscreen-animations-with-three-js/

Cheers g
*/

class GridToFullscreenEffect {
    constructor(container, items) {
        this.container = container
        this.items = items
        this.camera = null
        this.scene = null
        this.renderer = null

        this.uniforms = {
            uProgress: new THREE.Uniform(0),
            uMeshScale: new THREE.Uniform(new THREE.Vector2(1, 1)),
            uMeshPosition: new THREE.Uniform(new THREE.Vector2(0, 0)),
            uViewSize: new THREE.Uniform(new THREE.Vector2(1, 1)),
            uColor: new THREE.Uniform(new THREE.Vector3(20, 20, 20)),
        }
        this.animating = false
        this.state = 'grid'
        this.itemIndex = -1

        this.init()
    }

    toGrid() {
        if (this.state === 'grid' || this.isAnimating) return

        this.animating = true
        this.tween = TweenLite.to(this.uniforms.uProgress, 1, {
            value: 0,
            onUpdate: this.render.bind(this),
            onComplete: () => {
                this.isAnimating = false
                this.state = 'grid'
                this.container.style.zIndex = -1
                this.items[this.itemIndex].style.opacity = 1
            },
        })
    }

    toFullscreen() {
        if (this.state === 'fullscreen' || this.isAnimating) return

        this.animating = true
        this.container.style.zIndex = 2
        this.items[this.itemIndex].style.opacity = 0
        this.tween = TweenLite.to(this.uniforms.uProgress, 1, {
            value: 1,
            onUpdate: this.render.bind(this),
            onComplete: () => {
                this.isAnimating = false
                this.state = 'fullscreen'
                this.toGrid()
            },
        })
    }

    init() {
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
        })
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.container.appendChild(this.renderer.domElement)

        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            10000
        )
        this.camera.position.z = 50
        this.camera.lookAt = this.scene.position

        const viewSize = this.getViewSize()
        this.uniforms.uViewSize.value.x = viewSize.width
        this.uniforms.uViewSize.value.y = viewSize.height

        const segments = 128
        var geometry = new THREE.PlaneBufferGeometry(1, 1, segments, segments)
        // We'll be using the shader material later on ;)
        var material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.DoubleSide,
        })
        this.mesh = new THREE.Mesh(geometry, material)
        this.scene.add(this.mesh)
        window.addEventListener('resize', this.onResize.bind(this))

        for (let i = 0; i < this.items.length; i++) {
            const element = this.items[i]
            element.addEventListener('mousedown', (ev) => this.onGridImageClick(ev, i))
        }
    }

    updateMesh() {
        if (this.itemIndex === -1) return

        const item = this.items[this.itemIndex]
        const rect = item.getBoundingClientRect()
        const viewSize = this.getViewSize()

        // 1. Transform pixel units to camera's view units
        const widthViewUnit = (rect.width * viewSize.width) / window.innerWidth
        const heightViewUnit = (rect.height * viewSize.height) / window.innerHeight
        let xViewUnit = (rect.left * viewSize.width) / window.innerWidth
        let yViewUnit = (rect.top * viewSize.height) / window.innerHeight

        // 2. Make units relative to center instead of the top left.
        xViewUnit = xViewUnit - viewSize.width / 2
        yViewUnit = yViewUnit - viewSize.height / 2

        // 3. Make the origin of the plane's position to be the center instead of top Left.
        let x = xViewUnit + widthViewUnit / 2
        let y = -yViewUnit - heightViewUnit / 2

        // 4. Scale and position mesh
        const mesh = this.mesh
        // Since the geometry's size is 1. The scale is equivalent to the size.
        mesh.scale.x = widthViewUnit
        mesh.scale.y = heightViewUnit
        mesh.position.x = x
        mesh.position.y = y

        this.uniforms.uMeshPosition.value.x = x / widthViewUnit
        this.uniforms.uMeshPosition.value.y = y / heightViewUnit
        this.uniforms.uMeshScale.value.x = widthViewUnit
        this.uniforms.uMeshScale.value.y = heightViewUnit

        const styles = window.getComputedStyle(item)
        let color = styles.getPropertyValue('background-color')
        color = color.substring(color.indexOf('(') + 1, color.indexOf(')'))

        const rgbColors = color.split(',', 3).map((c) => parseInt(c))
        this.uniforms.uColor.value.x = rgbColors[0]
        this.uniforms.uColor.value.y = rgbColors[1]
        this.uniforms.uColor.value.z = rgbColors[2]
    }

    onGridImageClick(ev, itemIndex) {
        // getBoundingClientRect gives pixel units relative to the top left of the pge

        this.itemIndex = itemIndex

        this.updateMesh()

        // this.render();
        this.toFullscreen()
    }

    setVertex(newVertex) {
        this.mesh.material.vertexShader = newVertex
        this.mesh.material.needsUpdate = true
    }

    render() {
        this.renderer.render(this.scene, this.camera)
    }

    getViewSize() {
        const fovInRadians = (this.camera.fov * Math.PI) / 180
        const height = Math.abs(this.camera.position.z * Math.tan(fovInRadians / 2) * 2)

        return {width: height * this.camera.aspect, height}
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.updateMesh()
        this.render()
    }
}
const leftActivation = `
		float activation = uv.x;
`
const topActivation = `
		float activation = 1.- uv.y;
`
const topLeftActivation = `
		float activation = (+uv.x-uv.y+1.)/2.;
`
const centerActivation = `
        float maxDistance = distance(vec2(0.),vec2(0.5));
        float dist = distance(vec2(0.), uv-0.5);
        float activation = smoothstep(0.,maxDistance,dist);
        
        `
const createVertex = (activation) => {
    return `
	uniform float uProgress;
	uniform vec2 uMeshScale;
	uniform vec2 uMeshPosition;
	uniform vec2 uViewSize;
    varying vec2 vUv;

	void main(){
	    vec3 pos = position.xyz;
		
		${activation}
		
	    float latestStart = 0.5;
      	float startAt = activation * latestStart;
       float vertexProgress = smoothstep(startAt,1.,uProgress);
       
		// Scale to page view size/page size

	    vec2 scaleToViewSize = uViewSize / uMeshScale - 1.;
        vec2 scale = vec2(
          1. + scaleToViewSize * vertexProgress
        );
        pos.xy *= scale;
        
        // Move towards center 
        pos.y += -uMeshPosition.y * vertexProgress;
        pos.x += -uMeshPosition.x * vertexProgress;
        
         gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.);
         vUv = uv;
	}
`
}
const vertexShader = createVertex(leftActivation)

const fragmentShader = `
    uniform vec3 uColor;
    varying vec2 vUv;

	void main(){
        vec3 color = uColor /255.;
        color = mix(color, vec3(0.9,0.5,0.5), vUv.x);
            gl_FragColor = vec4(color,1.);
	}
`

const activationEles = Array.from(document.getElementsByClassName('activation-box'))

activationEles.forEach((ele, i) => {
    ele.addEventListener('click', () => {
        console.log('click', i)
        activationEles.forEach((ele, index) => {
            if (index === i) {
                ele.classList.add('active')
            } else {
                ele.classList.remove('active')
            }
        })
        switch (i) {
            case 0:
                effect.setVertex(createVertex(leftActivation))
                break
            case 1:
                effect.setVertex(createVertex(topActivation))
                break
            case 2:
                effect.setVertex(createVertex(topLeftActivation))
                break
            case 3:
                effect.setVertex(createVertex(centerActivation))
                break
            default:
                break
        }
    })
})
