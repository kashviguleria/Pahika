
// =========================
// DATA
// =========================

var products = [
  { id:1, name:"Velvet Rose Lipstick", brand:"PAHIKA LIP", emoji:"💄", cat:"lips", price:1299, old:1799, badge:"hot", bg:"linear-gradient(135deg,#F9D5D5,#F0B0B5)", desc:"Long-lasting velvet finish. 12hr wear." },
  { id:2, name:"Glow Serum Elixir", brand:"PAHIKA SKIN", emoji:"✨", cat:"skin", price:2499, old:3299, badge:"new", bg:"linear-gradient(135deg,#FFF0D5,#FFD580)", desc:"Vitamin C & Hyaluronic acid powerhouse." },
  { id:3, name:"Kohl Drama Liner", brand:"PAHIKA EYES", emoji:"👁", cat:"eyes", price:799, old:null, badge:null, bg:"linear-gradient(135deg,#E8E0F5,#C8B4D4)", desc:"Smoky or precise, it does it all." },
  { id:4, name:"Bloom Perfume", brand:"PAHIKA SCENT", emoji:"🌺", cat:"fragrance", price:3499, old:4599, badge:"sale", bg:"linear-gradient(135deg,#FFE0EC,#FFBCCC)", desc:"Floral bouquet with musk base notes." },
  { id:5, name:"Cream Blush Duo", brand:"PAHIKA LIP", emoji:"🌸", cat:"lips", price:999, old:null, badge:"new", bg:"linear-gradient(135deg,#FFDDE0,#FFBBC0)", desc:"Buildable flush for cheeks & lips." },
  { id:6, name:"Jade Roller Set", brand:"PAHIKA TOOLS", emoji:"💎", cat:"tools", price:1599, old:2299, badge:null, bg:"linear-gradient(135deg,#D4F5E0,#A8DFC0)", desc:"De-puff & sculpt your way to glow." },
 
 
];

var testimonials = [
  { name:"Priya Sharma", role:"Beauty Blogger", text:"Pahika's Glow Serum literally transformed my skin in 2 weeks. I've never had so many compliments!", stars:5, avatar:"👩🏽" },
  { name:"Anya Kapoor", role:"Model & Influencer", text:"The velvet lipstick stays on through everything — meals, photoshoots, late nights. Absolute game changer.", stars:5, avatar:"👩🏻" },
  { name:"Meera Nair", role:"Dermatologist", text:"As a derm, I'm picky. Pahika's clean formulas are genuinely impressive. I recommend them to my patients.", stars:5, avatar:"👩🏾‍⚕️" },
 
];

var quizResults = [
  { icon:"🌟", type:"The Radiance Queen", desc:"Your skin craves glow and luminosity. We recommend our Vitamin C Glow Serum, Dewy Setting Spray, and Rose Gold Highlighter for that lit-from-within look." },
  { icon:"🌹", type:"The Timeless Beauty", desc:"Elegant and refined. Our Anti-Aging Peptide Cream, Firming Eye Serum, and Velvet Lipstick Collection are your perfect match." },
  { icon:"💎", type:"The Clear Skin Goddess", desc:"Clean and confident. Our Niacinamide Serum, Oil-Free Moisturizer, and Mattifying Primer will keep breakouts away." },
 
];

// =========================
// STORED DATA (no localStorage — in-memory)
// =========================

var storedEmail = "";       // email saved when user signs in
var cartItems = [];         // array of product objects in cart
var cartCount = 0;

// =========================
// LOADING SCREEN
// =========================

window.onload = function() {
  setTimeout(function() {
    var loading = document.getElementById('loading');
    loading.style.opacity = '0';
    setTimeout(function() {
      loading.style.display = 'none';
    }, 500);
  }, 2200);
};




// =========================
// SIGNIN — strict email only
// =========================
// =============================================
// USER STORE — in-memory account storage
// =============================================
var userStore = {};      // { "email@x.com": { name, password } }
var currentUser = null;  // { email, name } when logged in

