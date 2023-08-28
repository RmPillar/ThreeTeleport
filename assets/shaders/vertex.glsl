uniform float uTime;

varying vec2 vUv;

attribute float aRandom;

void main() {
    vec2 uv = vUv;
    vec3 pos = vec3(position);

    pos += aRandom * sin(uTime * 0.5) * normal;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}