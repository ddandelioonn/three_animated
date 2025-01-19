import * as THREE from 'three'; 
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Создание сцены
const scene = new THREE.Scene();

// Настройка рендерера
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Настройка камеры
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(10, 5, 10);

// Изменение максимального расстояния камеры для увеличения области видимости
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5; // Минимальное расстояние
controls.maxDistance = 50; // Увеличили максимальное расстояние
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

// Источник света
const spotLight = new THREE.SpotLight(0xffffff, 3000, 100, 0.25, 1);
spotLight.position.set(0, 25, 0);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
scene.add(spotLight);

// Общий свет
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); 
scene.add(ambientLight);

// Загрузка анимированной 3D модели giger_walk.glb
let model = null;
let mixer = null;

const loader = new GLTFLoader().setPath('models/'); // Путь к папке с моделью

loader.load('giger_walk.glb', (gltf) => {
  console.log('Model loaded');
  model = gltf.scene;

  // Настроим анимации
  mixer = new THREE.AnimationMixer(model);

  // Перебираем все анимации и добавляем их в Mixer
  gltf.animations.forEach((clip) => {
    mixer.clipAction(clip).play();
  });

  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  model.position.set(0, 0, 0);

  // Уменьшаем модель
  model.scale.set(0.5, 0.5, 0.5); // Снижаем размер модели (50% от оригинала)

  scene.add(model);
});

// Анимация сцены
function animate() {
  requestAnimationFrame(animate);

  // Обновление анимаций
  if (mixer) {
    mixer.update(0.01); // Параметр скорости анимации
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();
