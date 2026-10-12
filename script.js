
// =======================================
// WURZELSPITZE – JAVASCRIPT
// =======================================


// 1. SMARTPHONE-MENÜ

const menuButton = document.querySelector("#menu-button");
const hauptmenue = document.querySelector("#hauptmenue");

if (menuButton && hauptmenue) {

  menuButton.addEventListener("click", function () {

    const istOffen = hauptmenue.classList.toggle("offen");

    menuButton.setAttribute("aria-expanded", String(istOffen));
    menuButton.setAttribute(
      "aria-label",
      istOffen ? "Menü schließen" : "Menü öffnen"
    );

    menuButton.textContent = istOffen ? "✕" : "☰";
  });

  hauptmenue.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      hauptmenue.classList.remove("offen");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Menü öffnen");
      menuButton.textContent = "☰";
    });
  });
}


// 2. FAQ-FRAGEN

document.querySelectorAll(".faq-frage").forEach(function (frage) {

  frage.addEventListener("click", function () {

    const antwort = frage.nextElementSibling;
    if (!antwort) return;

    antwort.hidden = !antwort.hidden;
    frage.setAttribute("aria-expanded", String(!antwort.hidden));

    const symbol = frage.querySelector("span");

    if (symbol) {
      symbol.textContent = antwort.hidden ? "+" : "−";
    }
  });
});


// 3. MEHR-ERFAHREN-BUTTON

const mehrButton = document.querySelector("#mehr-button");
const mehrText = document.querySelector("#mehr-text");

if (mehrButton && mehrText) {
  mehrButton.addEventListener("click", function () {

    mehrText.hidden = !mehrText.hidden;

    mehrButton.textContent = mehrText.hidden
      ? "Mehr erfahren"
      : "Weniger anzeigen";

    mehrButton.setAttribute(
      "aria-expanded",
      String(!mehrText.hidden)
    );
  });
}


// 4. LANGSAMES SCROLLEN

function langsamScrollen(zielPosition, dauer = 1600) {

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo({ top: zielPosition, behavior: "instant" });
    return;
  }

  const start = window.scrollY;
  const entfernung = zielPosition - start;
  let startzeit = null;

  function animieren(zeit) {

    if (startzeit === null) startzeit = zeit;

    const fortschritt = Math.min(
      (zeit - startzeit) / dauer, 1
    );

    const weich = fortschritt < 0.5
      ? 2 * fortschritt * fortschritt
      : 1 - Math.pow(-2 * fortschritt + 2, 2) / 2;

    window.scrollTo(0, start + entfernung * weich);

    if (fortschritt < 1) {
      requestAnimationFrame(animieren);
    }
  }

  requestAnimationFrame(animieren);
}


// 5. MENÜLINKS INNERHALB EINER SEITE

document.querySelectorAll('a[href^="#"]').forEach(function (link) {

  link.addEventListener("click", function (event) {

    const hash = link.getAttribute("href");

    if (!hash || hash === "#") return;

    const ziel = document.getElementById(hash.slice(1));
    if (!ziel) return;

    event.preventDefault();

    langsamScrollen(
      ziel.getBoundingClientRect().top + window.scrollY
    );

    history.replaceState(null, "", hash);
  });
});


// 6. TRANSPARENTER NACH-OBEN-BUTTON

const nachOben = document.querySelector("#nach-oben");

if (nachOben) {

  function buttonAktualisieren() {

    const position = window.scrollY;

    const maximal =
      document.documentElement.scrollHeight -
      window.innerHeight;

    if (position <= 100) {
      nachOben.classList.remove("sichtbar");
      return;
    }

    nachOben.classList.add("sichtbar");

    const fortschritt = maximal > 300
      ? Math.min(1, (position - 300) / (maximal - 300))
      : 1;

    const deckkraft = 0.4 + fortschritt * 0.6;

    nachOben.style.backgroundColor =
      `rgba(83, 94, 61, ${deckkraft})`;
  }

  window.addEventListener("scroll", buttonAktualisieren);
  window.addEventListener("load", buttonAktualisieren);

  nachOben.addEventListener("click", function () {
    langsamScrollen(0, 1800);
  });
}


// 7. BEIM NEULADEN OBEN STARTEN

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", function () {
  if (!window.location.hash) {
    window.scrollTo(0, 0);
  }
});

// Aktiven Menüpunkt anhand der URL markieren

function aktiveNavigation() {
  const datei = window.location.pathname.split("/").pop()
    || "index.html";

  const hash = window.location.hash;

  document.querySelectorAll("#hauptmenue a").forEach(function(link) {

    link.removeAttribute("aria-current");

    const ziel = link.getAttribute("href");

    if (hash === "#faq" && ziel === "kontakt.html#faq") {
      link.setAttribute("aria-current", "page");
    } else if (
      hash !== "#faq" &&
      ziel === datei
    ) {
      link.setAttribute("aria-current", "page");
    }
  });
}

aktiveNavigation();
window.addEventListener("hashchange", aktiveNavigation);
window.addEventListener("pageshow", aktiveNavigation);
