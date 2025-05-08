import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

@Component({
  selector: 'app-furniture-button',
  imports: [],
  templateUrl: './furniture-button.component.html',
  styleUrl: './furniture-button.component.css'
})
export class FurnitureButtonComponent {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;

  @Input() model: string = '';
  @Input() popupCallback!: (model: string) => void;
  @Output() modelSelected = new EventEmitter<string>();
  @ViewChild('modelArea', { static: false }) modelAreaRef!: ElementRef;

  ngAfterViewInit(): void {
    this.init3D();
  }

  private init3D() {
    const container = this.modelAreaRef.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x898989);

    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.set(0, 2, 10);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
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

    const loader = new GLTFLoader();
    loader.load('assets/models/'+this.model+'.glb', (gltf) => {
          let model = gltf.scene;
          model.scale.set(0.07, 0.07, 0.07);
          model.position.set(0, 0, 0);
          model.rotation.set(0, 0, 0);
        
          this.scene.add(model);
        }, undefined, function (error) {
          console.error(error);
        });


    this.animate();
  }

  private animate = () => {
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  }

  onButtonClick() {
    this.modelSelected.emit(this.model);
  }

  showPopup(){
    this.popupCallback(this.model)
  }
}
