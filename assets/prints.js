import {account} from './customer-account.js';
import {compatiblePrintSize,cartRecord,selectedPrint} from './customer-model.mjs';
const CATALOG = [{"title": "A quiet corner", "src": "prints/a-quiet-corner.jpg", "imageUrl": "https://madmanphoto.com/assets/prints/a-quiet-corner.jpg", "category": "city", "caption": "A person seated beside a warm terracotta wall and a yellow barrier.", "detail": "Travel · field notes"}, {"title": "Light through a glass frog", "src": "prints/light-through-a-glass-frog.jpg", "imageUrl": "https://madmanphoto.com/assets/prints/light-through-a-glass-frog.jpg", "category": "wild", "caption": "A translucent green frog seen from below against a dark background.", "detail": "Nature · field notes"}, {"title": "Carrying the forest", "src": "prints/carrying-the-forest.jpg", "imageUrl": "https://madmanphoto.com/assets/prints/carrying-the-forest.jpg", "category": "wild", "caption": "Leaf-carrying ants cross a green mossy surface.", "detail": "Nature · field notes"}, {"title": "Gold on green", "src": "prints/gold-on-green.jpg", "imageUrl": "https://madmanphoto.com/assets/prints/gold-on-green.jpg", "category": "wild", "caption": "Two golden ants meet on a deep green leaf.", "detail": "Nature · field notes"}, {"title": "Red on the forest floor", "src": "prints/red-on-the-forest-floor.jpg", "imageUrl": "https://madmanphoto.com/assets/prints/red-on-the-forest-floor.jpg", "category": "wild", "caption": "A red-and-black frog rests among leaves on the forest floor.", "detail": "Nature · field notes"}, {"title": "A home carried", "src": "prints/a-home-carried.jpg", "imageUrl": "https://madmanphoto.com/assets/prints/a-home-carried.jpg", "category": "wild", "caption": "A hermit crab carries its green-tinged shell across pale sand.", "detail": "Nature · field notes"}, {"title": "Where the city meets the desert", "src": "prints/city-meets-the-desert.jpg", "imageUrl": "https://madmanphoto.com/assets/prints/city-meets-the-desert.jpg", "category": "wild", "caption": "Three people walking across golden desert earth with a city in the distance.", "detail": "Nature · field notes"}, {"title": "A cat in the afternoon", "src": "prints/cat-in-the-afternoon.jpg", "imageUrl": "https://madmanphoto.com/assets/prints/cat-in-the-afternoon.jpg", "category": "city", "caption": "A small cat on a wall between sunlit buildings.", "detail": "Travel · field notes"}, {"title": "A town beneath the peaks", "src": "prints/town-beneath-the-peaks.jpg", "imageUrl": "https://madmanphoto.com/assets/prints/town-beneath-the-peaks.jpg", "category": "city", "caption": "A town street beneath a towering snow-covered mountain.", "detail": "Travel · field notes"}, {"title": "Rooms beneath the mountains", "src": "prints/rooms-beneath-the-mountains.jpg", "imageUrl": "https://madmanphoto.com/assets/prints/rooms-beneath-the-mountains.jpg", "category": "city", "caption": "A vintage hotel sign beneath pale mountain peaks.", "detail": "Travel · field notes"}, {"title": "The street at last light", "src": "prints/street-at-last-light.jpg", "imageUrl": "https://madmanphoto.com/assets/prints/street-at-last-light.jpg", "category": "city", "caption": "A person crossing a sunlit street between warm stone buildings.", "detail": "Travel · field notes"}, {"title": "Along the stone ramparts", "src": "prints/along-the-stone-ramparts.jpg", "imageUrl": "https://madmanphoto.com/assets/prints/along-the-stone-ramparts.jpg", "category": "wild", "caption": "Stone towers and ramparts climb a rocky green hillside.", "detail": "Nature · field notes"}, {"title": "Shoreline in gold", "src": "prints/shoreline-in-gold.jpg", "imageUrl": "https://madmanphoto.com/assets/prints/shoreline-in-gold.jpg", "category": "wild", "caption": "People beside the water at a sunlit shore, with a small island beyond.", "detail": "Nature · field notes"}, {"title": "Market under the trees", "src": "prints/market-under-the-trees.jpg", "imageUrl": "https://madmanphoto.com/assets/prints/market-under-the-trees.jpg", "category": "city", "caption": "An outdoor market with vendors and tables beneath leafy trees.", "detail": "Travel · field notes"}, {"title": "Blue boat in the harbour", "src": "prints/blue-boat-in-the-harbour.jpg", "imageUrl": "https://madmanphoto.com/assets/prints/blue-boat-in-the-harbour.jpg", "category": "road", "caption": "A blue fishing boat moored in a harbour beneath hillside homes.", "detail": "Travel · field notes"}, {"title": "Painted lane", "src": "field-003.jpg", "imageUrl": "https://madmanphoto.com/assets/field-003.jpg", "category": "city", "caption": "A narrow lane, painted color, and the slow rhythm of an afternoon.", "detail": "Spain · street"}, {"title": "Under the old arches", "src": "field-006.jpg", "imageUrl": "https://madmanphoto.com/assets/field-006.jpg", "category": "city", "caption": "Tile, iron, and the steady movement of a station built to last.", "detail": "Porto · station"}, {"title": "A city in motion", "src": "field-007.jpg", "imageUrl": "https://madmanphoto.com/assets/field-007.jpg", "category": "road", "caption": "A yellow tram threads through the city, carrying the day along with it.", "detail": "Streetcar · city"}, {"title": "Vienna, in the blue", "src": "field-012.jpg", "imageUrl": "https://madmanphoto.com/assets/field-012.jpg", "category": "city", "caption": "Old rooflines and a spire rising into the cool light.", "detail": "Vienna · rooftops"}, {"title": "The yellow line", "src": "field-015.jpg", "imageUrl": "https://madmanphoto.com/assets/field-015.jpg", "category": "road", "caption": "A streetcar turns beneath the wires and stonework of the old city.", "detail": "Vienna · transit"}, {"title": "A square in Seville", "src": "field-021.jpg", "imageUrl": "https://madmanphoto.com/assets/field-021.jpg", "category": "city", "caption": "A broad sweep of architecture, caught in the last warmth of the day.", "detail": "Seville · plaza"}, {"title": "Across the river", "src": "field-022.jpg", "imageUrl": "https://madmanphoto.com/assets/field-022.jpg", "category": "city", "caption": "A landmark on the waterline as the city turns toward evening.", "detail": "Budapest · dusk"}, {"title": "Crossing paths", "src": "field-025.jpg", "imageUrl": "https://madmanphoto.com/assets/field-025.jpg", "category": "city", "caption": "A quiet black-and-white study of people moving through the city.", "detail": "Street study"}, {"title": "Where the desert opens", "src": "field-027.jpg", "imageUrl": "https://madmanphoto.com/assets/field-027.jpg", "category": "wild", "caption": "A small human figure against a landscape made of light and stone.", "detail": "Desert · open country"}, {"title": "After the show", "src": "field-032.jpg", "imageUrl": "https://madmanphoto.com/assets/field-032.jpg", "category": "city", "caption": "Neon, night air, and the glow of a neighborhood theater.", "detail": "Night notes"}, {"title": "City by the water", "src": "field-036.jpg", "imageUrl": "https://madmanphoto.com/assets/field-036.jpg", "category": "city", "caption": "A riverfront of close-set buildings reflected in the still water.", "detail": "Bilbao · riverfront"}, {"title": "At the water’s edge", "src": "field-037.jpg", "imageUrl": "https://madmanphoto.com/assets/field-037.jpg", "category": "wild", "caption": "Sea, stone, and a long view out toward the horizon.", "detail": "Coast · open water"}, {"title": "The courtyard garden", "src": "field-038.jpg", "imageUrl": "https://madmanphoto.com/assets/field-038.jpg", "category": "city", "caption": "A small pocket of green tucked behind the street.", "detail": "Merano · courtyard"}, {"title": "Streets of stone", "src": "field-040.jpg", "imageUrl": "https://madmanphoto.com/assets/field-040.jpg", "category": "city", "caption": "One turn at a time, the old town opens up.", "detail": "Old town · walking"}, {"title": "Between departures", "src": "field-047.jpg", "imageUrl": "https://madmanphoto.com/assets/field-047.jpg", "category": "city", "caption": "A pause inside a vast station, with travelers threading through the light.", "detail": "Station · passage"}, {"title": "Red earth, wide sky", "src": "field-048.jpg", "imageUrl": "https://madmanphoto.com/assets/field-048.jpg", "category": "wild", "caption": "A desert landscape held in the last low light.", "detail": "Desert · last light"}, {"title": "A walk through San Sebastián", "src": "field-054.jpg", "imageUrl": "https://madmanphoto.com/assets/field-054.jpg", "category": "city", "caption": "A narrow street opens toward the afternoon and the people passing through it.", "detail": "San Sebastián · street"}, {"title": "Lisbon’s old route", "src": "field-055.jpg", "imageUrl": "https://madmanphoto.com/assets/field-055.jpg", "category": "road", "caption": "A familiar yellow tram works its way through the hills.", "detail": "Lisbon · transit"}, {"title": "Across the sands", "src": "field-058.jpg", "imageUrl": "https://madmanphoto.com/assets/field-058.jpg", "category": "wild", "caption": "A slow crossing beneath the old stone silhouettes of the desert.", "detail": "Egypt · desert"}, {"title": "The road after dark", "src": "field-062.jpg", "imageUrl": "https://madmanphoto.com/assets/field-062.jpg", "category": "road", "caption": "A line of lights leads on through the night.", "detail": "Night drive"}, {"title": "A church in morning light", "src": "field-064.jpg", "imageUrl": "https://madmanphoto.com/assets/field-064.jpg", "category": "city", "caption": "A quiet facade under a wide, clear sky.", "detail": "Bulgaria · architecture"}, {"title": "The river’s turn", "src": "field-071.jpg", "imageUrl": "https://madmanphoto.com/assets/field-071.jpg", "category": "city", "caption": "A view across the water, with the city opening around the bend.", "detail": "Florence · river"}, {"title": "A city reflected", "src": "field-077.jpg", "imageUrl": "https://madmanphoto.com/assets/field-077.jpg", "category": "city", "caption": "Light on the river and the architecture that rises above it.", "detail": "Riverside · Italy"}, {"title": "A passage through the garden", "src": "field-083.jpg", "imageUrl": "https://madmanphoto.com/assets/field-083.jpg", "category": "city", "caption": "A figure crosses a shaded courtyard between old stone walls.", "detail": "Courtyard · passage"}, {"title": "Weather at the edge", "src": "field-086.jpg", "imageUrl": "https://madmanphoto.com/assets/field-086.jpg", "category": "wild", "caption": "A lone pause beside the sea, with weather moving over the horizon.", "detail": "Ireland · coast"}, {"title": "The long way through", "src": "field-087.jpg", "imageUrl": "https://madmanphoto.com/assets/field-087.jpg", "category": "city", "caption": "A narrow street bends between old facades and a passing car.", "detail": "Old town · back street"}, {"title": "The desert at last light", "src": "field-095.jpg", "imageUrl": "https://madmanphoto.com/assets/field-095.jpg", "category": "wild", "caption": "A broad sweep of red earth and shadow beneath the fading sun.", "detail": "Desert · sundown"}, {"title": "Flags above the street", "src": "prints/flags-above-the-street.jpg", "imageUrl": "https://madmanphoto.com/assets/prints/flags-above-the-street.jpg", "category": "city", "caption": "Regional flags strung above a sunlit street.", "detail": "Travel · everyday moments"}, {"title": "Toward the mountains", "src": "prints/toward-the-mountains.jpg", "imageUrl": "https://madmanphoto.com/assets/prints/toward-the-mountains.jpg", "category": "city", "caption": "A narrow old street opens toward snow-covered mountains.", "detail": "Travel · everyday moments"}, {"title": "A pause in the garden", "src": "prints/pause-in-the-garden.jpg", "imageUrl": "https://madmanphoto.com/assets/prints/pause-in-the-garden.jpg", "category": "city", "caption": "A person seated on a bench beneath palms and bare branches.", "detail": "Travel · everyday moments"}, {"title": "The game below the rooftops", "src": "prints/game-below-the-rooftops.jpg", "imageUrl": "https://madmanphoto.com/assets/prints/game-below-the-rooftops.jpg", "category": "city", "caption": "Players on a green court among hillside buildings and tall trees.", "detail": "Travel · everyday moments"}, {"title": "Palm and stone", "src": "prints/palm-and-stone.jpg", "imageUrl": "https://madmanphoto.com/assets/prints/palm-and-stone.jpg", "category": "city", "caption": "A palm tree beside warm stone architecture and arched galleries.", "detail": "Travel · everyday moments"}, {"title": "Painting by the Arno", "src": "prints/painting-by-the-arno.jpg", "imageUrl": "https://madmanphoto.com/assets/prints/painting-by-the-arno.jpg", "category": "city", "caption": "An artist paints the riverside architecture of Florence.", "detail": "Travel · everyday moments"}, {"title": "Hidden in the canopy", "src": "prints/hidden-in-the-canopy.jpg", "imageUrl": "https://madmanphoto.com/assets/prints/hidden-in-the-canopy.jpg", "category": "wild", "caption": "A monkey framed by dark leaves and light in the canopy.", "detail": "Nature · observation"}, {"title": "Beneath the stone arch", "src": "prints/beneath-the-stone-arch.jpg", "imageUrl": "https://madmanphoto.com/assets/prints/beneath-the-stone-arch.jpg", "category": "city", "caption": "People and long shadows beneath an old stone arch, in black and white.", "detail": "Travel · everyday moments"}, {"title": "Shadows in the square", "src": "prints/shadows-in-the-square.jpg", "imageUrl": "https://madmanphoto.com/assets/prints/shadows-in-the-square.jpg", "category": "city", "caption": "People and a dog casting long shadows across a cobbled square, in black and white.", "detail": "Travel · everyday moments"}, {"title": "Golden arches", "src": "prints/golden-arches.jpg", "imageUrl": "https://madmanphoto.com/assets/prints/golden-arches.jpg", "category": "city", "caption": "Sunlit brick arches and a decorated tower beneath a clear blue sky.", "detail": "Travel · everyday moments"}, {"title": "City in amber", "src": "DSC1371.jpg", "imageUrl": "https://madmanphoto.com/assets/DSC1371.jpg", "category": "city", "caption": "", "detail": ""}, {"title": "The village below the peaks", "src": "Halstatt---Madman-1.jpg", "imageUrl": "https://madmanphoto.com/assets/Halstatt---Madman-1.jpg", "category": "wild", "caption": "", "detail": ""}, {"title": "Stone against the sky", "src": "DSC5135.jpg", "imageUrl": "https://madmanphoto.com/assets/DSC5135.jpg", "category": "wild", "caption": "", "detail": ""}, {"title": "A blur of red", "src": "DSC1274.jpg", "imageUrl": "https://madmanphoto.com/assets/DSC1274.jpg", "category": "road", "caption": "", "detail": ""}, {"title": "Quiet attention", "src": "prints/woodpecker.jpg", "imageUrl": "https://madmanphoto.com/assets/prints/woodpecker.jpg", "category": "wild", "caption": "", "detail": ""}, {"title": "Beneath the canyon falls", "src": "prints/waterfall-canyon.jpg", "imageUrl": "https://madmanphoto.com/assets/prints/waterfall-canyon.jpg", "category": "wild", "caption": "", "detail": ""}, {"title": "Blue hour, open road", "src": "prints/blue-hour-car.jpg", "imageUrl": "https://madmanphoto.com/assets/prints/blue-hour-car.jpg", "category": "road", "caption": "", "detail": ""}, {"title": "A rhythm on the river", "src": "prints/river-rower.jpg", "imageUrl": "https://madmanphoto.com/assets/prints/river-rower.jpg", "category": "city", "caption": "", "detail": ""}];
const $ = (s, r=document) => r.querySelector(s);
const PRINT_PRICES = {"Moab Lasal Photo Matte 230": {"8x10": 15.56, "12x18": 37.65, "16x24": 62.35, "20x30": 91.25}, "Hahnemühle Photo Rag Matt": {"8x10": 26.67, "12x18": 52.94, "16x24": 78.82, "20x30": 130}, "Hahnemühle Cézanne Canvas": {"8x10": 26.67, "12x18": 52.94, "16x24": 78.82, "20x30": 130}};
const PAPER_DESC = {
  'Moab Lasal Photo Matte 230': 'Everyday matte — a smooth, understated finish for photographs and gifts. Smooth matte finish, low glare, good colour.',
  'Hahnemühle Photo Rag Matt': 'Premium matte — best for fine-art / gallery prints. Textured 100% cotton feel, deep blacks, archival.',
  'Hahnemühle Cézanne Canvas': 'Canvas — best for a frameless, painterly wall piece. Woven pure-cotton texture, radiant colour and deep blacks.'
};
function exampleUnit(c){ return PRINT_PRICES[c.paper]?.[c.size] ?? null; }
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function money(n){ return '$' + n.toFixed(2).replace(/\.00$/, ''); }
function lineTotalText(c){
  const u = exampleUnit(c);
  return u === null ? 'Price to confirm' : money(u) + ' × ' + c.quantity + ' = ' + money(u * c.quantity);
}
const grid = $('#catalog');
const wildlife = new Set(['Light through a glass frog','Carrying the forest','Gold on green','Red on the forest floor','A home carried','A cat in the afternoon','Hidden in the canopy','Quiet attention']);
const matchesCategory = (p,cat) => cat==='all' || (cat==='wildlife'?wildlife.has(p.title):p.category===cat);
let activeCat = 'all';
let searchText = '';

