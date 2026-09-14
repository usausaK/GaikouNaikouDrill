// 13〜15問目：一成と尋子から異なる金額・量が減る発展問題
// このファイルは app-seven.js の後に読み込み、15問構成・Skip機能を追加します。

function makeUnequalChange(kind){
  const templates=[
    {p:3,q:2,r:5,s:2,kDed:200,hDed:300,base:275},
    {p:4,q:3,r:3,s:2,kDed:200,hDed:250,base:350},
    {p:5,q:3,r:2,s:1,kDed:300,hDed:250,base:200},
    {p:5,q:4,r:3,s:2,kDed:200,hDed:300,base:500},
    {p:4,q:3,r:5,s:3,kDed:300,hDed:300,base:600}
  ];
  // 数学的に成立するテンプレートだけを利用する
  const valid=templates.filter(t=>{
    const k=t.p*t.base-t.kDed;
    const h=t.q*t.base-t.hDed;
    return k>0&&h>0&&k*t.s===h*t.r;
  });
  const t=pick(valid);
  const scale=kind==='bottle'?pick([1,1,2]):pick([1,2,3]);
  const kDed=t.kDed*scale;
  const hDed=t.hDed*scale;
  const base=t.base*scale;
  const initialK=t.p*base;
  const initialH=t.q*base;
  let noun,unit,action;
  if(kind==='wallet'){
    noun='財布の残高'; unit='円';
    action=`ダンは一成から${kDed}円を、尋子から${hDed}円をもらいました`;
  }else if(kind==='bottle'){
    noun='ペットボトルの残り'; unit='mL';
    action=`ダンは一成のペットボトルから${kDed}mLを、尋子のペットボトルから${hDed}mLを飲みました`;
  }else{
    noun='貯金額'; unit='円';
    action=`ダンは一成から${kDed}円を、尋子から${hDed}円をもらいました`;
  }
  return{
    type:'unequal',kind,...t,kDed,hDed,base,initialK,initialH,noun,unit,
    story:`一成と尋子の${noun}の比は、はじめ ${t.p}：${t.q} でした。${action}。その後の比は ${t.r}：${t.s} になりました。はじめの一成の${noun}はいくらでしたか？`
  };
}

// 既存の12問生成を15問へ拡張
const generateProblems12=generateProblems;
generateProblems=function(){
  generateProblems12();
  problems.push(
    makeUnequalChange('wallet'),
    makeUnequalChange('bottle'),
    makeUnequalChange('savings')
  );
};

function advancedStepsFor(p){
  return p&&(p.type==='change'||p.type==='unequal')?7:4;
}
function advancedTotalSteps(){
  return problems.reduce((n,p)=>n+advancedStepsFor(p),0);
}
function advancedDoneBefore(i){
  let n=0;
  for(let x=0;x<i;x++) n+=advancedStepsFor(problems[x]);
  return n;
}

// 各問題に Skip ボタンを表示
const cardWithoutSkip=card;
card=function(x){
  cardWithoutSkip(`${x}<div style="margin-top:18px;text-align:right"><button onclick="skipProblem()" style="font-size:14px;padding:9px 15px;color:#6b7280;background:#fff;border:1px solid #d1d5db">Skip この問題</button></div>`);
};

function skipProblem(){
  locked=false;
  step=0;
  pIndex++;
  render();
  window.scrollTo({top:0,behavior:'smooth'});
}

nextStep=function(){
  step++;
  if(step>=advancedStepsFor(problems[pIndex])){
    step=0;
    pIndex++;
  }
  render();
};

updateHeader=function(){
  const total=advancedTotalSteps();
  const done=advancedDoneBefore(pIndex)+step;
  bar.style.width=`${Math.min(100,total?done/total*100:0)}%`;
  progressText.textContent=`${Math.min(pIndex+1,15)} / 15 問`;
  scoreText.textContent=`正解 ${score}`;
};

const renderBeforeAdvanced=render;
render=function(){
  locked=false;
  if(pIndex>=problems.length) return finish();
  const p=problems[pIndex];
  if(p.type==='unequal') return renderUnequal(p);
  return renderBeforeAdvanced();
};

