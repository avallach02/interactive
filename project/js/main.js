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

const ambientLight = new THREE.AmbientLight(0x404040, 6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

let currentModel = null;
const baseRadius = Math.sqrt(initialCameraPosition.x ** 2 + initialCameraPosition.z ** 2);
const autoSpeed = 0.0009;
let angle = Math.atan2(initialCameraPosition.z, initialCameraPosition.x);
let isUserControlling = false;
let autoRotateEnabled = false;

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

const loader = new THREE.GLTFLoader();

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

            // Центрирование модели
            const box = new THREE.Box3().setFromObject(currentModel);
            const center = box.getCenter(new THREE.Vector3());
            currentModel.position.sub(center);

            const size = box.getSize(new THREE.Vector3()).length();
            const cameraDistance = size * 1.5;
            initialCameraPosition.set(-cameraDistance / 2, cameraDistance / 2, cameraDistance / 2);
            camera.position.copy(initialCameraPosition);
            angle = Math.atan2(initialCameraPosition.z, initialCameraPosition.x);
            controls.reset();

            // ✅ ДОБАВЛЯЕМ МЕТКИ ДЛЯ ЭТОЙ МОДЕЛИ
            const officesForThisModel = officeData[modelPath] || [];
            addOfficeMarkers(officesForThisModel);
        },
        undefined,
        (error) => console.error('Error loading model:', error)
    );
}

// ... ваша сцена, камера, рендерер ...

// ДАННЫЕ О КАБИНЕТАХ (пример)
const officeData = {
    'model1.glb': [
        { id: '101', name: 'Деканат', position: new THREE.Vector3(-1, 0.03, 0.65) },
        { id: '102', name: 'Деканат', position: new THREE.Vector3(-1, 0.03, 0.45) },
        { id: '103', name: 'Деканат', position: new THREE.Vector3(-1, 0.03, 0.25) },
        { id: '104', name: 'Деканат', position: new THREE.Vector3(-1, 0.03, 0.02) },
        { id: '105', name: 'Аудитория 102', position: new THREE.Vector3(-0.13, 0, 0.45) },
        { id: '106', name: 'Лаборатория 110', position: new THREE.Vector3(2.18, 0.03, 0.43) },
        { id: '107', name: 'Лаборатория 110', position: new THREE.Vector3(2.18, 0.03, 0.04) },
        { id: '103', name: 'Лаборатория 110', position: new THREE.Vector3(2.18, 0.03, -0.48) },
        { id: '103', name: 'Лаборатория 110', position: new THREE.Vector3(2.18, 0.03, -0.29) },
        { id: '103', name: 'Лаборатория 110', position: new THREE.Vector3(2.18, 0.03, -0.11) },
        { id: '103', name: 'Лаборатория 110', position: new THREE.Vector3(2.18, 0.03, 0.43) },
        { id: '102', name: 'Лаборатория 110', position: new THREE.Vector3(-0.13, 0, 0.45) },
        { id: '103', name: 'Лаборатория 110', position: new THREE.Vector3(1.75, 0.03, 0.43) },
        { id: '103', name: 'Лаборатория 110', position: new THREE.Vector3(1.75, 0.03, 0.24) },
        { id: '103', name: 'Лаборатория 110', position: new THREE.Vector3(1.75, 0.03, -0.18) },
        { id: '103', name: 'Лаборатория 110', position: new THREE.Vector3(1, 0.03, -0.35) },
        { id: '103', name: 'Лаборатория 110', position: new THREE.Vector3(1.44, 0.03, -0.9) },
        { id: '103', name: 'Лаборатория 110', position: new THREE.Vector3(0.5, 0.03, -0.9) },
        { id: '103', name: 'Лаборатория 110', position: new THREE.Vector3(0.155, 0.03, -0.35) }
    ],
    'model2.glb': [
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(1.75, 0, -2.05) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(0, 0, -2.05) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(0, 0, -2.05) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(0, 0, -2.05) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(0, 0, -2.05) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(0, 0, -2.05) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(0, 0, -2.05) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(0, 0, -2.05) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(0, 0, -2.05) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(0, 0, -2.05) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(0, 0, -2.05) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(0, 0, -2.05) },
        { id: '201', name: 'Кафедра ИТ', position: new THREE.Vector3(0, 0, -2.05) },
        { id: '205', name: 'Аудитория 205', position: new THREE.Vector3(0, 0, -2.05) }
    ],
    'model3.glb': [
        { id: '301', name: 'Библиотека', position: new THREE.Vector3(0, 0, 0) },
        { id: '310', name: 'Лаборатория 310', position: new THREE.Vector3(-1, 0, 4) }
    ],
    'model4.glb': [
        { id: '401', name: 'Зал заседаний', position: new THREE.Vector3(1.5, 0, 2.5) }
    ],
    'model5.glb': [
        { id: '501', name: 'Крыша (тех. зона)', position: new THREE.Vector3(0, 0, 0) }
    ]
};

