import React, { useState, useRef, useEffect, useMemo, Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Environment } from "@react-three/drei";
import * as THREE from "three";
import { Canvg } from "canvg";

// Main App Component
function App() {
  // State for SVG file
  const [svgFile, setSvgFile] = useState(null);
  const [svgFileName, setSvgFileName] = useState("No file selected");
  const [isProcessingSvg, setIsProcessingSvg] = useState(false);

  // State for egg parameters
  const [eggParams, setEggParams] = useState({
    radiusX: 1.0, // Width
    radiusY: 1.2, // Height
    radiusZ: 1.0, // Depth
    segments: 512, // Detail level
  });

  // State for appearance
  const [eggColor, setEggColor] = useState("#F0EAD6");
  const [textureOpacity, setTextureOpacity] = useState(1.0);
  const [showWireframe, setShowWireframe] = useState(false);

  // State for projection properties
  const [projectionSize, setProjectionSize] = useState(1.0);
  const [projectionOffset, setProjectionOffset] = useState({ x: -0.5, y: -0.50 });
  const [designRotation, setDesignRotation] = useState(180);
  const [verticalCoverage, setVerticalCoverage] = useState(0.7); // New state for vertical stretch
  const [verticalOffset, setVerticalOffset] = useState(0.0); // New state for vertical offset

  // State for 3D rotation
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });

  // State for rasterization
  const [resolution, setResolution] = useState(72);

  // Handle SVG file upload
  const handleSvgUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith(".svg")) {
      setIsProcessingSvg(true);
      setSvgFileName(file.name);

      const reader = new FileReader();
      reader.onload = (e) => {
        setSvgFile(e.target.result);
        setIsProcessingSvg(false);
      };
      reader.onerror = () => {
        alert("Error reading the SVG file");
        setIsProcessingSvg(false);
      };
      reader.readAsText(file);
    } else if (file) {
      alert("Please select a valid SVG file");
    }
  };

  // Handle rotation presets
  const rotateDesign = (degrees) => {
    setDesignRotation((prev) => (prev + degrees) % 360);
  };

  // Reset all settings
  const resetSettings = () => {
    setEggParams({
      radiusX: 1.0,
      radiusY: 1.5,
      radiusZ: 1.0,
      segments: 512,
    });

    setEggColor("#ffffff");
    setTextureOpacity(1.0);
    setShowWireframe(false);

    setProjectionSize(1.0);
    setProjectionOffset({ x: -0.5, y: -0.5 });
    setDesignRotation(180);
    setVerticalCoverage(0.7);
    setVerticalOffset(0.0);

    setRotation({ x: 0, y: 0, z: 0 });
    setResolution(72);
  };

  return (
    <div className="app-container">
      <div className="controls-panel">
        <header className="app-header">
          <h1>SVG on Egg Projector</h1>
          <p className="app-description">
            Upload an SVG design and visualize how it would look wrapped around
            an egg
          </p>
        </header>

        <div className="control-group">
          <h2>SVG Design</h2>
          <div className="file-upload-container">
            <label className="file-upload-button">
              <span>Choose SVG File</span>
              <input
                type="file"
                accept=".svg"
                onChange={handleSvgUpload}
                disabled={isProcessingSvg}
              />
            </label>
            <div className="file-name">
              {isProcessingSvg ? "Processing..." : svgFileName}
            </div>
          </div>
        </div>

        <div className="control-group">
          <h2>Egg Shape</h2>
          <div className="control-row">
            <label>Width (X):</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={eggParams.radiusX}
              onChange={(e) =>
                setEggParams({
                  ...eggParams,
                  radiusX: parseFloat(e.target.value),
                })
              }
            />
            <span className="value">{eggParams.radiusX.toFixed(1)}</span>
          </div>

          <div className="control-row">
            <label>Height (Y):</label>
            <input
              type="range"
              min="1"
              max="2.5"
              step="0.1"
              value={eggParams.radiusY}
              onChange={(e) =>
                setEggParams({
                  ...eggParams,
                  radiusY: parseFloat(e.target.value),
                })
              }
            />
            <span className="value">{eggParams.radiusY.toFixed(1)}</span>
          </div>

          <div className="control-row">
            <label>Depth (Z):</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={eggParams.radiusZ}
              onChange={(e) =>
                setEggParams({
                  ...eggParams,
                  radiusZ: parseFloat(e.target.value),
                })
              }
            />
            <span className="value">{eggParams.radiusZ.toFixed(1)}</span>
          </div>

          <div className="control-row">
            <label>Detail Level:</label>
            <input
              type="range"
              min="16"
              max="512"
              step="32"
              value={eggParams.segments}
              onChange={(e) =>
                setEggParams({
                  ...eggParams,
                  segments: parseInt(e.target.value),
                })
              }
            />
            <span className="value">{eggParams.segments}</span>
          </div>
        </div>

        <div className="control-group">
          <h2>Appearance</h2>
          <div className="control-row">
            <label>Egg Color:</label>
            <div className="color-picker-container">
              <input
                type="color"
                value={eggColor}
                onChange={(e) => setEggColor(e.target.value)}
                className="color-picker"
              />
              <span className="color-value">{eggColor}</span>
            </div>
          </div>

          <div className="control-row">
            <label>Design Opacity:</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={textureOpacity}
              onChange={(e) => setTextureOpacity(parseFloat(e.target.value))}
            />
            <span className="value">{(textureOpacity * 100).toFixed(0)}%</span>
          </div>

          <div className="control-row checkbox-row">
            <label>Show Wireframe:</label>
            <input
              type="checkbox"
              checked={showWireframe}
              onChange={(e) => setShowWireframe(e.target.checked)}
            />
          </div>
        </div>

        <div className="control-group">
          <h2>Projection Settings</h2>
          <div className="control-row">
            <label>Size:</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={projectionSize}
              onChange={(e) => setProjectionSize(parseFloat(e.target.value))}
            />
            <span className="value">{projectionSize.toFixed(1)}x</span>
          </div>

          <div className="control-row">
            <label>X Offset:</label>
            <input
              type="range"
              min="-0.5"
              max="0.5"
              step="0.05"
              value={projectionOffset.x}
              onChange={(e) =>
                setProjectionOffset({
                  ...projectionOffset,
                  x: parseFloat(e.target.value),
                })
              }
            />
            <span className="value">{projectionOffset.x.toFixed(2)}</span>
          </div>

          <div className="control-row">
            <label>Y Offset:</label>
            <input
              type="range"
              min="-0.5"
              max="0.5"
              step="0.05"
              value={projectionOffset.y}
              onChange={(e) =>
                setProjectionOffset({
                  ...projectionOffset,
                  y: parseFloat(e.target.value),
                })
              }
            />
            <span className="value">{projectionOffset.y.toFixed(2)}</span>
          </div>

          <div className="control-row">
            <label>Rotation:</label>
            <input
              type="range"
              min="0"
              max="359"
              step="1"
              value={designRotation}
              onChange={(e) => setDesignRotation(parseInt(e.target.value))}
            />
            <span className="value">{designRotation}°</span>
          </div>

          <div className="control-row">
            <label>Vertical Coverage:</label>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.05"
              value={verticalCoverage}
              onChange={(e) => setVerticalCoverage(parseFloat(e.target.value))}
            />
            <span className="value">{verticalCoverage.toFixed(2)}x</span>
          </div>

          <div className="control-row">
            <label>Vertical Offset:</label>
            <input
              type="range"
              min="-0.5"
              max="0.5"
              step="0.05"
              value={verticalOffset}
              onChange={(e) => setVerticalOffset(parseFloat(e.target.value))}
            />
            <span className="value">{verticalOffset.toFixed(2)}</span>
          </div>

          <div className="rotation-buttons">
            <button
              onClick={() => rotateDesign(90)}
              className="rotation-button"
            >
              Rotate 90°
            </button>
            <button
              onClick={() => rotateDesign(180)}
              className="rotation-button"
            >
              Rotate 180°
            </button>
          </div>
        </div>

        <div className="control-group">
          <h2>Rasterization</h2>
          <div className="control-row">
            <label>Resolution (PPI):</label>
            <input
              type="range"
              min="72"
              max="90"
              step="1"
              value={resolution}
              onChange={(e) => setResolution(parseInt(e.target.value))}
            />
            <span className="value">{resolution} PPI</span>
          </div>
        </div>

        <button className="reset-button" onClick={resetSettings}>
          Reset Settings
        </button>
      </div>

      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
          <Suspense fallback={<Html>Loading...</Html>}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <EggWithProjection
              eggParams={eggParams}
              eggColor={eggColor}
              svgContent={svgFile}
              projectionSize={projectionSize}
              projectionOffset={projectionOffset}
              designRotation={designRotation}
              textureOpacity={textureOpacity}
              showWireframe={showWireframe}
              resolution={resolution}
              verticalCoverage={verticalCoverage}
              verticalOffset={verticalOffset}
            />
            <Environment files={`${import.meta.env.BASE_URL}studio_small_03_1k.hdr`} />
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
            />
          </Suspense>
        </Canvas>
      </div>

      <style>{`
        .app-container {
          display: flex;
          height: 100vh;
          width: 100vw;
          font-family: Arial, sans-serif;
        }

        .controls-panel {
          width: 320px;
          padding: 20px;
          background-color: #f5f5f5;
          overflow-y: auto;
          border-right: 1px solid #ddd;
        }

        .app-header {
          margin-bottom: 24px;
        }

        .app-header h1 {
          margin: 0 0 8px 0;
          font-size: 24px;
        }

        .app-description {
          margin: 0;
          color: #666;
          font-size: 14px;
        }

        .control-group {
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #ddd;
        }

        .control-group h2 {
          margin: 0 0 16px 0;
          font-size: 18px;
        }

        .control-row {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
        }

        .control-row label {
          flex: 0 0 100px;
          font-size: 14px;
        }

        .control-row input[type="range"] {
          flex: 1;
          margin-right: 8px;
        }

        .value {
          flex: 0 0 40px;
          text-align: right;
          font-size: 14px;
        }

        .checkbox-row {
          justify-content: space-between;
        }

        .checkbox-row input {
          width: auto;
        }

        .file-upload-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .file-upload-button {
          display: inline-block;
          padding: 8px 16px;
          background-color: #4285f4;
          color: white;
          border-radius: 4px;
          cursor: pointer;
          text-align: center;
        }

        .file-upload-button input {
          display: none;
        }

        .file-name {
          font-size: 14px;
          color: #666;
          margin-top: 4px;
        }

        .color-picker-container {
          display: flex;
          align-items: center;
        }

        .color-picker {
          height: 30px;
          width: 30px;
          padding: 0;
          border: none;
          margin-right: 8px;
        }

        .color-value {
          font-size: 14px;
        }

        .rotation-buttons {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }

        .rotation-button {
          flex: 1;
          padding: 8px 0;
          background-color: #f1f1f1;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
        }

        .rotation-button:hover {
          background-color: #e9e9e9;
        }

        .reset-button {
          width: 100%;
          padding: 12px;
          background-color: #f1f1f1;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }

        .reset-button:hover {
          background-color: #e9e9e9;
        }

        .canvas-container {
          flex: 1;
          position: relative;
        }
      `}</style>
    </div>
  );
}

