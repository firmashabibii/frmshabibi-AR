/**
 * Interactive Script for Firmas Habibi's WebAR Business Card
 * Implements lazy loading of A-Frame / AR.js and webcam track cleanup.
 */

// State flags
let scriptsLoaded = false;
let isARActive = false;

// DOM Elements
const btnOpenAR = document.getElementById('btn-open-ar');
const btnCloseAR = document.getElementById('btn-close-ar');
const arModal = document.getElementById('ar-modal');
const arViewport = document.getElementById('ar-viewport');
const arLoader = document.getElementById('ar-loader');
const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');
const btnHelp = document.getElementById('btn-help');
const markerPopup = document.getElementById('marker-popup');

// Original styles backup for resetting body after closing AR.js
let originalBodyStyles = {
  overflow: '',
  position: '',
  width: '',
  height: ''
};

// Help pop-up toggle
btnHelp.addEventListener('click', (e) => {
  e.stopPropagation();
  markerPopup.classList.toggle('show');
});

// Close popup when clicking anywhere else
document.addEventListener('click', () => {
  markerPopup.classList.remove('show');
});

// Open AR WebAR viewport
btnOpenAR.addEventListener('click', async () => {
  // Save original body styles
  originalBodyStyles.overflow = document.body.style.overflow;
  originalBodyStyles.position = document.body.style.position;
  originalBodyStyles.width = document.body.style.width;
  originalBodyStyles.height = document.body.style.height;

  // Open modal
  document.body.classList.add('ar-active');
  arModal.classList.add('open');
  arLoader.style.opacity = '1';
  arLoader.style.display = 'flex';
  setStatus('Memuat dependensi...', false);

  try {
    // 1. Lazy load A-Frame, AR.js and aframe-extras
    if (!scriptsLoaded) {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/aframe/1.4.2/aframe.min.js');
      await loadScript('https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js');
      await loadScript('https://cdn.jsdelivr.net/gh/c-frame/aframe-extras@7.2.0/dist/aframe-extras.min.js');
      scriptsLoaded = true;
    }

    // 2. Build and inject A-Frame scene
    buildARScene();
    isARActive = true;

  } catch (error) {
    console.error('Gagal memuat WebAR:', error);
    setStatus('Error memuat AR.js', false);
    alert('Terjadi kesalahan saat memuat dependensi Augmented Reality. Pastikan koneksi internet aktif.');
    closeAR();
  }
});

// Close AR WebAR viewport
btnCloseAR.addEventListener('click', () => {
  closeAR();
});

/**
 * Load script dynamically returning Promise
 */
function loadScript(url) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${url}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = url;
    script.async = false; // Maintain execution order
    script.onload = () => {
      console.log(`Script loaded: ${url}`);
      resolve();
    };
    script.onerror = () => reject(new Error(`Gagal memuat script: ${url}`));
    document.head.appendChild(script);
  });
}

/**
 * Update UI HUD status
 */
function setStatus(message, isActive = false) {
  statusText.textContent = message;
  if (isActive) {
    statusDot.classList.add('active');
  } else {
    statusDot.classList.remove('active');
  }
}

/**
 * Dynamically construct the A-Frame Scene
 */
