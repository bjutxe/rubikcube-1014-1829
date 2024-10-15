import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';

// シーンの作成
const scene = new THREE.Scene();

// カメラの設定
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(8, 8, 8);

// レンダラーの作成
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 1);
document.body.appendChild(renderer.domElement);

// リサイズ対応
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

// 照明の追加
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

// ルービックキューブの作成
const cubeSize = 1;
const gap = 0.15;
const rubiksCube = new THREE.Group();

const colorMap = [
  'black',  // 内側
  'white',  // 上面
  'yellow', // 下面
  'red',    // 前面
  'orange', // 後面
  'blue',   // 右面
  'green'   // 左面
];

for (let x = -1; x <= 1; x++) {
  for (let y = -1; y <= 1; y++) {
    for (let z = -1; z <= 1; z++) {
      const geometry = new THREE.BoxGeometry(cubeSize * 0.95, cubeSize * 0.95, cubeSize * 0.95);
      const materials = [
        new THREE.MeshBasicMaterial({ color: y === 1 ? colorMap[1] : colorMap[0] }),
        new THREE.MeshBasicMaterial({ color: y === -1 ? colorMap[2] : colorMap[0] }),
        new THREE.MeshBasicMaterial({ color: z === 1 ? colorMap[3] : colorMap[0] }),
        new THREE.MeshBasicMaterial({ color: z === -1 ? colorMap[4] : colorMap[0] }),
        new THREE.MeshBasicMaterial({ color: x === 1 ? colorMap[5] : colorMap[0] }),
        new THREE.MeshBasicMaterial({ color: x === -1 ? colorMap[6] : colorMap[0] })
      ];
      const cube = new THREE.Mesh(geometry, materials);
      cube.position.set(
        x * (cubeSize + gap),
        y * (cubeSize + gap),
        z * (cubeSize + gap)
      );
      rubiksCube.add(cube);
    }
  }
}

rubiksCube.position.set(0, 1, 0);
camera.lookAt(rubiksCube.position);
scene.add(rubiksCube);

// アニメーションループ
const animate = () => {
  requestAnimationFrame(animate);
  TWEEN.update();
  renderer.render(scene, camera);
};

animate();

// キーボード入力による回転
const handleKeyPress = (event: KeyboardEvent) => {
  const key = event.key.toUpperCase();
  switch (key) {
    case 'U':
      rotateLayer('y', 1, Math.PI / 2);
      break;
    case 'D':
      rotateLayer('y', -1, Math.PI / 2);
      break;
    case 'L':
      rotateLayer('x', -1, Math.PI / 2);
      break;
    case 'R':
      rotateLayer('x', 1, Math.PI / 2);
      break;
    case 'F':
      rotateLayer('z', 1, Math.PI / 2);
      break;
    case 'B':
      rotateLayer('z', -1, Math.PI / 2);
      break;
    default:
      break;
  }
};

const rotateLayer = (axis: 'x' | 'y' | 'z', direction: number, angle: number) => {
  const layer = new THREE.Group();

  rubiksCube.children.forEach((cube: THREE.Object3D) => {
    const pos = cube.position;
    switch (axis) {
      case 'x':
        if (Math.round(pos.x) === direction) layer.add(cube);
        break;
      case 'y':
        if (Math.round(pos.y) === direction) layer.add(cube);
        break;
      case 'z':
        if (Math.round(pos.z) === direction) layer.add(cube);
        break;
    }
  });

  rubiksCube.add(layer);

  const rotationAxis = new THREE.Vector3(
    axis === 'x' ? 1 : 0,
    axis === 'y' ? 1 : 0,
    axis === 'z' ? 1 : 0
  );

  new TWEEN.Tween({ rotation: 0 })
    .to({ rotation: angle }, 500)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate((obj: any) => {
      layer.rotation[axis] = obj.rotation;
    })
    .onComplete(() => {
      layer.children.forEach((cube: THREE.Object3D) => {
        rubiksCube.attach(cube);
      });
      rubiksCube.remove(layer);
    })
    .start();
};

// キー入力イベントリスナーの追加
document.addEventListener('keydown', handleKeyPress);
