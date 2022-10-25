/////////////////////////////////////////////////////////////////////////////////////////
//  UBC CPSC 314,  September 2022  -- A3 Template
/////////////////////////////////////////////////////////////////////////////////////////

import * as THREE from 'three';
import { OrbitControls } from "./js/OrbitControls.js";
import { OBJLoader } from "./js/OBJLoader.js";
import { Keyframe, Motion } from "./motion.js";

console.log('hello world');

var flip = false;
var giraffeColor = 0xFFFF00;
var up = false;
var down = false;
var a=5;  
var b=2.6;
console.log('a=',a,'b=',b);
var myvector = new THREE.Vector3(0,1,2);
console.log('myvector =',myvector);

var animation = true;
var meshesLoaded = false;
var RESOURCES_LOADED = false;
var deg2rad = Math.PI/180;

// give the following global scope (in this file), which is useful for motions and objects
// that are related to animation

var myboxMotion = new Motion(myboxSetMatrices);     
var giraffeMotion = new Motion(giraffeSetMatrices);  
var link1, link2, link3, link4, link5, link6, link7, link8, link9, link10, link11, link12;
var linkFrame1, linkFrame2, linkFrame3, linkFrame4, linkFrame5, linkFrame6, linkFrame7, linkFrame8, linkFrame9, linkFrame10, linkFrame11, linkFrame12;
var sphere;    
var mybox;     
var meshes = {};  


// SETUP RENDERER & SCENE

var canvas = document.getElementById('canvas');
var camera;
var light;
var ambientLight;
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xd0f0d0);     // set background colour
canvas.appendChild(renderer.domElement);

//////////////////////////////////////////////////////////
//  initCamera():   SETUP CAMERA
//////////////////////////////////////////////////////////

function initCamera() {
    // set up M_proj    (internally:  camera.projectionMatrix )
    var cameraFov = 30;     // initial camera vertical field of view, in degrees
      // view angle, aspect ratio, near, far
    camera = new THREE.PerspectiveCamera(cameraFov,1,0.1,1000); 

    var width = 10;  var height = 5;
//    camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 0.1, 1000 );

    // set up M_view:   (internally:  camera.matrixWorldInverse )
    camera.position.set(0,12,20);
    camera.up = new THREE.Vector3(0,1,0);
    camera.lookAt(0,0,0);
    scene.add(camera);

      // SETUP ORBIT CONTROLS OF THE CAMERA
    const controls = new OrbitControls( camera, renderer.domElement );
//    var controls = new OrbitControls(camera);
    controls.damping = 0.2;
    controls.autoRotate = false;
};

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
}

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
     window.scrollTo(0,0);
}

////////////////////////////////////////////////////////////////////////	
// init():  setup up scene
////////////////////////////////////////////////////////////////////////	

function init() {
    console.log('init called');

    initCamera();
    initMotions();
    initLights();
    initObjects();
    initGiraffe();
    initFileObjects();

    window.addEventListener('resize',resize);
    resize();
};

////////////////////////////////////////////////////////////////////////
// initMotions():  setup Motion instances for each object that we wish to animate
////////////////////////////////////////////////////////////////////////

