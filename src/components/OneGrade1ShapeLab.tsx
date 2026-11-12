import React,{useEffect,useMemo,useState} from 'react';
import {Eye,MousePointerClick,RotateCcw,Sparkles} from 'lucide-react';
import '../styles/one-grade1-shapes.css';

export type ShapeLabScene={
 kind:'long-round'|'flat-shapes'|'size-rotation'|'solids'|'faces'|'viewpoint'|'texture'|'motion'|'tower';
 choices:string[];
 prompt:string;
};
type Props={lab:ShapeLabScene;title:string};
const LABELS:Record<string,string>={
 'ribbon':'Ribbon','ball':'Ball','rolling-pin':'Rolling pin',
 'circle':'Circle','triangle':'Triangle','square':'Square','rectangle':'Rectangle','oval':'Oval',
 'small-triangle':'Small triangle','big-triangle':'Big triangle','tilted-square':'Turned square','big-circle':'Big circle',
 'cube':'Cube','cuboid':'Cuboid','sphere':'Sphere','cylinder':'Cylinder','cone':'Cone',
 'side':'Side view','end':'End view','tilt':'Turned view',
 'smooth':'Smooth surface','rough':'Rough surface','smooth-ball':'Smooth ball','rough-ball':'Textured ball',
 'cylinder-side':'Cylinder on side','cylinder-end':'Cylinder on flat end',
 'two-boxes':'Two boxes','ball-on-ball':'Ball on ball','ball-on-box':'Ball on box','box-on-box':'Box on box'
};
const INSIGHTS:Record<string,string>={
 ribbon:'A ribbon extends a long way from one end to the other.',
 ball:'The ball is round in every direction and has no corners.',
 'rolling-pin':'A rolling pin looks long from the side but round at either end.',
 circle:'A circle has one continuous curved outline and no corners.',
 triangle:'A triangle has three straight sides and three corners.',
 square:'A square has four equal sides and four square corners.',
 rectangle:'A rectangle has four sides; opposite sides are equal.',
 oval:'An oval is curved and longer in one direction.',
 'small-triangle':'This triangle is small, but it still has three corners.',
 'big-triangle':'This big triangle has the same number of sides.',
 'tilted-square':'Rotating a square does not change it into a new shape.',
 'big-circle':'A larger circle still has no corners.',
 cube:'A cube has six equal square flat faces and eight corners.',
 cuboid:'A cuboid has six flat rectangular faces and eight corners.',
 sphere:'A sphere is curved all around and has no corners.',
 cylinder:'A cylinder has two flat circular ends and one curved side.',
 cone:'A cone has one flat circular base, a curved side and a pointed tip.',
 side:'From the side, a cylinder can appear long and rectangle-like in a drawing.',
 end:'Look straight at a flat cylinder end. Its outline is circular.',
 tilt:'The cylinder is still the same solid when we change our view.',
 smooth:'A smooth surface usually feels even to the touch.',
 rough:'A textured surface may feel uneven or bumpy.',
 'smooth-ball':'A ball can be round and smooth.',
 'rough-ball':'A round ball can also have a textured surface.',
 'cylinder-side':'A cylinder lying on its curved side can roll when gently pushed.',
 'cylinder-end':'A standing cylinder may slide on its flat end when pushed.',
 'two-boxes':'Flat box faces can be lined up to make a steady low stack.',
 'ball-on-ball':'Two balls are difficult to balance because their surfaces are curved.',
 'ball-on-box':'The ball can move or roll from the box top. Use safe soft models.',
 'box-on-box':'A box stacked on a broad flat base is usually steadier.',
};
const friendly=(key:string)=>LABELS[key]||key.replace(/-/g,' ');
const speech=(key:string)=>INSIGHTS[key]||'Look closely. Tell someone what you notice.';
const Cube:React.FC<{wide?:boolean}>=({wide=false})=><g>
 <polygon points={wide?'157,136 258,105 409,105 312,138':'204,127 278,93 357,127 284,159'} fill="#b9d6f9" stroke="#25568f" strokeWidth="5"/>
 <polygon points={wide?'157,136 312,138 312,244 157,238':'204,127 284,159 284,240 204,205'} fill="#88b5eb" stroke="#25568f" strokeWidth="5"/>
 <polygon points={wide?'312,138 409,105 409,219 312,244':'284,159 357,127 357,205 284,240'} fill="#d1e5fb" stroke="#25568f" strokeWidth="5"/>
 </g>;
const Ball:React.FC<{cx?:number;cy?:number;r?:number;rough?:boolean}>=({cx=280,cy=169,r=64,rough=false})=><g>
 <circle cx={cx} cy={cy} r={r} fill="#e5ae65" stroke="#b17b3e" strokeWidth="5"/>
 <circle cx={cx-r*.3} cy={cy-r*.32} r={r*.18} fill="#fff2ca" opacity=".75"/>
 {rough&&Array.from({length:13},(_,i)=><circle key={i} cx={cx+Math.cos(i*2.4)*(r*.65)} cy={cy+Math.sin(i*2.4)*(r*.65)} r={3.5} fill="#ad7749"/>)}
 </g>;
