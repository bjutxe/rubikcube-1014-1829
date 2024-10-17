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
Object.assign(controls, {
  enableDamping: true,
  dampingFactor: 0.25,
  enableZoom: true
});

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

const colorMap: string[] = [
  'black',  // 内側
  'green',  // 後面
  'yellow', // 左面
  'red',    // 上面
  'white',  // 右面
  'blue',   // 前面
  'orange'  // 下面
];

const initParts: number[][][] = [
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
const initializeRubiksCube = (initParts: number[][][]) => {
  initParts.forEach((layer, yIndex) => {
    layer.forEach((cubeDef, xzIndex) => {
      const x = (xzIndex % 3) - 1;
      const z = Math.floor(xzIndex / 3) - 1;
      const y = 1 - yIndex;

      const geometry = new THREE.BoxGeometry(
        cubeSize * 0.95,
        cubeSize * 0.95,
        cubeSize * 0.95
      );
      const materials = cubeDef.map(colorIndex => (
        new THREE.MeshBasicMaterial({ color: colorMap[colorIndex] })
      ));
      const cube = new THREE.Mesh(geometry, materials);
      cube.position.set(
        x * (cubeSize + gap),
        y * (cubeSize + gap),
        z * (cubeSize + gap)
      );
      rubiksCube.add(cube);
    });
  });
};

initializeRubiksCube(initParts);

rubiksCube.position.set(0, 0, 0);
camera.lookAt(rubiksCube.position);
scene.add(rubiksCube);

// コントロールの更新
const updateControls = () => {
  controls.update();
};

// TWEENの更新
const updateTweens = () => {
  TWEEN.update();
};

// レンダリング
const renderScene = () => {
  renderer.render(scene, camera);
};

// アニメーションループ
const animate = () => {
  requestAnimationFrame(animate);
  updateControls();
  updateTweens();
  renderScene();
};

animate();

// キーボード入力による回転
const handleKeyPress = (event: KeyboardEvent) => {
  event.preventDefault();
  const key = event.key.toUpperCase();
  const isAlt = event.altKey;
  const isShift = event.shiftKey;
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
    handleRotation(key, isAlt, isShift, keyMap);
  }
};

const handleRotation = (
  key: string,
  isAlt: boolean,
  isShift: boolean,
  keyMap: Record<string, [string, number, number]>
) => {
  let [axis, direction, angle] = keyMap[key];

  // 逆回転
  angle *= isAlt ? -1 : 1;

  // 2層回転
  if (isShift && direction !== 0) {
    rotateLayer(axis as 'x' | 'y' | 'z', 0, angle);
  }

  // 通常のレイヤーまたは全体の回転
  if (['X', 'Y', 'Z'].includes(key)) {
    rotateCube(axis as 'x' | 'y' | 'z', angle);
  } else {
    rotateLayer(axis as 'x' | 'y' | 'z', direction, angle);
  }
};

const createGroupFromCubes = (cubesToMove: THREE.Object3D[]) => {
  const group = new THREE.Group();
  cubesToMove.forEach(cube => {
    rubiksCube.remove(cube);
    group.add(cube);
  });
  rubiksCube.add(group);
  return group;
};

const rotateGroup = (
  group: THREE.Group,
  axis: 'x' | 'y' | 'z',
  angle: number,
  onCompleteCallback: () => void
) => {
  new TWEEN.Tween({ rotation: 0 })
    .to({ rotation: angle }, 500)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate((obj: any) => {
      group.rotation[axis] = obj.rotation;
    })
    .onComplete(onCompleteCallback)
    .start();
};

const rotateLayerOrCube = (
  cubesToMove: THREE.Object3D[],
  axis: 'x' | 'y' | 'z',
  angle: number
) => {
  const group = createGroupFromCubes(cubesToMove);

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

const rotateLayer = (
  axis: 'x' | 'y' | 'z',
  direction: number,
  angle: number
) => {
  const cubesToMove = rubiksCube.children.filter((cube: THREE.Object3D) => {
    return Math.round(cube.position[axis]) === direction;
  });

  rotateLayerOrCube(cubesToMove, axis, angle);
};

const rotateCube = (axis: 'x' | 'y' | 'z', angle: number) => {
  const cubesToMove = rubiksCube.children.slice();
  rotateLayerOrCube(cubesToMove, axis, angle);
};

// キー入力イベントリスナーの追加
document.addEventListener('keydown', handleKeyPress);
