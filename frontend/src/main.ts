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
// R, U, F
camera.position.set(4, 4, 4);
// camera.position.set(-4, -4, -4); // 真反対からのカメラ

// レンダラーの作成
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x87ceeb, 1);
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
  'green',  // 後面
  'yellow', // 左面
  'red',    // 上面
  'white',  // 右面
  'blue',   // 前面
  'orange'  // 下面
];

let initParts = [
            [
              [0, 2, 3, 0, 0, 1], [0, 0, 3, 0, 0, 1], [4, 0, 3, 0, 0, 1],
              [0, 2, 3, 0, 0, 0], [0, 0, 3, 0, 0, 0], [4, 0, 3, 0, 0, 0],
              [0, 2, 3, 0, 5, 0], [0, 0, 3, 0, 5, 0], [4, 0, 3, 0, 5, 0]
            ],
            [
              [0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 1], [4, 0, 0, 0, 0, 1],
              [0, 2, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [4, 0, 0, 0, 0, 0],
              [0, 2, 0, 0, 5, 0], [0, 0, 0, 0, 5, 0], [4, 0, 0, 0, 5, 0]
            ],
            [
              [0, 2, 0, 6, 0, 1], [0, 0, 0, 6, 0, 1], [4, 0, 0, 6, 0, 1],
              [0, 2, 0, 6, 0, 0], [0, 0, 0, 6, 0, 0], [4, 0, 0, 6, 0, 0],
              [0, 2, 0, 6, 5, 0], [0, 0, 0, 6, 5, 0], [4, 0, 0, 6, 5, 0]
            ],
          ];

// ルービックキューブの初期化
initParts.forEach((layer, yIndex) => {
  layer.forEach((cubeDef, xzIndex) => {
    const x = (xzIndex % 3) - 1;
    const z = Math.floor(xzIndex / 3) - 1;
    const y = 1 - yIndex;

    const geometry = new THREE.BoxGeometry(cubeSize * 0.95, cubeSize * 0.95, cubeSize * 0.95);
    const materials = [
      new THREE.MeshBasicMaterial({ color: colorMap[cubeDef[0]] }), // 右面
      new THREE.MeshBasicMaterial({ color: colorMap[cubeDef[1]] }), // 左面
      new THREE.MeshBasicMaterial({ color: colorMap[cubeDef[2]] }), // 上面
      new THREE.MeshBasicMaterial({ color: colorMap[cubeDef[3]] }), // 下面
      new THREE.MeshBasicMaterial({ color: colorMap[cubeDef[4]] }), // 前面
      new THREE.MeshBasicMaterial({ color: colorMap[cubeDef[5]] })  // 後面
    ];
    const cube = new THREE.Mesh(geometry, materials);
    cube.position.set(
      x * (cubeSize + gap),
      y * (cubeSize + gap),
      z * (cubeSize + gap)
    );
    rubiksCube.add(cube);
  });
});

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
      rotateLayer('y', 1, -Math.PI / 2);
      break;
    case 'D':
      rotateLayer('y', -1, Math.PI / 2);
      break;
    case 'L':
      rotateLayer('x', -1, Math.PI / 2);
      break;
    case 'R':
      rotateLayer('x', 1, -Math.PI / 2);
      break;
    case 'F':
      rotateLayer('z', 1, -Math.PI / 2);
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
