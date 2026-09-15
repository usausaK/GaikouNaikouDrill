// Final layout: 6 types x 2 questions = 12 questions.
// Adds two three-term ratio questions using Disneyland / DisneySea tickets.

function tripleGcd(a,b){while(b)[a,b]=[b,a%b];return Math.abs(a)}
function tripleLcm(a,b){return Math.abs(a*b)/tripleGcd(a,b)}
function fracText(f){return `${f.n}/${f.d}`}
function pairRatioFromFractions(a,b){
  let x=b.n*a.d, y=b.d*a.n;
  const g=tripleGcd(x,y);
  return [x/g,y/g];
}
function makeTriple(place,aLabel,aFrac,bLabel,bFrac,cLabel,cFrac){
  const ab=pairRatioFromFractions(aFrac,bFrac);
  const ac=pairRatioFromFractions(aFrac,cFrac);
  const common=tripleLcm(ab[0],ac[0]);
  const answerA=common;
  const answerB=ab[1]*(common/ab[0]);
  const answerC=ac[1]*(common/ac[0]);
  return {
    type:'triple',place,aLabel,aFrac,bLabel,bFrac,cLabel,cFrac,
    ab,ac,answerA,answerB,answerC,
    story:`一成、尋子、ダンの3人が${place}へ行き、それぞれ同じ金額のチケットを購入しました。一成は、はじめの所持金の${aLabel}をチケット代に使いました。尋子は、はじめの所持金の${bLabel}を使いました。ダンは、はじめの所持金の${cLabel}を使いました。一成、尋子、ダンの、はじめの所持金の比を求めなさい。`
  };
}

function disneyLandTriple(){
  return makeTriple('ディズニーランド','40％',{n:2,d:5},'3/7',{n:3,d:7},'4/9',{n:4,d:9});
}
function disneySeaTriple(){
  return makeTriple('ディズニーシー','25％',{n:1,d:4},'2/9',{n:2,d:9},'3/10',{n:3,d:10});
}

// 6種類×2問＝全12問
// 1-2 公式 / 3-4 □ / 5-6 ％文章題 / 7-8 同じ量の増減
// 9-10 異なる量の増減 / 11-12 三項比
generateProblems=function(){
  const pairs=shuffle([[2,3],[3,4],[3,5],[4,5],[4,7],[5,6],[5,8],[6,7],[7,9]]).slice(0,2);
  const basics=pairs.map(makeBasic);
  const boxes=shuffle([0,1,2,3]).slice(0,2).map(makeBox);
  const percentKinds=shuffle(['wallet','bottle','savings']).slice(0,2);
  const percents=percentKinds.map(makePercent);
  const changeKinds=shuffle(['wallet','bottle','savings']).slice(0,2);
  const changes=changeKinds.map(makeChange);
  const unequalKinds=shuffle(['wallet','bottle','savings']).slice(0,2);
  const unequals=unequalKinds.map(makeUnequalChange);
  const triples=[disneyLandTriple(),disneySeaTriple()];
  problems=[...basics,...boxes,...percents,...changes,...unequals,...triples];
};

function finalStepsFor(p){
  if(!p)return 0;
  if(p.type==='change'||p.type==='unequal')return 8;
  if(p.type==='triple')return 6;
  return 4;
}
function finalTotalSteps(){return problems.reduce((n,p)=>n+finalStepsFor(p),0)}
function finalDoneBefore(i){let n=0;for(let x=0;x<i;x++)n+=finalStepsFor(problems[x]);return n}

nextStep=function(){
  step++;
  if(step>=finalStepsFor(problems[pIndex])){step=0;pIndex++;}
  render();
};

updateHeader=function(){
  const total=finalTotalSteps();
  const done=finalDoneBefore(pIndex)+step;
  bar.style.width=`${Math.min(100,total?done/total*100:0)}%`;
  progressText.textContent=`${Math.min(pIndex+1,12)} / 12 問`;
  scoreText.textContent=`正解 ${score}`;
};

render=function(){
  locked=false;
  if(pIndex>=problems.length)return finish();
  const p=problems[pIndex];
  if(p.type==='triple')return renderTriple(p);
  if(p.type==='change')return renderChange8(p);
  if(p.type==='unequal')return renderUnequal8(p);
  if(p.type==='percent')return renderPercent(p);
  if(step===0)return renderInner(p);
  if(step===1)return renderOuter(p);
  if(step===2)return renderEquation(p);
  return renderSolve(p);
};