// =============================================
// TAB SWITCHER
// =============================================
function switchAuthTab(tab) {
  var isSignin = tab === 'signin';

  document.getElementById('form-signin').style.display = isSignin ? 'block' : 'none';
  document.getElementById('form-signup').style.display = isSignin ? 'none' : 'block';

  document.getElementById('tab-signin').style.background = isSignin ? 'rgba(232,180,184,0.2)' : 'none';
  document.getElementById('tab-signin').style.color      = isSignin ? 'white' : 'rgba(255,255,255,0.5)';
  document.getElementById('tab-signin').style.border     = isSignin ? '1px solid rgba(232,180,184,0.3)' : 'none';

  document.getElementById('tab-signup').style.background = !isSignin ? 'rgba(232,180,184,0.2)' : 'none';
  document.getElementById('tab-signup').style.color      = !isSignin ? 'white' : 'rgba(255,255,255,0.5)';
  document.getElementById('tab-signup').style.border     = !isSignin ? '1px solid rgba(232,180,184,0.3)' : 'none';

  // clear all messages when switching
  ['signin-error','signin-success','signup-error','signup-success'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) { el.textContent = ''; el.classList.remove('show'); }
  });
}

function showMsg(id, text) {
  var el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.classList.add('show');
}

function hideMsg(id) {
  var el = document.getElementById(id);
  if (el) { el.textContent = ''; el.classList.remove('show'); }
}

// =============================================
// SIGN IN
// =============================================
function handleSignin() {
  hideMsg('signin-error');
  hideMsg('signin-success');

  var email    = document.getElementById('signin-email').value.trim().toLowerCase();
  var password = document.getElementById('signin-password').value;

  // Validate
  if (!email || !email.includes('@') || !email.includes('.')) {
    showMsg('signin-error', '⚠️ Please enter a valid email (e.g. name@example.com)');
    return;
  }
  if (!password) {
    showMsg('signin-error', '⚠️ Please enter your password.');
    return;
  }

  // Check account exists
  var account = userStore[email];
  if (!account) {
    showMsg('signin-error', '❌ No account found with this email. Please create one first.');
    return;
  }

  // Check password
  if (account.password !== password) {
    showMsg('signin-error', '❌ Incorrect password. Please try again.');
    return;
  }

  // Success
  showMsg('signin-success', '✅ Welcome back, ' + account.name + '! Redirecting...');
  currentUser = { email: email, name: account.name };

  setTimeout(function() {
    enterSite();
  }, 1000);
}

// =============================================
// SIGN UP
// =============================================
function handleSignup() {
  hideMsg('signup-error');
  hideMsg('signup-success');

  var name     = document.getElementById('signup-name').value.trim();
  var email    = document.getElementById('signup-email').value.trim().toLowerCase();
  var password = document.getElementById('signup-password').value;
  var confirm  = document.getElementById('signup-confirm').value;

  if (!name) {
    showMsg('signup-error', '⚠️ Please enter your full name.');
    return;
  }
  if (!email || !email.includes('@') || !email.includes('.')) {
    showMsg('signup-error', '⚠️ Please enter a valid email address.');
    return;
  }
  if (password.length < 6) {
    showMsg('signup-error', '⚠️ Password must be at least 6 characters.');
    return;
  }
  if (password !== confirm) {
    showMsg('signup-error', '⚠️ Passwords do not match.');
    return;
  }
  if (userStore[email]) {
    showMsg('signup-error', '⚠️ An account with this email already exists. Please sign in.');
    return;
  }

  // Save account
  userStore[email] = { name: name, password: password };
  currentUser = { email: email, name: name };

  showMsg('signup-success', '✅ Account created! Welcome to Pahika, ' + name + '!');

  setTimeout(function() {
    enterSite();
  }, 1000);
}

// =============================================
// ENTER SITE (shared by signin + signup)
// =============================================
function enterSite() {
  var overlay = document.getElementById('signin-overlay');
  overlay.style.opacity = '0';
  overlay.style.transition = 'opacity 0.8s ease';
  setTimeout(function() {
    overlay.style.display = 'none';
  }, 800);

  // Optional: update a navbar user display if you have one
  // e.g. document.getElementById('userNameDisplay').textContent = currentUser.name;
}

