import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as THREE from "three";
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { GalleryDialog } from 'src/app/dialogs/gallery.dialog';

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
  private css2ren: CSS2DRenderer = new CSS2DRenderer();

  private clickListnerMesh!: THREE.Mesh;
  private raycaster = new THREE.Raycaster();
  public mouse = new THREE.Vector2();

  public isModelLoading: boolean = false;
  public currentSceneName: string = '';

  constructor(private router: Router, public dialog: MatDialog) { }

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
    if (this.renderer)
      this.renderer.dispose();
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    this.setScenePreMiningExisting();

    // mouse click listner
    window.addEventListener('click', (event: any) => {
      if(0.50 <= this.mouse.x && this.mouse.x < 0.60
        && 0.00 <= this.mouse.y && this.mouse.y < 0.3 && this.currentSceneName==='pre-mining'){
          this.openGalleryDialog();
      }
    }, false);

    // mouse move listner
    window.addEventListener('mousemove', (event: any) => {
      this.mouse.x = (event.clientX / this.canvasRef.nativeElement.clientWidth) * 2 - 1;
      this.mouse.y = - (event.clientY / this.canvasRef.nativeElement.clientHeight) * 2 + 1;
    }, false);
  }

  /**
   * Post - mining terrain and facility
   */
  public setSceneMiningTerrain() {
    this.discardScene()
    this.currentSceneName = 'mining';
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
    this.currentSceneName = 'pre-mining';
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
    let mesh = new THREE.Mesh(geometry, material);
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
    this.css2ren.setSize(this.canvasRef.nativeElement.clientWidth, this.canvasRef.nativeElement.clientHeight);
    this.css2ren.domElement.style.position = 'absolute';
    this.css2ren.domElement.style.top = '0px';
    this.css2ren.domElement.style.right = '0px';
    this.css2ren.domElement.id = 'cssrenderer';
    document.body.appendChild(this.css2ren.domElement);
    this.controls = new OrbitControls(this.camera, this.css2ren.domElement);
    this.controls.autoRotate = true;
    this.controls.enableZoom = true;
    this.controls.enablePan = false;
    this.controls.update();
  };

  logout() {
    this.router.navigateByUrl('/login');
  }

  openGalleryDialog(): void {
    const dialogRef = this.dialog.open(GalleryDialog, {});
    dialogRef.afterClosed().subscribe(result => { });
  }

}
