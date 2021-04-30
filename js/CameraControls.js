import * as THREE from '/js/three.module.js'

var RAD = THREE.Math.degToRad;

//test
var testSphere = new THREE.Spherical(5,0,0);
var v = new THREE.Vector3(0,0,0);
console.log(testSphere)
console.log(v);
console.log('AFTER CHANGE');
v.setFromSpherical(testSphere);
console.log(v)
//testSphere.phi += RAD(45)
v.setFromSpherical(testSphere)
console.log(v)

var CameraControls = function(camera,domElement){
	var scope = this;
	this.camera = camera;
	this.domElement = domElement;
	this.focus = new THREE.Vector3(0,0,0)

	this.minPolarAngle = 0;
	this.maxPolarAngle = Math.PI

	function onMouseMove(event){
		let offset = new THREE.Vector3(0,0,0)
		camera.rotation.order = 'YXZ'
		//camera.rotation.x-=event.movementY*.01;
		//camera.rotation.y-=event.movementX*.01;
		testSphere.phi-=event.movementY*.01;
		testSphere.theta-=event.movementX*.01;
		testSphere.phi = Math.max( scope.minPolarAngle, Math.min( scope.maxPolarAngle, testSphere.phi ) );
		testSphere.makeSafe()
		offset.setFromSpherical(testSphere)
		camera.position.copy(scope.focus.clone().add(offset))
		camera.lookAt(scope.focus)
	}
	function onMouseClick(){
		scope.domElement.requestPointerLock()
	}
	this.connect = function(){
		scope.domElement.addEventListener('click',onMouseClick);
		scope.domElement.addEventListener('mousemove',onMouseMove);
	}
	this.connect();
}

export{CameraControls};