import React from 'react';
// Deliberately limited Markdown renderer: React text nodes only; no HTML injection or remote media.
function Inline({text}){return text.split(/(\*\*[^*]+\*\*)/g).map((s,i)=>s.startsWith('**')&&s.endsWith('**')?<strong key={i}>{s.slice(2,-2)}</strong>:s)}
const cells=line=>line.trim().replace(/^\||\|$/g,'').split('|').map(x=>x.trim());
export function ReportPreview({text}){
 const lines=String(text||'').split('\n'),blocks=[];let i=0;
 while(i<lines.length){const line=lines[i];if(!line.trim()){i++;continue}
  const heading=line.match(/^(#{1,4})\s+(.+)$/);if(heading){const H='h'+Math.min(heading[1].length+1,6);blocks.push(<H key={i}><Inline text={heading[2]}/></H>);i++;continue}
  if(/^---\s*$/.test(line)){blocks.push(<hr key={i}/>);i++;continue}
  if(line.trim().startsWith('|')&&/^\s*\|?[\s:|-]+\|\s*$/.test(lines[i+1]||'')){const start=i,head=cells(line),rows=[];i+=2;while(i<lines.length&&lines[i].trim().startsWith('|'))rows.push(cells(lines[i++]));blocks.push(<div className="report-table-wrap" key={start} role="region" aria-label="報告條件比較表" tabIndex={0}><table><thead><tr>{head.map((v,j)=><th key={j} scope="col"><Inline text={v}/></th>)}</tr></thead><tbody>{rows.map((r,j)=><tr key={j}>{head.map((_,k)=><td key={k}><Inline text={r[k]||''}/></td>)}</tr>)}</tbody></table></div>);continue}
  if(/^>\s?/.test(line)){const start=i,quoted=[];while(i<lines.length&&/^>\s?/.test(lines[i]))quoted.push(lines[i++].replace(/^>\s?/,''));blocks.push(<blockquote key={start}><Inline text={quoted.join('\n')}/></blockquote>);continue}
  const item=line.match(/^(?:[-*]\s+|\d+\.\s+)(.*)$/);if(item){const start=i,ordered=/^\d+\./.test(line),items=[];while(i<lines.length&&(ordered?/^\d+\.\s+/:/^[-*]\s+/).test(lines[i]))items.push(lines[i++].replace(/^(?:[-*]\s+|\d+\.\s+)/,''));const List=ordered?'ol':'ul';blocks.push(<List key={start}>{items.map((v,j)=><li key={j}><Inline text={v}/></li>)}</List>);continue}
  blocks.push(<p key={i}><Inline text={line}/></p>);i++;
 }
 return <article className="specialist-report" aria-label="完整解讀預覽">{blocks}</article>;
}
