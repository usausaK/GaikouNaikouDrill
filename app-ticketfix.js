// STEP 8では答えを先に表示せず、⑤を選んだ後に説明する。
const cardBeforeTicketFix=card;
card=function(x){
  const p=problems[pIndex];
  if(p&&p.type==='triple'&&step===7){
    x=x.replace('<div class="rule" style="margin-top:14px"><strong>チケット代は⑤になります。</strong></div>','');
    x=x.replaceAll('onclick="answerChoice(this)"','onclick="answerTicket(this)"');
  }
  return cardBeforeTicketFix(x);
};

function answerTicket(btn){
  if(locked)return;
  if(btn.dataset.correct==='1'){
    locked=true;
    score++;
    feedback(true,'正解！<br><strong>チケット代は⑤になります。</strong><br>3人とも、それぞれの所持金に問題の割合をかけると⑤になります。');
    document.querySelectorAll('.choices button').forEach(b=>b.disabled=true);
    showNext();
    updateHeader();
  }else{
    btn.disabled=true;
    feedback(false,'もう一度。丸数字で表した所持金に、それぞれが使った割合をかけてみよう。');
  }
}
