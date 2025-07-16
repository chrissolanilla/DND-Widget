import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import gsap from 'gsap';

const sectionWrap = document.getElementById('sectionWrap');

//scene and render
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.domElement.id = 'three-canvas';
sectionWrap.appendChild(renderer.domElement);

//camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 15);
camera.lookAt(0, 0, 0);

//resize
function resizeWindow() {
	const width = window.innerWidth;
	const height = window.innerHeight;
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize(width, height);
}
resizeWindow();
window.addEventListener('resize', resizeWindow);

//lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

//d20
const loader = new GLTFLoader();
let d20;

loader.load('./assets/scene.gltf', (gltf) => {
	d20 = gltf.scene;

	// Center the model
	const box = new THREE.Box3().setFromObject(d20);
	const center = box.getCenter(new THREE.Vector3());
	d20.position.sub(center);

	d20.scale.set(2, 2, 2);
	d20.position.y = 0;

	scene.add(d20);
});

//anime
function animate() {
	renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

//click and drag fling
let dragging = false;
let startY = 0;
let endY = 0;

renderer.domElement.addEventListener('mousedown', (e) => {
	if (!d20) return;
	dragging = true;
	startY = e.clientY;
});

renderer.domElement.addEventListener('mouseup', (e) => {
	if (!dragging || !d20) return;
	endY = e.clientY;
	const velocity = (startY - endY) * 0.02; // sensitivity

	// Reset rotation
	d20.rotation.set(0, 0, 0);

	// Toss animation
	gsap.to(d20.position, {
		y: Math.max(1, velocity),
		duration: 0.3,
		ease: 'power2.out'
	});
	gsap.to(d20.position, {
		y: 0,
		delay: 0.3,
		duration: 0.5,
		ease: 'bounce.out'
	});
	gsap.to(d20.rotation, {
		x: Math.random() * Math.PI * 6,
		y: Math.random() * Math.PI * 6,
		z: Math.random() * Math.PI * 6,
		duration: 1
	});

	dragging = false;
});

//light gui
const gui = new GUI();
gui.domElement.style.position = 'fixed';
gui.domElement.style.top = '10px';
gui.domElement.style.right = '10px';
document.body.appendChild(gui.domElement);

gui.add(ambientLight, 'intensity', 0, 2).name('Ambient Intensity');
gui.add(directionalLight, 'intensity', 0, 2).name('Directional Intensity');

//add floor
const floorGeometry = new THREE.PlaneGeometry(50, 50);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1;
scene.add(floor);


