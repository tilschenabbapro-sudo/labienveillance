(function () {
  var root = document.getElementById("jlmDoucheAppRoot");
  if (!root) return;

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }
  function deepMerge(target, source) {
    Object.keys(source || {}).forEach(function(key) {
      if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
        if (!target[key] || typeof target[key] !== "object") target[key] = {};
        deepMerge(target[key], source[key]);
      } else { target[key] = source[key]; }
    });
    return target;
  }
  function money(n) { return Number(n||0).toLocaleString("fr-FR")+" €"; }

  function getAjaxUrl() {
    return (window.JLM_DOUCHE_WP && window.JLM_DOUCHE_WP.ajaxUrl) || "/wp-admin/admin-ajax.php";
  }
  function getNonce() {
    return (window.JLM_DOUCHE_WP && window.JLM_DOUCHE_WP.nonce) || "";
  }
  function isWpAdmin() {
    return !!(window.JLM_DOUCHE_WP && window.JLM_DOUCHE_WP.canManage);
  }

  function buildContactHref(total) {
    var wp = window.JLM_DOUCHE_WP || {};
    var recap = recapGlobalLines().join("\n");
    try {
      var base = wp.contactHref ? String(wp.contactHref) : String(cfg.contactUrl || "/contact/");
      var u = new URL(base, window.location.origin);
      u.searchParams.set("projet", "devis-sdb");
      u.searchParams.set("total", String(total));
      if (recap.length) {
        u.searchParams.set("recap", recap);
      }
      if (wp.contactHash) {
        u.hash = "#" + String(wp.contactHash).replace(/^#/, "");
      }
      return u.pathname + u.search + u.hash;
    } catch (e2) {
      return cfg.contactUrl;
    }
  }

  async function wpLoadConfig() {
    try {
      var r = await fetch(getAjaxUrl() + "?action=jlm_load_douche_config", { credentials: "same-origin" });
      var j = await r.json();
      if (j && j.success && j.data && j.data.config) {
        var raw = j.data.config;
        if (raw && typeof raw === "string" && raw.trim().charAt(0) === "{") {
          cfg = deepMerge(cfg, JSON.parse(raw));
        }
      }
    } catch(e) {}
  }

  async function wpSaveConfig() {
    try {
      var formData = new FormData();
      formData.append("action", "jlm_save_douche_config");
      formData.append("nonce", getNonce());
      formData.append("config", JSON.stringify(cfg));
      var r = await fetch(getAjaxUrl(), { method: "POST", credentials: "same-origin", body: formData });
      var j = await r.json();
      return !!(j && j.success);
    } catch(e) { return false; }
  }

  var DEF = {
    companyLine: "La Bienveillance — Devis estimatif salle de bain",
    contactUrl: "#contact",
    contactLabel: "CONTACTEZ-NOUS",
    comments: {
      home:"",intro_bain:"",avant_apres:"",fenetre:"",implantation:"",taille_bac:"",
      modele:"",verre:"",robinetterie:"",forfaits:"",garanties_douche:"",aides_douche:"",
      recap_douche:"",price_douche:"",proposition_sdb:"",habillage_murs:"",sol_antiderapant:"",
      meubles:"",porte_coulissante:"",seche_serviettes:"",solutions_wc:"",recap_global:"",
      garanties_global:"",aides_global:"",price_global:"",final_total:""
    },
    prices: {
      prixBase: 0,
      base: { fixe:1200, fixe_volet:1450, fixe_volet_angle:1750, coulissante:1890,
              coulissante_angle:2190, pivotante:1690, pivotante_angle:1990, deux_pivotantes:2290 },
      verre: { transparent:0, depoli:180 },
      robinetterie: { non:0, oui:390 },
      habillageMursM2:120, solAntiderapant:990, meubles:1590, porteCoulissante:990,
      secheServiettes:790, wcSureleve:0, wcSuspenduHabillage:0, wcBroyeurSilencieux:0,
      forfaitMachineLaver:0, forfaitLavabo:0, forfaitBidet:0
    },
    images: {
      logo:                         { url:"https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/logomakr-0c1pju.png" },
      avant_photo_1:                { url:"https://via.placeholder.com/900x700?text=Avant+1" },
      avant_photo_2:                { url:"https://via.placeholder.com/900x700?text=Avant+2" },
      apres_photo_1:                { url:"https://via.placeholder.com/900x700?text=Apres+1" },
      apres_photo_2:                { url:"https://via.placeholder.com/900x700?text=Apres+2" },
      apres_photo_3:                { url:"https://via.placeholder.com/900x700?text=Apres+3" },
      apres_photo_4:                { url:"https://via.placeholder.com/900x700?text=Apres+4" },
      fenetre_oui:                  { url:"https://via.placeholder.com/800x800?text=Fenetre+oui" },
      fenetre_non:                  { url:"https://via.placeholder.com/800x800?text=Pas+de+fenetre" },
      /* === NOUVELLES : réservées page 7 (modele) selon présence fenêtre === */
      fenetre_paroi_fixe:           { url:"https://via.placeholder.com/1200x675?text=Paroi+fixe+avec+fenetre" },
      fenetre_paroi_fixe_volet:     { url:"https://via.placeholder.com/1200x675?text=Paroi+fixe+%2B+volet+avec+fenetre" },
      implantation_angle:           { url:"https://via.placeholder.com/800x800?text=Implantation+angle" },
      implantation_niche:           { url:"https://via.placeholder.com/800x800?text=Implantation+niche" },
      modele_fixe:                  { url:"https://via.placeholder.com/1200x675?text=Paroi+fixe" },
      modele_fixe_volet:            { url:"https://via.placeholder.com/1200x675?text=Fixe+%2B+volet" },
      modele_fixe_volet_angle:      { url:"https://via.placeholder.com/1200x675?text=Fixe+%2B+volet+%2B+angle+fixe" },
      modele_coulissante:           { url:"https://via.placeholder.com/1200x675?text=Paroi+coulissante" },
      modele_coulissante_angle:     { url:"https://via.placeholder.com/1200x675?text=Coulissante+%2B+angle+fixe" },
      modele_pivotante:             { url:"https://via.placeholder.com/1200x675?text=Porte+pivotante" },
      modele_pivotante_angle:       { url:"https://via.placeholder.com/1200x675?text=Pivotante+%2B+angle+fixe" },
      modele_deux_pivotantes:       { url:"https://via.placeholder.com/1200x675?text=2+portes+pivotantes" },
      verre_transparent:            { url:"https://via.placeholder.com/800x800?text=Verre+transparent" },
      verre_depoli:                 { url:"https://via.placeholder.com/800x800?text=Verre+depoli" },
      robinetterie_oui:             { url:"https://via.placeholder.com/800x800?text=Deplacement+robinetterie+Oui" },
      robinetterie_non:             { url:"https://via.placeholder.com/800x800?text=Deplacement+robinetterie+Non" },
      proposition_sdb_photo:        { url:"https://via.placeholder.com/1200x800?text=Renovation+salle+de+bain" },
      habillage_murs_1:             { url:"https://via.placeholder.com/900x700?text=Habillage+mur+1" },
      habillage_murs_2:             { url:"https://via.placeholder.com/900x700?text=Habillage+mur+2" },
      sol_antiderapant_ex1:         { url:"https://via.placeholder.com/900x700?text=Sol+antiderapant+1" },
      sol_antiderapant_ex2:         { url:"https://via.placeholder.com/900x700?text=Sol+antiderapant+2" },
      meubles_ex1:                  { url:"https://via.placeholder.com/900x700?text=Meuble+1" },
      meubles_ex2:                  { url:"https://via.placeholder.com/900x700?text=Meuble+2" },
      meubles_ex3:                  { url:"https://via.placeholder.com/900x700?text=Meuble+3" },
      meubles_ex4:                  { url:"https://via.placeholder.com/900x700?text=Meuble+4" },
      porte_coulissante_photo:      { url:"https://via.placeholder.com/900x700?text=Porte+coulissante" },
      seche_serviettes_photo:       { url:"https://via.placeholder.com/900x700?text=Seche-serviettes" },
      wc_sureleve_photo:            { url:"https://via.placeholder.com/900x700?text=WC+sureleve" },
      wc_suspendu_habillage_photo:  { url:"https://via.placeholder.com/900x700?text=WC+suspendu+avec+habillage" },
      wc_broyeur_silencieux_photo:  { url:"https://via.placeholder.com/900x700?text=WC+broyeur+silencieux" },
      garanties_photo_1:            { url:"https://via.placeholder.com/900x700?text=Garanties+1" },
      garanties_photo_2:            { url:"https://via.placeholder.com/900x700?text=Garanties+2" }
    }
  };

  var cfg = clone(DEF);
  if (window.JLM_DOUCHE_WP && window.JLM_DOUCHE_WP.defaults) {
    cfg = deepMerge(cfg, clone(window.JLM_DOUCHE_WP.defaults));
  }
  var adminUnlocked = false;
  var app = null;

  function getImg(key) { return cfg.images[key] ? cfg.images[key].url : ""; }
  function setImageUrl(key, val) {
    if (!cfg.images[key]) cfg.images[key]={url:""};
    cfg.images[key].url = String(val||"").trim();
  }

  var initialState = {
    step:0, msg:"", showAlert:false, fenetre:"", implantation:"",
    bacLongueur:120, bacLargeur:90, modele:"", verre:"",
    forfaitMachineLaver:false, forfaitLavabo:false, forfaitBidet:false,
    robinetterie:"", habillageMurs:"", habillageMursM2:0,
    solAntiderapant:"", meubles:"", porteCoulissante:"", secheServiettes:"", solutionWc:""
  };
  var state = clone(initialState);

  function steps() {
    return ["home","intro_bain","avant_apres","fenetre","implantation","taille_bac",
            "modele","verre","robinetterie","forfaits","garanties_douche","aides_douche",
            "recap_douche","price_douche","proposition_sdb","habillage_murs","sol_antiderapant",
            "meubles","porte_coulissante","seche_serviettes","solutions_wc",
            "recap_global","price_global","final_total"];
  }

  function availableModeles() {
    if (state.fenetre==="oui") return [
      {key:"fixe",label:"Paroi fixe",img:"fenetre_paroi_fixe"},
      {key:"fixe_volet",label:"Paroi fixe + volet",img:"fenetre_paroi_fixe_volet"}
    ];
    return [
      {key:"fixe",label:"Paroi fixe",img:"modele_fixe"},
      {key:"fixe_volet",label:"Paroi fixe + volet",img:"modele_fixe_volet"},
      {key:"fixe_volet_angle",label:"Fixe + volet + angle fixe",img:"modele_fixe_volet_angle"},
      {key:"coulissante",label:"Paroi coulissante",img:"modele_coulissante"},
      {key:"coulissante_angle",label:"Paroi coulissante + angle fixe",img:"modele_coulissante_angle"},
      {key:"pivotante",label:"Porte pivotante",img:"modele_pivotante"},
      {key:"pivotante_angle",label:"Porte pivotante + angle fixe",img:"modele_pivotante_angle"},
      {key:"deux_pivotantes",label:"2 portes pivotantes",img:"modele_deux_pivotantes"}
    ];
  }

  function normalizeState() {
    var ok = availableModeles().some(function(m){ return m.key===state.modele; });
    if (!ok) state.modele="";
  }

  function calcBreakdown() {
    normalizeState();
    var p = cfg.prices;
    var douche = Number(p.prixBase||0)
      + Number((p.base||{})[state.modele]||0)
      + Number((p.verre||{})[state.verre]||0)
      + Number((p.robinetterie||{})[state.robinetterie]||0)
      + (state.forfaitMachineLaver?Number(p.forfaitMachineLaver||0):0)
      + (state.forfaitLavabo?Number(p.forfaitLavabo||0):0)
      + (state.forfaitBidet?Number(p.forfaitBidet||0):0);
    var amenagements =
      (state.habillageMurs==="oui"?Number(state.habillageMursM2||0)*Number(p.habillageMursM2||0):0)
      + (state.solAntiderapant==="oui"?Number(p.solAntiderapant||0):0)
      + (state.meubles==="oui"?Number(p.meubles||0):0)
      + (state.porteCoulissante==="oui"?Number(p.porteCoulissante||0):0)
      + (state.secheServiettes==="oui"?Number(p.secheServiettes||0):0);
    var solutionWc = Number(p[state.solutionWc]||0);
    return { douche:douche, amenagements:amenagements, solutionWc:solutionWc, total:douche+amenagements+solutionWc };
  }

  function validate(page) {
    var v = {
      fenetre:"MERCI D'INDIQUER S'IL Y A UNE FENÊTRE DANS LE PROLONGEMENT DE LA FUTURE PAROI",
      implantation:"MERCI DE CHOISIR UNE IMPLANTATION",
      modele:"MERCI DE CHOISIR UN MODÈLE",
      verre:"MERCI DE CHOISIR UN TYPE DE VERRE",
      robinetterie:"MERCI D'INDIQUER OUI OU NON POUR LE DÉPLACEMENT DE ROBINETTERIE",
      habillage_murs:"MERCI D'INDIQUER OUI OU NON POUR L'HABILLAGE DES MURS",
      sol_antiderapant:"MERCI D'INDIQUER OUI OU NON POUR LE SOL ANTIDÉRAPANT",
      meubles:"MERCI D'INDIQUER OUI OU NON POUR LES MEUBLES",
      porte_coulissante:"MERCI D'INDIQUER OUI OU NON POUR LA PORTE COULISSANTE",
      seche_serviettes:"MERCI D'INDIQUER OUI OU NON POUR LE SÈCHE-SERVIETTES",
      solutions_wc:"MERCI DE CHOISIR UNE SOLUTION WC"
    };
    var stateKeys = {
      fenetre:state.fenetre, implantation:state.implantation, modele:state.modele,
      verre:state.verre, robinetterie:state.robinetterie, habillage_murs:state.habillageMurs,
      sol_antiderapant:state.solAntiderapant, meubles:state.meubles,
      porte_coulissante:state.porteCoulissante, seche_serviettes:state.secheServiettes,
      solutions_wc:state.solutionWc
    };
    if (v[page] && !stateKeys[page]) return v[page];
    if (page==="taille_bac") {
      if (!Number.isInteger(Number(state.bacLongueur))||Number(state.bacLongueur)<=0) return "MERCI D'INDIQUER UNE LONGUEUR VALIDE";
      if (!Number.isInteger(Number(state.bacLargeur))||Number(state.bacLargeur)<=0) return "MERCI D'INDIQUER UNE LARGEUR VALIDE";
    }
    return "";
  }

  function recapDoucheLines() {
    var out=[];
    if (state.fenetre) out.push("Fenêtre dans le prolongement de la paroi : "+(state.fenetre==="oui"?"oui":"non"));
    if (state.implantation) out.push("Implantation : "+state.implantation);
    out.push("Receveur : "+Number(state.bacLongueur||0)+" x "+Number(state.bacLargeur||0)+" cm");
    if (state.modele) out.push("Modèle : "+state.modele);
    if (state.verre) out.push("Verre : "+state.verre);
    if (state.robinetterie) out.push("Robinetterie déplacée : "+state.robinetterie);
    if (state.forfaitMachineLaver) out.push("Déplacement machine à laver : Oui");
    if (state.forfaitLavabo) out.push("Déplacement lavabo : Oui");
    if (state.forfaitBidet) out.push("Dépose bidet : Oui");
    return out;
  }

  function recapGlobalLines() {
    var out=recapDoucheLines();
    if (state.habillageMurs) out.push("Habillage murs : "+state.habillageMurs);
    if (state.habillageMurs==="oui") out.push("Surface : "+Number(state.habillageMursM2||0)+" m²");
    if (state.solAntiderapant) out.push("Sol antidérapant : "+state.solAntiderapant);
    if (state.meubles) out.push("Meubles : "+state.meubles);
    if (state.porteCoulissante) out.push("Porte coulissante : "+state.porteCoulissante);
    if (state.secheServiettes) out.push("Sèche-serviettes : "+state.secheServiettes);
    if (state.solutionWc) out.push("Solution WC : "+state.solutionWc);
    return out;
  }

  function showComment(key) {
    var t=(cfg.comments[key]||"").trim();
    if (!t) return "";
    return '<div class="commentWrap"><button type="button" class="commentToggle" data-comment-open="'+escapeHtml(key)+'"><span class="commentToggleIcon">✦</span> Conseils</button></div>';
  }
  function choice(key,label,img,selected) {
    return '<div class="choice '+(selected?'sel':'')+'" data-choice="'+escapeHtml(key)+'">'+
      '<div class="media"><img src="'+escapeHtml(img)+'" alt="'+escapeHtml(label)+'"></div>'+
      '<div class="label">'+escapeHtml(label)+'</div></div>';
  }
  function bigYesNo(selected,label,key) {
    return '<button type="button" class="bigCheck '+(selected?"sel":"")+'" data-bigcheck="'+escapeHtml(key)+'">'+escapeHtml(label)+'</button>';
  }

  function renderPage() {
    normalizeState();
    var id=steps()[state.step];
    var bd=calcBreakdown();

    if (id==="home") return '<div class="card"><div class="h1 h1Large">BONJOUR</div><div class="txt txtLarge">Bienvenue.<br><br>En quelques étapes simples, obtenez une estimation claire de votre future salle de bain.<br><br>Visite technique gratuite et sans engagement.</div>'+showComment("home")+'</div>';

    if (id==="intro_bain") return '<div class="card"><div class="h2">VOTRE PROJET SALLE DE BAIN</div><div class="txt txtLarge">Parce que votre sécurité et votre confort sont notre priorité, nous vous accompagnons dans le remplacement de votre baignoire par une douche sécurisée, adaptée à votre quotidien.<br><br>Pas d\'inquiétude pour les travaux : dans la grande majorité des cas, tout est terminé en une seule journée, avec un chantier propre et sans mauvaise surprise.</div>'+showComment("intro_bain")+'</div>';

    /* === PAGE 3/24 : 2 Avant colonne gauche, 2 Après colonne droite === */
    if (id==="avant_apres") return '<div class="card"><div class="h2">AVANT / APRÈS</div><div class="txt txtLarge">Découvrez plusieurs exemples de transformation de salle de bain.</div><div class="grid avantApresGrid">'+
      '<div class="fixedCard"><div class="media"><img src="'+escapeHtml(getImg("avant_photo_1"))+'" alt="Avant 1"></div><div class="label">Avant</div></div>'+
      '<div class="fixedCard"><div class="media"><img src="'+escapeHtml(getImg("apres_photo_1"))+'" alt="Après 1"></div><div class="label">Après</div></div>'+
      '<div class="fixedCard"><div class="media"><img src="'+escapeHtml(getImg("avant_photo_2"))+'" alt="Avant 2"></div><div class="label">Avant</div></div>'+
      '<div class="fixedCard"><div class="media"><img src="'+escapeHtml(getImg("apres_photo_2"))+'" alt="Après 2"></div><div class="label">Après</div></div>'+
      '</div>'+showComment("avant_apres")+'</div>';

    /* === PAGE 4/24 : nouvelle question fenêtre === */
    if (id==="fenetre") return '<div class="card"><div class="h2">Y A-T-IL UNE FENÊTRE DANS LE PROLONGEMENT DE LA FUTURE PAROI ?</div><div class="txt txtLarge">Cliquez sur une image pour choisir.</div><div class="grid">'+choice("oui","Oui",getImg("fenetre_oui"),state.fenetre==="oui")+choice("non","Non",getImg("fenetre_non"),state.fenetre==="non")+'</div>'+showComment("fenetre")+'</div>';

    if (id==="implantation") return '<div class="card"><div class="h2">IMPLANTATION</div><div class="txt txtLarge">Choisissez l\'implantation de votre douche.</div><div class="grid">'+choice("angle","En angle",getImg("implantation_angle"),state.implantation==="angle")+choice("niche","En niche",getImg("implantation_niche"),state.implantation==="niche")+'</div>'+showComment("implantation")+'</div>';

    if (id==="taille_bac") {
      var bL=Math.max(1,Number(state.bacLongueur||1)),bW=Math.max(1,Number(state.bacLargeur||1));
      var mx=Math.max(bL,bW),mp=320;
      var sW=Math.max(90,Math.round((bL/mx)*mp)),sH=Math.max(90,Math.round((bW/mx)*mp));
      return '<div class="card"><div class="h2">TAILLE SOUHAITÉE DU RECEVEUR EXTRA PLAT</div><div class="txt">Indiquez les dimensions souhaitées.</div>'+
        '<div class="sizeGrid"><div class="sizeBox"><label class="lbl sizeLbl">Longueur</label><div class="unitInputWrap unitInputWrapLarge"><input class="num bigInput" type="number" min="1" step="1" inputmode="numeric" value="'+Number(state.bacLongueur||0)+'" data-act="bacLongueurInput"><span class="unitFix unitFixLarge">cm</span></div></div>'+
        '<div class="sizeBox"><label class="lbl sizeLbl">Largeur</label><div class="unitInputWrap unitInputWrapLarge"><input class="num bigInput" type="number" min="1" step="1" inputmode="numeric" value="'+Number(state.bacLargeur||0)+'" data-act="bacLargeurInput"><span class="unitFix unitFixLarge">cm</span></div></div></div>'+
        '<div class="bacSchemaWrap"><div class="bacSchemaTitle">Schéma proportionnel du receveur</div><div class="bacSchemaStage"><div class="bacSchemaBox"><div class="bacSchemaRect" style="width:'+sW+'px;height:'+sH+'px;"><div class="bacSchemaLabel bacSchemaLabelTop">'+bL+' cm</div><div class="bacSchemaLabel bacSchemaLabelSide">'+bW+' cm</div></div></div></div></div>'+showComment("taille_bac")+'</div>';
    }

    /* === PAGE 7/24 : utilise les nouvelles images si fenêtre=oui === */
    if (id==="modele") {
      var mods=availableModeles();
      return '<div class="card"><div class="h2">MODÈLE DE PAROI</div><div class="txt">Choisissez votre modèle.</div><div class="modeleGrid">'+
        mods.map(function(m){ return '<div class="choice '+(state.modele===m.key?'sel':'')+'" data-choice="'+escapeHtml(m.key)+'"><div class="media media169"><img src="'+escapeHtml(getImg(m.img))+'" alt="'+escapeHtml(m.label)+'"></div><div class="label">'+escapeHtml(m.label)+'</div></div>'; }).join("")+
        '</div>'+showComment("modele")+'</div>';
    }

    if (id==="verre") return '<div class="card"><div class="h2">TYPE DE VERRE</div><div class="txt">Choisissez votre finition.</div><div class="grid">'+choice("transparent","Verre transparent",getImg("verre_transparent"),state.verre==="transparent")+choice("depoli","Verre dépoli",getImg("verre_depoli"),state.verre==="depoli")+'</div>'+showComment("verre")+'</div>';

    if (id==="robinetterie") return '<div class="card"><div class="h2">DÉPLACEMENT DE LA ROBINETTERIE</div><div class="txt">Indiquez si un déplacement est nécessaire.</div><div class="grid">'+choice("oui","Oui",getImg("robinetterie_oui"),state.robinetterie==="oui")+choice("non","Non",getImg("robinetterie_non"),state.robinetterie==="non")+'</div>'+showComment("robinetterie")+'</div>';

    if (id==="forfaits") return '<div class="card"><div class="h2">FORFAITS SUPPLÉMENTAIRES DE MAIN D\'ŒUVRE</div><div class="txt">Sélectionnez les forfaits nécessaires à votre projet.</div><div class="optionList">'+
      '<label class="toggleRow"><input type="checkbox" data-act="toggleMachineLaver" '+(state.forfaitMachineLaver?"checked":"")+'>  <span>Forfait déplacement machine à laver</span></label>'+
      '<label class="toggleRow"><input type="checkbox" data-act="toggleLavabo" '+(state.forfaitLavabo?"checked":"")+'>  <span>Forfait déplacement lavabo</span></label>'+
      '<label class="toggleRow"><input type="checkbox" data-act="toggleBidet" '+(state.forfaitBidet?"checked":"")+'>  <span>Forfait dépose bidet</span></label>'+
      '</div>'+showComment("forfaits")+'</div>';

    if (id==="garanties_douche") return '<div class="card"><div class="h2">GARANTIES</div><div class="smallPhotoGrid2">'+
      '<div class="smallPhotoCell"><div class="fixedCard"><div class="media"><img src="'+escapeHtml(getImg("garanties_photo_1"))+'" alt="Garanties 1"></div></div></div>'+
      '<div class="smallPhotoCell"><div class="fixedCard"><div class="media"><img src="'+escapeHtml(getImg("garanties_photo_2"))+'" alt="Garanties 2"></div></div></div>'+
      '</div><div class="guaranteeBig">GARANTIE SUR LA FOURNITURE ET LA POSE<br><br>VISITE TECHNIQUE GRATUITE ET SANS ENGAGEMENT</div>'+showComment("garanties_douche")+'</div>';

    if (id==="aides_douche") return '<div class="card"><div class="h2">LES AIDES</div><div class="aidesOnlyText">Consultez la page <strong>« Aides financières »</strong> de notre site : vous y trouverez <strong>toutes les informations nécessaires</strong>.<br><br>Un conseiller pourra également vous orienter lors de la visite technique gratuite pour constituer votre dossier.</div>'+showComment("aides_douche")+'</div>';

    if (id==="recap_douche") return '<div class="card"><div class="h2">RÉCAPITULATIF DOUCHE SÉCURISÉE</div><div class="recap"><ul>'+recapDoucheLines().map(function(x){ return "<li>"+escapeHtml(x)+"</li>"; }).join("")+'</ul></div>'+showComment("recap_douche")+'</div>';

    if (id==="price_douche") return '<div class="card"><div class="h2">VOTRE PRIX ESTIMATIF FINAL POUR LE REMPLACEMENT DE VOTRE BAIGNOIRE PAR UNE DOUCHE SÉCURISÉE</div><div class="price"><div class="big">'+money(bd.douche)+'</div><div style="font-size:15px;color:rgba(255,255,255,.88);margin-top:8px;font-weight:700">Estimation TTC posée</div></div><div class="finalPriceText"><p>Ce prix est une estimation très proche du réel.</p><p>Il sera confirmé lors de la visite, gratuite et sans engagement, du conseiller technique.</p></div>'+showComment("price_douche")+'</div>';

    if (id==="proposition_sdb") return '<div class="card"><div class="h2">ET SI VOUS EN PROFITIEZ ?</div><div class="txt txtLarge">Et si vous en profitiez pour donner un coup de neuf à toute votre salle de bain\u00a0? Vous trouverez dans les prochaines pages toutes les options disponibles pour une rénovation complète, à votre rythme et selon vos envies.</div><div class="propositionPhotoWrap"><div class="propositionPhotoCardFull"><img src="'+escapeHtml(getImg("proposition_sdb_photo"))+'" alt="Rénovation salle de bain"></div></div>'+showComment("proposition_sdb")+'</div>';

    if (id==="habillage_murs") return '<div class="card"><div class="h2">HABILLAGE DES MURS</div><div class="txt">Habillage hors espace de douche — Dalles murales</div><div class="grid avantApresGrid">'+
      '<div class="fixedCard"><div class="media"><img src="'+escapeHtml(getImg("habillage_murs_1"))+'" alt="Habillage 1"></div><div class="label">Exemple</div></div>'+
      '<div class="fixedCard"><div class="media"><img src="'+escapeHtml(getImg("habillage_murs_2"))+'" alt="Habillage 2"></div><div class="label">Exemple</div></div>'+
      '</div><div class="recap" style="margin-top:18px"><div style="font-size:16px;line-height:1.9;text-align:left;max-width:780px;margin:0 auto">• Matière SPC<br>• Clipsable et étanche<br>• Épaisseur 4 mm<br>• Garantie 10 ans</div></div><div class="bigCheckWrap">'+bigYesNo(state.habillageMurs==="oui","OUI","habillage_murs_oui")+bigYesNo(state.habillageMurs==="non","NON","habillage_murs_non")+'</div>'+
      (state.habillageMurs==="oui"?'<div class="measure" style="margin-top:18px"><div class="bigVal">'+Number(state.habillageMursM2||0)+' m²</div><div style="max-width:520px;margin:16px auto 0"><label class="lbl" style="text-align:center;font-size:16px;margin-bottom:10px">Surface à habiller hors espace douche</label><div class="unitInputWrap unitInputWrapLarge"><input class="num bigInput" type="number" min="0" step="1" inputmode="numeric" value="'+Number(state.habillageMursM2||0)+'" data-act="habillageMursInput"><span class="unitFix unitFixLarge">m²</span></div></div><div class="choiceBigInfo">COULEUR À DÉFINIR AVEC LE CONSEILLER LORS DE LA VISITE TECHNIQUE</div></div>':'')+
      showComment("habillage_murs")+'</div>';

    if (id==="sol_antiderapant") return '<div class="card"><div class="h2">SOL ANTIDÉRAPANT</div><div class="txt">Option sols antidérapants : finition R10 AKW</div><div class="grid avantApresGrid">'+
      '<div class="fixedCard"><div class="media"><img src="'+escapeHtml(getImg("sol_antiderapant_ex1"))+'" alt="Sol 1"></div><div class="label">Exemple</div></div>'+
      '<div class="fixedCard"><div class="media"><img src="'+escapeHtml(getImg("sol_antiderapant_ex2"))+'" alt="Sol 2"></div><div class="label">Exemple</div></div>'+
      '</div><div class="recap" style="margin-top:18px"><div style="font-size:16px;line-height:1.9;text-align:left;max-width:780px;margin:0 auto">• Clipsable • Étanche • Sous-couche EVA 1 mm • Épaisseur 5 mm • Garantie 15 ans</div></div><div class="bigCheckWrap">'+bigYesNo(state.solAntiderapant==="oui","OUI","sol_oui")+bigYesNo(state.solAntiderapant==="non","NON","sol_non")+'</div>'+
      (state.solAntiderapant==="oui"?'<div class="choiceBigInfo">COULEUR À DÉFINIR AVEC LE CONSEILLER LORS DE LA VISITE TECHNIQUE</div>':'')+showComment("sol_antiderapant")+'</div>';

    if (id==="meubles") return '<div class="card"><div class="h2">MEUBLES</div><div class="txt">Modèle et couleur à définir avec le conseiller.</div><div class="grid meublesGrid">'+
      '<div class="fixedCard"><div class="media"><img src="'+escapeHtml(getImg("meubles_ex1"))+'" alt="Meuble 1"></div><div class="label">Exemple</div></div>'+
      '<div class="fixedCard"><div class="media"><img src="'+escapeHtml(getImg("meubles_ex2"))+'" alt="Meuble 2"></div><div class="label">Exemple</div></div>'+
      '<div class="fixedCard"><div class="media"><img src="'+escapeHtml(getImg("meubles_ex3"))+'" alt="Meuble 3"></div><div class="label">Exemple</div></div>'+
      '<div class="fixedCard"><div class="media"><img src="'+escapeHtml(getImg("meubles_ex4"))+'" alt="Meuble 4"></div><div class="label">Exemple</div></div>'+
      '</div><div class="bigCheckWrap">'+bigYesNo(state.meubles==="oui","OUI","meubles_oui")+bigYesNo(state.meubles==="non","NON","meubles_non")+'</div>'+
      (state.meubles==="oui"?'<div class="choiceBigInfo">MODÈLE ET COULEUR À DÉFINIR AVEC LE CONSEILLER LORS DE LA VISITE TECHNIQUE</div>':'')+showComment("meubles")+'</div>';

    if (id==="porte_coulissante") return '<div class="card"><div class="h2">PORTE COULISSANTE SUR RAIL</div><div class="txt">Modèle à définir avec le conseiller.</div><div class="smallSinglePhotoWrap" style="margin-top:18px"><div class="smallSinglePhotoCard"><div class="fixedCard"><div class="media"><img src="'+escapeHtml(getImg("porte_coulissante_photo"))+'" alt="Porte coulissante"></div><div class="label">Exemple</div></div></div></div><div class="recap" style="margin-top:18px"><div style="font-size:16px;line-height:1.9;text-align:left;max-width:780px;margin:0 auto">• Fourniture et installation complète<br>• Rail silencieux avec accessoires inclus<br>• Réglages précis et finitions soignées</div></div><div class="bigCheckWrap">'+bigYesNo(state.porteCoulissante==="oui","OUI","porte_coulissante_oui")+bigYesNo(state.porteCoulissante==="non","NON","porte_coulissante_non")+'</div>'+
      (state.porteCoulissante==="oui"?'<div class="choiceBigInfo">MODÈLE ET COULEUR À DÉFINIR AVEC LE CONSEILLER LORS DE LA VISITE TECHNIQUE</div>':'')+showComment("porte_coulissante")+'</div>';

    if (id==="seche_serviettes") return '<div class="card"><div class="h2">SÈCHE-SERVIETTES HAUT CONFORT</div><div class="txt">Modèle à définir avec le conseiller.</div><div class="smallSinglePhotoWrap" style="margin-top:18px"><div class="smallSinglePhotoCard"><div class="fixedCard"><div class="media"><img src="'+escapeHtml(getImg("seche_serviettes_photo"))+'" alt="Sèche-serviettes"></div><div class="label">Exemple</div></div></div></div><div class="recap" style="margin-top:18px"><div style="font-size:16px;line-height:1.9;text-align:left;max-width:780px;margin:0 auto">• Design performant adapté à votre salle de bain<br>• Modèle au choix : électrique, mixte ou eau chaude<br>• Installation complète et mise en service</div></div><div class="bigCheckWrap">'+bigYesNo(state.secheServiettes==="oui","OUI","seche_oui")+bigYesNo(state.secheServiettes==="non","NON","seche_non")+'</div>'+
      (state.secheServiettes==="oui"?'<div class="choiceBigInfo">MODÈLE ET COULEUR À DÉFINIR AVEC LE CONSEILLER LORS DE LA VISITE TECHNIQUE</div>':'')+showComment("seche_serviettes")+'</div>';

    if (id==="solutions_wc") return '<div class="card"><div class="h2">NOS SOLUTIONS WC</div><div class="txt">Choisissez la solution WC adaptée à votre projet.</div><div class="grid wcGrid3">'+
      choice("wcSureleve","WC surélevé",getImg("wc_sureleve_photo"),state.solutionWc==="wcSureleve")+
      choice("wcSuspenduHabillage","WC suspendu avec habillage",getImg("wc_suspendu_habillage_photo"),state.solutionWc==="wcSuspenduHabillage")+
      choice("wcBroyeurSilencieux","WC broyeur silencieux",getImg("wc_broyeur_silencieux_photo"),state.solutionWc==="wcBroyeurSilencieux")+
      '</div><div class="wcNonWrap"><button type="button" class="wcNonBtn '+(state.solutionWc==="non"?"sel":"")+'" data-choice="non">NON</button></div>'+showComment("solutions_wc")+'</div>';

    if (id==="recap_global") return '<div class="card"><div class="h2">RÉCAPITULATIF COMPLET</div><div class="recap"><ul>'+recapGlobalLines().map(function(x){ return "<li>"+escapeHtml(x)+"</li>"; }).join("")+'</ul></div>'+showComment("recap_global")+'</div>';

    if (id==="price_global") return '<div class="card"><div class="h2">DEVIS ESTIMATIF DE LA REMISE À NIVEAU DE VOTRE SALLE DE BAIN</div><div class="recap priceBreakdown">'+
      '<div class="priceLine"><span>Prix de la douche sécurisée</span><strong>'+money(bd.douche)+'</strong></div>'+
      '<div class="priceLine"><span>Prix des aménagements salle de bain</span><strong>'+money(bd.amenagements)+'</strong></div>'+
      (state.solutionWc&&state.solutionWc!=="non"?'<div class="priceLine"><span>Prix de la solution WC</span><strong>'+money(bd.solutionWc)+'</strong></div>':'')+
      '</div>'+showComment("price_global")+'</div>';

    if (id==="final_total") return '<div class="card"><div class="h2">PRIX ESTIMATIF DE L\'ENSEMBLE DES TRAVAUX</div><div class="price"><div class="big">'+money(bd.total)+'</div><div style="font-size:15px;color:rgba(255,255,255,.88);margin-top:8px;font-weight:700">Estimation TTC posée</div></div><div class="finalPriceText"><p>Ce prix est une estimation très proche de la réalité.</p><p>Les matières, les couleurs et le prix seront validés lors de la visite gratuite et sans engagement du conseiller technique.</p><p>Le devis définitif sera confirmé après cette visite technique.</p></div><div class="nav" style="margin-top:18px"><a class="btn pri" href="'+escapeHtml(buildContactHref(bd.total))+'">'+escapeHtml(cfg.contactLabel)+'</a></div>'+showComment("final_total")+'</div>';

    return '<div class="card"><div class="txt">Page inconnue.</div></div>';
  }

  function renderCommentField(key,label) {
    return '<div class="hr"></div><label class="lbl">'+escapeHtml(label)+'</label><textarea class="ta" id="comment_'+escapeHtml(key)+'">'+escapeHtml(cfg.comments[key]||"")+'</textarea>';
  }
  function renderImageField(key,label) {
    var url=((cfg.images[key]||{}).url||"");
    var inputId = key==="logo" ? "boLogo" : "img_"+key;
    return '<div class="hr"></div><label class="lbl">'+escapeHtml(label)+' — URL</label>'+
      '<input class="inp" type="text" inputmode="url" id="'+escapeHtml(inputId)+'" value="'+escapeHtml(url)+'">'+
      '<div class="boPreviewWrap">'+(url?'<img class="boPreview" src="'+escapeHtml(url)+'" alt="'+escapeHtml(label)+'" onerror="this.style.display=\'none\'">':'<div class="boPreview boPreviewEmpty">Aucun aperçu</div>')+'</div>';
  }

  function renderBO() {
    if (!adminUnlocked) return "";
    var p=cfg.prices;
    return '<div class="boOverlay" id="boOverlay">'+
      '<div class="bo">'+
        '<div class="boHead"><strong>Back Office — La Bienveillance Douche</strong>'+
          '<div class="boHeadRight"><button class="btn" data-act="closeBo">Fermer</button></div>'+
        '</div>'+
        '<div class="boBody">'+
          '<fieldset class="fs"><legend>Global</legend>'+
            '<label class="lbl">Ligne d\'en-tête</label><input class="inp" type="text" id="boCompanyLine" value="'+escapeHtml(cfg.companyLine)+'">'+
            '<label class="lbl" style="margin-top:10px">URL bouton contact</label><input class="inp" type="text" id="boContactUrl" value="'+escapeHtml(cfg.contactUrl)+'">'+
            '<label class="lbl" style="margin-top:10px">Texte bouton contact</label><input class="inp" type="text" id="boContactLabel" value="'+escapeHtml(cfg.contactLabel)+'">'+
          '</fieldset>'+
          '<fieldset class="fs"><legend>Logo</legend>'+renderImageField("logo","Logo")+'</fieldset>'+
          '<fieldset class="fs"><legend>Prix</legend>'+
            '<div><label class="lbl">Prix de base</label><input class="num" id="boPrixBase" type="number" value="'+p.prixBase+'"></div><div class="hr"></div>'+
            '<div class="row2"><div><label class="lbl">Paroi fixe</label><input class="num" id="boPrixFixe" type="number" value="'+p.base.fixe+'"></div><div><label class="lbl">Fixe + volet</label><input class="num" id="boPrixFixeVolet" type="number" value="'+p.base.fixe_volet+'"></div></div>'+
            '<div class="row2" style="margin-top:10px"><div><label class="lbl">Fixe + volet + angle</label><input class="num" id="boPrixFixeVoletAngle" type="number" value="'+p.base.fixe_volet_angle+'"></div><div><label class="lbl">Paroi coulissante</label><input class="num" id="boPrixCoulissante" type="number" value="'+p.base.coulissante+'"></div></div>'+
            '<div class="row2" style="margin-top:10px"><div><label class="lbl">Coulissante + angle</label><input class="num" id="boPrixCoulissanteAngle" type="number" value="'+p.base.coulissante_angle+'"></div><div><label class="lbl">Porte pivotante</label><input class="num" id="boPrixPivotante" type="number" value="'+p.base.pivotante+'"></div></div>'+
            '<div class="row2" style="margin-top:10px"><div><label class="lbl">Pivotante + angle</label><input class="num" id="boPrixPivotanteAngle" type="number" value="'+p.base.pivotante_angle+'"></div><div><label class="lbl">2 portes pivotantes</label><input class="num" id="boPrixDeuxPivotantes" type="number" value="'+p.base.deux_pivotantes+'"></div></div>'+
            '<div class="row2" style="margin-top:10px"><div><label class="lbl">Verre transparent</label><input class="num" id="boVerreTransparent" type="number" value="'+p.verre.transparent+'"></div><div><label class="lbl">Verre dépoli</label><input class="num" id="boVerreDepoli" type="number" value="'+p.verre.depoli+'"></div></div>'+
            '<div class="row2" style="margin-top:10px"><div><label class="lbl">Robinetterie non</label><input class="num" id="boRobNon" type="number" value="'+p.robinetterie.non+'"></div><div><label class="lbl">Robinetterie oui</label><input class="num" id="boRobOui" type="number" value="'+p.robinetterie.oui+'"></div></div>'+
            '<div class="row2" style="margin-top:10px"><div><label class="lbl">Habillage murs / m²</label><input class="num" id="boHabillageMursM2Prix" type="number" value="'+p.habillageMursM2+'"></div><div><label class="lbl">Sol antidérapant</label><input class="num" id="boSolAntiderapantPrix" type="number" value="'+p.solAntiderapant+'"></div></div>'+
            '<div class="row2" style="margin-top:10px"><div><label class="lbl">Meubles</label><input class="num" id="boMeublesPrix" type="number" value="'+p.meubles+'"></div><div><label class="lbl">Porte coulissante</label><input class="num" id="boPorteCoulissantePrix" type="number" value="'+p.porteCoulissante+'"></div></div>'+
            '<div class="row2" style="margin-top:10px"><div><label class="lbl">Sèche-serviettes</label><input class="num" id="boSecheServiettesPrix" type="number" value="'+p.secheServiettes+'"></div><div><label class="lbl">Forfait machine à laver</label><input class="num" id="boForfaitMachineLaverPrix" type="number" value="'+p.forfaitMachineLaver+'"></div></div>'+
            '<div class="row2" style="margin-top:10px"><div><label class="lbl">Forfait lavabo</label><input class="num" id="boForfaitLavaboPrix" type="number" value="'+p.forfaitLavabo+'"></div><div><label class="lbl">Forfait bidet</label><input class="num" id="boForfaitBidetPrix" type="number" value="'+p.forfaitBidet+'"></div></div>'+
            '<div class="row2" style="margin-top:10px"><div><label class="lbl">WC surélevé</label><input class="num" id="boWcSurelevePrix" type="number" value="'+p.wcSureleve+'"></div><div><label class="lbl">WC suspendu + habillage</label><input class="num" id="boWcSuspenduHabillagePrix" type="number" value="'+p.wcSuspenduHabillage+'"></div></div>'+
            '<div class="row2" style="margin-top:10px"><div><label class="lbl">WC broyeur silencieux</label><input class="num" id="boWcBroyeurSilencieuxPrix" type="number" value="'+p.wcBroyeurSilencieux+'"></div><div></div></div>'+
          '</fieldset>'+
          '<fieldset class="fs"><legend>Commentaires "Conseils"</legend>'+
            renderCommentField("home","Accueil")+renderCommentField("intro_bain","Intro bain")+renderCommentField("avant_apres","Avant / Après")+renderCommentField("fenetre","Fenêtre")+renderCommentField("implantation","Implantation")+renderCommentField("taille_bac","Taille bac")+renderCommentField("modele","Modèle")+renderCommentField("verre","Verre")+renderCommentField("robinetterie","Robinetterie")+renderCommentField("forfaits","Forfaits")+renderCommentField("garanties_douche","Garanties douche")+renderCommentField("aides_douche","Aides douche")+renderCommentField("recap_douche","Récap douche")+renderCommentField("price_douche","Prix douche")+renderCommentField("proposition_sdb","Proposition SDB")+renderCommentField("habillage_murs","Habillage murs")+renderCommentField("sol_antiderapant","Sol antidérapant")+renderCommentField("meubles","Meubles")+renderCommentField("porte_coulissante","Porte coulissante")+renderCommentField("seche_serviettes","Sèche-serviettes")+renderCommentField("solutions_wc","Solutions WC")+renderCommentField("recap_global","Récap global")+renderCommentField("garanties_global","Garanties global")+renderCommentField("aides_global","Aides global")+renderCommentField("price_global","Prix global")+renderCommentField("final_total","Prix final total")+
          '</fieldset>'+
          '<fieldset class="fs"><legend>URLs images</legend>'+
            renderImageField("avant_photo_1","Photo avant 1")+renderImageField("avant_photo_2","Photo avant 2")+renderImageField("apres_photo_1","Photo après 1")+renderImageField("apres_photo_2","Photo après 2")+renderImageField("apres_photo_3","Photo après 3 (non affichée p.3)")+renderImageField("apres_photo_4","Photo après 4 (non affichée p.3)")+renderImageField("fenetre_oui","Fenêtre oui")+renderImageField("fenetre_non","Pas de fenêtre")+
            renderImageField("fenetre_paroi_fixe","Paroi fixe avec fenêtre (page 7)")+renderImageField("fenetre_paroi_fixe_volet","Paroi fixe + volet avec fenêtre (page 7)")+
            renderImageField("implantation_angle","Implantation angle")+renderImageField("implantation_niche","Implantation niche")+renderImageField("modele_fixe","Paroi fixe")+renderImageField("modele_fixe_volet","Fixe + volet")+renderImageField("modele_fixe_volet_angle","Fixe + volet + angle")+renderImageField("modele_coulissante","Paroi coulissante")+renderImageField("modele_coulissante_angle","Coulissante + angle")+renderImageField("modele_pivotante","Porte pivotante")+renderImageField("modele_pivotante_angle","Pivotante + angle")+renderImageField("modele_deux_pivotantes","2 portes pivotantes")+renderImageField("verre_transparent","Verre transparent")+renderImageField("verre_depoli","Verre dépoli")+renderImageField("robinetterie_oui","Robinetterie oui")+renderImageField("robinetterie_non","Robinetterie non")+renderImageField("proposition_sdb_photo","Photo proposition SDB")+renderImageField("habillage_murs_1","Habillage murs 1")+renderImageField("habillage_murs_2","Habillage murs 2")+renderImageField("sol_antiderapant_ex1","Sol antidérapant 1")+renderImageField("sol_antiderapant_ex2","Sol antidérapant 2")+renderImageField("meubles_ex1","Meubles 1")+renderImageField("meubles_ex2","Meubles 2")+renderImageField("meubles_ex3","Meubles 3")+renderImageField("meubles_ex4","Meubles 4")+renderImageField("porte_coulissante_photo","Porte coulissante")+renderImageField("seche_serviettes_photo","Sèche-serviettes")+renderImageField("wc_sureleve_photo","WC surélevé")+renderImageField("wc_suspendu_habillage_photo","WC suspendu + habillage")+renderImageField("wc_broyeur_silencieux_photo","WC broyeur silencieux")+renderImageField("garanties_photo_1","Garanties 1")+renderImageField("garanties_photo_2","Garanties 2")+
          '</fieldset>'+
        '</div>'+
        '<div class="boActions">'+
          '<button class="btn" data-act="closeBo">Fermer</button>'+
          '<button class="btn pri" data-act="saveBo">Enregistrer</button>'+
        '</div>'+
      '</div>'+
    '</div>';
  }

  function saveBOToCfg() {
    var fv = function(id){ var n=app.querySelector(id); return n?n.value:null; };
    var fn = function(id){ var v=fv(id); return v!==null?Number(v||0):null; };
    if (fv("#boCompanyLine")!==null) cfg.companyLine=fv("#boCompanyLine");
    if (fv("#boContactUrl")!==null)  cfg.contactUrl=fv("#boContactUrl");
    if (fv("#boContactLabel")!==null) cfg.contactLabel=fv("#boContactLabel");
    var priceMap = {
      boPrixBase:"prixBase", boPrixFixe:"base.fixe", boPrixFixeVolet:"base.fixe_volet",
      boPrixFixeVoletAngle:"base.fixe_volet_angle", boPrixCoulissante:"base.coulissante",
      boPrixCoulissanteAngle:"base.coulissante_angle", boPrixPivotante:"base.pivotante",
      boPrixPivotanteAngle:"base.pivotante_angle", boPrixDeuxPivotantes:"base.deux_pivotantes",
      boVerreTransparent:"verre.transparent", boVerreDepoli:"verre.depoli",
      boRobNon:"robinetterie.non", boRobOui:"robinetterie.oui",
      boHabillageMursM2Prix:"habillageMursM2", boSolAntiderapantPrix:"solAntiderapant",
      boMeublesPrix:"meubles", boPorteCoulissantePrix:"porteCoulissante",
      boSecheServiettesPrix:"secheServiettes", boWcSurelevePrix:"wcSureleve",
      boWcSuspenduHabillagePrix:"wcSuspenduHabillage", boWcBroyeurSilencieuxPrix:"wcBroyeurSilencieux",
      boForfaitMachineLaverPrix:"forfaitMachineLaver", boForfaitLavaboPrix:"forfaitLavabo",
      boForfaitBidetPrix:"forfaitBidet"
    };
    Object.keys(priceMap).forEach(function(id) {
      var v=fn("#"+id); if (v===null) return;
      var path=priceMap[id].split(".");
      if (path.length===1) cfg.prices[path[0]]=v;
      else cfg.prices[path[0]][path[1]]=v;
    });
    var imgKeys=["logo","avant_photo_1","avant_photo_2","apres_photo_1","apres_photo_2","apres_photo_3","apres_photo_4",
      "fenetre_oui","fenetre_non","fenetre_paroi_fixe","fenetre_paroi_fixe_volet",
      "implantation_angle","implantation_niche","modele_fixe","modele_fixe_volet","modele_fixe_volet_angle","modele_coulissante","modele_coulissante_angle","modele_pivotante","modele_pivotante_angle","modele_deux_pivotantes","verre_transparent","verre_depoli","robinetterie_oui","robinetterie_non","proposition_sdb_photo","habillage_murs_1","habillage_murs_2","sol_antiderapant_ex1","sol_antiderapant_ex2","meubles_ex1","meubles_ex2","meubles_ex3","meubles_ex4","porte_coulissante_photo","seche_serviettes_photo","wc_sureleve_photo","wc_suspendu_habillage_photo","wc_broyeur_silencieux_photo","garanties_photo_1","garanties_photo_2"];
    imgKeys.forEach(function(k){
      var inputId=k==="logo"?"#boLogo":"#img_"+k;
      var v=fv(inputId); if (v!==null) setImageUrl(k,v);
    });
    Object.keys(DEF.comments).forEach(function(k){
      var v=fv("#comment_"+k); if (v!==null) cfg.comments[k]=v;
    });
  }

  function scrollToConfiguratorTop() {
    try { root.scrollIntoView({ behavior: "smooth", block: "start" }); } catch (e) { /* ignore */ }
  }

  function renderCommentModal() {
    return '<div class="commentModalOverlay" id="commentModalOverlay">'+
      '<div class="commentModal" role="dialog" aria-modal="true">'+
        '<div class="commentModalHead">'+
          '<div><div class="commentModalEyebrow">La Bienveillance</div><div class="commentModalTitle">Conseils</div></div>'+
          '<button type="button" class="commentModalX" data-comment-close="1">×</button>'+
        '</div>'+
        '<div class="commentModalBody" id="commentModalBody"></div>'+
        '<div class="commentModalActions"><button type="button" class="btn pri" data-comment-close="1">Fermer</button></div>'+
      '</div></div>';
  }
  function openCommentModal(key) {
    var txt=(cfg.comments[key]||"").trim(); if (!txt) return;
    var ov=document.getElementById("commentModalOverlay"),bd=document.getElementById("commentModalBody");
    if (!ov||!bd) return;
    bd.innerHTML=escapeHtml(txt).replace(/\n/g,"<br>");
    ov.classList.add("show"); document.body.classList.add("jlmNoScroll");
  }
  function closeCommentModal() {
    var ov=document.getElementById("commentModalOverlay"),bd=document.getElementById("commentModalBody");
    if (ov) ov.classList.remove("show"); if (bd) bd.innerHTML="";
    document.body.classList.remove("jlmNoScroll");
  }

  function render() {
    normalizeState();
    var ids=steps();
    if (state.step>ids.length-1) state.step=ids.length-1;
    var cur=ids[state.step];
    var progress=Math.round(((state.step+1)/ids.length)*100);

    app.innerHTML=
      '<div class="top">'+
        '<div class="brand">'+
          '<div class="logo"><img src="'+escapeHtml(getImg("logo"))+'" alt="Logo"></div>'+
          '<div><div class="small">'+escapeHtml(cfg.companyLine)+'</div></div>'+
        '</div>'+
        '<div class="progress"><div class="pill">'+(state.step+1)+' / '+ids.length+'</div><div class="bar"><i style="width:'+progress+'%"></i></div></div>'+
      '</div>'+
      '<div class="alertBand '+(state.showAlert?"show":"")+'">'+(state.msg||"MERCI DE FAIRE UN CHOIX AVANT DE CONTINUER")+'</div>'+
      renderPage()+
      '<div class="nav">'+
        '<button class="btn reset" data-act="reset">RÉINITIALISER</button>'+
        '<button class="btn" data-act="prev" '+(state.step===0?"disabled":"")+'>RETOUR</button>'+
        (cur==="final_total"?"":'<button class="btn pri" data-act="next">SUIVANT</button>')+
      '</div>'+
      renderBO()+
      renderCommentModal();

    app.querySelectorAll("[data-choice]").forEach(function(el) {
      el.addEventListener("click", function() {
        var k=el.getAttribute("data-choice");
        if (cur==="fenetre"){ state.fenetre=k; state.modele=""; }
        if (cur==="implantation") state.implantation=k;
        if (cur==="modele") state.modele=k;
        if (cur==="verre") state.verre=k;
        if (cur==="robinetterie") state.robinetterie=k;
        if (cur==="solutions_wc") state.solutionWc=k;
        state.msg=""; state.showAlert=false; render();
      });
    });
    app.querySelectorAll("[data-bigcheck]").forEach(function(btn) {
      btn.addEventListener("click", function() {
        var k=btn.getAttribute("data-bigcheck");
        if (k==="habillage_murs_oui") state.habillageMurs="oui";
        if (k==="habillage_murs_non"){ state.habillageMurs="non"; state.habillageMursM2=0; }
        if (k==="sol_oui") state.solAntiderapant="oui";
        if (k==="sol_non") state.solAntiderapant="non";
        if (k==="meubles_oui") state.meubles="oui";
        if (k==="meubles_non") state.meubles="non";
        if (k==="porte_coulissante_oui") state.porteCoulissante="oui";
        if (k==="porte_coulissante_non") state.porteCoulissante="non";
        if (k==="seche_oui") state.secheServiettes="oui";
        if (k==="seche_non") state.secheServiettes="non";
        state.msg=""; state.showAlert=false; render();
      });
    });
    var bacL=app.querySelector('[data-act="bacLongueurInput"]');
    if (bacL) bacL.addEventListener("input",function(){ state.bacLongueur=parseInt(bacL.value||"0")||0; render(); });
    var bacW=app.querySelector('[data-act="bacLargeurInput"]');
    if (bacW) bacW.addEventListener("input",function(){ state.bacLargeur=parseInt(bacW.value||"0")||0; render(); });
    app.querySelectorAll('[data-act="habillageMursInput"]').forEach(function(inp){
      inp.addEventListener("input",function(){ state.habillageMursM2=parseInt(inp.value||"0")||0; });
      inp.addEventListener("change",function(){ render(); });
    });
    var mac=app.querySelector('[data-act="toggleMachineLaver"]');
    if (mac) mac.addEventListener("change",function(){ state.forfaitMachineLaver=!!mac.checked; render(); });
    var lav=app.querySelector('[data-act="toggleLavabo"]');
    if (lav) lav.addEventListener("change",function(){ state.forfaitLavabo=!!lav.checked; render(); });
    var bid=app.querySelector('[data-act="toggleBidet"]');
    if (bid) bid.addEventListener("change",function(){ state.forfaitBidet=!!bid.checked; render(); });
    app.querySelectorAll('[data-act="reset"]').forEach(function(btn){
      btn.addEventListener("click",function(){
        if (window.confirm("Réinitialiser le configurateur ?")){ state=clone(initialState); closeCommentModal(); render(); scrollToConfiguratorTop(); }
      });
    });
    app.querySelectorAll('[data-act="next"]').forEach(function(btn){
      btn.addEventListener("click",function(){
        var err=validate(steps()[state.step]);
        if (err){ state.msg=err; state.showAlert=true; render(); return; }
        if (state.step<steps().length-1){ closeCommentModal(); state.step++; state.msg=""; state.showAlert=false; render(); scrollToConfiguratorTop(); }
      });
    });
    app.querySelectorAll('[data-act="prev"]').forEach(function(btn){
      btn.addEventListener("click",function(){
        if (state.step>0){ closeCommentModal(); state.step--; state.msg=""; state.showAlert=false; render(); scrollToConfiguratorTop(); }
      });
    });
    app.querySelectorAll("[data-comment-open]").forEach(function(btn){
      btn.addEventListener("click",function(){ openCommentModal(btn.getAttribute("data-comment-open")); });
    });
    app.querySelectorAll("[data-comment-close]").forEach(function(btn){
      btn.addEventListener("click",function(){ closeCommentModal(); });
    });
    var mo=document.getElementById("commentModalOverlay");
    if (mo) mo.addEventListener("click",function(e){ if (e.target===mo) closeCommentModal(); });
    app.querySelectorAll('[data-act="closeBo"]').forEach(function(btn){
      btn.addEventListener("click",function(){
        var bo=document.getElementById("boOverlay");
        if (bo) bo.classList.remove("show");
      });
    });
    app.querySelectorAll('[data-act="saveBo"]').forEach(function(btn){
      btn.addEventListener("click", async function(){
        saveBOToCfg();
        var ok = await wpSaveConfig();
        var bo=document.getElementById("boOverlay");
        if (bo) bo.classList.remove("show");
        render();
        alert(ok ? "✓ Configuration enregistrée dans WordPress." : "⚠ Enregistrement local uniquement (non connecté en admin).");
      });
    });
    var logo=app.querySelector(".logo");
    if (logo) logo.addEventListener("dblclick",function(e){
      e.preventDefault(); e.stopPropagation();
      var boEl=document.getElementById("boOverlay");
      if (isWpAdmin()) {
        adminUnlocked=true;
        if (boEl) boEl.classList.toggle("show");
        render();
        return;
      }
      var fb=window.JLM_DOUCHE_WP && window.JLM_DOUCHE_WP.backOfficeFallbackCode;
      if (!fb || !String(fb).trim()) {
        return;
      }
      if (!adminUnlocked) {
        var code=window.prompt("Code d'accès Back Office :"); if (code===null) return;
        if (String(code||"").trim()!==String(fb).trim()){ alert("Code incorrect."); return; }
        adminUnlocked=true;
        render();
      }
      if (boEl) boEl.classList.toggle("show");
    });
    setTimeout(function(){
      var bo=document.getElementById("boOverlay");
      if (!bo) return;
      bo.querySelectorAll("input,textarea").forEach(function(el){
        el.setAttribute("autocomplete","off");
        el.addEventListener("paste",function(e){ e.stopPropagation(); },true);
        el.addEventListener("keydown",function(e){ e.stopPropagation(); },true);
        el.addEventListener("keyup",function(e){ e.stopPropagation(); },true);
        el.addEventListener("cut",function(e){ e.stopPropagation(); },true);
        el.addEventListener("copy",function(e){ e.stopPropagation(); },true);
        el.style.pointerEvents="auto";
        el.style.userSelect="text";
        el.style.webkitUserSelect="text";
      });
    }, 100);
  }

  function boot() {
    app = document.createElement("div");
    app.className = "app";
    root.appendChild(app);
    wpLoadConfig().then(function () {
      render();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
