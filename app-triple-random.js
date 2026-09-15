// 問題11・12（三項比）の割合と人物への割り当てを毎回変える。
// STEP 8の倍率は、チケット代を整数にするために必要な「最小倍率」だけを使う。
// したがって、もとの三項比ですでにチケット代が整数なら ×1（そのまま）。

const tripleVariantSets = [
  [
    {n:1,d:2}, // 1/2
    {n:1,d:3}, // 1/3
    {n:1,d:4}  // 1/4  → チケット①
  ],
  [
    {n:1,d:2}, // 1/2
    {n:1,d:4}, // 1/4
    {n:1,d:5}  // 1/5  → チケット①
  ],
  [
    {n:1,d:3}, // 1/3
    {n:1,d:4}, // 1/4
    {n:1,d:6}  // 1/6  → チケット①
  ],
  [
    {n:2,d:3}, // 2/3
    {n:1,d:2}, // 1/2
    {n:1,d:3}  // 1/3  → チケット②
  ],
  [
    {n:2,d:5}, // 2/5
    {n:1,d:2}, // 1/2
    {n:1,d:4}  // 1/4  → チケット②
  ],
  [
    {n:2,d:5}, // 2/5
    {n:1,d:3}, // 1/3
    {n:1,d:5}  // 1/5  → チケット②
  ],
  [
    {n:3,d:4}, // 3/4
    {n:1,d:2}, // 1/2
    {n:1,d:3}  // 1/3  → チケット③
  ],
  [
    {n:3,d:5}, // 3/5
    {n:1,d:2}, // 1/2
    {n:1,d:4}  // 1/4  → チケット③
  ],
  [
    {n:4,d:5}, // 4/5
    {n:1,d:2}, // 1/2
    {n:1,d:4}  // 1/4  → チケット④
  ],
  [
    {n:1,d:2}, // 1/2
    {n:1,d:4}, // 1/4
    {n:1,d:6}  // 1/6  → 1:2:3 なので ×2 が必要、チケット①
  ]
];

function tripleFracKey(f){return `${f.n}/${f.d}`;}

function tripleDisplayLabel(f){
  const key=tripleFracKey(f);
  const labels={
    '1/2':['50％','1/2'],
    '1/3':['1/3'],
    '1/4':['25％','1/4'],
    '1/5':['20％','1/5'],
    '1/6':['1/6'],
    '2/3':['2/3'],
    '2/5':['40％','2/5'],
    '3/4':['75％','3/4'],
    '3/5':['60％','3/5'],
    '4/5':['80％','4/5']
  };
  return pick(labels[key]||[key]);
}

function triplePermutations(arr){
  return [
    [arr[0],arr[1],arr[2]],
    [arr[0],arr[2],arr[1]],
    [arr[1],arr[0],arr[2]],
    [arr[1],arr[2],arr[0]],
    [arr[2],arr[0],arr[1]],
    [arr[2],arr[1],arr[0]]
  ];
}

function allTripleVariants(){
  const out=[];
  tripleVariantSets.forEach((set,setIndex)=>{
    triplePermutations(set).forEach((p,permIndex)=>{
      out.push({key:`${setIndex}-${permIndex}`,fractions:p});
    });
  });
  return out;
}

function getStoredTripleKey(place){
  try{return localStorage.getItem(`gaikouTripleLast:${place}`)||'';}catch(e){return '';}
}
function setStoredTripleKey(place,key){
  try{localStorage.setItem(`gaikouTripleLast:${place}`,key);}catch(e){}
}
function getStoredTicketTarget(place){
  try{return +(localStorage.getItem(`gaikouTripleTicketLast:${place}`)||0);}catch(e){return 0;}
}
function setStoredTicketTarget(place,value){
  try{localStorage.setItem(`gaikouTripleTicketLast:${place}`,String(value));}catch(e){}
}

// はじめの三項比に対して、共通のチケット代が整数になる最小倍率を求める。
// 例：4:2:3 で一成が1/4を使用 → 4×1/4=1 なので scale=1。
// 例：1:2:3 で一成が1/2を使用 → 1×1/2=1/2 なので scale=2。
function minimalTicketInfo(problem){
  const num=problem.answerA*problem.aFrac.n;
  const den=problem.aFrac.d;
  const g=tripleGcd(num,den);
  const scale=den/g;
  const target=num/g;
  return {
    scale,
    target,
    scaledA:problem.answerA*scale,
    scaledB:problem.answerB*scale,
    scaledC:problem.answerC*scale
  };
}

function tripleVariantTicketTarget(v){
  const [a,b,c]=v.fractions;
  const tmp=makeTriple('',fracText(a),a,fracText(b),b,fracText(c),c);
  return minimalTicketInfo(tmp).target;
}

let currentLandTripleKey='';
let currentLandTicketTarget=0;

function makeRandomDisneyTriple(place,avoidKey='',avoidTarget=0){
  const lastKey=getStoredTripleKey(place);
  const lastTarget=getStoredTicketTarget(place);
  const all=allTripleVariants();

  // まず「前回と同じ式」「同じ回のもう1問と同じ式」「同じチケット代」を避ける。
  let candidates=all.filter(v=>
    v.key!==lastKey &&
    v.key!==avoidKey &&
    tripleVariantTicketTarget(v)!==lastTarget &&
    (!avoidTarget || tripleVariantTicketTarget(v)!==avoidTarget)
  );
  // 候補がなければチケット代の重複条件だけ緩める。
  if(!candidates.length){
    candidates=all.filter(v=>v.key!==lastKey && v.key!==avoidKey);
  }
  if(!candidates.length)candidates=all;

  const v=pick(candidates);
  const [a,b,c]=v.fractions;
  const problem=makeTriple(
    place,
    tripleDisplayLabel(a),a,
    tripleDisplayLabel(b),b,
    tripleDisplayLabel(c),c
  );
  const info=minimalTicketInfo(problem);
  problem.variantKey=v.key;
  problem.ticketScale=info.scale;
  problem.ticketTarget=info.target;
  problem.ticketScaledA=info.scaledA;
  problem.ticketScaledB=info.scaledB;
  problem.ticketScaledC=info.scaledC;

  setStoredTripleKey(place,v.key);
  setStoredTicketTarget(place,info.target);
  return problem;
}

disneyLandTriple=function(){
  const p=makeRandomDisneyTriple('ディズニーランド');
  currentLandTripleKey=p.variantKey;
  currentLandTicketTarget=p.ticketTarget;
  return p;
};

disneySeaTriple=function(){
  return makeRandomDisneyTriple('ディズニーシー',currentLandTripleKey,currentLandTicketTarget);
};