let officeLabels = []; // глобальный массив для очистки

function addOfficeMarkers(offices) {
    // Удаляем старые метки
    officeLabels.forEach(marker => scene.remove(marker));
    officeLabels = [];

    if (!offices || offices.length === 0) return;

    const geometry = new THREE.SphereGeometry(0.03, 20, 20);
    const material = new THREE.MeshBasicMaterial({
        color: 0x008080, // голубой — хорошо виден на тёмном фоне
        transparent: true,
        opacity: 0.8,
        depthTest: false
    });

    offices.forEach(office => {
        const marker = new THREE.Mesh(geometry, material);
        marker.position.copy(office.position);
        marker.userData = { id: office.id, name: office.name };
        scene.add(marker);
        officeLabels.push(marker);
    });
}
// === СИСТЕМА ПОИСКА ===
function initSearchModal() {
    const modal = document.getElementById('search-modal');
    const openBtn = document.getElementById('open-search-btn');
    const closeBtn = document.getElementById('close-search-modal');
    const input = document.getElementById('search-input');
    const resultsList = document.getElementById('search-results');

    openBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
        input.value = '';
        resultsList.innerHTML = '';
        input.focus();
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    input.addEventListener('input', () => {
        const query = input.value.trim().toLowerCase();
        resultsList.innerHTML = '';
        if (!query) return;

        const matches = offices.filter(office =>
            office.id.toLowerCase().includes(query) ||
            office.name.toLowerCase().includes(query)
        );

        matches.forEach(office => {
            const li = document.createElement('li');
            li.textContent = `${office.id} — ${office.name}`;
            li.style.padding = '10px';
            li.style.cursor = 'pointer';
            li.style.borderBottom = '1px solid #444';
            li.addEventListener('click', () => {
                flyToOffice(office);
                modal.style.display = 'none';
            });
            resultsList.appendChild(li);
        });
    });
}

// Плавный перелёт к кабинету
function flyToOffice(office) {
    isUserControlling = true;
    autoRotateEnabled = false;
    if (document.getElementById('auto-rotate-btn')) {
        document.getElementById('auto-rotate-btn').classList.remove('active');
    }

    const targetPos = office.position.clone().add(new THREE.Vector3(2, 2, 2));
    const startPos = camera.position.clone();
    const startLook = new THREE.Vector3();
    camera.getWorldDirection(startLook);
    startLook.multiplyScalar(-1).add(camera.position);
    const targetLook = office.position.clone();

    const duration = 1500;
    const startTime = performance.now();

    function easeOut(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function animateFly(now) {
        const t = Math.min((now - startTime) / duration, 1);
        const eased = easeOut(t);

        camera.position.lerpVectors(startPos, targetPos, eased);
        const currentLook = new THREE.Vector3().lerpVectors(startLook, targetLook, eased);
        camera.lookAt(currentLook);

        if (t < 1) {
            requestAnimationFrame(animateFly);
        } else {
            isUserControlling = false;
        }
    }

    requestAnimationFrame(animateFly);
}

function initUI() {
    const panel = document.getElementById('controls-panel');
    const toggleBtn = document.getElementById('toggle-panel');

    toggleBtn.addEventListener('click', () => {
        panel.classList.toggle('collapsed');
    });

    const autoRotateBtn = document.getElementById('auto-rotate-btn');
    autoRotateBtn.addEventListener('click', () => {
        autoRotateEnabled = !autoRotateEnabled;
        autoRotateBtn.classList.toggle('active');
    });

    document.querySelectorAll('.model-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.model-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            loadModel(this.dataset.model);
        });
    });
}


function animate() {
    requestAnimationFrame(animate);
    
    if (currentModel && !isUserControlling && autoRotateEnabled) {
        angle += autoSpeed;
        camera.position.x = baseRadius * Math.cos(angle);
        camera.position.z = baseRadius * Math.sin(angle);
        camera.lookAt(0, 0, 0);
    }
    
    controls.update();
    renderer.render(scene, camera);
}


initUI();
loadModel('model1.glb');
animate();

function handleResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    
    if (width < 768) {
        controls.zoomSpeed = 0.5;
    } else {
        controls.zoomSpeed = 1;
    }
        // ✅ Инициализация поиска
    initSearchModal();
}

