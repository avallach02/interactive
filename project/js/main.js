// === Три основные сущности ===
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);
const initialCameraPosition = new THREE.Vector3(-5.5, 4.4, 4);
camera.position.copy(initialCameraPosition);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.outputEncoding = THREE.sRGBEncoding;
document.getElementById('model-container').appendChild(renderer.domElement);

// === Освещение ===
const ambientLight = new THREE.AmbientLight(0x404040, 6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// === Переменные управления ===
let currentModel = null;
const baseRadius = Math.sqrt(initialCameraPosition.x ** 2 + initialCameraPosition.z ** 2);
const autoSpeed = 0.0009;
let angle = Math.atan2(initialCameraPosition.z, initialCameraPosition.x);
let isUserControlling = false;
let autoRotateEnabled = false;

// === OrbitControls ===
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.enablePan = false;
controls.minPolarAngle = 0.1;
controls.maxPolarAngle = Math.PI - 0.1;
controls.autoRotate = false;

if ('ontouchstart' in window) {
    controls.touchDampingFactor = 0.1;
    controls.enableZoom = true;
    controls.zoomSpeed = 0.5;
}
controls.addEventListener('start', () => isUserControlling = true);
controls.addEventListener('end', () => {
    isUserControlling = false;
    angle = Math.atan2(camera.position.z, camera.position.x);
});

// === Загрузчик и рейкастер ===
const loader = new THREE.GLTFLoader();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// === ДАННЫЕ О КАБИНЕТАХ (восстановлены ВСЕ, как в вашем запросе) ===
const officeData = {
    'model1.glb': [
        { id: '№101', name: 'Лаборатория 110', position: new THREE.Vector3(-1, 0.03, 0.65) },
        { id: '№102', name: 'Лаборатория 110', position: new THREE.Vector3(-1, 0.03, 0.45) },
        { id: '№103', name: 'Лаборатория 110', position: new THREE.Vector3(-1, 0.03, 0.25) },
        { id: '№104', name: 'Лаборатория 110', position: new THREE.Vector3(-1, 0.03, 0.02) },
        { id: '№105', name: 'Лаборатория 110', position: new THREE.Vector3(-0.13, 0, 0.45) },
        { id: '№106', name: 'Лаборатория 110', position: new THREE.Vector3(2.18, 0.03, 0.43) },
        { id: '№107', name: 'Лаборатория 110', position: new THREE.Vector3(2.18, 0.03, 0.04) },
        { id: '№108', name: 'Лаборатория 110', position: new THREE.Vector3(2.18, 0.03, -0.48) },
        { id: '№109', name: 'Лаборатория 110', position: new THREE.Vector3(2.18, 0.03, -0.29) },
        { id: '№110', name: 'Лаборатория 110', position: new THREE.Vector3(2.18, 0.03, -0.11) },
        { id: '№111', name: 'Лаборатория 110', position: new THREE.Vector3(2.18, 0.03, 0.43) },
        { id: '№112', name: 'Лаборатория 110', position: new THREE.Vector3(-0.13, 0, 0.45) },
        { id: '№113', name: 'Лаборатория 110', position: new THREE.Vector3(1.75, 0.03, 0.43) },
        { id: '№114', name: 'Лаборатория 110', position: new THREE.Vector3(1.75, 0.03, 0.24) },
        { id: '№115', name: 'Лаборатория 110', position: new THREE.Vector3(1.75, 0.03, -0.18) },
        { id: '№116', name: 'Лаборатория 110', position: new THREE.Vector3(1, 0.03, -0.35) },
        { id: '№117', name: 'Лаборатория 110', position: new THREE.Vector3(1.44, 0.03, -0.9) },
        { id: '№118', name: 'Лаборатория 110', position: new THREE.Vector3(0.5, 0.03, -0.9) },
        { id: '№119', name: 'Лаборатория 110', position: new THREE.Vector3(0.155, 0.03, -0.35) }
    ],
    'model2.glb': [
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(1.26, 0.03, -2.095) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(-1.8, 0.03, -1.8) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(2.09, 0.03, -1.565) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(1.99, 0.03, -2.15) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(1.86, 0.03, -2.15) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(2.09, 0.03, 0.787) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(2.09, 0.03, 2.065) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(2.09, 0.03, 1.95) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(2.09, 0.03, 1.83) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(2.09, 0.03, 1.71) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(2.09, 0.03, 1.59) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(2.09, 0.03, 1.11) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(2.09, 0.03, 0.03) },
        { id: '205', name: 'Кафедра ИТ', position: new THREE.Vector3(2.09, 0.03, 1.35) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(2.09, 0.03, 0.49) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(2.09, 0.03, 0.6) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(2.09, 0.03, -0.5) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(2.09, 0.03, -0.38) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(2.09, 0.03, -0.9) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(2.09, 0.03, -1.32) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(1.67, 0.03, -1.13) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(1.67, 0.03, -0.75) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(1.67, 0.03, -0.45) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(1.67, 0.03, -0.11) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(1.67, 0.03, 1.25) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(1.67, 0.03, 0.7) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(1.67, 0.03, 0.25) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(1.67, 0.03, 1.63) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(1.67, 0.03, 1.85) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(1.67, 0.03, 1.97) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(1.67, 0.03, 2.15) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(1.72, 0.03, -2.095) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(0.46, 0.03, -2.095) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(1.11, 0.03, -1.55) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(1.255, 0.03, -1.55) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(1.43, 0.03, -1.55) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(1.57, 0.03, -1.55) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(1.73, 0.03, -1.55) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(-0.35, 0.03, -1.5) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(-0.95, 0.03, -1.5) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(0.46, 0.03, -1.55) }
    ],
    'model3.glb': [
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(1.89, 0.03, 0.06) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(1.89, 0.03, 0.165) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(1.89, 0.03, 0.34) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(1.89, 0.03, 0.61) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(1.89, 0.03, 0.78) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(1.89, 0.03, 1.05) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(1.89, 0.03, 1.285) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(1.89, 0.03, -0.13) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(1.89, 0.03, -0.35) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(1.89, 0.03, 1.52) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(1.89, 0.03, 1.75) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(2.25, 0.03, -0.1) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(2.25, 0.03, -0.33) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(2.25, 0.03, -1.08) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(2.25, 0.03, -0.77) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(2.20, 0.03, -1.2) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(2.20, 0.03, 0.2) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(2.20, 0.03, 0.37) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(2.20, 0.03, 0.593) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(2.20, 0.03, 0.74) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(2.20, 0.03, 0.87) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(2.20, 0.03, 0.946) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(2.20, 0.03, 1.03) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(2.20, 0.03, 1.11) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(2.20, 0.03, 1.2) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(2.20, 0.03, 1.284) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(2.3, 0.03, 1.65) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(2.11, 0.03, 1.65) },
        { id: '310', name: 'Кафедра ИТ', position: new THREE.Vector3(1.84, 0.03, -1.27) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(1.91, 0.03, -0.97) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(1.91, 0.03, -0.8) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(1.91, 0.03, -0.71) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(1.91, 0.03, -0.625) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(1.91, 0.03, -0.53) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(2.25, 0.03, -0.52) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(-1.299424640167571, 0.03, -1.24) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(-1.06009274080691, 0.03, -1.24) },
        { id: '310', name: 'Кафедра ИТ', position: new THREE.Vector3(-0.81, 0.03, -1.24) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(0.52, 0.03, -1.22) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(0.05, 0.03, -1.22) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(1.75, 0.03, -1.655) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(1.63, 0.03, -1.25) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(1.1, 0.03, -1.25) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(1.1, 0.03, -1.6) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(-1.4527083426399423, 0.03, -1.24) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(-0.4939179265338005, 0.03, -1.24) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(-1.5672235045500036, 0.03, -1.24) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(-1.6754996660150256, 0.03, -1.24) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(-1.7835610759244807, 0.03, -1.24) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(-2.1112245159789857, 0.03, -1.4277533589857125) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(-0.35441416440121887, 0.03, -1.62) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(-0.5848414319571397, 0.03, -1.62) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(-0.786695409401398, 0.03, -1.62) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(-1.0292868151636676, 0.03, -1.62) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(-1.2642595888217356, 0.03, -1.62) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(-1.4362062925001469, 0.03, -1.62) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(-1.5806016158224026, 0.03, -1.62) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(-1.6971242987054826, 0.03, -1.62) },
        { id: '301', name: 'Кафедра ИТ', position: new THREE.Vector3(-1.7838009516267155, 0.03, -1.62) }
    ],
    'model4.glb': [
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(1.2350881258652269, 0.03, -1.664084845616643) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(1.4117220587845007, 0.03, -1.265186473346015) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(1.084451135700639, 0.03, -1.265186473346015) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(0.7859069945350743, 0.03, -1.265186473346015) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(0.46467588515414393, 0.03, -1.265186473346015) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(0.18464665109244982, 0.03, -1.2291646180995013) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(-0.043750603095691835, 0.03, -1.2291646180995013) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(0.8182386465407522, 0.03, -1.6265717013546612) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(-0.48560326930290976, 0.03, -1.197479528279153) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(0.5942846160434032, 0.03, -1.6244100574292544) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(0.42261848347916686, 0.03, -1.6244100574292544) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(0.17760642141534716, 0.03, -1.6244100574292544) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(-0.4861444561412523, 0.03, -1.6244100574292544) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(-0.48560326930290976, 0.03, -1.197479528279153) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(-0.8462245932135677, 0.03, -1.27) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(-1.1333273879632457, 0.03, -1.27) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(-1.2453518244517892, 0.03, -1.27) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(-1.3509613301079406, 0.03, -1.27) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(-1.462458526260579, 0.03, -1.27) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(-1.5675649215615908, 0.03, -1.27) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(-1.7465884182295308, 0.03, -1.27) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(-2.029295106950613, 0.03, -1.27) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(-2.2680252824009948, 0.03, -1.27) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(-2.2158340480657825, 0.03, -1.63) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(-2.5867237976861173, 0.03, -1.3627626690325962) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(-2.048307534066896, 0.03, -1.63) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(-1.7816385241385655, 0.03, -1.63) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(-1.5845966529689566, 0.03, -1.63) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(-1.2336625955169702, 0.03, -1.63) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(-0.9356925952060046, 0.03, -1.63) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(1.7597382009075078, 0.03, -1.202768677285637) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(1.7966578047204091, 0.03, -1.076) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(1.798895529448555, 0.03, -1.076) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(1.7838805424048272, 0.03, -0.14634847089501846) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(1.7933577720999372, 0.03, -0.807901076112937) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(1.4553113927604997, 0.03, -0.9548766091446454) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(1.4564682126513029, 0.03, -0.7117254260601719) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(1.460256128316039, 0.03, -0.49682461682967527) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(1.7758236066319848, 0.03, -0.4849374721502271) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(1.4237735191217755, 0.03, -0.2621305055941632) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(1.42096898048118, 0.03, -0.01004178853696125) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(1.4218829037477219, 0.03, 0.21723218558334634) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(1.4253562157720032, 0.03, 0.39498994482604255) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(1.4232472459650127, 0.03, 0.6620698501719575) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(1.4197378437308035, 0.03, 1.0035179156387182) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(1.75797978393192, 0.03, 0.16739641095356084) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(1.7544134852714146, 0.03, 0.25171546371437215) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(1.7552549623383, 0.03, 0.34042092344281505) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(1.756054365449666, 0.03, 0.4246911108972724) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(1.7576531716722374, 0.03, 0.5932314858070611) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(1.7546755317200682, 0.03, 0.7396762886850685) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(1.7515713470035643, 0.03, 0.8728291369120087) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(1.7529983839321117, 0.03, 1.0653755389619248) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(1.7557384109584095, 0.03, 1.2773734585304162) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(1.4152521574117645, 0.03, 1.2425753674742532) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(2.5885944205268414, 0.03, 1.5684965371822446) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(2.449822166446209, 0.03, 1.564037132046228) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(2.2965261995243487, 0.03, 1.5663540209312163) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(2.157455833903173, 0.03, 1.5546420267461332) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(2.0031738832519386, 0.03, 1.5642020849280862) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(1.4509821798607074, 0.03, 1.4882052813116422) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(1.4489373008935884, 0.03, 1.6995138097839733) },
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(1.4495770609929024, 0.03, 1.3569476606172621) }
    ],
    'model5.glb': [
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(1.128509165417544, 0.03, -1.6923238857116993) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(0.9984534036089554, 0.03, -1.6923238857116993) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(0.7975726722046625, 0.03, -1.6923238857116993) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(0.5964881201293593, 0.03, -1.6923238857116993) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(0.4605839854991769, 0.03, -1.6923238857116993) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(0.3067190407813438, 0.03, -1.6923238857116993) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(1.1334200107193706, 0.03, -1.258016912534843) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(0.8324438736761726, 0.03, -1.258016912534843) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(0.49430216331612886, 0.03, -1.258016912534843) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(1.3145468740340283, 0.03, -1.258016912534843) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(1.5723486066226142, 0.03, -1.258016912534843) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(1.883043838534964, 0.03, -1.258016912534843) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(1.5947876078137169, 0.03, -1.7401489465251736) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(0.29631762191893074, 0.03, -1.2457892725672812) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(-0.019625850884873453, 0.03, -1.2457892725672812) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(-0.436235044290499, 0.03, -1.2457892725672812) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(-2.129355593513172, 0.03, -1.2457892725672812) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(-1.764612086840216, 0.03, -1.2457892725672812) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(-1.554279435878774, 0.03, -1.2457892725672812) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(-1.3914946245930104, 0.03, -1.2457892725672812) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(-1.2524616027333055, 0.03, -1.2457892725672812) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(-1.100956925611476, 0.03, -1.2457892725672812) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(-0.9368833702600494, 0.03, -1.2457892725672812) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(-0.741717370648197, 0.03, -1.2457892725672812) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(-2.2178956330792587, 0.03, -1.712333595265156) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(-2.036558326448918, 0.03, -1.712333595265156) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(-1.7773285410571715, 0.03, -1.712333595265156) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(-1.5520917850011946, 0.03, -1.712333595265156) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(-1.2129265431233143, 0.03, -1.712333595265156) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(-0.9216027115176931, 0.03, -1.712333595265156) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(-0.49275184833393704, 0.03, -1.712333595265156) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(1.7666745167665077, 0.03, 0.6811316320100058) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(1.7775991138680562, 0.03, 1.0919107889964246) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(1.7801527835826048, 0.03, 1.361109508479312) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(1.7828408577865082, 0.03, 1.6444765802703545) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(2.1769751110591455, 0.03, 1.7508519059114356) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(2.1697945492068302, 0.03, 1.6520704674804323) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(2.1694171103444884, 0.03, 1.461359708738346) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(2.1690396714821536, 0.03, 1.2706489499962603) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(2.175689090344791, 0.03, 1.1010566392783803) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(2.168396627494469, 0.03, 0.9457343239912257) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(2.16797725098076, 0.03, 0.7338334809444635) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(2.174766510267112, 0.03, 0.6348991653894345) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(2.1675718536841737, 0.03, 0.528995999332593) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(2.1673761446444493, 0.03, 0.430108939244104) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(2.2174725681993714, 0.03, 0.0917534523460457) },
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(2.204778305098353, 0.03, -0.7610552288798513) }
    ]
};

