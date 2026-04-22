import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.152/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.152/examples/jsm/loaders/GLTFLoader.js";
import gsap from "https://cdn.skypack.dev/gsap";
import ScrollTrigger from "https://cdn.skypack.dev/gsap/ScrollTrigger.js";

gsap.registerPlugin(ScrollTrigger);

// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color("#050505");

// CAMERA
const camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 0.1, 100);
camera.position.set(0,1,6);

// RENDERER
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#webgl"),
  antialias: true
});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

// LIGHT
const light = new THREE.PointLight(0xffffff, 2);
light.position.set(5,5,5);
scene.add(light);

// MODEL
const loader = new GLTFLoader();
let cloth;

loader.load("./assets/cloth.glb", (gltf)=>{
  cloth = gltf.scene;
  cloth.scale.set(2,2,2);
  scene.add(cloth);
});

// SCROLL ANIMATION
gsap.to(camera.position, {
  z: 3,
  scrollTrigger:{
    trigger: ".sections",
    start: "top top",
    end: "bottom bottom",
    scrub: true
  }
});

// MOUSE INTERACTION
window.addEventListener("mousemove", (e)=>{
  if(!cloth) return;

  const x = (e.clientX / innerWidth - 0.5);
  const y = (e.clientY / innerHeight - 0.5);

  gsap.to(cloth.rotation, {
    y: x,
    x: y,
    duration: 1
  });
});

// AI BUTTON (DEMO)
document.getElementById("generate").onclick = ()=>{
  if(!cloth) return;

  gsap.to(cloth.rotation, {
    y: cloth.rotation.y + Math.PI,
    duration: 1
  });
};

// SOUND
document.body.addEventListener("click", ()=>{
  document.getElementById("ambient").play();
});

// ANIMATE
function animate(){
  requestAnimationFrame(animate);

  if(cloth){
    cloth.rotation.y += 0.002;
  }

  renderer.render(scene, camera);
}
animate();

// RESIZE
addEventListener("resize", ()=>{
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
