// STEP 8: 3人それぞれのチケット代の計算式を表示する。
const cardBeforeStep8Calc=card;
card=function(x){
  const p=problems[pIndex];
  if(p&&p.type==='triple'&&step===7){
    const ticketUnit=p.answerA*p.aFrac.n/p.aFrac.d;
    const ticketScale=5/ticketUnit;
    const scaledA=Math.round(p.answerA*ticketScale);
    const scaledB=Math.round(p.answerB*ticketScale);
    const scaledC=Math.round(p.answerC*ticketScale);
    const five=circledForTriple(5);
    const calcBox=`<div class="eqbox" style="text-align:left">
      <div><b>チケット代を計算して確認しよう</b></div>
      <div style="margin-top:10px">一成：${circledForTriple(scaledA)} × ${p.aLabel} ＝ ${five}</div>
      <div>尋子：${circledForTriple(scaledB)} × ${p.bLabel} ＝ ${five}</div>
      <div>ダン：${circledForTriple(scaledC)} × ${p.cLabel} ＝ ${five}</div>
    </div>`;
    x=x.replace('<div class="stepTitle">チケット代はどれ？</div>',`${calcBox}<div class="stepTitle">チケット代はどれ？</div>`);
  }
  return cardBeforeStep8Calc(x);
};
