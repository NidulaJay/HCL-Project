import { Component } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;

  private tableModel: THREE.Group | undefined;
  private character: THREE.Group | undefined;
  private loader: GLTFLoader = new GLTFLoader();
  private loader2: FBXLoader = new FBXLoader();
  private rotationDirection: number = 1;

  private mouse = new THREE.Vector2();
  private raycaster = new THREE.Raycaster();
  private groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // horizontal plane
  private targetPoint = new THREE.Vector3();
  private mouseOffsetX = 0;

  ngOnInit() {
    this.init3D();
  }

  private init3D() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    let container = document.getElementById('renderingSpace')
    let width = container ? container.clientWidth : window.innerWidth;
    let height = container ? container.clientHeight : window.innerHeight

    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setClearColor(0x262626);
    this.renderer.setSize(width, height);
    container?.appendChild(this.renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    const dirLight = new THREE.DirectionalLight(0xffffff, 5);
    dirLight.position.set(5, 10, 7.5);
    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;

    const floorGeo = new THREE.CircleGeometry(100, 100);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x000000, side: THREE.DoubleSide });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -12.5;
    floor.position.z = -1
    this.scene.add(floor);

    this.scene.add(ambientLight, dirLight);

    this.loader.load('assets/models/tree.glb', (gltf) => {
      this.tableModel = gltf.scene;
      this.tableModel.scale.set(0.2, 0.2, 0.2);
      this.tableModel.position.set(0, -12, 0);
      this.tableModel.rotation.set(0.1, 0, 0)
      this.scene.add(this.tableModel)


    }, undefined, function (error) {
      console.error(error);
    });

    this.loader2.load('assets/models/character.fbx', (fbx) => {
      this.character = fbx
      this.character.scale.set(1, 1, 1);
      this.character.position.set(0, -6, 0);
      this.character.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.material = new THREE.MeshStandardMaterial({ color: 0xf0f0f0 });
        }
      });

      // this.scene.add(this.character)
    }, undefined, (error) => {
      console.error('Error loading FBX:', error);
    });

    this.camera.position.z = 20;
    this.camera.position.y = -2

    window.addEventListener('resize', () => {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });

    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.animate();

  }

  private animate() {
    requestAnimationFrame(() => this.animate());
  
    if (this.tableModel) {
      // Max angle (in radians) the table can rotate to the left or right
      const maxRotation = 0.3; // around ±17 degrees
  
      // Target Y rotation based on mouse horizontal offset
      const targetY = this.mouseOffsetX * maxRotation;
  
      // Smoothly interpolate rotation
      this.tableModel.rotation.y = THREE.MathUtils.lerp(
        this.tableModel.rotation.y,
        targetY,
        0.05
      );
    }
  
    this.renderer.render(this.scene, this.camera);
  }

  private onMouseMove(event: MouseEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
  
    // Offset from center (range: -1 to 1)
    this.mouseOffsetX = ((event.clientX - centerX) / rect.width) * 2;
  }

}
