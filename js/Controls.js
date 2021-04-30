import {
	Euler,
	EventDispatcher,
	Vector3
} from '/js/three.module.js';

function rad(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

var PointerLockControls = function ( obj, domElement ) {

	if ( domElement === undefined ) {

		console.warn( 'THREE.PointerLockControls: The second parameter "domElement" is now mandatory.' );
		domElement = document.body;

	}

	this.domElement = domElement;
	this.isLocked = false;
	this.currentlyInLock = false;
	this.forceLock = false;
	// Set to constrain the pitch of the this.object
	// Range is 0 to Math.PI radians
	this.minPolarAngle = rad(10); // radians
	this.maxPolarAngle = rad(170); // radians

	//
	// internals
	//

	this.object = obj;

	var scope = this;

	var changeEvent = { type: 'change' };
	var lockEvent = { type: 'lock' };
	var unlockEvent = { type: 'unlock' };

	var euler = new Euler( 0, 0, 0, 'YXZ' );

	var PI_2 = Math.PI / 2;

	var vec = new Vector3();

	function onMouseClick(){
		if(scope.isLocked == true) {
			scope.domElement.requestPointerLock();
		}
	}

	function onMouseMove( event ) {
		if(scope.currentlyInLock == false) return;
		if(scope.currentlyInLock == false && scope.forceLock == true) scope.domElement.requestPointerLock();

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		euler.setFromQuaternion( scope.object.quaternion );

		euler.y -= movementX * 0.002;
		euler.x -= movementY * 0.002;

		euler.x = Math.max( PI_2 - scope.maxPolarAngle, Math.min( PI_2 - scope.minPolarAngle, euler.x ) );

		scope.object.rotation.copy( euler ); 

		scope.dispatchEvent( changeEvent );

	}

	function onPointerlockChange() {

		if ( scope.domElement.ownerDocument.pointerLockElement === scope.domElement ) {

			scope.dispatchEvent( lockEvent );

			scope.currentlyInLock = true;

		} else {

			scope.dispatchEvent( unlockEvent );

			scope.currentlyInLock = false;

		}

	}

	function onPointerlockError() {

		console.error( 'THREE.PointerLockControls: Unable to use Pointer Lock API' );

	}

	this.connect = function () {

		scope.domElement.addEventListener('click', onMouseClick, false)
		scope.domElement.ownerDocument.addEventListener( 'mousemove', onMouseMove, false );
		scope.domElement.ownerDocument.addEventListener( 'pointerlockchange', onPointerlockChange, false );
		scope.domElement.ownerDocument.addEventListener( 'pointerlockerror', onPointerlockError, false );

	};

	this.disconnect = function () {
		
		scope.domElement.removeEventListener('click', onMouseClick, false)
		scope.domElement.ownerDocument.removeEventListener( 'mousemove', onMouseMove, false );
		scope.domElement.ownerDocument.removeEventListener( 'pointerlockchange', onPointerlockChange, false );
		scope.domElement.ownerDocument.removeEventListener( 'pointerlockerror', onPointerlockError, false );

	};

	this.dispose = function () {

		this.disconnect();

	};

	this.getObject = function () { // retaining this method for backward compatibility

		return this.object;

	};

	this.getDirection = function () {

		var direction = new Vector3( 0, 0, - 1 );

		return function ( v ) {

			return v.copy( direction ).applyQuaternion( this.object.quaternion );

		};

	}();

	this.moveForward = function ( distance ) {

		// move forward parallel to the xz-plane
		// assumes this.object.up is y-up

		vec.setFromMatrixColumn( this.object.matrix, 0 );

		vec.crossVectors( this.object.up, vec );

		this.object.position.addScaledVector( vec, distance );

	};

	this.moveRight = function ( distance ) {

		vec.setFromMatrixColumn( this.object.matrix, 0 );

		this.object.position.addScaledVector( vec, distance );

	};

	this.lock = function () {
		scope.domElement.requestPointerLock();
		scope.isLocked = true;
	};

	this.unlock = function () {

		scope.domElement.ownerDocument.exitPointerLock();
		scope.isLocked = false;
	};

	this.connect();

};

PointerLockControls.prototype = Object.create( EventDispatcher.prototype );
PointerLockControls.prototype.constructor = PointerLockControls;

export {PointerLockControls};