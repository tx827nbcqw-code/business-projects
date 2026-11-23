export const BOOKING_FIELDS=['client','email','phone','shootType','durationMinutes','requestedImages','people','date','time','location','travelZone','marketingSource','businessName','businessWebsite','businessNeeds','businessUse','requests'];
export function bookingDraft(form){
  const data=Object.fromEntries(BOOKING_FIELDS.map(key=>[key,String(form.elements[key]?.value??'')]));
  if(data.shootType!=='Business / branding')for(const key of ['businessName','businessWebsite','businessNeeds','businessUse'])data[key]='';
  return {...data,smsConsent:!!form.elements.smsConsent.checked,locationAdvice:!!form.querySelector('#location-advice').checked};
}
export function cartRecord(item){
  return {photoId:item.photoId??item.imageUrl.replace('https://madmanphoto.com/assets/',''),size:item.size||'8x10',paper:item.paper||'Help me choose',border:item.border,borderSize:item.border==='Borderless'?0:(parseFloat(item.borderSize)||0.5),delivery:'Shipping',quantity:Math.min(100,Math.max(1,Number(item.quantity)||1))};
}
export function cartIdentity(item){
  return JSON.stringify([item.photoId,item.size,item.paper,item.border,item.borderSize,item.delivery]);
}
export function safeReturnPath(value){
  try{const url=new URL(value||'/','https://madmanphoto.com');return url.origin==='https://madmanphoto.com'&&['/','/prints/','/book/'].includes(url.pathname)?url.pathname+url.search:'/';}
  catch{return '/';}
}
export function selectedPrint(value,catalog){
  if(!value)return null;
  try{
    const url=new URL(value,'https://madmanphoto.com');
    if(url.origin==='https://tx827nbcqw-code.github.io')url.pathname=url.pathname.replace(/^\/business-projects\//,'/');
    else if(!['https://madmanphoto.com','https://www.madmanphoto.com'].includes(url.origin))return null;
    return catalog.find(photo=>'/assets/'+photo.src===url.pathname)||null;
  }catch{return null;}
}
export function compatiblePrintSize(size,options){
  const normalize=value=>String(value).toLowerCase().replaceAll('×','x').replace(/\s/g,'');
  return options.find(option=>normalize(option.size)===normalize(size))?.size||'Help me choose';
}

// Public print search: titles stay the headline, but captions, place notes, categories
// and the photograph's own file name are searchable so a subject finds its picture.
const PRINT_CATEGORY_LABELS={city:'City',wild:'Nature / Wild',road:'Road'};
const PRINT_CATEGORY_ALIASES={city:[],wild:['nature','wildlife'],road:[]};
export function printSearchText(photo){
  const file=String(photo?.src||'').split('/').pop().replace(/\.[a-z0-9]+$/i,'').replace(/[-_]+/g,' ');
  return [photo?.title,photo?.caption,photo?.detail,PRINT_CATEGORY_LABELS[photo?.category],photo?.category,...(PRINT_CATEGORY_ALIASES[photo?.category]||[]),file].filter(Boolean).join(' ').toLowerCase();
}
export function printMatchesQuery(photo,query){
  const terms=String(query||'').trim().toLowerCase().split(/\s+/).filter(Boolean);
  if(!terms.length)return true;
  const haystack=printSearchText(photo);
  return terms.every(term=>haystack.includes(term));
}
