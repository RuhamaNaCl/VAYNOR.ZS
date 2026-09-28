 document.addEventListener("DOMContentLoaded",()=>{const p=window.VAYNOR_PRODUCT;if(p){const s=document.getElementById("shop-name"),v=document.getElementById("shop-price"),n=document.getElementById("product-name"),pr=document.getElementById("product-price");if(s)s.textContent=p.name;if(n)n.textContent=p.name;const price=p.price?"৳"+Number(p.price).toLocaleString("en-BD"):"Set price in js/products.js";if(v)v.textContent=price;if(pr)pr.textContent=price;}const c=document.getElementById("cart-count");if(c&&window.VAYNORCart)c.textContent=window.VAYNORCart.count();});


/* VAYNOR Intro Controller */
document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("vaynor-intro");
  const skip = document.getElementById("intro-skip");

  if (!intro) return;

  let closed = false;

  function closeIntro() {
    if (closed) return;
    closed = true;

    intro.classList.add("intro-hidden");

    setTimeout(() => {
      intro.remove();
    }, 1100);
  }

  skip?.addEventListener("click", closeIntro);

  // Intro automatically closes after 4.5 seconds.
  setTimeout(closeIntro, 4500);
});

