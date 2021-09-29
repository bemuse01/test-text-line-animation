import * as THREE from '../../../lib/three.module.js'
import PUBLIC_METHOD from '../../../method/method.js'

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

        const dist = PUBLIC_METHOD.getPointsDist(p1, p2)

        return dist
    },
    get2Dcoord(font, txt, pdist, param){
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

        const coord = this.expandCoord(temp, pdist)

        console.log(coord, temp)

        return coord
    },
    expandCoord(temp, pdist){
        let coord = []

        for(let i = 0; i < temp.length / 2; i++){
            const p1 = temp[i * 2]
            const p2 = temp[i * 2 + 1]

            const dist = PUBLIC_METHOD.getPointsDist({x: p1[0], y: p1[1], z: p2[2]}, {x: p2[0], y: p2[1], z: p2[2]})
            const xd = Math.abs(p1[0] - p2[0])
            const xs = -Math.sign(p1[0] - p2[0])
            const yd = Math.abs(p1[1] - p2[1])
            const ys = -Math.sign(p1[1] - p2[1])

            if(dist < pdist * 2) coord.push(p1, p2)
            else{
                const arr = [p1]
                const len = Math.floor(dist / pdist)
                const per = 1 / len

                for(let i = per; i < 1 - per; i += per){
                    const x = p1[0] + xd * i * xs
                    const y = p1[1] + yd * i * ys
                    const z = 0

                    arr.push([x, y, z], [x, y, z])
                }

                arr.push(p2)
                coord = coord.concat(arr)
            }
        }

        return coord
    }
}