import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// シーンの作成
const scene = new THREE.Scene();

// カメラの設定
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(4, 4, 4);

// レンダラーの作成
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x87ceeb, 1);
document.body.appendChild(renderer.domElement);

// オービットコントロールの追加
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

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

const initParts = [
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

rubiksCube.position.set(0, 0, 0);
camera.lookAt(rubiksCube.position);
scene.add(rubiksCube);

// アニメーションループ
const animate = () => {
  controls.update();
  requestAnimationFrame(animate);
  TWEEN.update();
  renderer.render(scene, camera);
};

animate();

// キーボード入力による回転
const handleKeyPress = (event: KeyboardEvent) => {
  event.preventDefault(); // キーボードのデフォルト動作を無効化
  const key = event.key.toUpperCase();
  const isAlt = event.altKey;      // 逆回転を示す
  const isShift = event.shiftKey;  // 2層回転を示す
  const keyMap: Record<string, [string, number, number]> = {
    'U': ['y', 1, -Math.PI / 2],
    'D': ['y', -1, Math.PI / 2],
    'L': ['x', -1, Math.PI / 2],
    'R': ['x', 1, -Math.PI / 2],
    'F': ['z', 1, -Math.PI / 2],
    'B': ['z', -1, Math.PI / 2],
    'M': ['x', 0, Math.PI / 2],
    'E': ['y', 0, Math.PI / 2],
    'S': ['z', 0, -Math.PI / 2],
    'X': ['x', 0, -Math.PI / 2],
    'Y': ['y', 0, -Math.PI / 2],
    'Z': ['z', 0, -Math.PI / 2]
  };

  if (key in keyMap) {
    let [axis, direction, angle] = keyMap[key];

    // 逆回転
    if (isAlt) {
      angle = -angle;
    }

    // 2層回転
    if (isShift) {
      if (direction !== 0) {
        rotateLayer(axis as 'x' | 'y' | 'z', 0, angle); // 中央層も回転
      }
    }

    // 通常のレイヤーまたは全体の回転
    if (['X', 'Y', 'Z'].includes(key)) {
      rotateCube(axis as 'x' | 'y' | 'z', angle);
    } else {
      rotateLayer(axis as 'x' | 'y' | 'z', direction, angle);
    }
  }
};

const rotateGroup = (group: THREE.Group, axis: 'x' | 'y' | 'z', angle: number, onCompleteCallback: () => void) => {
  new TWEEN.Tween({ rotation: 0 })
    .to({ rotation: angle }, 500)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate((obj: any) => {
      group.rotation[axis] = obj.rotation;
    })
    .onComplete(onCompleteCallback)
    .start();
};

const rotateLayerOrCube = (cubesToMove: THREE.Object3D[], axis: 'x' | 'y' | 'z', angle: number) => {
  const group = new THREE.Group();
  cubesToMove.forEach(cube => {
    rubiksCube.remove(cube);
    group.add(cube);
  });
  rubiksCube.add(group);

  rotateGroup(group, axis, angle, () => {
    while (group.children.length > 0) {
      const cube = group.children[0];
      cube.applyMatrix4(group.matrixWorld);
      cube.position.set(
        parseFloat(cube.position.x.toFixed(2)),
        parseFloat(cube.position.y.toFixed(2)),
        parseFloat(cube.position.z.toFixed(2))
      );
      rubiksCube.add(cube);
    }
    rubiksCube.remove(group);
  });
};

const rotateLayer = (axis: 'x' | 'y' | 'z', direction: number, angle: number) => {
  const cubesToMove: THREE.Object3D[] = [];
  rubiksCube.children.forEach((cube: THREE.Object3D) => {
    const pos = cube.position;
    if (Math.round(pos[axis]) === direction) cubesToMove.push(cube);
  });

  rotateLayerOrCube(cubesToMove, axis, angle);
};

const rotateCube = (axis: 'x' | 'y' | 'z', angle: number) => {
  const cubesToMove: THREE.Object3D[] = [];
  rubiksCube.children.forEach(cube => cubesToMove.push(cube));

  rotateLayerOrCube(cubesToMove, axis, angle);
};

// キー入力イベントリスナーの追加
document.addEventListener('keydown', handleKeyPress);
