module.exports=function(source){
 function r(a,b){if(!source.includes(a))throw Error('V5 missing anchor: '+a.slice(0,90));source=source.replace(a,b)}
 source="import {BlueLanding as CakapLanding} from './blue-landing.jsx';\nimport {StudioFrame,RecordsDashboard as ServerRecords} from './design-v5.jsx';\nimport {SpecialistWorkbench} from './specialist-workbench.jsx';\nimport {wrapSpecialist,normalizePurpose} from './prompt-policy.js';\n"+source;
 r('FeedbackPage,ServerRecords,createPrompt','FeedbackPage,createPrompt');
 r("const [isDemo,setIsDemo]=useState(false);", "const [isDemo,setIsDemo]=useState(false),[studioSection,setStudioSection]=useState('results'),[analysisPurpose,setAnalysisPurpose]=useState('explore'),[legacyToolsMounted,setLegacyToolsMounted]=useState(false);\n            useEffect(()=>{setAnalysisPurpose(normalizePurpose(quizConfig?.purpose));setStudioSection('results');setLegacyToolsMounted(false)},[quizConfig]);");
 r("duration, initialReport='' })", "duration, initialReport='', sharedPurpose='explore',onPurposeChange=()=>{} })");
 r("const [perspective,setPerspective]=useState(config.purpose==='business'?'business':'general');", "const perspective=normalizePurpose(sharedPurpose),setPerspective=onPurposeChange;");
 r("useEffect(()=>{if(initialReport){setAI(initialReport);setReviewState('AI 解讀草稿')}},[initialReport]);", "useEffect(()=>{setAI(initialReport);setReviewState(initialReport?'AI 解讀草稿':'尚無解讀')},[initialReport]);");
 r('const groups={general:generalButtons,business:businessButtons};','const groups={explore:generalButtons,general:generalButtons,business:businessButtons};');
 const tagStart=source.indexOf('            const taggedPrompt=');
 const tagEnd=source.indexOf('            const makePack=',tagStart);
 if(tagStart<0||tagEnd<0)throw Error('V5 full prompts anchor');
 source=source.slice(0,tagStart)+"            const taggedPrompt=(prompt,view=perspective)=>wrapSpecialist({originalPrompt:prompt,answers:sourceAnswers,candidate:candidateInfo,analysis:candidateDataStr,purpose:view});\n"+source.slice(tagEnd);
 r("['general','business'].map", "['explore','general','business'].map");
 r("{v==='general'?'通用視角':'業務視角'}", "{{explore:'一般探索',general:'一般招募',business:'保險招募'}[v]}");
 r('aria-label="匯出視角" value={exportView}', 'aria-label="匯出視角" value={exportView}');
 r('<option value="general">通用</option><option value="business">業務</option>', '<option value="explore">一般探索</option><option value="general">一般招募</option><option value="business">保險招募</option>');
 r("{perspective==='general'?'通用':'業務'}視角", "{{explore:'一般探索',general:'一般招募',business:'保險招募'}[perspective]}視角");
 r("{config.purpose==='business'?'業務':'通用'}場景", "{{explore:'一般探索',general:'一般招募',business:'保險招募'}[config.purpose]||'一般探索'}場景");
 r("{view === 'result' && isGodMode && <>", "{view === 'result' && isGodMode && <StudioFrame candidate={candidateInfo} recordCode={recordCode} isDemo={isDemo} section={studioSection} onSectionChange={setStudioSection} report={externalReport} onReportLoad={setExternalReport} onHome={()=>{if(isDemo){setIsDemo(false);setIsGodMode(false);setAnswers({});setExternalReport('');setInputCode('');history.replaceState(null,'',location.pathname+location.search);setView('landing')}else setView('workspace')}}>");
 const start=source.indexOf("{view === 'result' && isGodMode && <StudioFrame");
 const end=source.indexOf('\n                </div></div></main>',start);
 const fragment=source.slice(start,end),closing=fragment.lastIndexOf('</>}');
 if(closing<0)throw Error('V5 studio closing');
 source=source.slice(0,start)+fragment.slice(0,closing)+'</StudioFrame>}'+fragment.slice(closing+5)+source.slice(end);
 r('<InsightResults answers=',"<div hidden={studioSection!=='results'}><InsightResults onFeedback={()=>setStudioSection('feedback')} answers=");
 r('holland:HOLLAND_LABELS}}/>','holland:HOLLAND_LABELS}}/></div>');
 r('<SimpleFeedback demoParts=',"<div hidden={studioSection!=='feedback'}><SpecialistWorkbench purpose={analysisPurpose} onPurposeChange={setAnalysisPurpose} demoParts=");
 r('onLoadReport={setExternalReport}/>','onLoadReport={setExternalReport}/></div>');
 r('initialReport={externalReport}/>', 'initialReport={externalReport} sharedPurpose={analysisPurpose} onPurposeChange={setAnalysisPurpose}/>');
 r('<details className="original-analysis">','<details className="original-analysis" onToggle={e=>{if(e.currentTarget.open)setLegacyToolsMounted(true)}}>');
 r('<ResultDashboard key={recordCode||candidateInfo.name}', '{legacyToolsMounted&&<ResultDashboard key={recordCode||candidateInfo.name}');
 r('sharedPurpose={analysisPurpose} onPurposeChange={setAnalysisPurpose}/>', 'sharedPurpose={analysisPurpose} onPurposeChange={setAnalysisPurpose}/>}');
 const ls=source.indexOf("{view==='landing'&&<section className=\"insight-home\"");
 const le=source.indexOf("{view==='entry'&&",ls);
 if(ls<0||le<0)throw Error('V5 landing');
 source=source.slice(0,ls)+"{view==='landing'&&<CakapLanding onStart={()=>setView('entry')} onPrepare={()=>setView('prepare')} onDemo={openDemo}/>}\n"+source.slice(le);
 r('先看資料，再形成判斷。</h3>','先看資料，再形成判斷。</h3>');
 r('沒有示範值，也不會自動連線。','貼上受測者提供的結果代碼，即可查看作答資料。');
 r("{view==='workspace'&&isGodMode&&<>", "{view==='workspace'&&isGodMode&&<>");
 // Stable identities for simultaneous multiselect items and ranking actions.
 function within(name,next,from,to){const a=source.indexOf('function '+name+'('),b=source.indexOf('function '+next+'(',a);if(a<0||b<0)throw Error('Timing component '+name);let block=source.slice(a,b);if(!block.includes(from))throw Error('Timing annotation '+name);block=block.replaceAll(from,to);source=source.slice(0,a)+block+source.slice(b)}
 within('LifeVisionModule','ValuesModule','key={item} role="checkbox"','key={item} data-answer-id={\'VISION-\'+LIFE_VISION_ITEMS.indexOf(item)} role="checkbox"');
 within('ValuesModule','OutcomesModule','key={d.id} role="checkbox"','key={d.id} data-answer-id={\'VALUES-PRIORITY-\'+d.id} role="checkbox"');
 within('TraitsModule','EnneagramModule','<label key={t}', '<label data-answer-id={\'TRAITS-\'+TRAITS_LIST.indexOf(t)} key={t}');
 within('HollandModule','QuizConfigurator','key={i} role="checkbox"','key={i} data-answer-id={\'HOLLAND-\'+i} role="checkbox"');
 within('OutcomesModule','TraitsModule','key={item.id}','key={item.id} data-answer-id={\'RANK-\'+item.term}');
 r('<h4>{id}</h4><p>第一次：','<h4>{id}</h4>{q.label&&<p>{q.label}</p>}<p className="small muted">{q.timingType===\'overlapping-item-exposure\'?\'同屏項目曝光，可能與其他項目重疊，不等於獨立思考時間\':q.timingType===\'group-exposure\'?\'整組題項曝光\':\'題目曝光與互動區間\'}</p><p>第一次：');
 r('<div className="quiz-layout">','<div className="quiz-layout" data-module={moduleKey}>');
 // Legacy advanced AI actions also expose their exact generated prompt in a text box.
 r('輸入管理解鎖碼進入工作台，或輸入 2222 直接查看虛構示範結果。',"{HOSTED?'請輸入管理密碼。':hasLocalWorkspaceAccess()?'輸入這台裝置的工作台密碼；只在此瀏覽器解鎖。':'首次使用，請設定這台裝置的工作台密碼（至少 6 個字元）。這不是雲端帳號。'}");
 r("onClick={()=>handleCopyText(taggedPrompt(btn.prompt),()=>showToast(", "onClick={()=>{setPackPreview(taggedPrompt(btn.prompt));handleCopyText(taggedPrompt(btn.prompt),()=>showToast(");
 r("()=>showToast('複製失敗','error'))} className={`flex gap-2", "()=>showToast('複製失敗','error'))}} className={`flex gap-2");
 return source;
};
