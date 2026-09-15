// 三項比を8ステップ化：STEP6で共通項をそろえ、STEP7で三項比、STEP8でチケット代⑤を確認する。

// 暗算で扱え、かつ2つの比で「一成」を実際にそろえる必要がある設定。
function disneyLandTriple(){
  // 同じチケット代：一成1/2、尋子5/6、ダン1/4
  // 一成:尋子=5:3、一成:ダン=1:2 → 5:3:10
  // 2倍して ⑩:⑥:⑳ とすると、チケット代は⑤。
  return makeTriple(
    'ディズニーランド',
    '50％',{n:1,d:2},
    '5/6',{n:5,d:6},
    '1/4',{n:1,d:4}
  );
}

function disneySeaTriple(){
  // 同じチケット代：一成1/4、尋子5/8、ダン1/2
  // 一成:尋子=5:2、一成:ダン=2:1 → 10:4:5
  // 2倍して ⑳:⑧:⑩ とすると、チケット代は⑤。
  return makeTriple(
    'ディズニーシー',
    '25％',{n:1,d:4},
    '5/8',{n:5,d:8},
    '50％',{n:1,d:2}
  );
}

const finalStepsForBeforeTriple8=finalStepsFor;
finalStepsFor=function(p){
  if(p&&p.type==='triple')return 8;
  return finalStepsForBeforeTriple8(p);
};

function circledForTriple(n){
  const nums=['⓪','①','②','③','④','⑤','⑥','⑦','⑧','⑨','⑩','⑪','⑫','⑬','⑭','⑮','⑯','⑰','⑱','⑲','⑳'];
  return nums[n]||String(n);
}