function renderUnequal(p){
  const kp=maru(p.p), hq=maru(p.q);
  const K=`${kp} − ${p.kDed}`;
  const H=`${hq} − ${p.hDed}`;

  if(step===0){
    const c=`一成 ＝ ${kp}、尋子 ＝ ${hq}`;
    return card(`
      <div class="tag">発展問題 STEP 1 / 7</div>${phrase()}
      <div class="story">${p.story}</div>
      <div class="stepTitle">はじめの比を①を使って表そう</div>
      <div class="prompt">比の「1」にあたる量を <b>①</b> とします。</div>
      <div class="choices">${choice([
        {t:c,c:1},
        {t:`一成 ＝ ${hq}、尋子 ＝ ${kp}`,c:0},
        {t:`一成 ＝ ${maru(p.p+p.q)}、尋子 ＝ ①`,c:0}
      ])}</div>
      <div id="feedback" class="feedback"></div>
      <button id="next" class="next primary" onclick="nextStep()">次へ</button>
    `);
  }

  if(step===1){
    const c=`一成 ＝ ${K}、尋子 ＝ ${H}`;
    return card(`
      <div class="tag">発展問題 STEP 2 / 7</div>${phrase()}
      <div class="story">${p.story}</div>
      <div class="eqbox">はじめ：一成＝${kp}　尋子＝${hq}</div>
      <div class="stepTitle">ダンに渡した後の量を表そう</div>
      <div class="choices">${choice([
        {t:c,c:1},
        {t:`一成 ＝ ${kp} − ${p.hDed}、尋子 ＝ ${hq} − ${p.kDed}`,c:0},
        {t:`一成 ＝ ${kp} ＋ ${p.kDed}、尋子 ＝ ${hq} ＋ ${p.hDed}`,c:0}
      ])}</div>
      <div id="feedback" class="feedback"></div>
      <button id="next" class="next primary" onclick="nextStep()">次へ</button>
    `);
  }

  if(step===2){
    const c=`(${K}) ： (${H}) ＝ ${p.r} ： ${p.s}`;
    return card(`
      <div class="tag">発展問題 STEP 3 / 7</div>${phrase()}
      <div class="story">${p.story}</div>
      <div class="stepTitle">変化後の比の式を作ろう</div>
      <div class="choices">${choice([
        {t:c,c:1},
        {t:`(${H}) ： (${K}) ＝ ${p.r} ： ${p.s}`,c:0},
        {t:`(${K}) ： (${H}) ＝ ${p.s} ： ${p.r}`,c:0}
      ])}</div>
      <div id="feedback" class="feedback"></div>
      <button id="next" class="next primary" onclick="nextStep()">次へ</button>
    `);
  }

  if(step===3){
    const c=`(${H}) × ${p.r}`;
    return card(`
      <div class="tag">発展問題 STEP 4 / 7</div>${phrase()}
      <div class="story">${p.story}</div>
      <div class="eqbox">(${K}) ： (${H}) ＝ ${p.r} ： ${p.s}</div>
      <div class="stepTitle">内項の積はどれ？</div>
      <div class="choices">${choice([
        {t:c,c:1},
        {t:`(${K}) × ${p.s}`,c:0},
        {t:`(${K}) × ${p.r}`,c:0}
      ])}</div>
      <div id="feedback" class="feedback"></div>
      <button id="next" class="next primary" onclick="nextStep()">次へ</button>
    `);
  }

  if(step===4){
    const c=`(${H}) × ${p.r} ＝ (${K}) × ${p.s}`;
    return card(`
      <div class="tag">発展問題 STEP 5 / 7</div>${phrase()}
      <div class="story">${p.story}</div>
      <div class="stepTitle">内項の積＝外項の積の式にしよう</div>
      <div class="choices">${choice([
        {t:c,c:1},
        {t:`(${K}) × ${p.r} ＝ (${H}) × ${p.s}`,c:0},
        {t:`(${K}) × (${H}) ＝ ${p.r} × ${p.s}`,c:0}
      ])}</div>
      <div id="feedback" class="feedback"></div>
      <button id="next" class="next primary" onclick="nextStep()">次へ</button>
    `);
  }

  if(step===5){
    return card(`
      <div class="tag">発展問題 STEP 6 / 7</div>${phrase()}
      <div class="story">${p.story}</div>
      <div class="eqbox">(${H}) × ${p.r} ＝ (${K}) × ${p.s}</div>
      <div class="stepTitle">①の値を求めよう</div>
      <div class="prompt">式を計算して、比の「1」にあたる <b>①</b> の値を答えます。</div>
      <div class="inputRow"><b>① ＝</b><input id="advBase" inputmode="numeric" placeholder="?"> <b>${p.unit}</b></div>
      <button class="primary" style="width:100%;margin-top:14px" onclick="checkAdvancedBase(${p.base},'${p.unit}')">答え合わせ</button>
      <div id="feedback" class="feedback"></div>
      <button id="next" class="next primary" onclick="nextStep()">STEP 7へ</button>
    `);
  }

  return card(`
    <div class="tag">発展問題 STEP 7 / 7</div>${phrase()}
    <div class="story">${p.story}</div>
    <div class="eqbox">① ＝ ${p.base}${p.unit}</div>
    <div class="stepTitle">はじめの一成の${p.noun}を求めよう</div>
    <div class="prompt">一成は <b>${kp}</b> なので、<b>${p.p} × ${p.base}</b> を計算します。</div>
    <div class="inputRow"><input id="advFinal" inputmode="numeric" placeholder="答え"><b>${p.unit}</b></div>
    <button class="primary" style="width:100%;margin-top:14px" onclick="checkAdvancedFinal(${p.initialK},${p.initialH},'${p.unit}')">答え合わせ</button>
    <div id="feedback" class="feedback"></div>
    <button id="next" class="next primary" onclick="nextStep()">次の問題へ</button>
  `);
}

function checkAdvancedBase(a,u){
  if(locked)return;
  if(+document.getElementById('advBase').value===a){
    locked=true; score++;
    feedback(true,`正解！ <strong>①＝${a}${u}</strong>`);
    showNext(); updateHeader();
  }else{
    feedback(false,'もう一度。内項の積＝外項の積の式から、①の値を求めよう。');
  }
}

function checkAdvancedFinal(a,h,u){
  if(locked)return;
  if(+document.getElementById('advFinal').value===a){
    locked=true; score++;
    feedback(true,`正解！<br>はじめは <strong>一成 ${a}${u}、尋子 ${h}${u}</strong>`);
    showNext(); updateHeader();
  }else{
    feedback(false,'①の値に、一成側の比の数をかけよう。');
  }
}

finish=function(){
  bar.style.width='100%';
  app.innerHTML=`<section class="card finish"><h2>ドリル完了！</h2><div class="rule">最後に3回読もう<br><strong>「内項の積＝外項の積の公式を利用して」</strong></div><p style="font-size:20px;font-weight:800">正解数：${score} / ${advancedTotalSteps()}</p><p class="note">全15問です。10〜15問目は7ステップ。「数字を変えてもう一度やる」で新しい数字に変わります。</p><button class="primary" style="width:100%" onclick="restart()">数字を変えてもう一度やる</button></section>`;
};
