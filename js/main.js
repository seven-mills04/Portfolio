(function () {
  var data = window.PORTFOLIO;
  var $ = function (sel) { return document.querySelector(sel); };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function esc(text) {
    return String(text).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function list(items) {
    return items.map(function (item) { return "<li>" + esc(item) + "</li>"; }).join("");
  }

  /* ---- plain text fields ---- */
  document.querySelectorAll("[data-bind]").forEach(function (el) {
    el.textContent = data[el.getAttribute("data-bind")] || "";
  });
  $("[data-photo]").src = data.photo;
  $("[data-year]").textContent = "© " + new Date().getFullYear();

  var resume = $('[data-link="resume"]');
  if (data.resume) { resume.href = data.resume; } else { resume.hidden = true; }

  /* ---- ask box: English question -> SQL -> rows ---- */
  var sqlEl = $("[data-sql]");
  var resultEl = $("[data-result]");
  var questionsEl = $("[data-questions]");
  var timer = null;

  function highlight(sql) {
    return esc(sql)
      .replace(/(&#39;.*?(&#39;|$))/g, '<span class="str">$1</span>')
      .replace(/\b(SELECT|FROM|WHERE|ORDER BY|DESC|ASC|LIMIT|AND)\b/g, '<span class="kw">$1</span>');
  }

  function showResult(q) {
    var head = q.columns.map(function (c) { return "<th>" + esc(c) + "</th>"; }).join("");
    var body = q.rows.map(function (row) {
      return "<tr>" + row.map(function (cell) { return "<td>" + esc(cell) + "</td>"; }).join("") + "</tr>";
    }).join("");
    var count = q.rows.length + (q.rows.length === 1 ? " row" : " rows");
    resultEl.innerHTML =
      "<table><thead><tr>" + head + "</tr></thead><tbody>" + body + "</tbody></table>" +
      '<p class="ask__count">' + count + " returned</p>";
  }

  function run(index) {
    var q = data.questions[index];
    questionsEl.querySelectorAll("button").forEach(function (btn, i) {
      btn.setAttribute("aria-pressed", i === index ? "true" : "false");
    });
    clearInterval(timer);
    showResult(q);

    if (reduceMotion) {
      sqlEl.innerHTML = highlight(q.sql);
      return;
    }
    resultEl.classList.add("is-waiting");
    var shown = 0;
    timer = setInterval(function () {
      shown += 2;
      if (shown >= q.sql.length) {
        clearInterval(timer);
        sqlEl.innerHTML = highlight(q.sql);
        resultEl.classList.remove("is-waiting");
        return;
      }
      sqlEl.innerHTML = highlight(q.sql.slice(0, shown)) + '<span class="caret"></span>';
    }, 22);
  }

  data.questions.forEach(function (q, i) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ask__q";
    btn.textContent = q.ask;
    btn.addEventListener("click", function () { run(i); });
    questionsEl.appendChild(btn);
  });
  if (data.questions.length) { run(0); }

  /* ---- projects ---- */
  var projectsHtml = data.projects.filter(function (p) { return p.name; }).map(function (p) {
    var steps = (p.steps || []).map(function (s) {
      return "<li><h4>" + esc(s.title) + "</h4><p>" + esc(s.text) + "</p></li>";
    }).join("");
    var links = (p.links || []).filter(function (l) { return l.url; }).map(function (l) {
      return '<a class="btn btn--light" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + "</a>";
    }).join("");
    return (
      '<article class="project">' +
        '<div class="project__top"><h3 class="project__name">' + esc(p.name) + '</h3><span class="project__year">' + esc(p.year || "") + "</span></div>" +
        '<p class="project__tagline">' + esc(p.tagline || "") + "</p>" +
        '<p class="project__summary">' + esc(p.summary || "") + "</p>" +
        (steps ? '<ol class="project__steps">' + steps + "</ol>" : "") +
        '<div class="project__lower">' +
          '<ul class="project__details">' + list(p.details || []) + "</ul>" +
          '<ul class="tags">' + list(p.stack || []) + "</ul>" +
        "</div>" +
        (links ? '<div class="project__links">' + links + "</div>" : "") +
      "</article>"
    );
  }).join("");
  if (data.projects.length < 2) {
    projectsHtml += '<div class="next"><strong>Next project is in the works.</strong>It will show up here when it ships.</div>';
  }
  $("[data-projects]").innerHTML = projectsHtml;

  /* ---- stack ---- */
  $("[data-stack]").innerHTML = data.stack.map(function (g) {
    return "<div><h3>" + esc(g.group) + "</h3><ul>" + list(g.items) + "</ul></div>";
  }).join("");

  /* ---- path (only with 2+ entries) ---- */
  if (data.path && data.path.length >= 2) {
    $("#path").hidden = false;
    $("[data-path]").innerHTML = data.path.map(function (e) {
      return "<li><time>" + esc(e.when) + "</time><div><h3>" + esc(e.title) + "</h3><p>" + esc(e.note || "") + "</p></div></li>";
    }).join("");
    if (data.certificates && data.certificates.length) {
      $("[data-certs]").innerHTML = "<h3>Certificates</h3><ul>" + list(data.certificates) + "</ul>";
    }
  } else {
    $('[data-nav="path"]').hidden = true;
  }

  /* ---- contact ---- */
  var mail = $("[data-mail]");
  mail.textContent = data.email;
  mail.href = "mailto:" + data.email;

  var copy = $("[data-copy]");
  copy.addEventListener("click", function () {
    var done = function () {
      copy.textContent = "Email copied";
      setTimeout(function () { copy.textContent = "Copy email"; }, 1800);
    };
    try { navigator.clipboard.writeText(data.email).then(done, function () { copy.textContent = "Select the address to copy"; }); }
    catch (err) { copy.textContent = "Select the address to copy"; }
  });

  var socials = [["GitHub", data.github], ["LinkedIn", data.linkedin], ["Resume", data.resume]];
  $("[data-socials]").innerHTML = socials.filter(function (s) { return s[1]; }).map(function (s) {
    return '<li><a href="' + esc(s[1]) + '" target="_blank" rel="noopener">' + esc(s[0]) + "</a></li>";
  }).join("");
})();
