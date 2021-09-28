import * as THREE from '../../../lib/three.module.js'
import PUBLIC_METHOD from '../../../method/method.js'

export default class{
    constructor({group}){
        this.param = {
            text: 'DOKEV',
            color: 0xffffff,
            textSize: 150,
            textHeight: 30,
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
        const text = new THREE.TextGeometry(txt, {
            font: font,
            size: this.param.textSize,
            height: this.param.textHeight,
            curveSegments: 12
        })
        const arr = new THREE.EdgesGeometry(text).attributes.position.array
        const geometry = new THREE.BufferGeometry()
        const coordinate = []
        const temp = []

        for(let i = 0; i < arr.length / 3; i++){
            const x = arr[i * 3]
            const y = arr[i * 3 + 1]
            const z = arr[i * 3 + 2]
            
            if(true){
                coordinate.push([x, y, z])
            }
        }

        for(let i = 0; i < coordinate.length / 2; i++){
            const p1 = coordinate[i * 2]
            const p2 = coordinate[i * 2 + 1]

            if(p1[2] === this.param.textHeight || p2[2] === this.param.textHeight) continue

            temp.push(p1, p2)
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(temp.flat()), 3))

        const sorted = temp.map(e => e[0]).sort((a, b) => a - b)

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