// Объединяем все кабинеты (для поиска)
const allOffices = Object.values(officeData).flat();

let officeLabels = []; // для очистки

// === Загрузка модели ===
function loadModel(modelPath) {
    if (currentModel) {
        scene.remove(currentModel);
        currentModel = null;
    }

    loader.load(
        `models/${modelPath}`,
        (gltf) => {
            currentModel = gltf.scene;

            currentModel.traverse((child) => {
                if (child.isMesh) {
                    child.material.encoding = THREE.sRGBEncoding;
                    if (child.material.map) {
                        child.material.map.encoding = THREE.sRGBEncoding;
                    }
                }
            });

            scene.add(currentModel);

            // Центрирование
            const box = new THREE.Box3().setFromObject(currentModel);
            const center = box.getCenter(new THREE.Vector3());
            currentModel.position.sub(center);

            const size = box.getSize(new THREE.Vector3()).length();
            const cameraDistance = size * 1.5;
            initialCameraPosition.set(-cameraDistance / 2, cameraDistance / 2, cameraDistance / 2);
            camera.position.copy(initialCameraPosition);
            angle = Math.atan2(initialCameraPosition.z, initialCameraPosition.x);
            controls.reset();

            // Добавляем метки
            const officesForThisModel = officeData[modelPath] || [];
            addOfficeMarkers(officesForThisModel);
        },
        undefined,
        (error) => console.error('Error loading model:', error)
    );
}

