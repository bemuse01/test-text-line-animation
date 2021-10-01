import PARAM from '../param/text.particle.param.js'

export default {
    draw: {
        vertex: `
        uniform float uSize;
        uniform sampler2D uPosition;
        uniform sampler2D uVelocity;
        
        attribute vec2 aCoord;
        
        varying float vOpacity;
        varying vec3 vPosition;

        void main(){
            ivec2 coord = ivec2(aCoord);
            vec3 nPosition = position; 

            vec4 pos = texelFetch(uPosition, coord, 0);
            vec4 vel = texelFetch(uVelocity, coord, 0);

            nPosition.xyz = pos.xyz;
            vOpacity = vel.z;
            vPosition = nPosition;

            gl_PointSize = uSize;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(nPosition, 1.0);
        }
    `,
    fragment: `
        uniform vec3 uColor;

        varying float vOpacity;
        varying vec3 vPosition;

        void main(){
            gl_FragColor = vec4(uColor, vOpacity);
        }
    `
    },
    velocity: `
        void main(){
            vec2 uv = gl_FragCoord.xy / resolution.xy;

            // vel.x == x velocity
            // vel.y == y velocity
            // vel.z == current life
            // vel.w == life velocity
            vec4 vel = texture(tVelocity, uv);
            
            if(vel.z <= 0.0) vel.z = 1.0;
            else vel.z -= vel.w;

            gl_FragColor = vel;
        }
    `,
    position: `
        uniform vec2 uCurrentPos[${PARAM.h}];

        void main(){
            vec2 uv = gl_FragCoord.xy / resolution.xy;
            ivec2 coord = ivec2(gl_FragCoord.xy);

            // pos.x == position x
            // pos.y == position y
            // pos.z == position z
            // pos.w == none
            vec4 pos = texture(tPosition, uv);

            // vel.x == x velocity
            // vel.y == y velocity
            // vel.z == current life
            vec4 vel = texture(tVelocity, uv);

            if(vel.z <= 0.0){
                pos.xy = uCurrentPos[coord.y];
            }

            pos.xy -= vel.xy;

            gl_FragColor = pos;
        }
    `
}