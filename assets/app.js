// Shows any public repo tagged with the GitHub topic "portfolio" (except the featured one),
// so new projects appear here without editing this page. Fails silently: the page works without it.
(function () {
  var USER = 'Saigwe';
  var TOPIC = 'portfolio';
  var FEATURED = ['semiconductor-yield-analytics'];

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  var target = document.getElementById('more-projects');
  if (!target || !window.fetch) return;

  fetch('https://api.github.com/users/' + USER + '/repos?per_page=100&sort=updated', {
    headers: { Accept: 'application/vnd.github+json' }
  })
    .then(function (r) { return r.ok ? r.json() : []; })
    .then(function (repos) {
      var picks = repos.filter(function (r) {
        return !r.fork && !r.archived && !r.private &&
          (r.topics || []).indexOf(TOPIC) !== -1 &&
          FEATURED.indexOf(r.name) === -1;
      });
      if (!picks.length) return;
      picks.forEach(function (r) { target.appendChild(card(r)); });
      target.hidden = false;
    })
    .catch(function () { /* offline or rate-limited: keep the static page */ });

  function card(r) {
    var el = document.createElement('article');
    el.className = 'card';
    var h = document.createElement('h3');
    var a = document.createElement('a');
    a.href = r.html_url; a.target = '_blank'; a.rel = 'noopener';
    a.textContent = prettify(r.name);
    h.appendChild(a);
    var p = document.createElement('p');
    p.textContent = r.description || '';
    var chips = document.createElement('ul');
    chips.className = 'chips';
    (r.topics || []).filter(function (t) { return t !== TOPIC; }).slice(0, 6).forEach(function (t) {
      var li = document.createElement('li'); li.textContent = t; chips.appendChild(li);
    });
    el.appendChild(h); el.appendChild(p); el.appendChild(chips);
    return el;
  }

  function prettify(name) {
    return name.replace(/[-_]+/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }
})();
