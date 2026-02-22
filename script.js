const PROG_SCHOWANIA_PASKA = 100;
const PROG_PRZYCISKU_POWROTU = 300;
const MNOZNIK_PARALAKSY = 0.1;
const MARGINES_AKTYWNEJ_SEKCJI = 100;
const MARGINES_PLYNNEGO_SCROLLA = 20;

const pasekNawigacji = document.getElementById("navbar");
const menuNawigacji = document.getElementById("navMenu");
const przelacznikMenu = document.getElementById("navToggle");
const przyciskPowrotu = document.getElementById("scrollToTop");
const pasekPostepu = document.querySelector(".scroll-progress");
const sekcje = document.querySelectorAll(".section[id], .header[id]");
const linkiNawigacji = document.querySelectorAll(".nav-link");
const ksztaltyTla = document.querySelectorAll(".shape");

// Cachujemy wysokosc paska i wysokosc strony - odswiezamy tylko przy zmianie rozmiaru okna
let wysokoscPasku = pasekNawigacji.offsetHeight;
let calkowitaWysokosc =
  document.documentElement.scrollHeight - window.innerHeight;

const obserwatorRozmiaruOkna = new ResizeObserver(() => {
  wysokoscPasku = pasekNawigacji.offsetHeight;
  calkowitaWysokosc =
    document.documentElement.scrollHeight - window.innerHeight;
});
obserwatorRozmiaruOkna.observe(document.body);

linkiNawigacji.forEach((link) => {
  link.addEventListener("click", function (zdarzenie) {
    zdarzenie.preventDefault();

    const docelowaSekcja = document.querySelector(this.getAttribute("href"));
    if (!docelowaSekcja) return;

    window.scrollTo({
      top: docelowaSekcja.offsetTop - wysokoscPasku - MARGINES_PLYNNEGO_SCROLLA,
      behavior: "smooth",
    });

    menuNawigacji.classList.remove("active");
    przelacznikMenu.classList.remove("active");
  });
});

przelacznikMenu.addEventListener("click", () => {
  menuNawigacji.classList.toggle("active");
  przelacznikMenu.classList.toggle("active");
});

// rAF zapobiega wywolywaniu logiki czesciej niz odswiezanie ekranu
let oczekujacaAnimacja = false;

window.addEventListener("scroll", () => {
  if (oczekujacaAnimacja) return;

  oczekujacaAnimacja = true;
  requestAnimationFrame(() => {
    aktualizujNaScroll();
    oczekujacaAnimacja = false;
  });
});

function aktualizujNaScroll() {
  const pozycjaScrolla = window.scrollY;

  pasekNawigacji.classList.toggle(
    "scrolled",
    pozycjaScrolla > PROG_SCHOWANIA_PASKA,
  );
  przyciskPowrotu.classList.toggle(
    "visible",
    pozycjaScrolla > PROG_PRZYCISKU_POWROTU,
  );

  pasekPostepu.style.width = (pozycjaScrolla / calkowitaWysokosc) * 100 + "%";

  let idAktywnejSekcji = "";
  sekcje.forEach((sekcja) => {
    const szczytSekcji =
      sekcja.offsetTop - wysokoscPasku - MARGINES_AKTYWNEJ_SEKCJI;
    if (
      pozycjaScrolla >= szczytSekcji &&
      pozycjaScrolla < szczytSekcji + sekcja.offsetHeight
    ) {
      idAktywnejSekcji = sekcja.getAttribute("id");
    }
  });

  linkiNawigacji.forEach((link) => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === `#${idAktywnejSekcji}`,
    );
  });

  ksztaltyTla.forEach((ksztalt, indeks) => {
    ksztalt.style.setProperty(
      "--przesuniecie-paralaksy",
      `${pozycjaScrolla * (indeks + 1) * MNOZNIK_PARALAKSY}px`,
    );
  });
}

przyciskPowrotu.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