function initMotions() {

      // keyframes for the mybox animated motion:   name, time, [x, y, z, theta]
                                                                      //added this and below but doesn't work
    
      myboxMotion.addKeyFrame(new Keyframe('rest pose',0, [-3, 5, 2, -90]));
      myboxMotion.addKeyFrame(new Keyframe('rest pose',1, [6, 1, -3, 180]));
      myboxMotion.addKeyFrame(new Keyframe('rest pose',2, [2, 4, 5, 135])); 
      myboxMotion.addKeyFrame(new Keyframe('rest pose',3, [-5, 2, -3, 0]));
      myboxMotion.addKeyFrame(new Keyframe('rest pose',4, [-3, 5, 2, -90]));
      myboxMotion.addKeyFrame(new Keyframe('rest pose',5, [6, 4, -4, 180]));
      myboxMotion.addKeyFrame(new Keyframe('rest pose',6, [2, 4, 2, 135])); 
      myboxMotion.addKeyFrame(new Keyframe('rest pose',7, [-5, 0, -6, 0]));
    

      // basic interpolation test
    myboxMotion.currTime = 0.1;
    console.log('kf',myboxMotion.currTime,'=',myboxMotion.getAvars());    // interpolate for t=0.1
    myboxMotion.currTime = 2.9;
    console.log('kf',myboxMotion.currTime,'=',myboxMotion.getAvars());    // interpolate for t=2.9

      // keyframes for giraffe:    name, time, [x, y, theta1, theta2, theta3, theta4, theta5]
    giraffeMotion.addKeyFrame(new Keyframe('turning left pt1',      0.0, [5, 3,    45, 0, 45, 0, 0]));
    giraffeMotion.addKeyFrame(new Keyframe('turning left pt2',      0.5, [4, 3,    90, 0, 90, 0,0]));
    giraffeMotion.addKeyFrame(new Keyframe('turning left pt3',      1.0, [3, 3,    45, 0, 135, 0, 0]));
    giraffeMotion.addKeyFrame(new Keyframe('turning left pt4',      1.5, [2, 3,    0, 0, 180, 0,0]));
    giraffeMotion.addKeyFrame(new Keyframe('tilting left',          2.5, [1, 3,    0, 30, 225, 0, 0]));
    giraffeMotion.addKeyFrame(new Keyframe('going back to normal',  3.5, [0, 3,    0, 0, 0, 270,0]));
    giraffeMotion.addKeyFrame(new Keyframe('turning right pt1',     4.0, [-1, 3,    -45, 0, 315, 0, 0]));
    giraffeMotion.addKeyFrame(new Keyframe('turning right pt2',     4.5, [-2, 3,    -90, 0, 360, 0,0]));
    giraffeMotion.addKeyFrame(new Keyframe('turning right pt3',     5.0, [-3, 3,    -45, 0, 0, 0, 0]));
    giraffeMotion.addKeyFrame(new Keyframe('turning right pt4',     5.5, [-4, 3,    0, 0, 0, 0,0]));
    giraffeMotion.addKeyFrame(new Keyframe('tilting right',         6.5, [-5, 3,    0, -30, 0, 0, 0]));
    giraffeMotion.addKeyFrame(new Keyframe('going back to normal',  7.5, [-6, 3,    0, 0, 0, 0,0]));
}

///////////////////////////////////////////////////////////////////////////////////////
// myboxSetMatrices(avars)
///////////////////////////////////////////////////////////////////////////////////////

function myboxSetMatrices(avars) {
    // note:  in the code below, we use the same keyframe information to animation both
    //        the box and the dragon, i.e., avars[], although only the dragon uses avars[3], as a rotatino

     // update position of a box
    mybox.matrixAutoUpdate = false;     // tell three.js not to over-write our updates
    mybox.matrix.identity();              
    mybox.matrix.multiply(new THREE.Matrix4().makeTranslation(avars[0], avars[1], avars[2]));  
    mybox.matrix.multiply(new THREE.Matrix4().makeRotationY(-Math.PI/2));
    mybox.matrix.multiply(new THREE.Matrix4().makeScale(1.0,1.0,1.0));
    mybox.updateMatrixWorld();  

     // update position of a dragon
    var theta = avars[3]*deg2rad;
    meshes["dragon1"].matrixAutoUpdate = false;
    meshes["dragon1"].matrix.identity();
    meshes["dragon1"].matrix.multiply(new THREE.Matrix4().makeTranslation(avars[0],avars[1],0));  
    meshes["dragon1"].matrix.multiply(new THREE.Matrix4().makeRotationX(theta));  
    meshes["dragon1"].matrix.multiply(new THREE.Matrix4().makeScale(0.3,0.3,0.3));
    meshes["dragon1"].updateMatrixWorld();  
}

///////////////////////////////////////////////////////////////////////////////////////
// giraffeSetMatrices(avars)
///////////////////////////////////////////////////////////////////////////////////////

