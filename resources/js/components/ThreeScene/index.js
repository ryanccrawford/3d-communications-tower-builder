import React, { Component } from 'react';
import * as THREE from 'three';

class ThreeScene extends Component {

    constructor(props) {
        super(props)
        this.state = {
            width: props.width ? props.width : 200,
            height: props.height ? props.height : 200,
            play: props.play ? props.play : true,
            hasMouse: props.hasMouse ? props.hasMouse : false,
            fov: props.fov ? props.fov : 75,
            alpha: props.alpha ? props.alpha : false,
            bgColor: props.bgColor ? props.bgColor : '#000000',
            models : props.models != null ? props.models : false,
            frameId: 0
        }

    }

    componentDidMount() {
        const width = this.mount.clientWidth
        const height = this.mount.clientHeight
        //ADD SCENE
        this.scene = new THREE.Scene()
        //ADD CAMERA
        this.camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            1000
        )
        this.camera.position.z = 4
        //ADD RENDERER
        this.renderer = new THREE.WebGLRenderer({alpha: this.state.alpha , antialias: true })
        this.renderer.setClearColor('#000000')
        this.renderer.setSize(width, height)
        this.mount.appendChild(this.renderer.domElement)
        
        if(!this.state.models){
                //ADD CUBE
                const geometry = new THREE.BoxGeometry(1, 1, 1)
                const material = new THREE.MeshBasicMaterial({ color: '#433F81' })
                this.cube = new THREE.Mesh(geometry, material)
                this.scene.add(this.cube)
        }




        this.start()
    }
    componentWillUnmount() {
        this.stop()
        this.mount.removeChild(this.renderer.domElement)
    }
    start = () => {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate)
        }
    }
    stop = () => {
        cancelAnimationFrame(this.frameId)
    }
    animate = () => {
        this.cube.rotation.x += 0.01
        this.cube.rotation.y += 0.01
        this.renderScene()
        this.setState({frameId: window.requestAnimationFrame(this.animate)})
    }
    renderScene = () => {
        this.renderer.render(this.scene, this.camera)
    }
    render() {
        return (
            <div>
                    <div
                        style={{ width: this.state.width + "px", height: this.state.height + "px"}}
                        ref={(mount) => { this.mount = mount }}
                    >
                    
                    </div>
                <p>Frame ID: { this.state.frameId }</p>
            </div>
        )
    }
}
export default ThreeScene