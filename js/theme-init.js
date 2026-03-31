(function () {
  try {
    var k = 'labienveillance-theme';
    var t = localStorage.getItem(k);
    if (t === 'light') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
