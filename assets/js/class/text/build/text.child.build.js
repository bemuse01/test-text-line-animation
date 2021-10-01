import * as THREE from '../../../lib/three.module.js'
import METHOD from '../method/text.child.method.js'
import SHADER from '../shader/text.child.shader.js'
import PARAM from '../param/text.child.param.js'

export default class{
    constructor({group}){
        this.init(group)
    }


    // init
    init(group){
        const loader = new THREE.FontLoader()

        loader.load(PARAM.fontSrc, font => {
            this.font = font
            this.pdist = METHOD.getPointDist(font, PARAM.std, PARAM)
            
            this.create()
            this.add(group)
        })
    }


    // add
    add(group){
        group.add(this.local)
    }


    // create
    create(){
        this.local = new THREE.Group()

        PARAM.text.split('').forEach((txt, i) => {
            this.createMesh(txt, i)
        })

        const item = this.local.children[this.local.children.length - 1]
        const size = item.position.x + item.geometry.xsize

        this.local.position.x = size / -2
        this.local.position.y = PARAM.textSize / -2 
    }
    createMesh(txt, idx){
        const geometry = this.createGeometry(txt)
        const material = this.createMaterial()
        const mesh = new THREE.LineSegments(geometry, material)

        const bMesh = this.local.children[idx - 1]
        const bx = bMesh === undefined ? 0 : bMesh.position.x + bMesh.geometry.xsize
        const cx = (idx === 0 ? 0 : PARAM.gap) + bx

        mesh.position.x = cx

        this.local.add(mesh)
    }
    createGeometry(txt){
        const coord = METHOD.get2Dcoord(this.font, txt, this.pdist, PARAM)
        const sorted = coord.map(e => e[0]).sort((a, b) => a - b)
        const opacity = Array.from({length: coord.length}, () => PARAM.opacity)

        const geometry = new THREE.BufferGeometry()

        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(coord.flat()), 3))
        geometry.setAttribute('opacity', new THREE.BufferAttribute(new Float32Array(opacity), 1))

        geometry.xmin = sorted[0]
        geometry.xmax = sorted[sorted.length - 1]
        geometry.xsize = sorted[sorted.length - 1] - sorted[0]
        geometry.idx = 0

        return geometry
    }
    createMaterial(){
        // return new THREE.LineBasicMaterial({
        //     color: PARAM.color
        // })
        return new THREE.ShaderMaterial({
            vertexShader: SHADER.draw.vertex,
            fragmentShader: SHADER.draw.fragment,
            transparent: true,
            uniforms: {
                uColor: {value: new THREE.Color(PARAM.color)}
            }
        })
    }


    // animate
    animate(){
        // this.local.rotation.x += 0.01
        // this.local.rotation.y += 0.01
        if(!this.local) return

        this.local.children.forEach(mesh => {
            const geometry = mesh.geometry
            const opacity = geometry.attributes.opacity
            const array = opacity.array

            array[geometry.idx] = 1
            geometry.idx = (geometry.idx + 1) % array.length

            for(let i = 0; i < array.length; i++) {
                if(array[i] <= PARAM.opacity) continue
                array[i] -= PARAM.vel
            }

            opacity.needsUpdate = true
        })
    }


    // resize
    resize(){

    }
    
    
    // get
    getCurrentPos(){
        if(!this.local) return false

        const pos = []
        this.local.children.forEach(mesh => {
            const geometry = mesh.geometry
            const idx = geometry.idx
            const array = geometry.attributes.position.array

            const x = array[idx * 3] + mesh.position.x + this.local.position.x
            const y = array[idx * 3 + 1] + this.local.position.y

            pos.push(new THREE.Vector2(x, y))
        })
        return pos
    }
}