function count(cat){ return CATALOG.filter(p=>matchesCategory(p,cat)).length; }
['all','city','wild','wildlife','road'].forEach(c => { const el = document.getElementById('count-'+c); if(el) el.textContent = '('+count(c)+')'; });

function select(name){
  const wrap = document.createElement('label');
  return wrap;
}
function optionList(){
  return [
    ['','Choose a size'],
    ['Help me choose','Help me choose / custom size'],
    ['8x10','8 × 10 inches'],
    ['12x18','12 × 18 inches'],
    ['16x24','16 × 24 inches'],
    ['20x30','20 × 30 inches'],
  ];
}
function render(){
  const q = searchText.trim().toLowerCase();
  const items = CATALOG.filter(p => matchesCategory(p,activeCat) && (!q || p.title.toLowerCase().includes(q)));
  $('#result-count').textContent = items.length + ' of ' + CATALOG.length + ' photographs' + (activeCat!=='all' ? ' · category: ' + activeCat : '');
  $('#empty').hidden = items.length > 0;
  grid.innerHTML = '';
  items.forEach((p, idx) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.dataset.title = p.title;
    card.dataset.photo = p.src;
    const img = document.createElement('img');
    img.src = p.imageUrl; img.alt = p.caption || p.title; img.loading = 'lazy';
    // Live preview wrapper: border padding + paper background update live with options
    const previewWrap = document.createElement('div'); previewWrap.className = 'live-preview';
    previewWrap.appendChild(img);
    img.onerror = () => { img.alt = p.title + ' (image unavailable in this preview)'; };
    img.onload = () => { if(typeof updatePreview === 'function') updatePreview(); };
    const body = document.createElement('div'); body.className = 'card-body';
    const h = document.createElement('h2'); h.textContent = p.title;
    const cap = document.createElement('p'); cap.textContent = p.caption || p.detail || 'A photograph by Andre Ottati.';
    const cat = document.createElement('p'); cat.className = 'muted'; cat.textContent = ({city:'City',wild:'Nature / Wild',road:'Road'})[p.category]; cat.className = 'eyebrow';
    body.append(h, cap, cat);
    const detail = document.createElement('div'); detail.className = 'buy-detail'; detail.hidden = true; body.appendChild(detail);
    const fields = [
      ['size','Print size', optionList()],
      ['paper','Paper / finish', [['','Help me choose'],['Moab Lasal Photo Matte 230','Moab Lasal Photo Matte 230 — everyday matte'],['Hahnemühle Photo Rag Matt','Hahnemühle Photo Rag Matt — premium matte'],['Hahnemühle Cézanne Canvas','Hahnemühle Cézanne Canvas — canvas']]],
      ['border','Border', [['Borderless','Borderless / full bleed'],['White border','White border']]],
      ['borderSize','Border size', [['0','No border — 0 in'],['0.5','0.5 in border'],['1','1 in border'],['2','2 in border']]],
      // Signed option removed 2026-11-04: skipped for now (Andre moves around in college, signing/shipping is too complicated for now).
      ['delivery','Delivery', [['Shipping','Shipping']]],
    ];
    const controls = {};
    fields.forEach(([key,label,opts]) => {
      const lab = document.createElement('label'); const sp = document.createElement('span'); sp.textContent = label; lab.appendChild(sp);
      const sel = document.createElement('select'); sel.dataset.field = key;
      opts.forEach(([v,t]) => { const o = document.createElement('option'); o.value = v; o.textContent = t; sel.appendChild(o); });
      lab.appendChild(sel); detail.appendChild(lab); controls[key] = sel;
    });
    const qlab = document.createElement('label'); const qsp = document.createElement('span'); qsp.textContent = 'Quantity'; qlab.appendChild(qsp);
    const qin = document.createElement('input'); qin.type = 'number'; qin.min = '1'; qin.max = '100'; qin.value = '1'; qlab.appendChild(qin); detail.appendChild(qlab);
    const hint = document.createElement('p'); hint.className = 'price-hint muted'; detail.appendChild(hint);
    const paperDesc = document.createElement('p'); paperDesc.className = 'paper-desc muted'; detail.appendChild(paperDesc);
    const cropNote = document.createElement('p'); cropNote.className = 'crop-note muted'; detail.appendChild(cropNote);
    function updatePreview(){
      // Crop preview to the selected print size aspect ratio (center crop, like the lab would)
      const sizeMatch = (controls.size.value || '').match(/(\d+)x(\d+)/);
      if(sizeMatch){
        const sw = parseInt(sizeMatch[1], 10), sh = parseInt(sizeMatch[2], 10);
        const target = sw / sh;
        previewWrap.style.aspectRatio = sw + ' / ' + sh;
        img.style.width = '100%'; img.style.height = '100%'; img.style.objectFit = 'cover'; img.style.objectPosition = 'center';
        const nat = (img.naturalWidth && img.naturalHeight) ? img.naturalWidth / img.naturalHeight : null;
        if(nat && Math.abs(nat - target) / target > 0.05){
          cropNote.textContent = 'Preview cropped to ' + sw + ' × ' + sh + ' — this photo is a different shape, so the real print will crop like this as an approximate center crop. Andre confirms the final image fit before printing.';
        } else {
          cropNote.textContent = 'Preview shown at ' + sw + ' × ' + sh + ' proportions — little or no cropping needed for this photo.';
        }
      } else {
        previewWrap.style.aspectRatio = 'auto';
        img.style.width = '100%'; img.style.height = 'auto'; img.style.objectFit = 'contain';
        cropNote.textContent = 'No size chosen yet — preview shows the full photo, uncropped. Pick a size to see how it would crop.';
      }
      const bs = parseFloat(controls.borderSize ? controls.borderSize.value : '0') || 0;
      const isBorderless = controls.border.value === 'Borderless';
      const pad = isBorderless ? 0 : Math.max(2, Math.min(28, bs * 12));
      previewWrap.style.padding = pad + 'px';
      previewWrap.style.background = controls.paper.value.includes('Canvas') ? '#f2ede2' : '#ffffff';
      previewWrap.style.boxSizing = 'border-box';
      let sig = previewWrap.querySelector('.signed-label');
      if(controls.signed && controls.signed.value === 'Signed'){
        if(!sig){ sig = document.createElement('span'); sig.className = 'signed-label'; sig.textContent = 'Signed by Andre'; previewWrap.appendChild(sig); }
      } else if(sig){ sig.remove(); }
    }
    function updateHint(){
      controls.borderSize.disabled=controls.border.value==='Borderless';if(controls.border.value==='Borderless')controls.borderSize.value='0';else if(controls.borderSize.value==='0')controls.borderSize.value='0.5';
      const draft = {size:controls.size.value, paper:controls.paper.value, signed:'Unsigned'};
      const u = exampleUnit(draft);
      paperDesc.textContent = PAPER_DESC[controls.paper.value] || '';
      const qty = Math.max(1, Math.min(100, parseInt(qin.value, 10) || 1));
      // Customer-facing hint: price only. Lab cost and margin stay in the internal pricing file, never in the UI.
      hint.textContent = u === null ? 'Price to confirm — pick a size and paper; shipping & tax confirmed by Andre.' : 'Price: ' + money(u) + ' per print · ' + money(u * qty) + ' for ' + qty + ' print(s). Shipping & tax confirmed by Andre. Changing size, paper, border, or quantity updates this price.';
      updatePreview();
    }
    qin.addEventListener('input', updateHint);
    // Low-click defaults: 8x10, Moab cheaper matte, Borderless, 0in border, To discuss delivery, qty 1.
    // Buyer can change any of these, but Add to Cart works with zero extra choices.
    if(controls.size) controls.size.value = '8x10';
    if(controls.paper) controls.paper.value = 'Moab Lasal Photo Matte 230';
    if(controls.border) controls.border.value = 'Borderless';
    if(controls.borderSize) controls.borderSize.value = '0';
    if(controls.delivery) controls.delivery.value = 'Shipping';
    Object.values(controls).forEach(sel => sel.addEventListener('change', updateHint));
    updateHint();
    const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'add'; btn.textContent = 'Add to cart';
    btn.addEventListener('click', () => {
      const size = controls.size.value || '8x10';  // Defaults cover this; Help me choose still works as a size choice.
      const qty = Math.max(1, Math.min(100, parseInt(qin.value, 10) || 1));
      addToCart({title:p.title, imageUrl:p.imageUrl, category:p.category, size:size, paper:controls.paper.value || 'Help me choose', border:controls.border.value, borderSize:controls.borderSize.value + ' in', signed:'Unsigned', delivery:controls.delivery.value, quantity:qty});
    });
    detail.appendChild(btn);
    const quickBtn = document.createElement('button'); quickBtn.type = 'button'; quickBtn.className = 'inquire'; quickBtn.textContent = 'Quick add — 8 × 10, Moab matte';
    quickBtn.addEventListener('click', () => { addToCart({title:p.title, imageUrl:p.imageUrl, category:p.category, size:'8x10', paper:'Moab Lasal Photo Matte 230', border:'Borderless', borderSize:'0 in', signed:'Unsigned', delivery:'Shipping', quantity:1}); });
    body.appendChild(quickBtn);
    const inquireBtn = document.createElement('button'); inquireBtn.type = 'button'; inquireBtn.className = 'inquire'; inquireBtn.textContent = 'Inquire to Buy';
    inquireBtn.dataset.openPrint='';
    inquireBtn.setAttribute('aria-expanded','false'); inquireBtn.addEventListener('click', () => { detail.hidden = !detail.hidden; card.classList.toggle('is-open', !detail.hidden); inquireBtn.textContent = detail.hidden ? 'Inquire to Buy' : 'Close details'; inquireBtn.setAttribute('aria-expanded', String(!detail.hidden)); if(!detail.hidden){h.tabIndex=-1;h.focus({preventScroll:true});body.scrollIntoView({block:'start',behavior:'smooth'});} });
    body.appendChild(inquireBtn);
    card.append(previewWrap, body);
    grid.appendChild(card);
  });
}
let cart = [];
let cartReady=false,cartWorking=false,cartUid=null;
function cartStatus(text,error=false){const el=$('#cart-save-status');el.textContent=text;el.classList.toggle('error',error);}
async function changeCart(item,delta){
  if(!await account.requireLogin())return;
  if(cartWorking||!cartReady)return;
  if(delta>0&&!cart.some(c=>c.imageUrl===item.imageUrl)&&cart.length>=100){cartStatus('Your cart has reached 100 selections. Send an inquiry before adding more.',true);return;}
  cartWorking=true;cartStatus('Saving your print selection…');
  try{await account.changeCart(item,delta);$('#checkout button[type=submit]').disabled=false;}
  catch(error){cartStatus(error.code?account.message(error):error.message,true);}
  finally{cartWorking=false;}
}
async function addToCart(item){await changeCart(item,item.quantity);}
function renderSummary(){
  const sumEl = $('#order-summary'); if(!sumEl) return;
  if(cart.length===0){ sumEl.innerHTML = '<p class="muted">Add prints to your cart to see the order summary here.</p>'; return; }
  let subtotal = 0, pricedLines = 0, unpricedLines = 0, totalQty = 0;
  const rows = cart.map(c => {
    const u = exampleUnit(c); totalQty += c.quantity;
    if(u === null){ unpricedLines++; return '<li>' + escapeHtml(c.title) + ' — ' + escapeHtml(c.size) + ', ' + escapeHtml(c.paper) + ', ' + escapeHtml(c.signed) + ' × ' + c.quantity + ' — Price to confirm</li>'; }
    pricedLines++; subtotal += u * c.quantity;
    return '<li>' + escapeHtml(c.title) + ' — ' + escapeHtml(c.size) + ', ' + escapeHtml(c.paper) + ', ' + escapeHtml(c.signed) + ' × ' + c.quantity + ' — ' + money(u * c.quantity) + '</li>';
  }).join('');
  sumEl.innerHTML = '<h4>Order summary — ' + cart.length + ' line(s), ' + totalQty + ' print(s)</h4><ul>' + rows + '</ul>'
    + '<p>Subtotal (priced lines only): ' + money(subtotal) + '</p>'
    + '<p class="muted">Shipping &amp; tax: To be confirmed — not included in this total. ' + (unpricedLines ? unpricedLines + ' line(s) have no price yet and are excluded from the subtotal.' : '') + '</p>'
    + '<p class="total">Total (excluding shipping/tax, excluding unpriced lines): ' + money(subtotal) + '</p>'
    + '<p class="muted">Shipping and tax confirmed by Andre.</p>';
}
function updateCart(){
  renderSummary();
  const totalQty = cart.reduce((n,c)=>n+c.quantity,0);
  if(!$('#cart-summary').textContent.startsWith('Added:')) $('#cart-summary').textContent = 'Cart: ' + cart.length + ' line(s), ' + totalQty + ' print(s)';
  else $('#cart-summary').textContent = 'Cart: ' + cart.length + ' line(s), ' + totalQty + ' print(s)';
  const wrap = $('#cart-lines'); wrap.innerHTML = '';
  $('#cart-empty').hidden = cart.length > 0;
  cart.forEach((c, i) => {
    const div = document.createElement('div'); div.className = 'line';
    const im = document.createElement('img'); im.src = c.imageUrl; im.alt = c.title;
    const mid = document.createElement('div');
    const strong = document.createElement('strong'); strong.textContent = c.title;
    const det = document.createElement('div'); det.className = 'muted';
    det.textContent = [c.category, 'Size: '+c.size, 'Paper/finish: '+c.paper, 'Border: '+c.border, 'Signed: '+c.signed, 'Delivery: '+c.delivery, lineTotalText(c)].join(' · ');
    const qdiv = document.createElement('div'); qdiv.className = 'qty';
    const minus = document.createElement('button'); minus.type='button'; minus.textContent='−'; minus.addEventListener('click',()=>changeCart(c,-1));
    const qspan = document.createElement('span'); qspan.textContent = 'Qty: ' + c.quantity;
    const plus = document.createElement('button'); plus.type='button'; plus.textContent='+'; plus.addEventListener('click',()=>changeCart(c,1));
    qdiv.append(minus,qspan,plus);
    mid.append(strong,det,qdiv);
    const rem = document.createElement('button'); rem.type='button'; rem.textContent='Remove'; rem.addEventListener('click',()=>changeCart(c,'remove'));
    div.append(im,mid,rem); wrap.appendChild(div);
  });
}
function setCategory(cat, push){
  activeCat = cat;
  document.querySelectorAll('.filters button[data-cat]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat===cat)));
  if(push){ const u = new URL(location.href); if(cat==='all') u.searchParams.delete('category'); else u.searchParams.set('category', cat); history.replaceState(null,'',u); }
  render();
}
document.querySelectorAll('.filters button[data-cat]').forEach(b => b.addEventListener('click', ()=> setCategory(b.dataset.cat, true)));
$('#search').addEventListener('input', e => { searchText = e.target.value; render(); });
$('#open-cart').addEventListener('click', async()=> { if(!await account.requireLogin())return;updateCart(); $('#cartpanel').showModal(); });
$('#close-cart').addEventListener('click', ()=> $('#cartpanel').close());
$('#clear-cart').addEventListener('click',async()=>{
  if(cartWorking||!await account.requireLogin())return;cartWorking=true;
  try{await account.clearCart();await account.clearPrintAttempt();attempt=null;$('#checkout button[type=submit]').disabled=false;$('#preview').hidden=true;$('#copy-preview').hidden=true;}
  catch(error){cartStatus(error.code?account.message(error):error.message,true);}finally{cartWorking=false;}
});
let submitting = false, attempt = null;
function receiptText(heading, paragraphs){
  const conf = $('#order-confirmation'); conf.replaceChildren();
  const h = document.createElement('h3'); h.textContent = heading; conf.append(h);
  for(const value of paragraphs){ const p=document.createElement('p'); p.textContent=value; conf.append(p); }
  conf.hidden=false;
}
$('#checkout').addEventListener('submit', async e => {
  e.preventDefault(); if(submitting) return;if(!await account.requireLogin())return;if(!account.user.emailVerified){receiptText('Verify your email first.', ['Open My account to verify your email. Your cart will stay saved.']);return;}if(!cartReady||cartWorking){receiptText('Your cart is still syncing.', ['Wait for the saved message, then try again.']);return;}
  if(!cart.length){ receiptText('Choose a photograph first.', ['Your cart is empty. Continue browsing to find a print you love.']); return; }
  const fd=Object.fromEntries(new FormData(e.target));
  const snapshot=cart.map(c=>({...c})).sort((a,b)=>a.key.localeCompare(b.key));
  const fingerprint=JSON.stringify({fd,items:snapshot.map(cartRecord)});
  if(!attempt || attempt.fingerprint!==fingerprint) attempt={fingerprint,id:crypto.randomUUID(),received:[],done:false};
  if(attempt.done) return;
  const submissionUid=account.user.uid,currentAttempt=attempt;
  submitting=true;
  const controls=Array.from(document.querySelectorAll('#cartpanel input,#cartpanel select,#cartpanel textarea,#cartpanel button,#catalog button'));
  const previous=controls.map(el=>el.disabled); controls.forEach(el=>el.disabled=true);
  receiptText('Sending your inquiry…',['Keep this page open while your print details are sent.']);
  try{
    await account.saveProfile({name:fd.client,phone:fd.phone||''});
    currentAttempt.id=await account.preparePrintInquiry(fingerprint);
    if(account.user?.uid!==submissionUid)return;
    const subtotal=snapshot.reduce((n,c)=>n+(exampleUnit(c)??0)*c.quantity,0);
    for(const [i,c] of snapshot.entries()){
      if(account.user?.uid!==submissionUid)throw Error('Your account changed. Please sign in again to continue.');
      if(currentAttempt.received[i]) continue;
      const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),20000);
      try{
        const optionsResponse=await fetch('https://photography-hub.andreottati.chatgpt.site/api/print-options?image='+encodeURIComponent(c.imageUrl),{signal:controller.signal});
        if(!optionsResponse.ok)throw Error('Unable to check print options. Please try again.');
        const options=await optionsResponse.json();
        const acceptedSize=compatiblePrintSize(c.size,options.options||[]);
        const r=await fetch('https://photography-hub.andreottati.chatgpt.site/api/print-request',{
          method:'POST',headers:{'Content-Type':'application/json'},signal:controller.signal,
          body:JSON.stringify({client:fd.client,email:fd.email,phone:fd.phone||null,
            imageUrl:c.imageUrl,imageTitle:c.title,printSize:acceptedSize,quantity:c.quantity,
            requests:'Requested print size: '+c.size+'; Paper: '+c.paper+'; Border: '+c.border+' '+(c.borderSize||'')+'; Delivery: '+c.delivery+'; Payment preference: '+fd.payment+'; Price per print: '+(exampleUnit(c)===null?'To confirm':money(exampleUnit(c)))+'; Cart subtotal: '+money(subtotal)+'; Cart reference: '+currentAttempt.id+'; Customer account reference: '+account.user.uid+'; '+(fd.requests||'')+(fd.address?'; Shipping address: '+fd.address:''),
            requestId:currentAttempt.id+'-'+i})});
        const j=await r.json().catch(()=>({})); if(!r.ok) throw Error(j.error||'Unable to send this item.');
        currentAttempt.received[i]=j.id||'received';
      }finally{clearTimeout(timeout);}
    }
    const summary=snapshot.map(c=>c.title+' · '+c.size+' · '+c.paper+' · '+c.border+' '+c.borderSize+' · quantity '+c.quantity+' · '+lineTotalText(c)).join('\n');
    if(account.user?.uid!==submissionUid)return;
    await account.recordInquiry(currentAttempt.id,{type:'print',hubReference:currentAttempt.received.join(', '),summary});
    if(account.user?.uid!==submissionUid)return;
    currentAttempt.done=true;
    $('#preview').textContent=summary+'\nPrint subtotal: '+money(subtotal)+'; shipping, tax and any custom options to confirm.\nReference: '+currentAttempt.id;
    $('#preview').hidden=false; $('#copy-preview').hidden=false;
    receiptText('Your print inquiry is received.',[
      snapshot.reduce((n,c)=>n+c.quantity,0)+' prints requested. Reference: '+currentAttempt.id,
      'Andre will contact you to confirm the prints, final price and delivery. Payment is made directly to Andre after confirmation. Nothing has been charged or ordered.',
      'Payment preference: '+fd.payment+'. Your inquiry is not an order confirmation.'
    ]);
  }catch(error){
    if(account.user?.uid!==submissionUid)return;
    receiptText('Your inquiry needs another try.',[
      error.name==='AbortError'?'The connection took too long.':error.message,
      'Your cart is saved to your account. Retry without changing the details to finish saving the inquiry without resending items already received, or contact Andre directly.'
    ]);
  }finally{
    submitting=false; controls.forEach((el,i)=>el.disabled=previous[i]);
    if(account.user?.uid===submissionUid&&currentAttempt.done) e.target.querySelector('button[type="submit"]').disabled=true;
  }
});
$('#copy-preview').addEventListener('click', async () => {
  try{await navigator.clipboard.writeText($('#preview').textContent); $('#copy-preview').textContent='Copied';}
  catch{receiptText('Select the summary to copy it.', ['Your browser could not copy automatically.']);}
});
$('#checkout').addEventListener('input',()=>{if(!submitting)$('#checkout button[type="submit"]').disabled=false;});
const pageParams = new URLSearchParams(location.search);
const initial = pageParams.get('category');
const incomingPrint=selectedPrint(pageParams.get('image'),CATALOG);
if(!incomingPrint && initial && ['city','wild','wildlife','road'].includes(initial)) setCategory(initial, false); else render();
if(incomingPrint)requestAnimationFrame(()=>Array.from(grid.children).find(card=>card.dataset.photo===incomingPrint.src)?.querySelector('[data-open-print]').click());
updateCart();

