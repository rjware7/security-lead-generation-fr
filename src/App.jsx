import { useState } from 'react';

const phonePattern = /^[0-9+().\s-]{8,}$/;

const initialForm = {
  fullName: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  consent: false,
};

function App() {
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState({ message: '', type: '' });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value]),
    );

    if (!trimmed.fullName || !trimmed.phone || !trimmed.address || !trimmed.city || !trimmed.postalCode) {
      setStatus({ message: 'Merci de remplir tous les champs requis pour l’étude.', type: 'error' });
      return;
    }

    if (!trimmed.consent) {
      setStatus({ message: 'Merci d’accepter d’être contacté(e) pour l’étude.', type: 'error' });
      return;
    }

    if (!phonePattern.test(trimmed.phone)) {
      setStatus({ message: 'Le numéro de téléphone semble incomplet. Merci de vérifier le format.', type: 'error' });
      return;
    }

    setStatus({ message: 'Envoi en cours...', type: '' });

    const payload = {
      fullName: trimmed.fullName,
      phone: trimmed.phone,
      address: trimmed.address,
      city: trimmed.city,
      postalCode: trimmed.postalCode,
    };

    // TODO: insérer ici l’URL du webhook Make.com pour recevoir les leads
    const webhookUrl = '';

    try {
      if (!webhookUrl) {
        throw new Error('Webhook Make.com manquant');
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Webhook responded with ${response.status}`);
      }

      setStatus({
        message: 'Merci, votre demande est bien enregistrée. Un conseiller vous recontacte sous 24h.',
        type: 'success',
      });
      setFormData(initialForm);
    } catch (error) {
      console.error(error);
      setStatus({
        message: 'Ajoutez l’URL du webhook Make.com ou réessayez dans un instant.',
        type: 'error',
      });
    }
  };

  return (
    <>
      <header className="topbar">
        <div className="container">
          <p className="brand">Conseiller Sécurité Indépendant</p>
          <nav className="nav">
            <a href="#pourquoi">Pourquoi une étude</a>
            <a href="#etapes">Comment ça marche</a>
            <a href="#role">Notre rôle</a>
            <a href="#contact">Formulaire</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero" id="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="badge">Information sur Verisure • Service indépendant</p>
              <h1>Étude de sécurité Verisure, réalisée par un conseiller indépendant</h1>
              <p className="lede">
                Nous évaluons en toute transparence si une solution Verisure est adaptée à votre logement et vous
                accompagnons dans votre décision.
              </p>
              <div className="hero-actions">
                <a className="button primary" href="#contact">
                  Demander mon étude gratuite
                </a>
                <p className="mini-note">Réponse sous 24h, sans engagement.</p>
              </div>
              <div className="trust-bar">
                <span>Analyse personnalisée</span>
                <span>Visite sur place gratuite</span>
                <span>Respect RGPD & confidentialité</span>
              </div>
            </div>
            <div className="hero-card">
              <div className="card">
                <h2>Ce que vous recevez</h2>
                <ul>
                  <li>Audit des accès sensibles et points faibles</li>
                  <li>Plan d’équipement adapté à votre habitation</li>
                  <li>Estimation budgétaire transparente</li>
                  <li>Comparatif des options Verisure utiles ou non</li>
                </ul>
                <p className="disclaimer-card">
                  Mission d’information indépendante, sans lien commercial exclusif avec Verisure.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="pourquoi">
          <div className="container">
            <div className="section-header">
              <h2>Pourquoi réaliser une étude de sécurité ?</h2>
              <p>Une étude préalable garantit un système efficace, adapté à votre foyer et conforme aux bonnes pratiques.</p>
            </div>
            <div className="card-grid three">
              <article className="card">
                <h3>Identifier les risques</h3>
                <p>Repérer les issues vulnérables, les zones peu visibles et les habitudes du foyer pour cibler la protection.</p>
              </article>
              <article className="card">
                <h3>Dimensionner le système</h3>
                <p>Éviter les équipements inutiles, prioriser les capteurs essentiels et calibrer la télésurveillance.</p>
              </article>
              <article className="card">
                <h3>Assurer la conformité</h3>
                <p>Conseils sur la pose, l’entretien et les exigences RGPD pour les caméras et données collectées.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section muted" id="etapes">
          <div className="container">
            <div className="section-header">
              <h2>Comment ça marche</h2>
              <p>Un processus simple, transparent et documenté.</p>
            </div>
            <div className="steps">
              <div className="step">
                <div className="step-number">1</div>
                <div>
                  <h3>Prise de contact</h3>
                  <p>Vous partagez vos coordonnées et la typologie de votre logement.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div>
                  <h3>Audit personnalisé</h3>
                  <p>Visite sur place ou visio pour cartographier les accès et besoins.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div>
                  <h3>Plan Verisure</h3>
                  <p>Proposition d’équipements Verisure pertinents, options conseillées ou non.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <div>
                  <h3>Restitution claire</h3>
                  <p>Compte rendu, budget estimatif et recommandations pour décider en confiance.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="role">
          <div className="container split">
            <div>
              <h2>Notre rôle : un service indépendant</h2>
              <p>
                Nous ne sommes pas affiliés à Verisure. Notre mission est d’analyser objectivement l’adéquation de leurs
                solutions avec votre situation.
              </p>
              <ul className="bullets">
                <li>Conseil neutre sur les équipements à conserver ou écarter</li>
                <li>Accompagnement administratif et RGPD si caméras</li>
                <li>Explications claires des options et abonnements</li>
              </ul>
            </div>
            <div className="highlight">
              <h3>Engagement transparence</h3>
              <p>Aucun coût pour l’étude. Vous restez libre de toute décision, sans pression commerciale.</p>
              <p className="mini-note">Nous travaillons sur rendez-vous pour garantir un temps d’écoute suffisant.</p>
            </div>
          </div>
        </section>

        <section className="section accent" id="contact">
          <div className="container form-wrapper">
            <div>
              <h2>Demander mon étude gratuite</h2>
              <p>Remplissez vos coordonnées. Un conseiller indépendant vous recontacte sous 24h.</p>
            </div>
            <form id="lead-form" className="card form-card" onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label htmlFor="fullName">Nom complet</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Nom et prénom"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="phone">Téléphone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="06 12 34 56 78"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="address">Adresse</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="N° et rue"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="city">Ville</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="Ville"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="postalCode">Code postal</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  placeholder="75000"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="consent">
                <input
                  type="checkbox"
                  id="consent"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="consent">J’accepte d’être contacté(e) pour la réalisation de l’étude de sécurité.</label>
              </div>
              <button type="submit" className="button primary full">
                Demander mon étude gratuite
              </button>
              <p id="form-status" className={`form-status ${status.type || ''}`} aria-live="polite">
                {status.message}
              </p>
            </form>
          </div>
        </section>

        <section className="section muted" id="rgpd">
          <div className="container split">
            <div>
              <h2>Confidentialité & RGPD</h2>
              <ul className="bullets">
                <li>Vos données sont utilisées uniquement pour organiser l’étude de sécurité.</li>
                <li>Aucune cession à des tiers non nécessaires à la mission.</li>
                <li>Conservation limitée au temps strictement utile à l’étude.</li>
                <li>Vous pouvez demander l’accès, la rectification ou la suppression à tout moment.</li>
              </ul>
            </div>
            <div className="card note-card">
              <h3>Points clés</h3>
              <p>
                Pour toute question sur la protection des données, écrivez à{' '}
                <a href="mailto:contact@etude-securite.fr">solutions.securite.fr@gmail.com</a>. Nous répondons sous 48h.
              </p>
            </div>
          </div>
        </section>

        <section className="section" id="disclaimer">
          <div className="container">
            <h2>Clause de non-affiliation</h2>
            <p className="disclaimer">
              Ce site est exploité par un conseiller indépendant. Il n’est pas affilié, approuvé ou sponsorisé par
              Verisure. Les marques citées appartiennent à leurs détenteurs respectifs et sont mentionnées uniquement à
              titre informatif.
            </p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-content">
          <div>
            <p className="brand">Conseiller Sécurité Indépendant</p>
            <p>Évaluations neutres des solutions Verisure pour les particuliers.</p>
          </div>
          <div className="footer-links">
            <a href="#hero">Haut de page</a>
            <a href="#rgpd">Confidentialité</a>
            <a href="#disclaimer">Clause de non-affiliation</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
