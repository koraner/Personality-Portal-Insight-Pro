// Browser-local convenience lock, not authentication to any server or shared data.
// No default password is distributed. Only a salted hash is stored on this device.
const key='personality-portal.local-workspace.v1';
function read(){
 let raw;try{raw=localStorage.getItem(key)}catch{throw Error('此瀏覽器無法保存工作台設定，請開放此網站的本機儲存。')}
 if(!raw)return null;
 let value;try{value=JSON.parse(raw)}catch{throw Error('工作台設定無法讀取，請只清除此網站的工作台密碼設定後重試。')}
 if(value.version!==1||!/^[a-f0-9]{32}$/.test(value.salt)||!/^[a-f0-9]{64}$/.test(value.hash))throw Error('工作台設定格式不正確，未覆寫既有設定。');
 return value;
}
export function hasLocalWorkspaceAccess(){try{return !!read()}catch{return true}}
const hex=bytes=>Array.from(bytes,x=>x.toString(16).padStart(2,'0')).join('');
async function digest(pin,salt){return hex(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(salt+'\n'+pin))))}
export async function unlockLocalWorkspace(pin){
 const saved=read();
 if(saved){if(await digest(pin,saved.salt)!==saved.hash)throw Error('工作台密碼不正確。');return}
 if(pin.length<6)throw Error('首次使用請設定至少 6 個字元的工作台密碼。');
 const salt=hex(crypto.getRandomValues(new Uint8Array(16))),hash=await digest(pin,salt);
 try{localStorage.setItem(key,JSON.stringify({version:1,salt,hash}))}catch{throw Error('工作台密碼未能保存在此瀏覽器，請確認本機儲存權限。')}
}
