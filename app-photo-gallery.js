// 三項比（問題11・12）：背景1枚表示ではなく、写真を小さく並べて全体像を見せる。
(() => {
  const style=document.createElement('style');
  style.id='triple-photo-gallery-style';
  style.textContent=`
    .triple-photo-gallery{display:grid;grid-template-columns:repeat(var(--photo-count,3),minmax(0,1fr));gap:8px;margin:14px 0 8px;padding:8px;background:rgba(255,255,255,.94);border:1px solid #e5e7eb;border-radius:16px;box-shadow:0 5px 18px rgba(0,0,0,.08)}
    .triple-photo-thumb{margin:0;min-width:0;border-radius:11px;overflow:hidden;background:#eef2f7;border:1px solid #d8dee8;aspect-ratio:4/3;display:flex;align-items:center;justify-content:center}
    .triple-photo-thumb img{width:100%;height:100%;object-fit:contain;display:block;background:#eef2f7}
    @media(max-width:620px){.triple-photo-gallery{grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;padding:6px}.triple-photo-thumb{aspect-ratio:4/3}}
  `;
  document.head.appendChild(style);

  const cardBeforePhotoGallery=card;
  card=function(x){
    const result=cardBeforePhotoGallery(x);
    const p=problems[pIndex];

    const old=app.querySelector('.triple-photo-gallery');
    if(old) old.remove();

    if(p&&p.type==='triple'&&Array.isArray(window.TRIPLE_BG_PHOTOS)&&window.TRIPLE_BG_PHOTOS.length){
      // 旧方式の大きな背景を完全に解除。
      app.style.backgroundImage='none';
      app.style.backgroundSize='';
      app.style.backgroundPosition='';
      app.style.backgroundRepeat='';
      app.style.borderRadius='';
      app.style.padding='';
      app.style.marginTop='';
      app.style.boxShadow='';
      app.style.overflow='';

      const section=app.querySelector('.card');
      if(section){
        section.style.backgroundImage='none';
        section.style.backgroundColor='#fff';

        const gallery=document.createElement('div');
        gallery.className='triple-photo-gallery';
        const photos=window.TRIPLE_BG_PHOTOS.slice(0,4);
        gallery.style.setProperty('--photo-count',String(Math.min(4,photos.length)));
        gallery.innerHTML=photos.map((item,i)=>`<figure class="triple-photo-thumb"><img src="${item.data}" alt="ディズニーの思い出写真 ${i+1}"></figure>`).join('');
        app.insertBefore(gallery,section);
      }
    }
    return result;
  };
})();
