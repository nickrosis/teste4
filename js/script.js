document.addEventListener("DOMContentLoaded", () => {

  // Directory data supplied for the current project version.
  // These records should be independently verified before final publication.
  const cooperatives = [
  {
    "name": "COOHABEL – Cooperativa Metropolitana de Habitação Popular de Belo Horizonte Ltda.",
    "acronym": "COOHABEL",
    "cnpj": "04.791.139/0001-51",
    "city": "Belo Horizonte",
    "region": "Belo Horizonte",
    "status": "Cadastro informado",
    "address": "Rua São Paulo, 1106, sala 1802, Centro, Belo Horizonte – MG, 30170-133",
    "lat": -19.924,
    "lng": -43.9415
  },
  {
    "name": "COHAM – Cooperativa Habitacional do Estado de Minas Gerais Ltda.",
    "acronym": "COHAM",
    "cnpj": "03.543.435/0001-70",
    "city": "Belo Horizonte",
    "region": "Belo Horizonte",
    "status": "Cadastro informado",
    "address": "Rua Juiz de Fora, 115, sala 1401, Barro Preto, Belo Horizonte – MG, 30180-060",
    "lat": -19.9239,
    "lng": -43.9537
  },
  {
    "name": "COOPALASKA – Cooperativa Alaska Empreendimentos Habitacionais Ltda.",
    "acronym": "COOPALASKA",
    "cnpj": "07.376.603/0001-31",
    "city": "Belo Horizonte",
    "region": "Belo Horizonte",
    "status": "Cadastro informado",
    "address": "Rua Geraldo Silva, 145, Rio Branco, Belo Horizonte – MG, 31535-250",
    "lat": -19.8215,
    "lng": -43.9932
  },
  {
    "name": "Cooperativa Habitacional dos Bancários de Belo Horizonte e Região – COOPHAB",
    "acronym": "COOPHAB",
    "cnpj": "24.740.690/0001-83",
    "city": "Belo Horizonte",
    "region": "Belo Horizonte",
    "status": "Cadastro informado",
    "address": "Rua Ceará, 741, sala 201A, Santa Efigênia, Belo Horizonte – MG, 30150-312",
    "lat": -19.9276,
    "lng": -43.9272
  },
  {
    "name": "Cooperativa Habitacional Operário Riacho das Pedras",
    "acronym": "—",
    "cnpj": "19.523.414/0001-23",
    "city": "Belo Horizonte",
    "region": "Belo Horizonte",
    "status": "Cadastro informado",
    "address": "Rua Mármore, 850, Santa Tereza, Belo Horizonte – MG, 31010-220",
    "lat": -19.9172,
    "lng": -43.9145
  },
  {
    "name": "Cooperativa Habitacional Intersindical",
    "acronym": "—",
    "cnpj": "16.518.631/0001-37",
    "city": "Belo Horizonte",
    "region": "Belo Horizonte",
    "status": "Cadastro informado",
    "address": "Rua Mármore, 850, Santa Tereza, Belo Horizonte – MG, 31010-220",
    "lat": -19.9172,
    "lng": -43.9145
  },
  {
    "name": "COOHAIME-MG – Cooperativa Habitacional das Instituições Militares do Estado de Minas Gerais",
    "acronym": "COOHAIME-MG",
    "cnpj": "03.888.516/0001-02",
    "city": "Belo Horizonte",
    "region": "Belo Horizonte",
    "status": "Cadastro informado",
    "address": "Rua Dom Oscar Romero, 500, Prédio 1, Nova Gameleira, Belo Horizonte – MG, 30510-080",
    "lat": -19.936,
    "lng": -43.9907
  },
  {
    "name": "COOPOM – Cooperativa Habitacional dos Policiais, Militares e Bombeiros do Brasil",
    "acronym": "COOPOM",
    "cnpj": "21.812.704/0001-39",
    "city": "Ribeirão das Neves",
    "region": "RMBH",
    "status": "Cadastro informado",
    "address": "Avenida Ceará, 381, Sevilha (2ª Seção), Ribeirão das Neves – MG, 33840-400",
    "lat": -19.7684,
    "lng": -44.0852
  }
];

  const directoryGrid = document.getElementById("directoryGrid");
  const directoryCount = document.getElementById("directoryCount");
  const emptyDirectory = document.getElementById("emptyDirectory");
  const cooperativeSearch = document.getElementById("cooperativeSearch");
  const cooperativeRegion = document.getElementById("cooperativeRegion");

  function normalizeText(value) {
    return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  function renderCooperatives() {
    if (!directoryGrid) return;
    const query = normalizeText(cooperativeSearch?.value || "");
    const region = cooperativeRegion?.value || "all";
    const filtered = cooperatives.filter((coop) => {
      const haystack = normalizeText([coop.name, coop.acronym, coop.cnpj, coop.city, coop.region].join(" "));
      const matchesQuery = !query || haystack.includes(query);
      const matchesRegion = region === "all" || (region === "bh" && coop.city === "Belo Horizonte") || (region === "rmbr" && coop.region === "RMBH");
      return matchesQuery && matchesRegion;
    });
    directoryGrid.innerHTML = filtered.map((coop) => `
      <article class="directory-card">
        <div class="card-top"><span>${coop.acronym !== "—" ? coop.acronym : "COOPERATIVA"}</span><span>${coop.city === "Belo Horizonte" ? "BH" : "RMBH"}</span></div>
        <h3>${coop.name}</h3>
        <p><strong>Localização:</strong> ${coop.city}<br><strong>CNPJ:</strong> ${coop.cnpj}</p>
        <div class="directory-meta"><span>${coop.status}</span><span>Fonte: cadastro informado no projeto</span></div>
      </article>`).join("");
    if (directoryCount) directoryCount.textContent = `${filtered.length} de ${cooperatives.length} registros`;
    if (emptyDirectory) emptyDirectory.hidden = filtered.length !== 0;
  }

  cooperativeSearch?.addEventListener("input", renderCooperatives);
  cooperativeRegion?.addEventListener("change", renderCooperatives);
  renderCooperatives();


  // Interactive Leaflet map using the reference coordinates supplied for the project.
  const mapElement = document.getElementById("cooperativeMap");
  if (mapElement && window.L) {
    const map = L.map(mapElement, {
      scrollWheelZoom: false,
      touchZoom: true,
      doubleClickZoom: true,
      boxZoom: false,
      keyboard: true,
      zoomControl: true,
      preferCanvas: true
    }).setView([-19.905, -43.975], 11);

    const tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      minZoom: 8,
      maxZoom: 19,
      updateWhenZooming: false,
      updateWhenIdle: true,
      keepBuffer: 2,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    tiles.on("tileerror", () => {
      mapElement.classList.add("map-tile-error");
    });

    tiles.on("load", () => {
      mapElement.classList.remove("map-tile-error");
    });

    const coopIcon = L.divIcon({
      className: "custom-map-marker",
      html: '<span></span>',
      iconSize: [22, 22],
      iconAnchor: [11, 11],
      popupAnchor: [0, -12]
    });

    cooperatives.forEach((coop) => {
      if (!Number.isFinite(coop.lat) || !Number.isFinite(coop.lng)) return;
      const popup = `
        <div class="map-popup">
          <strong>${coop.acronym !== "—" ? coop.acronym : coop.name}</strong>
          <span>${coop.city}</span>
          <span>${coop.address}</span>
          <small>CNPJ: ${coop.cnpj}</small>
        </div>`;
      L.marker([coop.lat, coop.lng], { icon: coopIcon }).addTo(map).bindPopup(popup);
    });

    const markerPoints = cooperatives
      .filter((coop) => Number.isFinite(coop.lat) && Number.isFinite(coop.lng))
      .map((coop) => [coop.lat, coop.lng]);

    if (markerPoints.length) {
      map.fitBounds(markerPoints, { padding: [28, 28], maxZoom: 13 });
    }

    requestAnimationFrame(() => {
      map.invalidateSize(true);
      setTimeout(() => map.invalidateSize(true), 250);
    });

    if (window.ResizeObserver) {
      const mapObserver = new ResizeObserver(() => map.invalidateSize());
      mapObserver.observe(mapElement);
    }
  }

  const navToggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const open = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Abrir menu");
      });
    });
  }

  const form = document.getElementById("interestForm");
  const formResult = document.getElementById("formResult");

  if (form && formResult) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("name").value.trim();
      const region = document.getElementById("region").value;
      const interest = document.getElementById("interest").value;

      if (!name || !region || !interest) {
        formResult.textContent = "Preencha nome, região e tipo de interesse.";
        formResult.style.color = "#a44925";
        return;
      }

      /*
       * Prototype behavior:
       * Data is kept only in the browser. In the next phase,
       * this can be replaced with a Google Form, Formspree,
       * Apps Script, Supabase, or another backend.
       */
      const entry = {
        name,
        region,
        interest,
        budget: document.getElementById("budget").value,
        message: document.getElementById("message").value.trim(),
        createdAt: new Date().toISOString()
      };

      const existing = JSON.parse(localStorage.getItem("cooperarInteresses") || "[]");
      existing.push(entry);
      localStorage.setItem("cooperarInteresses", JSON.stringify(existing));

      formResult.textContent = "Interesse registrado neste protótipo neste navegador.";
      formResult.style.color = "#234b42";
      form.reset();
    });
  }
});