// === Добавление меток кабинетов ===
function addOfficeMarkers(offices) {
    officeLabels.forEach(marker => scene.remove(marker));
    officeLabels = [];

    if (!offices || offices.length === 0) return;

    const geometry = new THREE.SphereGeometry(0.025, 20, 20);
    const baseColor = 0x00e1ff;
    const hoverColor = 0x020bfa;
    const baseScale = 1;
    const hoverScale = 1.1;

    const baseMaterial = new THREE.MeshBasicMaterial({
        color: baseColor,
        transparent: true,
        opacity: 0.8,
        depthTest: false
    });

    offices.forEach(office => {
        const marker = new THREE.Mesh(geometry, baseMaterial.clone());
        marker.position.copy(office.position);
        marker.userData = {
            id: office.id,
            name: office.name,
            baseColor: baseColor,
            hoverColor: hoverColor,
            baseScale: baseScale,
            hoverScale: hoverScale,
            originalMaterial: baseMaterial 
        };
        scene.add(marker);
        officeLabels.push(marker);
    });
}

// === Поиск и навигация ===
function setupSearch() {
    const input = document.getElementById('search-input');
    const resultsList = document.getElementById('search-results');

    input.addEventListener('input', () => {
        const query = input.value.trim().toLowerCase();
        resultsList.innerHTML = '';
        if (!query) return;

        const matches = allOffices.filter(office =>
            office.id.toLowerCase().includes(query) ||
            office.name.toLowerCase().includes(query)
        );

        matches.forEach(office => {
            const li = document.createElement('li');
            li.textContent = `${office.id} — ${office.name}`;
            li.addEventListener('click', () => {
                flyToOffice(office);
                input.value = '';
                resultsList.innerHTML = '';
            });
            resultsList.appendChild(li);
        });
    });
}

