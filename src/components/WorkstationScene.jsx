import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Html, Lightformer, RoundedBox, useTexture } from '@react-three/drei'
import * as THREE from 'three'

const dark = '#24272e'
function Solid({ size, color = dark, metal = 0, rough = .65, radius = .04, children, ...props }) {
  return <RoundedBox args={size} radius={radius} smoothness={2} castShadow receiveShadow {...props}><meshStandardMaterial color={color} metalness={metal} roughness={rough}/>{children}</RoundedBox>
}
function Disc({ radius, depth = .02, color = '#171a20', metal = 0, ...props }) {
  return <mesh castShadow {...props}><cylinderGeometry args={[radius, radius, depth, 40]}/><meshStandardMaterial color={color} metalness={metal} roughness={.48}/></mesh>
}
function Led({ on, color = '#88d8cc', ...props }) {
  return <mesh {...props}><sphereGeometry args={[.018, 12, 8]}/><meshStandardMaterial color={on ? color : '#252b30'} emissive={color} emissiveIntensity={on ? 3 : 0} toneMapped={false}/></mesh>
}
function ScreenFace({ stage }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas'); canvas.width = 1280; canvas.height = 720
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#020405'; ctx.fillRect(0,0,1280,720)
    if(stage>=3) { const wash=ctx.createRadialGradient(640,360,0,640,360,620);wash.addColorStop(0,'#101b21');wash.addColorStop(1,'#020405');ctx.fillStyle=wash;ctx.fillRect(0,0,1280,720) }
    ctx.font='400 42px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=stage>=3?'#aebfc4':'#59666f';ctx.fillText('Insert Cartridge',640,360)
    const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;return map
  },[stage])
  useEffect(()=>()=>texture.dispose(),[texture])
  const material=useRef(null)
  useFrame(({clock})=>{if(material.current) material.current.color.setScalar(stage===2?(Math.sin(clock.elapsedTime*85)>0?1.7:.05):stage>=3?1:.5)})
  return <mesh position={[0,1.97,.143]}><planeGeometry args={[3.2,1.8]}/><meshBasicMaterial ref={material} map={texture} toneMapped={false}/></mesh>
}
function ProjectedScreen({ stage, interactive, children }) {
  const root=useRef(null)
  const {camera,size}=useThree()
  const project=(x,y)=>{const p=new THREE.Vector3(x,y,-.958).project(camera);return {x:(p.x+1)*size.width/2,y:(1-p.y)*size.height/2}}
  useFrame(()=>{
    if(!root.current)return
    const tl=project(-1.6,2.87),tr=project(1.6,2.87),bl=project(-1.6,1.07),br=project(1.6,1.07)
    const top=tr.x-tl.x,bottom=br.x-bl.x,height=bl.y-tl.y,ratio=top/bottom
    root.current.style.transform=`matrix3d(${top/640},0,0,0,${(bl.x-tl.x)*ratio/360},${height*ratio/360},0,${(ratio-1)/360},0,0,1,0,0,0,0,1)`
  })
  return <Html calculatePosition={()=>{const p=project(-1.6,2.87);return [p.x,p.y]}} style={{pointerEvents:interactive?'auto':'none'}}><div ref={root} className="physical-screen projected-screen" data-stage={stage}>{children}</div></Html>
}
function Cable({ points, radius = .018, color = '#171a20' }) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p))), [points])
  return <mesh castShadow><tubeGeometry args={[curve, 48, radius, 8, false]}/><meshStandardMaterial color={color} roughness={.72}/></mesh>
}
function useWood() {
  return useMemo(() => {
    const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 512
    const ctx = canvas.getContext('2d'), pixels = ctx.createImageData(1024, 512)
    let seed = 31
    const noise = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }
    for (let y = 0; y < 512; y++) for (let x = 0; x < 1024; x++) {
      const bend = Math.sin(x * .008 + y * .013) * 6 + Math.sin(x * .002) * 12
      const grain = Math.sin((y + bend) * .65) * 4 + Math.sin((y + bend) * .14) * 7 + noise() * 7
      const plank = Math.floor(y / 128) % 2 * 5, i = (y * 1024 + x) * 4
      pixels.data[i] = 57 + grain + plank; pixels.data[i + 1] = 35 + grain * .65 + plank; pixels.data[i + 2] = 24 + grain * .43; pixels.data[i + 3] = 255
    }
    ctx.putImageData(pixels, 0, 0)
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 8
    return texture
  }, [])
}
function Desk() {
  const wood = useWood()
  useEffect(() => () => wood.dispose(), [wood])
  return <group>
    <RoundedBox args={[9.1, .22, 4.25]} radius={.055} smoothness={3} position={[0, -.14, .1]} castShadow receiveShadow><meshStandardMaterial map={wood} bumpMap={wood} bumpScale={.018} roughness={.62} metalness={.04}/></RoundedBox>
    {[-3.8, 3.8].map(x => <group key={x}><Solid position={[x, -1.25, .1]} size={[.15, 2.05, 3.5]} radius={.035} color="#171a1e" metal={.7}/><Solid position={[x, -2.25, .1]} size={[.65, .12, 3.7]} metal={.65}/></group>)}
    <Solid size={[8, .14, .12]} position={[0, -.55, -1.5]} metal={.7}/>
    <Solid size={[4.2, .018, 1.55]} position={[-.25, -.015, .65]} color="#171d22" radius={.008}/>
  </group>
}
function Speaker({ x, on }) {
  return <group position={[x, .01, -1.05]} rotation={[0, -Math.sign(x) * .12, 0]}>
    <Solid size={[.72, 1.35, .7]} position={[0, .675, 0]} color="#242329" radius={.055}/>
    <Solid size={[.66, 1.26, .03]} position={[0, .68, .365]} color="#101316" radius={.025}/>
    {[{ y: .48, r: .26 }, { y: 1.03, r: .105 }].map(({ y, r }) => <group key={y} position={[0, y, .393]} rotation={[Math.PI / 2, 0, 0]}>
      <Disc radius={r + .025} depth={.035} color="#393c42" metal={.5}/>
      <mesh position={[0, -.025, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[r * .84, r * .13, 12, 48]}/><meshStandardMaterial color="#1b1b20" roughness={.88}/></mesh>
      <mesh position={[0, -.037, 0]}><coneGeometry args={[r * .76, .085, 48]}/><meshStandardMaterial color="#30333c" roughness={.7}/></mesh>
      <mesh position={[0, -.055, 0]} scale={[1, .45, 1]}><sphereGeometry args={[r * .34, 24, 16]}/><meshStandardMaterial color="#191d23" roughness={.45}/></mesh>
    </group>)}
    {[-.26, .26].flatMap(a => [.15, 1.19].map(b => <Disc key={`${a}-${b}`} radius={.018} depth={.007} position={[a,b,.39]} rotation={[Math.PI/2,0,0]} color="#5c5d63" metal={.9}/>))}
    <Led on={on} position={[.23,.08,.394]}/>
    <Solid size={[.6,.07,.56]} position={[0,.015,0]} color="#080a0c"/>
  </group>
}
function Leaf({ index }) {
  const geometry = useMemo(() => {
    const positions = [], indices = []
    for (let i = 0; i <= 14; i++) {
      const t = i / 14, w = Math.sin(t * Math.PI) * .14
      positions.push(-w, t * .72, Math.sin(t * Math.PI) * .12, 0, t * .72, Math.sin(t * Math.PI) * .17, w, t * .72, Math.sin(t * Math.PI) * .12)
      if (i < 14) { const k = i * 3; indices.push(k,k+3,k+1,k+1,k+3,k+4,k+1,k+4,k+2,k+2,k+4,k+5) }
    }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3)); geo.setIndex(indices); geo.computeVertexNormals(); return geo
  }, [])
  useEffect(() => () => geometry.dispose(), [geometry])
  return <group rotation={[.35 + index % 3 * .24, index * 2.4, .2]} position={[0,.42 + index % 3 * .06,0]}>
    <mesh geometry={geometry} castShadow receiveShadow><meshPhysicalMaterial color={['#426146','#354c34','#597451'][index % 3]} side={THREE.DoubleSide} roughness={.56} clearcoat={.25}/></mesh>
    <Cable radius={.006} color="#71815a" points={[[0,0,0],[0,.33,.17],[0,.69,.025]]}/>
  </group>
}
function Plant() {
  return <group position={[-3.52,0,-.65]}>
    <mesh castShadow receiveShadow position={[0,.24,0]}><cylinderGeometry args={[.31,.24,.49,48]}/><meshStandardMaterial color="#7b7364" roughness={.93}/></mesh>
    <mesh position={[0,.49,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.295,.018,12,48]}/><meshStandardMaterial color="#8e8676" roughness={.9}/></mesh>
    <Disc radius={.277} position={[0,.487,0]} color="#211b16"/>
    {Array.from({length:11},(_,i)=><Leaf key={i} index={i}/>)}
  </group>
}
function Lamp({ on, reduced }) {
  const blobs = useRef([])
  useFrame(({ clock }) => { if (!on || reduced) return; blobs.current.forEach((blob,i) => { if(blob) { blob.position.y = .75 + Math.sin(clock.elapsedTime * .28 + i * 2.2) * .28; blob.scale.y = 1.1 + Math.sin(clock.elapsedTime*.35+i)*.3 } }) })
  const profile = useMemo(() => [new THREE.Vector2(.17,0),new THREE.Vector2(.215,.07),new THREE.Vector2(.13,.89),new THREE.Vector2(.10,.95)],[])
  return <group position={[3.54,0,-.96]}>
    <mesh castShadow position={[0,.17,0]}><cylinderGeometry args={[.17,.27,.33,48]}/><meshStandardMaterial color="#777581" metalness={.86} roughness={.3}/></mesh>
    <mesh position={[0,.32,0]}><latheGeometry args={[profile,48]}/><meshPhysicalMaterial color={on?'#b59be0':'#5c5871'} transparent opacity={.32} transmission={.35} thickness={.15} ior={1.45} metalness={.05} roughness={.07} clearcoat={1} side={THREE.DoubleSide} depthWrite={false}/></mesh>
    {[0,1,2].map(i=><mesh key={i} ref={el=>{blobs.current[i]=el}} position={[(i-1)*.045,.52+i*.22,0]} scale={[1,1.3,1]}><sphereGeometry args={[.093-i*.012,24,16]}/><meshStandardMaterial color={on?'#b283ca':'#453e50'} emissive="#ba79d9" emissiveIntensity={on?1.1:0} roughness={.34}/></mesh>)}
    <mesh position={[0,1.32,0]} castShadow><cylinderGeometry args={[.07,.105,.14,40]}/><meshStandardMaterial color="#8c8894" metalness={.85} roughness={.26}/></mesh>
    <Disc radius={.16} position={[0,.35,0]} color={on?'#b084ce':'#252130'}/>
    <pointLight position={[0,.73,.15]} color="#c28ade" intensity={on?2.6:0} distance={2.8} decay={2}/>
  </group>
}
function Keyboard({ on, reduced }) {
  const mats = useRef([]), start = useRef(null)
  useFrame(({clock})=>{
    if(!on) { start.current=null; return }
    if(start.current===null) start.current=clock.elapsedTime
    const elapsed=clock.elapsedTime-start.current
    mats.current.forEach((m,i)=>{if(m) { const column=i%14; const sweep=!reduced&&elapsed<1.5?Math.max(0,1-Math.abs(column-elapsed*12)/2):0; m.emissiveIntensity=.16+sweep*.9 }})
  })
  return <group position={[-.25,.07,.3]} rotation={[.06,0,0]}>
    <Solid size={[2.7,.14,.98]} color="#20242d" metal={.35} radius={.05}/>
    {Array.from({length:5},(_,r)=>Array.from({length:14},(_,c)=> <group key={`${r}-${c}`} position={[(c-6.5)*.177,.105,(r-2)*.177]}>
      <mesh position={[0,-.012,0]}><boxGeometry args={[.157,.025,.157]}/><meshStandardMaterial ref={el=>{mats.current[r*14+c]=el}} color="#14272e" emissive={c<7?'#64cbd6':'#aa8bd9'} emissiveIntensity={0}/></mesh>
      <Solid size={[.154,.075,.15]} radius={.012} color={r===0?'#444753':'#343943'} rough={.56}/>
      <mesh rotation={[-Math.PI/2,0,0]} position={[-.03,.04,-.03]}><planeGeometry args={[.034,.012]}/><meshStandardMaterial color="#b8bcc1" roughness={.85}/></mesh>
    </group>))}
    <Solid size={[.9,.075,.15]} position={[-.18,.109,.354]} radius={.014} color="#3e434d"/>
  </group>
}
function Controller() {
  const shape = useMemo(()=>{const s=new THREE.Shape();s.moveTo(-.46,.18);s.bezierCurveTo(-.65,.18,-.78,-.38,-.58,-.4);s.bezierCurveTo(-.43,-.41,-.3,-.2,-.2,-.16);s.lineTo(.2,-.16);s.bezierCurveTo(.3,-.2,.43,-.41,.58,-.4);s.bezierCurveTo(.78,-.38,.65,.18,.46,.18);s.quadraticCurveTo(0,.28,-.46,.18);return s},[])
  return <group position={[-.2,.12,1.32]} rotation={[-Math.PI/2,0,-.1]}>
    <mesh castShadow><extrudeGeometry args={[shape,{depth:.17,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.065,bevelThickness:.055}]}/><meshStandardMaterial color="#383b43" roughness={.58}/></mesh>
    {[-.22,.17].map(x=><group key={x} position={[x,-.1,.24]} rotation={[Math.PI/2,0,0]}><Disc radius={.115} color="#14171c" depth={.04}/><Disc radius={.073} color="#333940" depth={.085}/></group>)}
    <Solid size={[.23,.07,.045]} position={[-.4,.08,.24]} color="#11151a" radius={.01}/><Solid size={[.07,.23,.045]} position={[-.4,.08,.24]} color="#11151a" radius={.01}/>
    {[[.4,.16],[.49,.07],[.4,-.02],[.31,.07]].map(([x,y],i)=><Disc key={i} radius={.032} depth={.04} color={['#88a4a7','#a18cb5','#b5aa86','#7893aa'][i]} position={[x,y,.25]} rotation={[Math.PI/2,0,0]}/>)}
    <Solid size={[.13,.035,.025]} position={[0,.12,.25]} color="#737b82" radius={.008}/>
  </group>
}
function Console({ on }) {
  return <group position={[2.65,.15,.65]} rotation={[0,-.1,0]}>
    <Solid size={[1.65,.3,1.03]} color="#44434a" radius={.07}/><Solid size={[1.6,.08,1]} position={[0,-.15,0]} color="#191d24"/>
    <Solid size={[.83,.026,.12]} position={[0,.165,-.08]} color="#080a0e" radius={.01}/>
    {Array.from({length:13},(_,i)=><Solid key={i} size={[.025,.008,.36]} position={[-.61+i*.044,.157,.26]} color="#14171c" radius={.002}/>)}
    <Disc radius={.065} depth={.023} color="#878590" position={[.57,.17,.29]} metal={.5}/><Led on={on} position={[.62,0,.529]}/>
    <Solid size={[.25,.085,.023]} position={[-.44,-.025,.526]} color="#12151b" radius={.01}/>
    {[-.67,.67].map(x=><Disc key={x} radius={.015} depth={.008} color="#a7a2a8" metal={.8} position={[x,.155,-.39]}/>)}
  </group>
}
function Cartridge({ state, screenOn, onInsert, reduced }) {
  const group=useRef(null), texture=useTexture('/media/quintex.webp')
  const label=useMemo(()=>{
    const canvas=document.createElement('canvas');canvas.width=384;canvas.height=384
    const ctx=canvas.getContext('2d'),img=texture.image
    ctx.drawImage(img,img.width*.285,img.height*.08,img.width*.43,img.height*.83,0,0,384,384)
    const shade=ctx.createLinearGradient(0,295,0,384);shade.addColorStop(0,'#070b1000');shade.addColorStop(1,'#070b10');ctx.fillStyle=shade;ctx.fillRect(0,295,384,89)
    ctx.font='bold 31px serif';ctx.textAlign='center';ctx.fillStyle='#eed49b';ctx.fillText('QUINTEX RPG',192,359)
    const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;return t
  },[texture])
  useEffect(()=>()=>label.dispose(),[label])
  useFrame((_,delta)=>{
    const inserted=state!=='standby', target=new THREE.Vector3(inserted?2.65:1.48,inserted?.38:.14,inserted?.57:1.3)
    group.current.position.lerp(target,reduced?1:1-Math.exp(-delta*5))
    group.current.rotation.x=THREE.MathUtils.damp(group.current.rotation.x,inserted?0:-1.18,5,delta)
    group.current.rotation.y=THREE.MathUtils.damp(group.current.rotation.y,inserted?-.1:-.2,5,delta)
  })
  return <group ref={group} position={[1.48,.14,1.3]} rotation={[-1.18,-.2,0]}>
    <Solid size={[.75,.85,.13]} color="#464852" radius={.035}/><Solid size={[.65,.63,.012]} position={[0,.01,.074]} color="#151a20" radius={.01}/>
    <mesh position={[0,.025,.084]}><planeGeometry args={[.58,.53]}/><meshStandardMaterial map={label} roughness={.7}/></mesh>
    {Array.from({length:10},(_,i)=><Solid key={i} size={[.025,.09,.02]} position={[-.225+i*.05,-.418,0]} color="#a78c4e" metal={.78} radius={.002}/>)}
    {[-.31,.31].map(x=><Solid key={x} size={[.016,.6,.017]} position={[x,0,.074]} color="#23272e" radius={.003}/>)}
    <Html center position={[0,0,.092]} style={{pointerEvents:'auto'}}><button className="physical-cartridge-hit" aria-disabled={!screenOn} disabled={state!=='standby'&&state!=='running'} aria-label={state==='running'?'Eject cartridge':'Insert cartridge and start game'} title={state==='running'?'Eject cartridge':'Insert cartridge'} onClick={onInsert}/></Html>
  </group>
}
function Scene({ stage, state, reduced, children, onInsert, screenOn }) {
  const {camera,size,invalidate}=useThree()
  useEffect(()=>{
    const aspect=size.width/size.height, z=aspect<1.1?15:10.6
    camera.position.set(0,z*.57,z); camera.lookAt(0,.6,0); camera.updateProjectionMatrix(); invalidate()
    const timer=setTimeout(()=>window.dispatchEvent(new Event('journey:layout')),100)
    return()=>clearTimeout(timer)
  },[camera,size.width,size.height,invalidate])
  return <>
    <ambientLight intensity={.26}/><hemisphereLight args={['#b2c5e0','#29211b',.5]}/>
    <spotLight position={[-3,7,5]} intensity={stage>=8?95:58} angle={.65} penumbra={.8} castShadow shadow-mapSize={[1024,1024]} shadow-bias={-.0003} color="#c1cedf"/>
    <pointLight position={[0,2,-.1]} intensity={stage>=3?3.5:0} color="#b4d7e1" distance={5}/>
    <pointLight position={[-3.25,.65,-1.5]} intensity={stage>=8?3:0} color="#efd0a0" distance={2.8}/>
    <pointLight position={[0,.35,.2]} intensity={stage>=5?.65:0} color="#88c6de" distance={3}/>
    <Environment resolution={64}><Lightformer position={[0,5,0]} rotation={[Math.PI/2,0,0]} scale={[10,6,1]} intensity={.5}/><Lightformer position={[-5,2,1]} rotation={[0,Math.PI/2,0]} scale={[4,5,1]} intensity={1.4} color="#97aec9"/><Lightformer position={[5,1,-2]} rotation={[0,-Math.PI/2,0]} scale={[3,4,1]} intensity={.8} color="#b7a0c8"/></Environment>
    <Desk/><Speaker x={-2.3} on={stage>=6}/><Speaker x={2.3} on={stage>=6}/><Plant/><Lamp on={stage>=7} reduced={reduced}/><Keyboard on={stage>=5} reduced={reduced}/><Controller/><Console on={stage>=4}/>
    <Cable points={[[0,.06,-1.25],[.7,.045,-1.6],[2.9,.04,-1.4],[3.12,.07,.28]]}/>
    <Cable points={[[-.2,.12,1.06],[.3,.03,.94],[1.1,.025,1.74],[2.1,.045,1.56],[2.23,.11,1.12]]}/>
    <group position={[0,0,-1.1]}>
      <Solid size={[1.2,.075,.66]} position={[0,.015,.05]} color="#343a43" metal={.7}/><Solid size={[.17,.88,.15]} position={[0,.44,-.06]} color="#4b5159" metal={.75}/>
      <Solid size={[3.45,2.1,.22]} position={[0,1.91,0]} color="#25292e" rough={.4} radius={.06}/>
      <Solid size={[3.25,1.87,.025]} position={[0,1.97,.12]} color="#020405" rough={.2} radius={.018}/>
      {Array.from({length:21},(_,i)=><Solid key={i} size={[.024,.018,.025]} position={[-.4+i*.04,.924,.126]} color="#090c0f" radius={.003}/>)}
      <Led on={stage>=1} position={[1.51,.942,.137]}/>
      <Html position={[0,2.966,0]} center><span className="workstation-power-port"/></Html>
      {state==='standby' && <ScreenFace stage={stage}/>}
    </group>
    {state!=='standby' && <ProjectedScreen stage={stage} interactive={state==='running'}>{children}</ProjectedScreen>}
    <Cartridge state={state} screenOn={screenOn} onInsert={onInsert} reduced={reduced}/>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-2.36,0]} receiveShadow><planeGeometry args={[200,200]}/><shadowMaterial opacity={.42}/></mesh>
  </>
}
export default function WorkstationScene(props) {
  return <Canvas shadows dpr={[1,1.5]} camera={{fov:38,near:.1,far:80,position:[0,6,10.6]}} gl={{antialias:true,alpha:true}} frameloop={props.visible?'always':'demand'}><Suspense fallback={null}><Scene {...props}/></Suspense></Canvas>
}
