export function inquiryRecord(data){
 const clip=(key,max=4000)=>String(data[key]??'').trim().slice(0,max);
 const client=clip('client',120),email=clip('email',254),shootType=clip('shootType',120);
 if(!client||!/^\S+@\S+\.\S+$/.test(email)||!clip('requests',3000)||!shootType)throw Error('Enter your name, valid email, and shoot details.');
 if(!/^[a-zA-Z0-9_-]{1,100}$/.test(clip('requestId',100)))throw Error('Invalid request identifier');
 const business=shootType==='Business / branding';
 if(business&&(!clip('businessName',120)||!clip('businessUse',300)))throw Error('Enter the business name and intended photo use.');
 const details=business?'Business: '+clip('businessName',120)+'\nWebsite / social: '+clip('businessWebsite',300)+'\nPhoto needs: '+clip('businessNeeds',300)+'\nIntended use: '+clip('businessUse',300)+'\n\n':'';
 const now=new Date().toISOString();
 return {id:'web-'+clip('requestId',100),kind:'inquiry',status:'NEW',source:'Website request',client,email,phone:clip('phone',40),shootType,date:clip('date',10),time:clip('time',5),location:clip('location',500),people:clip('people',10),requests:(details+clip('requests',3000)).slice(0,4000),sessionPackage:clip('sessionPackage',40),travelZone:clip('travelZone',40),marketingSource:clip('marketingSource',120),smsConsent:data.smsConsent===true,createdAt:now,updatedAt:now};
}