function giraffeSetMatrices(avars) {
    var xPosition = avars[0];
    var yPosition = avars[1];
    var theta1 = avars[2]*deg2rad;
    var theta2 = avars[3]*deg2rad;
    var theta3 = avars[4]*deg2rad;
    var theta4 = avars[5]*deg2rad;
    var theta5 = avars[6]*deg2rad;
    var M = new THREE.Matrix4();

      ////////////// link1
    linkFrame1.matrix.identity(); 
    linkFrame1.matrix.multiply(M.makeTranslation(xPosition,yPosition - 1.0, 5.0));   
    //linkFrame1.matrix.multiply(M.makeRotationZ(theta1));     //CHANGED
    if (up == true){
      linkFrame1.matrix.multiply(M.makeRotationY(theta3));
    } else {
      linkFrame1.matrix.multiply(M.makeRotationY(theta1));
    }

    if (down == true){
      linkFrame1.matrix.multiply(M.makeRotationX(theta3));
    } else {
      linkFrame1.matrix.multiply(M.makeRotationX(theta2));
    }
    
    if (flip == true){
      linkFrame1.matrix.multiply(M.makeRotationZ(theta3)); //ADDED flipping feature
    }

      // Frame 1 has been established, now setup the extra transformations for the scaled box geometry
    link1.matrix.copy(linkFrame1.matrix);
    link1.matrix.multiply(M.makeTranslation(0,0,0));   
    link1.matrix.multiply(M.makeScale(3,.5,3)); 

      ////////////// link2
    linkFrame2.matrix.copy(linkFrame1.matrix);      // start with parent frame
    linkFrame2.matrix.multiply(M.makeTranslation(3.5,-2,1)); //CHANGED
    //linkFrame2.matrix.multiply(M.makeRotationZ(theta2));   //CHANGED
      // Frame 2 has been established, now setup the extra transformations for the scaled box geometry
    link2.matrix.copy(linkFrame2.matrix);
    link2.matrix.multiply(M.makeTranslation(-2.3,1,0));  //CHANGED
    link2.matrix.multiply(M.makeRotationZ(90*deg2rad));  //ADDED
    link2.matrix.multiply(M.makeScale(1.5,.5,.5));       //CHANGED

      ///////////////  link3
    linkFrame3.matrix.copy(linkFrame2.matrix);
    linkFrame3.matrix.multiply(M.makeTranslation(0,-1.5,0));
    //linkFrame3.matrix.multiply(M.makeRotationZ(theta3));    //CHANGED
      // Frame 3 has been established, now setup the extra transformations for the scaled box geometry
    link3.matrix.copy(linkFrame3.matrix);
    link3.matrix.multiply(M.makeTranslation(-2.3,1,0)); //CHANGED
    link3.matrix.multiply(M.makeRotationZ(90*deg2rad));  //ADDED
    link3.matrix.multiply(M.makeScale(1.5,.5,.5));       //CHANGED

      /////////////// link4
    linkFrame4.matrix.copy(linkFrame1.matrix);
    linkFrame4.matrix.multiply(M.makeTranslation(3.5,-2,-1));
    //linkFrame4.matrix.multiply(M.makeRotationZ(theta4));    //CHANGED
      // Frame 4 has been established, now setup the extra transformations for the scaled box geometry
    link4.matrix.copy(linkFrame4.matrix);
    link4.matrix.multiply(M.makeTranslation(-2.3,1,0)); 
    link4.matrix.multiply(M.makeRotationZ(90*deg2rad));  //ADDED
    link4.matrix.multiply(M.makeScale(1.5,.5,.5));    

      // link5
    linkFrame5.matrix.copy(linkFrame4.matrix);
    linkFrame5.matrix.multiply(M.makeTranslation(0,-1.5,0));
    //linkFrame5.matrix.multiply(M.makeRotationZ(theta5));    //CHANGED
      // Frame 5 has been established, now setup the extra transformations for the scaled box geometry
    link5.matrix.copy(linkFrame5.matrix);
    link5.matrix.multiply(M.makeTranslation(-2.3,1,0)); 
    link5.matrix.multiply(M.makeRotationZ(90*deg2rad));  //ADDED
    link5.matrix.multiply(M.makeScale(1.5,.5,.5));
    
    
      // link6
    linkFrame6.matrix.copy(linkFrame1.matrix);      // start with parent frame
    linkFrame6.matrix.multiply(M.makeTranslation(1.2,-2,1)); //CHANGED
    //linkFrame2.matrix.multiply(M.makeRotationZ(theta2));   //CHANGED
      // Frame 2 has been established, now setup the extra transformations for the scaled box geometry
    link6.matrix.copy(linkFrame6.matrix);
    link6.matrix.multiply(M.makeTranslation(-2.3,1,0));  //CHANGED
    link6.matrix.multiply(M.makeRotationZ(90*deg2rad));  //ADDED
    link6.matrix.multiply(M.makeScale(1.5,.5,.5));       //CHANGED


      // link7
    linkFrame7.matrix.copy(linkFrame2.matrix);
    linkFrame7.matrix.multiply(M.makeTranslation(-2.3,-1.5,0));
    //linkFrame7.matrix.multiply(M.makeRotationZ(theta2));    //CHANGED
      // Frame 3 has been established, now setup the extra transformations for the scaled box geometry
    link7.matrix.copy(linkFrame7.matrix);
    link7.matrix.multiply(M.makeTranslation(-2.3,1,0)); //CHANGED
    link7.matrix.multiply(M.makeRotationZ(90*deg2rad));  //ADDED
    link7.matrix.multiply(M.makeScale(1.5,.5,.5));       //CHANGED


      // link8
    linkFrame8.matrix.copy(linkFrame1.matrix);
    linkFrame8.matrix.multiply(M.makeTranslation(1.2,-2,-1));
    //linkFrame4.matrix.multiply(M.makeRotationZ(theta4));    //CHANGED
      // Frame 4 has been established, now setup the extra transformations for the scaled box geometry
    link8.matrix.copy(linkFrame8.matrix);
    link8.matrix.multiply(M.makeTranslation(-2.3,1,0)); 
    link8.matrix.multiply(M.makeRotationZ(90*deg2rad));  //ADDED
    link8.matrix.multiply(M.makeScale(1.5,.5,.5));  


      // link9
    linkFrame9.matrix.copy(linkFrame4.matrix);
    linkFrame9.matrix.multiply(M.makeTranslation(-2.3,-1.5,0));
    //linkFrame5.matrix.multiply(M.makeRotationZ(theta5));    //CHANGED
      // Frame 5 has been established, now setup the extra transformations for the scaled box geometry
    link9.matrix.copy(linkFrame9.matrix);
    link9.matrix.multiply(M.makeTranslation(-2.3,1,0)); 
    link9.matrix.multiply(M.makeRotationZ(90*deg2rad));  //ADDED
    link9.matrix.multiply(M.makeScale(1.5,.5,.5));


      // link10
    linkFrame10.matrix.copy(linkFrame1.matrix);
    linkFrame10.matrix.multiply(M.makeTranslation(1.2,1,0));
    //linkFrame4.matrix.multiply(M.makeRotationZ(theta4));    //CHANGED
      // Frame 4 has been established, now setup the extra transformations for the scaled box geometry
    link10.matrix.copy(linkFrame10.matrix);
    link10.matrix.multiply(M.makeTranslation(-2.3,1,0)); 
    link10.matrix.multiply(M.makeRotationZ(90*deg2rad));  //ADDED
    link10.matrix.multiply(M.makeScale(4,.5,.7)); 


      // link11
    linkFrame11.matrix.copy(linkFrame1.matrix);      // start with parent frame
    linkFrame11.matrix.multiply(M.makeTranslation(.8,3.1,0)); //CHANGED
    //linkFrame2.matrix.multiply(M.makeRotationZ(theta2));   //CHANGED
      // Frame 2 has been established, now setup the extra transformations for the scaled box geometry
    link11.matrix.copy(linkFrame11.matrix);
    link11.matrix.multiply(M.makeTranslation(-2.3,1,0));  //CHANGED
    //link11.matrix.multiply(M.makeRotationZ(90*deg2rad));  //ADDED
    link11.matrix.multiply(M.makeScale(1.5,.5,1));       //CHANGED


      // link12
    linkFrame12.matrix.copy(linkFrame1.matrix);      // start with parent frame
    linkFrame12.matrix.multiply(M.makeTranslation(4,-1,0)); //CHANGED
    //linkFrame2.matrix.multiply(M.makeRotationZ(theta2));   //CHANGED
      // Frame 2 has been established, now setup the extra transformations for the scaled box geometry
    link12.matrix.copy(linkFrame12.matrix);
    link12.matrix.multiply(M.makeTranslation(-2.3,1,0));  //CHANGED
    //link11.matrix.multiply(M.makeRotationZ(90*deg2rad));  //ADDED
    link12.matrix.multiply(M.makeScale(1,.3,.3));       //CHANGED

    link1.updateMatrixWorld();
    link2.updateMatrixWorld();
    link3.updateMatrixWorld();
    link4.updateMatrixWorld();
    link5.updateMatrixWorld();
    link6.updateMatrixWorld();
    link7.updateMatrixWorld();
    link8.updateMatrixWorld();
    link9.updateMatrixWorld();
    link10.updateMatrixWorld();
    link11.updateMatrixWorld();
    link12.updateMatrixWorld();

    linkFrame1.updateMatrixWorld();
    linkFrame2.updateMatrixWorld();
    linkFrame3.updateMatrixWorld();
    linkFrame4.updateMatrixWorld();
    linkFrame5.updateMatrixWorld();
    linkFrame6.updateMatrixWorld();
    linkFrame7.updateMatrixWorld();
    linkFrame8.updateMatrixWorld();
    linkFrame9.updateMatrixWorld();
    linkFrame10.updateMatrixWorld();
    linkFrame11.updateMatrixWorld();
    linkFrame12.updateMatrixWorld();
}




