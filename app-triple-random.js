// 問題11・12（三項比）の割合と人物への割り当てを毎回変える。
// 暗算で解ける組み合わせだけを使用し、STEP 8でチケット代を⑤にそろえられる設定に限定する。

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

let currentLandTripleKey='';

function makeRandomDisneyTriple(place,avoidKey=''){
  const candidates=allTripleVariants().filter(v=>v.key!==avoidKey);
  const v=pick(candidates);
  const [a,b,c]=v.fractions;
  const problem=makeTriple(
    place,
    tripleDisplayLabel(a),a,
    tripleDisplayLabel(b),b,
    tripleDisplayLabel(c),c
  );
  problem.variantKey=v.key;
  return problem;
}

disneyLandTriple=function(){
  const p=makeRandomDisneyTriple('ディズニーランド');
  currentLandTripleKey=p.variantKey;
  return p;
};

disneySeaTriple=function(){
  return makeRandomDisneyTriple('ディズニーシー',currentLandTripleKey);
};