// EggWithProjection component to render the 3D egg with SVG projection
function EggWithProjection({
  eggParams,
  eggColor,
  svgContent,
  projectionSize,
  projectionOffset,
  designRotation,
  textureOpacity,
  showWireframe,
  resolution,
  verticalCoverage,
  verticalOffset,
}) {
  const { invalidate } = useThree();
  const eggMeshRef = useRef();
  const [texture, setTexture] = useState(null);

  // Create egg geometry
  const eggGeometry = useMemo(() => {
    // Create egg shape using the new approach
    const points = [];
    const girth = 0.719;
    const apex = girth * 0.111111111;

    // Create points for the egg profile
    for (let rad = 0; rad <= Math.PI; rad += 0.1047) {
      // 0.1047 radians == 6 degrees
      const x =
        (apex * Math.cos(rad) + girth) * Math.sin(rad) * eggParams.radiusX;
      const y = -Math.cos(rad) * eggParams.radiusY;
      const v = new THREE.Vector2(x, y);
      points.push(v);
    }

    // Create the egg geometry by rotating the points
    const geometry = new THREE.LatheGeometry(
      points,
      eggParams.segments, // Number of segments around the egg
      0, // Start angle
      Math.PI * 2 // End angle (full circle)
    );

    // Apply Z scaling
    const positionAttribute = geometry.getAttribute("position");
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const z = positionAttribute.getZ(i);

      const angle = Math.atan2(z, x);
      const radius = Math.sqrt(x * x + z * z);

      // Scale the radius in the Z direction
      const scaledRadius = radius * (eggParams.radiusZ / eggParams.radiusX);

      positionAttribute.setX(i, Math.cos(angle) * scaledRadius);
      positionAttribute.setZ(i, Math.sin(angle) * scaledRadius);
    }

    // Get vertical extents of the geometry for UV mapping
    const yMin = -eggParams.radiusY;
    const yMax = eggParams.radiusY;

    // Custom UV mapping that prevents stretching
    const uvs = [];

    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);
      const z = positionAttribute.getZ(i);

      // Better horizontal mapping to fix seam - use exact fractions to ensure no gaps
      const angleRad = Math.atan2(z, x);
      const angleFraction = angleRad / (Math.PI * 2);
      // Ensure exact 0-1 range with precise alignment at seam
      let u = (angleFraction + 0.5) % 1.0;

      // Vertical mapping - map y coordinate to range 0-1 (0 at bottom, 1 at top)
      let vNormalized = (y - yMin) / (yMax - yMin);

      // Apply vertical coverage
      // Map the covered portion to full UV range
      const vCoveredRange = verticalCoverage;
      const vOffset = verticalOffset;

      // Invert v to match texture coordinates (1 at top, 0 at bottom)
      vNormalized = 1.0 - vNormalized;

      // Calculate coverage boundaries
      const coverageStart = 0.5 - vCoveredRange / 2 + vOffset;
      const coverageEnd = 0.5 + vCoveredRange / 2 + vOffset;

      // Map v to the covered range
      let v;
      if (vNormalized >= coverageStart && vNormalized <= coverageEnd) {
        // Linear mapping from coverageStart-coverageEnd to 0-1
        v = (vNormalized - coverageStart) / (coverageEnd - coverageStart);
      } else if (vNormalized < coverageStart) {
        // Clamp to exactly 0 for below coverage
        v = 0;
      } else {
        // Clamp to exactly 1 for above coverage
        v = 1;
      }

      uvs.push(u, v);
    }

    // Update the geometry with our custom UVs
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));

    // Ensure proper normals for lighting
    geometry.computeVertexNormals();

    return geometry;
  }, [eggParams, verticalCoverage, verticalOffset]);

  // Process SVG and create texture
  useEffect(() => {
    if (!svgContent) return;

    // Define fixed page dimensions
    const PAGE_WIDTH = 3200;
    const PAGE_HEIGHT = 800;

    async function processSvg() {
      try {
        // Create a canvas for rendering SVG
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Parse SVG
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
        const svgElement = svgDoc.documentElement;

        // Get original SVG dimensions from viewBox or width/height attributes
        let originalWidth, originalHeight, viewBox;

        if (svgElement.hasAttribute("viewBox")) {
          viewBox = svgElement.getAttribute("viewBox").split(" ").map(Number);
          originalWidth = viewBox[2];
          originalHeight = viewBox[3];
        } else {
          originalWidth = parseFloat(svgElement.getAttribute("width") || "100");
          originalHeight = parseFloat(
            svgElement.getAttribute("height") || "100"
          );
        }

        // Set SVG to fixed dimensions
        svgElement.setAttribute("width", PAGE_WIDTH);
        svgElement.setAttribute("height", PAGE_HEIGHT);

        // Adjust viewBox to maintain aspect ratio if needed
        const aspectRatio = originalWidth / originalHeight;
        const targetAspectRatio = PAGE_WIDTH / PAGE_HEIGHT;

        if (Math.abs(aspectRatio - targetAspectRatio) > 0.01) {
          console.log("Adjusting SVG aspect ratio to fit fixed dimensions");
        }

        // Always use the fixed dimensions
        svgElement.setAttribute("preserveAspectRatio", "none");

        // Get the modified SVG string
        const serializer = new XMLSerializer();
        const modifiedSvgString = serializer.serializeToString(svgDoc);

        // Calculate texture size based on resolution
        const textureWidth = Math.round((PAGE_WIDTH * resolution) / 72);
        const textureHeight = Math.round((PAGE_HEIGHT * resolution) / 72);

        // Set canvas size
        canvas.width = textureWidth;
        canvas.height = textureHeight;

        // Create Canvg instance and render SVG to canvas
        const v = await Canvg.from(ctx, modifiedSvgString);
        await v.render();

        // Create Three.js texture from canvas
        const newTexture = new THREE.CanvasTexture(canvas);

        // Configure texture for precise control of wrapping
        newTexture.wrapS = THREE.RepeatWrapping;
        newTexture.wrapT = THREE.ClampToEdgeWrapping; // Clamp vertical to avoid stretching
        newTexture.repeat.set(1, 1);

        // Ensure texture uses high-quality settings for better appearance
        newTexture.anisotropy = 16; // Higher anisotropy for sharper textures at angles
        newTexture.magFilter = THREE.LinearFilter;
        newTexture.minFilter = THREE.LinearMipmapLinearFilter;

        setTexture(newTexture);
        invalidate(); // Force re-render
      } catch (error) {
        console.error("Error processing SVG:", error);
      }
    }

    processSvg();
  }, [svgContent, resolution, invalidate]);

  // Materials for the egg
  const materials = useMemo(() => {
    // Base egg material
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(eggColor),
      roughness: 0.1,
      metalness: 0.0,
    });

    // Texture material for the SVG projection
    const textureMaterial =
      texture &&
      new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        opacity: textureOpacity,
        roughness: 0.1,
        metalness: 0.0,
      });

    // Wireframe material
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    });

    return { baseMaterial, textureMaterial, wireframeMaterial };
  }, [eggColor, texture, textureOpacity]);

  // Update texture transform based on projection settings
  useEffect(() => {
    if (texture) {
      // Set texture transformations based on projection settings
      const matrix = new THREE.Matrix3();

      // Convert rotation from degrees to radians
      const rotationRad = THREE.MathUtils.degToRad(designRotation);

      // Update texture matrix
      matrix.setUvTransform(
        0.5 + projectionOffset.x, // centerX (0.5 is center)
        0.5 + projectionOffset.y, // centerY (0.5 is center)
        1.0 / projectionSize, // scaleX (inverse of size)
        1.0 / projectionSize, // scaleY (inverse of size)
        rotationRad, // rotation in radians
        0.5, // offsetX
        0.5 // offsetY
      );

      texture.matrixAutoUpdate = false;
      texture.matrix = matrix;

      invalidate(); // Force re-render
    }
  }, [texture, projectionSize, projectionOffset, designRotation, invalidate]);

  // Render egg with materials
  return (
    <group>
      {/* Base egg */}
      <mesh
        ref={eggMeshRef}
        geometry={eggGeometry}
        material={materials.baseMaterial}
      />

      {/* SVG texture projected on egg */}
      {texture && (
        <mesh geometry={eggGeometry} material={materials.textureMaterial} />
      )}

      {/* Optional wireframe */}
      {showWireframe && (
        <mesh geometry={eggGeometry} material={materials.wireframeMaterial} />
      )}
    </group>
  );
}

export default App;