/////////////////////////////////////	
// initLights():  SETUP LIGHTS
/////////////////////////////////////	

function initLights() {
    light = new THREE.PointLight(0xffffff);
    light.position.set(0,4,2);
    scene.add(light);
    ambientLight = new THREE.AmbientLight(0x606060);
    scene.add(ambientLight);
}

/////////////////////////////////////	
// MATERIALS
/////////////////////////////////////	

var diffuseMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff} );
var diffuseMaterial2 = new THREE.MeshLambertMaterial( {color: 0xffffff, side: THREE.DoubleSide } );
var basicMaterial = new THREE.MeshBasicMaterial( {color: 0xff0000} );
var armadilloMaterial = new THREE.MeshBasicMaterial( {color: 0x7fff7f} );

/////////////////////////////////////	
// initObjects():  setup objects in the scene
/////////////////////////////////////	

function initObjects() {
    var worldFrame = new THREE.AxesHelper(5) ;
    scene.add(worldFrame);

    // mybox 
    var myboxGeometry = new THREE.BoxGeometry( 1, 1, 1 );    // width, height, depth
    mybox = new THREE.Mesh( myboxGeometry, diffuseMaterial );
    mybox.position.set(4,4,0);
    scene.add( mybox );

    // textured floor
    var floorTexture = new THREE.TextureLoader().load('images/grass ground.jpg');
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(1, 1);
    var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
    var floorGeometry = new THREE.PlaneGeometry(15, 15);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -1.1;
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);

    // sphere, located at light position
    var sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);    // radius, segments, segments
    sphere = new THREE.Mesh(sphereGeometry, basicMaterial);
    sphere.position.set(0,4,2);
    sphere.position.set(light.position.x, light.position.y, light.position.z);
    scene.add(sphere);

    // box
    var boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );    // width, height, depth
    var box = new THREE.Mesh( boxGeometry, diffuseMaterial );
    box.position.set(-4, 0, 0);
    scene.add( box );

    // multi-colored cube      [https://stemkoski.github.io/Three.js/HelloWorld.html] 
    var cubeMaterialArray = [];    // order to add materials: x+,x-,y+,y-,z+,z-
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xff3333 } ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xff8800 } ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xffff33 } ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x33ff33 } ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x3333ff } ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x8833ff } ) );
      // Cube parameters: width (x), height (y), depth (z), 
      //        (optional) segments along x, segments along y, segments along z
    var mccGeometry = new THREE.BoxGeometry( 1.5, 1.5, 1.5, 1, 1, 1 );
    var mcc = new THREE.Mesh( mccGeometry, cubeMaterialArray );
    mcc.position.set(0,0,0);
    scene.add( mcc );	

    // cylinder
    // parameters:  radiusAtTop, radiusAtBottom, height, radialSegments, heightSegments
    var cylinderGeometry = new THREE.CylinderGeometry( 0.30, 0.30, 0.80, 20, 4 );
    var cylinder = new THREE.Mesh( cylinderGeometry, diffuseMaterial);
    cylinder.position.set(2, 0, 0);
    scene.add( cylinder );

    // cone:   parameters --  radiusTop, radiusBot, height, radialSegments, heightSegments
    var coneGeometry = new THREE.CylinderGeometry( 0.0, 0.30, 0.80, 20, 4 );
    var cone = new THREE.Mesh( coneGeometry, diffuseMaterial);
    cone.position.set(4, 0, 0);
    scene.add( cone);

    // torus:   parameters -- radius, diameter, radialSegments, torusSegments
    var torusGeometry = new THREE.TorusGeometry( 1.2, 0.4, 10, 20 );
    var torus = new THREE.Mesh( torusGeometry, diffuseMaterial);

    torus.rotation.set(0,0,0);     // rotation about x,y,z axes
    torus.scale.set(1,2,3);
    torus.position.set(-6, 0, 0);   // translation

    scene.add( torus );

    // custom object

    const geometry = new THREE.BufferGeometry();
    const vertices = [
	0,0,0,
	3,0,0,
	3,3,0,
	0,3,0
    ];
    const indices = [
	0, 1, 2, // first triangle
	2, 3, 0 // second triangle
    ];
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    const material = new THREE.MeshBasicMaterial();
    const customObject = new THREE.Mesh(geometry, material);
    customObject.position.set(0, 0, -2);
    scene.add(customObject);
}