const Cylinder:React.FC<{end?:boolean;horizontal?:boolean}>=({end=false,horizontal=false})=>
 end?<g><circle cx="280" cy="160" r="91" fill="#bedcf7" stroke="#23558d" strokeWidth="5"/><circle cx="280" cy="160" r="70" fill="#dbeafc" stroke="#8aafd7" strokeWidth="3"/></g>:
 horizontal?<g>
 <path d="M195 132 H386 V224 H195Z" fill="#9dc2ea" stroke="#24548a" strokeWidth="5"/>
 <ellipse cx="195" cy="178" rx="26" ry="46" fill="#bddaf6" stroke="#24548a" strokeWidth="5"/>
 <ellipse cx="386" cy="178" rx="26" ry="46" fill="#7aa9d8" stroke="#24548a" strokeWidth="5"/>
 </g>:
 <g>
 <path d="M210 96V240 A70 24 0 0 0 350 240V96" fill="#a3c5e9" stroke="#24548a" strokeWidth="5"/>
 <ellipse cx="280" cy="96" rx="70" ry="25" fill="#d6e9fa" stroke="#24548a" strokeWidth="5"/>
 <ellipse cx="280" cy="240" rx="70" ry="25" fill="#a3c5e9" stroke="#24548a" strokeWidth="5"/>
 </g>;
const Cone:React.FC=()=><g>
 <path d="M280 52L380 234Q280 279 180 234Z" fill="#e8bc7e" stroke="#b18249" strokeWidth="5"/>
 <ellipse cx="280" cy="232" rx="100" ry="26" fill="#f1d2a5" stroke="#b18249" strokeWidth="5"/>
 </g>;
const Flat:React.FC<{value:string}>=({value})=>{
 const common={stroke:'#265b9c',strokeWidth:5,fill:'#9ec7f1'};
 if(value==='circle'||value==='big-circle')return <circle cx="280" cy="165" r={value==='circle'?83:100} {...common}/>;
 if(value==='oval')return <ellipse cx="280" cy="165" rx="115" ry="74" {...common}/>;
 if(value.includes('triangle'))return <polygon points={value==='small-triangle'?'280,105 215,216 346,216':'280,54 170,240 395,240'} {...common}/>;
 if(value==='square')return <rect x="204" y="86" width="153" height="153" rx="0" {...common}/>;
 if(value==='tilted-square')return <rect x="214" y="97" width="146" height="146" transform="rotate(45 287 170)" {...common}/>;
 return <rect x="167" y="112" width="233" height="120" {...common}/>;
};
const RollingPin:React.FC=()=><g>
 <rect x="183" y="118" width="195" height="93" rx="46" fill="#e8b978" stroke="#af7a43" strokeWidth="4"/>
 <rect x="148" y="154" width="44" height="19" rx="8" fill="#d59a62" stroke="#af7a43" strokeWidth="3"/>
 <rect x="371" y="154" width="44" height="19" rx="8" fill="#d59a62" stroke="#af7a43" strokeWidth="3"/>
 </g>;
