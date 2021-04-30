import * as THREE from '/js/three.module.js';
import {OBJLoader} from '/js/OBJLoader.js';
import {PointerLockControls} from '/js/Controls.js';
import {OrbitControls} from '/js/OrbitControls.js'
import {CameraControls} from '/js/CameraControls.js'

const loader = new OBJLoader();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
var plane = null

var light = new THREE.PointLight(0xfffeb3,1,0,.5);
light.position.set(5,10,5);
scene.add(light)

loader.load('../Planes/P-38/body.obj',function(object){
	object.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
			child.material = new THREE.MeshToonMaterial({color: 0xffffff})
        }
		plane = child
    });
	console.log('as;ldkjf')
	scene.add(object)
	plane.position.set(0,10,0)
	cTest.focus.copy(plane.position)
	plane.scale.set(.1,.1,.1)
})

scene.add( cube );

camera.position.y = 5;


cube.scale.x = 100
cube.scale.z = 100


//var controls = new OrbitControls(camera, renderer.domElement);
var a = 1
var cTest = new CameraControls(camera, renderer.domElement)

//controls.lock();
function animate() {
	//camera.lookAt(scene.position)
	if(plane){
		let upVector = new THREE.Vector3(0,1,0)
		upVector.applyQuaternion(plane.quaternion)
		cTest.focus.copy(plane.position.clone().add(upVector.multiply(3)))
		plane.rotation.copy(camera.rotation)
		plane.rotateY(THREE.Math.degToRad(180))
	}
	//cube.position.set(new THREE.Vector3(0,0,0))
	//console.log(camera.position)
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
	//controls.moveForward(.01)
}

document.addEventListener('keydown',function(event){
	camera.lookAt(plane.position);
	if (event.keyCode == 83){
		//controls.moveForward(-1)
		console.log(plane.material)
	}
})

animate();