/////////////////////////////////////////////////////////////////////////////////////
//  initGiraffe():  define all geometry associated with the giraffe
/////////////////////////////////////////////////////////////////////////////////////

function initGiraffe() {
    var giraffeMaterial = new THREE.MeshLambertMaterial( {color: giraffeColor} );
    var boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );    // width, height, depth

    link1 = new THREE.Mesh( boxGeometry, giraffeMaterial );  scene.add( link1 );
    linkFrame1   = new THREE.AxesHelper(1) ;   scene.add(linkFrame1);
    link2 = new THREE.Mesh( boxGeometry, giraffeMaterial );  scene.add( link2 );
    linkFrame2   = new THREE.AxesHelper(1) ;   scene.add(linkFrame2);
    link3 = new THREE.Mesh( boxGeometry, giraffeMaterial );  scene.add( link3 );
    linkFrame3   = new THREE.AxesHelper(1) ;   scene.add(linkFrame3);
    link4 = new THREE.Mesh( boxGeometry, giraffeMaterial );  scene.add( link4 );
    linkFrame4   = new THREE.AxesHelper(1) ;   scene.add(linkFrame4);
    link5 = new THREE.Mesh( boxGeometry, giraffeMaterial );  scene.add( link5 );
    linkFrame5   = new THREE.AxesHelper(1) ;   scene.add(linkFrame5);
    link6 = new THREE.Mesh( boxGeometry, giraffeMaterial );  scene.add( link6 );
    linkFrame6   = new THREE.AxesHelper(1) ;   scene.add(linkFrame6);
    link7 = new THREE.Mesh( boxGeometry, giraffeMaterial );  scene.add( link7 );
    linkFrame7   = new THREE.AxesHelper(1) ;   scene.add(linkFrame7);
    link8 = new THREE.Mesh( boxGeometry, giraffeMaterial );  scene.add( link8 );
    linkFrame8   = new THREE.AxesHelper(1) ;   scene.add(linkFrame8);
    link9 = new THREE.Mesh( boxGeometry, giraffeMaterial );  scene.add( link9 );
    linkFrame9   = new THREE.AxesHelper(1) ;   scene.add(linkFrame9);
    link10 = new THREE.Mesh( boxGeometry, giraffeMaterial );  scene.add( link10 );
    linkFrame10   = new THREE.AxesHelper(1) ;   scene.add(linkFrame10);
    link11 = new THREE.Mesh( boxGeometry, giraffeMaterial );  scene.add( link11 );
    linkFrame11   = new THREE.AxesHelper(1) ;   scene.add(linkFrame11);
    link12 = new THREE.Mesh( boxGeometry, giraffeMaterial );  scene.add( link12 );
    linkFrame12   = new THREE.AxesHelper(1) ;   scene.add(linkFrame12);

    link1.matrixAutoUpdate = false;  
    link2.matrixAutoUpdate = false;  
    link3.matrixAutoUpdate = false;  
    link4.matrixAutoUpdate = false;  
    link5.matrixAutoUpdate = false;
    link6.matrixAutoUpdate = false;
    link7.matrixAutoUpdate = false;
    link8.matrixAutoUpdate = false;
    link9.matrixAutoUpdate = false;
    link10.matrixAutoUpdate = false;
    link11.matrixAutoUpdate = false;
    link12.matrixAutoUpdate = false;

    linkFrame1.matrixAutoUpdate = false;  
    linkFrame2.matrixAutoUpdate = false;  
    linkFrame3.matrixAutoUpdate = false;  
    linkFrame4.matrixAutoUpdate = false;  
    linkFrame5.matrixAutoUpdate = false;
    linkFrame6.matrixAutoUpdate = false;
    linkFrame7.matrixAutoUpdate = false;
    linkFrame8.matrixAutoUpdate = false;
    linkFrame9.matrixAutoUpdate = false;
    linkFrame10.matrixAutoUpdate = false;
    linkFrame11.matrixAutoUpdate = false;
    linkFrame12.matrixAutoUpdate = false;
}



