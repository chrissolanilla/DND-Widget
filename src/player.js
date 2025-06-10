import * as THREE from 'three';

const sectionWrap = document.getElementById('sectionWrap');

const scene = new THREE.Scene();
let camera;
// const renderer = new THREE.WebGLRenderer({ antialias: true });
const renderer = new THREE.WebGLRenderer({
	antialias: true,
	alpha: true  // <--- this is critical for transparency
});
renderer.domElement.id = 'three-canvas';
sectionWrap.appendChild(renderer.domElement);

function resizeWindow() {
	const width = window.innerWidth;
	const height = window.innerHeight;

	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	renderer.setSize(width, height);
}

// Create camera with initial size
const initialWidth = window.innerWidth;
const initialHeight = window.innerHeight;
camera = new THREE.PerspectiveCamera(75, initialWidth / initialHeight, 0.1, 1000);
camera.position.z = 5;

// Set renderer size initially
renderer.setSize(initialWidth, initialHeight);

// Handle window resize
window.addEventListener('resize', resizeWindow);

// Create cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Animate
function animate() {
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
	renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

