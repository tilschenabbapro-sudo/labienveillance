/**
 * Pré-remplissage du formulaire de contact La Bienveillance
 *
 * Quand l'utilisateur arrive sur /contact/ depuis un configurateur (ex.
 * devis salle de bain) avec ?projet=devis-sdb&total=12345&recap=…,
 * on remplit automatiquement le champ "sujet" et le champ "message"
 * du formulaire (qu'il s'agisse du formulaire CF7 ou du fallback statique).
 *
 * Comportement :
 *  - Aucune action si les paramètres URL ne sont pas présents.
 *  - Préfixe le message d'un en-tête explicite « Estimation reçue depuis… ».
 *  - Sélectionne l'option correspondante du select sujet (insensible à la casse,
 *    accepte slug ou label).
 *  - Surligne brièvement les champs préremplis (animation CSS) pour la
 *    transparence.
 *  - Scroll doux vers le formulaire.
 *
 * Aucune dépendance, aucun framework, exécution one-shot au DOMContentLoaded.
 */
(function () {
	'use strict';

	function ready(fn) {
		if (document.readyState !== 'loading') {
			fn();
		} else {
			document.addEventListener('DOMContentLoaded', fn);
		}
	}

	function readParams() {
		try {
			var params = new URLSearchParams(window.location.search);
			return {
				projet: params.get('projet') || '',
				total: params.get('total') || '',
				recap: params.get('recap') || ''
			};
		} catch (e) {
			return { projet: '', total: '', recap: '' };
		}
	}

	function projetToSubject(projet) {
		switch (String(projet || '').toLowerCase()) {
			case 'estimation-douche':
			case 'devis-sdb':
			case 'salle-de-bain':
			case 'sdb':
				return ['salle-de-bain', 'Salle de bain'];
			case 'estimation-monte-escalier':
			case 'devis-monte-escalier':
			case 'monte-escalier':
			case 'monte-escaliers':
				return ['monte-escaliers', 'Monte-escaliers'];
			case 'amenagements':
			case 'amenagement':
				return ['amenagements', 'Aménagements'];
			case 'conseils':
				return ['conseils', 'Conseils'];
			default:
				return null;
		}
	}

	function findSubjectSelect() {
		// Couvre :
		//  - fallback statique (id="sujet" name="sujet")
		//  - CF7 (id:sujet name="sujet" — id n'est pas garanti, name oui)
		var sels = document.querySelectorAll('select[name="sujet"], select#sujet');
		return sels.length ? sels[0] : null;
	}

	function findMessageField() {
		var nodes = document.querySelectorAll('textarea[name="message"], textarea#message');
		return nodes.length ? nodes[0] : null;
	}

	function setSelectValue(select, candidates) {
		if (!select || !candidates || !candidates.length) return false;
		var lowered = candidates.map(function (c) { return String(c).toLowerCase(); });
		var opts = select.options;
		for (var i = 0; i < opts.length; i++) {
			var v = String(opts[i].value || '').toLowerCase();
			var t = String(opts[i].textContent || '').toLowerCase();
			if (lowered.indexOf(v) !== -1 || lowered.indexOf(t) !== -1) {
				select.selectedIndex = i;
				select.dispatchEvent(new Event('change', { bubbles: true }));
				return true;
			}
		}
		return false;
	}

	function buildMessage(projet, total, recap) {
		var parts = [];
		var label = (function () {
			var s = projetToSubject(projet);
			return s ? s[1] : 'mon projet';
		})();
		parts.push('Bonjour,');
		parts.push('');
		parts.push('Je viens d’utiliser le configurateur en ligne « ' + label + ' » et je souhaite recevoir un devis détaillé.');
		if (total) {
			parts.push('');
			var n = Number(total);
			parts.push('Estimation chiffrée par le configurateur : ' + (isNaN(n) ? total : n.toLocaleString('fr-FR') + ' €'));
		}
		if (recap) {
			parts.push('');
			parts.push('Détail de mes choix :');
			parts.push(String(recap));
		}
		parts.push('');
		parts.push('Merci de me recontacter pour planifier la visite technique gratuite.');
		return parts.join('\n');
	}

	function highlight(el) {
		if (!el) return;
		el.style.transition = 'box-shadow 0.4s ease, background 0.4s ease';
		el.style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.35)';
		var orig = el.style.background;
		el.style.background = '#fff8f1';
		setTimeout(function () {
			el.style.boxShadow = '';
			el.style.background = orig;
		}, 1800);
	}

	function scrollToForm() {
		var anchor = document.getElementById('demander-rdv') || document.getElementById('contact-form');
		if (!anchor) return;
		var y = anchor.getBoundingClientRect().top + window.scrollY - 80;
		window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
	}

	ready(function () {
		var p = readParams();
		if (!p.projet && !p.total && !p.recap) return;

		var subjectMap = projetToSubject(p.projet);
		var subject = findSubjectSelect();
		var subjectFilled = false;
		if (subject && subjectMap) {
			subjectFilled = setSelectValue(subject, subjectMap);
			if (subjectFilled) highlight(subject);
		}

		var msg = findMessageField();
		if (msg) {
			var existing = (msg.value || '').trim();
			var built = buildMessage(p.projet, p.total, p.recap);
			msg.value = existing ? (built + '\n\n---\n' + existing) : built;
			msg.dispatchEvent(new Event('input', { bubbles: true }));
			highlight(msg);
		}

		// Petit délai pour que le scroll soit visible après la pose des highlights
		setTimeout(scrollToForm, 100);
	});
})();
