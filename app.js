
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const toast = message => {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => el.classList.remove("show"),2200);
};

let demoName = "Demo User";

const amounts = [200,300,500,700,1000,1200,1500,2000,5000];

const wallets = [
  ["PhonePe","fa-mobile-screen-button"],
  ["MobiKwik","fa-wallet"],
  ["Paytm","fa-credit-card"],
  ["Navi","fa-building-columns"],
  ["Freecharge","fa-bolt"],
  ["Paytm Business","fa-briefcase"],
  ["BharatPe Business","fa-shop"]
];

function enterDemo(name) {
  demoName = name || "Demo User";
  $("#display-name").textContent = demoName;
  $("#my-name").textContent = demoName;

  $("#auth-screen").classList.add("hidden");
  $("#app").classList.remove("hidden");

  showPage("home");
}

function showPage(page) {
  const target = $("#page-" + page);

  if (!target) {
    toast("Page not available");
    return;
  }

  $$(".page").forEach(p => p.classList.remove("active"));
  target.classList.add("active");

  const labels = {
    home:"Home",
    payment:"Payment",
    wallet:"Wallet",
    statistics:"Statistics",
    my:"My",
    usdt:"USDT",
    tasks:"Task Rewards",
    team:"Team",
    orders:"Order History",
    service:"Service",
    message:"Message",
    tutorial:"Tutorial"
  };

  $("#page-title").textContent = labels[page] || "Dudpay";

  $$(".nav-item").forEach(button => {
    button.classList.toggle("active",button.dataset.page === page);
  });
}

function renderAmounts() {
  $("#amount-list").innerHTML = amounts.map(amount => `
    <div class="amount-row">
      <div>
        <strong>Order amount: ₹${amount.toLocaleString("en-IN")}</strong>
        <small>Payment flow preview · No transaction</small>
      </div>
      <button class="disabled-btn" type="button" data-disabled-payment>
        Demo only
      </button>
    </div>
  `).join("");
}

function renderWallets() {
  $("#wallet-list").innerHTML = wallets.map(([name,icon]) => `
    <button class="wallet-row" type="button" data-wallet="${name}">
      <span class="wallet-logo">
        <i class="fa-solid ${icon}"></i>
      </span>
      <span class="wallet-info">
        <strong>${name}</strong>
        <small>Preview wallet option</small>
      </span>
      <i class="fa-solid fa-chevron-right"></i>
    </button>
  `).join("");
}

/* LOGIN / REGISTER */

$$("[data-auth]").forEach(button => {
  button.addEventListener("click",() => {
    $$(".auth-tab").forEach(tab => {
      tab.classList.toggle("active",tab === button);
    });

    $("#login-form").classList.toggle(
      "hidden",
      button.dataset.auth !== "login"
    );

    $("#register-form").classList.toggle(
      "hidden",
      button.dataset.auth !== "register"
    );
  });
});

$("#login-form").addEventListener("submit",event => {
  event.preventDefault();
  enterDemo("Demo User");
  toast("Demo session started");
});

$("#register-form").addEventListener("submit",event => {
  event.preventDefault();

  const name = $('input[type="text"]',event.currentTarget).value.trim();

  enterDemo(name);
  toast("Demo profile created");
});

/* NAVIGATION AND BUTTONS */

document.addEventListener("click",event => {

  const pageButton = event.target.closest("[data-page]");

  if (pageButton) {
    showPage(pageButton.dataset.page);
    return;
  }

  if (event.target.closest("[data-disabled-payment]")) {
    toast("Real payments are disabled in this demo");
    return;
  }

  const walletButton = event.target.closest("[data-wallet]");

  if (walletButton) {
    $("#selected-wallet").classList.remove("hidden");

    $("#selected-wallet-name").textContent =
      walletButton.dataset.wallet;

    toast(walletButton.dataset.wallet + " selected for preview");
    return;
  }

  const orderButton = event.target.closest("[data-order]");

  if (orderButton) {
    $$("[data-order]").forEach(button => {
      button.classList.toggle("selected",button === orderButton);
    });

    $("#order-summary").classList.toggle(
      "hidden",
      orderButton.dataset.order !== "purchase"
    );
  }
});

/* WALLET */

$("#remove-wallet").addEventListener("click",() => {
  $("#selected-wallet").classList.add("hidden");
  toast("Preview selection cleared");
});

/* USDT CALCULATOR */

$("#usdt-input").addEventListener("input",event => {
  const value = Math.max(0,Number(event.target.value) || 0) * 114;

  $("#inr-result").textContent =
    "₹" + value.toLocaleString("en-IN",{
      minimumFractionDigits:2,
      maximumFractionDigits:2
    });
});

/* REFERRAL COPY */

$("#copy-ref").addEventListener("click",async() => {
  const code = $("#referral-code").textContent;

  try {
    await navigator.clipboard.writeText(code);
    toast("Demo code copied");
  } catch {
    toast("Demo referral code: " + code);
  }
});

/* LOGOUT */

$("#logout-btn").addEventListener("click",() => {
  $("#app").classList.add("hidden");
  $("#auth-screen").classList.remove("hidden");
  toast("Exited demo");
});

/* NOTIFICATIONS */

$("#notification-btn").addEventListener("click",() => {
  toast("No notifications available");
});

/* TASK */

$("#task-status").addEventListener("click",() => {
  toast("Task rewards are disabled in this demo");
});

/* INITIALIZE */

renderAmounts();
renderWallets();
   
