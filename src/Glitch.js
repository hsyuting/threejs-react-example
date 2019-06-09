import React, { Component } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";

export default class Glitch extends Component {
  componentDidMount() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(width / height);
    this.renderer.setSize(width, height);
    this.mount.appendChild(this.renderer.domElement);

    let camera = new THREE.PerspectiveCamera(70, width / height, 1, 1000);
    camera.position.z = 200;
    let scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 1, 1000);
    this.object = new THREE.Object3D();
    scene.add(this.object);
    let geometry = new THREE.SphereBufferGeometry(1, 4, 4);

    for (var i = 0; i < 100; i++) {
      let material = new THREE.MeshPhongMaterial({
        color: 0xffffff * Math.random(),
        flatShading: true
      });
      let mesh = new THREE.Mesh(geometry, material);
      mesh.position
        .set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
        .normalize();
      mesh.position.multiplyScalar(Math.random() * 400);
      mesh.rotation.set(
        Math.random() * 2,
        Math.random() * 2,
        Math.random() * 2
      );
      mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 50;
      this.object.add(mesh);
    }
    scene.add(new THREE.AmbientLight(0x222222));
    let light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1);
    scene.add(light);
    // postprocessing
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(scene, camera));
    let glitchPass = new GlitchPass();
    this.composer.addPass(glitchPass);
    this.animate(this);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.frameId);
    this.mount.removeChild(this.renderer.domElement);
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    this.object.rotation.x += 0.005;
    this.object.rotation.y += 0.01;
    this.composer.render();
  };

  render() {
    return (
      <div
        style={{ height: "100vh", width: "100vw" }}
        ref={mount => {
          this.mount = mount;
        }}
      />
    );
  }
}