// =============================================
// FORGOT PASSWORD MODAL
// =============================================
function openForgot() {
  var box = document.getElementById('forgot-box');
  box.style.display = 'flex';
  document.getElementById('forgotEmail').value = '';
  document.getElementById('forgotMsg').textContent = '';
}

function closeForgot() {
  document.getElementById('forgot-box').style.display = 'none';
}

function sendReset() {
  var email = document.getElementById('forgotEmail').value.trim().toLowerCase();
  var msg   = document.getElementById('forgotMsg');

  if (!email || !email.includes('@') || !email.includes('.')) {
    msg.style.color = '#C4727A';
    msg.textContent = '⚠️ Please enter a valid email.';
    return;
  }

  if (!userStore[email]) {
    msg.style.color = '#C4727A';
    msg.textContent = '❌ No account found with this email.';
    return;
  }

  // In a real app you'd call an API here
  msg.style.color = '#2C9A5C';
  msg.textContent = '✅ Reset link sent! Check your inbox.';
}
// =========================
// NAVBAR SCROLL
// =========================

window.addEventListener('scroll', function() {
  var nav = document.getElementById('navbar');
  var scrollBtn = document.getElementById('scrollTop');

  // Navbar effect
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }

  // Scroll button visibility
  if (window.scrollY > 300) {
    scrollBtn.classList.add('show');
  } else {
    scrollBtn.classList.remove('show');
  }

  revealOnScroll();
});

