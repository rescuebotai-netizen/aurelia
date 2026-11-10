import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { WeddingData } from '../types/wedding';

interface ThreeEnvelopeCanvasProps {
  wedding: WeddingData;
  isOpening: boolean;
  onOpenTrigger: () => void;
  onAnimationComplete: () => void;
}

export const ThreeEnvelopeCanvas: React.FC<ThreeEnvelopeCanvasProps> = ({
  wedding,
  isOpening,
  onOpenTrigger,
  onAnimationComplete
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isOpeningRef = useRef(isOpening);
  isOpeningRef.current = isOpening;

  const onOpenTriggerRef = useRef(onOpenTrigger);
  onOpenTriggerRef.current = onOpenTrigger;

  const onAnimationCompleteRef = useRef(onAnimationComplete);
  onAnimationCompleteRef.current = onAnimationComplete;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // Check for software GL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true
    });
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Scene & Camera
    const scene = new THREE.Scene();

    // Studio environment map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 0.15, 3.8); // 10-15° perspective tilt down
    camera.lookAt(0, 0, 0);

    // 3. Studio Lighting Rig
    // Key Light: Warm champagne directional light
    const keyLight = new THREE.DirectionalLight(0xfff7e6, 2.4);
    keyLight.position.set(2.5, 4.0, 3.5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 10;
    keyLight.shadow.bias = -0.0004;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    // Spotlight: Illuminating the envelope center
    const spotLight = new THREE.SpotLight(0xffecd1, 2.8);
    spotLight.position.set(0, 3.5, 2.5);
    spotLight.angle = Math.PI / 4.2;
    spotLight.penumbra = 0.75;
    spotLight.decay = 1.2;
    spotLight.distance = 12;
    scene.add(spotLight);

    // Fill Light: Soft cool ambient
    const fillLight = new THREE.HemisphereLight(0xfffdfa, 0x1a1815, 0.85);
    scene.add(fillLight);

    // Rim/Back Light: To highlight paper edges and gold foil sheen
    const rimLight = new THREE.DirectionalLight(0xd4af37, 1.2);
    rimLight.position.set(-3.0, 2.0, -2.0);
    scene.add(rimLight);

    // Warm Point Light inside envelope pocket (glows when opening)
    const innerPocketGlow = new THREE.PointLight(0xffd57a, 0.0, 4.5);
    innerPocketGlow.position.set(0, 0.1, 0.08);
    scene.add(innerPocketGlow);

    // 4. Procedural Textures & Materials
    // A. Cotton Paper Texture Canvas
    const createCottonPaperTexture = () => {
      const cv = document.createElement('canvas');
      cv.width = 1024;
      cv.height = 1024;
      const ctx = cv.getContext('2d');
      if (!ctx) return new THREE.CanvasTexture(cv);

      // Base warm ivory
      ctx.fillStyle = '#F8F4EC';
      ctx.fillRect(0, 0, 1024, 1024);

      // Very subtle organic cotton fiber noise
      const imgData = ctx.getImageData(0, 0, 1024, 1024);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const grain = (Math.random() - 0.5) * 9;
        data[i] = Math.min(255, Math.max(0, data[i] + grain));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + grain * 0.95));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + grain * 0.85));
      }
      ctx.putImageData(imgData, 0, 0);

      // Delicate fine fiber strands
      ctx.strokeStyle = 'rgba(180, 165, 140, 0.07)';
      ctx.lineWidth = 0.75;
      for (let j = 0; j < 350; j++) {
        const sx = Math.random() * 1024;
        const sy = Math.random() * 1024;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.quadraticCurveTo(
          sx + (Math.random() - 0.5) * 16,
          sy + (Math.random() - 0.5) * 16,
          sx + (Math.random() - 0.5) * 28,
          sy + (Math.random() - 0.5) * 28
        );
        ctx.stroke();
      }

      const tex = new THREE.CanvasTexture(cv);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      return tex;
    };

    // B. Envelope Front Surface Texture with Gold Foil Border, Botanical Corner Filigree & Raised Monogram
    const monogramText = wedding.monogram || 'S & K';
    const createFrontDesignTextures = () => {
      const cvColor = document.createElement('canvas');
      cvColor.width = 2048;
      cvColor.height = 1380;
      const ctxC = cvColor.getContext('2d')!;

      const cvRough = document.createElement('canvas');
      cvRough.width = 2048;
      cvRough.height = 1380;
      const ctxR = cvRough.getContext('2d')!;

      const cvMetal = document.createElement('canvas');
      cvMetal.width = 2048;
      cvMetal.height = 1380;
      const ctxM = cvMetal.getContext('2d')!;

      // 1. Warm ivory paper background
      ctxC.fillStyle = '#F8F4EC';
      ctxC.fillRect(0, 0, 2048, 1380);

      // Paper roughness: 0.82 (matte)
      ctxR.fillStyle = '#D2D2D2';
      ctxR.fillRect(0, 0, 2048, 1380);

      // Paper metalness: 0
      ctxM.fillStyle = '#000000';
      ctxM.fillRect(0, 0, 2048, 1380);

      // 2. Thin Champagne Gold Foil Border (Outer & Inner Inset)
      const drawFoilRect = (inset: number, width: number) => {
        // Color
        ctxC.strokeStyle = '#D4AF37';
        ctxC.lineWidth = width;
        ctxC.strokeRect(inset, inset, 2048 - inset * 2, 1380 - inset * 2);

        // Roughness (very smooth for foil reflection)
        ctxR.strokeStyle = '#222222';
        ctxR.lineWidth = width;
        ctxR.strokeRect(inset, inset, 2048 - inset * 2, 1380 - inset * 2);

        // Metalness (high for foil)
        ctxM.strokeStyle = '#F0F0F0';
        ctxM.lineWidth = width;
        ctxM.strokeRect(inset, inset, 2048 - inset * 2, 1380 - inset * 2);
      };

      drawFoilRect(48, 4.0);
      drawFoilRect(62, 1.5);

      // 3. Subtle Corner Botanical Filigree
      const drawCornerBotanical = (x: number, y: number, angle: number) => {
        ctxC.save();
        ctxR.save();
        ctxM.save();

        ctxC.translate(x, y);
        ctxC.rotate(angle);
        ctxR.translate(x, y);
        ctxR.rotate(angle);
        ctxM.translate(x, y);
        ctxM.rotate(angle);

        // Subtle gold laurel branches
        const renderBranches = (ctx: CanvasRenderingContext2D, color: string, w: number) => {
          ctx.strokeStyle = color;
          ctx.lineWidth = w;
          ctx.beginPath();
          ctx.arc(0, 0, 80, 0, Math.PI / 2);
          ctx.stroke();

          // Delicate leaves
          for (let a = 0.2; a < 1.4; a += 0.25) {
            const lx = Math.cos(a) * 80;
            const ly = Math.sin(a) * 80;
            ctx.beginPath();
            ctx.ellipse(lx + 10, ly + 10, 14, 6, a + 0.4, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
          }
        };

        renderBranches(ctxC, '#D4AF37', 2.0);
        renderBranches(ctxR, '#222222', 2.0);
        renderBranches(ctxM, '#E0E0E0', 2.0);

        ctxC.restore();
        ctxR.restore();
        ctxM.restore();
      };

      drawCornerBotanical(85, 85, 0);
      drawCornerBotanical(2048 - 85, 85, Math.PI / 2);
      drawCornerBotanical(2048 - 85, 1380 - 85, Math.PI);
      drawCornerBotanical(85, 1380 - 85, -Math.PI / 2);

      // 4. Center Raised Metallic Gold Monogram (Embossed & Foiled)
      const renderMonogram = (ctx: CanvasRenderingContext2D, color: string) => {
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 96px "Cinzel", "Cormorant Garamond", Georgia, serif';
        ctx.fillText(monogramText, 1024, 690);

        // Subtitle script
        ctx.font = 'italic 34px "Cormorant Garamond", Georgia, serif';
        ctx.fillText('Celebration of Marriage', 1024, 780);
      };

      renderMonogram(ctxC, '#C59B27');
      renderMonogram(ctxR, '#181818');
      renderMonogram(ctxM, '#FFFFFF');

      const colTex = new THREE.CanvasTexture(cvColor);
      colTex.colorSpace = THREE.SRGBColorSpace;
      const roughTex = new THREE.CanvasTexture(cvRough);
      const metalTex = new THREE.CanvasTexture(cvMetal);

      return { colTex, roughTex, metalTex };
    };

    const paperTex = createCottonPaperTexture();
    const { colTex: frontColTex, roughTex: frontRoughTex, metalTex: frontMetalTex } = createFrontDesignTextures();

    // C. Cotton Paper Physical Material
    const cottonPaperMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf8f4ec,
      map: paperTex,
      roughness: 0.82,
      metalness: 0.02,
      clearcoat: 0.0,
      sheen: 0.35,
      sheenColor: new THREE.Color(0xfff8ee),
      sheenRoughness: 0.6
    });

    // D. Front Envelope Material with Gold Foil
    const envelopeFrontMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf8f4ec,
      map: frontColTex,
      roughnessMap: frontRoughTex,
      metalnessMap: frontMetalTex,
      roughness: 0.82,
      metalness: 0.05,
      clearcoat: 0.15,
      clearcoatRoughness: 0.3
    });

    // E. Burgundy Wax Seal Material
    const createWaxSealTexture = () => {
      const cv = document.createElement('canvas');
      cv.width = 512;
      cv.height = 512;
      const ctx = cv.getContext('2d')!;

      // Deep rich wine burgundy
      ctx.fillStyle = '#5A101C';
      ctx.fillRect(0, 0, 512, 512);

      // Concentric organic rim
      ctx.strokeStyle = '#6E1624';
      ctx.lineWidth = 18;
      ctx.beginPath();
      ctx.arc(256, 256, 190, 0, Math.PI * 2);
      ctx.stroke();

      // Metallic Gold engraved Monogram in center
      ctx.fillStyle = '#D4AF37';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 120px "Cinzel", "Cormorant Garamond", Georgia, serif';
      ctx.fillText(monogramText, 256, 256);

      const tex = new THREE.CanvasTexture(cv);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    const waxSealTex = createWaxSealTexture();
    const waxSealMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x6e1422, // Deep Royal Burgundy
      map: waxSealTex,
      roughness: 0.32,
      metalness: 0.15,
      clearcoat: 0.6,
      clearcoatRoughness: 0.22,
      transmission: 0.04
    });

    // 5. ASSEMBLE 3D LUXURY ENVELOPE (THREE.Group)
    const envelopeGroup = new THREE.Group();
    // 10-15° perspective tilt
    envelopeGroup.rotation.x = 0.18; // ~10.5 degrees forward
    envelopeGroup.rotation.y = -0.06;
    envelopeGroup.rotation.z = 0.01;
    scene.add(envelopeGroup);

    // Envelope Dimensions
    const envW = 3.2;
    const envH = 2.16;
    const envD = 0.045; // Thick, luxury cotton paper stack

    // Sub-part 1: Main Envelope Back & Pocket Body
    const bodyGeo = new THREE.BoxGeometry(envW, envH, envD);
    const bodyMaterials = [
      cottonPaperMaterial, // right
      cottonPaperMaterial, // left
      cottonPaperMaterial, // top
      cottonPaperMaterial, // bottom
      envelopeFrontMaterial, // front
      cottonPaperMaterial  // back
    ];
    const envelopeBodyMesh = new THREE.Mesh(bodyGeo, bodyMaterials);
    envelopeBodyMesh.castShadow = !isSoftwareGl;
    envelopeBodyMesh.receiveShadow = !isSoftwareGl;
    envelopeGroup.add(envelopeBodyMesh);

    // Sub-part 2: Inner Gold Damask Lining (inside pocket)
    const liningGeo = new THREE.PlaneGeometry(envW - 0.1, envH - 0.1);
    const liningMat = new THREE.MeshStandardMaterial({
      color: 0xe8cd78,
      roughness: 0.28,
      metalness: 0.85
    });
    const liningMesh = new THREE.Mesh(liningGeo, liningMat);
    liningMesh.position.set(0, 0, 0.012);
    envelopeGroup.add(liningMesh);

    // Sub-part 3: Top Folding Flap (European Pointed Triangular Flap)
    const flapPivot = new THREE.Group();
    flapPivot.position.set(0, envH / 2, envD / 2 + 0.003);
    envelopeGroup.add(flapPivot);

    const flapShape = new THREE.Shape();
    flapShape.moveTo(-envW / 2 + 0.02, 0);
    flapShape.lineTo(envW / 2 - 0.02, 0);
    flapShape.lineTo(0, -envH * 0.58); // pointed tip extends below center
    flapShape.closePath();

    const flapExtrudeSettings = {
      depth: 0.015,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.008,
      bevelThickness: 0.008
    };

    const flapGeo = new THREE.ExtrudeGeometry(flapShape, flapExtrudeSettings);
    const flapMesh = new THREE.Mesh(flapGeo, cottonPaperMaterial);
    flapMesh.castShadow = !isSoftwareGl;
    flapMesh.receiveShadow = !isSoftwareGl;
    flapPivot.add(flapMesh);

    // Sub-part 4: Wax Seal (Handcrafted organic circular seal at flap tip)
    const waxSealPivot = new THREE.Group();
    waxSealPivot.position.set(0, -envH * 0.56, 0.024);
    flapPivot.add(waxSealPivot);

    // Irregular handcrafted seal rim
    const sealGeo = new THREE.CylinderGeometry(0.24, 0.25, 0.038, 32);
    // Perturb vertices slightly for organic wax realism
    const posAttr = sealGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vz = posAttr.getZ(i);
      const angle = Math.atan2(vz, vx);
      const ripple = 1.0 + Math.sin(angle * 7) * 0.03 + Math.cos(angle * 4) * 0.02;
      posAttr.setX(i, vx * ripple);
      posAttr.setZ(i, vz * ripple);
    }
    sealGeo.computeVertexNormals();

    const waxSealMesh = new THREE.Mesh(sealGeo, waxSealMaterial);
    waxSealMesh.rotation.x = Math.PI / 2;
    waxSealMesh.castShadow = !isSoftwareGl;
    waxSealPivot.add(waxSealMesh);

    // Sub-part 5: The Keepsake Invitation Card Inside Pocket
    const cardGroup = new THREE.Group();
    cardGroup.position.set(0, 0, 0.018);
    envelopeGroup.add(cardGroup);

    // Load couple photo for card
    const texLoader = new THREE.TextureLoader();
    const cardTex = texLoader.load('/src/assets/images/IMG-20261107-WA0181.jpg');
    cardTex.colorSpace = THREE.SRGBColorSpace;

    const cardMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      map: cardTex,
      roughness: 0.35,
      metalness: 0.05,
      clearcoat: 0.2
    });
    const cardGeo = new THREE.BoxGeometry(envW * 0.88, envH * 0.84, 0.012);
    const cardMesh = new THREE.Mesh(cardGeo, cardMat);
    cardGroup.add(cardMesh);

    // Gold border trim around card
    const cardEdgeGeo = new THREE.BoxGeometry(envW * 0.88 + 0.02, envH * 0.84 + 0.02, 0.01);
    const cardEdgeMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.2
    });
    const cardEdgeMesh = new THREE.Mesh(cardEdgeGeo, cardEdgeMat);
    cardEdgeMesh.position.z = -0.002;
    cardGroup.add(cardEdgeMesh);

    // Sub-part 6: Soft Contact Shadow Grounding
    const createShadowTexture = () => {
      const cv = document.createElement('canvas');
      cv.width = 512;
      cv.height = 512;
      const ctx = cv.getContext('2d')!;
      const grad = ctx.createRadialGradient(256, 256, 20, 256, 256, 240);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
      grad.addColorStop(0.5, 'rgba(15, 12, 10, 0.25)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);
      const tex = new THREE.CanvasTexture(cv);
      return tex;
    };

    const shadowTex = createShadowTexture();
    const shadowGeo = new THREE.PlaneGeometry(envW * 1.5, envH * 1.4);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.45,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.set(0, -envH * 0.52, -0.15);
    shadowMesh.rotation.x = -Math.PI / 2.3;
    scene.add(shadowMesh);

    // 6. Interactive Raycasting & Pointer Parallax
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const targetTilt = { x: 0.18, y: -0.06 };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      mouse.x = (clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(clientY / window.innerHeight) * 2 + 1;

      targetTilt.y = mouse.x * 0.12 - 0.06;
      targetTilt.x = 0.18 - mouse.y * 0.08;
    };

    const handleClick = (e: MouseEvent | TouchEvent) => {
      const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : (e as MouseEvent).clientY;
      mouse.x = (clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([envelopeBodyMesh, flapMesh, waxSealMesh], true);
      if (intersects.length > 0) {
        onOpenTriggerRef.current();
      }
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('click', handleClick);
    window.addEventListener('touchend', handleClick);

    // 7. Animation Loop with Cinematic Push-In & Unsealing Transition
    let frameId = 0;
    const clock = new THREE.Clock();
    let flapAngle = 0;
    let cardElevate = 0;
    let sealScale = 1.0;
    let targetCameraZ = 3.8;
    let hasCompletedAnimation = false;

    const tick = () => {
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();

      // Gentle organic float
      envelopeGroup.position.y = Math.sin(elapsedTime * 0.9) * 0.025;

      // Parallax smoothing
      envelopeGroup.rotation.x = THREE.MathUtils.damp(envelopeGroup.rotation.x, targetTilt.x, 3.5, delta);
      envelopeGroup.rotation.y = THREE.MathUtils.damp(envelopeGroup.rotation.y, targetTilt.y, 3.5, delta);

      // Camera push-in
      if (!isOpeningRef.current) {
        // Subtle slow cinematic forward push
        targetCameraZ = 3.8 - Math.min(0.25, elapsedTime * 0.04);
      } else {
        // Dramatic push-in when opening
        targetCameraZ = 3.0;
      }
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCameraZ, 2.8, delta);

      // Unsealing Animation
      if (isOpeningRef.current) {
        // 1. Wax seal breaks/dissolves
        sealScale = THREE.MathUtils.damp(sealScale, 0.0, 4.0, delta);
        waxSealPivot.scale.set(sealScale, sealScale, sealScale);

        // 2. Flap lifts backwards in 3D realistic rotation
        flapAngle = THREE.MathUtils.damp(flapAngle, -Math.PI * 0.88, 2.2, delta);
        flapPivot.rotation.x = flapAngle;

        // 3. Inner pocket light glow intensifies
        innerPocketGlow.intensity = THREE.MathUtils.damp(innerPocketGlow.intensity, 4.2, 2.0, delta);

        // 4. Keepsake card slides smoothly out of pocket
        if (Math.abs(flapAngle) > Math.PI * 0.4) {
          cardElevate = THREE.MathUtils.damp(cardElevate, 1.45, 1.8, delta);
          cardGroup.position.y = cardElevate;
          cardGroup.position.z = 0.018 + cardElevate * 0.08;
          cardGroup.rotation.x = -cardElevate * 0.04;
        }

        // Check completion
        if (cardElevate > 1.25 && !hasCompletedAnimation) {
          hasCompletedAnimation = true;
          setTimeout(() => {
            onAnimationCompleteRef.current();
          }, 1400);
        }
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };

    tick();

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchend', handleClick);
      window.removeEventListener('resize', handleResize);

      // Dispose Three.js objects
      renderer.dispose();
      bodyGeo.dispose();
      liningGeo.dispose();
      flapGeo.dispose();
      sealGeo.dispose();
      cardGeo.dispose();
      cardEdgeGeo.dispose();
      shadowGeo.dispose();

      paperTex.dispose();
      frontColTex.dispose();
      frontRoughTex.dispose();
      frontMetalTex.dispose();
      waxSealTex.dispose();
      shadowTex.dispose();
      cardTex.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [wedding]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 z-10 w-full h-full cursor-pointer select-none"
      onClick={onOpenTrigger}
      title="Click or tap to open luxury invitation"
    />
  );
};
