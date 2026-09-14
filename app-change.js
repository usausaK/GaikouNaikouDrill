function makeChange(kind){
  let t,delta,unit;
  if(kind==='wallet'){
    t=pick([
      {p:3,q:2,r:5,s:3,f:2,op:'sub'},
      {p:4,q:3,r:3,s:2,f:1,op:'sub'},
      {p:5,q:4,r:4,s:3,f:1,op:'sub'}
    ]);
    delta=pick([100,200,300,400,500]);
    unit='円';
  }else if(kind==='bottle'){
    t=pick([
      {p:3,q:2,r:5,s:3,f:2,op:'sub'},
      {p:4,q:3,r:3,s:2,f:1,op:'sub'},
      {p:5,q:4,r:4,s:3,f:1,op:'sub'}
    ]);
    delta=pick([50,75,100,125]);
    unit='mL';
  }else{
    t=pick([
      {p:3,q:2,r:4,s:3,f:1,op:'add'},
      {p:2,q:1,r:3,s:2,f:1,op:'add'},
      {p:4,q:3,r:5,s:4,f:1,op:'add'}
    ]);
    delta=pick([500,1000,1500,2000]);
    unit='円';
  }

  const base=t.f*delta;
  const initialK=t.p*base;
  const initialH=t.q*base;
  const sign=t.op==='add'?'+':'−';
  let noun,action;

  if(kind==='wallet'){
    noun='財布の残高';
    action=`二人がダンにそれぞれ${delta}${unit}あげたところ`;
  }else if(kind==='bottle'){
    noun='ペットボトルの残り';
    action=`ダンが二人のペットボトルからそれぞれ${delta}${unit}ずつ飲んだところ`;
  }else{
    noun='貯金額';
    action=`ダンが二人にそれぞれ${delta}${unit}ずつくれたところ`;
  }

  return{
    type:'change',kind,...t,delta,unit,base,initialK,initialH,sign,noun,
    story:`一成と尋子の${noun}の比は、はじめ ${t.p}：${t.q} でした。${action}、比は ${t.r}：${t.s} になりました。はじめの一成の${noun}はいくらでしたか？`
  };
}

function maru(n){
  const nums=['⓪','①','②','③','④','⑤','⑥','⑦','⑧','⑨','⑩','⑪','⑫','⑬','⑭','⑮','⑯','⑰','⑱','⑲','⑳'];
  return nums[n] || `(${n})`;
}

const after=(p,k)=>`${maru(k?p.p:p.q)} ${p.sign} ${p.delta}`;

function renderChange(p){
  const K=after(p,1),H=after(p,0);
  const kp=maru(p.p), hq=maru(p.q);

  if(step===0){
    const c=`一成 ＝ ${kp}、尋子 ＝ ${hq}`;
    return card(`
      <div class="tag">変化する比 STEP 1 / 7</div>${phrase()}
      <div class="story">${p.story}</div>
      <div class="stepTitle">はじめの比を①を使って表そう</div>
      <div class="prompt">比の「1」にあたる量を <b>①</b> とします。3：2なら、一成は③、尋子は②です。</div>
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
    const ws=p.sign==='+'?'−':'+';
    return card(`
      <div class="tag">変化する比 STEP 2 / 7</div>${phrase()}
      <div class="story">${p.story}</div>
      <div class="eqbox">はじめ：一成＝${kp}　尋子＝${hq}</div>
      <div class="stepTitle">変化したあとの量を表そう</div>
      <div class="choices">${choice([
        {t:c,c:1},
        {t:`一成 ＝ ${kp} ${ws} ${p.delta}、尋子 ＝ ${hq} ${ws} ${p.delta}`,c:0},
        {t:`一成 ＝ ${kp}、尋子 ＝ ${hq}`,c:0}
      ])}</div>
      <div id="feedback" class="feedback"></div>
      <button id="next" class="next primary" onclick="nextStep()">次へ</button>
    `);
  }

  if(step===2){
    const c=`(${K}) ： (${H}) ＝ ${p.r} ： ${p.s}`;
    return card(`
      <div class="tag">変化する比 STEP 3 / 7</div>${phrase()}
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
      <div class="tag">変化する比 STEP 4 / 7</div>${phrase()}
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
      <div class="tag">変化する比 STEP 5 / 7</div>${phrase()}
      <div class="story">${p.story}</div>
      <div class="eqbox">(${K}) ： (${H}) ＝ ${p.r} ： ${p.s}</div>
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
    const leftCoef=p.q*p.r;
    const rightCoef=p.p*p.s;
    const leftConst=p.delta*p.r;
    const rightConst=p.delta*p.s;
    const op=p.sign;
    return card(`
      <div class="tag">変化する比 STEP 6 / 7</div>${phrase()}
      <div class="story">${p.story}</div>
      <div class="eqbox">(${H}) × ${p.r} ＝ (${K}) × ${p.s}</div>
      <div class="eqbox">${maru(leftCoef)} ${op} ${leftConst} ＝ ${maru(rightCoef)} ${op} ${rightConst}</div>
      <div class="stepTitle">①の値を求めよう</div>
      <div class="prompt">丸数字の差を使って、<b>①そのもの</b>の値を求めます。</div>
      <div class="inputRow"><b>① ＝</b><input id="baseAns" inputmode="numeric" placeholder="?"> <b>${p.unit}</b></div>
      <button class="primary" style="width:100%;margin-top:14px" onclick="checkBase(${p.base},'${p.unit}')">答え合わせ</button>
      <div id="feedback" class="feedback"></div>
      <button id="next" class="next primary" onclick="nextStep()">STEP 7へ</button>
    `);
  }

  return card(`
    <div class="tag">変化する比 STEP 7 / 7</div>${phrase()}
    <div class="story">${p.story}</div>
    <div class="eqbox">① ＝ ${p.base}${p.unit}</div>
    <div class="stepTitle">はじめの一成の${p.noun}を求めよう</div>
    <div class="prompt">一成は <b>${kp}</b> なので、<b>① × ${p.p} ＝ ${p.base} × ${p.p}</b> を計算します。</div>
    <div class="inputRow"><input id="ca" inputmode="numeric" placeholder="答え"><b>${p.unit}</b></div>
    <button class="primary" style="width:100%;margin-top:14px" onclick="checkChange(${p.initialK},${p.initialH},'${p.unit}')">答え合わせ</button>
    <div id="feedback" class="feedback"></div>
    <button id="next" class="next primary" onclick="nextStep()">次の問題へ</button>
  `);
}

function checkBase(base,u){
  if(locked)return;
  if(+document.getElementById('baseAns').value===base){
    locked=true;
    score++;
    feedback(true,`正解！ <strong>①＝${base}${u}</strong><br>次は、この①を使って一成の元の量を求めます。`);
    showNext();
    updateHeader();
  }else{
    feedback(false,'もう一度。内項の積＝外項の積の式を計算して、まず①を求めよう。');
  }
}

function checkChange(a,h,u){
  if(locked)return;
  if(+document.getElementById('ca').value===a){
    locked=true;
    score++;
    feedback(true,`正解！<br>はじめは <strong>一成 ${a}${u}、尋子 ${h}${u}</strong>`);
    showNext();
    updateHeader();
  }else{
    feedback(false,'①の値は求められています。一成は「① × 一成側の比の数」で計算しよう。');
  }
}
