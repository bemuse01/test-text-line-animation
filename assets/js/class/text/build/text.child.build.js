import * as THREE from '../../../lib/three.module.js'
import PUBLIC_METHOD from '../../../method/method.js'

export default class{
    constructor({group}){
        this.param = {
            text: 'X',
            color: 0xffffff,

        }

        this.init(group)
    }


    // init
    init(group){
        this.create(group)
        // this.add(group)
    }


    // add
    add(group){
        group.add(this.mesh)
    }


    // create
    create(group){
        const loader = new THREE.FontLoader()
        
        loader.load('assets/font/helvetiker_regular.typeface.json', font => this.createMesh(group, font))
    }
    createMesh(group, font){
        const geometry = this.createGeometry(font)
        const material = this.createMaterial()
        this.mesh = new THREE.Line(geometry, material)

        console.log(geometry.attributes.position)

        group.add(this.mesh)
    }
    createGeometry(font){
        const arr = new THREE.TextGeometry(this.param.text, {
            font: font,
            size: 150,
            height: 10,
            curveSegments: 1
        }).attributes.position.array

        const key = []
        const coordinate = []
        const pos = []

        for(let i = 0; i < arr.length / 3; i++){
            const x = arr[i * 3]
            const y = arr[i * 3 + 1]
            const z = arr[i * 3 + 2]
            
            const k = '' + x + y + z

            if(z === 0 && !key.includes(k)){
                key.push(k)
                coordinate.push(x, y, z)
            }
        }

        const center = PUBLIC_METHOD.getCenterPoint(coordinate)
        const std = center.clone().add(new THREE.Vector2(1, 0))
        console.log(center, std)

        for(let i = 0; i < coordinate.length / 3; i++){
            const x = coordinate[i * 3]
            const y = coordinate[i * 3 + 1]
            const z = coordinate[i * 3 + 2]
            
            const v1 = new THREE.Vector2(x, y).sub(center)
            const v2 = std.sub(center)

            const calc = v1.dot(v2) / (v1.length() * v2.length())

            const theta = Math.acos(calc)

            pos.push([x, y, z, theta])
        }

        const newPos = [...pos].sort((a, b) => a[3] - b[3]).map(e => e.slice(0, 3)).flat()

        console.log(pos)

        const geometry = new THREE.BufferGeometry()

        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(newPos), 3))

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
        if(!this.mesh) return

        this.mesh.rotation.x += 0.01
        this.mesh.rotation.y += 0.01
    }


    // resize
    resize(){

    } 
}