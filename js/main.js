(function () {
  var data = window.PORTFOLIO;
  var $ = function (sel) { return document.querySelector(sel); };
  var $$ = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var animate = !reduceMotion && window.gsap && window.ScrollTrigger;

  function esc(text) {
    return String(text).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function list(items) {
    return items.map(function (item) { return "<li>" + esc(item) + "</li>"; }).join("");
  }

  /* ---- plain text fields ---- */
  $$("[data-bind]").forEach(function (el) {
    el.textContent = data[el.getAttribute("data-bind")] || "";
  });
  $("[data-initials]").textContent = data.name.split(" ").map(function (w) { return w[0]; }).join("") + ".";
  $("[data-photo]").src = data.photo;
  $("[data-year]").textContent = "© " + new Date().getFullYear();

  var resume = $('[data-link="resume"]');
  if (data.resume) { resume.href = data.resume; } else { resume.hidden = true; }

  /* ---- marquee of everything in the stack ---- */
  var tools = [];
  data.stack.forEach(function (g) { tools = tools.concat(g.items); });
  var strip = tools.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("");
  $("[data-marquee]").innerHTML = strip + strip;

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
    if (reduceMotion) { sqlEl.innerHTML = highlight(q.sql); return; }

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
  // Showzo's picture: a small seat map. Grey seats are taken, the bright one is the seat 8 people tried for.
  var seatMap = "";
  for (var r = 0; r < 6; r++) {
    for (var c = 0; c < 12; c++) {
      var won = r === 3 && c === 6;
      var taken = !won && (r * 7 + c * 5) % 9 < 3;
      seatMap += '<i class="' + (won ? "won" : taken ? "t" : "") + '"' + (c === 6 ? ' style="margin-left:.5rem"' : "") + "></i>";
    }
  }
  var visuals = {
    showzo:
      '<p class="visual__label">8 people tap the same seat at once</p>' +
      '<div class="visual__seats">' + seatMap + '</div>' +
      '<div class="visual__screen"><span>screen</span></div>' +
      '<div class="visual__flow">' +
        '<div class="visual__step visual__step--done">1 hold accepted<span>7 turned away</span></div>' +
        '<div class="visual__step">Razorpay signature checked<span>hmac-sha256</span></div>' +
        '<div class="visual__step visual__step--done">QR ticket issued<span>booked</span></div>' +
      "</div>",
    askdb:
      '<p class="visual__label">question</p>' +
      '<p class="visual__bubble">Which customers ordered the most last month?</p>' +
      '<p class="visual__label">generated sql, checked before it runs</p>' +
      '<pre class="visual__code"><b>SELECT</b> customer, <b>COUNT</b>(*) <b>AS</b> orders\n<b>FROM</b> orders <b>GROUP BY</b> customer\n<b>ORDER BY</b> orders <b>DESC LIMIT</b> 5;</pre>' +
      '<p class="visual__label">answer</p>' +
      '<div class="visual__bars"><i style="height:100%"></i><i style="height:78%"></i><i style="height:61%"></i><i style="height:44%"></i><i style="height:30%"></i></div>',
    billing:
      '<p class="visual__label">from meter reading to paid bill</p>' +
      '<div class="visual__flow">' +
        '<div class="visual__step">Consumer and connection<span>module 1, 2</span></div>' +
        '<div class="visual__step">Meter reading<span>module 3</span></div>' +
        '<div class="visual__step">Tariff engine<span>5 slabs</span></div>' +
        '<div class="visual__slabs"><i></i><i></i><i></i><i></i><i></i></div>' +
        '<div class="visual__step">Bill generated<span>module 4</span></div>' +
        '<div class="visual__step visual__step--done">Payment recorded<span>module 5</span></div>' +
      "</div>"
  };

  $("[data-projects]").innerHTML = data.projects.filter(function (p) { return p.name; }).map(function (p, i) {
    var links = (p.links || []).filter(function (l) { return l.url; }).map(function (l, n) {
      return '<a class="btn' + (n === 0 ? " btn--solid" : "") + '" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + "</a>";
    }).join("");
    var visual = visuals[p.visual] ? '<div class="visual">' + visuals[p.visual] + "</div>" : "";
    return (
      '<article class="project" data-reveal>' +
        "<div>" +
          '<p class="project__meta"><span>' + String(i + 1).padStart(2, "0") + "</span><span>" + esc(p.year || "") + "</span></p>" +
          '<h3 class="project__name">' + esc(p.name) + "</h3>" +
          '<p class="project__tagline">' + esc(p.tagline || "") + "</p>" +
          '<p class="project__summary">' + esc(p.summary || "") + "</p>" +
          '<ul class="project__details">' + list(p.details || []) + "</ul>" +
          '<ul class="tags">' + list(p.stack || []) + "</ul>" +
          (links ? '<div class="project__links">' + links + "</div>" : "") +
        "</div>" + visual +
      "</article>"
    );
  }).join("");

  $$(".project").forEach(function (card) {
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  /* ---- stack ---- */
  $("[data-stack]").innerHTML = data.stack.map(function (g) {
    return "<div><h3>" + esc(g.group) + "</h3><ul>" + list(g.items) + "</ul></div>";
  }).join("");

  /* ---- path and certificates ---- */
  if (data.path && data.path.length >= 2) {
    $("[data-path]").innerHTML = data.path.map(function (e) {
      return "<li><time>" + esc(e.when) + "</time><div><h3>" + esc(e.title) + "</h3><p>" + esc(e.note || "") + "</p></div></li>";
    }).join("");
    if (data.certificates && data.certificates.length) {
      $("[data-certs]").innerHTML = "<h3>Certificates</h3><ul>" + list(data.certificates) + "</ul>";
    }
  } else {
    $("#path").hidden = true;
    $('.nav__links a[href="#path"]').hidden = true;
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
    var failed = function () { copy.textContent = "Select the address to copy"; };
    try { navigator.clipboard.writeText(data.email).then(done, failed); } catch (err) { failed(); }
  });

  var socials = [["GitHub", data.github], ["LinkedIn", data.linkedin], ["Resume", data.resume]];
  $("[data-socials]").innerHTML = socials.filter(function (s) { return s[1]; }).map(function (s) {
    return '<li><a href="' + esc(s[1]) + '" target="_blank" rel="noopener">' + esc(s[0]) + "</a></li>";
  }).join("");

  /* ---- motion (GSAP). Everything above works without it. ---- */
  if (!animate) { return; }
  gsap.registerPlugin(ScrollTrigger);

  // Hero: the name rises line by line, then the rest settles in.
  var intro = gsap.timeline({ defaults: { ease: "power4.out" } });
  intro
    .from(".nav", { y: -30, opacity: 0, duration: .8 })
    .from(".line__in", { yPercent: 110, duration: 1.1, stagger: .12 }, "-=.5")
    .from(".hero .status, .hero__role, .hero__intro, .hero__actions", { y: 24, opacity: 0, duration: .8, stagger: .08 }, "-=.7")
    .from(".hero__photo", { opacity: 0, scale: .92, duration: 1.2 }, "-=1.2");

  // Portrait tilts toward the pointer.
  var frame = $(".hero__frame");
  var rotX = gsap.quickTo(frame, "rotationX", { duration: .6, ease: "power3" });
  var rotY = gsap.quickTo(frame, "rotationY", { duration: .6, ease: "power3" });
  $(".hero").addEventListener("pointermove", function (e) {
    rotY((e.clientX / window.innerWidth - .5) * 12);
    rotX((.5 - e.clientY / window.innerHeight) * 10);
  });
  $(".hero").addEventListener("pointerleave", function () { rotX(0); rotY(0); });

  // Sections rise in as they enter the screen.
  $$("[data-reveal]").forEach(function (el) {
    gsap.from(el, { y: 50, opacity: 0, duration: .9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } });
  });
  gsap.from(".stack > div", { y: 40, opacity: 0, duration: .7, stagger: .1, ease: "power3.out", scrollTrigger: { trigger: ".stack", start: "top 85%" } });
  $$(".visual__bars").forEach(function (bars) {
    gsap.from(bars.children, { scaleY: 0, duration: .9, stagger: .08, ease: "power3.out", scrollTrigger: { trigger: bars, start: "top 90%" } });
  });
  $$(".visual__seats").forEach(function (seats) {
    gsap.from(seats.children, { scale: 0, opacity: 0, duration: .35, stagger: { each: .012, from: "center" }, ease: "back.out(2)", scrollTrigger: { trigger: seats, start: "top 88%" } });
  });
  $$(".visual__flow").forEach(function (flow) {
    gsap.from(flow.children, { x: 30, opacity: 0, duration: .5, stagger: .1, ease: "power2.out", scrollTrigger: { trigger: flow, start: "top 85%" } });
  });

  // Timeline: the line draws itself as you scroll, entries follow.
  var path = $(".path");
  if (path && path.children.length) {
    gsap.fromTo(path, { "--draw": 0 }, { "--draw": 1, ease: "none", scrollTrigger: { trigger: path, start: "top 75%", end: "bottom 60%", scrub: true } });
    gsap.from(path.children, { x: 30, opacity: 0, duration: .6, stagger: .12, ease: "power2.out", scrollTrigger: { trigger: path, start: "top 82%" } });
  }

  // The big sign-off grows slightly as it arrives.
  gsap.from(".contact__title", { scale: .82, ease: "none", scrollTrigger: { trigger: ".contact", start: "top bottom", end: "top 30%", scrub: true } });
})();