function buildARScene() {
  // Remove existing scene if any
  const oldScene = document.getElementById('ar-scene');
  if (oldScene) {
    oldScene.remove();
  }

  // Create a-scene element
  const scene = document.createElement('a-scene');
  scene.setAttribute('id', 'ar-scene');
  scene.setAttribute('embedded', '');
  // Configure AR.js to search webcam and hide debug UI
  scene.setAttribute('arjs', 'sourceType: webcam; debugUIEnabled: false; trackingMethod: best; detectionMode: mono_and_matrix; matrixCodeType: 3x3;');
  scene.setAttribute('vr-mode-ui', 'enabled: false;');
  scene.setAttribute('renderer', 'logarithmicDepthBuffer: true; antialias: true; alpha: true;');
  
  // Inline styles to lock inside viewport
  scene.style.position = 'absolute';
  scene.style.top = '0';
  scene.style.left = '0';
  scene.style.width = '100%';
  scene.style.height = '100%';
  scene.style.zIndex = '1';

  // Scene Assets preloader
  scene.innerHTML = `
    <a-assets>
      <a-asset-item id="robot-glb" src="assets/robot.glb"></a-asset-item>
    </a-assets>

    <!-- Custom Card Marker target -->
    <a-marker type="pattern" url="assets/pattern-marker.patt" id="hiro-marker-element">
      
      <!-- 3D Animated Character: Microsoft Robot Expressive -->
      <!-- Set class clickable for raycaster selection -->
      <a-entity 
        id="robot-avatar"
        class="clickable"
        gltf-model="#robot-glb"
        position="0 0 0"
        scale="0.32 0.32 0.32"
        rotation="0 0 0"
        animation-mixer="clip: Dance; loop: repeat; timeScale: 1.1">
      </a-entity>

      <!-- Immersion identity animations around the marker -->
      <!-- Torus 1: Neon red outer grid ring -->
      <a-torus
        position="0 0.05 0"
        radius="0.75"
        radius-tubular="0.015"
        rotation="90 0 0"
        material="color: #ff3333; wireframe: true; opacity: 0.6; shader: flat"
        animation="property: rotation; from: 90 0 0; to: 90 360 0; loop: true; dur: 4500; easing: linear">
      </a-torus>

      <!-- Torus 2: White inner grid ring rotating opposite -->
      <a-torus
        position="0 0.05 0"
        radius="0.9"
        radius-tubular="0.008"
        rotation="90 0 90"
        material="color: #ffffff; wireframe: true; opacity: 0.3; shader: flat"
        animation="property: rotation; from: 90 0 90; to: 90 -360 90; loop: true; dur: 6000; easing: linear">
      </a-torus>

      <!-- Floating glowing particles orbiting -->
      <a-sphere
        position="0.7 0.3 0"
        radius="0.05"
        material="color: #ff3333; emissive: #ff3333; emissiveIntensity: 2; shader: flat"
        animation="property: position; from: 0.7 0.3 0; to: 0.7 0.6 0; dir: alternate; loop: true; dur: 1200; easing: easeInOutSine">
      </a-sphere>

      <a-sphere
        position="-0.7 0.5 0"
        radius="0.04"
        material="color: #ffffff; emissive: #ffffff; emissiveIntensity: 1; shader: flat"
        animation="property: position; from: -0.7 0.5 0; to: -0.7 0.2 0; dir: alternate; loop: true; dur: 1600; easing: easeInOutSine">
      </a-sphere>

      <!-- Floating Cyberpunk 3D Profile Card -->
      <a-plane
        id="ar-profile-card"
        position="0 0.9 -0.9"
        rotation="-35 0 0"
        width="2.3"
        height="1.5"
        material="color: #0d0d15; opacity: 0.92; transparent: true; shader: flat; side: double">
        
        <!-- Red Card Borders -->
        <a-ring radius-inner="1.13" radius-outer="1.15" position="0 0 0.005" scale="1 0.65 1" material="color: #ff3333; shader: flat"></a-ring>

        <!-- Profile Card Header ID -->
        <a-text
          value="ID: FRM205 // WebAR Profile"
          color="#ff3333"
          align="left"
          position="-1.05 0.58 0.01"
          width="2.6"
          font="monoid"
          wrap-count="35">
        </a-text>

        <!-- Full Name -->
        <a-text
          value="FIRMAS HABIBI"
          color="#ffffff"
          align="center"
          position="0 0.28 0.01"
          width="4.5"
          font="exo2bold"
          bold="true"
          wrap-count="20">
        </a-text>

        <!-- Role / Title -->
        <a-text
          value="FULLSTACK SOFTWARE ENGINEER"
          color="#ff5f5f"
          align="center"
          position="0 0.04 0.01"
          width="3.5"
          font="exo2semibold"
          wrap-count="25">
        </a-text>

        <!-- Stack tag texts -->
        <a-text
          value="React * Node.js * TypeScript"
          color="#a0a0ab"
          align="center"
          position="0 -0.22 0.01"
          width="3.2"
          font="monoid"
          wrap-count="30">
        </a-text>

        <!-- Action / Domain text -->
        <a-text
          value="frmshbi.dev"
          color="#ff3333"
          align="center"
          position="0 -0.5 0.01"
          width="3"
          font="monoid"
          wrap-count="25">
        </a-text>

      </a-plane>

    </a-marker>

    <!-- Camera setup with raycaster cursor for tapping -->
    <a-entity camera>
      <a-cursor 
        id="ar-cursor"
        color="#ff3333" 
        material="opacity: 0.7; shader: flat" 
        scale="0.8 0.8 0.8" 
        raycaster="objects: .clickable">
      </a-cursor>
    </a-entity>
  `;

  // Append to viewport
  arViewport.appendChild(scene);

  // Scene loading callback
  scene.addEventListener('loaded', () => {
    console.log('A-Frame scene loaded.');
    arLoader.style.opacity = '0';
    setTimeout(() => {
      arLoader.style.display = 'none';
    }, 500);
    setStatus('Mencari Marker...', false);
  });

  // Setup Marker event listeners (Practical 3.3.5)
  const marker = document.getElementById('hiro-marker-element');
  
  marker.addEventListener('markerFound', () => {
    console.log('Marker Hiro terdeteksi!');
    setStatus('Marker Terdeteksi!', true);
    
    // Quick vibration if supported on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
  });

  marker.addEventListener('markerLost', () => {
    console.log('Marker hilang dari kamera');
    setStatus('Mencari Marker...', false);
  });

  // Setup click handler for interactivity: change robot animations
  const robot = document.getElementById('robot-avatar');
  const animClips = ['Dance', 'Wave', 'ThumbsUp', 'Jump', 'Walk'];
  let currentAnimIdx = 0;

  robot.addEventListener('click', (e) => {
    e.stopPropagation();
    currentAnimIdx = (currentAnimIdx + 1) % animClips.length;
    const nextAnim = animClips[currentAnimIdx];
    console.log(`Mengganti animasi ke: ${nextAnim}`);
    
    robot.setAttribute('animation-mixer', `clip: ${nextAnim}; loop: repeat; timeScale: 1.1; crossFadeDuration: 0.4;`);
    setStatus(`Animasi: ${nextAnim.toUpperCase()}`, true);

    // Subtle scale bump for feedback
    robot.setAttribute('animation__scale', {
      property: 'scale',
      to: '0.36 0.36 0.36',
      dur: 150,
      dir: 'alternate',
      loop: 1
    });

    // Reset scale afterward
    setTimeout(() => {
      robot.removeAttribute('animation__scale');
      robot.setAttribute('scale', '0.32 0.32 0.32');
    }, 300);
  });
}

