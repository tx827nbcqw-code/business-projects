import assert from 'node:assert/strict';
import {firebaseConfig} from '../assets/firebase-config.js';
assert.ok(firebaseConfig,'Customer accounts are not connected. Configure and test the owner-approved Firebase project before publishing.');
for(const key of ['apiKey','authDomain','projectId','appId'])assert.ok(typeof firebaseConfig[key]==='string'&&firebaseConfig[key].length>0,'Missing public Firebase web configuration: '+key);
assert.ok(!firebaseConfig.projectId.startsWith('demo-'),'An emulator project cannot be published as customer accounts.');
console.log('Public Firebase configuration is present. Live Auth, Firestore rules, OAuth and two-device tests still require verification.');
