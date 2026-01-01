document.addEventListener("DOMContentLoaded", () => {
  const DEBUG = false;
  const form = document.getElementById("lead-form");
  const statusEl = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");
  const webhook = "https://hook.eu2.make.com/uubs9wobqfawvtv44qyu9gagh0pjc9cw";

  const debugLog = (...args) => {
    if (DEBUG) console.log(...args);
  };

  if (!form || !statusEl || !submitBtn) return;

  if (form.dataset.handlerAttached) return;
  form.dataset.handlerAttached = "true";

  const setStatus = (msg, type = "") => {
    statusEl.className = `form-status ${type}`.trim();
    statusEl.textContent = msg;
  };

  const toggleSubmitting = (isSubmitting) => {
    submitBtn.disabled = isSubmitting;
    submitBtn.setAttribute("aria-busy", String(isSubmitting));
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    debugLog("[lead-form] submit");

    const consent = document.getElementById("consent");
    const company = document.getElementById("company");

    const requiredFields = ["fullName", "phone", "address", "city", "postalCode"];
    const missingRequired = requiredFields.some((field) => !form[field]?.value?.trim());

    if (missingRequired) {
      setStatus("Merci de remplir tous les champs obligatoires.", "error");
      return;
    }

    if (consent && !consent.checked) {
      setStatus("Veuillez accepter d’être contacté(e).", "error");
      return;
    }

    toggleSubmitting(true);
    setStatus("Envoi en cours…");

    const formData = new FormData(form);
    formData.append("source", "website");
    formData.append("pageUrl", window.location.href);
    formData.append("submittedAt", new Date().toISOString());

    const honeypotFilled = company && company.value.trim();

    try {
      if (!honeypotFilled) {
        await fetch(webhook, {
          method: "POST",
          body: formData,
          mode: "no-cors"
        });
      }

      setStatus("Demande envoyée ✅ Je vous contacte sous 24h.", "success");
      form.reset();
    } catch (err) {
      console.error("[lead-form] submit error:", err);
      setStatus(
        "Erreur d’envoi. Merci de réessayer ou appelez-moi au +33 7 63 55 96 00.",
        "error"
      );
    } finally {
      toggleSubmitting(false);
    }
  });
});
