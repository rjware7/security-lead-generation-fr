document.addEventListener("DOMContentLoaded", () => {
  const DEBUG = false;
  const webhook = "https://hook.eu2.make.com/uubs9wobqfawvtv44qyu9gagh0pjc9cw";
  const form = document.getElementById("lead-form");
  const statusEl = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");
  const successBox = document.getElementById("success-box");

  const debugLog = (...args) => {
    if (DEBUG) console.log(...args);
  };

  const showInitError = () => {
    if (document.querySelector(".script-error-banner")) return;
    const banner = document.createElement("div");
    banner.className = "script-error-banner";
    banner.textContent = "Erreur: script non initialisé";
    document.body.prepend(banner);
  };

  if (!form || !statusEl || !submitBtn) {
    showInitError();
    return;
  }

  if (form.dataset.handlerAttached) {
    debugLog("[lead-form] handler already attached");
    return;
  }
  form.dataset.handlerAttached = "true";
  debugLog("[lead-form] form handler attached");

  const setStatus = (message, type = "") => {
    statusEl.className = `form-status ${type}`.trim();
    statusEl.textContent = message;
  };

  const toggleSubmitting = (isSubmitting) => {
    submitBtn.disabled = isSubmitting;
    submitBtn.setAttribute("aria-busy", String(isSubmitting));
  };

  const scrollToSuccess = () => {
    if (successBox) {
      successBox.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (successBox) successBox.hidden = true;
    toggleSubmitting(true);
    setStatus("Envoi…");

    const companyValue = form.company?.value?.trim() || "";

    const requiredFields = ["fullName", "phone", "address", "city", "postalCode"];
    const missingRequired = requiredFields.some((field) => !form[field]?.value?.trim());

    if (missingRequired) {
      setStatus("Merci de remplir tous les champs obligatoires.", "error");
      toggleSubmitting(false);
      return;
    }

    if (!form.consent?.checked) {
      setStatus("Veuillez accepter d’être contacté(e) pour l’étude.", "error");
      toggleSubmitting(false);
      return;
    }

    const showSuccessUI = () => {
      setStatus("Demande envoyée ✅ Je vous contacte sous 24h.", "success");
      if (successBox) successBox.hidden = false;
      scrollToSuccess();
      toggleSubmitting(false);
      setTimeout(() => {
        form.reset();
      }, 800);
    };

    // Honeypot: pretend success but skip the network call.
    if (companyValue) {
      debugLog("[lead-form] honeypot filled, skipping webhook");
      showSuccessUI();
      return;
    }

    try {
      const formData = new FormData(form);
      debugLog("[lead-form] sending FormData");

      await fetch(webhook, {
        method: "POST",
        body: formData,
        mode: "no-cors"
      });

      debugLog("[lead-form] fetch resolved");
      showSuccessUI();
    } catch (error) {
      debugLog("[lead-form] submit error", error);
      setStatus("Erreur d’envoi. Merci de réessayer ou appelez-moi au +33 7 63 55 96 00.", "error");
      toggleSubmitting(false);
    }
  });
});
