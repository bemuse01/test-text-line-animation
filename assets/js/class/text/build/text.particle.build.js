import * as THREE from '../../../lib/three.module.js'
import PARAM from '../param/text.particle.param.js'
import SHADER from '../shader/text.particle.shader.js'
import METHOD from '../method/text.particle.method.js'

export default class{
    constructor({group, gpuCompute}){
        this.gpuCompute = gpuCompute
        this.init(group)
    }


    // init
    init(group){
        this.initGPGPU()
        this.create()
        this.add(group)
    }


    // add
    add(group){
        group.add(this.mesh)
    }


    // gpgpu
    initGPGPU(){
        this.createTexture()
        this.initTexture()
    }

    // set texutre
    createTexture(){
        this.createVelocityTexture()
        this.createPositionTexture()
    }
    initTexture(){
        this.initVelocityTexture()
        this.initPositionTexture()
    }

    // velocity texture
    createVelocityTexture(){
        const velocity = this.gpuCompute.createTexture()

        METHOD.fillVelocityTexture(velocity, PARAM)

        this.velocityVariable = this.gpuCompute.addVariable('tVelocity', SHADER.velocity, velocity)
    }
    initVelocityTexture(){
        this.gpuCompute.setVariableDependencies(this.velocityVariable, [this.velocityVariable, this.positionVariable])

        // this.velocityUniforms = this.velocityVariable.material.uniforms
    }

    // position texture
    createPositionTexture(){
        const position = this.gpuCompute.createTexture()

        METHOD.fillPositionTexture(position)

        this.positionVariable = this.gpuCompute.addVariable('tPosition', SHADER.position, position)
    }
    initPositionTexture(){
        this.gpuCompute.setVariableDependencies(this.positionVariable, [this.positionVariable, this.velocityVariable])

        this.positionUniforms = this.positionVariable.material.uniforms
        
        this.positionUniforms['uCurrentPos'] = {value: Array.from({length: PARAM.h}, () => new THREE.Vector2(0, 0))}
    }
    

    // create
    create(){
        this.createMesh()
    }
    createMesh(){
        const geometry = this.createGeometry()
        const material = this.createMaterial()
        this.mesh = new THREE.Points(geometry, material)
    }
    createGeometry(){
        const geometry = new THREE.BufferGeometry()

        const coord = METHOD.createAttributeCoord(PARAM)

        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(PARAM.w * PARAM.h * 3), 3))
        geometry.setAttribute('aCoord', new THREE.BufferAttribute(coord, 2))

        return geometry
    }
    createMaterial(){
        return new THREE.ShaderMaterial({
            vertexShader: SHADER.draw.vertex,
            fragmentShader: SHADER.draw.fragment,
            transparent: true,
            uniforms: {
                uPosition: {value: null},
                uVelocity: {value: null},
                uSize: {value: PARAM.size},
                uColor: {value: new THREE.Color(PARAM.color)}
            }
        })
    }


    // animate
    animate({child}){
        const currentPos = child.getCurrentPos()

        if(!currentPos) return

        this.positionUniforms['uCurrentPos'].value = currentPos
        this.mesh.material.uniforms['uPosition'].value = this.gpuCompute.getCurrentRenderTarget(this.positionVariable).texture
        this.mesh.material.uniforms['uVelocity'].value = this.gpuCompute.getCurrentRenderTarget(this.velocityVariable).texture
    }


    // resize
    resize(){

    }
}