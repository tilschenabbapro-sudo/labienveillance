/**
 * Configurateur douche — site statique (sans WordPress).
 * Doit s’exécuter avant jlm-douche-app.js.
 */
(function () {
  'use strict';

  function relUrl(path) {
    try {
      return new URL(path, window.location.href).href;
    } catch (e) {
      return path;
    }
  }

  function contactPathNoHash() {
    try {
      var u = new URL('contact.html', window.location.href);
      return u.pathname + u.search;
    } catch (e2) {
      return 'contact.html';
    }
  }

  var aidesPage = relUrl('aides-financieres.html');

  window.JLM_DOUCHE_WP = {
    ajaxUrl: relUrl('jlm-douche-noop.json'),
    nonce: '',
    canManage: false,
    contactHref: contactPathNoHash(),
    contactHash: 'demander-rdv',
    backOfficeFallbackCode: '',
    defaults: {
      companyLine: 'La Bienveillance — Devis estimatif salle de bain',
      contactUrl: contactPathNoHash() + '#demander-rdv',
      contactLabel: 'Envoyer mon projet à La Bienveillance',
      comments: {
        intro_bain:
          "La transformation se fait habituellement en une seule journée, sans gros œuvre, et nous protégeons l'ensemble de votre logement.",
        avant_apres: 'Photos avant / après : exemples représentatifs.',
        fenetre:
          "Une fenêtre dans le prolongement de la paroi limite parfois les modèles disponibles — c'est pour cela que nous posons la question dès le début.",
        implantation:
          'En angle : douche calée dans deux murs perpendiculaires. En niche : douche placée entre deux murs déjà existants.',
        taille_bac:
          'Mesures conseillées : longueur 80–180 cm, largeur 70–100 cm. Le receveur extra-plat permet une entrée de plain-pied.',
        modele:
          "Plus la paroi est ouvrante (pivotante, coulissante), plus l'entrée est confortable. La paroi fixe est l'option la plus économique.",
        verre: "Le verre dépoli préserve l'intimité, recommandé si la salle de bain est partagée.",
        robinetterie:
          "Si la robinetterie reste à sa place actuelle, pas de surcoût. Sinon, nous prévoyons les travaux de plomberie nécessaires.",
        forfaits:
          "Ces forfaits couvrent la dépose / repose d'éléments existants. Cochez uniquement ce qui s'applique chez vous.",
        garanties_douche:
          'Visite technique gratuite, devis sans engagement, garantie sur la fourniture ET la pose.',
        aides_douche:
          "MaPrimeAdapt', TVA réduite, aides ANAH… Retrouvez le détail sur « Aides financières » : " +
          aidesPage,
        recap_douche:
          'Récapitulatif de votre future douche sécurisée. Vous pouvez revenir en arrière à tout moment.',
        price_douche:
          'Estimation TTC posée. Le prix définitif est confirmé lors de la visite technique gratuite.',
        proposition_sdb:
          "Vous pouvez en rester là si vous le souhaitez : la suite est facultative et concerne le reste de la pièce.",
        habillage_murs:
          'Dalles SPC clipsables, étanches, garanties 10 ans. Couleurs et finitions vues lors de la visite technique.',
        sol_antiderapant: 'Sols clipsables certifiés R10 AKW, étanches, garantis 15 ans.',
        meubles: 'Modèle et couleur à préciser avec le conseiller lors de la visite technique.',
        porte_coulissante: 'Système silencieux sur rail, fourniture et pose incluses.',
        seche_serviettes: 'Électrique, mixte ou eau chaude — modèle choisi avec le conseiller.',
        solutions_wc:
          "Surélevé pour limiter l'effort, suspendu pour une finition contemporaine, broyeur silencieux quand l'évacuation est compliquée.",
        recap_global:
          "Vue d'ensemble. Vous pouvez encore revenir modifier n'importe quel choix.",
        price_global: 'Détail des trois grands postes : douche, aménagements, WC.',
        final_total:
          'Vous pouvez nous transmettre cette estimation depuis le bouton ci-dessous — nous recevrons aussi votre récapitulatif et nous vous rappelons sous 24–48 h.'
      },
      prices: {
        wcSureleve: 590,
        wcSuspenduHabillage: 1490,
        wcBroyeurSilencieux: 990,
        forfaitMachineLaver: 290,
        forfaitLavabo: 390,
        forfaitBidet: 290
      },
      images: {
        logo: { url: relUrl('img/logo-la-bienveillance.png') },
        avant_photo_1: { url: relUrl('img/sdb/sdb-avant-1.jpg') },
        avant_photo_2: { url: relUrl('img/sdb/sdb-avant-2.jpg') },
        apres_photo_1: { url: relUrl('img/sdb/sdb-apres-1.jpg') },
        apres_photo_2: { url: relUrl('img/sdb/sdb-apres-2.jpg') },
        apres_photo_3: { url: relUrl('img/sdb/sdb-apres-2.jpg') },
        apres_photo_4: { url: relUrl('img/sdb/sdb-apres-1.jpg') },
        fenetre_oui: { url: relUrl('img/douche-securisee.jpg') },
        fenetre_non: { url: relUrl('img/sdb/sdb-avant-1.jpg') },
        fenetre_paroi_fixe: { url: relUrl('img/douche-securisee.jpg') },
        fenetre_paroi_fixe_volet: { url: relUrl('img/douche-securisee.jpg') },
        implantation_angle: { url: relUrl('img/douche-securisee.jpg') },
        implantation_niche: { url: relUrl('img/sdb/sdb-avant-1.jpg') },
        modele_fixe: { url: relUrl('img/douche-securisee.jpg') },
        modele_fixe_volet: { url: relUrl('img/douche-securisee.jpg') },
        modele_fixe_volet_angle: { url: relUrl('img/douche-securisee.jpg') },
        modele_coulissante: { url: relUrl('img/douche-securisee.jpg') },
        modele_coulissante_angle: { url: relUrl('img/douche-securisee.jpg') },
        modele_pivotante: { url: relUrl('img/douche-securisee.jpg') },
        modele_pivotante_angle: { url: relUrl('img/douche-securisee.jpg') },
        modele_deux_pivotantes: { url: relUrl('img/douche-securisee.jpg') },
        verre_transparent: { url: relUrl('img/douche-securisee.jpg') },
        verre_depoli: { url: relUrl('img/douche-securisee.jpg') },
        robinetterie_oui: { url: relUrl('img/installateur-sdb.jpg') },
        robinetterie_non: { url: relUrl('img/douche-securisee.jpg') },
        proposition_sdb_photo: { url: relUrl('img/sdb/sdb-proposition-renovation.jpg') },
        habillage_murs_1: { url: relUrl('img/sdb/sdb-habillage-1.jpg') },
        habillage_murs_2: { url: relUrl('img/sdb/sdb-habillage-2.jpg') },
        sol_antiderapant_ex1: { url: relUrl('img/sdb/sdb-sol-1.jpg') },
        sol_antiderapant_ex2: { url: relUrl('img/sdb/sdb-sol-2.jpg') },
        meubles_ex1: { url: relUrl('img/sdb/sdb-apres-1.jpg') },
        meubles_ex2: { url: relUrl('img/sdb/sdb-habillage-1.jpg') },
        meubles_ex3: { url: relUrl('img/sdb/sdb-apres-2.jpg') },
        meubles_ex4: { url: relUrl('img/sdb/sdb-habillage-2.jpg') },
        porte_coulissante_photo: { url: relUrl('img/sdb/sdb-porte-coulissante.jpg') },
        seche_serviettes_photo: { url: relUrl('img/sdb/sdb-seche-serviettes.jpg') },
        wc_sureleve_photo: { url: relUrl('img/sdb/sdb-apres-1.jpg') },
        wc_suspendu_habillage_photo: { url: relUrl('img/sdb/sdb-apres-2.jpg') },
        wc_broyeur_silencieux_photo: { url: relUrl('img/installateur-sdb.jpg') },
        garanties_photo_1: { url: relUrl('img/devis-monte-escalier/garanties.jpg') },
        garanties_photo_2: { url: relUrl('img/douche-securisee.jpg') }
      }
    }
  };
})();
