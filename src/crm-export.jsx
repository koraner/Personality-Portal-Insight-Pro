import React,{useState} from 'react';
import {createPrompt,copyText} from './integration.jsx';
import {makeCrmMarkdown} from './crm-export.js';
import {plainNote} from './unified-report.js';
import {downloadAnalysisPdf} from './report-pdf.jsx';
export function CrmExport({answers,candidate,analysis,reports,purpose,demo,recordCode,showToast,parts=[]}){
 const [pdfBusy,setPdfBusy]=useState(false),[status,setStatus]=useState('');
 const evidence=createPrompt({answers,candidate,analysis,purpose,evidenceOnly:true}).split('【作答摘要】\n').slice(1).join('【作答摘要】\n');
 const note=plainNote({evidence,reports,parts,demo});
 function download(text,filename,type='text/plain'){const url=URL.createObjectURL(new Blob([text],{type:type+';charset=utf-8'})),a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
 async function pdf(){if(pdfBusy)return;setPdfBusy(true);setStatus('正在整理完整報告…');try{const pages=await downloadAnalysisPdf({reports,parts,evidence,demo,onProgress:setStatus});setStatus('PDF 已下載，共 '+pages+' 頁。');showToast('完整 PDF 已下載','success')}catch(e){setStatus('PDF 產生失敗；內容仍保留，可先下載文字。');showToast(e.message,'error')}finally{setPdfBusy(false)}}
 return <section className="crm-export"><div className="crm-export-title"><div><h3>筆記文字與完整 PDF</h3><p>複製到 Obsidian 即可，不需要額外填欄位。包含完整分析、精簡回饋與作答證據。</p></div></div>
  <div className="export-actions"><button className="primary" onClick={()=>copyText(note,showToast)}>複製筆記文字</button><button className="secondary" disabled={pdfBusy||!Object.values(reports).some(r=>r.text?.trim())} onClick={pdf}>{pdfBusy?'正在製作 PDF…':'下載完整 PDF'}</button><button className="secondary" onClick={()=>download(note,'personality-notes.txt')}>下載文字 TXT</button></div>
  <label>Obsidian 筆記文字<textarea aria-label="Obsidian 筆記文字" readOnly value={note}/></label>
  <p role="status" className="small">{status||'文字與 PDF 都在本機產生，不會寫進 Obsidian、CRM 或自動對外發布。PDF 為逐頁影像式排版，可閱讀及列印，文字不支援搜尋／選取。'}</p>
  <details><summary>保留原有 Markdown 匯出（進階）</summary><p className="small">仍可下載 CRM 2.0 草稿；未確認的客戶 ID 與日期留空。示範與真人資料分開。</p><button className="secondary" onClick={()=>{try{const md=makeCrmMarkdown({answers,candidate,reports,purpose,demo,recordCode,evidence});download(md.text,md.filename,'text/markdown')}catch(e){showToast(e.message,'error')}}}>下載 Obsidian / CRM .md</button></details>
 </section>;
}
