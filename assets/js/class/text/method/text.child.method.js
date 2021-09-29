import * as THREE from '../../../lib/three.module.js'

export default {
    getPointDist(font, std, param){
        const text = new THREE.TextGeometry(std, {
            font: font,
            size: param.textSize,
            height: param.textHeight,
            curveSegments: param.curveSegments
        })
        const arr = new THREE.EdgesGeometry(text).attributes.position.array

        const p1 = {x: arr[0], y: arr[1], z: arr[2]}
        const p2 = {x: arr[3], y: arr[4], z: arr[5]}

        const dist = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2 + (p1.z - p2.z) ** 2)

        return dist
    },
    get2Dcoord(font, txt, param){
        const text = new THREE.TextGeometry(txt, {
            font: font,
            size: param.textSize,
            height: param.textHeight,
            curveSegments: param.curveSegments
        })
        const arr = new THREE.EdgesGeometry(text).attributes.position.array

        const coordinate = []
        const temp = []

        for(let i = 0; i < arr.length / 3; i++){
            const x = arr[i * 3]
            const y = arr[i * 3 + 1]
            const z = arr[i * 3 + 2]
            
            coordinate.push([x, y, z])
        }

        for(let i = 0; i < coordinate.length / 2; i++){
            const p1 = coordinate[i * 2]
            const p2 = coordinate[i * 2 + 1]

            if(p1[2] === param.textHeight || p2[2] === param.textHeight) continue

            temp.push(p1, p2)
        }

        return temp
    }
}