function renderTriple(p){
  const relation=`一成 × ${fracText(p.aFrac)} ＝ 尋子 × ${fracText(p.bFrac)} ＝ ダン × ${fracText(p.cFrac)}`;
  const pairEq=`一成 × ${fracText(p.aFrac)} ＝ 尋子 × ${fracText(p.bFrac)}　と　一成 × ${fracText(p.aFrac)} ＝ ダン × ${fracText(p.cFrac)}`;
  const abText=`一成：尋子 ＝ ${p.ab[0]}：${p.ab[1]}`;
  const acText=`一成：ダン ＝ ${p.ac[0]}：${p.ac[1]}`;

  if(step===0){
    return card(`
      <div class="tag">三項比 STEP 1 / 6</div>
      <div class="story">${p.story}</div>
      <div class="stepTitle">三項比の解き方を確認しよう</div>
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
      <div class="tag">三項比 STEP 2 / 6</div>
      <div class="story">${p.story}</div>
      <div class="rule"><strong>3人が払ったチケット代は同じ。</strong><br>まず「同じ金額」に注目します。</div>
      <div class="stepTitle">3人が払ったチケット代の関係はどれ？</div>
      <div class="prompt">${p.aLabel} は ${fracText(p.aFrac)}、${p.bLabel} は ${fracText(p.bFrac)}、${p.cLabel} は ${fracText(p.cFrac)} として考えます。</div>
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
      <div class="tag">三項比 STEP 3 / 6</div>
      <div class="story">${p.story}</div>
      <div class="eqbox">${relation}</div>
      <div class="stepTitle">二人ずつピックアップしよう</div>
      <div class="prompt">三項比をいったん<b>二項比2つ</b>に分けます。二人ずつにすれば「内項の積＝外項の積」を利用できます。</div>
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
      <div class="tag">三項比 STEP 4 / 6</div>
      <div class="story">${p.story}</div>
      <div class="eqbox">一成 × ${fracText(p.aFrac)} ＝ 尋子 × ${fracText(p.bFrac)}</div>
      <div class="rule">二人だけになったので<br><strong>「内項の積＝外項の積の公式を利用して」</strong></div>
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
      <div class="tag">三項比 STEP 5 / 6</div>
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

  return card(`
    <div class="tag">三項比 STEP 6 / 6</div>
    <div class="story">${p.story}</div>
    <div class="eqbox">${abText}<br>${acText}</div>
    <div class="stepTitle">一成の数をそろえて、三項比にしよう</div>
    <div class="prompt">2つの比で<b>一成の数を同じにしてから</b>、一成：尋子：ダン を作ります。</div>
    <div class="inputRow">
      <input id="triA" inputmode="numeric" placeholder="一成"><b>：</b>
      <input id="triB" inputmode="numeric" placeholder="尋子"><b>：</b>
      <input id="triC" inputmode="numeric" placeholder="ダン">
    </div>
    <button class="primary" style="width:100%;margin-top:14px" onclick="checkTriple(${p.answerA},${p.answerB},${p.answerC})">答え合わせ</button>
    <div id="feedback" class="feedback"></div>
    <button id="next" class="next primary" onclick="nextStep()">次の問題へ</button>
  `);
}

function checkTriple(a,b,c){
  if(locked)return;
  const av=+document.getElementById('triA').value;
  const bv=+document.getElementById('triB').value;
  const cv=+document.getElementById('triC').value;
  if(av===a&&bv===b&&cv===c){
    locked=true;score++;
    feedback(true,`正解！ <strong>一成：尋子：ダン ＝ ${a}：${b}：${c}</strong><br>三項比は、そのまま公式を使わず、二人ずつピックアップして比を求めます。`);
    showNext();updateHeader();
  }else{
    feedback(false,'2つの比で「一成」の数を同じにしてから、尋子とダンの数を並べよう。');
  }
}

finish=function(){
  bar.style.width='100%';
  app.innerHTML=`<section class="card finish"><h2>ドリル完了！</h2><div class="rule"><strong>二項比：</strong>「内項の積＝外項の積」<br><strong>三項比：</strong>そのまま使わず、二人ずつピックアップして解く</div><p style="font-size:20px;font-weight:800">正解数：${score} / ${finalTotalSteps()}</p><p class="note">全12問（6種類×2問）です。「数字を変えてもう一度やる」で、新しい数字の問題に変わります。</p><button class="primary" style="width:100%" onclick="restart()">数字を変えてもう一度やる</button></section>`;
};