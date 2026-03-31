(function () {
  var root = document.getElementById("jlmLiteAppRoot");
  if (!root) return;

  /** URL admin-ajax (injectée par WordPress via wp_localize_script). */
  var JLM_AJAX =
    typeof labienveillanceJlm !== "undefined" && labienveillanceJlm.ajaxUrl
      ? labienveillanceJlm.ajaxUrl
      : "/wp-admin/admin-ajax.php";

  var ADMIN_CODE = "424720";

  function clone(o) {
    return JSON.parse(JSON.stringify(o));
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function deepMerge(target, source) {
    Object.keys(source || {}).forEach(function (key) {
      if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
        if (!target[key] || typeof target[key] !== "object") target[key] = {};
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    });
    return target;
  }

  var DEF = {
    companyLine: "La Bienveillance — Devis estimatif",
    contactUrl: "#contact",
    contactLabel: "CONTACTEZ-NOUS",
    comments: {
      home: "",
      type: "",
      brand: "",
      depart: "",
      obstacle: "",
      rail: "",
      longueur: "",
      arrivee: "",
      pivot: "",
      recap: "",
      garanties: "",
      aides: "",
      price: ""
    },
    prices: {
      includedMeters: 5,
      up: {
        droit: { base: 3500, mo: 650, railSup: 350, railRelevable: 680, extPlus: 300, pivotElec: 0 },
        courbe: { base: 7900, mo: 900, railSup: 300, courbe: 280, railRelevable: 750, pivotElec: 0 }
      },
      acorn: {
        droit: { base: 3200, mo: 650, railSup: 350, railRelevable: 600, extPlus: 300, pivotElec: 600 },
        courbe: { base: 5700, mo: 750, railSup: 350, courbe: 450, railRelevable: 600, pivotElec: 600 }
      }
    },
    images: {
      logo: { url: "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/logomakr-0c1pju.png" },
      type_droit: { url: "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/escalier-droit.jpg" },
      type_90: { url: "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/escalier-90.jpg" },
      type_180: { url: "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/escalier-180c2b0.jpg" },
      type_ext: { url: "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/serenite-monte-escalier-monte-escaliers7-390x380-1.jpeg" },
      marque_up: { url: "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/camscanner-23-02-2026-15.20_1.jpg" },
      marque_acorn: { url: "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/0abcd33b-7191-4d4f-81fe-5097d415b3cc_image1.png" },
      depart_std: { url: "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/whatsapp-image-2026-03-04-at-14.44.17.jpeg" },
      depart_rall: { url: "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/whatsapp-image-2026-03-04-at-14.45.07.jpeg" },
      depart_p90: { url: "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/whatsapp-image-2026-03-04-at-15.20.00.jpeg" },
      depart_p180: { url: "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/whatsapp-image-2024-11-17-a-15.19.52_789038bb.jpg" },
      obstacle_ex1: { url: "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/whatsapp-image-2025-07-23-at-16.55.59-1-768x1024-1.jpeg" },
      obstacle_ex2: { url: "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/WhatsApp-Image-2026-02-02-at-15.22.57.jpeg" },
      obstacle_yes: { url: "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/IMG_4902.jpeg" },
      obstacle_no: { url: "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/whatsapp-image-2024-11-17-a-15.19.52_38b0d7f8.jpg" },
      rail_1: { url: "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/WhatsApp-Image-2026-02-02-at-15.22.57.jpeg" },
      rail_2: { url: "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/IMG_4902.jpeg" },
      rail_yes: { url: "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/whatsapp-image-2026-03-04-at-14.54.44.jpeg" },
      rail_no: { url: "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/whatsapp-image-2024-11-17-a-15.19.52_38b0d7f8.jpg" },
      arr_nez: { url: "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-04-at-14.51.48.jpeg" },
      arr_prol: { url: "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/whatsapp-image-2026-03-01-at-08.10.01.jpeg" },
      arr_90: { url: "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/whatsapp-image-2026-03-01-at-08.08.50.jpeg" },
      arr_180: { url: "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/whatsapp-image-2024-11-17-a-15.19.53_562a3c5e-1.jpg" },
      pivot_manuel: { url: "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/whatsapp-image-2026-03-04-at-15.21.03.jpeg" },
      pivot_elec: { url: "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/whatsapp-image-2026-03-04-at-14.51.48.jpeg" },
      garanties_photo: { url: "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/whatsapp-image-2026-03-01-at-08.11.43.jpeg" },
      aides_photo: { url: "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/whatsapp-image-2026-03-01-at-08.16.15.jpeg" }
    }
  };

  var cfg = clone(DEF);
  var adminUnlocked = false;
  var app = null;

  var state = {
    step: 0,
    msg: "",
    showAlert: false,
    type: "",
    brand: "",
    depart: "",
    obstacle: "",
    railChoice: "",
    longueur: 5,
    arrivee: "",
    pivotMode: ""
  };

  async function wpLoadConfig() {
    try {
      let r = await fetch(JLM_AJAX + "?action=jlm_get_config", {
        credentials: "same-origin"
      });
      let j = await r.json();
      if (j && j.success && j.data && typeof j.data === "object") {
        cfg = deepMerge(clone(DEF), j.data);
      } else {
        cfg = clone(DEF);
      }
    } catch (e) {
      if (!(typeof labienveillanceJlm !== "undefined" && labienveillanceJlm.silentAjaxFail)) {
        alert("Erreur chargement configuration");
      }
      cfg = clone(DEF);
    }
  }

  async function wpSaveConfig() {
    try {
      let r = await fetch(JLM_AJAX + "?action=jlm_save_config", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(cfg)
      });

      let j = await r.json();

      if (j && j.success) {
        return true;
      } else {
        alert("Erreur : " + (j && j.data ? j.data : "sauvegarde impossible"));
        return false;
      }
    } catch (e) {
      alert("Erreur serveur");
      return false;
    }
  }

  function getImg(key) {
    return cfg.images[key] ? cfg.images[key].url : "";
  }

  function setImageUrl(key, val) {
    if (!cfg.images[key]) cfg.images[key] = { url: "" };
    cfg.images[key].url = String(val || "").trim();
  }

  function isStraightFamily() {
    return state.type === "droit" || state.type === "exterieur";
  }

  function isCurvedFamily() {
    return state.type === "courbe90" || state.type === "courbe180";
  }

  function isUP() {
    return state.brand === "UP";
  }

  function isACORN() {
    return state.brand === "ACORN";
  }

  function hasRailRelevable() {
    return state.railChoice === "oui";
  }

  function normalizeState() {
    if (isStraightFamily()) {
      state.depart = "standard";
      state.arrivee = "nez";
      state.obstacle = "";
      if (isUP()) {
        state.pivotMode = "electrique";
      } else if (!state.pivotMode) {
        state.pivotMode = "manuel";
      }
    } else {
      if (isUP() && state.arrivee === "nez") {
        state.pivotMode = "electrique";
      } else if (state.arrivee !== "nez") {
        state.pivotMode = "";
      }
    }
  }

  function typeCurveCount() {
    if (state.type === "courbe90") return 1;
    if (state.type === "courbe180") return 2;
    return 0;
  }

  function departCurveCount() {
    if (state.depart === "p90") return 1;
    if (state.depart === "p180") return 2;
    return 0;
  }

  function arriveeCurveCount() {
    if (state.arrivee === "p90") return 1;
    if (state.arrivee === "p180") return 2;
    return 0;
  }

  function totalCurveCount() {
    return typeCurveCount() + departCurveCount() + arriveeCurveCount();
  }

  function extraMeters() {
    var longueur = Number(state.longueur || 5);

    if (state.brand === "ACORN" && (state.type === "courbe90" || state.type === "courbe180")) {
      return longueur;
    }

    var inc = Number(cfg.prices.includedMeters || 5);
    return Math.max(0, Math.ceil(longueur - inc));
  }

  function needsPivotChoice() {
    return state.arrivee === "nez" && isACORN();
  }

  function steps() {
    normalizeState();
    var s = ["home", "type", "brand", "depart"];

    if (isCurvedFamily() && state.depart === "standard") {
      s.push("obstacle");
      if (state.obstacle === "oui") s.push("rail");
    }

    if (isStraightFamily()) s.push("rail");
    if (isCurvedFamily() && state.depart !== "standard") s.push("rail");

    s.push("longueur", "arrivee");

    if (needsPivotChoice()) s.push("pivot");

    s.push("recap", "garanties", "aides", "price");
    return s;
  }

  function pricingProfile() {
    if (isUP()) return isCurvedFamily() ? cfg.prices.up.courbe : cfg.prices.up.droit;
    return isCurvedFamily() ? cfg.prices.acorn.courbe : cfg.prices.acorn.droit;
  }

  function calcPriceBreakdown() {
    normalizeState();

    var p = pricingProfile();
    var extraM = extraMeters();
    var curves = totalCurveCount();

    var base = Number(p.base || 0);
    var mo = Number(p.mo || 0);
    var railSup = extraM * Number(p.railSup || 0);
    var curveCost = isCurvedFamily() ? curves * Number(p.courbe || 0) : 0;
    var railRelevable = hasRailRelevable() ? Number(p.railRelevable || 0) : 0;
    var pivotElec = state.pivotMode === "electrique" ? Number(p.pivotElec || 0) : 0;
    var extPlus = state.type === "exterieur" ? Number(p.extPlus || 0) : 0;

    return {
      total: base + mo + railSup + curveCost + railRelevable + pivotElec + extPlus,
      curves: curves,
      extraMeters: extraM
    };
  }

  function money(n) {
    return Number(n || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €";
  }

  function showComment(key) {
    var t = (cfg.comments[key] || "").trim();
    return t
      ? '<div class="comment show">' + escapeHtml(t).replace(/\n/g, "<br>") + "</div>"
      : "";
  }

  function choice(key, label, img, selected) {
    return (
      '<div class="choice ' + (selected ? "sel" : "") + '" data-choice="' + escapeHtml(key) + '">' +
      '<div class="media"><img decoding="async" src="' + escapeHtml(img) + '" alt="' + escapeHtml(label) + '"></div>' +
      '<div class="label">' + escapeHtml(label) + "</div>" +
      "</div>"
    );
  }

  function validate(page) {
    if (page === "type" && !state.type) return "MERCI DE CHOISIR UN TYPE D’ESCALIER AVANT DE CONTINUER";
    if (page === "brand" && !state.brand) return "MERCI DE CHOISIR UNE MARQUE AVANT DE CONTINUER";
    if (page === "depart" && !state.depart) return "MERCI DE CHOISIR UN DÉPART AVANT DE CONTINUER";
    if (page === "obstacle" && !state.obstacle) return "MERCI D’INDIQUER OUI OU NON POUR L’OBSTACLE";
    if (page === "rail" && !state.railChoice) return "MERCI D’INDIQUER OUI OU NON POUR LE RAIL RELEVABLE";
    if (page === "arrivee" && !state.arrivee) return "MERCI DE CHOISIR UNE ARRIVÉE AVANT DE CONTINUER";
    if (page === "pivot" && !state.pivotMode) return "MERCI DE CHOISIR LE TYPE DE SIÈGE PIVOTANT";
    return "";
  }

  function recapMaterial() {
    normalizeState();
    var b = calcPriceBreakdown();

    var typeMap = {
      droit: "Escalier droit",
      courbe90: "Escalier courbe 90°",
      courbe180: "Escalier courbe 180°",
      exterieur: "Escalier extérieur"
    };
    var departMap = {
      standard: "Départ standard",
      rallonge: "Départ rallongé",
      p90: "Départ parking 90°",
      p180: "Départ parking 180°"
    };
    var arriveeMap = {
      nez: "Arrivée nez de marche - siège pivotant",
      prolonge: "Arrivée prolongée",
      p90: "Arrivée parking 90°",
      p180: "Arrivée parking 180°"
    };

    var out = [];
    if (state.type) out.push(typeMap[state.type] || state.type);
    if (state.brand) out.push("Marque : " + (state.brand === "UP" ? "UP Stairlift" : "ACORN"));
    if (state.depart) out.push(departMap[state.depart] || state.depart);
    if (isCurvedFamily() && state.depart === "standard") out.push("Obstacle au départ : " + (state.obstacle === "oui" ? "Oui" : "Non"));
    out.push("Rail relevable : " + (state.railChoice === "oui" ? "Oui" : "Non"));
    out.push("Longueur approximative : " + Number(state.longueur || 5) + " m");
    if (state.arrivee) out.push(arriveeMap[state.arrivee] || state.arrivee);
    if (state.arrivee === "nez") {
      if (isUP()) out.push("Pivot électrique : inclus");
      else out.push("Pivot : " + (state.pivotMode === "electrique" ? "Électrique" : "Manuel"));
    }
    if (isCurvedFamily()) out.push("Nombre total de courbes à 90° : " + b.curves);
    out.push("Mètres facturés : " + b.extraMeters);
    return out;
  }

  function renderImageField(key, label) {
    return (
      '<div class="hr"></div>' +
      '<label class="lbl">' + escapeHtml(label) + ' — URL</label>' +
      '<input class="inp" id="img_' + escapeHtml(key) + '" value="' + escapeHtml((cfg.images[key] || {}).url || "") + '">'
    );
  }

  function renderPage() {
    normalizeState();
    var id = steps()[state.step];
    var breakdown = calcPriceBreakdown();

    if (id === "home") {
      return '<div class="card"><div class="h1">BONJOUR</div><div class="txt">Bienvenue.<br><br>En quelques étapes simples, obtenez une estimation claire et rassurante de votre monte-escalier.<br><br>Visite technique gratuite et absolument sans engagement.</div>' + showComment("home") + '</div>';
    }

    if (id === "type") {
      return '<div class="card"><div class="h2">TYPE D’ESCALIER</div><div class="txt">Cliquez sur une image pour choisir.</div><div class="grid">' +
        choice("droit", "Droit", getImg("type_droit"), state.type === "droit") +
        choice("courbe90", "Courbe 90°", getImg("type_90"), state.type === "courbe90") +
        choice("courbe180", "Courbe 180°", getImg("type_180"), state.type === "courbe180") +
        choice("exterieur", "Extérieur", getImg("type_ext"), state.type === "exterieur") +
        '</div>' + showComment("type") + '</div>';
    }

    if (id === "brand") {
      return '<div class="card"><div class="h2">MARQUE</div><div class="txt">Cliquez sur une image pour choisir.</div><div class="grid">' +
        choice("UP", "UP Stairlift", getImg("marque_up"), state.brand === "UP") +
        choice("ACORN", "ACORN", getImg("marque_acorn"), state.brand === "ACORN") +
        '</div>' + showComment("brand") + '</div>';
    }

    if (id === "depart") {
      if (isStraightFamily()) {
        return '<div class="card"><div class="h2">DÉPART</div><div class="txt">Pour cette configuration, le départ est uniquement standard.</div><div class="grid">' +
          choice("standard", "Standard", getImg("depart_std"), true) +
          '</div>' + showComment("depart") + '</div>';
      }
      return '<div class="card"><div class="h2">DÉPART</div><div class="txt">Cliquez sur une image pour choisir.</div><div class="grid">' +
        choice("standard", "Standard", getImg("depart_std"), state.depart === "standard") +
        choice("rallonge", "Rallongé", getImg("depart_rall"), state.depart === "rallonge") +
        choice("p90", "Parking 90°", getImg("depart_p90"), state.depart === "p90") +
        choice("p180", "Parking 180°", getImg("depart_p180"), state.depart === "p180") +
        '</div>' + showComment("depart") + '</div>';
    }

    if (id === "obstacle") {
      return '<div class="card"><div class="h2">OBSTACLE AU DÉPART</div><div class="txt">Exemples ci-dessous, puis cliquez sur OUI ou NON.</div><div class="grid">' +
        '<div class="fixedCard"><div class="media"><img decoding="async" src="' + escapeHtml(getImg("obstacle_ex1")) + '" alt=""></div><div class="label">Exemple</div></div>' +
        '<div class="fixedCard"><div class="media"><img decoding="async" src="' + escapeHtml(getImg("obstacle_ex2")) + '" alt=""></div><div class="label">Exemple</div></div>' +
        '</div><div class="grid">' +
        choice("oui", "OUI", getImg("obstacle_yes"), state.obstacle === "oui") +
        choice("non", "NON", getImg("obstacle_no"), state.obstacle === "non") +
        '</div>' + showComment("obstacle") + '</div>';
    }

    if (id === "rail") {
      return '<div class="card"><div class="h2">RAIL RELEVABLE</div><div class="txt">Voici deux exemples d’obstacle. Puis cliquez sur OUI ou NON.</div><div class="grid">' +
        '<div class="fixedCard"><div class="media"><img decoding="async" src="' + escapeHtml(getImg("rail_1")) + '" alt=""></div><div class="label">Exemple obstacle</div></div>' +
        '<div class="fixedCard"><div class="media"><img decoding="async" src="' + escapeHtml(getImg("rail_2")) + '" alt=""></div><div class="label">Exemple obstacle</div></div>' +
        '</div><div class="grid">' +
        choice("rail_oui", "OUI", getImg("rail_yes"), state.railChoice === "oui") +
        choice("rail_non", "NON", getImg("rail_no"), state.railChoice === "non") +
        '</div>' + showComment("rail") + '</div>';
    }

    if (id === "longueur") {
      return '<div class="card"><div class="h2">LONGUEUR</div><div class="txt">Indiquez la longueur approximative de votre installation.</div><div class="measure"><div class="bigVal">' + Number(state.longueur || 5) + ' m</div><div class="measureRow"><button class="arr" data-act="minus">−</button><input class="range" type="range" min="3" max="20" step="0.5" value="' + Number(state.longueur || 5) + '" data-act="range"><button class="arr" data-act="plus">+</button></div><div class="txt" style="font-size:13px;color:rgba(255,255,255,.78);margin-top:8px">Les ' + Number(cfg.prices.includedMeters || 5) + ' premiers mètres sont inclus, sauf pour ACORN courbe où toute la longueur est facturée.</div></div>' + showComment("longueur") + '</div>';
    }

    if (id === "arrivee") {
      if (isStraightFamily()) {
        return '<div class="card"><div class="h2">ARRIVÉE</div><div class="txt">Pour cette configuration, l’arrivée est uniquement nez de marche.</div><div class="grid">' +
          choice("nez", "Nez de marche - siège pivotant", getImg("arr_nez"), true) +
          '</div>' + showComment("arrivee") + '</div>';
      }
      return '<div class="card"><div class="h2">ARRIVÉE</div><div class="txt">Cliquez sur une image pour choisir.</div><div class="grid">' +
        choice("nez", "Nez de marche - siège pivotant", getImg("arr_nez"), state.arrivee === "nez") +
        choice("prolonge", "Prolongée", getImg("arr_prol"), state.arrivee === "prolonge") +
        choice("p90", "Parking 90°", getImg("arr_90"), state.arrivee === "p90") +
        choice("p180", "Parking 180°", getImg("arr_180"), state.arrivee === "p180") +
        '</div>' + showComment("arrivee") + '</div>';
    }

    if (id === "pivot") {
      return '<div class="card"><div class="h2">SIÈGE PIVOTANT</div><div class="txt">Choisissez manuel ou électrique.</div><div class="grid">' +
        choice("manuel", "Manuel", getImg("pivot_manuel"), state.pivotMode === "manuel") +
        choice("electrique", "Électrique", getImg("pivot_elec"), state.pivotMode === "electrique") +
        '</div>' + showComment("pivot") + '</div>';
    }

    if (id === "recap") {
      var lines = recapMaterial();
      return '<div class="card"><div class="h2">RÉCAPITULATIF UNIQUEMENT MATÉRIEL</div><div class="recap"><ul>' +
        lines.map(function (x) { return "<li>" + escapeHtml(x) + "</li>"; }).join("") +
        '</ul></div>' + showComment("recap") + '</div>';
    }

    if (id === "garanties") {
      return '<div class="card"><div class="h2">GARANTIES</div><div class="guaranteePhoto"><img decoding="async" src="' + escapeHtml(getImg("garanties_photo")) + '" alt="Garanties"></div><div class="guaranteeBig">GARANTIE 4 ANS PIÈCES, MAIN D’ŒUVRE ET DÉPLACEMENT<br><br>2 VISITES TECHNIQUES COMPRISES DANS LE PRIX</div>' + showComment("garanties") + '</div>';
    }

    if (id === "aides") {
      return '<div class="card"><div class="h2">LES AIDES ET AUTRES POSSIBILITÉS</div><div class="guaranteePhoto"><img decoding="async" src="' + escapeHtml(getImg("aides_photo")) + '" alt="Aides et autres possibilités"></div><div class="txt">Certaines aides peuvent être étudiées selon votre situation.<br><br>Des solutions de financement peuvent également être envisagées.<br><br>Un conseiller pourra vous orienter lors de la visite technique gratuite et sans engagement.</div>' + showComment("aides") + '</div>';
    }

    if (id === "price") {
      return '<div class="card"><div class="h2">VOTRE PRIX FINAL TTC POSÉ</div><div class="price"><div class="big">' + money(breakdown.total) + '</div><div style="font-size:13px;color:rgba(255,255,255,.75);margin-top:6px">Estimation TTC posée</div></div><div class="txt" style="margin-top:14px">Ce prix est une estimation. Il sera confirmé lors de la visite technique gratuite, sans engagement.</div>' + showComment("price") + '<div class="nav" style="margin-top:14px"><a class="btn pri" href="' + escapeHtml(cfg.contactUrl) + '">' + escapeHtml(cfg.contactLabel) + '</a></div></div>';
    }

    return '<div class="card"><div class="txt">Page inconnue.</div></div>';
  }

  function renderBO() {
    if (!adminUnlocked) return "";

    return (
      '<div class="boOverlay" id="boOverlay">' +
        '<div class="bo">' +
          '<div class="boHead"><strong>Back Office complet WordPress</strong><button class="btn" data-act="closeBo">Fermer</button></div>' +
          '<div class="boBody">' +

            '<fieldset class="fs"><legend>Global</legend>' +
              '<label class="lbl">Ligne d’en-tête</label><input class="inp" id="boCompanyLine" value="' + escapeHtml(cfg.companyLine) + '">' +
              '<label class="lbl" style="margin-top:10px">URL bouton contact</label><input class="inp" id="boContactUrl" value="' + escapeHtml(cfg.contactUrl) + '">' +
              '<label class="lbl" style="margin-top:10px">Texte bouton contact</label><input class="inp" id="boContactLabel" value="' + escapeHtml(cfg.contactLabel) + '">' +
              '<div class="hr"></div>' +
              '<label class="lbl">Logo — URL</label><input class="inp" id="boLogo" value="' + escapeHtml((cfg.images.logo || {}).url || "") + '">' +
            '</fieldset>' +

            '<fieldset class="fs"><legend>Prix</legend>' +
              '<div class="row2"><div><label class="lbl">Mètres inclus standard</label><input class="num" id="boIncludedMeters" type="number" value="' + cfg.prices.includedMeters + '"></div><div></div></div>' +

              '<div class="hr"></div><div class="lbl" style="font-weight:700;">UP droit / extérieur</div>' +
              '<div class="row2"><div><label class="lbl">Base</label><input class="num" id="boUpDroitBase" type="number" value="' + cfg.prices.up.droit.base + '"></div><div><label class="lbl">Main d’œuvre</label><input class="num" id="boUpDroitMo" type="number" value="' + cfg.prices.up.droit.mo + '"></div></div>' +
              '<div class="row2" style="margin-top:10px"><div><label class="lbl">Rail sup / m</label><input class="num" id="boUpDroitRailSup" type="number" value="' + cfg.prices.up.droit.railSup + '"></div><div><label class="lbl">Rail relevable</label><input class="num" id="boUpDroitRailRel" type="number" value="' + cfg.prices.up.droit.railRelevable + '"></div></div>' +
              '<div class="row2" style="margin-top:10px"><div><label class="lbl">Plus-value extérieur</label><input class="num" id="boUpDroitExtPlus" type="number" value="' + cfg.prices.up.droit.extPlus + '"></div><div><label class="lbl">Pivot électrique</label><input class="num" id="boUpDroitPivot" type="number" value="' + cfg.prices.up.droit.pivotElec + '"></div></div>' +

              '<div class="hr"></div><div class="lbl" style="font-weight:700;">UP courbe</div>' +
              '<div class="row2"><div><label class="lbl">Base</label><input class="num" id="boUpCourbeBase" type="number" value="' + cfg.prices.up.courbe.base + '"></div><div><label class="lbl">Main d’œuvre</label><input class="num" id="boUpCourbeMo" type="number" value="' + cfg.prices.up.courbe.mo + '"></div></div>' +
              '<div class="row2" style="margin-top:10px"><div><label class="lbl">Rail sup / m</label><input class="num" id="boUpCourbeRailSup" type="number" value="' + cfg.prices.up.courbe.railSup + '"></div><div><label class="lbl">Valeur par courbe</label><input class="num" id="boUpCourbeCourbe" type="number" value="' + cfg.prices.up.courbe.courbe + '"></div></div>' +
              '<div class="row2" style="margin-top:10px"><div><label class="lbl">Rail relevable</label><input class="num" id="boUpCourbeRailRel" type="number" value="' + cfg.prices.up.courbe.railRelevable + '"></div><div><label class="lbl">Pivot électrique</label><input class="num" id="boUpCourbePivot" type="number" value="' + cfg.prices.up.courbe.pivotElec + '"></div></div>' +

              '<div class="hr"></div><div class="lbl" style="font-weight:700;">ACORN droit / extérieur</div>' +
              '<div class="row2"><div><label class="lbl">Base</label><input class="num" id="boAcornDroitBase" type="number" value="' + cfg.prices.acorn.droit.base + '"></div><div><label class="lbl">Main d’œuvre</label><input class="num" id="boAcornDroitMo" type="number" value="' + cfg.prices.acorn.droit.mo + '"></div></div>' +
              '<div class="row2" style="margin-top:10px"><div><label class="lbl">Rail sup / m</label><input class="num" id="boAcornDroitRailSup" type="number" value="' + cfg.prices.acorn.droit.railSup + '"></div><div><label class="lbl">Rail relevable</label><input class="num" id="boAcornDroitRailRel" type="number" value="' + cfg.prices.acorn.droit.railRelevable + '"></div></div>' +
              '<div class="row2" style="margin-top:10px"><div><label class="lbl">Plus-value extérieur</label><input class="num" id="boAcornDroitExtPlus" type="number" value="' + cfg.prices.acorn.droit.extPlus + '"></div><div><label class="lbl">Pivot électrique</label><input class="num" id="boAcornDroitPivot" type="number" value="' + cfg.prices.acorn.droit.pivotElec + '"></div></div>' +

              '<div class="hr"></div><div class="lbl" style="font-weight:700;">ACORN courbe</div>' +
              '<div class="row2"><div><label class="lbl">Base</label><input class="num" id="boAcornCourbeBase" type="number" value="' + cfg.prices.acorn.courbe.base + '"></div><div><label class="lbl">Main d’œuvre</label><input class="num" id="boAcornCourbeMo" type="number" value="' + cfg.prices.acorn.courbe.mo + '"></div></div>' +
              '<div class="row2" style="margin-top:10px"><div><label class="lbl">Rail sup / m</label><input class="num" id="boAcornCourbeRailSup" type="number" value="' + cfg.prices.acorn.courbe.railSup + '"></div><div><label class="lbl">Valeur par courbe</label><input class="num" id="boAcornCourbeCourbe" type="number" value="' + cfg.prices.acorn.courbe.courbe + '"></div></div>' +
              '<div class="row2" style="margin-top:10px"><div><label class="lbl">Rail relevable</label><input class="num" id="boAcornCourbeRailRel" type="number" value="' + cfg.prices.acorn.courbe.railRelevable + '"></div><div><label class="lbl">Pivot électrique</label><input class="num" id="boAcornCourbePivot" type="number" value="' + cfg.prices.acorn.courbe.pivotElec + '"></div></div>' +
            '</fieldset>' +

            '<fieldset class="fs"><legend>Commentaires</legend>' +
              '<label class="lbl">Accueil</label><textarea class="ta" id="boHome">' + escapeHtml(cfg.comments.home) + '</textarea>' +
              '<label class="lbl" style="margin-top:10px">Type</label><textarea class="ta" id="boType">' + escapeHtml(cfg.comments.type) + '</textarea>' +
              '<label class="lbl" style="margin-top:10px">Marque</label><textarea class="ta" id="boBrand">' + escapeHtml(cfg.comments.brand) + '</textarea>' +
              '<label class="lbl" style="margin-top:10px">Départ</label><textarea class="ta" id="boDepart">' + escapeHtml(cfg.comments.depart) + '</textarea>' +
              '<label class="lbl" style="margin-top:10px">Obstacle</label><textarea class="ta" id="boObstacle">' + escapeHtml(cfg.comments.obstacle) + '</textarea>' +
              '<label class="lbl" style="margin-top:10px">Rail</label><textarea class="ta" id="boRail">' + escapeHtml(cfg.comments.rail) + '</textarea>' +
              '<label class="lbl" style="margin-top:10px">Longueur</label><textarea class="ta" id="boLongueur">' + escapeHtml(cfg.comments.longueur) + '</textarea>' +
              '<label class="lbl" style="margin-top:10px">Arrivée</label><textarea class="ta" id="boArrivee">' + escapeHtml(cfg.comments.arrivee) + '</textarea>' +
              '<label class="lbl" style="margin-top:10px">Pivot</label><textarea class="ta" id="boPivot">' + escapeHtml(cfg.comments.pivot) + '</textarea>' +
              '<label class="lbl" style="margin-top:10px">Récapitulatif</label><textarea class="ta" id="boRecap">' + escapeHtml(cfg.comments.recap) + '</textarea>' +
              '<label class="lbl" style="margin-top:10px">Garanties</label><textarea class="ta" id="boGaranties">' + escapeHtml(cfg.comments.garanties) + '</textarea>' +
              '<label class="lbl" style="margin-top:10px">Aides</label><textarea class="ta" id="boAides">' + escapeHtml(cfg.comments.aides) + '</textarea>' +
              '<label class="lbl" style="margin-top:10px">Prix final</label><textarea class="ta" id="boPrice">' + escapeHtml(cfg.comments.price) + '</textarea>' +
            '</fieldset>' +

            '<fieldset class="fs"><legend>URLs images</legend>' +
              renderImageField("type_droit", "Type droit") +
              renderImageField("type_90", "Type courbe 90°") +
              renderImageField("type_180", "Type courbe 180°") +
              renderImageField("type_ext", "Type extérieur") +
              renderImageField("marque_up", "Marque UP") +
              renderImageField("marque_acorn", "Marque ACORN") +
              renderImageField("depart_std", "Départ standard") +
              renderImageField("depart_rall", "Départ rallongé") +
              renderImageField("depart_p90", "Départ parking 90°") +
              renderImageField("depart_p180", "Départ parking 180°") +
              renderImageField("obstacle_ex1", "Obstacle exemple 1") +
              renderImageField("obstacle_ex2", "Obstacle exemple 2") +
              renderImageField("obstacle_yes", "Obstacle oui") +
              renderImageField("obstacle_no", "Obstacle non") +
              renderImageField("rail_1", "Rail exemple 1") +
              renderImageField("rail_2", "Rail exemple 2") +
              renderImageField("rail_yes", "Rail oui cliquable") +
              renderImageField("rail_no", "Rail non cliquable") +
              renderImageField("arr_nez", "Arrivée nez") +
              renderImageField("arr_prol", "Arrivée prolongée") +
              renderImageField("arr_90", "Arrivée 90°") +
              renderImageField("arr_180", "Arrivée 180°") +
              renderImageField("pivot_manuel", "Pivot manuel") +
              renderImageField("pivot_elec", "Pivot électrique") +
              renderImageField("garanties_photo", "Garanties image") +
              renderImageField("aides_photo", "Aides image") +
            '</fieldset>' +

          '</div>' +
          '<div class="boActions">' +
            '<button class="btn" data-act="closeBo">Fermer</button>' +
            '<button class="btn pri" data-act="saveBo">Enregistrer</button>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function saveBOToCfg() {
    cfg.companyLine = app.querySelector("#boCompanyLine").value;
    cfg.contactUrl = app.querySelector("#boContactUrl").value;
    cfg.contactLabel = app.querySelector("#boContactLabel").value;

    cfg.prices.includedMeters = Number(app.querySelector("#boIncludedMeters").value || 5);

    cfg.prices.up.droit.base = Number(app.querySelector("#boUpDroitBase").value || 0);
    cfg.prices.up.droit.mo = Number(app.querySelector("#boUpDroitMo").value || 0);
    cfg.prices.up.droit.railSup = Number(app.querySelector("#boUpDroitRailSup").value || 0);
    cfg.prices.up.droit.railRelevable = Number(app.querySelector("#boUpDroitRailRel").value || 0);
    cfg.prices.up.droit.extPlus = Number(app.querySelector("#boUpDroitExtPlus").value || 0);
    cfg.prices.up.droit.pivotElec = Number(app.querySelector("#boUpDroitPivot").value || 0);

    cfg.prices.up.courbe.base = Number(app.querySelector("#boUpCourbeBase").value || 0);
    cfg.prices.up.courbe.mo = Number(app.querySelector("#boUpCourbeMo").value || 0);
    cfg.prices.up.courbe.railSup = Number(app.querySelector("#boUpCourbeRailSup").value || 0);
    cfg.prices.up.courbe.courbe = Number(app.querySelector("#boUpCourbeCourbe").value || 0);
    cfg.prices.up.courbe.railRelevable = Number(app.querySelector("#boUpCourbeRailRel").value || 0);
    cfg.prices.up.courbe.pivotElec = Number(app.querySelector("#boUpCourbePivot").value || 0);

    cfg.prices.acorn.droit.base = Number(app.querySelector("#boAcornDroitBase").value || 0);
    cfg.prices.acorn.droit.mo = Number(app.querySelector("#boAcornDroitMo").value || 0);
    cfg.prices.acorn.droit.railSup = Number(app.querySelector("#boAcornDroitRailSup").value || 0);
    cfg.prices.acorn.droit.railRelevable = Number(app.querySelector("#boAcornDroitRailRel").value || 0);
    cfg.prices.acorn.droit.extPlus = Number(app.querySelector("#boAcornDroitExtPlus").value || 0);
    cfg.prices.acorn.droit.pivotElec = Number(app.querySelector("#boAcornDroitPivot").value || 0);

    cfg.prices.acorn.courbe.base = Number(app.querySelector("#boAcornCourbeBase").value || 0);
    cfg.prices.acorn.courbe.mo = Number(app.querySelector("#boAcornCourbeMo").value || 0);
    cfg.prices.acorn.courbe.railSup = Number(app.querySelector("#boAcornCourbeRailSup").value || 0);
    cfg.prices.acorn.courbe.courbe = Number(app.querySelector("#boAcornCourbeCourbe").value || 0);
    cfg.prices.acorn.courbe.railRelevable = Number(app.querySelector("#boAcornCourbeRailRel").value || 0);
    cfg.prices.acorn.courbe.pivotElec = Number(app.querySelector("#boAcornCourbePivot").value || 0);

    cfg.comments.home = app.querySelector("#boHome").value;
    cfg.comments.type = app.querySelector("#boType").value;
    cfg.comments.brand = app.querySelector("#boBrand").value;
    cfg.comments.depart = app.querySelector("#boDepart").value;
    cfg.comments.obstacle = app.querySelector("#boObstacle").value;
    cfg.comments.rail = app.querySelector("#boRail").value;
    cfg.comments.longueur = app.querySelector("#boLongueur").value;
    cfg.comments.arrivee = app.querySelector("#boArrivee").value;
    cfg.comments.pivot = app.querySelector("#boPivot").value;
    cfg.comments.recap = app.querySelector("#boRecap").value;
    cfg.comments.garanties = app.querySelector("#boGaranties").value;
    cfg.comments.aides = app.querySelector("#boAides").value;
    cfg.comments.price = app.querySelector("#boPrice").value;

    setImageUrl("logo", app.querySelector("#boLogo").value);
    setImageUrl("type_droit", app.querySelector("#img_type_droit").value);
    setImageUrl("type_90", app.querySelector("#img_type_90").value);
    setImageUrl("type_180", app.querySelector("#img_type_180").value);
    setImageUrl("type_ext", app.querySelector("#img_type_ext").value);
    setImageUrl("marque_up", app.querySelector("#img_marque_up").value);
    setImageUrl("marque_acorn", app.querySelector("#img_marque_acorn").value);
    setImageUrl("depart_std", app.querySelector("#img_depart_std").value);
    setImageUrl("depart_rall", app.querySelector("#img_depart_rall").value);
    setImageUrl("depart_p90", app.querySelector("#img_depart_p90").value);
    setImageUrl("depart_p180", app.querySelector("#img_depart_p180").value);
    setImageUrl("obstacle_ex1", app.querySelector("#img_obstacle_ex1").value);
    setImageUrl("obstacle_ex2", app.querySelector("#img_obstacle_ex2").value);
    setImageUrl("obstacle_yes", app.querySelector("#img_obstacle_yes").value);
    setImageUrl("obstacle_no", app.querySelector("#img_obstacle_no").value);
    setImageUrl("rail_1", app.querySelector("#img_rail_1").value);
    setImageUrl("rail_2", app.querySelector("#img_rail_2").value);
    setImageUrl("rail_yes", app.querySelector("#img_rail_yes").value);
    setImageUrl("rail_no", app.querySelector("#img_rail_no").value);
    setImageUrl("arr_nez", app.querySelector("#img_arr_nez").value);
    setImageUrl("arr_prol", app.querySelector("#img_arr_prol").value);
    setImageUrl("arr_90", app.querySelector("#img_arr_90").value);
    setImageUrl("arr_180", app.querySelector("#img_arr_180").value);
    setImageUrl("pivot_manuel", app.querySelector("#img_pivot_manuel").value);
    setImageUrl("pivot_elec", app.querySelector("#img_pivot_elec").value);
    setImageUrl("garanties_photo", app.querySelector("#img_garanties_photo").value);
    setImageUrl("aides_photo", app.querySelector("#img_aides_photo").value);
  }

  function render() {
    if (typeof labienveillanceJlm !== "undefined") {
      if (labienveillanceJlm.contactUrl) {
        cfg.contactUrl = labienveillanceJlm.contactUrl;
      }
      if (labienveillanceJlm.contactLabel) {
        cfg.contactLabel = labienveillanceJlm.contactLabel;
      }
    }
    normalizeState();
    var ids = steps();
    if (state.step > ids.length - 1) state.step = ids.length - 1;
    var current = ids[state.step];
    var progress = Math.round(((state.step + 1) / ids.length) * 100);

    app.innerHTML =
      '<div class="top">' +
        '<div class="brand">' +
          '<div class="logo"><img decoding="async" src="' + escapeHtml(getImg("logo")) + '" alt="Logo"></div>' +
          '<div><div class="small">' + escapeHtml(cfg.companyLine) + '</div></div>' +
        '</div>' +
        '<div class="progress"><div class="pill">' + (state.step + 1) + ' / ' + ids.length + '</div><div class="bar"><i style="width:' + progress + '%"></i></div></div>' +
      '</div>' +

      '<div class="alertBand ' + (state.showAlert ? 'show' : '') + '">' + escapeHtml(state.msg || 'MERCI DE FAIRE UN CHOIX AVANT DE CONTINUER') + '</div>' +

      renderPage() +

      '<div class="nav">' +
        '<button class="btn reset" data-act="reset">RÉINITIALISER</button>' +
        '<button class="btn" data-act="prev" ' + (state.step === 0 ? 'disabled' : '') + '>RETOUR</button>' +
        '<button class="btn pri" data-act="next">' + (current === 'price' ? 'TERMINER' : 'SUIVANT') + '</button>' +
      '</div>' +

      renderBO();

    app.querySelectorAll(".choice[data-choice]").forEach(function (el) {
      el.addEventListener("click", function () {
        var k = el.getAttribute("data-choice");

        if (current === "type") {
          state.type = k;
          state.depart = "";
          state.obstacle = "";
          state.railChoice = "";
          state.arrivee = "";
          state.pivotMode = "";
        }

        if (current === "brand") {
          state.brand = k;
          state.depart = "";
          state.obstacle = "";
          state.railChoice = "";
          state.arrivee = "";
          state.pivotMode = "";
        }

        if (current === "depart") {
          state.depart = k;
          state.obstacle = "";
          state.railChoice = "";
        }

        if (current === "obstacle") {
          state.obstacle = k;
          state.railChoice = "";
        }

        if (current === "rail") {
          state.railChoice = (k === "rail_oui") ? "oui" : "non";
        }

        if (current === "arrivee") {
          state.arrivee = k;
          state.pivotMode = "";
        }

        if (current === "pivot") {
          state.pivotMode = k;
        }

        state.msg = "";
        state.showAlert = false;
        render();
      });
    });

    app.querySelectorAll('[data-act="reset"]').forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (window.confirm("Voulez-vous vraiment réinitialiser le configurateur ?")) {
          state = {
            step: 0,
            msg: "",
            showAlert: false,
            type: "",
            brand: "",
            depart: "",
            obstacle: "",
            railChoice: "",
            longueur: 5,
            arrivee: "",
            pivotMode: ""
          };
          render();
        }
      });
    });

    app.querySelectorAll('[data-act="next"]').forEach(function (btn) {
      btn.addEventListener("click", function () {
        var currentStep = steps()[state.step];
        var err = validate(currentStep);
        if (err) {
          state.msg = err;
          state.showAlert = true;
          render();
          return;
        }
        if (state.step < steps().length - 1) {
          state.step++;
          state.msg = "";
          state.showAlert = false;
          render();
        }
      });
    });

    app.querySelectorAll('[data-act="prev"]').forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (state.step > 0) {
          state.step--;
          state.msg = "";
          state.showAlert = false;
          render();
        }
      });
    });

    app.querySelectorAll('[data-act="minus"]').forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.longueur = Math.max(3, Number((Number(state.longueur || 5) - 0.5).toFixed(1)));
        render();
      });
    });

    app.querySelectorAll('[data-act="plus"]').forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.longueur = Math.min(20, Number((Number(state.longueur || 5) + 0.5).toFixed(1)));
        render();
      });
    });

    app.querySelectorAll('[data-act="range"]').forEach(function (r) {
      r.addEventListener("input", function () {
        state.longueur = Number(r.value);
        render();
      });
    });

    app.querySelectorAll('[data-act="closeBo"]').forEach(function (btn) {
      btn.addEventListener("click", function () {
        var bo = document.getElementById("boOverlay");
        if (bo) bo.classList.remove("show");
      });
    });

    app.querySelectorAll('[data-act="saveBo"]').forEach(function (btn) {
      btn.addEventListener("click", async function () {
        saveBOToCfg();
        var ok = await wpSaveConfig();
        if (!ok) return;
        var bo = document.getElementById("boOverlay");
        if (bo) bo.classList.remove("show");
        render();
        alert("Configuration enregistrée dans WordPress.");
      });
    });
  }

  var styleNode = document.createElement("style");
  styleNode.textContent = `
:root{
  --bg:#071327;
  --bg2:#050C19;
  --card:rgba(255,255,255,.06);
  --bd:rgba(255,255,255,.14);
  --txt:#fff;
  --muted:rgba(255,255,255,.78);
  --orange:#F97316;
  --orange2:#EA580C;
  --danger1:#DC2626;
  --danger2:#F97316;
}
#jlmLiteAppRoot *{box-sizing:border-box}
#jlmLiteAppRoot{
  font-family:Arial,Helvetica,sans-serif;
  color:var(--txt);
  background:
    radial-gradient(1200px 560px at 15% 0%, rgba(249,115,22,.18), transparent 60%),
    radial-gradient(1000px 700px at 85% 10%, rgba(59,130,246,.12), transparent 60%),
    linear-gradient(180deg, var(--bg), var(--bg2) 58%, #040A14);
  border-radius:20px;
  padding:14px 10px 18px;
  overflow:hidden;
}
#jlmLiteAppRoot .app{width:100%;max-width:1120px;margin:0 auto}
#jlmLiteAppRoot .top{display:flex;align-items:center;justify-content:space-between;gap:6px;padding:0 2px 2px;margin-bottom:4px}
#jlmLiteAppRoot .brand{display:flex;align-items:center;gap:8px;min-width:0}
#jlmLiteAppRoot .logo{width:138px;height:138px;border-radius:18px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.05);display:flex;align-items:center;justify-content:center;overflow:hidden;flex:0 0 auto}
#jlmLiteAppRoot .logo img{width:100%;height:100%;object-fit:contain;display:block}
#jlmLiteAppRoot .small{font-size:9px;color:var(--muted);line-height:1.05;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#jlmLiteAppRoot .progress{display:flex;align-items:center;gap:5px;min-width:120px;flex:0 1 220px}
#jlmLiteAppRoot .pill{font-size:9px;padding:3px 6px;border-radius:999px;border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.04)}
#jlmLiteAppRoot .bar{height:5px;flex:1;border-radius:999px;border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.04);overflow:hidden}
#jlmLiteAppRoot .bar i{display:block;height:100%;width:0%;background:linear-gradient(90deg,var(--orange),#FDBA74)}
#jlmLiteAppRoot .alertBand{display:none;width:100%;margin:0 0 10px;padding:14px 18px;border-radius:18px;background:linear-gradient(90deg,var(--danger1),var(--danger2));color:#fff;font-size:18px;font-weight:800;text-align:center;box-shadow:0 18px 40px rgba(0,0,0,.24)}
#jlmLiteAppRoot .alertBand.show{display:block}
#jlmLiteAppRoot .card{background:linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.035));border:1px solid var(--bd);border-radius:24px;padding:18px 16px;box-shadow:0 20px 50px rgba(0,0,0,.28)}
#jlmLiteAppRoot .h1,#jlmLiteAppRoot .h2{text-align:center;margin:2px 0 10px}
#jlmLiteAppRoot .h1{font-size:34px}
#jlmLiteAppRoot .h2{font-size:25px}
#jlmLiteAppRoot .txt{max-width:980px;margin:0 auto;text-align:center;line-height:1.7;font-size:16px;color:rgba(255,255,255,.94)}
#jlmLiteAppRoot .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:14px}
#jlmLiteAppRoot .choice,#jlmLiteAppRoot .fixedCard{border-radius:22px;border:1px solid rgba(255,255,255,.12);background:linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.035));overflow:hidden;box-shadow:0 10px 24px rgba(0,0,0,.14)}
#jlmLiteAppRoot .choice{cursor:pointer;transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease;position:relative}
#jlmLiteAppRoot .choice:hover{transform:translateY(-4px);border-color:rgba(249,115,22,.55);box-shadow:0 16px 34px rgba(0,0,0,.22)}
#jlmLiteAppRoot .choice.sel{border-color:rgba(249,115,22,.92);box-shadow:0 0 0 2px rgba(249,115,22,.22) inset,0 16px 34px rgba(0,0,0,.22)}
#jlmLiteAppRoot .choice.sel:after{content:"✓";position:absolute;top:10px;right:12px;width:34px;height:34px;border-radius:999px;display:flex;align-items:center;justify-content:center;background:linear-gradient(180deg,var(--orange),var(--orange2));color:#fff;font-weight:900;font-size:18px}
#jlmLiteAppRoot .media{aspect-ratio:1/1;background:rgba(255,255,255,.03);display:flex;align-items:center;justify-content:center}
#jlmLiteAppRoot .media img{width:100%;height:100%;object-fit:contain;display:block;background:rgba(255,255,255,.03)}
#jlmLiteAppRoot .label{padding:12px 12px 14px;text-align:center;font-size:15px;font-weight:700}
#jlmLiteAppRoot .measure{max-width:980px;margin:10px auto 0;text-align:center}
#jlmLiteAppRoot .measureRow{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;margin-top:12px}
#jlmLiteAppRoot .arr{width:58px;height:46px;border-radius:16px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.06);color:#fff;font-size:22px;cursor:pointer}
#jlmLiteAppRoot .range{width:min(680px,92vw);accent-color:var(--orange)}
#jlmLiteAppRoot .bigVal{font-size:32px;font-weight:800;margin-top:6px}
#jlmLiteAppRoot .recap{max-width:980px;margin:16px auto 0;border-radius:20px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.16);padding:16px;text-align:center}
#jlmLiteAppRoot .recap ul{display:inline-block;text-align:left;line-height:1.7;margin:0;padding-left:18px}
#jlmLiteAppRoot .guaranteePhoto{max-width:980px;margin:10px auto 0;border-radius:20px;border:1px solid rgba(255,255,255,.14);overflow:hidden;background:rgba(255,255,255,.05);display:flex;align-items:center;justify-content:center}
#jlmLiteAppRoot .guaranteePhoto img{width:100%;display:block;aspect-ratio:16/7;object-fit:contain;background:rgba(255,255,255,.03)}
#jlmLiteAppRoot .guaranteeBig{max-width:980px;margin:16px auto 0;text-align:center;font-size:30px;line-height:1.45;font-weight:900}
#jlmLiteAppRoot .price{text-align:center;margin-top:12px}
#jlmLiteAppRoot .price .big{font-size:52px;font-weight:900}
#jlmLiteAppRoot .comment{
  display:none;
  max-width:980px;
  margin:18px auto 0;
  border-radius:18px;
  background:linear-gradient(180deg, rgba(249,115,22,.18), rgba(255,255,255,.10));
  border:2px solid rgba(249,115,22,.85);
  color:#fff;
  padding:16px 18px;
  text-align:center;
  font-weight:700;
  line-height:1.7;
  box-shadow:0 14px 30px rgba(0,0,0,.25);
}
#jlmLiteAppRoot .comment.show{display:block}
#jlmLiteAppRoot .nav{display:flex;gap:12px;justify-content:center;align-items:center;flex-wrap:wrap;margin-top:18px}
#jlmLiteAppRoot .btn{appearance:none;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.06);color:#fff;border-radius:999px;padding:12px 18px;font-size:14px;font-weight:700;cursor:pointer;min-width:150px;text-decoration:none}
#jlmLiteAppRoot .btn.pri{background:linear-gradient(180deg,var(--orange),var(--orange2));border-color:rgba(249,115,22,.65)}
#jlmLiteAppRoot .btn.reset{margin-right:26px;background:rgba(255,255,255,.04)}
#jlmLiteAppRoot .boOverlay{position:fixed;inset:0;background:rgba(0,0,0,.62);display:none;z-index:999999}
#jlmLiteAppRoot .boOverlay.show{display:block}
#jlmLiteAppRoot .bo{position:absolute;inset:5%;background:#0B1220;border:1px solid rgba(255,255,255,.14);border-radius:22px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 24px 60px rgba(0,0,0,.35)}
#jlmLiteAppRoot .boHead{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.04)}
#jlmLiteAppRoot .boBody{overflow:auto;padding:14px}
#jlmLiteAppRoot .fs{border:1px solid rgba(255,255,255,.14);border-radius:18px;padding:12px;margin-bottom:12px;background:rgba(255,255,255,.03)}
#jlmLiteAppRoot .fs legend{padding:0 8px;color:rgba(255,255,255,.86);font-size:13px;font-weight:700}
#jlmLiteAppRoot .lbl{display:block;font-size:12px;color:rgba(255,255,255,.78);margin-bottom:6px;text-align:left}
#jlmLiteAppRoot .inp,#jlmLiteAppRoot .ta,#jlmLiteAppRoot .num{width:100%;border-radius:12px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.06);color:#fff;padding:10px;outline:none}
#jlmLiteAppRoot .ta{min-height:82px;resize:vertical}
#jlmLiteAppRoot .boActions{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap;padding:12px 14px;border-top:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.03)}
#jlmLiteAppRoot .row2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
#jlmLiteAppRoot .hr{height:1px;background:rgba(255,255,255,.10);margin:10px 0}
@media (max-width:700px){#jlmLiteAppRoot .row2{grid-template-columns:1fr}}
@media (max-width:560px){
  #jlmLiteAppRoot .grid{grid-template-columns:1fr}
  #jlmLiteAppRoot .logo{width:108px;height:108px}
  #jlmLiteAppRoot .alertBand{font-size:16px}
  #jlmLiteAppRoot .guaranteeBig{font-size:22px}
}
`;
  root.appendChild(styleNode);

  app = document.createElement("div");
  app.className = "app";
  root.appendChild(app);

  function hotkey(e) {
    var isA = (e.code === "KeyA") || (String(e.key || "").toLowerCase() === "a");

    if (e.ctrlKey && e.altKey && isA) {
      e.preventDefault();
      e.stopPropagation();

      if (!adminUnlocked) {
        var code = window.prompt("Entrez le code d’accès au Back Office :");
        if (code === null) return;

        code = String(code || "").trim();

        if (code !== ADMIN_CODE) {
          alert("Code incorrect.");
          return;
        }

        adminUnlocked = true;
        render();
        var boOpen = document.getElementById("boOverlay");
        if (boOpen) boOpen.classList.add("show");
        return;
      }

      var bo = document.getElementById("boOverlay");
      if (bo) bo.classList.toggle("show");
    }

    if (e.key === "Escape") {
      var bo2 = document.getElementById("boOverlay");
      if (bo2 && bo2.classList.contains("show")) {
        bo2.classList.remove("show");
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }

  window.addEventListener("keydown", hotkey, true);
  document.addEventListener("keydown", hotkey, true);

  wpLoadConfig().then(function () {
    render();
  });
})();

