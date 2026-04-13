/**
 * Modale « choix de l’outil de devis estimatif » (monte-escalier vs salle de bain).
 * Déclencheurs : éléments avec data-devis-modal
 */
(function () {
  const cfg = typeof window.labienveillanceDevisChoice === 'object' && window.labienveillanceDevisChoice !== null
    ? window.labienveillanceDevisChoice
    : {};
  const MONTE = typeof cfg.monteUrl === 'string' && cfg.monteUrl
    ? cfg.monteUrl
    : 'monte-escaliers.html#devis-estimatif-en-ligne';
  const SDB = typeof cfg.sdbUrl === 'string' && cfg.sdbUrl
    ? cfg.sdbUrl
    : 'salle-de-bain.html#devis-estimatif-salle-de-bain';

  let lastTrigger = null;

  function ensureDialog() {
    let el = document.getElementById('devis-choice-dialog');
    if (el) return el;

    el = document.createElement('div');
    el.id = 'devis-choice-dialog';
    el.className = 'devis-choice-dialog';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-labelledby', 'devis-choice-title');
    el.hidden = true;
    el.innerHTML =
      '<div class="devis-choice-dialog__backdrop" data-devis-close tabindex="-1"></div>' +
      '<div class="devis-choice-dialog__panel">' +
      '<button type="button" class="devis-choice-dialog__close" data-devis-close aria-label="Fermer">&times;</button>' +
      '<h2 id="devis-choice-title" class="devis-choice-dialog__title">Quel projet souhaitez-vous estimer&nbsp;?</h2>' +
      '<p class="devis-choice-dialog__intro">Choisissez l’outil adapté à votre besoin.</p>' +
      '<div class="devis-choice-dialog__actions">' +
      '<a class="btn btn--primary btn--lg" href="' + MONTE + '">Monte-escalier</a>' +
      '<a class="btn btn--accent btn--lg" href="' + SDB + '">Salle de bain</a>' +
      '</div>' +
      '<p class="devis-choice-dialog__hint">Vous pourrez aussi demander un rendez-vous ou un devis détaillé depuis la page contact.</p>' +
      '</div>';
    document.body.appendChild(el);

    const close = () => {
      el.hidden = true;
      document.body.style.overflow = '';
      lastTrigger?.focus?.();
      lastTrigger = null;
    };

    el.querySelectorAll('[data-devis-close]').forEach(node => {
      node.addEventListener('click', close);
    });

    el.addEventListener('keydown', e => {
      if (e.key === 'Escape') close();
    });

    return el;
  }

  function openDialog(trigger) {
    lastTrigger = trigger;
    const dlg = ensureDialog();
    dlg.hidden = false;
    document.body.style.overflow = 'hidden';
    dlg.querySelector('.devis-choice-dialog__actions a')?.focus();
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-devis-modal]').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        openDialog(el);
      });
    });
  });
})();