const Tower:React.FC<{value:string}>=({value})=>{
 const box=(x:number,y:number)=><g key={x+'-'+y}><rect x={x} y={y} width="144" height="65" rx="4" fill="#8fb8ea" stroke="#2c609a" strokeWidth="4"/><path d={'M'+(x+9)+' '+(y+9)+' h125'} stroke="#d9e9ff" strokeWidth="4"/></g>;
 const sphere=(x:number,y:number)=><Ball cx={x} cy={y} r={42}/>;
 return <g><path d="M90 273H478" stroke="#9eb9aa" strokeWidth="8" strokeLinecap="round"/>
  {value==='ball-on-ball'?<>{sphere(285,228)}{sphere(285,141)}</>:
   value==='ball-on-box'?<>{box(210,205)}{sphere(283,162)}</>:
    <>{box(210,205)}{box(210,131)}</>}
 </g>;
};
const Textures:React.FC<{value:string}>=({value})=>{
 const isBall=value.includes('ball');
 const rough=value.startsWith('rough');
 return isBall?<Ball rough={rough}/>:<g>
  <rect x="170" y="88" width="223" height="153" rx="20" fill={rough?'#e4c194':'#b6d7f8'} stroke={rough?'#a97947':'#497fb9'} strokeWidth="5"/>
  {rough&&Array.from({length:8},(_,i)=><path key={i} d={'M'+(182+i*24)+' 100 l12 18 -12 18 12 18 -12 18 12 18'} stroke="#a1744f" strokeWidth="3" fill="none"/>)}
  {!rough&&<path d="M202 113Q277 101 360 116" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" opacity=".7"/>}
 </g>;
};
const ExampleArt:React.FC<{kind:ShapeLabScene['kind'];choice:string}>=({kind,choice})=>{
 if(kind==='flat-shapes'||kind==='size-rotation')return <Flat value={choice}/>;
 if(kind==='long-round')return choice==='ribbon'?<path d="M125 149Q208 112 294 153T442 158" stroke="#de937e" strokeWidth="27" fill="none" strokeLinecap="round"/>:
  choice==='ball'?<Ball/>:<RollingPin/>;
 if(kind==='texture')return <Textures value={choice}/>;
 if(kind==='viewpoint')return <Cylinder end={choice==='end'} horizontal={choice==='tilt'}/>;
 if(kind==='tower')return <Tower value={choice}/>;
 if(choice==='sphere'||choice==='ball')return <Ball/>;
 if(choice==='cube'||choice==='two-boxes')return <Cube/>;
 if(choice==='cuboid')return <Cube wide/>;
 if(choice==='cone')return <Cone/>;
 if(choice==='cylinder'||choice==='cylinder-end')return <Cylinder/>;
 if(choice==='cylinder-side')return <Cylinder horizontal/>;
 return <Flat value="circle"/>;
};
const movement=(value:string,kind:string)=>{
 if(kind!=='motion')return null;
 if(value==='sphere'||value==='cylinder-side')return 'Rolls on a curved surface when gently pushed.';
 if(value==='cylinder-end')return 'Can slide on its flat circular end.';
 return 'Can slide along on a flat face when gently pushed.';
};
export const OneGrade1ShapeLab:React.FC<Props>=({lab,title})=>{
 const [selected,setSelected]=useState(lab.choices[0]||'circle');
 const [motionRun,setMotionRun]=useState(0);
 const [explored,setExplored]=useState<string[]>([]);
 const key=lab.kind+'|'+lab.choices.join('|');
 useEffect(()=>{setSelected(lab.choices[0]||'circle');setExplored([]);setMotionRun(0);},[key]);
 const count=useMemo(()=>new Set(explored).size,[explored]);
 const handle=(value:string)=>{setSelected(value);setMotionRun(0);setExplored(values=>values.includes(value)?values:[...values,value]);};
 const caption=speech(selected);
 return <section className="vg1s-lab" aria-label={title+' shape explorer'}>
   <header className="vg1s-lab-top"><span><Eye size={17}/> VAYENTRA SHAPE LAB</span><small>Look · Compare · Explain</small></header>
   <h4>{lab.prompt}</h4>
   <div className="vg1s-stage">
    <div className="vg1s-stage-label"><Sparkles size={15}/> {friendly(selected)}</div>
    <svg viewBox="0 0 560 325" role="img" aria-label={friendly(selected)+': '+caption} xmlns="http://www.w3.org/2000/svg">
     <rect width="560" height="325" rx="22" fill="#f4f9ff"/>
     <circle cx="82" cy="65" r="35" fill="#fff4cc" opacity=".75"/>
     <circle cx="482" cy="80" r="24" fill="#dbeaff" opacity=".6"/>
     {lab.kind==='motion'&&<g><path d="M60 270L497 270" stroke="#b1c4d8" strokeWidth="8" strokeLinecap="round"/><path d="M103 241H170M170 241l-18-13M170 241l-18 13" stroke="#c58f4b" strokeWidth="5" fill="none" strokeLinecap="round"/><text x="65" y="314" fill="#7b93ae" fontSize="15">Gentle push →</text></g>}
     <g key={selected+'-'+motionRun} className={lab.kind==='motion'&&motionRun>0?
       'vg1s-moving-object '+(selected==='sphere'||selected==='cylinder-side'?'rolling':'sliding'):''}>
       <ExampleArt kind={lab.kind} choice={selected}/>
     </g>
    </svg>
    <div className="vg1s-explain" aria-live="polite">{caption}</div>
    {movement(selected,lab.kind)&&<small className="vg1s-motion-caption">{movement(selected,lab.kind)}</small>}
   </div>
   {lab.kind==='motion'&&<button type="button" className="vg1s-play-movement" onClick={()=>setMotionRun(v=>v+1)}>
    ▶ Watch it {selected==='sphere'||selected==='cylinder-side'?'roll':'slide'}
   </button>}
   <div className="vg1s-select-heading"><MousePointerClick size={16}/> Touch a card to explore</div>
   <div className="vg1s-choices" role="group" aria-label="Choose a shape or view">
     {lab.choices.map(key=><button type="button" key={key} aria-pressed={selected===key}
      className={selected===key?'active':''} onClick={()=>handle(key)}>{friendly(key)}</button>)}
   </div>
   <footer className="vg1s-footer"><span>{count} of {lab.choices.length} explored this visit</span>
    <button type="button" onClick={()=>{setSelected(lab.choices[0]||'circle');setExplored([]);setMotionRun(0);}}><RotateCcw size={15}/> Start again</button></footer>
   <p className="vg1s-guidance">This is a picture experiment, not a graded test. Tell a trusted adult what you notice, then try it safely with real objects.</p>
 </section>;
};