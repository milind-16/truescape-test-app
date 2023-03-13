import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as THREE from "three";
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  private controls!: OrbitControls;

  public isModelLoading: boolean = false;

  constructor(private router: Router) { }

  ngOnDestroy(): void {
    this.discardScene();
  }

  discardScene() {
    if (this.scene) {
      while (this.scene.children.length > 0) {
        this.scene.remove(this.scene.children[0]);
      }
    }
    let renderElem = document.getElementById('cssrenderer');
    renderElem?.remove();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.setScenePreMiningExisting();
  }

  /**
   * Post - mining terrain and facility
   */
  public setSceneMiningTerrain() {
    this.discardScene()
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#FFFFFF');
    // Model loading start
    this.isModelLoading = true;
    const loader = new GLTFLoader();
    loader.load('assets/mining/Terrain_Year16.gltf',
      (gltf: GLTF) => {
        if (null != this.scene)
          this.scene.add(gltf.scene);

        // load facility start
        loader.load('assets/mining/Mining_Facilities.gltf',
          (gltf: GLTF) => {
            this.isModelLoading = false;
            if (null != this.scene)
              this.scene.add(gltf.scene);
          },
          (progress) => {

          },
          (err) => {
            this.isModelLoading = false;
          }
        );
        // load facility end

      },
      (progress) => {

      },
      (err) => {
        this.isModelLoading = false;
      }
    );
    // Model loading end

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      50,
      this.canvasRef.nativeElement.clientWidth / this.canvasRef.nativeElement.clientHeight,
      1,
      20000
    );
    this.camera.position.set(1500, 1500, 1500);

    // Lights
    let pointLi1 = new THREE.PointLight(0xffffff, 3, 12000);
    pointLi1.position.set(0, 5000, 0);
    this.scene.add(pointLi1);

    this.setRender();
    this.setControls();
  }

  /**
   * Pre - mining terrain
   */
  public setScenePreMiningExisting() {
    this.discardScene()
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#FFFFFF');

    // Model load start
    this.isModelLoading = true;
    const loader = new GLTFLoader();
    loader.load('assets/mining/Terrain_Existing.gltf',
      (gltf: GLTF) => {
        if (null != this.scene)
          this.scene.add(gltf.scene);

        // load outer start
        loader.load('assets/mining/Terrain_Outer.gltf',
          (gltf: GLTF) => {
            this.isModelLoading = false;
            if (null != this.scene)
              this.scene.add(gltf.scene);
          },
          (progress) => {

          },
          (err) => {
            this.isModelLoading = false;
          }
        );
        // load outer end

      },
      (progress) => {

      },
      (err) => {
        this.isModelLoading = false;
      }
    );
    // Model load end

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      50,
      this.canvasRef.nativeElement.clientWidth / this.canvasRef.nativeElement.clientHeight,
      1,
      20000
    );
    this.camera.position.set(2500, 2500, 2500);

    // Lights
    let pointLi1 = new THREE.PointLight(0xffffff, 3, 12000);
    pointLi1.position.set(0, 5000, 0);
    this.scene.add(pointLi1);

    // Pin
    let loader2 = new THREE.TextureLoader();
    let geometry = new THREE.BoxGeometry(200, 260, 10);
    let material = new THREE.MeshBasicMaterial({ map: loader2.load('assets/extras/Pin.svg') });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 900, 0);
    this.scene.add(mesh);

    this.setRender();
    this.setControls();
  }

  private setRender() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvasRef.nativeElement, antialias: true });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvasRef.nativeElement.clientWidth, this.canvasRef.nativeElement.clientHeight);
    let component: HomeComponent = this;
    (function render() {
      component.renderer.render(component.scene, component.camera);
      requestAnimationFrame(render);
    }());

  }

  private setControls = () => {
    const renderer = new CSS2DRenderer();
    renderer.setSize(this.canvasRef.nativeElement.clientWidth, this.canvasRef.nativeElement.clientHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0px';
    renderer.domElement.style.right = '0px';
    renderer.domElement.id = 'cssrenderer';
    document.body.appendChild(renderer.domElement);
    this.controls = new OrbitControls(this.camera, renderer.domElement);
    this.controls.autoRotate = true;
    this.controls.enableZoom = true;
    this.controls.enablePan = false;
    this.controls.update();
  };

  logout() {
    this.router.navigateByUrl('/login');
  }

}
