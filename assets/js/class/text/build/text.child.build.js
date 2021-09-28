import * as THREE from '../../../lib/three.module.js'
import PUBLIC_METHOD from '../../../method/method.js'

export default class{
    constructor({group}){
        this.param = {
            text: 'NETFLIX',
            color: 0xffffff,
            textHeight: 30
        }

        this.init(group)
    }


    // init
    init(group){
        this.create(group)
        this.add(group)
    }


    // add
    add(group){
        group.add(this.local)
    }


    // create
    create(group){
        const loader = new THREE.FontLoader()
        this.local = new THREE.Group()

        loader.load('assets/font/helvetiker_regular.typeface.json', font => {
            this.param.text.split('').forEach(txt => {
                this.createMesh(font, txt)
            })
        })
    }
    createMesh(font, txt){
        const geometry = this.createGeometry(font, txt)
        const material = this.createMaterial()
        const mesh = new THREE.LineSegments(geometry, material)

        this.local.add(mesh)
    }
    createGeometry(font, txt){
        const text = new THREE.TextGeometry(txt, {
            font: font,
            size: 150,
            height: this.param.textHeight,
            curveSegments: 12
        })

        const edge = new THREE.EdgesGeometry(text)
        const geometry = new THREE.BufferGeometry()

        const arr = edge.attributes.position.array

        // const key = []
        const coordinate = []
        const temp = []

        for(let i = 0; i < arr.length / 3; i++){
            const x = arr[i * 3]
            const y = arr[i * 3 + 1]
            const z = arr[i * 3 + 2]
            
            // const k = '' + x + y + z

            if(true){
                // key.push(k)
                coordinate.push([x, y, z])
            }
        }

        for(let i = 0; i < coordinate.length / 2; i++){
            const p1 = coordinate[i * 2]
            const p2 = coordinate[i * 2 + 1]

            if(p1[2] === this.param.textHeight || p2[2] === this.param.textHeight) continue

            temp.push(p1, p2)
        }

        console.log(temp)

        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(temp.flat()), 3))

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