'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function LogoScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const w = container.clientWidth || 1100
    const h = container.clientHeight || 860

    // ── Renderer ──────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, premultipliedAlpha: false })
    renderer.setSize(w, h)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearColor(0x0a0e1a, 1)
    Object.assign(renderer.domElement.style, { width: '100%', height: '100%', display: 'block', background: 'transparent', mixBlendMode: 'lighten' })
    container.appendChild(renderer.domElement)

    // ── Scene & Camera ────────────────────────────────────────────────────
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100)
    camera.position.z = 5

    // ── Ambient light ─────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x1a3060, 1.2))

    // ── Aura circle behind logo ───────────────────────────────────────────
    const auraCanvas = document.createElement('canvas')
    const auraSize = 512
    auraCanvas.width = auraSize
    auraCanvas.height = auraSize
    const aCtx = auraCanvas.getContext('2d')!
    const cx = auraSize / 2
    const auraGrad = aCtx.createRadialGradient(cx, cx, 0, cx, cx, cx)
    auraGrad.addColorStop(0, 'rgba(41,121,255,1)')
    auraGrad.addColorStop(1, 'rgba(41,121,255,0)')
    aCtx.fillStyle = auraGrad
    aCtx.fillRect(0, 0, auraSize, auraSize)
    const auraTexture = new THREE.CanvasTexture(auraCanvas)

    const auraMat = new THREE.MeshBasicMaterial({
      map: auraTexture,
      transparent: true,
      opacity: 0.08,
      depthWrite: false,
    })
    const auraMesh = new THREE.Mesh(new THREE.CircleGeometry(2.8, 64), auraMat)
    auraMesh.position.z = -0.1
    scene.add(auraMesh)

    // ── Logo mesh (MeshBasicMaterial — unlit, full color) ─────────────────
    const logoMat = new THREE.MeshBasicMaterial({
      transparent: false,
      side: THREE.DoubleSide,
    })
    const logoMesh = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 3.4), logoMat)
    scene.add(logoMesh)

    // ── Reflection mesh ───────────────────────────────────────────────────
    const gradCanvas = document.createElement('canvas')
    gradCanvas.width = 1
    gradCanvas.height = 128
    const gCtx = gradCanvas.getContext('2d')!
    const grad = gCtx.createLinearGradient(0, 0, 0, 128)
    grad.addColorStop(0, 'rgb(255,255,255)')
    grad.addColorStop(0.6, 'rgb(0,0,0)')
    gCtx.fillStyle = grad
    gCtx.fillRect(0, 0, 1, 128)
    const gradientTexture = new THREE.CanvasTexture(gradCanvas)

    const reflMat = new THREE.MeshBasicMaterial({
      alphaMap: gradientTexture,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
    })
    const reflMesh = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 3.4), reflMat)
    reflMesh.position.set(0, -3.5, 0)
    reflMesh.rotation.set(Math.PI, 0, 0)
    scene.add(reflMesh)

    // ── Load texture ──────────────────────────────────────────────────────
    new THREE.TextureLoader().load('/Assets/Process-Gravity-Logo.png', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      logoMat.map = tex
      logoMat.needsUpdate = true
      reflMat.map = tex
      reflMat.needsUpdate = true
    })

    // ── Point lights ──────────────────────────────────────────────────────
    const lightDefs = [
      { color: 0x2979ff, intensity: 2.5, distance: 6,  yBase: 1   },
      { color: 0x00aaff, intensity: 1.8, distance: 5,  yBase: 0.5 },
      { color: 0xdce8f0, intensity: 0.8, distance: 8,  yBase: 4   },
    ]
    const lights = lightDefs.map(({ color, intensity, distance }, i) => {
      const light = new THREE.PointLight(color, intensity, distance)
      const angle = (i / 3) * Math.PI * 2
      light.position.set(Math.cos(angle) * 4, lightDefs[i].yBase, Math.sin(angle) * 4)
      scene.add(light)
      return light
    })

    // ── Mouse tracking ────────────────────────────────────────────────────
    const mouse    = { x: 0, y: 0 }
    const target   = { rx: 0, ry: 0 }
    const current  = { rx: 0, ry: 0 }
    const MAX_ROT  = Math.PI / 30  // ±6°

    const onMouseMove = (e: MouseEvent) => {
      mouse.x    = (e.clientX / window.innerWidth  - 0.5) * 2
      mouse.y    = -(e.clientY / window.innerHeight - 0.5) * 2
      target.ry  = mouse.x * MAX_ROT
      target.rx  = mouse.y * MAX_ROT
    }
    window.addEventListener('mousemove', onMouseMove)

    // ── Animation loop ────────────────────────────────────────────────────
    let frameId: number
    let elapsed  = 0
    let lastTime = performance.now()
    const TAU    = Math.PI * 2

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const now   = performance.now()
      elapsed    += (now - lastTime) / 1000
      lastTime    = now
      const t     = elapsed * (TAU / 10)
      const r     = 4

      // Orbiting lights
      lights[0].position.x = Math.cos(t) * r + mouse.x * 0.5
      lights[0].position.y = 1 + mouse.y * 0.5
      lights[0].position.z = Math.sin(t) * r

      lights[1].position.x = Math.cos(t + TAU / 3) * r
      lights[1].position.z = Math.sin(t + TAU / 3) * r

      lights[2].position.x = Math.cos(t + (TAU * 2) / 3) * r
      lights[2].position.z = Math.sin(t + (TAU * 2) / 3) * r

      // Lerp rotation — aura tracks with logo
      current.rx += (target.rx - current.rx) * 0.04
      current.ry += (target.ry - current.ry) * 0.04
      logoMesh.rotation.x = current.rx
      logoMesh.rotation.y = current.ry
      auraMesh.rotation.x = current.rx
      auraMesh.rotation.y = current.ry
      reflMesh.rotation.x = Math.PI + current.rx
      reflMesh.rotation.y = current.ry

      renderer.render(scene, camera)
    }
    animate()

    // ── Resize observer ───────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      const w2 = container.clientWidth
      const h2 = container.clientHeight
      if (!w2 || !h2) return
      camera.aspect = w2 / h2
      camera.updateProjectionMatrix()
      renderer.setSize(w2, h2)
    })
    ro.observe(container)

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('mousemove', onMouseMove)
      ro.disconnect()
      renderer.dispose()
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}
