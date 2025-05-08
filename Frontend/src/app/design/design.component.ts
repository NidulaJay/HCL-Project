import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Preset } from '../../models/preset.model';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { FurnitureButtonComponent } from '../components/furniture-button/furniture-button.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PresetService } from '../../services/presetService';
import { ModelPopupComponent } from '../components/model-popup/model-popup.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-design',
  imports: [FurnitureButtonComponent, ModelPopupComponent, CommonModule],
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.css']
})
export class DesignComponent implements AfterViewInit {

  @ViewChild('nameInput') nameInputRef!: ElementRef;

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

  private id: string | null = '';
  popupVisible = false;

  preset: Preset = {
    id: 'aaa',
    name: 'Sample',
    model: 'chair',
    size: 7,
    color: '#FDE47D'
  }

  selectedModelPath = 'chair' 

  constructor(
    private route: ActivatedRoute,
    private presetService: PresetService,
    private router: Router
  ){}

  ngAfterViewInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if(this.id != null){
      this.presetService.getDesign(this.id).subscribe({
        next: (response) => {
          console.log('Preset Loaded', response);
          this.preset = response
          this.init3D();
        },
        error: (err) => {
            this.router.navigate(['/'])
      }})
    }else{
      this.init3D();
    }
    
    
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

    const roofTexture = this.textureLoader.load('assets/textures/roof.png');
    roofTexture.wrapS = THREE.RepeatWrapping;
    roofTexture.wrapT = THREE.RepeatWrapping;
    roofTexture.repeat.set(5, 5);

    const roofNormalTexture = this.textureLoader.load('assets/textures/roofNormal.png');
    roofNormalTexture.wrapS = THREE.RepeatWrapping;
    roofNormalTexture.wrapT = THREE.RepeatWrapping;
    roofNormalTexture.repeat.set(3, 3);

    const roofMetallicTexture = this.textureLoader.load('assets/textures/roofMetallic.jpg');
    roofMetallicTexture.wrapS = THREE.RepeatWrapping;
    roofMetallicTexture.wrapT = THREE.RepeatWrapping;
    roofMetallicTexture.repeat.set(3, 3);

    const roofRoughnessTexture = this.textureLoader.load('assets/textures/roofRoughness.jpg');
    roofRoughnessTexture.wrapS = THREE.RepeatWrapping;
    roofRoughnessTexture.wrapT = THREE.RepeatWrapping;
    roofRoughnessTexture.repeat.set(3, 3);

    const roofDisplacementTexture = this.textureLoader.load('assets/textures/roofDisplacement.tiff');
    roofDisplacementTexture.wrapS = THREE.RepeatWrapping;
    roofDisplacementTexture.wrapT = THREE.RepeatWrapping;
    roofDisplacementTexture.repeat.set(3, 3);

    const roofMaterial = new THREE.MeshStandardMaterial({
      map: roofTexture,
      normalMap: roofNormalTexture,
      metalnessMap: roofMetallicTexture,
      roughnessMap: roofRoughnessTexture,
      displacementMap: roofDisplacementTexture,
      side: THREE.DoubleSide
    });


    const roof = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 40),
      roofMaterial
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
    // console.log(this.popupVisible)
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
      id: '',
      name: 'Sample',
      model: 'chair',
      color: '#FDE47D',
      size: 7
    }
    this.changeModel(this.preset.model)
    this.updateModel();

    this.showPopup('')
  }

  delete(): void{
    let confirmation = confirm('Do you want to delete this design?')
    if(!confirmation){
      return
    }
    
    if(this.id == null){
      return
    }
    this.presetService.deleteDesign(this.id).subscribe({
      next: (response) => {
        if(response == true){
          this.router.navigate(['/designs']);
          return
        }
        alert('Deletion Unsuccessful')
      },
      error: (err) => {
          alert('Deletion Unsuccessful')
    }})
  }

  update(): void{
    if(this.id == null){
      return
    }

    let name = this.nameInputRef.nativeElement.value;
    let size = this.preset.size
    let color = this.preset.color
    let model = this.preset.model

    let data = {
      name: name, 
      color: color,
      model: model,
      size: size
    }
    this.presetService.updateDesign(this.id, data).subscribe({
      next: (response) => {
        if(response){
          this.router.navigate(['/designs']);
          return
        }
        alert('Update Unsuccessful')
      },
      error: (err) => {
          alert('Update Unsuccessful')
    }})
    
  }

  showPopup(model: string){
    this.selectedModelPath = model
    this.popupVisible = true
  }

  hidePopup(){
    this.popupVisible = false
  }

}