renderTriple=function(p){
  const relation=`一成 × ${fracText(p.aFrac)} ＝ 尋子 × ${fracText(p.bFrac)} ＝ ダン × ${fracText(p.cFrac)}`;
  const pairEq=`一成 × ${fracText(p.aFrac)} ＝ 尋子 × ${fracText(p.bFrac)}　と　一成 × ${fracText(p.aFrac)} ＝ ダン × ${fracText(p.cFrac)}`;
  const abText=`一成：尋子 ＝ ${p.ab[0]}：${p.ab[1]}`;
  const acText=`一成：ダン ＝ ${p.ac[0]}：${p.ac[1]}`;
  const alignedAB=`一成：尋子 ＝ ${p.answerA}：${p.answerB}`;
  const alignedAC=`一成：ダン ＝ ${p.answerA}：${p.answerC}`;

  const ticketUnit=p.answerA*p.aFrac.n/p.aFrac.d;
  const ticketScale=5/ticketUnit;
  const scaledA=Math.round(p.answerA*ticketScale);
  const scaledB=Math.round(p.answerB*ticketScale);
  const scaledC=Math.round(p.answerC*ticketScale);
  const circledRatio=`${circledForTriple(scaledA)}：${circledForTriple(scaledB)}：${circledForTriple(scaledC)}`;

  if(step===0){
    return card(`
      <div class="tag">三項比 STEP 1 / 8</div>
      <div class="story">${p.story}</div>
      <div class="stepTitle">三項比のルール</div>
      <div class="prompt"><b>この問題は三項比（さんこうひ）の問題です。三項比（さんこうひ）の問題では、そのまま内項の積＝外項の積の公式を</b></div>
      <div class="choices">${choice([
        {t:'使う',c:0},
        {t:'使ってはいけない',c:1}
      ])}</div>
      <div class="rule" style="margin-top:14px"><strong>二人ずつピックアップして解く</strong></div>
      <div id="feedback" class="feedback"></div>
      <button id="next" class="next primary" onclick="nextStep()">STEP 2へ</button>
    `);
  }

  if(step===1){
    return card(`
      <div class="tag">三項比 STEP 2 / 8</div>
      <div class="story">${p.story}</div>
      <div class="stepTitle">同じチケット代に注目しよう</div>
      <div class="prompt">3人は同じ金額のチケットを買っています。</div>
      <div class="choices">${choice([
        {t:relation,c:1},
        {t:`一成 × ${fracText(p.bFrac)} ＝ 尋子 × ${fracText(p.aFrac)} ＝ ダン × ${fracText(p.cFrac)}`,c:0},
        {t:`一成 ＋ ${fracText(p.aFrac)} ＝ 尋子 ＋ ${fracText(p.bFrac)} ＝ ダン ＋ ${fracText(p.cFrac)}`,c:0}
      ])}</div>
      <div id="feedback" class="feedback"></div>
      <button id="next" class="next primary" onclick="nextStep()">STEP 3へ</button>
    `);
  }

  if(step===2){
    return card(`
      <div class="tag">三項比 STEP 3 / 8</div>
      <div class="story">${p.story}</div>
      <div class="eqbox">${relation}</div>
      <div class="stepTitle">二人ずつピックアップしよう</div>
      <div class="choices">${choice([
        {t:pairEq,c:1},
        {t:`一成 × ${fracText(p.aFrac)} ＝ 尋子 × ${fracText(p.cFrac)}　と　尋子 × ${fracText(p.bFrac)} ＝ ダン × ${fracText(p.aFrac)}`,c:0},
        {t:`一成：尋子：ダン ＝ ${fracText(p.aFrac)}：${fracText(p.bFrac)}：${fracText(p.cFrac)}`,c:0}
      ])}</div>
      <div id="feedback" class="feedback"></div>
      <button id="next" class="next primary" onclick="nextStep()">STEP 4へ</button>
    `);
  }

  if(step===3){
    return card(`
      <div class="tag">三項比 STEP 4 / 8</div>
      <div class="story">${p.story}</div>
      <div class="eqbox">一成 × ${fracText(p.aFrac)} ＝ 尋子 × ${fracText(p.bFrac)}</div>
      <div class="rule">二人だけなので<br><strong>「内項の積＝外項の積の公式を利用して」</strong></div>
      <div class="stepTitle">一成：尋子 を求めよう</div>
      <div class="choices">${choice([
        {t:abText,c:1},
        {t:`一成：尋子 ＝ ${p.ab[1]}：${p.ab[0]}`,c:0},
        {t:`一成：尋子 ＝ ${p.aFrac.n}：${p.bFrac.n}`,c:0}
      ])}</div>
      <div id="feedback" class="feedback"></div>
      <button id="next" class="next primary" onclick="nextStep()">STEP 5へ</button>
    `);
  }

  if(step===4){
    return card(`
      <div class="tag">三項比 STEP 5 / 8</div>
      <div class="story">${p.story}</div>
      <div class="eqbox">一成 × ${fracText(p.aFrac)} ＝ ダン × ${fracText(p.cFrac)}</div>
      <div class="rule">もう一度、二人だけなので<br><strong>「内項の積＝外項の積の公式を利用して」</strong></div>
      <div class="stepTitle">一成：ダン を求めよう</div>
      <div class="choices">${choice([
        {t:acText,c:1},
        {t:`一成：ダン ＝ ${p.ac[1]}：${p.ac[0]}`,c:0},
        {t:`一成：ダン ＝ ${p.aFrac.n}：${p.cFrac.n}`,c:0}
      ])}</div>
      <div id="feedback" class="feedback"></div>
      <button id="next" class="next primary" onclick="nextStep()">STEP 6へ</button>
    `);
  }

  if(step===5){
    return card(`
      <div class="tag">三項比 STEP 6 / 8</div>
      <div class="story">${p.story}</div>
      <div class="eqbox">${abText}<br>${acText}</div>
      <div class="stepTitle">2つの比で「一成」の数をそろえよう</div>
      <div class="prompt">一成の数の最小公倍数に合わせます。まだ三項比にはしません。</div>
      <div class="choices">${choice([
        {t:`${alignedAB}　／　${alignedAC}`,c:1},
        {t:`${abText}　／　${acText}`,c:0},
        {t:`一成：尋子 ＝ ${p.answerB}：${p.answerA}　／　一成：ダン ＝ ${p.answerC}：${p.answerA}`,c:0}
      ])}</div>
      <div id="feedback" class="feedback"></div>
      <button id="next" class="next primary" onclick="nextStep()">STEP 7へ</button>
    `);
  }

  if(step===6){
    return card(`
      <div class="tag">三項比 STEP 7 / 8</div>
      <div class="story">${p.story}</div>
      <div class="eqbox">${alignedAB}<br>${alignedAC}</div>
      <div class="stepTitle">一成：尋子：ダン を完成させよう</div>
      <div class="inputRow">
        <input id="triA" inputmode="numeric" placeholder="一成"><b>：</b>
        <input id="triB" inputmode="numeric" placeholder="尋子"><b>：</b>
        <input id="triC" inputmode="numeric" placeholder="ダン">
      </div>
      <button class="primary" style="width:100%;margin-top:14px" onclick="checkTriple(${p.answerA},${p.answerB},${p.answerC})">答え合わせ</button>
      <div id="feedback" class="feedback"></div>
      <button id="next" class="next primary" onclick="nextStep()">STEP 8へ</button>
    `);
  }

  return card(`
    <div class="tag">三項比 STEP 8 / 8</div>
    <div class="story">${p.story}</div>
    <div class="eqbox">一成：尋子：ダン ＝ ${p.answerA}：${p.answerB}：${p.answerC}<br>↓ チケット代が整数になるように同じ数をかける<br>${circledRatio}</div>
    <div class="stepTitle">チケット代はどれ？</div>
    <div class="prompt">3人とも同じチケット代です。それぞれが使った割合を当てはめて確認しよう。</div>
    <div class="choices">${choice([
      {t:'⑤',c:1},
      {t:'⑩',c:0},
      {t:'⑮',c:0}
    ])}</div>
    <div id="feedback" class="feedback"></div>
    <button id="next" class="next primary" onclick="nextStep()">次の問題へ</button>
    <div class="rule" style="margin-top:14px"><strong>チケット代は⑤になります。</strong></div>
  `);
};
