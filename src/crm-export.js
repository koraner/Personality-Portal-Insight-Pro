// Local generation only; never writes to the vault or CRM service.
const quote=value=>value==null||value===''?'null':JSON.stringify(String(value));
const plain=value=>String(value||'').replace(/[\r\n\u0000-\u001f]+/g,' ').trim();
const safeFile=value=>plain(value).replace(/[<>:"/\\|?*]/g,'_').replace(/[. ]+$/,'').slice(0,60)||'受測者';
function stableId(value){let h=2166136261;for(const c of value)h=Math.imul(h^c.charCodeAt(0),16777619);return (h>>>0).toString(16).padStart(8,'0')}
export function makeCrmMarkdown({candidate={},answers={},evidence='',reports={},purpose='explore',demo=false,recordCode='',customerId='',personLink='',eventDate=''}){
 const date=plain(eventDate),id=plain(customerId),link=plain(personLink);
 if(date&&(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date+'T00:00:00Z'))||new Date(date+'T00:00:00Z').toISOString().slice(0,10)!==date))throw Error('事件日期無效；不知道日期時請留空。');
 if(link&&!/^\[\[🪴 客戶\/[^[\]|#\\\r\n]+\]\]$/.test(link))throw Error('人物連結請使用 [[🪴 客戶/既有人物檔名]]；尚未確認請留空。');
 if(link.includes('/../')||link.includes('/./'))throw Error('請填寫既有人物的有效連結。');
 const title=demo?'虛構示範受測者':plain(candidate.name)||'受測者（待核對）';
 const ref='PP-'+stableId(JSON.stringify([demo?'demo':recordCode||answers,purpose]));
 const folder=demo?'練習與覆盤':'📥 收件匣 (Inbox)';
 const complete=Object.entries(reports).filter(([,r])=>r?.text?.trim());
 const meta={
  資料類型:demo?'模擬練習':'評測整理草稿',CRM版本:'2.0',來源草稿ID:ref,事件ID:null,共同事件ID:null,
  客戶ID:demo?null:id||null,人物:demo?null:link||null,事件日期:demo?null:date||null,
  事件狀態:'待確認',資料來源:'Personality Portal・問卷與三個處事經驗問題',解讀用途:purpose,
  完成步驟:[],完成確認:false,下步是否已約定:null,下步約定日期:null,下步約定時間:null,
  建議存放位置:folder,模擬資料:demo
 };
 const yaml=Object.entries(meta).map(([k,v])=>`${k}: ${Array.isArray(v)?'[]':typeof v==='boolean'?String(v):quote(v)}`).join('\n');
 const reportText=complete.length?complete.map(([key,r])=>`### ${plain(r.label||key)}\n\n核對狀態：${r.reviewed?'已人工核對（仍不是客觀事實）':'待人工核對'}；用途：${plain(r.purpose||purpose)}。\n\n${r.text}\n`).join('\n---\n\n'):'尚未貼回完整報告；不以作答分數代寫 AI 結論。';
 const text=`---\n${yaml}\n---\n\n# ${title}｜評測與對話整理\n\n> ${demo?'虛構測試資料，只供練習；不可併入真人主檔或正式接觸紀錄。':'私人匯出草稿，不代表正式接觸事件、成交／增員進度或已約定事項。'}\n> 建議存放：${folder}。本檔只供人工核對／CRM AI 整理，未自動寫入 Obsidian 或 CRM。\n> 不另帶入完整生日、私人 Memo 或外部 AI 提示詞；完整報告原文若含個資，請在匯出前自行核對。來源草稿 ID 僅供辨識重複匯出，不是 CRM 事件 ID。\n\n## 作答證據（本人自述／假設選擇）\n\n${evidence||'未提供作答證據，不補猜。'}\n\n## 完整分析（AI 解讀／待驗證假設）\n\n保留原文，不改寫成已證實的人物特質。各份報告的核對狀態分開標示。\n\n${reportText}\n\n## 待確認\n\n- ${demo?'此為模擬資料，不建立真人關聯。':id&&link?'已手動填入既有人物關聯；匯入前仍須確認 ID 與人物檔一致。':'客戶 ID／既有人物連結尚未完整確認；不可僅憑姓名自動建人或合併。'}\n- ${!demo&&date?'事件日期為手動填入；請確認是實際發生日期。':'事件日期未確認；不得以匯出當天代替。'}\n- 問卷自述、假設選擇與 AI 解讀須分開核實；本報告不直接決定人事、客戶分級或進度。\n\n## 下一步與待辦\n\n尚未約定。不自動建立任務、完成步驟或跟進日期；需要時由你核對後另行建立。\n\n## 三段回饋\n\n請以程式中另外核對的三段回饋為準；本次只匯出完整報告，不將未核對的短版混入 CRM。\n`;
 return {text,filename:`${demo?'練習':date||'待確認日期'}_${safeFile(title)}_評測整理_${ref}.md`,folder};
}
