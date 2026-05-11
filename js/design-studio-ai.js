/**
 * Atelier design devis — assistant IA + aperçu CSS en direct (postMessage vers iframes).
 * Clé API : uniquement en session navigateur (sessionStorage), jamais commitée.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'lab_design_studio_openai_key';
  var STORAGE_ENDPOINT = 'lab_design_studio_api_base';
  var STORAGE_MODEL = 'lab_design_studio_model';

  var DEFAULT_SYSTEM = [
    'Tu es un assistant design pour le site « La Bienveillance » (aménagement senior, monte-escaliers, douches sécurisées).',
    'L’utilisateur prépare des retouches visuelles sur deux configurateurs de devis intégrés dans des iframes sur cette page :',
    '1) Monte-escalier : widget JLM, racine CSS principale `#jlmLiteAppRoot` (fond sombre, accents orange).',
    '2) Salle de bain : configurateur `.devis-sdb` et `#devis-sdb-app` (thème sombre ou clair selon data-devis-sdb-theme).',
    'Réponds en français. Propose des modifications de design (couleurs, rayons, typographie, espacements) sous forme de blocs CSS prêts à coller.',
    'Quand tu proposes du CSS d’aperçu, entoure-le TOUJOURS d’un seul bloc markdown ```css ... ``` pour que l’utilisateur puisse l’appliquer en un clic.',
    'Le CSS d’aperçu doit cibler uniquement les sélecteurs sous `#jlmLiteAppRoot` ou `.devis-sdb` / `#devis-sdb-app` pour ne pas casser le reste de la page atelier.',
    'Ne demande pas de données personnelles. Rappelle que l’aperçu est local au navigateur jusqu’à validation par l’équipe technique.'
  ].join('\n');

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function appendMessage(role, text, err) {
    var log = $('#ds-ai-log');
    if (!log) return;
    var div = document.createElement('div');
    var cls = err ? 'err' : role === 'user' ? 'user' : role === 'sys' ? 'sys' : 'assistant';
    div.className = 'ds-msg ds-msg--' + cls;
    div.textContent = text;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
    return div;
  }

  function getIframes() {
    return {
      me: document.getElementById('iframe-devis-me'),
      sdb: document.getElementById('iframe-devis-sdb')
    };
  }

  function postToBoth(data) {
    var ifr = getIframes();
    [ifr.me, ifr.sdb].forEach(function (f) {
      if (f && f.contentWindow) {
        try {
          f.contentWindow.postMessage(data, '*');
        } catch (e) { /* ignore */ }
      }
    });
  }

  function extractLastCssBlock(text) {
    var re = /```\s*css\s*([\s\S]*?)```/gi;
    var m;
    var last = null;
    while ((m = re.exec(text)) !== null) {
      last = m[1].trim();
    }
    return last;
  }

  function wirePreviewControls() {
    var applyBtn = $('#ds-apply-css');
    var resetBtn = $('#ds-reset-css');
    var ta = $('#ds-css-manual');

    if (applyBtn) {
      applyBtn.addEventListener('click', function () {
        var fromTa = ta && ta.value ? ta.value.trim() : '';
        var css = fromTa;
        if (!css) {
          var lastAsst = '';
          var nodes = document.querySelectorAll('#ds-ai-log .ds-msg--assistant');
          if (nodes.length) {
            lastAsst = nodes[nodes.length - 1].textContent || '';
          }
          css = extractLastCssBlock(lastAsst) || '';
        }
        if (!css) {
          appendMessage('assistant', 'Aucun bloc ```css … ``` trouvé dans la conversation. Collez du CSS dans la zone « CSS d’aperçu » ou demandez à l’IA un bloc ```css```.', true);
          return;
        }
        postToBoth({ type: 'LAB_DESIGN_STUDIO_CSS', css: css });
        appendMessage('assistant', 'Aperçu CSS envoyé aux deux outils (monte-escalier + salle de bain).');
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        postToBoth({ type: 'LAB_DESIGN_STUDIO_CSS_RESET' });
        if (ta) ta.value = '';
        appendMessage('assistant', 'Aperçu CSS réinitialisé dans les deux iframes.');
      });
    }
  }

  function wireTabs() {
    var tabs = document.querySelectorAll('.ds-tabs__btn');
    var frames = getIframes();
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var id = tab.getAttribute('data-tab');
        tabs.forEach(function (t) {
          var on = t === tab;
          t.classList.toggle('is-active', on);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        if (frames.me) {
          frames.me.classList.toggle('is-active', id === 'me');
          frames.me.setAttribute('aria-hidden', id === 'me' ? 'false' : 'true');
        }
        if (frames.sdb) {
          frames.sdb.classList.toggle('is-active', id === 'sdb');
          frames.sdb.setAttribute('aria-hidden', id === 'sdb' ? 'false' : 'true');
        }
      });
    });
  }

  function wireReloadPreview() {
    var btn = $('#ds-reload-active');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var frames = getIframes();
      var target = (frames.me && frames.me.classList.contains('is-active')) ? frames.me : frames.sdb;
      if (!target) return;
      try {
        if (target.contentWindow && typeof target.contentWindow.location.reload === 'function') {
          target.contentWindow.location.reload();
        } else {
          throw new Error('no reload');
        }
      } catch (e) {
        try {
          var raw = target.getAttribute('src') || '';
          var abs = new URL(raw, window.location.href);
          abs.searchParams.set('_rs', String(Date.now()));
          target.src = abs.href;
        } catch (e2) {
          appendMessage('assistant', 'Impossible de recharger l’aperçu.', true);
        }
      }
      appendMessage('sys', 'Aperçu rechargé.');
    });
  }

  function loadSettings() {
    var keyEl = $('#ds-api-key');
    var endEl = $('#ds-api-endpoint');
    var modelEl = $('#ds-model');
    var sysEl = $('#ds-system');
    try {
      if (keyEl && sessionStorage.getItem(STORAGE_KEY)) keyEl.value = sessionStorage.getItem(STORAGE_KEY);
      if (endEl && sessionStorage.getItem(STORAGE_ENDPOINT)) endEl.value = sessionStorage.getItem(STORAGE_ENDPOINT);
      if (modelEl && sessionStorage.getItem(STORAGE_MODEL)) modelEl.value = sessionStorage.getItem(STORAGE_MODEL);
    } catch (e) { /* private mode */ }
    if (sysEl && !sysEl.value.trim()) sysEl.value = DEFAULT_SYSTEM;
  }

  function saveSettings() {
    var keyEl = $('#ds-api-key');
    var endEl = $('#ds-api-endpoint');
    var modelEl = $('#ds-model');
    try {
      if (keyEl && keyEl.value) sessionStorage.setItem(STORAGE_KEY, keyEl.value.trim());
      if (endEl && endEl.value) sessionStorage.setItem(STORAGE_ENDPOINT, endEl.value.trim());
      if (modelEl && modelEl.value) sessionStorage.setItem(STORAGE_MODEL, modelEl.value.trim());
    } catch (e) { /* */ }
  }

  async function sendChat() {
    var keyEl = $('#ds-api-key');
    var endEl = $('#ds-api-endpoint');
    var modelEl = $('#ds-model');
    var sysEl = $('#ds-system');
    var inputEl = $('#ds-user-input');

    var apiKey = keyEl && keyEl.value ? keyEl.value.trim() : '';
    var base = (endEl && endEl.value.trim()) || 'https://api.openai.com/v1';
    var model = (modelEl && modelEl.value.trim()) || 'gpt-4o-mini';
    var system = (sysEl && sysEl.value.trim()) || DEFAULT_SYSTEM;
    var userMsg = inputEl && inputEl.value.trim();

    if (!apiKey) {
      appendMessage('assistant', 'Indiquez une clé API (OpenAI ou compatible OpenAI). Elle reste dans sessionStorage de ce navigateur uniquement.', true);
      return;
    }
    if (!userMsg) return;

    saveSettings();
    appendMessage('user', userMsg);
    if (inputEl) inputEl.value = '';

    var url = base.replace(/\/$/, '') + '/chat/completions';
    var sendBtn = $('#ds-send');
    if (sendBtn) sendBtn.disabled = true;

    try {
      var res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + apiKey
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: userMsg }
          ],
          temperature: 0.6
        })
      });

      var raw = await res.text();
      var data;
      try {
        data = JSON.parse(raw);
      } catch (e) {
        throw new Error(raw.slice(0, 400) || 'Réponse non JSON');
      }

      if (!res.ok) {
        var errMsg = (data && (data.error && data.error.message)) || raw.slice(0, 500);
        throw new Error(errMsg);
      }

      var text = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
      appendMessage('assistant', text || '(Réponse vide)');
    } catch (e) {
      appendMessage('assistant', 'Erreur : ' + (e && e.message ? e.message : String(e)), true);
    } finally {
      if (sendBtn) sendBtn.disabled = false;
    }
  }

  function init() {
    wireTabs();
    wireReloadPreview();
    wirePreviewControls();
    loadSettings();

    appendMessage(
      'sys',
      'Bienvenue. Les deux configurateurs sont chargés en tâche de fond : passez de l’onglet Monte-escalier à Salle de bain quand vous voulez. Ouvrez « Paramètres API » pour coller votre clé.'
    );

    var sendBtn = $('#ds-send');
    if (sendBtn) sendBtn.addEventListener('click', sendChat);

    var inputEl = $('#ds-user-input');
    if (inputEl) {
      inputEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          sendChat();
        }
      });
    }

    var forgetBtn = $('#ds-forget-key');
    if (forgetBtn) {
      forgetBtn.addEventListener('click', function () {
        try {
          sessionStorage.removeItem(STORAGE_KEY);
          sessionStorage.removeItem(STORAGE_ENDPOINT);
          sessionStorage.removeItem(STORAGE_MODEL);
        } catch (e) { /* */ }
        var keyEl = $('#ds-api-key');
        if (keyEl) keyEl.value = '';
        appendMessage('assistant', 'Clé et préférences API oubliées dans ce navigateur.');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
