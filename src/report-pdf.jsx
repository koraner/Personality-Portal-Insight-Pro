import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {ReportPreview} from './report-preview.jsx';
import {SHORT_HEADINGS} from './unified-report.js';

// Render one A4 page at a time: long reports never depend on a giant canvas.
export async function downloadAnalysisPdf({reports,parts,evidence,demo,onProgress=()=>{}}){
 if(!window.html2pdf)throw Error('PDF 工具未載入，請重新開啟網頁。');
 await document.fonts.ready;
 const host=document.createElement('div');host.className='pdf-export-host';document.body.append(host);
 try{
  const source=document.createElement('div');source.className='pdf-source';
  source.innerHTML=renderToStaticMarkup(<>
   <h1>個人探索與對話報告</h1><p>{demo?'虛構示範資料，只供練習。':'私人分析資料，請確認分享對象。'} 本檔包含完整分析、精簡回饋與作答證據，不代表已對外開放。</p>
   {Object.entries(reports).filter(([,r])=>r?.text?.trim()).map(([id,r])=><React.Fragment key={id}><h2>{r.label||id}</h2><p>{r.reviewed?'已人工核對；假說仍須實際驗證。':'待人工核對草稿。'}</p><ReportPreview text={r.text}/></React.Fragment>)}
   <h2>精簡回饋</h2><p>與完整分析一起核對；不取代完整分析。</p>{SHORT_HEADINGS.map((h,i)=><React.Fragment key={h}><h3>{h}</h3><p>{parts[i]||'尚未提供，待核對。'}</p></React.Fragment>)}
   <h2>作答證據</h2><p>本人自述與假設選擇分開解讀，不以固定選項斷定能力。</p><ReportPreview text={evidence||'未提供作答資料，不補猜。'}/>
  </>);host.append(source);
  const blocks=[];
  const flatten=node=>{if(node.classList?.contains('specialist-report'))[...node.children].forEach(flatten);else if(/^(UL|OL)$/.test(node.tagName)){[...node.children].forEach((li,i)=>{const p=document.createElement('p');p.textContent=(node.tagName==='OL'?(i+1)+'. ':'• ')+li.textContent;blocks.push(p)})}else blocks.push(node.cloneNode(true))};
  [...source.children].forEach(flatten);source.remove();
  const pages=[];let body;
  function newPage(){const sheet=document.createElement('section');sheet.className='pdf-sheet';body=document.createElement('div');body.className='pdf-body';sheet.append(body);const footer=document.createElement('footer');footer.className='pdf-footer';sheet.append(footer);host.append(sheet);pages.push(sheet)}
  const fits=()=>body.scrollHeight<=body.clientHeight+1;
  function place(block){
   body.append(block);if(fits()){
    // Keep headings with room for the following paragraph, not stranded at page bottoms.
    if(/^H[1-6]$/.test(block.tagName)&&body.childNodes.length>1&&body.clientHeight-(block.getBoundingClientRect().bottom-body.getBoundingClientRect().top)<100){block.remove();newPage();body.append(block)}
    return;
   }
   block.remove();
   if(body.childNodes.length){newPage();body.append(block);if(fits())return;block.remove()}
   // Oversized tables are repeated-header row groups; exceptionally long rows fall back to readable text.
   const table=block.matches?.('table')?block:block.querySelector?.('table');
   if(table){
    const heads=[...table.querySelectorAll('thead th')].map(x=>x.textContent);
    for(const row of table.querySelectorAll('tbody tr')){const p=document.createElement('p');p.textContent=[...row.children].map((td,i)=>(heads[i]||'欄位')+'：'+td.textContent).join('；');place(p)}
    return;
   }
   // Binary-fit long paragraphs rather than crop text or truncate the export.
   let chars=Array.from(block.textContent||'');
   while(chars.length){const p=document.createElement('p');body.append(p);let lo=1,hi=chars.length,best=0;
    while(lo<=hi){const mid=(lo+hi)>>1;p.textContent=chars.slice(0,mid).join('');if(fits()){best=mid;lo=mid+1}else hi=mid-1}
    if(!best){p.remove();if(!body.childNodes.length)throw Error('PDF 分頁空間不足，請下載文字保留內容。');newPage();continue}
    p.textContent=chars.slice(0,best).join('');chars=chars.slice(best);if(chars.length)newPage();
   }
  }
  newPage();blocks.forEach(place);
  pages.forEach((sheet,i)=>sheet.querySelector('footer').textContent=`Personality Portal · ${demo?'虛構示範':'私人報告'}　｜　${i+1} / ${pages.length}`);
  let pdf;
  for(let i=0;i<pages.length;i++){
   onProgress(`正在產生 PDF：${i+1} / ${pages.length} 頁`);
   const worker=window.html2pdf().set({margin:0,image:{type:'jpeg',quality:.94},html2canvas:{scale:1.5,backgroundColor:'#ffffff',logging:false,scrollX:0,scrollY:0},jsPDF:{unit:'mm',format:'a4',orientation:'portrait'},pagebreak:{mode:[]}}).from(pages[i]).toCanvas();
   const canvas=await worker.get('canvas');
   if(!pdf){pdf=await worker.toPdf().get('pdf');while(pdf.getNumberOfPages()>1)pdf.deletePage(pdf.getNumberOfPages())}
   else{pdf.addPage();pdf.addImage(canvas.toDataURL('image/jpeg',.94),'JPEG',0,0,210,297)}
   canvas.width=1;canvas.height=1;
   await new Promise(resolve=>setTimeout(resolve,0));
  }
  if(!pdf)throw Error('沒有可匯出的報告。');
  pdf.setProperties({title:'個人探索與對話報告',subject:'完整分析、精簡回饋與作答證據'});
  await pdf.save('personality-analysis'+(demo?'-demo':'')+'.pdf',{returnPromise:true});
  return pages.length;
 }finally{host.remove()}
}
