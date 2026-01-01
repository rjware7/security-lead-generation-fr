document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("lead-form");
  const statusEl = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");
  const successBox = document.getElementById("success-box");
  const MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/uubs9wobqfawvtv44qyu9gagh0pjc9cw";

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

  const setStatus = (message, type = "") => {
    statusEl.className = `form-status ${type}`.trim();
    statusEl.textContent = message;
  };

  const toggleSubmitting = (isSubmitting) => {
    submitBtn.disabled = isSubmitting;
    submitBtn.setAttribute("aria-busy", String(isSubmitting));
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (successBox) successBox.hidden = true;
    toggleSubmitting(true);
    setStatus("Envoi…");

    const payload = {
      fullName: form.fullName?.value?.trim() || "",
      phone: form.phone?.value?.trim() || "",
      email: form.email?.value?.trim() || "",
      address: form.address?.value?.trim() || "",
      city: form.city?.value?.trim() || "",
      postalCode: form.postalCode?.value?.trim() || "",
      consent: !!form.consent?.checked,
      contactTime: form.contactTime?.value || "",
      smsOptIn: !!form.smsOptIn?.checked,
      company: form.company?.value?.trim() || "",
      pageUrl: window.location.href,
      submittedAt: new Date().toISOString()
    };

    console.log("[lead-form] payload", payload);

    const requiredFields = ["fullName", "phone", "address", "city", "postalCode"];
    const missingRequired = requiredFields.some((field) => !payload[field]);

    let handled = false;

    try {
      if (missingRequired) {
        setStatus("Merci de remplir tous les champs obligatoires.", "error");
        return;
      }

      if (!payload.consent) {
        setStatus("Veuillez accepter d’être contacté(e) pour l’étude.", "error");
        return;
      }

      const response = await fetch(MAKE_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      console.log("[lead-form] response status", response.status);

      if (!response.ok) {
        throw new Error(`Webhook HTTP ${response.status}`);
      }

      handled = true;
      setStatus("Demande envoyée ✅ Je vous contacte sous 24h.", "success");
      if (successBox) successBox.hidden = false;

      setTimeout(() => {
        form.reset();
        toggleSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error("[lead-form] submit error", error);
      setStatus("Erreur d’envoi. Merci de réessayer ou appelez-moi au +33 7 63 55 96 00.", "error");
    } finally {
      if (!handled) {
        toggleSubmitting(false);
      }
    }
  });
});