/////////////////////////////////////////////////////////////////////////////////////
//  create customShader material
/////////////////////////////////////////////////////////////////////////////////////

var customShaderMaterial = new THREE.ShaderMaterial( {
//        uniforms: { textureSampler: {type: 't', value: floorTexture}},
	vertexShader: document.getElementById( 'customVertexShader' ).textContent,
	fragmentShader: document.getElementById( 'customFragmentShader' ).textContent
} );

// var ctx = renderer.context;
// ctx.getShaderInfoLog = function () { return '' };   // stops shader warnings, seen in some browsers

////////////////////////////////////////////////////////////////////////	
// initFileObjects():    read object data from OBJ files;  see onResourcesLoaded() for instances
////////////////////////////////////////////////////////////////////////	

var models;

function initFileObjects() {
        // list of OBJ files that we want to load, and their material
    models = {     
	teapot:    {obj:"obj/teapot.obj", mtl: customShaderMaterial, mesh: null	},
	armadillo: {obj:"obj/armadillo.obj", mtl: customShaderMaterial, mesh: null },
	dragon:    {obj:"obj/dragon.obj", mtl: customShaderMaterial, mesh: null }
    };

    var manager = new THREE.LoadingManager();
    manager.onLoad = function () {
	console.log("loaded all resources");
	RESOURCES_LOADED = true;
	onResourcesLoaded();
    }
    var onProgress = function ( xhr ) {
	if ( xhr.lengthComputable ) {
	    var percentComplete = xhr.loaded / xhr.total * 100;
	    console.log( Math.round(percentComplete, 2) + '% downloaded' );
	}
    };
    var onError = function ( xhr ) {
    };

    // Load models;  asynchronous in JS, so wrap code in a fn and pass it the index
    for( var _key in models ){
	console.log('Key:', _key);
	(function(key){
	    var objLoader = new OBJLoader( manager );
	    objLoader.load( models[key].obj, function ( object ) {
		object.traverse( function ( child ) {
		    if ( child instanceof THREE.Mesh ) {
			child.material = models[key].mtl;
			child.material.shading = THREE.SmoothShading;
		    }	} );
		models[key].mesh = object;
	    }, onProgress, onError );
	})(_key);
    }
}

