import React, { Component } from 'react';
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

class ThreeScene extends Component {

    constructor(props) {
        super(props)
        this.state = {
            parts: props.parts != null ? props.parts : null,// props.parts : ['./3dmodels/25g.fbx'],
            width: props.width ? props.width : 200,
            height: props.height ? props.height : 200,
            play: props.play ? props.play : true,
            hasMouse: props.hasMouse ? props.hasMouse : false,
            fov: props.fov ? props.fov : 75,
            alpha: props.alpha ? props.alpha : false,
            bgColor: props.bgColor ? props.bgColor : '#000000',
            frameId: 0
        }
        this.objects = [];
    }
    
    getInitialState() {
        return { width: this.mount.clientWidth };
    }

  
    componentDidMount() {
        const width = this.state.width
        const height = this.state.height
        //ADD SCENE
        this.scene = new THREE.Scene()
        //ADD CAMERA
        this.camera = new THREE.PerspectiveCamera(
            34,
            width / height,
            0.1,
            1000
        )
        this.camera.position.set(69.424956681552,24.003191332638636,-86.44157201232417)
        this.camera.rotation.set(-2.9153839510447543, 0.6325019513652448, 3.006367769546194);
        
        this.controls = new OrbitControls( this.camera, this.mount );
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;
        this.controls.enablePan = true;
        this.controls.enableZoom = true;
        this.controls.panSpeed =0.5;
        this.controls.zoomSpeed =0.5;
        this.controls.rotateSpeed = 0.2;
        this.controls.screenSpacePanning = false;
        this.controls.maxDistance = 1000; 
        this.controls.minDistance = 0.5;
        this.controls.autoRotate = true;   

     


        //ADD RENDERER
        this.renderer = new THREE.WebGLRenderer({alpha: this.props.alpha , antialias: true })
        //this.renderer.setClearColor('#000000')
        this.renderer.setSize(width, height)
        this.renderer.shadowMap.enabled = true;
        this.mount.appendChild(this.renderer.domElement)
        this.light2 = new THREE.AmbientLight( 0xcccccc, 0.8 )
		this.scene.add( this.light2 );
        this.light = new THREE.PointLight( 0xeeeeee, 0.8 )
        this.light.castShadow = true;
        this.light.shadow.camera.top = 100;
        this.light.shadow.camera.bottom = -100;
        this.light.shadow.camera.left = -120;
        this.light.shadow.camera.right = 120;

        const base = "./3dmodels/images/cmap/";
		const urls = [
            base + "px.jpg", base + "nx.jpg",
            base + "py.jpg", base + "ny.jpg",
            base + "pz.jpg", base + "nz.jpg"
		];
        this.textureCube = new THREE.CubeTextureLoader().load( urls, (ct) => {
            console.log(this);
            this.textureCube.mapping = THREE.CubeRefractionMapping;
            this.cubeMaterial = new THREE.MeshPhongMaterial( { color: 0xbec6d1, envMap: this.textureCube, refractionRatio: 0.30, reflectivity: 0.2 } );
            if(!this.state.parts){
                //ADD CUBE
                // const geometry = new THREE.BoxGeometry(1, 1, 1)
                // this.cube = new THREE.Mesh(geometry, this.cubeMaterial)
                // this.cube.castShadow = true;
                // this.cube.receiveShadow = true;
                // this.light.target =  this.cube;
                // this.scene.add( this.light );
                // this.scene.add(this.cube)
                this.importParts();
            }else{

                this.importParts();
            }

                

        } );
	    
         
			

       
    }

    loader = new FBXLoader();

