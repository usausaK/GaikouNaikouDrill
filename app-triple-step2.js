// 三項比 STEP 2 の導入文を指定どおりに変更する。
const cardBeforeTripleStep2Text=card;
card=function(x){
  const p=problems[pIndex];
  if(p&&p.type==='triple'&&step===1){
    x=x.replace('<div class="stepTitle">同じチケット代に注目しよう</div>','');
    x=x.replace('<div class="prompt">3人は同じ金額のチケットを買っています。</div>','<div class="prompt"><b>3人は同じ金額のチケットを買っています。チケット代は</b></div>');
  }
  return cardBeforeTripleStep2Text(x);
};
