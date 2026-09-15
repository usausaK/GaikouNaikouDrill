// 問題11・12（三項比）の割合・人物への割り当て・チケット代を毎回変える。
// すべて暗算で扱え、STEP 8でも丸数字が20以内に収まる組み合わせだけを使用する。
// 直前と同じ式・同じチケット代ができるだけ連続しないようにする。

const tripleVariantSets = [
  [
    {n:1,d:2}, // 1/2
    {n:1,d:3}, // 1/3
    {n:1,d:4}  // 1/4
  ],
  [
    {n:1,d:2}, // 1/2
    {n:1,d:4}, // 1/4
    {n:1,d:5}  // 1/5
  ],
  [
    {n:1,d:3}, // 1/3
    {n:1,d:4}, // 1/4
    {n:1,d:6}  // 1/6
  ],
  [
    {n:2,d:3}, // 2/3
    {n:1,d:2}, // 1/2
    {n:1,d:3}  // 1/3
  ],
  [
    {n:1,d:2}, // 1/2
    {n:2,d:3}, // 2/3
    {n:1,d:3}  // 1/3
  ],
  [
    {n:2,d:5}, // 2/5
    {n:1,d:2}, // 1/2
    {n:1,d:4}  // 1/4
  ],
  [
    {n:2,d:5}, // 2/5
    {n:1,d:3}, // 1/3
    {n:1,d:5}  // 1/5
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
    '2/5':['40％','2/5']
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

function possibleTicketTargets(problem){
  const unit=problem.answerA*problem.aFrac.n/problem.aFrac.d;
  const maxBase=Math.max(problem.answerA,problem.answerB,problem.answerC);
  const targets=[];
  for(let scale=1;scale<=10;scale++){
    const target=unit*scale;
    if(!Number.isInteger(target))continue;
    if(target<2||target>10)continue;
    if(maxBase*scale>20)continue;
    targets.push(target);
  }
  return [...new Set(targets)];
}

function chooseTicketTarget(problem,place,avoidTarget=0){
  const all=possibleTicketTargets(problem);
  const last=getStoredTicketTarget(place);
  let candidates=all.filter(n=>n!==last&&n!==avoidTarget);
  if(!candidates.length)candidates=all.filter(n=>n!==avoidTarget);
  if(!candidates.length)candidates=all;
  const target=pick(candidates);
  setStoredTicketTarget(place,target);
  return target;
}

let currentLandTripleKey='';
let currentLandTicketTarget=0;

function makeRandomDisneyTriple(place,avoidKey='',avoidTarget=0){
  const lastKey=getStoredTripleKey(place);
  let candidates=allTripleVariants().filter(v=>v.key!==lastKey&&v.key!==avoidKey);
  if(!candidates.length)candidates=allTripleVariants().filter(v=>v.key!==avoidKey);
  const v=pick(candidates);
  const [a,b,c]=v.fractions;
  const problem=makeTriple(
    place,
    tripleDisplayLabel(a),a,
    tripleDisplayLabel(b),b,
    tripleDisplayLabel(c),c
  );
  problem.variantKey=v.key;
  problem.ticketTarget=chooseTicketTarget(problem,place,avoidTarget);
  setStoredTripleKey(place,v.key);
  return problem;
}

disneyLandTriple=function(){
  const p=makeRandomDisneyTriple('ディズニーランド');
  currentLandTripleKey=p.variantKey;
  currentLandTicketTarget=p.ticketTarget;
  return p;
};

disneySeaTriple=function(){
  // 同じ回の問題11と問題12は、式もチケット代もなるべく別にする。
  return makeRandomDisneyTriple('ディズニーシー',currentLandTripleKey,currentLandTicketTarget);
};
