
import { createClient } from
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const supabase = createClient(
  "DEINE_PROJEKT_URL",
  "DEIN_PUBLISHABLE_KEY"
);

// Prüfen, ob ein Mitarbeiter angemeldet ist
const { data, error } = await supabase.auth.getUser();

if (error || !data.user) {

  window.location.replace("anmeldung.html");

} else {

  // Angemeldete Seite sichtbar machen
  document.body.style.visibility = "visible";

}

// Logout-Buttons verbinden
document.querySelectorAll(
  ".logout-button, .logout-menu"
).forEach(button => {

  button.addEventListener("click", async event => {
    event.preventDefault();

    await supabase.auth.signOut();

    window.location.replace("index.html");
  });

});
