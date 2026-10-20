const fs=require('fs'),path=require('path'),esbuild=require('esbuild');
async function main(){
 // Compile all retained specialist templates, not just their headings.
 const vm=require('vm'),retained=fs.readFileSync('portal-source.jsx','utf8');
 const ids=['Summary','Candidate','CombinedAgent','Interview','Management','Reliability','SalesAssistant','AssistantToAgent'];
 const labels=['測驗簡介報告','受測者職涯探索','業務潛能分析','面試實戰提問','專屬帶兵說明書','作答一致性與待核實事項','助理適配分析','助理轉正引導'];
 const catalog=ids.map((id,i)=>{const m=retained.match(new RegExp('const get'+id+'Prompt = \\(\\) => `[\\s\\S]*?`\\.trim\\(\\);'));if(!m)throw Error('Missing original template '+id);const text=vm.runInNewContext(m[0]+';get'+id+'Prompt()',{candidateInfo:{name:'受測者 A'},candidateDataStr:'【資料見共同作答證據】',mandatoryOutputFormat:'以繁體中文 Markdown 輸出完整報告；保留以下各章節。',negativePrompt:'不要開場白或自我介紹；直接從報告開始。',duration:null,formatDuration:()=> '見實際作答紀錄',reliabilityResults:{}});return {id,label:labels[i],text};});
 fs.writeFileSync('specialist-library.js','// Generated from all eight retained full specialist templates.\nexport const specialistLibrary='+JSON.stringify(catalog,null,2)+';\n');
 let baseline=fs.readFileSync('baseline-v32.html','utf8');
 const source=require('./transform.cjs')(fs.readFileSync('portal-source.jsx','utf8'));
 const entry='import html2pdf from "html2pdf.js";window.html2pdf=html2pdf;\n'+source;
 const built=await esbuild.build({stdin:{contents:entry,resolveDir:process.cwd(),sourcefile:'integrated.jsx',loader:'jsx'},bundle:true,write:false,format:'iife',minify:true,target:['es2020'],define:{'process.env.NODE_ENV':'"production"'},legalComments:'none'});
 const css=fs.readFileSync('integration.css','utf8');
 let html=baseline.replace(/<script type="text\/babel"[^>]*>[\s\S]*?<\/script>/,'').replace(/<script id="portal-runtime">[\s\S]*?<\/script>/,'');
 html=html.replace('<title>Personality Portal</title>','<title>Personality Portal｜個人探索與職涯對話</title>').replace('</head>',()=>'<style>'+css+'\n'+fs.readFileSync('design-v5.css','utf8')+'\n'+fs.readFileSync('blue-theme.css','utf8')+'\n'+fs.readFileSync('warm-theme.css','utf8')+'\n'+fs.readFileSync('editorial-v7.css','utf8')+'</style><!--\n'+fs.readFileSync('THIRD-PARTY-Codrops-LICENSE.txt','utf8')+'\n--></head>').replace('</body>',()=>'<script id="portal-runtime">'+built.outputFiles[0].text.replace(/<\/script/gi,'<\\/script')+'</script></body>');
 const out=path.resolve(process.argv[2]||'../../outputs/personality-portal-integrated-v4.html');
 fs.mkdirSync(path.dirname(out),{recursive:true});
 fs.writeFileSync(out,html);fs.writeFileSync('integrated-source.jsx',source);
 const portable=path.resolve(process.argv[3]||'../../outputs/personality-portal-blue.html');
 fs.writeFileSync(portable,html.replace('<script id="portal-runtime">','<script>window.PORTAL_LOCAL_ONLY=true;</script><script id="portal-runtime">'));
 console.log('Portable HTML '+portable);
 console.log('Built '+out+' ('+fs.statSync(out).size+' bytes)');
}
main().catch(e=>{console.error(e);process.exitCode=1});
