import * as THREE from '/three.module.js';
import {OBJLoader} from '/OBJLoader.js';

const loader = new OBJLoader();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
var plane = null

loader.load('../Planes/P-38/body.obj',function(object){
	plane = object
	scene.add(object)
})

scene.add( cube );

camera.position.z = 5;



controls = new PointerLockControls(camera, renderer.domElement);
var a = 1
controls.addEventListener('lock',function(){
	a+=1;
	console.log('gaming'+'bruh'+a.toString());
})
controls.lock();
function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
	controls.moveForward(.01)
}
animate();