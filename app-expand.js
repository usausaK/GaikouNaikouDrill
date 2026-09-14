// 10〜15問目：かっこを外す計算を独立したSTEP 6として追加し、全8ステップにする

advancedStepsFor=function(p){
  return p&&(p.type==='change'||p.type==='unequal')?8:4;
};

function renderChange8(p){
  const K=after(p,1),H=after(p,0);
  const kp=maru(p.p),hq=maru(p.q);
  const leftCoef=p.q*p.r;
  const rightCoef=p.p*p.s;
  const leftConst=p.delta*p.r;
  const rightConst=p.delta*p.s;
  const op=p.sign;
  const expanded=`${maru(leftCoef)} ${op} ${leftConst} ＝ ${maru(rightCoef)} ${op} ${rightConst}`;

  if(step===0){
    const c=`一成 ＝ ${kp}、尋子 ＝ ${hq}`;
    return card(`
      <div class="tag">変化する比 STEP 1 / 8</div>${phrase()}
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
      <div class="tag">変化する比 STEP 2 / 8</div>${phrase()}
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
      <div class="tag">変化する比 STEP 3 / 8</div>${phrase()}
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
      <div class="tag">変化する比 STEP 4 / 8</div>${phrase()}
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
      <div class="tag">変化する比 STEP 5 / 8</div>${phrase()}
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
    return card(`
      <div class="tag">変化する比 STEP 6 / 8</div>${phrase()}
      <div class="story">${p.story}</div>
      <div class="eqbox">(${H}) × ${p.r} ＝ (${K}) × ${p.s}</div>
      <div class="stepTitle">かっこを外そう</div>
      <div class="prompt"><b>かっこの外の数を、中の両方にかけます。</b><br>丸数字にも、${p.delta}にも、それぞれかけよう。</div>
      <div class="choices">${choice([
        {t:expanded,c:1},
        {t:`${maru(leftCoef)} ${op} ${p.delta} ＝ ${maru(rightCoef)} ${op} ${p.delta}`,c:0},
        {t:`${hq} ${op} ${leftConst} ＝ ${kp} ${op} ${rightConst}`,c:0}
      ])}</div>
      <div id="feedback" class="feedback"></div>
      <button id="next" class="next primary" onclick="nextStep()">STEP 7へ</button>
    `);
  }

  if(step===6){
    return card(`
      <div class="tag">変化する比 STEP 7 / 8</div>${phrase()}
      <div class="story">${p.story}</div>
      <div class="eqbox">${expanded}</div>
      <div class="stepTitle">①の値を求めよう</div>
      <div class="prompt">展開した式から、比の「1」にあたる <b>①</b> の値を求めます。</div>
      <div class="inputRow"><b>① ＝</b><input id="baseAns" inputmode="numeric" placeholder="?"> <b>${p.unit}</b></div>
      <button class="primary" style="width:100%;margin-top:14px" onclick="checkBase(${p.base},'${p.unit}')">答え合わせ</button>
      <div id="feedback" class="feedback"></div>
      <button id="next" class="next primary" onclick="nextStep()">STEP 8へ</button>
    `);
  }

  return card(`
    <div class="tag">変化する比 STEP 8 / 8</div>${phrase()}
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

function renderUnequal8(p){
  const kp=maru(p.p),hq=maru(p.q);
  const K=`${kp} − ${p.kDed}`;
  const H=`${hq} − ${p.hDed}`;
  const leftCoef=p.q*p.r;
  const rightCoef=p.p*p.s;
  const leftConst=p.hDed*p.r;
  const rightConst=p.kDed*p.s;
  const expanded=`${maru(leftCoef)} − ${leftConst} ＝ ${maru(rightCoef)} − ${rightConst}`;

  if(step===0){
    const c=`一成 ＝ ${kp}、尋子 ＝ ${hq}`;
    return card(`
      <div class="tag">発展問題 STEP 1 / 8</div>${phrase()}
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
      <div class="tag">発展問題 STEP 2 / 8</div>${phrase()}
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
      <div class="tag">発展問題 STEP 3 / 8</div>${phrase()}
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
      <div class="tag">発展問題 STEP 4 / 8</div>${phrase()}
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
      <div class="tag">発展問題 STEP 5 / 8</div>${phrase()}
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
      <div class="tag">発展問題 STEP 6 / 8</div>${phrase()}
      <div class="story">${p.story}</div>
      <div class="eqbox">(${H}) × ${p.r} ＝ (${K}) × ${p.s}</div>
      <div class="stepTitle">かっこを外そう</div>
      <div class="prompt"><b>かっこの外の数を、中の両方にかけます。</b><br>丸数字と引く数の両方に、それぞれかけよう。</div>
      <div class="choices">${choice([
        {t:expanded,c:1},
        {t:`${maru(leftCoef)} − ${p.hDed} ＝ ${maru(rightCoef)} − ${p.kDed}`,c:0},
        {t:`${hq} − ${leftConst} ＝ ${kp} − ${rightConst}`,c:0}
      ])}</div>
      <div id="feedback" class="feedback"></div>
      <button id="next" class="next primary" onclick="nextStep()">STEP 7へ</button>
    `);
  }

  if(step===6){
    return card(`
      <div class="tag">発展問題 STEP 7 / 8</div>${phrase()}
      <div class="story">${p.story}</div>
      <div class="eqbox">${expanded}</div>
      <div class="stepTitle">①の値を求めよう</div>
      <div class="prompt">展開した式から、比の「1」にあたる <b>①</b> の値を答えます。</div>
      <div class="inputRow"><b>① ＝</b><input id="advBase" inputmode="numeric" placeholder="?"> <b>${p.unit}</b></div>
      <button class="primary" style="width:100%;margin-top:14px" onclick="checkAdvancedBase(${p.base},'${p.unit}')">答え合わせ</button>
      <div id="feedback" class="feedback"></div>
      <button id="next" class="next primary" onclick="nextStep()">STEP 8へ</button>
    `);
  }

  return card(`
    <div class="tag">発展問題 STEP 8 / 8</div>${phrase()}
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

renderChange=renderChange8;
renderUnequal=renderUnequal8;

finish=function(){
  bar.style.width='100%';
  app.innerHTML=`<section class="card finish"><h2>ドリル完了！</h2><div class="rule">最後に3回読もう<br><strong>「内項の積＝外項の積の公式を利用して」</strong></div><p style="font-size:20px;font-weight:800">正解数：${score} / ${advancedTotalSteps()}</p><p class="note">全15問です。10〜15問目は8ステップで、かっこを外す計算も練習します。「数字を変えてもう一度やる」で新しい数字に変わります。</p><button class="primary" style="width:100%" onclick="restart()">数字を変えてもう一度やる</button></section>`;
};
