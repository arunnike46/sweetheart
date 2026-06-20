// Configuration for API endpoint
const DEPLOYED_API_BASE = "https://sweetheart-backend-api.vercel.app/api";
const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:8080/api'
  : DEPLOYED_API_BASE;

  let orders = [];
/* ══ CAKES ══ */
const CAKES=[
  {name:"Strawberry Dream",    badge:"Bestseller",price:"₹1,299",desc:"Vanilla sponge with fresh strawberry compote and whipped cream rosettes.",             img:"https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80"},
  {name:"Butterscotch Delight",badge:"Classic",   price:"₹1,199",desc:"Golden sponge soaked in butterscotch syrup with caramel cream and toffee crunch.",     img:"https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&q=80"},
  {name:"Classic Red Velvet",  badge:"Signature", price:"₹1,499",desc:"Velvety crimson cocoa layers crowned with luscious cream cheese frosting.",             img:"https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=400&q=80"},
  {name:"Black Forest Gateau", badge:"Popular",   price:"₹1,399",desc:"Dark chocolate sponge, morello cherries, Kirsch syrup and whipped cream clouds.",       img:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80"},
  {name:"White Forest Fantasy",badge:"New",       price:"₹1,349",desc:"Vanilla sponge with white chocolate ganache, fresh cream and juicy cherries.",           img:"https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=400&q=80"},
  {name:"Mango Mousse",        badge:"Seasonal",  price:"₹1,449",desc:"Alphonso mango mousse on a coconut biscuit base — pure summer sunshine.",               img:"https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400&q=80"},
  {name:"Dark Choco Truffle",  badge:"Indulgent", price:"₹1,549",desc:"Belgian chocolate sponge, glossy ganache drip and hand-rolled truffle topping.",        img:"https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80"},
  {name:"Blueberry Cheesecake",badge:"Premium",   price:"₹1,599",desc:"NY-style baked cheesecake on digestive crust with blueberry compote topping.",          img:"https://images.unsplash.com/photo-1562440499-64c9a111f713?w=400&q=80"},
  {name:"Pineapple Cream",     badge:"Refreshing",price:"₹1,099",desc:"Vanilla sponge with pineapple crush, fresh cream and caramelised pineapple rings.",      img:"https://images.unsplash.com/photo-1613312328068-c9b6b76c9e8a?w=400&q=80"},
  {name:"Caramel Crunch",      badge:"Chef's Pick",price:"₹1,499",desc:"Salted caramel buttercream, honeycomb shards and a praline crunch surprise inside.",   img:"https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=80"},
  {name:"Lemon Zest Drizzle",  badge:"Light",     price:"₹1,349",desc:"Tangy lemon curd, elderflower cream and candied citrus on a light almond sponge.",      img:"https://images.unsplash.com/photo-1519869325930-281384150729?w=400&q=80"},
  {name:"Rose & Pistachio",    badge:"Luxury",    price:"₹1,699",desc:"Rosewater sponge, pistachio cream, dried rose petals and silver leaf — Persian luxury.", img:"https://images.unsplash.com/photo-1604413191066-4dd20bedf486?w=400&q=80"},
  {name:"Tiramisu Opera",      badge:"Artisan",   price:"₹1,749",desc:"Coffee-soaked joconde sponge, mascarpone cream and dusted cocoa — Parisian elegance.",   img:"https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80"},
  {name:"Rainbow Funfetti",    badge:"Party",     price:"₹1,299",desc:"Six vibrant vanilla layers packed with rainbow sprinkles and vanilla buttercream.",       img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"},
  {name:"Hazelnut Ferrero",    badge:"Indulgent", price:"₹1,849",desc:"Chocolate hazelnut mousse, feuilletine crunch and a crown of Ferrero Rocher truffles.",  img:"https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80"},
];

/* ══ BUILD GALLERY & SELECTS ══ */
document.addEventListener('DOMContentLoaded', () => {

    const grid = document.getElementById('cgrid');

    const bookingCake =
        document.getElementById('b_cake');

    const editCake =
        document.getElementById('e_cake');

    if (bookingCake && editCake) {

        [bookingCake, editCake].forEach(select => {

            CAKES.forEach(cake => {

                select.innerHTML +=
                    `<option>${cake.name}</option>`;

            });

        });

    }

    if (grid) {

        CAKES.forEach(cake => {

            grid.innerHTML += `
            <div class="ccard">
                <div class="cimg">
                    <img src="${cake.img}" alt="${cake.name}">
                    <span class="cbadge">${cake.badge}</span>
                </div>

                <div class="cinfo">
                    <div class="cname">${cake.name}</div>
                    <div class="cdesc">${cake.desc}</div>
                    <div class="cprice">${cake.price} onwards</div>
                </div>
            </div>`;
        });

    }

    setMinDates();

    const bookingDate =
        document.getElementById('b_date');

    if (bookingDate) {

        bookingDate.addEventListener(
            'change',
            function () {

                const hint =
                    document.getElementById('dateHint');

                const today = new Date();
                today.setHours(0,0,0,0);

                const selected =
                    new Date(this.value);

                selected.setHours(0,0,0,0);

                if (selected <= today) {

                    hint.textContent =
                        '⚠ Please select a date at least 1 day ahead.';

                    this.value = '';

                } else {

                    hint.textContent = '';

                }
            }
        );
    }

});

/* ══ SET MIN DATE (tomorrow) ══ */
function tomorrow(){const d=new Date();d.setDate(d.getDate()+1);return d.toISOString().split('T')[0]}
function setMinDates(){
  const t=tomorrow();
  document.getElementById('b_date').min=t;
  document.getElementById('e_date').min=t;
}
setMinDates();

document.getElementById('b_date').addEventListener('change',function(){
  const hint=document.getElementById('dateHint');
  const today=new Date();today.setHours(0,0,0,0);
  const sel=new Date(this.value);sel.setHours(0,0,0,0);
  if(sel<=today){
    hint.textContent='⚠ Please select a date at least 1 day ahead.';
    this.value='';
  } else { hint.textContent=''; }
});

/* ══ OVERLAYS ══ */
function openOv(id){document.getElementById(id).classList.add('active')}
function closeOv(id){document.getElementById(id).classList.remove('active')}
document.querySelectorAll('.ov').forEach(o=>o.addEventListener('click',e=>{if(e.target===o)o.classList.remove('active')}));

/* ══ BOOKING ══ */
function openBook(){
  document.getElementById('bkForm').style.display='block';
  document.getElementById('confBox').classList.remove('show');
  openOv('ovBook');
}
async function submitBook() {

  const name = document.getElementById('b_name').value.trim();
  const phone = document.getElementById('b_phone').value.trim();
  const cake = document.getElementById('b_cake').value;
  const date = document.getElementById('b_date').value;
  const time = document.getElementById('b_time').value;
  const query = document.getElementById('b_query').value.trim();

  if (!name || !phone || !cake || !date || !time) {
    alert('⚠ Please fill all required fields');
    return;
  }

  try {

    const response = await fetch(
      `${API_BASE}/bookings`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          phone,
          cakeName: cake,
          requiredDate: date,
          requiredTime: time,
          query
        })
      }
    );

    if (!response.ok) {
      throw new Error('Booking failed');
    }

    const data = await response.json();

    document.getElementById('pinDisp').textContent = data.pin;

    document.getElementById('csum').innerHTML = `
      <strong>Name:</strong> ${name}<br>
      <strong>Phone:</strong> ${phone}<br>
      <strong>Cake:</strong> ${cake}<br>
      <strong>Date:</strong> ${fmtD(date)} at ${fmtT(time)}
    `;

    document.getElementById('bkForm').style.display = 'none';
    document.getElementById('confBox').classList.add('show');

  } catch (err) {
    alert('Booking failed: ' + err.message);
  }
}
function resetBook(){
  ['b_name','b_phone','b_time','b_query'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('b_cake').value='';
  document.getElementById('b_date').value='';
  document.getElementById('dateHint').textContent='';
  document.getElementById('bkForm').style.display='block';
  document.getElementById('confBox').classList.remove('show');
}

/* ══ PASSWORD ══ */
const PWD='102003';
function buildDots(){
  const d=document.getElementById('pwdots');
  d.innerHTML='';
  for(let i=0;i<6;i++) d.innerHTML+=`<div class="pdot" id="pd${i}"></div>`;
}
function openPW(){
  buildDots();
  document.getElementById('pwinput').value='';
  document.getElementById('pwerr').textContent='';
  openOv('ovPW');
  setTimeout(()=>document.getElementById('pwinput').focus(),300);
}
function onPWIn(){
  const v=document.getElementById('pwinput').value;
  for(let i=0;i<6;i++) document.getElementById('pd'+i).classList.toggle('on',i<v.length);
  document.getElementById('pwerr').textContent='';
}
function togPW(){
  const i=document.getElementById('pwinput');
  const b=document.getElementById('pwtog');
  i.type=i.type==='password'?'text':'password';
  b.textContent=i.type==='password'?'👁':'🙈';
}

 async function checkPW() {

  const password =
      document.getElementById('pwinput').value;

  try {

    const response = await fetch(
      `${API_BASE}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password
        })
      }
    );

    const data = await response.json();

    if (data.success) {

      closeOv('ovPW');

      document.getElementById('pwinput').value = '';

      await renderOrders();

      openOv('ovOrd');

    } else {

      document.getElementById('pwerr').textContent =
          data.message;

    }

  } catch (err) {

    document.getElementById('pwerr').textContent =
        'Server connection failed';
  }
}


/* ══ DROPDOWN MENU ══ */

var activeMenu = null;

function toggleMenu(id) {

    const el =
        document.getElementById('dd-' + id);

    if (!el) {
        console.log('Dropdown not found:', id);
        return;
    }

    if (activeMenu && activeMenu !== el) {
        activeMenu.classList.remove('open');
    }

    el.classList.toggle('open');

    activeMenu =
        el.classList.contains('open')
            ? el
            : null;
}
document.addEventListener('click',e=>{
  if(activeMenu&&!e.target.closest('.menu-wrap')){activeMenu.classList.remove('open');activeMenu=null}
});

/* ══ RENDER ORDERS ══ */

  async function renderOrders() {

  try {

    const response =
      await fetch(`${API_BASE}/bookings`);

    orders = await response.json();

    const wrap = document.getElementById('ordwrap');
    const cnt = document.getElementById('ocnt');

    if (!orders.length) {

      wrap.innerHTML =
        '<div class="ordmpty">No bookings yet</div>';

      return;
    }

    cnt.textContent =
      `${orders.length} booking(s)`;

    const rows = orders.map((o,index)=>`

<tr class="${o.urgencyColor}">
  <td>${index+1}</td>
  <td>${o.pin}</td>
  <td>${o.name}</td>
  <td>${o.cakeName}</td>
  <td>${o.requiredDate}<br>${o.requiredTime}</td>
  <td>${o.daysLeft} days</td>
  <td>${o.query || '-'}</td>

  <td>
    <div class="menu-wrap">

      <button class="mbtn"
        onclick="toggleMenu(${o.id})">
        ☰ Menu ▾
      </button>

      <div class="mdrop" id="dd-${o.id}">
        <button class="mopt-edit"
          onclick="openEdit(${o.id})">
          ✏ Update
        </button>

        <button class="mopt-del"
          onclick="delOrd(${o.id})">
          🗑 Delete
        </button>
      </div>

    </div>
  </td>

</tr>

`).join('');

    wrap.innerHTML = `
      <div class="owrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>PIN</th>
              <th>Name</th>
              <th>Cake</th>
              <th>Date</th>
              <th>Days Left</th>
              <th>Query</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;

  } catch (err) {

    console.error(err);

  }
}


/* ══ EDIT ══ */
  function openEdit(id){

    alert("Edit clicked: " + id);

    const o = orders.find(order => Number(order.id) === Number(id));

    console.log(o);

    if(!o){
        alert("Booking not found");
        return;
    }

    document.getElementById('e_id').value = o.id;
    document.getElementById('e_name').value = o.name;
    document.getElementById('e_phone').value = o.phone;
    document.getElementById('e_cake').value = o.cakeName;
    document.getElementById('e_date').value = o.requiredDate;
    document.getElementById('e_time').value = o.requiredTime;
    document.getElementById('e_query').value = o.query || '';

    openOv('ovEdit');
}
  async function saveEdit() {

  const id =
      document.getElementById('e_id').value;

  const name =
      document.getElementById('e_name').value;

  const phone =
      document.getElementById('e_phone').value;

  const cakeName =
      document.getElementById('e_cake').value;

  const requiredDate =
      document.getElementById('e_date').value;

  const requiredTime =
      document.getElementById('e_time').value;

  const query =
      document.getElementById('e_query').value;

  try {

    await fetch(
      `${API_BASE}/bookings/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          phone,
          cakeName,
          requiredDate,
          requiredTime,
          query
        })
      }
    );

    closeOv('ovEdit');

    renderOrders();

  } catch (err) {

    alert("Update failed");

  }
}

  async function delOrd(id) {

  if (!confirm("Delete booking?")) {
    return;
  }

  try {

    await fetch(
      `${API_BASE}/bookings/${id}`,
      {
        method: 'DELETE'
      }
    );

    renderOrders();

  } catch (err) {

    alert("Delete failed");

  }
}



/* ══ HELPERS ══ */
function x(s){return(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function fmtD(d){if(!d)return'—';const[y,m,dd]=d.split('-');return`${dd} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+m-1]} ${y}`}
function fmtT(t){if(!t)return'—';const[h,m]=t.split(':');return`${(+h%12)||12}:${m} ${+h>=12?'PM':'AM'}`}