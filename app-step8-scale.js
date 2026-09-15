// STEP 8: 三項比を丸数字へ広げる操作を明示する。
const cardBeforeStep8Scale=card;
card=function(x){
  const p=problems[pIndex];
  if(p&&p.type==='triple'&&step===7){
    const ticketUnit=p.answerA*p.aFrac.n/p.aFrac.d;
    const ticketScale=5/ticketUnit;
    const scaledA=Math.round(p.answerA*ticketScale);
    const scaledB=Math.round(p.answerB*ticketScale);
    const scaledC=Math.round(p.answerC*ticketScale);
    const circledRatio=`${circledForTriple(scaledA)}：${circledForTriple(scaledB)}：${circledForTriple(scaledC)}`;
    const baseRatio=`${p.answerA}：${p.answerB}：${p.answerC}`;
    const scaleText=Number.isInteger(ticketScale)?ticketScale:String(ticketScale);
    const replacement=`チケット代が整数になるように3つの数に同じ数をかける（×${scaleText}）<br>${baseRatio} ＝ ${circledRatio}`;
    x=x.replace(/↓ チケット代が整数になるように同じ数をかける<br>[^<]+/,replacement);
  }
  return cardBeforeStep8Scale(x);
};