/////////////////////////////////////////////////////////////////////////////////////
// onResourcesLoaded():  once all OBJ files are loaded, this gets called.
//                       Object instancing is done here
/////////////////////////////////////////////////////////////////////////////////////

function onResourcesLoaded(){
	
 // Clone models into meshes;   [Michiel:  AFAIK this makes a "shallow" copy of the model,
 //                             i.e., creates references to the geometry, and not full copies ]
    meshes["armadillo1"] = models.armadillo.mesh.clone();
    meshes["armadillo2"] = models.armadillo.mesh.clone();
    meshes["dragon1"] = models.dragon.mesh.clone();
    meshes["teapot1"] = models.teapot.mesh.clone();
    meshes["teapot2"] = models.teapot.mesh.clone();
    
    // position the object instances and parent them to the scene, i.e., WCS
    // For static objects in your scene, it is ok to use the default postion / rotation / scale
    // to build the object-to-world transformation matrix. This is what we do below.
    //
    // Three.js builds the transformation matrix according to:  M = T*R*S,
    // where T = translation, according to position.set()
    //       R = rotation, according to rotation.set(), and which implements the following "Euler angle" rotations:
    //            R = Rx * Ry * Rz
    //       S = scale, according to scale.set()
    
    meshes["armadillo1"].position.set(-6, 1.5, 2);
    meshes["armadillo1"].rotation.set(0,-Math.PI/2,0);
    meshes["armadillo1"].scale.set(1,1,1);
    scene.add(meshes["armadillo1"]);

    meshes["armadillo2"].position.set(-3, 1.5, 2);
    meshes["armadillo2"].rotation.set(0,-Math.PI/2,0);
    meshes["armadillo2"].scale.set(1,1,1);
    scene.add(meshes["armadillo2"]);

    meshes["dragon1"].position.set(-5, 0.2, 4);
    meshes["dragon1"].rotation.set(0, Math.PI, 0);
    meshes["dragon1"].scale.set(0.3,0.3,0.3);
    scene.add(meshes["dragon1"]);

    meshes["teapot1"].position.set(3, 0, 3);
    meshes["teapot1"].scale.set(0.5, 0.5, 0.5);
    scene.add(meshes["teapot1"]);

    meshes["teapot2"].position.set(6, 0, 3);
    meshes["teapot2"].rotation.set(0, Math.PI/2, 0);
    meshes["teapot2"].scale.set(0.3, 0.3, 0.3);
    scene.add(meshes["teapot2"]);


    meshesLoaded = true;
}


