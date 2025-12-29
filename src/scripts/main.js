document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('lead-form');
  const statusEl = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');
  const accordion = document.getElementById('faq-accordion');
  const phonePattern = /^[0-9+().\s-]{8,}$/;
  const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  if (accordion) {
    accordion.querySelectorAll('.accordion__item').forEach((item) => {
      const btn = item.querySelector('.accordion__button');
      btn.addEventListener('click', () => {
        item.classList.toggle('active');
      });
    });
  }

  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors();
    if (statusEl) setStatus('Envoi en cours...', '');
    setLoading(true);

    const data = new FormData(form);
    const payload = {
      fullName: (data.get('fullName') || '').trim(),
      phone: (data.get('phone') || '').trim(),
      email: (data.get('email') || '').trim(),
      address: (data.get('address') || '').trim(),
      city: (data.get('city') || '').trim(),
      postalCode: (data.get('postalCode') || '').trim(),
      consent: form.elements.consent?.checked,
    };

    let hasError = false;

    if (!payload.fullName) hasError = showError('fullName', 'Nom requis.');
    if (!payload.phone) hasError = showError('phone', 'Téléphone requis.') || hasError;
    if (payload.phone && !phonePattern.test(payload.phone)) {
      hasError = showError('phone', 'Format de téléphone invalide.') || hasError;
    }
    if (payload.email && !emailPattern.test(payload.email)) {
      hasError = showError('email', 'Format d’email invalide.');
    }
    if (!payload.address) hasError = showError('address', 'Adresse requise.') || hasError;
    if (!payload.city) hasError = showError('city', 'Ville requise.') || hasError;
    if (!payload.postalCode) hasError = showError('postalCode', 'Code postal requis.') || hasError;
    if (!payload.consent) hasError = showError('consent', 'Merci d’accepter d’être contacté(e).') || hasError;

    if (hasError) {
      setStatus('Merci de corriger les champs indiqués.', 'error');
      setLoading(false);
      return;
    }

    // INSERT MAKE.COM WEBHOOK HERE
    const webhookUrl = '';

    try {
      if (!webhookUrl) throw new Error('Webhook manquant');

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Webhook responded with ${response.status}`);
      }

      setStatus('Merci, votre demande est bien enregistrée. Un conseiller vous recontacte sous 24h.', 'success');
      form.reset();
    } catch (error) {
      console.error(error);
      setStatus('Ajoutez l’URL du webhook Make.com ou réessayez dans un instant.', 'error');
    } finally {
      setLoading(false);
    }
  });

  function showError(field, message) {
    const errorEl = document.querySelector(`[data-error-for="${field}"]`);
    if (errorEl) errorEl.textContent = message;
    return true;
  }

  function clearErrors() {
    document.querySelectorAll('.error').forEach((el) => {
      el.textContent = '';
    });
  }

  function setStatus(message, type) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.remove('success', 'error');
    if (type) statusEl.classList.add(type);
  }

  function setLoading(isLoading) {
    if (!submitBtn) return;
    submitBtn.disabled = isLoading;
    submitBtn.style.opacity = isLoading ? '0.7' : '1';
    submitBtn.textContent = isLoading ? 'Envoi...' : 'Demander mon étude gratuite';
  }
});
