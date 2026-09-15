// 問題10〜12の応援ピクセルアニマル + 日付/タイマー + localStorage履歴 + クリア時間グラフ
(() => {
  const HISTORY_KEY = 'gaikouNaikouDrill:clearHistory:v1';
  const MAX_HISTORY = 30;
  let sessionStart = Date.now();
  let sessionFinishedAt = 0;
  let sessionRecorded = false;
  let timerId = null;

  function esc(s){
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function pad(n){ return String(n).padStart(2,'0'); }
  function formatDuration(sec){
    sec = Math.max(0, Math.round(sec));
    const h = Math.floor(sec/3600), m = Math.floor((sec%3600)/60), s = sec%60;
    return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
  }
  function formatDate(d){
    return `${d.getFullYear()}/${pad(d.getMonth()+1)}/${pad(d.getDate())}`;
  }
  function formatDateTime(d){
    return `${d.getMonth()+1}/${d.getDate()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function loadHistory(){
    try{
      const v = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      return Array.isArray(v) ? v : [];
    }catch(e){ return []; }
  }
  function saveHistory(items){
    try{ localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(-MAX_HISTORY))); }catch(e){}
  }
  function recordCompletion(seconds){
    if(sessionRecorded) return;
    sessionRecorded = true;
    const items = loadHistory();
    items.push({ finishedAt: new Date().toISOString(), seconds: Math.max(1, Math.round(seconds)) });
    saveHistory(items);
  }

  function injectStyles(){
    if(document.getElementById('cheer-history-style')) return;
    const style = document.createElement('style');
    style.id = 'cheer-history-style';
    style.textContent = `
      .session-strip{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-top:8px;font-size:13px;color:#4b5563}
      .session-pill{display:inline-flex;align-items:center;gap:5px;background:#fff;border:1px solid #e5e7eb;border-radius:999px;padding:5px 9px;font-weight:700;box-shadow:0 2px 7px rgba(0,0,0,.04)}
      .history-toggle{margin-left:auto;padding:5px 10px;border-radius:999px;font-size:12px;font-weight:800;background:#fff;border:1px solid #d1d5db;box-shadow:none}
      .history-drawer{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:14px;margin:10px 0 2px;box-shadow:0 7px 22px rgba(0,0,0,.07)}
      .history-drawer[hidden]{display:none}
      .history-head{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px}.history-head b{font-size:15px}
      .history-empty{padding:18px 6px;text-align:center;color:#6b7280;font-size:14px}
      .history-chart{width:100%;height:auto;display:block;overflow:visible}
      .history-caption{font-size:12px;color:#6b7280;margin-top:4px;text-align:center}
      .history-recent{font-size:12px;color:#4b5563;margin-top:8px;line-height:1.7}

      .pixel-cheer{position:fixed;right:max(14px,env(safe-area-inset-right));bottom:max(14px,env(safe-area-inset-bottom));z-index:90;display:none;align-items:flex-end;gap:8px;pointer-events:none;filter:drop-shadow(0 8px 10px rgba(0,0,0,.15))}
      .pixel-cheer.show{display:flex;animation:cheer-pop .32s ease-out both}
      .pixel-bubble{position:relative;max-width:190px;background:#fff;color:#263238;border:3px solid #263238;border-radius:16px;padding:10px 13px;font-size:15px;font-weight:900;line-height:1.35;box-shadow:4px 4px 0 rgba(38,50,56,.18)}
      .pixel-bubble:after{content:'';position:absolute;right:-13px;bottom:18px;width:18px;height:18px;background:#fff;border-right:3px solid #263238;border-bottom:3px solid #263238;transform:rotate(-45deg)}
      .pixel-pet-wrap{width:86px;height:86px;display:grid;place-items:center;image-rendering:pixelated;animation:pet-bounce .62s ease-in-out infinite alternate;transform-origin:center bottom}
      .pixel-pet{width:84px;height:84px;shape-rendering:crispEdges;image-rendering:pixelated}
      .pixel-pet .tail{transform-origin:12px 42px;animation:tail-wag .5s ease-in-out infinite alternate}
      .pixel-pet .earL{transform-origin:18px 16px;animation:ear-wiggle 1.2s ease-in-out infinite alternate}
      .pixel-pet .earR{transform-origin:46px 16px;animation:ear-wiggle 1.2s .15s ease-in-out infinite alternate-reverse}
      .finish-cheer-inline{display:flex;align-items:center;justify-content:center;gap:12px;margin:14px auto 18px;padding:12px;border-radius:18px;background:#fff7ed;border:2px solid #fdba74;max-width:520px}
      .finish-cheer-inline .pixel-bubble{max-width:280px;background:#fff}.finish-cheer-inline .pixel-pet-wrap{width:92px;height:92px}
      .finish-history{margin-top:20px;text-align:left}.finish-history h3{text-align:center;margin:0 0 10px;font-size:18px}
      @keyframes pet-bounce{from{transform:translateY(0) scaleY(1)}to{transform:translateY(-9px) scaleY(.96)}}
      @keyframes tail-wag{from{transform:rotate(-9deg)}to{transform:rotate(12deg)}}
      @keyframes ear-wiggle{from{transform:rotate(-3deg)}to{transform:rotate(5deg)}}
      @keyframes cheer-pop{from{opacity:0;transform:translateY(14px) scale(.92)}to{opacity:1;transform:none}}
      @media(max-width:620px){.pixel-cheer{right:8px;bottom:8px;gap:5px}.pixel-pet-wrap{width:68px;height:68px}.pixel-pet{width:66px;height:66px}.pixel-bubble{max-width:145px;padding:8px 10px;font-size:13px;border-width:2px}.pixel-bubble:after{right:-10px;width:14px;height:14px;border-width:0 2px 2px 0}.history-toggle{margin-left:0}.session-strip{gap:6px}}
      @media(prefers-reduced-motion:reduce){.pixel-pet-wrap,.pixel-pet .tail,.pixel-pet .earL,.pixel-pet .earR,.pixel-cheer.show{animation:none!important}}
    `;
    document.head.appendChild(style);
  }

  function animalSvg(kind='cat'){
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

  function ensureCheer(){
    let el = document.getElementById('pixelCheer');
    if(el) return el;
    el = document.createElement('div');
    el.id = 'pixelCheer';
    el.className = 'pixel-cheer';
    el.innerHTML = `<div class="pixel-bubble" id="pixelCheerMsg"></div><div class="pixel-pet-wrap" id="pixelCheerPet"></div>`;
    document.body.appendChild(el);
    return el;
  }
  function cheerForQuestion(){
    // 問題番号は0始まり。10問目から表示。
    if(typeof pIndex!=='number' || pIndex < 9 || pIndex >= 12) return null;
    if(pIndex===9) return {kind:'dog', msg:'あと少し！\nここまでよくがんばったワン！'};
    if(pIndex===10) return {kind:'rabbit', msg:'がんばれ！\nあと2問だよ！'};
    return {kind:'cat', msg:'最後の問題にゃ〜！\nもうひと踏んばり！'};
  }
  function updateCheer(){
    const el = ensureCheer();
    const info = cheerForQuestion();
    if(!info){ el.classList.remove('show'); return; }
    const msg = el.querySelector('#pixelCheerMsg');
    const pet = el.querySelector('#pixelCheerPet');
    msg.innerHTML = esc(info.msg).replace(/\n/g,'<br>');
    pet.innerHTML = animalSvg(info.kind);
    el.classList.add('show');
  }
  function showFinishCheer(){
    const el = ensureCheer();
    el.classList.remove('show');
    const finishCard = app.querySelector('.finish');
    if(!finishCard || finishCard.querySelector('.finish-cheer-inline')) return;
    const box = document.createElement('div');
    box.className = 'finish-cheer-inline';
    box.innerHTML = `<div class="pixel-pet-wrap">${animalSvg('cat')}</div><div class="pixel-bubble">お疲れ様！<br>がんばったにゃ！<br>すごいにゃ〜！</div>`;
    const h2 = finishCard.querySelector('h2');
    if(h2 && h2.nextSibling) h2.parentNode.insertBefore(box,h2.nextSibling); else finishCard.prepend(box);
  }

  function ensureSessionUi(){
    if(document.getElementById('sessionStrip')) return;
    const meta = document.querySelector('.top .meta');
    if(!meta) return;
    const strip = document.createElement('div');
    strip.id = 'sessionStrip';
    strip.className = 'session-strip';
    strip.innerHTML = `
      <span class="session-pill">📅 <span id="sessionDate"></span></span>
      <span class="session-pill">⏱ <span id="sessionTimer">0:00</span></span>
      <button class="history-toggle" type="button" id="historyToggle">📈 記録を見る</button>`;
    meta.insertAdjacentElement('afterend',strip);
    const drawer = document.createElement('div');
    drawer.id = 'historyDrawer';
    drawer.className = 'history-drawer';
    drawer.hidden = true;
    strip.insertAdjacentElement('afterend',drawer);
    document.getElementById('sessionDate').textContent = formatDate(new Date());
    document.getElementById('historyToggle').addEventListener('click',()=>{
      drawer.hidden = !drawer.hidden;
      if(!drawer.hidden) renderHistoryDrawer();
    });
  }

  function currentSeconds(){
    const end = sessionFinishedAt || Date.now();
    return Math.max(0,(end-sessionStart)/1000);
  }
  function updateTimer(){
    const el = document.getElementById('sessionTimer');
    if(el) el.textContent = formatDuration(currentSeconds());
  }
  function startTimerLoop(){
    if(timerId) clearInterval(timerId);
    updateTimer();
    timerId = setInterval(updateTimer,500);
  }

  function chartSvg(items){
    if(!items.length) return `<div class="history-empty">まだクリア記録がありません。<br>全12問を終えるとここに記録されます。</div>`;
    const data = items.slice(-10);
    const W=640,H=250,L=54,R=14,T=20,B=55;
    const iw=W-L-R, ih=H-T-B;
    const maxSec = Math.max(...data.map(x=>x.seconds),60);
    const topSec = Math.ceil(maxSec/60)*60;
    const x = i => data.length===1 ? L+iw/2 : L + iw*i/(data.length-1);
    const y = sec => T + ih - (sec/topSec)*ih;
    const ticks=[0,topSec/2,topSec];
    const grid=ticks.map(v=>`<line x1="${L}" y1="${y(v)}" x2="${W-R}" y2="${y(v)}" stroke="#e5e7eb"/><text x="${L-8}" y="${y(v)+4}" text-anchor="end" font-size="11" fill="#6b7280">${esc(formatDuration(v))}</text>`).join('');
    const line=data.map((d,i)=>`${x(i)},${y(d.seconds)}`).join(' ');
    const pts=data.map((d,i)=>{const dt=new Date(d.finishedAt);return `<circle cx="${x(i)}" cy="${y(d.seconds)}" r="5" fill="#111827"><title>${esc(formatDateTime(dt))}  ${esc(formatDuration(d.seconds))}</title></circle>`}).join('');
    const labels=data.map((d,i)=>{const dt=new Date(d.finishedAt);const show=data.length<=6||i%2===0||i===data.length-1;return show?`<text x="${x(i)}" y="${H-27}" text-anchor="middle" font-size="10" fill="#6b7280">${esc(`${dt.getMonth()+1}/${dt.getDate()}`)}</text><text x="${x(i)}" y="${H-14}" text-anchor="middle" font-size="9" fill="#9ca3af">${esc(`${pad(dt.getHours())}:${pad(dt.getMinutes())}`)}</text>`:''}).join('');
    return `<svg class="history-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="クリア時間の履歴グラフ">
      ${grid}<line x1="${L}" y1="${T}" x2="${L}" y2="${T+ih}" stroke="#9ca3af"/><line x1="${L}" y1="${T+ih}" x2="${W-R}" y2="${T+ih}" stroke="#9ca3af"/>
      ${data.length>1?`<polyline points="${line}" fill="none" stroke="#111827" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`:''}${pts}${labels}
      <text x="15" y="${T+ih/2}" transform="rotate(-90 15 ${T+ih/2})" text-anchor="middle" font-size="11" fill="#6b7280">クリア時間</text>
      <text x="${L+iw/2}" y="${H-1}" text-anchor="middle" font-size="11" fill="#6b7280">日時</text>
    </svg>`;
  }
  function historyHtml(){
    const items=loadHistory();
    const recent=items.slice(-5).reverse().map(x=>`<div>${esc(formatDateTime(new Date(x.finishedAt)))}　<strong>${esc(formatDuration(x.seconds))}</strong></div>`).join('');
    return `${chartSvg(items)}<div class="history-caption">直近10回｜横軸：日時　縦軸：クリア時間</div>${recent?`<div class="history-recent">最近の記録<br>${recent}</div>`:''}`;
  }
  function renderHistoryDrawer(){
    const d=document.getElementById('historyDrawer');
    if(!d) return;
    d.innerHTML=`<div class="history-head"><b>クリア時間の記録</b><span style="font-size:11px;color:#9ca3af">この端末に保存</span></div>${historyHtml()}`;
  }
  function appendFinishHistory(){
    const finishCard=app.querySelector('.finish');
    if(!finishCard) return;
    let area=finishCard.querySelector('.finish-history');
    if(!area){
      area=document.createElement('div');
      area.className='finish-history';
      const retry=finishCard.querySelector('button.primary');
      if(retry) retry.insertAdjacentElement('beforebegin',area); else finishCard.appendChild(area);
    }
    area.innerHTML=`<h3>📈 クリア時間</h3>${historyHtml()}`;
  }

  // 各ステップ表示後に10問目以降の応援を更新。
  const cardBeforeCheer = card;
  card = function(x){
    const result = cardBeforeCheer(x);
    updateCheer();
    return result;
  };

  // 完走時：タイマー停止 → localStorageへ1回だけ保存 → お祝い + グラフ。
  const finishBeforeCheer = finish;
  finish = function(){
    if(!sessionFinishedAt) sessionFinishedAt=Date.now();
    const seconds=(sessionFinishedAt-sessionStart)/1000;
    recordCompletion(seconds);
    updateTimer();
    finishBeforeCheer();
    // 問題12の写真背景が残らないようにする。
    app.style.backgroundImage=''; app.style.backgroundSize=''; app.style.backgroundPosition=''; app.style.backgroundRepeat='';
    app.style.borderRadius=''; app.style.padding=''; app.style.marginTop=''; app.style.boxShadow=''; app.style.overflow='';
    showFinishCheer();
    appendFinishHistory();
    renderHistoryDrawer();
  };

  // 再挑戦では履歴は残し、今回のタイマーだけリセット。
  const restartBeforeCheer = restart;
  restart = function(){
    sessionStart=Date.now();
    sessionFinishedAt=0;
    sessionRecorded=false;
    const el=document.getElementById('pixelCheer'); if(el)el.classList.remove('show');
    restartBeforeCheer();
    document.getElementById('sessionDate') && (document.getElementById('sessionDate').textContent=formatDate(new Date()));
    updateTimer();
  };

  injectStyles();
  ensureCheer();
  document.addEventListener('DOMContentLoaded',()=>{
    ensureSessionUi();
    startTimerLoop();
    updateCheer();
  });
})();