account.onChange(({user,profile,problem})=>{
  document.querySelectorAll('[data-account-link]').forEach(el=>el.textContent=user?'My account':'Log in');
  if(user?.uid===cartUid&&user){if(profile&&!$('#checkout').contains(document.activeElement)){const f=$('#checkout').elements;f.client.value=f.client.value||profile.name||'';f.phone.value=f.phone.value||profile.phone||'';}return;}
  cartUid=user?.uid||null;cart=[];cartReady=false;attempt=null;$('#checkout').reset();$('#preview').textContent='';$('#preview').hidden=true;$('#copy-preview').hidden=true;$('#order-confirmation').replaceChildren();$('#order-confirmation').hidden=true;$('#cartpanel').close();updateCart();
  if(!user){cartStatus(problem||'Browse freely. Log in to save your print cart.',!!problem);return;}
  const f=$('#checkout').elements;f.client.value=profile?.name||user.displayName||'';f.email.value=user.email||'';f.email.readOnly=true;f.phone.value=profile?.phone||'';
  cartStatus('Loading your saved cart…');
  account.watchCart((lines,saved)=>{
    if(account.user?.uid!==user.uid)return;
    cart=lines.flatMap(line=>{const photo=CATALOG.find(p=>p.src===line.photoId);return photo?[{...line,key:line.id,title:photo.title,imageUrl:photo.imageUrl,category:photo.category,borderSize:line.borderSize+' in',signed:'Unsigned'}]:[];});cartReady=saved;updateCart();cartStatus(saved?'Cart saved to your account. Return any time, on any device.':'Syncing your cart…');
    if(saved&&pageParams.get('cart')==='1'){pageParams.delete('cart');$('#open-cart').click();}
  },error=>{cartReady=false;cartStatus(error,true);});
});
