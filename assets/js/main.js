/* ===== Theme ===== */
const root = document.documentElement;
const themeBtn = document.getElementById("theme");
const themeMenu = document.getElementById("themeMenu");

/* Set selected theme */
function setTheme(t) {
  root.dataset.theme = t;
  document.body.className = t;

  /* Button text */
  const selectedButton = document.querySelector(
    `.theme-menu button[data-theme="${t}"]`
  );

  if (selectedButton) {
    themeBtn.textContent = selectedButton.textContent.trim();
  }

  /* Save selected theme */
  try {
    localStorage.setItem("theme", t);
  } catch (e) {}
}


/* Get saved theme */
let saved = null;

try {
  saved = localStorage.getItem("theme");
} catch (e) {}


/* Default theme */
const defaultTheme =
  saved ||
  (matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light");


/* Apply theme */
setTheme(defaultTheme);


/* Open / close theme menu */
themeBtn.addEventListener("click", () => {
  themeMenu.classList.toggle("show");
});


/* Select theme */
document.querySelectorAll(".theme-menu button").forEach((button) => {

  button.addEventListener("click", () => {

    const selectedTheme = button.dataset.theme;

    setTheme(selectedTheme);

    themeMenu.classList.remove("show");

  });

});


/* Close theme menu when clicking outside */
document.addEventListener("click", (e) => {

  if (!e.target.closest(".theme-wrapper")) {
    themeMenu.classList.remove("show");
  }

});


/* ===== Contact Form / Netlify Forms ===== */

const contactForm = document.getElementById("form");
const statusMessage = document.getElementById("status");
const sendButton = document.getElementById("send");

if (contactForm) {

  contactForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    /* Check browser validation */
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    /* Button state */
    sendButton.disabled = true;
    sendButton.textContent = "Sending...";
    statusMessage.textContent = "";

    try {

      const formData = new FormData(contactForm);

      await fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(formData).toString()
      });

      /* Success */
      statusMessage.textContent =
        "Message sent successfully! Thank you for contacting me.";

      contactForm.reset();

    } catch (error) {

      /* Error */
      statusMessage.textContent =
        "Something went wrong. Please try again.";

      console.error("Form submission error:", error);

    } finally {

      sendButton.disabled = false;
      sendButton.textContent = "Send message";

    }

  });

}