    fitCameraToSelection = ( selection, fitOffset = 1.2 ) => {
  
        const box = new THREE.Box3();
        
        for( const object of selection ) box.expandByObject( object );
        
        const size = box.getSize( new THREE.Vector3() );
        const center = box.getCenter( new THREE.Vector3() );
        
        const maxSize = Math.max( size.x, size.y, size.z );
        const fitHeightDistance = maxSize / ( 2 * Math.atan( Math.PI * this.camera.fov / 360 ) );
        const fitWidthDistance = fitHeightDistance / this.camera.aspect;
        const distance = fitOffset * Math.max( fitHeightDistance, fitWidthDistance );
        
        const direction = this.controls.target.clone()
          .sub( this.camera.position )
          .normalize()
          .multiplyScalar( distance );
      
        this.controls.maxDistance = distance * 10;
        this.controls.target.copy( center );
        
        this.camera.near = distance / 100;
        this.camera.far = distance * 100;
        this.camera.updateProjectionMatrix();
      
        this.camera.position.copy( this.controls.target ).sub(direction);
        
        this.controls.update();
        
      }

    importParts = () => {
        
        const tempParts = ['./3dmodels/25g.fbx'] 
        const partsLength = tempParts.length//this.state.parts.length;
        this.pObj = null;
       
        for(let i = 0; i < partsLength; i++){
            
            this.loader.load(tempParts[i], (obj) => {
                this.pObj = obj;
                const material = this.cubeMaterial //new THREE.MeshPhongMaterial({ color: '#000088' , specular: 20, shininess: 8, reflectivity: 3})
                this.pObj.traverse( function ( child ) {

                    if ( child.isMesh ) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        child.material = material //this.cubeMaterial;
                    }

                } );
                
                //this.meshPartGroup = obj;
                this.pObj.up.set(1,0,0);
                this.light.target =  this.pObj;
                this.scene.add( this.light );
                let boundingbox = new THREE.BoxHelper( this.pObj, 0xffff00 );//new THREE.Box3().setFromObject( obj );               
               
               console.log(boundingbox);
               
                  // roll-over helpers
                this.hoverbox =  this.pObj.clone() ;
                let rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } );
                this.hoverbox.traverse( function ( child ) {

                    if ( child.isMesh ) {
                        child.castShadow = false;
                        child.receiveShadow = false;
                        child.material = rollOverMaterial //this.cubeMaterial;
                    }

                } );
            
                this.scene.add( this.hoverbox );
                this.scene.add(  this.pObj );
                this.fitCameraToSelection([this.pObj], 2);
            } )
            
            
        }
       
        // let gridHelper = new THREE.GridHelper( 1000, 20 );
        // scene.add( gridHelper );

        // //

        // raycaster = new THREE.Raycaster();
        // mouse = new THREE.Vector2();

        // var geometry = new THREE.PlaneBufferGeometry( 1000, 1000 );
        // geometry.rotateX( - Math.PI / 2 );

        // plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { visible: false } ) );
        // scene.add( plane );

        // objects.push( plane );



        this.start()

    }

    componentWillUnmount() {
       
        window.cancelAnimationFrame(this.requestID);
        this.controls.dispose();
        this.stop()
        this.mount.removeChild(this.renderer.domElement)

    }
    start = () => {
        console.log(this)
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate)
        }
    }
    stop = () => {
        cancelAnimationFrame(this.frameId)
    }
    animate = () => {
       
        this.renderScene()
        this.controls.update();
        this.setState({frameId: window.requestAnimationFrame(this.animate)})
    }
    renderScene = () => {
        this.renderer.render(this.scene, this.camera)
    }


    otherScripts = () => {

        

			// function init() {

			// 	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
			// 	camera.position.set( 500, 800, 1300 );
			// 	camera.lookAt( 0, 0, 0 );

			// 	scene = new THREE.Scene();
			// 	scene.background = new THREE.Color( 0xf0f0f0 );

			// 	// roll-over helpers

			// 	var rollOverGeo = new THREE.BoxBufferGeometry( 50, 50, 50 );
			// 	rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } );
			// 	rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
			// 	scene.add( rollOverMesh );

			// 	// cubes

			// 	cubeGeo = new THREE.BoxBufferGeometry( 50, 50, 50 );
			// 	cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xfeb74c, map: new THREE.TextureLoader().load( 'textures/square-outline-textured.png' ) } );

			// 	// grid

			// 	var gridHelper = new THREE.GridHelper( 1000, 20 );
			// 	scene.add( gridHelper );

			// 	//

			// 	raycaster = new THREE.Raycaster();
			// 	mouse = new THREE.Vector2();

			// 	var geometry = new THREE.PlaneBufferGeometry( 1000, 1000 );
			// 	geometry.rotateX( - Math.PI / 2 );

			// 	plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { visible: false } ) );
			// 	scene.add( plane );

			// 	objects.push( plane );

			// 	// lights

			// 	var ambientLight = new THREE.AmbientLight( 0x606060 );
			// 	scene.add( ambientLight );

			// 	var directionalLight = new THREE.DirectionalLight( 0xffffff );
			// 	directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
			// 	scene.add( directionalLight );

			// 	renderer = new THREE.WebGLRenderer( { antialias: true } );
			// 	renderer.setPixelRatio( window.devicePixelRatio );
			// 	renderer.setSize( window.innerWidth, window.innerHeight );
			// 	document.body.appendChild( renderer.domElement );

			// 	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
			// 	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
			// 	document.addEventListener( 'keydown', onDocumentKeyDown, false );
			// 	document.addEventListener( 'keyup', onDocumentKeyUp, false );

			// 	//

			// 	window.addEventListener( 'resize', onWindowResize, false );

			// }

			// function onWindowResize() {

			// 	camera.aspect = window.innerWidth / window.innerHeight;
			// 	camera.updateProjectionMatrix();

			// 	renderer.setSize( window.innerWidth, window.innerHeight );

			// }

			// function onDocumentMouseMove( event ) {

			// 	event.preventDefault();

			// 	mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );

			// 	raycaster.setFromCamera( mouse, camera );

			// 	var intersects = raycaster.intersectObjects( objects );

			// 	if ( intersects.length > 0 ) {

			// 		var intersect = intersects[ 0 ];

			// 		rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal );
			// 		rollOverMesh.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );

			// 	}

			// 	render();

			// }

			// function onDocumentMouseDown( event ) {

			// 	event.preventDefault();

			// 	mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );

			// 	raycaster.setFromCamera( mouse, camera );

			// 	var intersects = raycaster.intersectObjects( objects );

			// 	if ( intersects.length > 0 ) {

			// 		var intersect = intersects[ 0 ];

			// 		// delete cube

			// 		if ( isShiftDown ) {

			// 			if ( intersect.object !== plane ) {

			// 				scene.remove( intersect.object );

			// 				objects.splice( objects.indexOf( intersect.object ), 1 );

			// 			}

			// 			// create cube

			// 		} else {

			// 			var voxel = new THREE.Mesh( cubeGeo, cubeMaterial );
			// 			voxel.position.copy( intersect.point ).add( intersect.face.normal );
			// 			voxel.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
			// 			scene.add( voxel );

			// 			objects.push( voxel );

			// 		}

			// 		render();

			// 	}

			// }

			// function onDocumentKeyDown( event ) {

			// 	switch ( event.keyCode ) {

			// 		case 16: isShiftDown = true; break;

			// 	}

			// }

			// function onDocumentKeyUp( event ) {

			// 	switch ( event.keyCode ) {

			// 		case 16: isShiftDown = false; break;

			// 	}

			// }

			// function render() {

			// 	renderer.render( scene, camera );

			// }

		


    }


    render() {
        return (
            <div>
                    <div
                        parts={this}
                        style={{ width: this.state.width + "px", height: this.state.height + "px"}}
                        ref={mount => { this.mount = mount }}
                    >
                    
                    </div>
                <p>Frame ID: { this.state.frameId }</p>
                <p>Width: {parseInt(this.state.width) - parseInt(this.state.width)}</p>
            </div>
        )
    }
}
export default ThreeScene