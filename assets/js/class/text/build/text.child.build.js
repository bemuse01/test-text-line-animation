import * as THREE from '../../../lib/three.module.js'
import PUBLIC_METHOD from '../../../method/method.js'
import METHOD from '../method/text.child.method.js'

export default class{
    constructor({group}){
        this.param = {
            text: 'DOKEV',
            color: 0xffffff,
            textSize: 150,
            textHeight: 30,
            curveSegments: 12,
            gap: 20
        }

        this.init(group)
    }


    // init
    init(group){
        this.create()
        this.add(group)
    }


    // add
    add(group){
        group.add(this.local)
    }


    // create
    create(){
        const loader = new THREE.FontLoader()
        this.local = new THREE.Group()

        loader.load('assets/font/helvetiker_regular.typeface.json', font => {
            this.param.text.split('').forEach((txt, i) => {
                this.createMesh(font, txt, i)
            })

            const item = this.local.children[this.local.children.length - 1]
            const size = item.position.x + item.geometry.xsize

            this.local.position.x = size / -2
            this.local.position.y = this.param.textSize / -2 
        })
    }
    createMesh(font, txt, idx){
        const geometry = this.createGeometry(font, txt)
        const material = this.createMaterial()
        const mesh = new THREE.LineSegments(geometry, material)

        const bMesh = this.local.children[idx - 1]
        const bx = bMesh === undefined ? 0 : bMesh.position.x + bMesh.geometry.xsize
        const cx = (idx === 0 ? 0 : this.param.gap) + bx

        mesh.position.x = cx

        this.local.add(mesh)
    }
    createGeometry(font, txt){
        const coord = METHOD.get2Dcoord(font, txt, this.param)
        const sorted = coord.map(e => e[0]).sort((a, b) => a - b)

        const geometry = new THREE.BufferGeometry()

        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(coord.flat()), 3))

        geometry.xmin = sorted[0]
        geometry.xmax = sorted[sorted.length - 1]
        geometry.xsize = sorted[sorted.length - 1] - sorted[0]

        return geometry
    }
    createMaterial(){
        // return new THREE.MeshBasicMaterial({
        //     color: this.param.color
        // })
        return new THREE.LineBasicMaterial({
            color: this.param.color
        })
    }


    // animate
    animate(){
        // this.local.rotation.x += 0.01
        // this.local.rotation.y += 0.01
    }


    // resize
    resize(){

    } 
}