///////////////////////////////////////////////////////////////////////////////////////
// LISTEN TO KEYBOARD
///////////////////////////////////////////////////////////////////////////////////////

// movement
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    // up
    if (keyCode == "W".charCodeAt()) {          // W = up
        light.position.y += 0.11;
        // down
    } else if (keyCode == "S".charCodeAt()) {   // S = down
        light.position.y -= 0.11;
        // left
    } else if (keyCode == "A".charCodeAt()) {   // A = left
	light.position.x -= 0.1;
        // right
    } else if (keyCode == "D".charCodeAt()) {   // D = right
        light.position.x += 0.11;
    } else if (keyCode == " ".charCodeAt()) {   // space
	animation = !animation;
    } else if (keyCode == "F".charCodeAt()) {   // F = flip     //ADDED
      flip = true;
    } else if (keyCode == "U".charCodeAt()) {   // U = up     //ADDED
      up = true;
    } else if (keyCode == "N".charCodeAt()) {   // D = down     //ADDED
      down = true;
    }
};


///////////////////////////////////////////////////////////////////////////////////////
// UPDATE CALLBACK:    This is the main animation loop
///////////////////////////////////////////////////////////////////////////////////////

function update() {
//    console.log('update()');
    var dt=0.02;
    if (animation && meshesLoaded) {
	// advance the motion of all the animated objects
	myboxMotion.timestep(dt);
   	giraffeMotion.timestep(dt);
    }
    if (meshesLoaded) {
	sphere.position.set(light.position.x, light.position.y, light.position.z);
	renderer.render(scene, camera);
    }
    requestAnimationFrame(update);      // requests the next update call;  this creates a loop
}

init();
update();

