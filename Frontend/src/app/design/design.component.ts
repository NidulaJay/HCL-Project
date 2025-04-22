import { Component, AfterViewInit } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Preset } from '../../models/preset.model';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { FurnitureButtonComponent } from '../components/furniture-button/furniture-button.component';

@Component({
  selector: 'app-design',
  imports: [FurnitureButtonComponent],
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.css']
})
export class DesignComponent implements AfterViewInit {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;

  private model: THREE.Group | undefined;
  private loader: GLTFLoader = new GLTFLoader();
  private textureLoader = new THREE.TextureLoader();
  private leftWall: THREE.Mesh | undefined;
  private rightWall: THREE.Mesh | undefined;
  private behindLeftWall: THREE.Mesh | undefined;
  private behindRightWall: THREE.Mesh | undefined;

  private isMouseDown = false;
  private previousMouseX = 5;
  private horizontalAngle = 5;

  preset: Preset = {
    model: 'chair',
    size: 7,
    color: '#FDE47D'
  }

  ngAfterViewInit(): void {
    this.init3D();
  }

  private init3D() {
    const container = document.getElementById('renderingSpace')!;
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x262626);

    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.set(-10, 5, 5);
    this.camera.lookAt(new THREE.Vector3(0, 3, 0));

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.5;
    container.appendChild(this.renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    this.scene.add(ambientLight, directionalLight);
    

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const floorTexture = this.textureLoader.load('assets/textures/floor.png');
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(20, 20);

    const floorNormalTexture = this.textureLoader.load('assets/textures/floorNormal.png');
    floorNormalTexture.wrapS = THREE.RepeatWrapping;
    floorNormalTexture.wrapT = THREE.RepeatWrapping;
    floorNormalTexture.repeat.set(20, 20);

    const floorOtherTexture = this.textureLoader.load('assets/textures/floorOther.png');
    floorOtherTexture.wrapS = THREE.RepeatWrapping;
    floorOtherTexture.wrapT = THREE.RepeatWrapping;
    floorOtherTexture.repeat.set(20, 20);

    const floorMaterial = new THREE.MeshStandardMaterial({
      map: floorTexture,
      normalMap: floorNormalTexture,
      metalness: 0.2,
      roughness: 0.5,
      side: THREE.DoubleSide
    });

  
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 40),
      floorMaterial
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    this.scene.add(floor);

    const roofTexture = this.textureLoader.load('assets/textures/roof.jpg');
    roofTexture.wrapS = THREE.RepeatWrapping;
    roofTexture.wrapT = THREE.RepeatWrapping;
    roofTexture.repeat.set(20, 20);

    const roofMaterial = new THREE.MeshStandardMaterial({
      map: roofTexture,
      side: THREE.DoubleSide
    });


    const roof = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 40),
      new THREE.MeshStandardMaterial({ color: 0x6A5242, side: THREE.DoubleSide })
    );
    roof.rotation.x = Math.PI / 2;
    roof.position.y = 10;
    this.scene.add(roof);


    this.leftWall = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 10),
      new THREE.MeshStandardMaterial({ color: 0xFDE47D, side: THREE.DoubleSide })
    );
    this.leftWall.rotation.y = Math.PI / 2;
    this.leftWall.position.set(0, 5, -20);
    this.leftWall.rotation.set(0, 0, 0)
    this.scene.add(this.leftWall);


    this.rightWall = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 10),
      new THREE.MeshStandardMaterial({ color: 0xFDE47D, side: THREE.DoubleSide })
    );
    this.rightWall.rotation.y = -Math.PI / 2;
    this.rightWall.position.set(20, 5, 0);
    this.scene.add(this.rightWall);

    this.behindLeftWall = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 10),
      new THREE.MeshStandardMaterial({ color: 0xFDE47D, side: THREE.DoubleSide })
    );
    this.behindLeftWall.rotation.y = Math.PI / 2;
    this.behindLeftWall.position.set(0, 5, 20);
    this.behindLeftWall.rotation.set(0, 0, 0)
    this.scene.add(this.behindLeftWall);


    this.behindRightWall = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 10),
      new THREE.MeshStandardMaterial({ color: 0xFDE47D, side: THREE.DoubleSide })
    );
    this.behindRightWall.rotation.y = -Math.PI / 2;
    this.behindRightWall.position.set(-20, 5, 0);
    this.scene.add(this.behindRightWall);

    this.animate();
    this.changeModel(this.preset.model);

    container.addEventListener('mousedown', (e) => {
      this.isMouseDown = true;
      this.previousMouseX = e.clientX;
    });
    
    container.addEventListener('mouseup', () => {
      this.isMouseDown = false;
    });
    
    container.addEventListener('mousemove', (e) => {
      if (!this.isMouseDown) return;
    
      const deltaX = e.clientX - this.previousMouseX;
      this.previousMouseX = e.clientX;
    
      this.horizontalAngle += deltaX * 0.005; // Adjust sensitivity
      const radius = 15; // Distance from camera to look target
      const y = this.camera.position.y;
    
      this.camera.position.x = Math.sin(this.horizontalAngle) * radius;
      this.camera.position.z = Math.cos(this.horizontalAngle) * radius;
      this.camera.position.y = y;
      this.camera.lookAt(new THREE.Vector3(0, 3, 0));
    });

  }

  private animate = () => {
    requestAnimationFrame(this.animate);
    // this.camera.rotation.z += 0.01;
    this.updateModel();
    this.renderer.render(this.scene, this.camera);
  }

  changeColor(color: string): void {
    this.preset.color = color    
  }

  increaseSize(): void {
    if (this.preset.size < 10) {
      this.preset.size++;
    }
  }
  
  decreaseSize(): void {
    if (this.preset.size > 1) {
      this.preset.size--;
    }
  }

  updateModel(): void{
    if(this.preset){
      if(this.model){
        let size = this.preset.size/100;
        this.model.scale.set(size, size, size);
      }
      if(this.leftWall && this.rightWall && this.behindLeftWall && this.behindRightWall){
        const newColor = new THREE.Color(this.preset.color);
        (this.leftWall.material as THREE.MeshStandardMaterial).color = newColor;
        (this.rightWall.material as THREE.MeshStandardMaterial).color = newColor;
        (this.behindLeftWall.material as THREE.MeshStandardMaterial).color = newColor;
        (this.behindRightWall.material as THREE.MeshStandardMaterial).color = newColor;
      }
    }
  }

  changeModel(model: string): void{

    this.preset.model = model

    if(this.model){
      this.scene.remove(this.model)
    }

    this.loader.load('assets/models/'+this.preset.model+'.glb', (gltf) => {
      this.model = gltf.scene;
      this.model.scale.set(0.07, 0.07, 0.07);
      this.model.position.set(0, 0, 0);
      this.model.rotation.set(0, 4.8, 0);
    
      this.model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true;
        }
      });
    
      this.scene.add(this.model);
    }, undefined, function (error) {
      console.error(error);
    });
  }

  reset(): void{
    this.preset = {
      model: 'chair',
      color: '#FDE47D',
      size: 7
    }
    this.changeModel(this.preset.model)
    this.updateModel();
  }

}