function scrollToSection(id) {
  var el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

function goHome() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
// =========================
// MARQUEE
// =========================

var marqueeTexts = ['Free Shipping Over ₹999', 'Clean Beauty', 'Cruelty Free 🐰', 'Dermatologist Tested', 'Vegan Formulas', 'Award Winning', 'SPF Protection', '50K+ Happy Customers'];
var m1 = document.getElementById('marquee1');
var marqHTML = '';
var i = 0;
while (i < 4) {
  var j = 0;
  while (j < marqueeTexts.length) {
    marqHTML += '<div class="marquee-item">' + marqueeTexts[j] + '<span>✦</span></div>';
    j++;
  }
  i++;
}
m1.innerHTML = marqHTML;

// =========================
// PRODUCTS
// =========================

function renderProducts(filter) {
  var grid = document.getElementById('productsGrid');
  grid.innerHTML = '';

  var delay = 0;

  for (var i = 0; i < products.length; i++) {
    var p = products[i];

    if (filter !== 'all' && p.cat !== filter) {
      continue;
    }

    var badgeHTML = '';
    if (p.badge === 'hot') {
      badgeHTML = '<div class="product-badge badge-hot">🔥 HOT</div>';
    } else if (p.badge === 'new') {
      badgeHTML = '<div class="product-badge badge-new">✨ NEW</div>';
    } else if (p.badge === 'sale') {
      badgeHTML = '<div class="product-badge badge-sale">🏷️ SALE</div>';
    }

    var oldPriceHTML = '';
    if (p.old !== null) {
      oldPriceHTML = '<span class="product-price-old">₹' + p.old.toLocaleString() + '</span>';
    }

    var card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML =
      '<div class="product-img-wrap">' +
        '<div class="product-img-bg" style="background:' + p.bg + '"></div>' +
        badgeHTML +
        '<div class="product-emoji">' + p.emoji + '</div>' +
      '</div>' +
      '<div class="product-info">' +
        '<div class="product-brand">' + p.brand + '</div>' +
        '<div class="product-name">' + p.name + '</div>' +
        '<div class="product-desc">' + p.desc + '</div>' +
        '<div class="product-footer">' +
          '<div><span class="product-price">₹' + p.price.toLocaleString() + '</span>' + oldPriceHTML + '</div>' +
          '<button class="add-cart" onclick="addToCart(' + p.id + ')">+ Cart</button>' +
        '</div>' +
      '</div>';

    grid.appendChild(card);

    // simple animation
    (function(el, d) {
      setTimeout(function() {
        el.classList.add('show');
      }, d);
    })(card, delay);

    delay += 80;
  }
}

function filterProducts(cat, tabId) {
  // Remove active class from all tabs
  var tabs = document.querySelectorAll('.filter-tab');
  var t = 0;
  while (t < tabs.length) {
    tabs[t].className = 'filter-tab';
    t++;
  }

  // Add active to clicked tab
  var activeTab = document.getElementById(tabId);
  activeTab.className = 'filter-tab filter-tab-active';

  renderProducts(cat);
}

renderProducts('all');

// =========================
// BESTSELLERS CAROUSEL
// =========================

var track = document.getElementById('carouselTrack');
var carouselHTML = '';
var rep = 0;
while (rep < 3) {
  var k = 0;
  while (k < products.length) {
    if (k % 2 === 0) {
      var p = products[k];
      carouselHTML +=
        '<div class="bs-card" onclick="addToCart(' + p.id + ')">' +
          '<div class="bs-img" style="background:' + p.bg + '">' + p.emoji + '</div>' +
          '<div class="bs-info">' +
            '<div class="bs-name">' + p.name + '</div>' +
            '<div class="bs-price">₹' + p.price.toLocaleString() + '</div>' +
          '</div>' +
        '</div>';
    }
    k++;
  }
  rep++;
}
track.innerHTML = carouselHTML;

// =========================
// TESTIMONIALS
// =========================

var testiGrid = document.getElementById('testiGrid');
var testiHTML = '';
var t = 0;
while (t < testimonials.length) {
  var testi = testimonials[t];
  var stars = '';
  var s = 0;
  while (s < testi.stars) {
    stars += '★';
    s++;
  }
  testiHTML +=
    '<div class="testi-card reveal">' +
      '<div class="testi-stars">' + stars + '</div>' +
      '<div class="testi-quote">"</div>' +
      '<div class="testi-text">' + testi.text + '</div>' +
      '<div class="testi-author">' +
        '<div class="testi-avatar">' + testi.avatar + '</div>' +
        '<div>' +
          '<div class="testi-name">' + testi.name + '</div>' +
          '<div class="testi-role">' + testi.role + '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  t++;
}
testiGrid.innerHTML = testiHTML;

// =========================
// CART LOGIC
// =========================

function addToCart(productId) {
  // Find the product
  var found = null;
  var i = 0;
  while (i < products.length) {
    if (products[i].id === productId) {
      found = products[i];
    }
    i++;
  }

  if (found === null) {
    return;
  }

  // Add to cart array
  cartItems.push(found);
  cartCount = cartCount + 1;

  // Update badge
  document.getElementById('cartBadge').textContent = cartCount;

  showToast('🛒 "' + found.name + '" added to cart!');
}

function openCart() {
  document.getElementById('main-site').style.display = 'none';
  document.getElementById('cart-page').style.display = 'block';
  renderCart();
  window.scrollTo({ top: 0 });
}

function closeCart() {
  document.getElementById('cart-page').style.display = 'none';
  document.getElementById('main-site').style.display = 'block';
}

function goHome() {
  closeCart();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderCart() {
  var emptyDiv = document.getElementById('cartEmpty');
  var itemsList = document.getElementById('cartItemsList');
  var summaryDiv = document.getElementById('cartSummary');

  itemsList.innerHTML = '';

  if (cartItems.length === 0) {
    emptyDiv.style.display = 'block';
    summaryDiv.style.display = 'none';
    return;
  }

  emptyDiv.style.display = 'none';
  summaryDiv.style.display = 'block';

  var total = 0;
  var i = 0;
  while (i < cartItems.length) {
    var item = cartItems[i];
    total = total + item.price;

    var itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.innerHTML =
      '<div class="cart-item-emoji" style="background:' + item.bg + '">' + item.emoji + '</div>' +
      '<div class="cart-item-info">' +
        '<div class="cart-item-brand">' + item.brand + '</div>' +
        '<div class="cart-item-name">' + item.name + '</div>' +
        '<div class="cart-item-price">₹' + item.price.toLocaleString() + '</div>' +
      '</div>' +
      '<button class="cart-item-remove" onclick="removeFromCart(' + i + ')">Remove</button>';

    itemsList.appendChild(itemDiv);
    i++;
  }

  // Update summary
  var shipping = 0;
  var shippingText = 'Free 🎉';
  if (total < 999) {
    shipping = 99;
    shippingText = '₹99';
  }

  var tax = Math.round(total * 0.18);
  var grandTotal = total + shipping + tax;

  document.getElementById('summarySubtotal').textContent = '₹' + total.toLocaleString();
  document.getElementById('summaryShipping').textContent = shippingText;
  document.getElementById('summaryTax').textContent = '₹' + tax.toLocaleString();
  document.getElementById('summaryTotal').textContent = '₹' + grandTotal.toLocaleString();
}

function removeFromCart(index) {
  cartItems.splice(index, 1);
  cartCount = cartCount - 1;
  if (cartCount < 0) {
    cartCount = 0;
  }
  document.getElementById('cartBadge').textContent = cartCount;
  showToast('🗑️ Item removed from cart');
  renderCart();
}

function checkout() {
  if (storedEmail === '') {
    showToast('⚠️ Please sign in first!');
    return;
  }
  showToast('🎉 Order placed for ' + storedEmail + '! Thank you!');
  cartItems = [];
  cartCount = 0;
  document.getElementById('cartBadge').textContent = 0;
  renderCart();
}

// =========================
// QUIZ
// =========================

var currentStep = 0;

function initQuizProgress() {
  var prog = document.getElementById('quizProgress');
  prog.innerHTML = '';

  var i = 0;
  while (i < 4) {
    var dot = document.createElement('div');
    dot.className = 'qp-dot';
    dot.id = 'qDot' + i;
    if (i === 0) {
      dot.className = 'qp-dot qp-dot-active';
    }
    prog.appendChild(dot);
    i++;
  }
}

initQuizProgress();

function quizSelect(step) {
  setTimeout(function() {
    // Hide current step
    var currentStepEl = document.getElementById('qStep' + step);
    currentStepEl.className = 'quiz-step';

    var nextStep = step + 1;

    if (nextStep < 4) {
      // Show next step
      var nextStepEl = document.getElementById('qStep' + nextStep);
      nextStepEl.className = 'quiz-step quiz-step-active';
      currentStep = nextStep;

      // Update progress dots
      var i = 0;
      while (i < 4) {
        var dot = document.getElementById('qDot' + i);
        if (i <= nextStep) {
          dot.className = 'qp-dot qp-dot-active';
        } else {
          dot.className = 'qp-dot';
        }
        i++;
      }
    } else {
      // Show result
      showQuizResult();
    }
  }, 350);
}

function showQuizResult() {
  var randomIndex = Math.floor(Math.random() * quizResults.length);
  var result = quizResults[randomIndex];

  document.getElementById('resultIcon').textContent = result.icon;
  document.getElementById('resultType').textContent = result.type;
  document.getElementById('resultDesc').textContent = result.desc;

  var resultDiv = document.getElementById('quizResult');
  resultDiv.className = 'quiz-result quiz-result-show';
}

function restartQuiz() {
  currentStep = 0;

  // Hide all steps
  var i = 0;
  while (i < 4) {
    document.getElementById('qStep' + i).className = 'quiz-step';
    i++;
  }

  // Show step 0
  document.getElementById('qStep0').className = 'quiz-step quiz-step-active';

  // Hide result
  document.getElementById('quizResult').className = 'quiz-result';

  initQuizProgress();
}

// =========================
// NEWSLETTER
// =========================

function subscribeNL() {
  var emailInput = document.getElementById('nlEmail');
  var email = emailInput.value;

  if (email === '' || email.indexOf('@') === -1) {
    showToast('⚠️ Please enter a valid email!');
    return;
  }

  showToast('🎉 Welcome to Pahika! Check your inbox for 20% off!');
  emailInput.value = '';
}

// =========================
// TOAST
// =========================

function showToast(msg) {
  var toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast toast-show';

  setTimeout(function() {
    toast.className = 'toast';
  }, 3000);
}

// =========================
// SCROLL REVEAL
// =========================

function revealOnScroll() {
  var elements = document.querySelectorAll('.reveal');
  var i = 0;
  while (i < elements.length) {
    var rect = elements[i].getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      elements[i].classList.add('visible');
    }
    i++;
  }
}

revealOnScroll();