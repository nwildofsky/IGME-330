const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.0/css/bulma.min.css">
<style>
.logo-text {
    font-family: 'Expletus Sans', sans-serif;
    font-weight: 800;
    padding-left: .1rem;
}
.navbar.has-shadow {
  box-shadow: 0 2px 0 0 #cecece;
}

.navbar-menu.is-active {
  display: block;
}
</style>
<nav class="navbar has-shadow is-white">
    <!-- logo / brand -->
    <div class="navbar-brand">
      <a class="navbar-item is-size-5 has-text-weight-medium" href="index.html">
        <img src="./images/qt_logo_transp.png" alt="Quake Tracker Logo">
        <span class="logo-text"><slot></slot></span>
      </a>
      <a class="navbar-burger" id="burger">
        <span></span>
        <span></span>
        <span></span>
      </a>
    </div>

    <div class="navbar-menu" id="nav-links">
      <div class="navbar-start">
        <a class="navbar-item" href="./index.html" data-location="current-page">
          Home
        </a>

        <a class="navbar-item is-hoverable" href="./app.html" data-location="change-page">
          App
        </a>

        <a class="navbar-item is-hoverable" href="./favorites.html" data-location="change-page">
          Saved
        </a>

        <a class="navbar-item is-hoverable" href="./documentation.html" data-location="change-page">
          Documentation
        </a>
      </div>
    </div>
  </nav>
`;

class AppNavbar extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  boldCurrentNav() {
    let url = window.location.href;
    url = url.split('/');
    const page = url[url.length - 1];
    const pageNoQuery = page.split('?')[0];
    for (let link of this.navLinks) {
      const linkURL = link.href.split('/');
      const linkPage = linkURL[linkURL.length - 1];
      if (pageNoQuery) {
        if (pageNoQuery == linkPage) {
          link.style.fontWeight = 650;
        }
      }
      else if (page == linkPage) {
        link.style.fontWeight = 650;
      }
    }
  }

  connectedCallback() {
    // Mobile Menu
    this.burgerIcon = this.shadowRoot.querySelector("#burger");
    this.navbarMenu = this.shadowRoot.querySelector("#nav-links");
    this.navLinks = this.shadowRoot.querySelectorAll("#nav-links a");

    this.burgerIcon.onclick = () => this.navbarMenu.classList.toggle('is-active');
    this.boldCurrentNav();
  }

  disconnectedCallback() {
    this.burgerIcon.onclick = null;
  }
}

customElements.define("app-navbar", AppNavbar);