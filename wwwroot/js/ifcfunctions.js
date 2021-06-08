import * as THREE from "./three.module.js";
import { OrbitControls } from "./OrbitControls.js";
import { IFCLoader } from "./IFCLoader.js";

var scene, camera, container, renderer, controls;
var input;


const size = {
    width: window.innerWidth,
    height: window.innerHeight,
};

function animate() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};

function loadScene(id, inputId) {

    container = document.getElementById(id);
    if (!container) {
        return;
    }

    input = document.getElementById(inputId);
    if (!input) {
        return;
    }

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaaaaaa);

    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight);
    camera.position.z = 3;
    camera.position.y = 3;
    camera.position.x = 3;

    const lightColor = 0xffffff;

    const ambientLight = new THREE.AmbientLight(lightColor, 0.2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(lightColor, 1);
    directionalLight.position.set(0, 10, 0);
    directionalLight.target.position.set(-5, 0, 0);
    scene.add(directionalLight);
    scene.add(directionalLight.target);

    renderer = new THREE.WebGLRenderer({ antialias: true, canvas: container });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


    //Creates the orbit controls (to navigate the scene)
    controls = new OrbitControls(camera, renderer.domElement);
    controls.screenSpacePanning = true;
    //controls.minDistance = 5;
    //controls.maxDistance = 40;
    //controls.target.set(0, 2, 0);
    controls.update();

    //Creates grids and axes in the scene
    const grid = new THREE.GridHelper(50, 30);
    scene.add(grid);

    const axes = new THREE.AxesHelper();
    axes.material.depthTest = false;
    axes.renderOrder = 1;
    scene.add(axes);

    console.log(container)
    console.log(scene);
    console.log(input)

    animate();

    //window.addEventListener("resize", () => {
    //    (size.width = window.innerWidth), (size.height = window.innerHeight);
    //    camera.aspect = size.width / size.height;
    //    camera.updateProjectionMatrix();
    //    renderer.setSize(size.width, size.height);
    //});

    //Sets up the IFC loading
    const ifcLoader = new IFCLoader();
    ifcLoader.setWasmPath("js/ifc/");

    input.addEventListener(
        "change",
        (changed) => {
            var ifcURL = URL.createObjectURL(changed.target.files[0]);
            console.log(ifcURL);
            ifcLoader.load(ifcURL, (geometry) => scene.add(geometry));
        },
        false
    );

};

window.ifcfunctions = {
    load: (id, inputId) => { loadScene(id, inputId); }
};


