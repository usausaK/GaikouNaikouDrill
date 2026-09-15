// 三項比の最終調整
// 1) STEP 6の選択肢を重複させない
// 2) STEP 8のチケット代を固定⑤ではなく問題ごとの ticketTarget にする

const renderTripleBeforeTicketDynamic=renderTriple;

function uniqueTripleChoices(items){
  const seen=new Set();
  const out=[];
  for(const item of items){
    const key=item.t.replace(/\s+/g,' ').trim();
    if(seen.has(key))continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function dynamicTicketDistractors(target){
  const pool=[2,3,4,5,6,7,8,9,10].filter(n=>n!==target);
  return shuffle(pool).slice(0,2);
}

renderTriple=function(p){
  // STEP 6：同じ見た目の選択肢を出さない。
  if(step===5){
    const abText=`一成：尋子 ＝ ${p.ab[0]}：${p.ab[1]}`;
    const acText=`一成：ダン ＝ ${p.ac[0]}：${p.ac[1]}`;
    const alignedAB=`一成：尋子 ＝ ${p.answerA}：${p.answerB}`;
    const alignedAC=`一成：ダン ＝ ${p.answerA}：${p.answerC}`;
    const correct=`${alignedAB}　／　${alignedAC}`;
    const options=uniqueTripleChoices([
      {t:correct,c:1},
      {t:`${abText}　／　${acText}`,c:0},
      {t:`一成：尋子 ＝ ${p.answerB}：${p.answerA}　／　一成：ダン ＝ ${p.answerC}：${p.answerA}`,c:0},
      {t:`一成：尋子 ＝ ${p.answerA}：${p.answerC}　／　一成：ダン ＝ ${p.answerA}：${p.answerB}`,c:0},
      {t:`一成：尋子 ＝ ${p.answerB}：${p.answerC}　／　一成：ダン ＝ ${p.answerA}：${p.answerB}`,c:0}
    ]).slice(0,3);

    return card(`
      <div class="tag">三項比 STEP 6 / 8</div>
      <div class="story">${p.story}</div>
      <div class="eqbox">${abText}<br>${acText}</div>
      <div class="stepTitle">2つの比で「一成」の数をそろえよう</div>
      <div class="prompt">一成の数の最小公倍数に合わせます。まだ三項比にはしません。</div>
      <div class="choices">${choice(options)}</div>
      <div id="feedback" class="feedback"></div>
      <button id="next" class="next primary" onclick="nextStep()">STEP 7へ</button>
    `);
  }

  // STEP 8：チケット代を問題ごとに変える。
  if(step===7){
    const target=p.ticketTarget||5;
    const ticketUnit=p.answerA*p.aFrac.n/p.aFrac.d;
    const scale=target/ticketUnit;
    const scaledA=Math.round(p.answerA*scale);
    const scaledB=Math.round(p.answerB*scale);
    const scaledC=Math.round(p.answerC*scale);
    const targetCircle=circledForTriple(target);
    const ratioCircle=`${circledForTriple(scaledA)}：${circledForTriple(scaledB)}：${circledForTriple(scaledC)}`;
    const baseRatio=`${p.answerA}：${p.answerB}：${p.answerC}`;
    const scaleText=Number.isInteger(scale)?String(scale):String(Math.round(scale*100)/100);
    const distractors=dynamicTicketDistractors(target);

    return card(`
      <div class="tag">三項比 STEP 8 / 8</div>
      <div class="story">${p.story}</div>
      <div class="eqbox">
        一成：尋子：ダン ＝ ${baseRatio}<br>
        <span style="font-size:.82em">チケット代が整数になるように3つの数に同じ数をかける（×${scaleText}）</span><br>
        ${baseRatio} ＝ ${ratioCircle}
      </div>

      <div class="eqbox" style="text-align:left">
        <div><b>チケット代を計算して確認しよう</b></div>
        <div style="margin-top:10px">一成：${circledForTriple(scaledA)} × ${p.aLabel} ＝ ${targetCircle}</div>
        <div>尋子：${circledForTriple(scaledB)} × ${p.bLabel} ＝ ${targetCircle}</div>
        <div>ダン：${circledForTriple(scaledC)} × ${p.cLabel} ＝ ${targetCircle}</div>
      </div>

      <div class="stepTitle">チケット代を選ぼう</div>
      <div class="prompt">3人とも同じチケット代になります。</div>
      <div class="choices">${choice([
        {t:targetCircle,c:1},
        {t:circledForTriple(distractors[0]),c:0},
        {t:circledForTriple(distractors[1]),c:0}
      ]).replaceAll('onclick="answerChoice(this)"','onclick="answerTicketDynamic(this)"')}</div>
      <div id="feedback" class="feedback"></div>
      <button id="next" class="next primary" onclick="nextStep()">次の問題へ</button>
    `);
  }

  return renderTripleBeforeTicketDynamic(p);
};

function answerTicketDynamic(btn){
  if(locked)return;
  const p=problems[pIndex];
  const target=p.ticketTarget||5;
  const targetCircle=circledForTriple(target);
  if(btn.dataset.correct==='1'){
    locked=true;
    score++;
    feedback(true,`正解！<br><strong>チケット代は${targetCircle}になります。</strong><br>3人とも、それぞれの所持金に問題の割合をかけると${targetCircle}になります。`);
    document.querySelectorAll('.choices button').forEach(b=>b.disabled=true);
    showNext();
    updateHeader();
  }else{
    btn.disabled=true;
    feedback(false,'もう一度。丸数字で表した所持金に、それぞれが使った割合をかけてみよう。');
  }
}
