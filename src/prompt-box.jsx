import React,{useRef} from 'react';
import {copyText} from './integration.jsx';
export function PromptBox({label,text,showToast,filename='personality-prompt.txt',disabled=false}){
 const box=useRef(null);
 function download(){const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
 return <div className="prompt-box"><label>{label}<textarea ref={box} aria-label={label} value={text} readOnly spellCheck={false} placeholder="貼回完整報告並核對後，即可在這裡取得提煉提示詞。"/></label><div className="row"><button className="primary" disabled={disabled||!text} onClick={()=>copyText(text,showToast)}>複製框內提示詞</button><button className="secondary" disabled={disabled||!text} onClick={()=>{box.current.focus();box.current.select()}}>選取全文</button><button className="secondary" disabled={disabled||!text} onClick={download}>下載提示詞 TXT</button><span className="prompt-count">{text.length.toLocaleString()} 字元</span></div></div>;
}
