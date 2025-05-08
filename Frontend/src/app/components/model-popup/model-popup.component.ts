import {
  Component, ElementRef, Input, ViewChild, AfterViewInit, OnDestroy, NgZone
} from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

@Component({
  selector: 'app-model-popup',
  templateUrl: './model-popup.component.html',
  styleUrls: ['./model-popup.component.css'],
  standalone: true
})
export class ModelPopupComponent implements AfterViewInit, OnDestroy {
  @Input() closeCallback!: () => void;
  @Input() modelPath: string = '';
  @ViewChild('viewport', { static: false }) viewport!: ElementRef;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private model: THREE.Group | undefined;
  private loader: GLTFLoader = new GLTFLoader();
  private animationId: number = 0;

  private isDragging = false;
  private previousMouseX = 0;
  private previousMouseY = 0;
  private originalRotation = new THREE.Euler();
  private resetTimeout: any;
  private restoring = false;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit() {
    this.initThree();
    this.animate();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
    this.renderer.dispose();
  }

  close() {
    this.closeCallback();
  }

  initThree() {
    const width = this.viewport.nativeElement.clientWidth;
    const height = this.viewport.nativeElement.clientHeight;

    this.scene = new THREE.Scene();
    // this.scene.background = new THREE.Color(0x898989);

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 5;

    this.loader.load('assets/models/' + this.modelPath + '.glb', (gltf) => {
      this.model = gltf.scene;
      this.model.scale.set(0.04, 0.04, 0.04);
      this.model.position.set(0, -1, 0);
      this.model.rotation.set(0, 4.8, 0);
      this.originalRotation.copy(this.model.rotation);

      this.model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true;
        }
      });

      this.scene.add(this.model);
    }, undefined, function (error) {
      console.error(error);
    });

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(2, 2, 5);
    this.scene.add(light);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.viewport.nativeElement.appendChild(this.renderer.domElement);

    this.renderer.domElement.addEventListener('mousedown', this.onMouseDown);
    this.renderer.domElement.addEventListener('mouseup', this.onMouseUp);
    this.renderer.domElement.addEventListener('mousemove', this.onMouseMove);
  }

  animate = () => {
    this.animationId = requestAnimationFrame(this.animate);

    if (this.model && this.restoring) {
      this.model.rotation.x += (this.originalRotation.x - this.model.rotation.x) * 0.02;
      this.model.rotation.y += (this.originalRotation.y - this.model.rotation.y) * 0.02;

      const deltaX = Math.abs(this.originalRotation.x - this.model.rotation.x);
      const deltaY = Math.abs(this.originalRotation.y - this.model.rotation.y);

      if (deltaX < 0.001 && deltaY < 0.001) {
        this.restoring = false;
        this.model.rotation.copy(this.originalRotation);
      }
    }

    this.renderer.render(this.scene, this.camera);
  };

  onMouseDown = (event: MouseEvent) => {
    this.isDragging = true;
    this.previousMouseX = event.clientX;
    this.previousMouseY = event.clientY;
    if (this.resetTimeout) clearTimeout(this.resetTimeout);
    this.restoring = false;
  };

  onMouseUp = () => {
    this.isDragging = false;
    this.resetTimeout = setTimeout(() => {
      if (this.model) {
        this.restoring = true;
      }
    }, 1000);
  };

  onMouseMove = (event: MouseEvent) => {
    if (!this.isDragging || !this.model) return;
    const deltaX = event.clientX - this.previousMouseX;
    const deltaY = event.clientY - this.previousMouseY;

    this.previousMouseX = event.clientX;
    this.previousMouseY = event.clientY;

    this.model.rotation.y += deltaX * 0.01;
    this.model.rotation.x += deltaY * 0.01;
  };
}