/**
 * Shut down the AR system and stop the webcam
 */
function closeAR() {
  if (!isARActive) return;
  isARActive = false;

  // Remove active class
  document.body.classList.remove('ar-active');

  // 1. Hide modal
  arModal.classList.remove('open');
  
  // 2. Remove scene from DOM to halt WebGL context
  const scene = document.getElementById('ar-scene');
  if (scene) {
    scene.remove();
  }

  // 3. STOP camera tracks strictly (Practical 5.5)
  document.querySelectorAll('video').forEach(video => {
    if (video.srcObject) {
      video.srcObject.getTracks().forEach(track => {
        track.stop();
        console.log('Camera track stopped.');
      });
      video.srcObject = null;
    }
    video.remove(); // Remove injected AR.js video wrapper elements
  });

  // 4. Remove elements created by AR.js directly inside body
  const arjsVideo = document.querySelector('.a-canvas');
  if (arjsVideo) arjsVideo.remove();
  
  const arjsDevices = document.querySelectorAll('video');
  arjsDevices.forEach(v => v.remove());

  // 5. Restore body styling (AR.js forces styling on body/html tags)
  document.documentElement.style.overflow = '';
  document.documentElement.style.position = '';
  document.documentElement.style.width = '';
  document.documentElement.style.height = '';
  
  document.body.style.overflow = originalBodyStyles.overflow;
  document.body.style.position = originalBodyStyles.position;
  document.body.style.width = originalBodyStyles.width;
  document.body.style.height = originalBodyStyles.height;

  // Clear orientation styling overlays injected by A-Frame
  const aframeStyles = document.querySelectorAll('style[aframe-injected]');
  // Keep them, but clean up the body class list
  document.body.classList.remove('a-body');
  
  console.log('WebAR engine completely shut down.');
}
