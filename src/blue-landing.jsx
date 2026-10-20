import React,{useEffect,useRef,useState} from 'react';
// Letter-bending treatment adapted from Codrops OnScrollLetterAnimations (MIT).
// Native scrolling replaces LocomotiveScroll; no remote assets or runtime.
export function BlueLanding({onStart,onPrepare}){
 const root=useRef(null),[paused,setPaused]=useState(false);
 useEffect(()=>{
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  let timer=0,last=scrollY;
  const reset=()=>root.current?.querySelectorAll('.editorial-letter').forEach(c=>c.style.transform='none');
  const move=()=>{
   if(paused||media.matches)return;
   const distance=Math.max(-30,Math.min(30,scrollY-last));last=scrollY;
   root.current?.querySelectorAll('.editorial-word').forEach(word=>{
    const chars=[...word.children],half=Math.ceil(chars.length/2);
    chars.forEach((c,j)=>{const factor=j<half?j:half-Math.abs(Math.floor(chars.length/2)-j)-1;c.style.transform=`translate3d(0,${factor*distance*-.2}px,0)`});
   });
   clearTimeout(timer);timer=setTimeout(reset,120);
  };
  const change=()=>{last=scrollY;reset()};
  window.addEventListener('scroll',move,{passive:true});media.addEventListener('change',change);
  return()=>{window.removeEventListener('scroll',move);media.removeEventListener('change',change);clearTimeout(timer);reset()};
 },[paused]);
 const word=text=><span className="editorial-word" aria-hidden="true">{[...text].map((c,i)=><span className="editorial-letter" key={i}>{c}</span>)}</span>;
 return <div ref={root} className={'warm-landing editorial-landing'+(paused?' motion-paused':'')}>
  <div className="editorial-topline"><span>個人探索與職涯對話</span><span>PERSONALITY PORTAL</span></div>
  <div className="warm-hero editorial-hero">
   <section className="warm-copy">
    <p className="warm-label">每個選擇，都有你的理由。</p>
    <h1 aria-label="從日常的選擇，更了解自己。">{word('從日常的選擇，')}<br/>{word('更了解自己。')}</h1>
    <p className="warm-intro">不急著把自己放進某一種類型。<br/>從你重視的事、做事的方式，<br/>找到下一段對話的起點。</p>
    <button className="primary" onClick={onStart}>開始我的評測 <span aria-hidden="true">↗</span></button>
    <p className="warm-caption">使用邀請者提供的評測代碼開始。</p>
   </section>
   <aside className="editorial-visual">
    <div className="paper-composition" aria-hidden="true">
     <div className="paper-sheet sheet-back"><span>經驗</span><i/></div>
     <div className="paper-sheet sheet-middle"><span>價值</span><i/></div>
     <div className="paper-sheet sheet-front"><span>選擇</span><i/></div>
     <div className="paper-axis"/><span className="paper-index">01 / 從你開始</span>
    </div>
    <div className="editorial-caption"><span>不同的面向，慢慢拼成你。</span><button className="motion-toggle" aria-pressed={paused} onClick={()=>setPaused(!paused)}>{paused?'播放動態':'暫停動態'}</button></div>
   </aside>
  </div>
  <section className="editorial-notes" aria-label="作答前須知">
   <h2>留一點時間，<br/>聽自己的答案。</h2>
   <div><span>01</span><h3>照平常的自己回答</h3><p>沒有標準答案。送出前，可以回頭修改；沒有類似經驗，也能如實選擇假設情境。</p></div>
   <div><span>02</span><h3>讓理解接著發生</h3><p>完成後，由邀請者核對與整理回饋。這份評測是對話的起點，不是對人的定論。</p></div>
  </section>
  <footer><span>PERSONALITY PORTAL</span><button onClick={onPrepare}>作答與資料使用說明 ↗</button></footer>
 </div>;
}
