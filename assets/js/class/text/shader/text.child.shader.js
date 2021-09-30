export default {
    draw: {
        vertex: `
            attribute float opacity;

            varying float vOpacity;

            void main(){
                vOpacity = opacity;

                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragment: `
            uniform vec3 uColor;

            varying float vOpacity;

            void main(){
                gl_FragColor = vec4(uColor, vOpacity);
            }
        `
    }
}