const VAYNOR_PRODUCTS=[
{id:1,name:"Aero Carry Bag",category:"Fashion",price:1490,tag:"Trending",tone:"dark",desc:"A clean everyday carry designed for modern movement."},
{id:2,name:"Luma Desk Lamp",category:"Home",price:1890,tag:"New",tone:"light",desc:"Minimal ambient lighting for focused spaces."},
{id:3,name:"Pulse Wireless Earbuds",category:"Electronics",price:2490,tag:"Popular",tone:"dark",desc:"Compact wireless audio with a clean everyday silhouette."},
{id:4,name:"Mono Ceramic Set",category:"Home",price:990,tag:"New",tone:"light",desc:"Modern ceramic essentials for a refined table."},
{id:5,name:"Orbit Smart Watch",category:"Electronics",price:3290,tag:"Trending",tone:"dark",desc:"A versatile daily wearable with a minimalist face."},
{id:6,name:"North Overshirt",category:"Fashion",price:2190,tag:"Popular",tone:"light",desc:"Relaxed layering piece with a timeless profile."},
{id:7,name:"Fold Travel Organizer",category:"Accessories",price:790,tag:"New",tone:"dark",desc:"Keep small essentials organized wherever you go."},
{id:8,name:"Aura Water Bottle",category:"Lifestyle",price:690,tag:"Popular",tone:"light",desc:"Reusable everyday bottle with a clean matte finish."}];
const money=n=>"৳"+Number(n).toLocaleString("en-BD"),$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
function getCart(){return JSON.parse(localStorage.getItem("vaynor_cart")||"[]")}function setCart(c){localStorage.setItem("vaynor_cart",JSON.stringify(c));updateCartCount()}
function getWish(){return JSON.parse(localStorage.getItem("vaynor_wish")||"[]")}function setWish(w){localStorage.setItem("vaynor_wish",JSON.stringify(w))}
function updateCartCount(){let n=getCart().reduce((a,x)=>a+x.qty,0);$$(".cart-count").forEach(e=>e.textContent=n)}
function toast(m){let t=$("#toast");if(!t)return;t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}
function productArt(p){return `<div class="product-art ${p.tone}"></div>`}
function productCard(p){let w=getWish().includes(p.id);return `<article class="product-card reveal"><div class="product-media"><button class="wish" onclick="toggleWish(${p.id})">${w?"♥":"♡"}</button><a href="product.html?id=${p.id}">${productArt(p)}</a><span style="position:absolute;left:12px;top:12px"><span class="badge">${p.tag}</span></span></div><div class="product-info"><h3>${p.name}</h3><div class="muted">${p.category}</div><div class="price">${money(p.price)}</div></div></article>`}
function toggleWish(id){let w=getWish();w=w.includes(id)?w.filter(x=>x!==id):[...w,id];setWish(w);toast(w.includes(id)?"Added to wishlist":"Removed from wishlist");if(typeof renderProducts==="function")renderProducts();if(typeof renderWishlist==="function")renderWishlist()}
function addToCart(id,qty=1){let c=getCart(),x=c.find(a=>a.id===id);if(x)x.qty+=qty;else c.push({id,qty});setCart(c);toast("Added to cart")}
document.addEventListener("DOMContentLoaded",()=>{$("#menuBtn")?.addEventListener("click",()=>$("#navlinks")?.classList.toggle("open"));updateCartCount();$("#intro")?.removeAttribute("aria-hidden");if(sessionStorage.getItem("vaynor_intro"))$("#intro")?.remove();else sessionStorage.setItem("vaynor_intro","1")});
