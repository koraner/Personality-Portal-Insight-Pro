module.exports=function(source){
 // Static mode uses a per-browser user-chosen password with no distributed default.
 // Hosted mode instead calls server-side login; the published GitHub Pages artifact disables all backend calls.
 source=source.replace(/\r\n/g,'\n');
 function replace(from,to){if(!source.includes(from))throw Error('Missing integration anchor: '+from.slice(0,110));source=source.replace(from,to)}
 replace("const counts={disc:","const counts={experience:[partial.rows?.filter(a=>a.reason!==null).length||0,3],disc:");
 // Extend the retained configurator; all eight original module controls stay intact.
 replace("lifeVision: true });\n            const [code", "lifeVision: true, experience: true });\n            const [code");
 replace("const [purpose,setPurpose]=useState('general');","const [purpose,setPurpose]=useState('explore');\n            const [shareLink,setShareLink]=useState(''),[generating,setGenerating]=useState(false);");
 replace('const generate = () => {','const generate = async () => {\n                if(generating)return;');
 replace('const str = safeEncode(payload); setCode(str);',`const str = safeEncode(payload); setCode(str);
                try {setGenerating(true);if(HOSTED){const saved=await api('configs','POST',{config:{...payload,encryption:{enabled:false}}});setShareLink(location.origin+location.pathname+'#quiz='+saved.id)}else{setShareLink(location.href.split('#')[0]+'#config='+encodeURIComponent(str))}}catch(e){showToast('離線設定碼已生成，但分享連結建立失敗：'+e.message,'error')}finally{setGenerating(false)}`);
 replace("{ id: 'lifeVision', label: '生涯願景', sub: '10年後的生活期許與目標' }", "{ id: 'lifeVision', label: '生涯願景', sub: '10年後的生活期許與目標' }, { id: 'experience', label: '經驗與處事方式', sub: '新增：三個主題，各選場景、做法與考量' }");
 replace('<option value="general">通用</option><option value="business">業務</option>','<option value="explore">一般探索</option><option value="general">一般招募</option><option value="business">保險招募</option>');
 replace('需密碼解析</label>','離線結果代碼需密碼解析（分享連結使用伺服器保存）</label>');
 replace('<button onClick={generate} className=', '<button disabled={generating} onClick={generate} className=');
 replace('產生 Config Code</button>','{generating?\'正在建立…\':\'產生設定碼與分享連結\'}</button>\n                {shareLink&&<section className="panel"><h3>可重複分享的問卷連結</h3><p>每組設定固定不變；改選模組後會產生新連結。</p><input aria-label="問卷分享連結" readOnly value={shareLink}/><button className="primary" onClick={()=>copyText(shareLink,showToast)}>複製問卷連結</button><a className="secondary" href={shareLink} target="_blank" rel="noreferrer">開啟問卷</a><p className="small muted">本次 {activeModuleCount(modules)} 個模組 · 規劃預估 {estimate(Object.keys(modules).filter(k=>modules[k]))} 分鐘（非實測平均）。</p></section>}');
 replace('function QuizConfigurator(',"const activeModuleCount=m=>Object.values(m).filter(Boolean).length;\n        function QuizConfigurator(");
 // Privacy applies to every retained advanced prompt, not only the new guided flow.
 const promptStart=source.indexOf('            const getSummaryPrompt =');
 const promptEnd=source.indexOf('            const colorStyles =',promptStart);
 if(promptStart<0||promptEnd<0)throw Error('Prompt boundaries');
 let prompts=source.slice(promptStart,promptEnd).replaceAll('${candidateInfo.name}','受測者 A');
 prompts=prompts.replace('const aiButtons=groups[perspective];','const aiButtons=groups[perspective];');
 const tagStart=prompts.indexOf('            const taggedPrompt=');
 const tagEnd=prompts.indexOf('            const makePack=',tagStart);
 prompts=prompts.slice(0,tagStart)+`            const taggedPrompt=(prompt,view=perspective)=>createPrompt({answers:sourceAnswers,candidate:candidateInfo,analysis:candidateDataStr,purpose:view,focus:prompt.split('\\n')[0]});
`+prompts.slice(tagEnd);
 source=source.slice(0,promptStart)+prompts+source.slice(promptEnd);
 replace('function ResultDashboard({ answers: sourceAnswers, config, candidateInfo, showToast, duration })','function ResultDashboard({ answers: sourceAnswers, config, candidateInfo, showToast, duration, initialReport=\'\' })');
 replace("const [aiReportContent, setAI] = useState('');","const [aiReportContent, setAI] = useState(initialReport);\n            useEffect(()=>{if(initialReport){setAI(initialReport);setReviewState('AI 解讀草稿')}},[initialReport]);");
 replace("const candidateDataStr=useMemo(()=>buildAnalysisData(sourceAnswers,reliabilityResults)","const candidateDataStr=useMemo(()=>buildAnalysisData(sourceAnswers,reliabilityResults)+'\\n'+experienceText(sourceAnswers.experience)");
 // Main application: preserve hidden workspace, legacy decoding, quiz engine and original exports.
 replace("const [candidateInfo, setCandidateInfo] = useState({ name: '', dob: '' });","const [candidateInfo, setCandidateInfo] = useState({ name: '', dob: '', gender:'' });");
 replace("const [quizDuration, setQuizDuration] = useState(null);",`const [quizDuration, setQuizDuration] = useState(null);
            const [serverResult,setServerResult]=useState(null),[recordCode,setRecordCode]=useState(''),[lookupToken,setLookupToken]=useState(''),[invitation,setInvitation]=useState(''),[externalReport,setExternalReport]=useState('');
            const submissionId=useRef('');
            const openStored=async code=>{try{const r=await api('results/'+encodeURIComponent(code));submissionId.current='';setInvitation('');setRecordCode(r.code);setServerResult(r);setQuizConfig(r.payload.config);setCandidateInfo(r.payload.candidate);setAnswers(r.payload.answers);setExternalReport('');setView('result')}catch(e){showToast(e.message,'error')}};
            useEffect(()=>{const route=async()=>{const fragment=location.hash.slice(1);if(fragment.startsWith('feedback=')){setLookupToken(fragment.slice(9));setView('feedback');return}let cfg,code;if(fragment.startsWith('quiz=')){const id=fragment.slice(5);cfg=(await api('configs/'+encodeURIComponent(id))).config;setInvitation(id);code='invite:'+id}else if(fragment.startsWith('config=')){code=decodeURIComponent(fragment.slice(7));cfg=safeDecode(code)}if(cfg?.modules?.length&&cfg.modules.every(m=>MODULES_MAP.includes(m))){setQuizConfig(cfg);setActiveConfigCode(code);setCandidateInfo({name:'',dob:'',gender:''});setConsent(false);setAnswers({});setServerResult(null);setRecordCode('');submissionId.current='';setView('candidate-info')}};route().catch(e=>showToast(e.message,'error'));window.addEventListener('hashchange',route);return()=>window.removeEventListener('hashchange',route)},[]);
            const persistPayload=async payload=>{if(!submissionId.current)submissionId.current=Array.from(crypto.getRandomValues(new Uint8Array(24)),x=>x.toString(16).padStart(2,'0')).join('');return await api('results','POST',{payload,invitation,legacyConfigCode:activeConfigCode,requestId:submissionId.current})};
`);
 replace("setDecodeBusy(true);try {", "setDecodeBusy(true);try {\n                    if(/^PP-[A-Z0-9]+$/i.test(inputCode.trim())){if(!isGodMode)throw Error('請先解鎖分析師工作台');await openStored(inputCode.trim().toUpperCase());return;}setRecordCode('');setServerResult(null);setExternalReport('');");
 replace("setCandidateInfo({name:'',dob:''});setConsent", "setCandidateInfo({name:'',dob:'',gender:''});setConsent");
 replace("setActiveConfigCode(inputCode.trim());setQuizConfig(data);", "submissionId.current='';setInvitation('');setActiveConfigCode(inputCode.trim());setQuizConfig(data);");
 replace("if(data?.answers) {", "if(data?.answers) {\n                        submissionId.current='';setInvitation('');");
 replace("e.preventDefault();unlockLocalWorkspace(pin)", "e.preventDefault();if(HOSTED){api('login','POST',{pin}).then(()=>{setIsGodMode(true);setUnlockOpen(false);setView('workspace');setInputCode('')}).catch(e=>setPinError(e.message));return;}unlockLocalWorkspace(pin)");
 replace("setIsGodMode(false);setAnswers({});setInputCode('');setView('landing');", "if(HOSTED)api('logout','POST',{}).catch(()=>{});setIsGodMode(false);setAnswers({});setInputCode('');setRecordCode('');setView('landing');");
 replace('<div className="work">','<div className="work">{view===\'feedback\'&&<FeedbackPage token={lookupToken}/> }');
 replace('<div className="empty"><h3>先看資料，再形成判斷。</h3>',"{HOSTED&&<ServerRecords onOpen={openStored} showToast={showToast}/>}<div className=\"empty\"><h3>先看資料，再形成判斷。</h3>");
 replace('<p className="small muted" style={{marginTop:22}}>已收到評測代碼？從這裡開始。</p>', '<p className="small muted" style={{marginTop:22}}>完成後由邀請者審閱回饋，再開放查看。已收到評測連結？直接點開即可。</p>');
 replace('<strong>{quizConfig.modules.length} 個模組</strong>','<strong>{quizConfig.modules.length} 個模組 · 規劃預估 {estimate(quizConfig.modules)} 分鐘</strong>');
 replace('<label className="check"><input type="checkbox" checked={consent}', '<label htmlFor="gender">你的性別（本人填寫）</label><input id="gender" type="text" maxLength={40} value={candidateInfo.gender||\'\'} onChange={e=>setCandidateInfo({...candidateInfo,gender:e.target.value})}/><details><summary>開始前的資料說明</summary><p>姓名與生日供邀請者核對和備忘；你提供的作答與作答歷程會交給邀請者。伺服器模式送出後保存資料；離線模式由你交付結果代碼。給外部 AI 的資料包含年齡與本人填寫的性別，不包含姓名或完整生日。邀請者會先審閱回饋再開放。</p><p>作答歷程記錄題目互動與顯示區間、前景與離開頁面時間、第一次與最後選擇及修改紀錄；只供了解與追問，不自動扣分、排名或判定誠實。</p></details><label className="check"><input type="checkbox" checked={consent}');
 replace('我了解評測不是心理診斷；逐題作答草稿只在此瀏覽器保存，不會上傳；共用裝置請完成或清除草稿，完成後請手動交付代碼。','我已閱讀資料說明，了解結果由邀請者審閱；作答中草稿保存在此瀏覽器，共用裝置請完成或清除。');
 replace("if(!consent||!candidateInfo.name||!candidateInfo.dob)","if(!consent||!candidateInfo.name.trim()||!candidateInfo.dob||!candidateInfo.gender?.trim())");
 replace("setView('quiz');}}>開始測驗", "if(new Date(candidateInfo.dob+'T00:00:00')>new Date()){showToast('請確認出生日期','error');return;}setView('quiz');}}>開始測驗");
 replace('const resultCode=await createResultCode({config:cleanConfig,answers:finalAnswers,candidate:candidateInfo,completedAt:Date.now()},password);',`const payload={config:cleanConfig,answers:finalAnswers,candidate:candidateInfo,completedAt:Date.now()};
                            let resultCode;if(HOSTED){const r=await persistPayload(payload);setServerResult(r);setRecordCode(r.code);resultCode=r.code}else{resultCode=await createResultCode(payload,password);setServerResult(null);setRecordCode('')}`);
 replace('<div className="codebox break-all">{inputCode}</div>',`<div className="codebox break-all" data-result-code>{inputCode}</div>{serverResult&&<section className="panel"><h3>回饋待審閱</h3><p>保留這個連結，邀請者審閱後才會顯示三段回饋。</p><input readOnly aria-label="回饋查詢連結" value={location.origin+location.pathname+'#feedback='+serverResult.feedbackToken}/><button className="primary" onClick={()=>copyText(location.origin+location.pathname+'#feedback='+serverResult.feedbackToken,showToast)}>複製查詢連結</button></section>}`);
 replace("{view === 'result' && isGodMode && <ResultDashboard answers={answers} config={quizConfig} candidateInfo={candidateInfo} showToast={showToast}  duration={quizDuration} />}",`{view === 'result' && isGodMode && <>
                    <GuidedAnalysis key={'guided-'+(recordCode||candidateInfo.name)} answers={answers} candidate={candidateInfo} analysis={buildAnalysisData(answers)} recordCode={recordCode} showToast={showToast} onLoadReport={setExternalReport}/>
                    {HOSTED&&!recordCode&&<section className="panel"><h3>舊版結果也能加入回饋流程</h3><p>保留原作答與計分，另存為新隨機編號，才可使用專屬查詢連結與開放／收回。</p><button className="primary" onClick={async()=>{try{const r=await persistPayload({config:quizConfig,answers,candidate:candidateInfo,completedAt:Date.now()});setRecordCode(r.code);setServerResult(r);showToast('已保存，新的結果代碼：'+r.code,'success')}catch(e){showToast(e.message,'error')}}}>保存為新結果</button></section>}
                    <details className="original-analysis"><summary>完整分析工作台：原問卷圖表、分數、證據、面談卡與匯出</summary><ExperienceEvidence rows={answers.experience}/><ResultDashboard key={recordCode||candidateInfo.name} answers={answers} config={quizConfig} candidateInfo={candidateInfo} showToast={showToast} duration={quizDuration} initialReport={externalReport}/></details>
                    </>}`);
 // Resume captures continue to use the original module-specific draft shapes.
 replace('setCurrentAnswers(pendingDraft.answers||{});setPartial', 'setCurrentAnswers(pendingDraft.answers||{});activity.current=pendingDraft.answers?._activity||createActivity();awayOrigin.current=activity.current.awayMs;setPartial');
 replace('const restoreModule=i=>{','const restoreModule=i=>{setReturnToReview(true);');
 replace('<details className="original-analysis"><summary>',`<details className="panel"><summary>作答歷程：前景時間、離開時間與修改紀錄</summary><p className="small muted">以下是頁面顯示與操作區間紀錄，不等於思考時間；舊碼缺少的紀錄不補造。</p>{Object.entries(answers._activity?.questions||{}).map(([id,q])=><section className="exp-block" key={id}><h4>{id}</h4><p>第一次：{q.first??'尚未選擇'} → 最後：{q.last??'尚未選擇'}</p><p>前景 {Math.round(q.activeMs/1000)} 秒 · 離開 {Math.round(q.awayMs/1000)} 秒 · 修改 {q.changes} 次</p>{q.history?.map((x,i)=><p className="small" key={i}>{new Date(x.at).toLocaleString()}：{x.from} → {x.to}</p>)}</section>)}</details><details className="original-analysis"><summary>`);
 // Public 2222 shortcut: fictional, memory-only result; never authenticate or persist it.
 replace("const [serverResult,setServerResult]", "const [isDemo,setIsDemo]=useState(false);\n            const [serverResult,setServerResult]");
 replace('            const handleCodeSubmit = async () => {', `            const openDemo=()=>{
                const demo=JSON.parse(JSON.stringify(DEMO_ANSWERS));
                const real={},ideal={},disc={real:{D:0,I:0,S:0,C:0},ideal:{D:0,I:0,S:0,C:0}};
                DISC_QUESTIONS.forEach((q,i)=>{real[q.id]=q.options[i%4].type;ideal[q.id]=q.options[(i+1)%4].type;disc.real[real[q.id]]++;disc.ideal[ideal[q.id]]++;});
                const bigRaw={},big5={O:0,C:0,E:0,A:0,N:0},enneaRaw={},enneagram={};
                BIG5_QUESTIONS.forEach((q,i)=>{const v=[4,2,4,2,5,2,4,2,4,2][i];bigRaw[q.id]=v;big5[q.dim]+=q.rev?6-v:v;});
                ENNEAGRAM_QUESTIONS.forEach((q,i)=>{enneaRaw[q.id]=i%3===0?0:1;enneagram[q.type]=(enneagram[q.type]||0)+enneaRaw[q.id];});
                Object.assign(demo,{disc,big5,enneagram,experience:[{scene:0,action:0,reason:0},{scene:1,action:2,reason:2},{scene:4,action:0,reason:0}],_raw:{disc:{real,ideal},big5:bigRaw,enneagram:enneaRaw}});
                setIsDemo(true);setIsGodMode(true);setUnlockOpen(false);setPinError('');setRecordCode('');setServerResult(null);setInvitation('');setActiveConfigCode('');submissionId.current='';setAnswers(demo);setQuizConfig({modules:[...MODULES_MAP],purpose:'explore'});setCandidateInfo({name:'示範受測者（虛構）',dob:'',age:30,gender:'示範自填'});setQuizDuration(null);
                setExternalReport('【虛構示範文字，非 AI 實際產出、非真實評估】\\n此範例用來展示完整結果與圖表。示範選擇包含及早告知、請人協助確認，以及先理解不同看法；這些是預設假資料，不代表已觀察到的能力。可在下方查看各模組證據，或回到上方試改三段回饋；修改只保留於目前畫面，不會保存或開放。');setView('result');window.scrollTo(0,0);
            };
            const handleCodeSubmit = async () => {
                if(inputCode.trim()==='2222'){openDemo();return;}`);
 replace("e.preventDefault();if(HOSTED){api('login'", "e.preventDefault();if(pin.trim()==='2222'){openDemo();return;}if(HOSTED){api('login'");
 replace('const handleLogoClick = () => {', 'const handleLogoClick = () => {if(isDemo)return;');
 replace('{isGodMode&&<button className="link"', '{isGodMode&&!isDemo&&<button className="link"');
 replace("{view!=='landing'&&<button", "{view!=='landing'&&!isDemo&&<button");
 replace("{isGodMode&&['workspace','setup','result'].includes(view)&&<aside", "{isGodMode&&!isDemo&&['workspace','setup','result'].includes(view)&&<aside");
 replace("className={isGodMode&&['workspace','setup','result'].includes(view)?'workspace':'public-flow'}", "className={isDemo?'demo-result':isGodMode&&['workspace','setup','result'].includes(view)?'workspace':'public-flow'}");
 replace('<GuidedAnalysis key=', `<section className="panel" hidden={!isDemo}><h2>虛構示範結果</h2><p>全部為預設假資料，不是實際作答或 AI 評估。不會讀取真實作答，也不能保存、發布回饋；此處修改只保留在本次畫面。</p><button className="secondary" onClick={()=>{setIsDemo(false);setIsGodMode(false);setAnswers({});setExternalReport('');setInputCode('');setView('landing')}}>離開示範，返回首頁</button></section>
                    <GuidedAnalysis demoParts={isDemo?['示範選擇呈現先告知影響、再尋求確認的處理順序。這只是虛構作答的描述，不是能力判定。','下次遇到疏漏時，可以先確認影響範圍，再用一句話說明修正方式。','當你與別人看法不同時，什麼資訊最能幫助你決定下一步？']:null} key=`);
 replace('{HOSTED&&!recordCode&&<section', '{HOSTED&&!isDemo&&!recordCode&&<section');
 replace('<details className="original-analysis">', '<details open={isDemo||undefined} className="original-analysis">');
 replace('僅為本機介面解鎖，不是身分驗證；F12 提醒也不能保護資料。','輸入管理解鎖碼進入工作台，或輸入 2222 直接查看虛構示範結果。');
 // Insight Pro presentation: results first, a compact feedback panel, tools folded away.
 source="import {InsightResults,SimpleFeedback} from './insight-results.jsx';\n"+source;
 const resultStart=source.indexOf("{view === 'result' && isGodMode && <>");
 const resultEnd=source.indexOf('\n                </div></div></main>',resultStart);
 if(resultStart<0||resultEnd<0)throw Error('Insight result boundaries');
 const oldResult=source.slice(resultStart,resultEnd);
 const bannerStart=oldResult.indexOf('<section className="panel" hidden={!isDemo}>');
 const bannerEnd=oldResult.indexOf('</section>',bannerStart)+10;
 const banner=oldResult.slice(bannerStart,bannerEnd).replace('className="panel"','className="insight-demo-banner"');
 const feedbackStart=oldResult.indexOf('<GuidedAnalysis demoParts=');
 const feedbackEnd=oldResult.indexOf('/>',feedbackStart)+2;
 const feedback=oldResult.slice(feedbackStart,feedbackEnd).replace('<GuidedAnalysis','<SimpleFeedback');
 const toolsStart=oldResult.indexOf('{HOSTED&&!isDemo&&!recordCode&&');
 const toolsEnd=oldResult.lastIndexOf('</>}');
 const advanced=oldResult.slice(toolsStart,toolsEnd).replace('<details open={isDemo||undefined} className="original-analysis">','<details className="original-analysis">');
 const insight=`{view === 'result' && isGodMode && <>
                    ${banner}
                    {!isDemo&&<button className="link" onClick={()=>setView('workspace')}>← 回工作總覽</button>}
                    <InsightResults answers={answers} config={quizConfig} candidate={candidateInfo} Radar={RadarChart} labels={{disc:DISC_ANIMALS,enneagram:ENNEAGRAM_TYPES,big5:BIG5_LABELS,holland:HOLLAND_LABELS}}/>
                    ${feedback}
                    <details className="insight-advanced"><summary>進階工具：完整報告、匯出、面談與作答歷程</summary>${advanced}</details>
                    </>}
`;
 source=source.slice(0,resultStart)+insight+source.slice(resultEnd);
 replace("className={isDemo?'demo-result':isGodMode&&['workspace','setup','result'].includes(view)?'workspace':'public-flow'}", "className={view==='result'?'insight-page':isGodMode&&['workspace','setup'].includes(view)?'workspace':'public-flow'}");
 replace("{isGodMode&&!isDemo&&['workspace','setup','result'].includes(view)&&<aside", "{isGodMode&&!isDemo&&['workspace','setup'].includes(view)&&<aside");
 const landingStart=source.indexOf("{view==='landing'&&<>");
 const landingEnd=source.indexOf("{view==='entry'&&",landingStart);
 if(landingStart<0||landingEnd<0)throw Error('Insight landing boundaries');
 source=source.slice(0,landingStart)+`{view==='landing'&&<section className="insight-home"><p className="eyebrow">PERSONALITY PORTAL</p><h1>人才潛能評測系統</h1><p className="lead">從行為、價值與經驗，理解自己的選擇。</p><button className="primary" onClick={()=>setView('entry')}>開始我的評測 →</button><button className="link" onClick={()=>setView('prepare')}>先了解評測流程</button><p className="small muted">已收到問卷連結？直接點開即可。試用可輸入 2222 查看虛構結果。</p><p className="small muted">沒有標準答案；完成後由邀請者審閱回饋，再開放查看。</p></section>}
`+source.slice(landingEnd);
 replace("const fragment=location.hash.slice(1);if(fragment.startsWith('feedback='))", "const fragment=location.hash.slice(1);if(fragment==='demo=2222'){openDemo();return;}if(fragment.startsWith('feedback='))");
 replace("setInputCode('');setView('landing')}}>離開示範", "setInputCode('');history.replaceState(null,'',location.pathname+location.search);setView('landing')}}>離開示範");
 replace('id="config-entry" type="text"', 'id="config-entry" type="text" onKeyDown={e=>{if(e.key===\'Enter\')handleCodeSubmit()}}');
 return require('./v5-transform.cjs')(source);
};
