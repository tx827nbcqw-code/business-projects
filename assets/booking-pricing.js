// Uses only the existing approved public rates. Estimates never reserve a date.
(() => {
  'use strict';
  function estimate(rates, data) {
    if(rates.approved!==true) throw Error('An estimate is unavailable. Andre can confirm pricing personally.');
    const images=Number(data.requestedImages),allDay=data.durationMinutes==='all-day',minutes=Number(data.durationMinutes);
    if(!Number.isInteger(images)||images<rates.photoStep||images>rates.maximumPhotos||images%rates.photoStep!==0) throw Error('Choose edited photographs in multiples of five.');
    if(!allDay&&![30,45,60,90,120,180,240,360,480,600,720].includes(minutes)) throw Error('Choose a session duration.');
    const coverage=allDay?rates.allDay:Math.min(minutes,60)/60*rates.firstHour+Math.max(minutes-60,0)/60*rates.additionalHour;
    const photoCost=images/rates.photoStep*rates.perFivePhotos;
    const travel=rates.travel[data.travelZone];
    const customQuote=travel==null;
    const lineItems=[{label:allDay?'All-day coverage':minutes+' minutes of photography',amount:coverage},{label:images+' edited photographs',amount:photoCost},{label:'Travel',amount:customQuote?null:travel}];
    const subtotal=coverage+photoCost+(customQuote?0:travel);
    return {minutes,images,lineItems,subtotal,total:subtotal,customQuote};
  }
  globalThis.MadmanPricing={estimate};
})();
