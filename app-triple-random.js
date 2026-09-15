// 問題11・12（三項比）の割合と人物への割り当てを毎回変える。
// 暗算で解ける組み合わせだけを使用し、STEP 8でチケット代を⑤にそろえられる設定に限定する。
// さらに、直前と同じ「一成×…＝尋子×…＝ダン×…」は連続して出さない。

const tripleVariantSets = [
  [
    {n:1,d:2}, // 1/2
    {n:5,d:6}, // 5/6
    {n:1,d:4}  // 1/4
  ],
  [
    {n:1,d:4}, // 1/4
    {n:5,d:8}, // 5/8
    {n:1,d:2}  // 1/2
  ],
  [
    {n:1,d:2}, // 1/2
    {n:1,d:3}, // 1/3
    {n:1,d:4}  // 1/4
  ],
  [
    {n:5,d:6}, // 5/6
    {n:5,d:7}, // 5/7
    {n:5,d:8}  // 5/8
  ]
];

function tripleFracKey(f){return `${f.n}/${f.d}`;}

function tripleDisplayLabel(f){
  const key=tripleFracKey(f);
  const labels={
    '1/2':['50％','1/2'],
    '1/4':['25％','1/4'],
    '1/3':['1/3'],
    '5/6':['5/6'],
    '5/7':['5/7'],
    '5/8':['5/8','62.5％']
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

let currentLandTripleKey='';

function makeRandomDisneyTriple(place,avoidKey=''){
  const lastKey=getStoredTripleKey(place);
  let candidates=allTripleVariants().filter(v=>v.key!==lastKey && v.key!==avoidKey);
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
  setStoredTripleKey(place,v.key);
  return problem;
}

disneyLandTriple=function(){
  const p=makeRandomDisneyTriple('ディズニーランド');
  currentLandTripleKey=p.variantKey;
  return p;
};

disneySeaTriple=function(){
  // 同じ回の問題11と問題12も、同一パターンにはしない。
  return makeRandomDisneyTriple('ディズニーシー',currentLandTripleKey);
};
