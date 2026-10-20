export const SHORT_HEADINGS=['你的處事方式','可以嘗試的小行動','留給你想一想'];
export function combinedPrompt(text){
 return text.replace('本次完整分析不要以三段 JSON 收尾。','完整分析本體不縮成三段；完成全文後，另附下述精簡回饋區塊。')+`

【一次交付：完整分析與精簡回饋】
一次回答完成兩件事，不要求使用者再問第二次：
1. 先輸出上方要求的完整 Markdown 分析，保留全部適用章節與深度。
2. 完成完整分析後，只從剛才完整分析的有據洞察提煉三段回饋，每段 1–2 句，不新增結論、不改用原始選項重做摘要。具體、溫暖但不迎合；保留不確定性，不出現姓名、完整生日、私人備忘、診斷或適合度排名。
3. 將精簡回饋放在全文最後，嚴格使用下列標記與有效 JSON（不要在標記內放說明）。標記前是完整報告，不要包在 JSON 裡。若需分批，先完整寫完所有報告，再在最後一批附這個區塊。
<!-- PORTAL_FEEDBACK_START -->
{"你的處事方式":"從完整分析提煉","可以嘗試的小行動":"從完整分析提煉","留給你想一想":"從完整分析提煉"}
<!-- PORTAL_FEEDBACK_END -->
這是一份待人工核對的草稿。程式不會因貼回答案而自動對外開放。
`;
}
export function parseCombinedAnswer(value){
 let raw=String(value||'');
 const start='<!-- PORTAL_FEEDBACK_START -->',end='<!-- PORTAL_FEEDBACK_END -->';
 if(raw.includes(start)&&/^```(?:markdown|md|text)?\s*\n/.test(raw.trim())&&raw.trim().endsWith('```'))raw=raw.trim().replace(/^```(?:markdown|md|text)?\s*\n/,'').replace(/\n```\s*$/,'');
 const a=raw.indexOf(start),b=raw.indexOf(end);
 if(a<0&&b<0)return {report:raw,parts:null};
 if(a<0||b<a||raw.indexOf(start,a+start.length)>=0||raw.slice(b+end.length).trim())throw Error('精簡回饋標記不完整或位置不正確；原回答仍保留，請修正後再載入。');
 const report=raw.slice(0,a).trim();
 const json=raw.slice(a+start.length,b).trim().replace(/^```(?:json)?\s*/,'').replace(/\s*```$/,'');
 let parsed;try{parsed=JSON.parse(json)}catch{throw Error('精簡回饋 JSON 無法讀取；原回答仍保留，請修正後再載入。')}
 const parts=SHORT_HEADINGS.map(k=>parsed?.[k]);
 if(!report||report.length>40000||!parts.every(x=>typeof x==='string'&&x.trim()&&x.length<=1200))throw Error('請提供完整報告與三段回饋；完整報告上限 40,000 字，每段回饋上限 1,200 字。');
 return {report,parts};
}
export function plainNote({evidence='',reports={},parts=[],demo=false}){
 const headings=SHORT_HEADINGS.map((h,i)=>h+'\n'+(parts[i]||'尚未提供，待核對。')).join('\n\n');
 const reportText=Object.entries(reports).filter(([,r])=>r?.text?.trim()).map(([id,r])=>(r.label||id)+'\n'+(r.reviewed?'已人工核對；仍須區分假說與事實。':'待人工核對草稿。')+'\n\n'+r.text).join('\n\n────────────────\n\n');
 return `${demo?'虛構示範｜僅供練習':'評測與對話整理｜私人筆記'}\n\n完整分析\n\n${reportText||'尚未貼回完整分析。'}\n\n精簡回饋（人工核對後才可對外開放）\n\n${headings}\n\n作答證據\n\n${evidence||'未提供，不補猜。'}\n\n待確認與下一步\n\n區分本人自述、假設選擇與 AI 解讀；未確認的客戶 ID、事件日期和進度不補填。不自動建立任務或更新 CRM。`;
}
