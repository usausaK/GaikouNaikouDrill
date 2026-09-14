function sevenStepsFor(p){return p&&p.type==='change'?7:4}
function sevenTotalSteps(){return problems.reduce((n,p)=>n+sevenStepsFor(p),0)}
function sevenDoneBefore(i){let n=0;for(let x=0;x<i;x++)n+=sevenStepsFor(problems[x]);return n}

nextStep=function(){
  step++;
  if(step>=sevenStepsFor(problems[pIndex])){
    step=0;
    pIndex++;
  }
  render();
};

updateHeader=function(){
  const total=sevenTotalSteps();
  const done=sevenDoneBefore(pIndex)+step;
  bar.style.width=`${Math.min(100,done/total*100)}%`;
  progressText.textContent=`${Math.min(pIndex+1,12)} / 12 問`;
  scoreText.textContent=`正解 ${score}`;
};

finish=function(){
  bar.style.width='100%';
  app.innerHTML=`<section class="card finish"><h2>ドリル完了！</h2><div class="rule">最後に3回読もう<br><strong>「内項の積＝外項の積の公式を利用して」</strong></div><p style="font-size:20px;font-weight:800">正解数：${score} / ${sevenTotalSteps()}</p><p class="note">1〜9問目は4ステップ、10〜12問目は7ステップです。「数字を変えてもう一度やる」で、新しい数字の12問を作ります。</p><button class="primary" style="width:100%" onclick="restart()">数字を変えてもう一度やる</button></section>`;
};
