document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("lead-form");
  const statusEl = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");

  const MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/uubs9wobqfawvtv44qyu9gagh0pjc9cw";

  if (!form) return;

  function setStatus(msg, type = "") {
    if (!statusEl) return;
    statusEl.className = `form-status ${type}`.trim();
    statusEl.textContent = msg;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Basic required check
    const consent = document.getElementById("consent");
    if (consent && !consent.checked) {
      setStatus("Veuillez accepter d’être contacté(e).", "error");
      return;
    }

    const payload = {
      fullName: form.fullName?.value?.trim() || "",
      phone: form.phone?.value?.trim() || "",
      email: form.email?.value?.trim() || "",
      address: form.address?.value?.trim() || "",
      city: form.city?.value?.trim() || "",
      postalCode: form.postalCode?.value?.trim() || "",
      consent: !!consent?.checked,
      source: "website",
      pageUrl: window.location.href,
      submittedAt: new Date().toISOString()
    };

    try {
      if (submitBtn) submitBtn.disabled = true;
      setStatus("Envoi en cours…");

      // IMPORTANT:
      // If CORS blocks fetch, this will throw.
      // We'll still give user a success-style message only if request succeeds.
      const res = await fetch(MAKE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(`Webhook HTTP ${res.status}`);

      setStatus("Demande envoyée ✅ Je vous contacte sous 24h.", "success");
      form.reset();

    } catch (err) {
      console.error("Form submit error:", err);
      setStatus(
        "Erreur d’envoi. Merci de réessayer ou appelez-moi au +33 7 63 55 96 00.",
        "error"
      );
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
});
