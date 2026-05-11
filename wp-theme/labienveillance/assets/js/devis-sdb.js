/**
 * Devis estimatif salle de bain — La Bienveillance
 *
 * Vanilla JS, sans dépendance, accessible, persistance localStorage.
 *
 * Configuration par défaut intégrée. Surchargeable depuis WordPress via le filtre
 * `labienveillance_devis_sdb_config` qui injecte un objet `window.LBV_DEVIS_SDB`
 * fusionné en deep-merge sur les valeurs par défaut.
 *
 * Hand-off : à l'étape finale, l'utilisateur peut envoyer son projet vers
 * /contact/ avec les paramètres `?projet=devis-sdb&total=…&recap=…` qui seront
 * lus côté page-contact.php pour pré-remplir le formulaire CF7.
 */
(function () {
	'use strict';

	var root = document.getElementById('devis-sdb-app');
	if (!root) {
		return;
	}

	/* ============================================================ *
	 *  Helpers
	 * ============================================================ */

	function clone(obj) {
		return JSON.parse(JSON.stringify(obj));
	}

	function deepMerge(target, source) {
		if (!source || typeof source !== 'object') return target;
		Object.keys(source).forEach(function (key) {
			var val = source[key];
			if (val && typeof val === 'object' && !Array.isArray(val)) {
				if (!target[key] || typeof target[key] !== 'object') {
					target[key] = {};
				}
				deepMerge(target[key], val);
			} else {
				target[key] = val;
			}
		});
		return target;
	}

	function escHtml(s) {
		return String(s == null ? '' : s)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	}

	function money(n) {
		return Number(n || 0).toLocaleString('fr-FR') + ' €';
	}

	function safeParseInt(v, fallback) {
		var n = parseInt(v, 10);
		return isNaN(n) ? fallback : n;
	}

	/* ============================================================ *
	 *  Pictogrammes SVG inline (pas de fichier image externe)
	 * ============================================================ */

	var PICT = {
		fenetre_oui: '<svg viewBox="0 0 64 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="22" height="40" rx="1"/><rect x="34" y="4" width="24" height="40" rx="1.5"/><line x1="46" y1="4" x2="46" y2="44"/><line x1="34" y1="24" x2="58" y2="24"/></svg>',
		fenetre_non: '<svg viewBox="0 0 64 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="52" height="40" rx="1"/></svg>',
		implantation_angle: '<svg viewBox="0 0 64 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="56" height="40" rx="1"/><rect x="4" y="4" width="22" height="22" fill="currentColor" fill-opacity="0.18"/><line x1="26" y1="4" x2="26" y2="26"/><line x1="4" y1="26" x2="26" y2="26"/></svg>',
		implantation_niche: '<svg viewBox="0 0 64 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="56" height="40" rx="1"/><rect x="14" y="4" width="36" height="14" fill="currentColor" fill-opacity="0.18"/><line x1="14" y1="4" x2="14" y2="18"/><line x1="50" y1="4" x2="50" y2="18"/><line x1="14" y1="18" x2="50" y2="18"/></svg>',
		modele_fixe: '<svg viewBox="0 0 64 40" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="6" x2="6" y2="34"/><line x1="58" y1="6" x2="58" y2="34"/><rect x="14" y="6" width="20" height="28" fill="currentColor" fill-opacity="0.12"/></svg>',
		modele_fixe_volet: '<svg viewBox="0 0 64 40" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="6" x2="6" y2="34"/><line x1="58" y1="6" x2="58" y2="34"/><rect x="14" y="6" width="22" height="28" fill="currentColor" fill-opacity="0.12"/><path d="M36 6 L46 16" stroke-dasharray="2 2"/></svg>',
		modele_fixe_volet_angle: '<svg viewBox="0 0 64 40" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="6" x2="6" y2="34"/><line x1="58" y1="6" x2="58" y2="34"/><rect x="10" y="6" width="20" height="28" fill="currentColor" fill-opacity="0.12"/><rect x="38" y="6" width="14" height="28" fill="currentColor" fill-opacity="0.12"/><path d="M30 6 L38 14" stroke-dasharray="2 2"/></svg>',
		modele_coulissante: '<svg viewBox="0 0 64 40" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="6" x2="6" y2="34"/><line x1="58" y1="6" x2="58" y2="34"/><rect x="12" y="6" width="22" height="28" fill="currentColor" fill-opacity="0.12"/><rect x="32" y="10" width="22" height="20" fill="currentColor" fill-opacity="0.06"/><path d="M48 20 l5 0 m-2 -2 l2 2 -2 2"/></svg>',
		modele_coulissante_angle: '<svg viewBox="0 0 64 40" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="6" x2="6" y2="34"/><line x1="58" y1="6" x2="58" y2="34"/><rect x="10" y="6" width="18" height="28" fill="currentColor" fill-opacity="0.12"/><rect x="26" y="10" width="14" height="20" fill="currentColor" fill-opacity="0.06"/><rect x="44" y="6" width="10" height="28" fill="currentColor" fill-opacity="0.12"/></svg>',
		modele_pivotante: '<svg viewBox="0 0 64 40" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="6" x2="6" y2="34"/><line x1="58" y1="6" x2="58" y2="34"/><path d="M14 6 L14 34 L42 22 Z" fill="currentColor" fill-opacity="0.12"/></svg>',
		modele_pivotante_angle: '<svg viewBox="0 0 64 40" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="6" x2="6" y2="34"/><line x1="58" y1="6" x2="58" y2="34"/><path d="M10 6 L10 34 L34 22 Z" fill="currentColor" fill-opacity="0.12"/><rect x="42" y="6" width="14" height="28" fill="currentColor" fill-opacity="0.12"/></svg>',
		modele_deux_pivotantes: '<svg viewBox="0 0 64 40" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="6" x2="6" y2="34"/><line x1="58" y1="6" x2="58" y2="34"/><path d="M10 6 L10 34 L30 22 Z" fill="currentColor" fill-opacity="0.12"/><path d="M54 6 L54 34 L34 22 Z" fill="currentColor" fill-opacity="0.12"/></svg>',
		verre_transparent: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="6" width="44" height="52" rx="2" fill="currentColor" fill-opacity="0.04"/><line x1="22" y1="14" x2="14" y2="26" stroke-opacity="0.4"/><line x1="32" y1="20" x2="20" y2="36" stroke-opacity="0.3"/></svg>',
		verre_depoli: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="6" width="44" height="52" rx="2" fill="currentColor" fill-opacity="0.18"/><line x1="14" y1="18" x2="50" y2="18" stroke-opacity="0.5"/><line x1="14" y1="32" x2="50" y2="32" stroke-opacity="0.5"/><line x1="14" y1="46" x2="50" y2="46" stroke-opacity="0.5"/></svg>',
		robinet_oui: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14 L14 32 L34 32 L34 44"/><path d="M28 32 L28 22 L40 22"/><circle cx="34" cy="48" r="4"/><path d="M44 14 L52 14 L48 22 L52 30 L44 30" /></svg>',
		robinet_non: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14 L14 32 L34 32 L34 44"/><circle cx="34" cy="48" r="4"/></svg>',
		wc_sureleve: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M16 14 L40 14 L40 28 L16 28 Z" fill="currentColor" fill-opacity="0.12"/><path d="M14 28 L42 28 L40 46 L20 46 Z"/><path d="M40 18 L52 18 L52 36"/></svg>',
		wc_suspendu: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14 8 L50 8 L50 36 L14 36 Z" fill="currentColor" fill-opacity="0.12"/><path d="M18 36 L46 36 L42 52 L22 52 Z"/><line x1="6" y1="58" x2="58" y2="58"/></svg>',
		wc_broyeur: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M16 12 L42 12 L42 26 L16 26 Z" fill="currentColor" fill-opacity="0.12"/><path d="M14 26 L44 26 L40 44 L18 44 Z"/><circle cx="29" cy="52" r="6" fill="currentColor" fill-opacity="0.18"/><line x1="23" y1="52" x2="35" y2="52"/></svg>',
		wc_aucun: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="22"/><line x1="18" y1="18" x2="46" y2="46"/></svg>',
		shower_intro: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="36" cy="14" r="4" fill="currentColor" fill-opacity="0.18"/><path d="M36 18 L20 50"/><path d="M30 38 L18 38" stroke-opacity="0.45"/><path d="M28 44 L16 44" stroke-opacity="0.45"/><path d="M26 50 L14 50" stroke-opacity="0.45"/><path d="M44 6 L54 6 L54 14"/></svg>',
		bath_intro: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 36 L56 36 L52 52 L12 52 Z" fill="currentColor" fill-opacity="0.10"/><path d="M14 16 L14 28 L24 28" /><circle cx="14" cy="14" r="3" /></svg>',
		warranty_seal: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M32 6 L52 14 L52 30 C52 44 42 54 32 58 C22 54 12 44 12 30 L12 14 Z" fill="currentColor" fill-opacity="0.12"/><path d="M22 32 L30 40 L44 24"/></svg>'
	};

	function pict(key) {
		return PICT[key] || '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="6" width="52" height="52" rx="6"/></svg>';
	}

	/* ============================================================ *
	 *  Configuration par défaut (surchargeable via window.LBV_DEVIS_SDB)
	 * ============================================================ */

	var DEFAULTS = {
		contactUrl: '/contact/',
		contactLabel: 'Demander un rendez-vous',
		prices: {
			prixBase: 0,
			base: {
				fixe: 1200,
				fixe_volet: 1450,
				fixe_volet_angle: 1750,
				coulissante: 1890,
				coulissante_angle: 2190,
				pivotante: 1690,
				pivotante_angle: 1990,
				deux_pivotantes: 2290
			},
			verre: { transparent: 0, depoli: 180 },
			robinetterie: { non: 0, oui: 390 },
			habillageMursM2: 120,
			solAntiderapant: 990,
			porteCoulissante: 990,
			secheServiettes: 790,
			wcSureleve: 590,
			wcSuspenduHabillage: 1490,
			wcBroyeurSilencieux: 990,
			forfaitMachineLaver: 290,
			forfaitLavabo: 390,
			forfaitBidet: 290
		},
		hints: {
			home: '',
			intro_bain: 'La transformation se fait habituellement en une seule journée, sans gros œuvre, et nous protégeons l\'ensemble de votre logement.',
			avant_apres: 'Photos avant / après : à remplacer par des chantiers réels lorsque le client les fournit.',
			fenetre: 'Une fenêtre dans le prolongement de la paroi limite parfois les modèles disponibles : c\'est pour ça que nous posons la question dès le début.',
			implantation: 'En angle : douche calée dans deux murs perpendiculaires. En niche : douche placée entre deux murs déjà existants.',
			taille_bac: 'Mesures conseillées : longueur 80–180 cm, largeur 70–100 cm. Le receveur extra-plat permet une entrée de plain-pied.',
			modele: 'Plus la paroi est ouvrante (pivotante, coulissante), plus l\'entrée est confortable. La paroi fixe est l\'option la plus économique.',
			verre: 'Le verre dépoli préserve l\'intimité, recommandé si la salle de bain est partagée.',
			robinetterie: 'Si la robinetterie reste à sa place actuelle, pas de surcoût. Sinon, nous prévoyons les travaux de plomberie nécessaires.',
			forfaits: 'Ces forfaits couvrent la dépose / repose d\'éléments existants. Cochez uniquement ce qui s\'applique chez vous.',
			garanties_douche: 'Visite technique gratuite, devis sans engagement, garantie sur la fourniture ET la pose.',
			aides_douche: 'MaPrimeAdapt\', TVA réduite, aides ANAH… Notre conseiller vous aide à constituer votre dossier.',
			recap_douche: 'Récapitulatif de votre future douche sécurisée. Vous pouvez revenir en arrière à tout moment.',
			price_douche: 'Estimation TTC posée. Le prix définitif est confirmé lors de la visite technique gratuite.',
			proposition_sdb: 'Vous pouvez en rester là si vous le souhaitez : la suite est facultative et concerne le reste de la pièce.',
			habillage_murs: 'Dalles SPC clipsables, étanches, garanties 10 ans. Couleurs et finitions vues lors de la visite technique.',
			sol_antiderapant: 'Sols clipsables certifiés R10 AKW, étanches, garantis 15 ans.',
			porte_coulissante: 'Système silencieux sur rail, fourniture et pose comprises.',
			seche_serviettes: 'Électrique, mixte ou eau chaude — modèle choisi avec le conseiller.',
			solutions_wc: 'Surélevé pour limiter l\'effort, suspendu pour une finition contemporaine, broyeur silencieux quand l\'évacuation est compliquée.',
			recap_global: 'Vue d\'ensemble. Vous pouvez encore revenir modifier n\'importe quel choix.',
			price_global: 'Détail des trois grands postes : douche, aménagements, WC.',
			final_total: 'Vous pouvez nous transmettre cette estimation depuis le bouton ci-dessous : nous la recevrons avec votre récapitulatif et nous vous rappelons sous 24-48 h.'
		},
		photos: {
			avant_1: '',
			apres_1: '',
			avant_2: '',
			apres_2: '',
			habillage_1: '',
			habillage_2: '',
			sol_1: '',
			sol_2: '',
			porte_coulissante: '',
			seche_serviettes: '',
			proposition_sdb: ''
		}
	};

	var injected = (typeof window !== 'undefined' && window.LBV_DEVIS_SDB) ? window.LBV_DEVIS_SDB : {};
	var cfg = deepMerge(clone(DEFAULTS), injected);

	/* ============================================================ *
	 *  État
	 * ============================================================ */

	var initialState = {
		step: 0,
		fenetre: '',
		implantation: '',
		bacLongueur: 120,
		bacLargeur: 90,
		modele: '',
		verre: '',
		robinetterie: '',
		forfaitMachineLaver: false,
		forfaitLavabo: false,
		forfaitBidet: false,
		habillageMurs: '',
		habillageMursM2: 0,
		solAntiderapant: '',
		porteCoulissante: '',
		secheServiettes: '',
		solutionWc: ''
	};

	var state = clone(initialState);

	/* ============================================================ *
	 *  LocalStorage (persistance entre rafraîchissements)
	 * ============================================================ */

	var STORAGE_KEY = 'labienveillance_devis_sdb_v1';

	function loadStored() {
		try {
			var raw = window.localStorage.getItem(STORAGE_KEY);
			if (!raw) return null;
			var parsed = JSON.parse(raw);
			if (!parsed || typeof parsed !== 'object' || !parsed.savedAt) return null;
			// Expire après 30 jours
			if (Date.now() - parsed.savedAt > 30 * 24 * 3600 * 1000) {
				window.localStorage.removeItem(STORAGE_KEY);
				return null;
			}
			return parsed;
		} catch (e) {
			return null;
		}
	}

	function persist() {
		try {
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
				state: state,
				savedAt: Date.now()
			}));
		} catch (e) { /* localStorage indisponible (mode privé) : on ignore */ }
	}

	function clearStored() {
		try { window.localStorage.removeItem(STORAGE_KEY); } catch (e) {}
	}

	/* ============================================================ *
	 *  Pas (steps)
	 * ============================================================ */

	var STEPS = [
		'home',
		'intro_bain',
		'avant_apres',
		'fenetre',
		'implantation',
		'taille_bac',
		'modele',
		'verre',
		'robinetterie',
		'forfaits',
		'garanties_douche',
		'aides_douche',
		'recap_douche',
		'price_douche',
		'proposition_sdb',
		'habillage_murs',
		'sol_antiderapant',
		'porte_coulissante',
		'seche_serviettes',
		'solutions_wc',
		'recap_global',
		'price_global',
		'final_total'
	];

	var STEP_TITLES = {
		home: 'Bienvenue',
		intro_bain: 'Votre projet salle de bain',
		avant_apres: 'Avant / après',
		fenetre: 'Fenêtre dans le prolongement ?',
		implantation: 'Implantation',
		taille_bac: 'Taille du receveur',
		modele: 'Modèle de paroi',
		verre: 'Type de verre',
		robinetterie: 'Robinetterie',
		forfaits: 'Forfaits supplémentaires',
		garanties_douche: 'Garanties',
		aides_douche: 'Les aides',
		recap_douche: 'Récapitulatif douche',
		price_douche: 'Prix douche sécurisée',
		proposition_sdb: 'Et si vous en profitiez ?',
		habillage_murs: 'Habillage des murs',
		sol_antiderapant: 'Sol antidérapant',
		porte_coulissante: 'Porte coulissante',
		seche_serviettes: 'Sèche-serviettes',
		solutions_wc: 'Solutions WC',
		recap_global: 'Récapitulatif complet',
		price_global: 'Détail du devis',
		final_total: 'Estimation globale'
	};

	/* ============================================================ *
	 *  Modèles selon contexte (fenêtre / pas fenêtre)
	 * ============================================================ */

	function availableModeles() {
		if (state.fenetre === 'oui') {
			return [
				{ key: 'fixe', label: 'Paroi fixe', pict: 'modele_fixe' },
				{ key: 'fixe_volet', label: 'Fixe + volet', pict: 'modele_fixe_volet' }
			];
		}
		return [
			{ key: 'fixe', label: 'Paroi fixe', pict: 'modele_fixe' },
			{ key: 'fixe_volet', label: 'Fixe + volet', pict: 'modele_fixe_volet' },
			{ key: 'fixe_volet_angle', label: 'Fixe + volet + angle fixe', pict: 'modele_fixe_volet_angle' },
			{ key: 'coulissante', label: 'Paroi coulissante', pict: 'modele_coulissante' },
			{ key: 'coulissante_angle', label: 'Coulissante + angle', pict: 'modele_coulissante_angle' },
			{ key: 'pivotante', label: 'Porte pivotante', pict: 'modele_pivotante' },
			{ key: 'pivotante_angle', label: 'Pivotante + angle', pict: 'modele_pivotante_angle' },
			{ key: 'deux_pivotantes', label: '2 portes pivotantes', pict: 'modele_deux_pivotantes' }
		];
	}

	function normalizeState() {
		var avail = availableModeles().map(function (m) { return m.key; });
		if (avail.indexOf(state.modele) === -1) state.modele = '';
	}

	/* ============================================================ *
	 *  Calcul du prix
	 * ============================================================ */

	function calcBreakdown() {
		normalizeState();
		var p = cfg.prices;
		var douche = Number(p.prixBase || 0)
			+ Number((p.base || {})[state.modele] || 0)
			+ Number((p.verre || {})[state.verre] || 0)
			+ Number((p.robinetterie || {})[state.robinetterie] || 0)
			+ (state.forfaitMachineLaver ? Number(p.forfaitMachineLaver || 0) : 0)
			+ (state.forfaitLavabo ? Number(p.forfaitLavabo || 0) : 0)
			+ (state.forfaitBidet ? Number(p.forfaitBidet || 0) : 0);
		var amenagements =
			(state.habillageMurs === 'oui' ? Number(state.habillageMursM2 || 0) * Number(p.habillageMursM2 || 0) : 0)
			+ (state.solAntiderapant === 'oui' ? Number(p.solAntiderapant || 0) : 0)
			+ (state.porteCoulissante === 'oui' ? Number(p.porteCoulissante || 0) : 0)
			+ (state.secheServiettes === 'oui' ? Number(p.secheServiettes || 0) : 0);
		var solutionWc = 0;
		if (state.solutionWc === 'wcSureleve') solutionWc = Number(p.wcSureleve || 0);
		else if (state.solutionWc === 'wcSuspenduHabillage') solutionWc = Number(p.wcSuspenduHabillage || 0);
		else if (state.solutionWc === 'wcBroyeurSilencieux') solutionWc = Number(p.wcBroyeurSilencieux || 0);
		return {
			douche: douche,
			amenagements: amenagements,
			solutionWc: solutionWc,
			total: douche + amenagements + solutionWc
		};
	}

	/* ============================================================ *
	 *  Validation
	 * ============================================================ */

	function validate(stepId) {
		switch (stepId) {
			case 'fenetre':
				if (!state.fenetre) return 'Merci d\'indiquer s\'il y a une fenêtre dans le prolongement.';
				break;
			case 'implantation':
				if (!state.implantation) return 'Merci de choisir une implantation.';
				break;
			case 'taille_bac':
				if (!state.bacLongueur || state.bacLongueur < 60 || state.bacLongueur > 220) {
					return 'Longueur attendue entre 60 et 220 cm.';
				}
				if (!state.bacLargeur || state.bacLargeur < 60 || state.bacLargeur > 120) {
					return 'Largeur attendue entre 60 et 120 cm.';
				}
				break;
			case 'modele':
				if (!state.modele) return 'Merci de choisir un modèle de paroi.';
				break;
			case 'verre':
				if (!state.verre) return 'Merci de choisir un type de verre.';
				break;
			case 'robinetterie':
				if (!state.robinetterie) return 'Merci d\'indiquer Oui ou Non pour la robinetterie.';
				break;
			case 'habillage_murs':
				if (!state.habillageMurs) return 'Merci d\'indiquer Oui ou Non pour l\'habillage des murs.';
				if (state.habillageMurs === 'oui' && (!state.habillageMursM2 || state.habillageMursM2 <= 0)) {
					return 'Merci d\'indiquer une surface en m² supérieure à 0.';
				}
				break;
			case 'sol_antiderapant':
				if (!state.solAntiderapant) return 'Merci d\'indiquer Oui ou Non pour le sol antidérapant.';
				break;
			case 'porte_coulissante':
				if (!state.porteCoulissante) return 'Merci d\'indiquer Oui ou Non pour la porte coulissante.';
				break;
			case 'seche_serviettes':
				if (!state.secheServiettes) return 'Merci d\'indiquer Oui ou Non pour le sèche-serviettes.';
				break;
			case 'solutions_wc':
				if (!state.solutionWc) return 'Merci de choisir une solution WC (ou « non concerné »).';
				break;
		}
		return '';
	}

	/* ============================================================ *
	 *  Récapitulatifs (texte)
	 * ============================================================ */

	function modeleLabel() {
		var m = availableModeles().filter(function (m) { return m.key === state.modele; })[0];
		return m ? m.label : '';
	}

	function wcLabel() {
		switch (state.solutionWc) {
			case 'wcSureleve': return 'WC surélevé';
			case 'wcSuspenduHabillage': return 'WC suspendu avec habillage';
			case 'wcBroyeurSilencieux': return 'WC broyeur silencieux';
			case 'non': return 'Aucune solution WC';
			default: return '';
		}
	}

	function recapDoucheLines() {
		var out = [];
		if (state.fenetre) out.push('Fenêtre dans le prolongement : <strong>' + (state.fenetre === 'oui' ? 'oui' : 'non') + '</strong>');
		if (state.implantation) out.push('Implantation : <strong>' + (state.implantation === 'angle' ? 'en angle' : 'en niche') + '</strong>');
		out.push('Receveur : <strong>' + Number(state.bacLongueur || 0) + ' × ' + Number(state.bacLargeur || 0) + ' cm</strong>');
		if (state.modele) out.push('Modèle : <strong>' + escHtml(modeleLabel()) + '</strong>');
		if (state.verre) out.push('Verre : <strong>' + (state.verre === 'transparent' ? 'transparent' : 'dépoli') + '</strong>');
		if (state.robinetterie) out.push('Déplacement robinetterie : <strong>' + state.robinetterie + '</strong>');
		if (state.forfaitMachineLaver) out.push('Forfait : déplacement machine à laver');
		if (state.forfaitLavabo) out.push('Forfait : déplacement lavabo');
		if (state.forfaitBidet) out.push('Forfait : dépose bidet');
		return out;
	}

	function recapGlobalLines() {
		var out = recapDoucheLines();
		if (state.habillageMurs) out.push('Habillage murs : <strong>' + state.habillageMurs + (state.habillageMurs === 'oui' ? ' (' + Number(state.habillageMursM2 || 0) + ' m²)' : '') + '</strong>');
		if (state.solAntiderapant) out.push('Sol antidérapant : <strong>' + state.solAntiderapant + '</strong>');
		if (state.porteCoulissante) out.push('Porte coulissante : <strong>' + state.porteCoulissante + '</strong>');
		if (state.secheServiettes) out.push('Sèche-serviettes : <strong>' + state.secheServiettes + '</strong>');
		if (state.solutionWc) out.push('Solution WC : <strong>' + escHtml(wcLabel()) + '</strong>');
		return out;
	}

	function recapPlainText() {
		// Version texte (pas de HTML) pour le hand-off CF7
		var bd = calcBreakdown();
		var lines = recapGlobalLines().map(function (l) {
			return l.replace(/<[^>]+>/g, '');
		});
		lines.push('— Total estimatif : ' + money(bd.total));
		return lines.join('\n');
	}

	/* ============================================================ *
	 *  Construction d'un écran de choix
	 * ============================================================ */

	function buildChoice(opts) {
		// opts = { key, label, pictKey?, photoKey?, sub?, selected, gridClass? }
		var media = '';
		if (opts.pictKey) {
			media = '<span class="devis-sdb__choice-pict" aria-hidden="true">' + pict(opts.pictKey) + '</span>';
		} else if (opts.photoKey) {
			var url = cfg.photos[opts.photoKey] || '';
			if (url) {
				media = '<span class="devis-sdb__choice-photo" data-src="' + escHtml(url) + '"><img src="' + escHtml(url) + '" alt="" loading="lazy"></span>';
			} else {
				media = '<span class="devis-sdb__choice-photo devis-sdb__choice-photo--empty" aria-hidden="true"></span>';
			}
		}
		var sub = opts.sub ? '<span class="devis-sdb__choice-sub">' + escHtml(opts.sub) + '</span>' : '';
		return '<button type="button" class="devis-sdb__choice ' + (opts.selected ? 'is-selected' : '') + '"'
			+ ' data-choice="' + escHtml(opts.key) + '"'
			+ ' aria-pressed="' + (opts.selected ? 'true' : 'false') + '">'
			+ media
			+ '<span class="devis-sdb__choice-label">' + escHtml(opts.label) + sub + '</span>'
			+ '</button>';
	}

	function buildYesNo(value, key) {
		return '<div class="devis-sdb__yesno" role="group" aria-label="Oui ou non">'
			+ '<button type="button" class="devis-sdb__yesno-btn ' + (value === 'oui' ? 'is-selected' : '') + '" data-yesno="' + escHtml(key) + '" data-value="oui" aria-pressed="' + (value === 'oui' ? 'true' : 'false') + '">OUI</button>'
			+ '<button type="button" class="devis-sdb__yesno-btn ' + (value === 'non' ? 'is-selected' : '') + '" data-yesno="' + escHtml(key) + '" data-value="non" aria-pressed="' + (value === 'non' ? 'true' : 'false') + '">NON</button>'
			+ '</div>';
	}

	function hintBtn(stepKey) {
		var t = (cfg.hints[stepKey] || '').trim();
		if (!t) return '';
		return '<div class="devis-sdb__hint-wrap">'
			+ '<button type="button" class="devis-sdb__hint-trigger" data-hint="' + escHtml(stepKey) + '" aria-haspopup="dialog">'
			+ '✦ Conseils du conseiller'
			+ '</button>'
			+ '</div>';
	}

	function photoSlot(photoKey, captionAlt) {
		var url = cfg.photos[photoKey] || '';
		var alt = captionAlt || '';
		if ( url ) {
			return '<span class="devis-sdb__choice-photo" data-src="' + escHtml(url) + '"><img src="' + escHtml(url) + '" alt="' + escHtml(alt) + '" loading="lazy"></span>';
		}
		return '<span class="devis-sdb__choice-photo devis-sdb__choice-photo--empty" aria-hidden="true"></span>';
	}

	/* ============================================================ *
	 *  Renderers par étape
	 * ============================================================ */

	function renderStep() {
		normalizeState();
		var id = STEPS[state.step];
		var bd = calcBreakdown();

		var headBlock = function (eyebrow, title, lede) {
			return (eyebrow ? '<p class="devis-sdb__eyebrow">' + escHtml(eyebrow) + '</p>' : '')
				+ '<h3 class="devis-sdb__title">' + escHtml(title) + '</h3>'
				+ (lede ? '<p class="devis-sdb__lede">' + lede + '</p>' : '');
		};

		switch (id) {
			case 'home':
				// Intro lisible dans la section au-dessus ; ici seulement les deux cartes + titre masqué (a11y).
				return '<h3 class="devis-sdb__sr-only">' + escHtml('Première étape') + '</h3>'
					+ '<div class="devis-sdb__choices devis-sdb__choices--2 devis-sdb__home-cards"><div class="devis-sdb__gallery-item"><span class="devis-sdb__choice-pict">' + pict('shower_intro') + '</span><span class="devis-sdb__choice-label">Configurez votre projet en 5 min</span></div><div class="devis-sdb__gallery-item"><span class="devis-sdb__choice-pict">' + pict('warranty_seal') + '</span><span class="devis-sdb__choice-label">Devis garanti, sans engagement</span></div></div>'
					+ hintBtn(id);

			case 'intro_bain':
				return headBlock('Votre projet', 'Remplacer la baignoire par une douche sécurisée',
					'Parce que votre <strong>sécurité et votre confort</strong> sont notre priorité, nous transformons votre baignoire en une douche adaptée à votre quotidien.<br><br>Dans la grande majorité des cas, le chantier est <strong>terminé en une journée</strong>, propre et sans mauvaise surprise.')
					+ hintBtn(id);

			case 'avant_apres':
				return headBlock('Inspirations', 'Avant / après',
					'Quelques exemples de transformation de salle de bain.')
					+ '<div class="devis-sdb__gallery">'
					+ '<div class="devis-sdb__gallery-item">' + photoSlot('avant_1', 'Salle de bain avant rénovation') + '<div class="devis-sdb__gallery-caption">Avant</div></div>'
					+ '<div class="devis-sdb__gallery-item">' + photoSlot('apres_1', 'Salle de bain après rénovation') + '<div class="devis-sdb__gallery-caption">Après</div></div>'
					+ '<div class="devis-sdb__gallery-item">' + photoSlot('avant_2', 'Salle de bain avant rénovation') + '<div class="devis-sdb__gallery-caption">Avant</div></div>'
					+ '<div class="devis-sdb__gallery-item">' + photoSlot('apres_2', 'Salle de bain après rénovation') + '<div class="devis-sdb__gallery-caption">Après</div></div>'
					+ '</div>'
					+ hintBtn(id);

			case 'fenetre':
				return headBlock('Configuration', 'Y a-t-il une fenêtre dans le prolongement de la future paroi ?',
					'Cette information conditionne les modèles de paroi disponibles. Choisissez une option.')
					+ '<div class="devis-sdb__choices devis-sdb__choices--2">'
					+ buildChoice({ key: 'oui', label: 'Oui', pictKey: 'fenetre_oui', selected: state.fenetre === 'oui' })
					+ buildChoice({ key: 'non', label: 'Non', pictKey: 'fenetre_non', selected: state.fenetre === 'non' })
					+ '</div>'
					+ hintBtn(id);

			case 'implantation':
				return headBlock('Configuration', 'Implantation de la douche',
					'En angle ou en niche, selon la disposition actuelle de votre salle de bain.')
					+ '<div class="devis-sdb__choices devis-sdb__choices--2">'
					+ buildChoice({ key: 'angle', label: 'En angle', pictKey: 'implantation_angle', selected: state.implantation === 'angle' })
					+ buildChoice({ key: 'niche', label: 'En niche', pictKey: 'implantation_niche', selected: state.implantation === 'niche' })
					+ '</div>'
					+ hintBtn(id);

			case 'taille_bac':
				var bL = Math.max(60, Math.min(220, Number(state.bacLongueur || 120)));
				var bW = Math.max(60, Math.min(120, Number(state.bacLargeur || 90)));
				var maxDim = Math.max(bL, bW);
				var px = 240;
				var sW = Math.round((bL / maxDim) * px);
				var sH = Math.round((bW / maxDim) * px);
				return headBlock('Configuration', 'Taille souhaitée du receveur extra-plat',
					'Indiquez les dimensions souhaitées en centimètres.')
					+ '<div class="devis-sdb__measure">'
					+ '<div class="devis-sdb__measure-grid">'
					+ '<div class="devis-sdb__field"><label class="devis-sdb__field-label" for="sdb-bac-l">Longueur</label><div class="devis-sdb__field-input-wrap"><input id="sdb-bac-l" class="devis-sdb__field-input" type="number" min="60" max="220" step="1" inputmode="numeric" value="' + bL + '" data-input="bacLongueur"><span class="devis-sdb__field-unit">cm</span></div></div>'
					+ '<div class="devis-sdb__field"><label class="devis-sdb__field-label" for="sdb-bac-w">Largeur</label><div class="devis-sdb__field-input-wrap"><input id="sdb-bac-w" class="devis-sdb__field-input" type="number" min="60" max="120" step="1" inputmode="numeric" value="' + bW + '" data-input="bacLargeur"><span class="devis-sdb__field-unit">cm</span></div></div>'
					+ '</div>'
					+ '<div class="devis-sdb__schema">'
					+ '<p class="devis-sdb__schema-title">Schéma proportionnel</p>'
					+ '<div class="devis-sdb__schema-stage"><div class="devis-sdb__schema-rect" data-w="' + bL + '" data-h="' + bW + '" style="width:' + sW + 'px;height:' + sH + 'px;"></div></div>'
					+ '</div>'
					+ '</div>'
					+ hintBtn(id);

			case 'modele':
				var mods = availableModeles();
				var modItems = mods.map(function (m) {
					return buildChoice({
						key: m.key,
						label: m.label,
						pictKey: m.pict,
						selected: state.modele === m.key
					}).replace('devis-sdb__choice"', 'devis-sdb__choice devis-sdb__choice--wide"')
					.replace('devis-sdb__choice is-selected"', 'devis-sdb__choice devis-sdb__choice--wide is-selected"');
				}).join('');
				var gridClass = mods.length === 2 ? 'devis-sdb__choices--2' : 'devis-sdb__choices--3';
				return headBlock('Configuration', 'Modèle de paroi',
					mods.length === 2 ? 'Avec une fenêtre, deux modèles sont possibles.' : 'Choisissez le type d\'ouverture qui correspond à votre quotidien.')
					+ '<div class="devis-sdb__choices ' + gridClass + '">' + modItems + '</div>'
					+ hintBtn(id);

			case 'verre':
				return headBlock('Configuration', 'Type de verre',
					'Transparent pour un effet aérien, dépoli pour préserver l\'intimité.')
					+ '<div class="devis-sdb__choices devis-sdb__choices--2">'
					+ buildChoice({ key: 'transparent', label: 'Verre transparent', sub: 'sans surcoût', pictKey: 'verre_transparent', selected: state.verre === 'transparent' })
					+ buildChoice({ key: 'depoli', label: 'Verre dépoli', sub: '+ ' + money(cfg.prices.verre.depoli), pictKey: 'verre_depoli', selected: state.verre === 'depoli' })
					+ '</div>'
					+ hintBtn(id);

			case 'robinetterie':
				return headBlock('Configuration', 'Faut-il déplacer la robinetterie ?',
					'Si la robinetterie reste à sa place actuelle, pas de surcoût.')
					+ '<div class="devis-sdb__choices devis-sdb__choices--2">'
					+ buildChoice({ key: 'non', label: 'Non, elle reste en place', sub: 'sans surcoût', pictKey: 'robinet_non', selected: state.robinetterie === 'non' })
					+ buildChoice({ key: 'oui', label: 'Oui, à déplacer', sub: '+ ' + money(cfg.prices.robinetterie.oui), pictKey: 'robinet_oui', selected: state.robinetterie === 'oui' })
					+ '</div>'
					+ hintBtn(id);

			case 'forfaits':
				return headBlock('Configuration', 'Forfaits supplémentaires de main d\'œuvre',
					'Cochez uniquement ce qui correspond à votre situation.')
					+ '<div class="devis-sdb__toggles">'
					+ '<label class="devis-sdb__toggle"><input type="checkbox" data-toggle="forfaitMachineLaver"' + (state.forfaitMachineLaver ? ' checked' : '') + '><span class="devis-sdb__toggle-text">Déplacement machine à laver <small>(' + money(cfg.prices.forfaitMachineLaver) + ')</small></span></label>'
					+ '<label class="devis-sdb__toggle"><input type="checkbox" data-toggle="forfaitLavabo"' + (state.forfaitLavabo ? ' checked' : '') + '><span class="devis-sdb__toggle-text">Déplacement lavabo <small>(' + money(cfg.prices.forfaitLavabo) + ')</small></span></label>'
					+ '<label class="devis-sdb__toggle"><input type="checkbox" data-toggle="forfaitBidet"' + (state.forfaitBidet ? ' checked' : '') + '><span class="devis-sdb__toggle-text">Dépose bidet <small>(' + money(cfg.prices.forfaitBidet) + ')</small></span></label>'
					+ '</div>'
					+ hintBtn(id);

			case 'garanties_douche':
				return headBlock('Engagements', 'Garanties',
					'')
					+ '<div class="devis-sdb__warranty">'
					+ 'Garantie sur la <strong>fourniture et la pose</strong>.<br>'
					+ 'Visite technique <strong>gratuite et sans engagement</strong>.'
					+ '</div>'
					+ hintBtn(id);

			case 'aides_douche':
				return headBlock('Aides financières', 'Vous n\'êtes pas seul',
					'')
					+ '<div class="devis-sdb__aides">'
					+ 'Plusieurs dispositifs peuvent réduire significativement le coût des travaux : <strong>MaPrimeAdapt\', TVA réduite à 5,5 %, aides de l\'ANAH</strong>, caisses de retraite, etc.'
					+ '<br><br>Notre conseiller technique vous accompagne pour <strong>constituer votre dossier</strong>. Toutes les informations sont également détaillées sur la rubrique « Aides » du site.'
					+ '</div>'
					+ hintBtn(id);

			case 'recap_douche':
				return headBlock('Récapitulatif', 'Votre douche sécurisée',
					'Vérifiez vos choix. Vous pouvez revenir en arrière à tout moment.')
					+ '<div class="devis-sdb__recap"><ul class="devis-sdb__recap-list">'
					+ recapDoucheLines().map(function (l) { return '<li>' + l + '</li>'; }).join('')
					+ '</ul></div>'
					+ hintBtn(id);

			case 'price_douche':
				return headBlock('Estimation', 'Prix de votre douche sécurisée',
					'')
					+ '<div class="devis-sdb__price">'
					+ '<div class="devis-sdb__price-mention">Estimation TTC posée</div>'
					+ '<div class="devis-sdb__price-amount">' + money(bd.douche) + '</div>'
					+ '</div>'
					+ '<p class="devis-sdb__price-foot">Cette estimation est très proche du prix réel. Elle sera <strong>confirmée lors de la visite technique gratuite</strong> du conseiller.</p>'
					+ hintBtn(id);

			case 'proposition_sdb':
				return headBlock('Allons plus loin', 'Et si vous en profitiez ?',
					'Vous pouvez en rester à la douche, ou continuer pour <strong>obtenir une estimation pour le reste de la pièce</strong> : habillage des murs, sol antidérapant, sèche-serviettes, WC.<br><br>Les prochaines étapes sont facultatives.')
					+ '<div class="devis-sdb__choices devis-sdb__choices--2"><div class="devis-sdb__gallery-item">' + photoSlot('proposition_sdb', 'Salle de bain rénovée') + '<div class="devis-sdb__gallery-caption">Rénovation complète possible</div></div><div class="devis-sdb__gallery-item"><span class="devis-sdb__choice-pict">' + pict('warranty_seal') + '</span><span class="devis-sdb__choice-label">À votre rythme, selon vos envies</span></div></div>'
					+ hintBtn(id);

			case 'habillage_murs':
				return headBlock('Aménagement', 'Habillage des murs',
					'Habillage hors espace de douche — dalles murales SPC.')
					+ '<div class="devis-sdb__gallery">'
					+ '<div class="devis-sdb__gallery-item">' + photoSlot('habillage_1', 'Habillage mural') + '<div class="devis-sdb__gallery-caption">Exemple</div></div>'
					+ '<div class="devis-sdb__gallery-item">' + photoSlot('habillage_2', 'Habillage mural') + '<div class="devis-sdb__gallery-caption">Exemple</div></div>'
					+ '</div>'
					+ '<div class="devis-sdb__specs"><p class="devis-sdb__specs-title">Spécifications</p>• Matière SPC clipsable et étanche<br>• Épaisseur 4 mm<br>• Garantie 10 ans<br>• ' + money(cfg.prices.habillageMursM2) + ' / m²</div>'
					+ buildYesNo(state.habillageMurs, 'habillageMurs')
					+ (state.habillageMurs === 'oui' ? '<div class="devis-sdb__follow-up"><div class="devis-sdb__field"><label class="devis-sdb__field-label" for="sdb-hab-m2">Surface à habiller (hors espace douche)</label><div class="devis-sdb__field-input-wrap"><input id="sdb-hab-m2" class="devis-sdb__field-input" type="number" min="0" max="100" step="1" inputmode="numeric" value="' + Number(state.habillageMursM2 || 0) + '" data-input="habillageMursM2"><span class="devis-sdb__field-unit">m²</span></div></div><span class="devis-sdb__follow-up-note">Couleur définie avec le conseiller lors de la visite.</span></div>' : '')
					+ hintBtn(id);

			case 'sol_antiderapant':
				return headBlock('Aménagement', 'Sol antidérapant',
					'Finition R10 AKW — sécurisée, étanche et confortable.')
					+ '<div class="devis-sdb__gallery">'
					+ '<div class="devis-sdb__gallery-item">' + photoSlot('sol_1', 'Sol antidérapant') + '<div class="devis-sdb__gallery-caption">Exemple</div></div>'
					+ '<div class="devis-sdb__gallery-item">' + photoSlot('sol_2', 'Sol antidérapant') + '<div class="devis-sdb__gallery-caption">Exemple</div></div>'
					+ '</div>'
					+ '<div class="devis-sdb__specs"><p class="devis-sdb__specs-title">Spécifications</p>• Clipsable et étanche<br>• Sous-couche EVA 1 mm<br>• Épaisseur 5 mm<br>• Garantie 15 ans<br>• Forfait : ' + money(cfg.prices.solAntiderapant) + '</div>'
					+ buildYesNo(state.solAntiderapant, 'solAntiderapant')
					+ (state.solAntiderapant === 'oui' ? '<p class="devis-sdb__follow-up-note">Couleur définie avec le conseiller lors de la visite.</p>' : '')
					+ hintBtn(id);

			case 'porte_coulissante':
				return headBlock('Aménagement', 'Porte coulissante sur rail',
					'Système silencieux — gain de place et sobriété.')
					+ '<div class="devis-sdb__choices devis-sdb__choices--2"><div class="devis-sdb__gallery-item">' + photoSlot('porte_coulissante', 'Porte coulissante') + '<div class="devis-sdb__gallery-caption">Exemple</div></div><div class="devis-sdb__gallery-item"><span class="devis-sdb__choice-pict">' + pict('modele_coulissante') + '</span><span class="devis-sdb__choice-label">Système sur rail intégré</span></div></div>'
					+ '<div class="devis-sdb__specs"><p class="devis-sdb__specs-title">Forfait</p>Fourniture, rail silencieux, pose et réglages : ' + money(cfg.prices.porteCoulissante) + '</div>'
					+ buildYesNo(state.porteCoulissante, 'porteCoulissante')
					+ hintBtn(id);

			case 'seche_serviettes':
				return headBlock('Aménagement', 'Sèche-serviettes haut confort',
					'Électrique, mixte ou eau chaude — modèle choisi avec le conseiller.')
					+ '<div class="devis-sdb__choices devis-sdb__choices--2"><div class="devis-sdb__gallery-item">' + photoSlot('seche_serviettes', 'Sèche-serviettes') + '<div class="devis-sdb__gallery-caption">Exemple</div></div><div class="devis-sdb__gallery-item"><span class="devis-sdb__choice-pict">' + pict('warranty_seal') + '</span><span class="devis-sdb__choice-label">Installation complète et mise en service</span></div></div>'
					+ '<div class="devis-sdb__specs"><p class="devis-sdb__specs-title">Forfait</p>Fourniture, installation et mise en service : ' + money(cfg.prices.secheServiettes) + '</div>'
					+ buildYesNo(state.secheServiettes, 'secheServiettes')
					+ hintBtn(id);

			case 'solutions_wc':
				return headBlock('Aménagement', 'Solutions WC',
					'Trois options selon votre configuration et votre budget.')
					+ '<div class="devis-sdb__choices devis-sdb__choices--4">'
					+ buildChoice({ key: 'wcSureleve', label: 'WC surélevé', sub: money(cfg.prices.wcSureleve), pictKey: 'wc_sureleve', selected: state.solutionWc === 'wcSureleve' })
					+ buildChoice({ key: 'wcSuspenduHabillage', label: 'Suspendu + habillage', sub: money(cfg.prices.wcSuspenduHabillage), pictKey: 'wc_suspendu', selected: state.solutionWc === 'wcSuspenduHabillage' })
					+ buildChoice({ key: 'wcBroyeurSilencieux', label: 'Broyeur silencieux', sub: money(cfg.prices.wcBroyeurSilencieux), pictKey: 'wc_broyeur', selected: state.solutionWc === 'wcBroyeurSilencieux' })
					+ buildChoice({ key: 'non', label: 'Non concerné', sub: 'pas de WC dans le projet', pictKey: 'wc_aucun', selected: state.solutionWc === 'non' })
					+ '</div>'
					+ hintBtn(id);

			case 'recap_global':
				return headBlock('Récapitulatif', 'Votre projet complet',
					'Vue d\'ensemble. Vous pouvez encore revenir modifier n\'importe quel choix.')
					+ '<div class="devis-sdb__recap"><ul class="devis-sdb__recap-list">'
					+ recapGlobalLines().map(function (l) { return '<li>' + l + '</li>'; }).join('')
					+ '</ul></div>'
					+ hintBtn(id);

			case 'price_global':
				return headBlock('Estimation', 'Détail du devis',
					'Trois grands postes : douche, aménagements, WC.')
					+ '<div class="devis-sdb__recap"><div class="devis-sdb__price-breakdown">'
					+ '<div class="devis-sdb__price-line"><span>Douche sécurisée</span><strong>' + money(bd.douche) + '</strong></div>'
					+ '<div class="devis-sdb__price-line"><span>Aménagements</span><strong>' + money(bd.amenagements) + '</strong></div>'
					+ ((state.solutionWc && state.solutionWc !== 'non') ? '<div class="devis-sdb__price-line"><span>Solution WC</span><strong>' + money(bd.solutionWc) + '</strong></div>' : '')
					+ '</div></div>'
					+ hintBtn(id);

			case 'final_total':
				var contactHref = cfg.contactUrl
					+ (cfg.contactUrl.indexOf('?') === -1 ? '?' : '&')
					+ 'projet=devis-sdb'
					+ '&total=' + encodeURIComponent(bd.total)
					+ '&recap=' + encodeURIComponent(recapPlainText());
				return headBlock('Estimation finale', 'Prix estimatif de l\'ensemble des travaux',
					'')
					+ '<div class="devis-sdb__price">'
					+ '<div class="devis-sdb__price-mention">Estimation TTC posée</div>'
					+ '<div class="devis-sdb__price-amount">' + money(bd.total) + '</div>'
					+ '</div>'
					+ '<p class="devis-sdb__price-foot">Cette estimation est très proche de la réalité. Les <strong>matières, couleurs et prix définitifs</strong> seront validés lors de la visite technique gratuite, sans engagement.</p>'
					+ '<div class="devis-sdb__cta">'
					+ '<a href="' + escHtml(contactHref) + '" class="btn btn--accent btn--lg">' + escHtml(cfg.contactLabel) + '</a>'
					+ '</div>'
					+ hintBtn(id);
		}

		return '<p class="devis-sdb__lede">Étape inconnue.</p>';
	}

	/* ============================================================ *
	 *  Render principal
	 * ============================================================ */

	var lastFocusedSelector = null;

	function render() {
		normalizeState();
		if (state.step >= STEPS.length) state.step = STEPS.length - 1;
		if (state.step < 0) state.step = 0;
		var stepId = STEPS[state.step];
		var pct = Math.round(((state.step + 1) / STEPS.length) * 100);
		var isLast = stepId === 'final_total';

		root.innerHTML =
			'<div class="devis-sdb__topbar">'
				+ '<div class="devis-sdb__crumb"><strong>Étape ' + (state.step + 1) + ' / ' + STEPS.length + '</strong><span class="devis-sdb__crumb-dash"> — </span><span class="devis-sdb__crumb-title">' + escHtml(STEP_TITLES[stepId] || '') + '</span></div>'
				+ '<div class="devis-sdb__progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '">'
					+ '<div class="devis-sdb__progress-track"><div class="devis-sdb__progress-fill" style="width:' + pct + '%"></div></div>'
					+ '<div class="devis-sdb__progress-label">' + pct + ' %</div>'
				+ '</div>'
			+ '</div>'
			+ '<div class="devis-sdb__resume" id="devis-sdb-resume" role="status"></div>'
			+ '<div class="devis-sdb__alert" id="devis-sdb-alert" role="alert" aria-live="polite"></div>'
			+ '<div class="devis-sdb__step" id="devis-sdb-step">'
				+ renderStep()
			+ '</div>'
			+ '<div class="devis-sdb__nav">'
				+ '<div class="devis-sdb__nav-side">'
					+ '<button type="button" class="btn devis-sdb__nav-reset" data-action="reset">Réinitialiser</button>'
				+ '</div>'
				+ '<div class="devis-sdb__nav-side">'
					+ '<button type="button" class="btn btn--outline" data-action="prev"' + (state.step === 0 ? ' disabled' : '') + '>Retour</button>'
					+ (isLast ? '' : '<button type="button" class="btn btn--accent" data-action="next">Suivant</button>')
				+ '</div>'
			+ '</div>'
			+ '<div class="devis-sdb__hint-modal" id="devis-sdb-hint-modal" aria-hidden="true">'
				+ '<div class="devis-sdb__hint-card" role="dialog" aria-modal="true" aria-labelledby="devis-sdb-hint-title">'
					+ '<button type="button" class="devis-sdb__hint-close" data-action="close-hint" aria-label="Fermer">×</button>'
					+ '<h3 id="devis-sdb-hint-title">Conseils du conseiller</h3>'
					+ '<p id="devis-sdb-hint-body"></p>'
				+ '</div>'
			+ '</div>';

		bindEvents();
		persist();

		if (lastFocusedSelector) {
			var el = root.querySelector(lastFocusedSelector);
			if (el && typeof el.focus === 'function') el.focus({ preventScroll: true });
			lastFocusedSelector = null;
		}
	}

	/* ============================================================ *
	 *  Events
	 * ============================================================ */

	function showAlert(message) {
		var box = root.querySelector('#devis-sdb-alert');
		if (!box) return;
		box.textContent = message;
		box.classList.add('is-visible');
	}

	function hideAlert() {
		var box = root.querySelector('#devis-sdb-alert');
		if (box) box.classList.remove('is-visible');
	}

	function scrollToTop() {
		var y = root.getBoundingClientRect().top + window.scrollY - 80;
		window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
	}

	function openHint(stepKey) {
		var t = (cfg.hints[stepKey] || '').trim();
		if (!t) return;
		var modal = root.querySelector('#devis-sdb-hint-modal');
		var body = root.querySelector('#devis-sdb-hint-body');
		if (!modal || !body) return;
		body.innerHTML = escHtml(t).replace(/\n/g, '<br>');
		modal.classList.add('is-open');
		modal.setAttribute('aria-hidden', 'false');
		var close = modal.querySelector('[data-action="close-hint"]');
		if (close) close.focus();
	}

	function closeHint() {
		var modal = root.querySelector('#devis-sdb-hint-modal');
		if (!modal) return;
		modal.classList.remove('is-open');
		modal.setAttribute('aria-hidden', 'true');
	}

	function bindEvents() {
		// Choix simples
		root.querySelectorAll('[data-choice]').forEach(function (btn) {
			btn.addEventListener('click', function () {
				var k = btn.getAttribute('data-choice');
				var stepId = STEPS[state.step];
				switch (stepId) {
					case 'fenetre':
						state.fenetre = k;
						state.modele = '';
						break;
					case 'implantation':
						state.implantation = k;
						break;
					case 'modele':
						state.modele = k;
						break;
					case 'verre':
						state.verre = k;
						break;
					case 'robinetterie':
						state.robinetterie = k;
						break;
					case 'solutions_wc':
						state.solutionWc = k;
						break;
				}
				hideAlert();
				render();
			});
		});

		// Boutons OUI/NON
		root.querySelectorAll('[data-yesno]').forEach(function (btn) {
			btn.addEventListener('click', function () {
				var key = btn.getAttribute('data-yesno');
				var val = btn.getAttribute('data-value');
				switch (key) {
					case 'habillageMurs':
						state.habillageMurs = val;
						if (val === 'non') state.habillageMursM2 = 0;
						break;
					case 'solAntiderapant':
						state.solAntiderapant = val;
						break;
					case 'porteCoulissante':
						state.porteCoulissante = val;
						break;
					case 'secheServiettes':
						state.secheServiettes = val;
						break;
				}
				hideAlert();
				render();
			});
		});

		// Champs numériques
		root.querySelectorAll('[data-input]').forEach(function (inp) {
			var key = inp.getAttribute('data-input');
			inp.addEventListener('input', function () {
				var v = safeParseInt(inp.value, 0);
				state[key] = v;
				if (key === 'bacLongueur' || key === 'bacLargeur') {
					var schema = root.querySelector('.devis-sdb__schema-rect');
					if (schema) {
						var bL = Math.max(60, Math.min(220, Number(state.bacLongueur || 120)));
						var bW = Math.max(60, Math.min(120, Number(state.bacLargeur || 90)));
						var maxDim = Math.max(bL, bW);
						var px = 240;
						schema.style.width = Math.round((bL / maxDim) * px) + 'px';
						schema.style.height = Math.round((bW / maxDim) * px) + 'px';
						schema.setAttribute('data-w', bL);
						schema.setAttribute('data-h', bW);
					}
				}
				persist();
			});
			inp.addEventListener('focus', function () { lastFocusedSelector = '[data-input="' + key + '"]'; });
		});

		// Toggles
		root.querySelectorAll('[data-toggle]').forEach(function (cb) {
			var key = cb.getAttribute('data-toggle');
			cb.addEventListener('change', function () {
				state[key] = !!cb.checked;
				persist();
			});
		});

		// Hint
		root.querySelectorAll('[data-hint]').forEach(function (btn) {
			btn.addEventListener('click', function () {
				openHint(btn.getAttribute('data-hint'));
			});
		});
		var hintModal = root.querySelector('#devis-sdb-hint-modal');
		if (hintModal) {
			hintModal.addEventListener('click', function (e) {
				if (e.target === hintModal) closeHint();
			});
		}

		// Nav
		var navPrev = root.querySelector('[data-action="prev"]');
		if (navPrev) navPrev.addEventListener('click', function () {
			if (state.step > 0) {
				state.step--;
				hideAlert();
				closeHint();
				render();
				scrollToTop();
			}
		});
		var navNext = root.querySelector('[data-action="next"]');
		if (navNext) navNext.addEventListener('click', function () {
			var err = validate(STEPS[state.step]);
			if (err) {
				showAlert(err);
				return;
			}
			if (state.step < STEPS.length - 1) {
				state.step++;
				hideAlert();
				closeHint();
				render();
				scrollToTop();
			}
		});
		var navReset = root.querySelector('[data-action="reset"]');
		if (navReset) navReset.addEventListener('click', function () {
			if (window.confirm('Réinitialiser le configurateur et perdre vos choix ?')) {
				state = clone(initialState);
				clearStored();
				closeHint();
				hideAlert();
				render();
				scrollToTop();
			}
		});
		var hintClose = root.querySelector('[data-action="close-hint"]');
		if (hintClose) hintClose.addEventListener('click', closeHint);

		// Esc ferme la modale
		document.addEventListener('keydown', escHandler);
	}

	function escHandler(e) {
		if (e.key === 'Escape') closeHint();
	}

	/* ============================================================ *
	 *  Reprise depuis localStorage
	 * ============================================================ */

	function showResumeBanner(stored) {
		// Affiché APRÈS le premier render
		var bar = root.querySelector('#devis-sdb-resume');
		if (!bar) return;
		var stepLabel = STEP_TITLES[STEPS[stored.state.step]] || '—';
		bar.innerHTML =
			'<div class="devis-sdb__resume-text">Vous aviez commencé un devis : <strong>' + escHtml(stepLabel) + '</strong>. Reprendre où vous en étiez ?</div>'
			+ '<div class="devis-sdb__resume-actions">'
				+ '<button type="button" data-resume-action="discard">Recommencer</button>'
				+ '<button type="button" class="is-primary" data-resume-action="resume">Reprendre</button>'
			+ '</div>';
		bar.classList.add('is-visible');
		bar.querySelectorAll('[data-resume-action]').forEach(function (btn) {
			btn.addEventListener('click', function () {
				var action = btn.getAttribute('data-resume-action');
				if (action === 'resume') {
					state = deepMerge(clone(initialState), stored.state || {});
					render();
				} else {
					clearStored();
					state = clone(initialState);
					render();
				}
				scrollToTop();
			});
		});
	}

	/* ============================================================ *
	 *  Démarrage
	 * ============================================================ */

	render();

	var stored = loadStored();
	if (stored && stored.state && (stored.state.step > 0 || stored.state.modele || stored.state.fenetre)) {
		showResumeBanner(stored);
	}
})();
