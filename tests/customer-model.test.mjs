import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cartIdentity,cartRecord,safeReturnPath,compatiblePrintSize} from '../assets/customer-model.mjs';
test('cart identity preserves size, paper, border and delivery across devices',()=>{
  const item={imageUrl:'https://madmanphoto.com/assets/prints/a-quiet-corner.jpg',size:'8x10',paper:'Moab Lasal Photo Matte 230',border:'Borderless',borderSize:'2 in',quantity:1};
  const a=cartRecord(item),b=cartRecord({...item,quantity:3});
  assert.equal(a.photoId,'prints/a-quiet-corner.jpg');assert.equal(a.borderSize,0);assert.equal(cartIdentity(a),cartIdentity(b));
  const white=cartRecord({...item,border:'White border',borderSize:'0 in'});assert.equal(white.borderSize,0.5);assert.notEqual(cartIdentity(a),cartIdentity(white));
});
test('post-login return links cannot redirect to another website',()=>{
  for(const link of ['https://evil.example/prints/','//evil.example/book/','javascript:alert(1)','/dashboard/'])assert.equal(safeReturnPath(link),'/account/');
  assert.equal(safeReturnPath('/prints/?category=wildlife'),'/prints/?category=wildlife');assert.equal(safeReturnPath('/book/?type=business'),'/book/?type=business');
});
test('print inquiries use the backend size spelling and preserve custom sizes for personal review',()=>{
  assert.equal(compatiblePrintSize('8x10',[{size:'8×10'}]),'8×10');
  assert.equal(compatiblePrintSize('20x30',[{size:'8×10'}]),'Help me choose');
});
