import {account} from './customer-account.js';

// Restore Firebase's saved session before labelling someone as logged out.
let restored=false;
const destinations=new WeakMap();
function update({user=account.user}={}){
  for(const link of document.querySelectorAll('[data-account-link]')){
    if(!destinations.has(link))destinations.set(link,link.href);
    link.textContent=user?'My cart':restored?'Log in':'Account';
    link.setAttribute('aria-busy',String(!restored&&!user));
    link.dataset.authState=user?'signed-in':restored?'signed-out':'restoring';
    link.href=user?'/account/':destinations.get(link);
  }
}
account.onChange(update);
await account.ready;
restored=true;update();
