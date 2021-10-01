import * as THREE from '../../../lib/three.module.js'
import PUBLIC_METHOD from '../../../method/method.js'
import METHOD from '../method/text.child.method.js'
import SHADER from '../shader/text.child.shader.js'

export default class{
    constructor({group}){
        this.param = {
            text: 'DOKEV',
            std: 'O',
            color: 0xffffff,
            textSize: 150,
            textHeight: 30,
            curveSegments: 12,
            gap: 20,
            fontSrc: 'assets/font/helvetiker_regular.typeface.json',
            opacity: 0.1,
            vel: 0.01
        }

        this.init(group)
    }


    // init
    init(group){
        const loader = new THREE.FontLoader()

        loader.load(this.param.fontSrc, font => {
            this.font = font
            this.pdist = METHOD.getPointDist(font, this.param.std, this.param)
            
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

        this.param.text.split('').forEach((txt, i) => {
            this.createMesh(txt, i)
        })

        const item = this.local.children[this.local.children.length - 1]
        const size = item.position.x + item.geometry.xsize

        this.local.position.x = size / -2
        this.local.position.y = this.param.textSize / -2 
    }
    createMesh(txt, idx){
        const geometry = this.createGeometry(txt)
        const material = this.createMaterial()
        const mesh = new THREE.LineSegments(geometry, material)

        const bMesh = this.local.children[idx - 1]
        const bx = bMesh === undefined ? 0 : bMesh.position.x + bMesh.geometry.xsize
        const cx = (idx === 0 ? 0 : this.param.gap) + bx

        mesh.position.x = cx

        this.local.add(mesh)
    }
    createGeometry(txt){
        const coord = METHOD.get2Dcoord(this.font, txt, this.pdist, this.param)
        const sorted = coord.map(e => e[0]).sort((a, b) => a - b)
        const opacity = Array.from({length: coord.length}, () => this.param.opacity)

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
        //     color: this.param.color
        // })
        return new THREE.ShaderMaterial({
            vertexShader: SHADER.draw.vertex,
            fragmentShader: SHADER.draw.fragment,
            transparent: true,
            uniforms: {
                uColor: {value: new THREE.Color(this.param.color)}
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
                if(array[i] <= this.param.opacity) continue
                array[i] -= this.param.vel
            }

            opacity.needsUpdate = true
        })
    }


    // resize
    resize(){

    } 
}