// === Улучшенный tooltip с привязкой к 3D ===
const tooltip = document.getElementById('tooltip');
const tooltipContent = tooltip ? tooltip.querySelector('#tooltip-content') || tooltip : tooltip;
let hoveredMarker = null;

// Конвертация 3D → 2D (экран)
function worldToScreen(position, camera) {
    const vector = position.clone().project(camera);
    const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;
    const visible = (
        vector.z > -1 && vector.z < 1 &&
        x >= 0 && x <= window.innerWidth &&
        y >= 0 && y <= window.innerHeight
    );
    return { x, y, visible };
}

// Обновление tooltip
function updateTooltip() {
    if (!hoveredMarker || !tooltip) return;

    const office = hoveredMarker.userData;
    tooltipContent.textContent = `${office.id} — ${office.name}`;

    const worldPos = hoveredMarker.position.clone();
    const screen = worldToScreen(worldPos, camera);

    if (screen.visible) {
        const tooltipHeight = tooltip.offsetHeight || 36;
        const tooltipWidth = tooltip.offsetWidth || 160;

        // Позиция НАД меткой (+ небольшой отступ)
        let x = screen.x - tooltipWidth / 2;
        let y = screen.y - tooltipHeight - 14;

        // Коррекция границ
        x = Math.max(10, Math.min(x, window.innerWidth - tooltipWidth - 10));
        y = Math.max(10, Math.min(y, window.innerHeight - tooltipHeight - 10));

        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
        tooltip.classList.add('visible');
    } else {
        tooltip.classList.remove('visible');
    }
}

