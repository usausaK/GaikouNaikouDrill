// 問題10〜12：STEPが変わるたびに応援メッセージも変える。
// 既存の応援表示を利用し、DOM更新後にメッセージと動物を差し替える。
(() => {
  const messages = {
    9: [
      ['dog','あと少し！\nここまでよくがんばったワン！'],
      ['dog','いい調子！\n1ステップずついこうワン！'],
      ['cat','その考え方でOKにゃ！\nあわてなくて大丈夫！'],
      ['rabbit','ここまで来たのすごい！\nもう少しだよ！'],
      ['dog','式をゆっくり見ようワン！\nできるできる！'],
      ['cat','ナイス集中にゃ！\n次もいける！'],
      ['rabbit','あとちょっと！\nていねいにいこう！'],
      ['cat','10問目ラストステップにゃ！\nよくがんばった！']
    ],
    10: [
      ['rabbit','11問目スタート！\nあと2問だよ！'],
      ['cat','いいぞいいぞ〜！\nそのまま進むにゃ！'],
      ['dog','2人ずつ考えるワン！\n落ち着けばできる！'],
      ['rabbit','ここ大事！\nゆっくりでOK！'],
      ['cat','半分以上きたにゃ！\nその調子！'],
      ['dog','数をそろえるところだワン！\n焦らずいこう！'],
      ['rabbit','三項比が見えてきた！\nあと1ステップ！'],
      ['cat','11問目クリア目前にゃ〜！']
    ],
    11: [
      ['cat','最後の問題にゃ〜！\nここまで本当にすごい！'],
      ['dog','ラスト！\n同じチケット代に注目だワン！'],
      ['rabbit','二人ずつピックアップ！\n覚えてるね！'],
      ['cat','いい感じにゃ！\n割合を反対側へ！'],
      ['dog','もう一組も同じだワン！\nあと少し！'],
      ['rabbit','一成の数をそろえよう！\nゴールが見えた！'],
      ['cat','三項比を完成させるにゃ！\nラスト2！'],
      ['cat','本当に最後のSTEPにゃ〜！\nチケット代を確認！']
    ]
  };

  function svg(kind){
    if(kind==='dog') return `
      <svg class="pixel-pet" viewBox="0 0 64 64" aria-hidden="true">
        <g class="tail"><rect x="51" y="37" width="8" height="7" fill="#8b5e34"/><rect x="56" y="32" width="5" height="8" fill="#8b5e34"/></g>
        <rect x="14" y="18" width="36" height="32" rx="3" fill="#c8894b"/><rect x="9" y="17" width="10" height="18" fill="#8b5e34"/><rect x="45" y="17" width="10" height="18" fill="#8b5e34"/>
        <rect x="19" y="25" width="8" height="8" fill="#fff"/><rect x="37" y="25" width="8" height="8" fill="#fff"/><rect x="22" y="28" width="5" height="5" fill="#263238"/><rect x="37" y="28" width="5" height="5" fill="#263238"/>
        <rect x="27" y="36" width="10" height="6" fill="#263238"/><rect x="30" y="42" width="4" height="5" fill="#ef6c7b"/><rect x="18" y="49" width="9" height="8" fill="#8b5e34"/><rect x="37" y="49" width="9" height="8" fill="#8b5e34"/>
      </svg>`;
    if(kind==='rabbit') return `
      <svg class="pixel-pet" viewBox="0 0 64 64" aria-hidden="true">
        <rect class="earL" x="16" y="4" width="11" height="23" rx="4" fill="#f0b7c7"/><rect class="earR" x="37" y="4" width="11" height="23" rx="4" fill="#f0b7c7"/>
        <rect x="13" y="20" width="38" height="34" rx="8" fill="#f7d8e2"/><rect x="18" y="27" width="9" height="9" fill="#fff"/><rect x="37" y="27" width="9" height="9" fill="#fff"/><rect x="21" y="30" width="5" height="5" fill="#263238"/><rect x="38" y="30" width="5" height="5" fill="#263238"/>
        <rect x="29" y="38" width="6" height="5" fill="#ef6c7b"/><rect x="24" y="46" width="7" height="5" fill="#fff"/><rect x="33" y="46" width="7" height="5" fill="#fff"/>
      </svg>`;
    return `
      <svg class="pixel-pet" viewBox="0 0 64 64" aria-hidden="true">
        <g class="tail"><rect x="49" y="38" width="10" height="7" fill="#78909c"/><rect x="55" y="32" width="6" height="8" fill="#78909c"/></g>
        <rect class="earL" x="12" y="10" width="14" height="16" fill="#607d8b"/><rect class="earR" x="38" y="10" width="14" height="16" fill="#607d8b"/><rect x="15" y="19" width="34" height="35" rx="6" fill="#90a4ae"/>
        <rect x="20" y="27" width="8" height="9" fill="#fff"/><rect x="36" y="27" width="8" height="9" fill="#fff"/><rect x="23" y="30" width="5" height="5" fill="#263238"/><rect x="36" y="30" width="5" height="5" fill="#263238"/>
        <rect x="29" y="38" width="6" height="5" fill="#f06292"/><rect x="22" y="43" width="7" height="3" fill="#ef9a9a"/><rect x="35" y="43" width="7" height="3" fill="#ef9a9a"/><rect x="19" y="52" width="9" height="7" fill="#607d8b"/><rect x="36" y="52" width="9" height="7" fill="#607d8b"/>
      </svg>`;
  }

  let lastKey='';
  function refreshStepCheer(){
    if(typeof pIndex!=='number' || typeof step!=='number') return;
    if(pIndex<9 || pIndex>11) return;
    const el=document.getElementById('pixelCheer');
    if(!el) return;
    const list=messages[pIndex];
    if(!list) return;
    const idx=Math.min(step,list.length-1);
    const key=`${pIndex}-${idx}`;
    if(key===lastKey) return;
    lastKey=key;
    const [kind,text]=list[idx];
    const msg=el.querySelector('#pixelCheerMsg');
    const pet=el.querySelector('#pixelCheerPet');
    if(msg) msg.innerHTML=text.replace(/\n/g,'<br>');
    if(pet) pet.innerHTML=svg(kind);
    el.classList.remove('show');
    void el.offsetWidth;
    el.classList.add('show');
  }

  const appEl=document.getElementById('app');
  if(appEl){
    new MutationObserver(()=>setTimeout(refreshStepCheer,0)).observe(appEl,{childList:true,subtree:true});
  }
  window.addEventListener('DOMContentLoaded',()=>setTimeout(refreshStepCheer,80));
})();