// Проверка наведения
// Проверка наведения
function checkHover() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(officeLabels, false);

    // Сброс предыдущего hovered-маркера
    if (hoveredMarker) {
        const ud = hoveredMarker.userData;
        hoveredMarker.material.color.set(ud.baseColor);
        hoveredMarker.scale.setScalar(ud.baseScale);
        hoveredMarker = null;
    }

    if (intersects.length > 0) {
        const marker = intersects[0].object;
        const ud = marker.userData;

        // Применяем hover-эффект
        marker.material.color.set(ud.hoverColor);
        marker.scale.setScalar(ud.hoverScale);

        hoveredMarker = marker;
        requestAnimationFrame(updateTooltip);
    } else {
        tooltip?.classList.remove('visible');
    }
}

// Обработчики мыши
function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(officeLabels, false);

    if (intersects.length > 0) {
        const marker = intersects[0].object;
        const office = marker.userData;
        console.log(`Клик по кабинету: ${office.id} — ${office.name}`);
        // flyToOffice(office); // раскомментируйте, если нужно
    }
}

// === Инициализация UI ===
function initUI() {
    const panel = document.getElementById('controls-panel');
    const toggleBtn = document.getElementById('toggle-panel');
    const autoRotateBtn = document.getElementById('auto-rotate-btn');

    toggleBtn.addEventListener('click', () => {
        panel.classList.toggle('collapsed');
    });

    autoRotateBtn.addEventListener('click', () => {
        autoRotateEnabled = !autoRotateEnabled;
        autoRotateBtn.classList.toggle('active');
    });

    document.querySelectorAll('.model-btn').forEach(button => {
        button.addEventListener('click', function () {
            document.querySelectorAll('.model-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            loadModel(this.dataset.model);
        });
    });

    setupSearch();
}

// === Основной цикл ===
function animate() {
    requestAnimationFrame(animate);

    checkHover();

    if (currentModel && !isUserControlling && autoRotateEnabled) {
        angle += autoSpeed;
        camera.position.x = baseRadius * Math.cos(angle);
        camera.position.z = baseRadius * Math.sin(angle);
        camera.lookAt(0, 0, 0);
    }

    controls.update();
    renderer.render(scene, camera);
}

// === Обработка изменения размера окна ===
function handleResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);

    controls.zoomSpeed = width < 768 ? 0.5 : 1;
}

// === Слушатели ===
window.addEventListener('resize', handleResize);
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('click', onMouseClick, false);

// === Запуск ===
initUI();
loadModel('model1.glb');
animate();
