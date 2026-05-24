import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Car,
  CheckCircle2,
  Gauge,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  Sparkles,
  X,
  Zap
} from "lucide-react";
import "./styles.css";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const fetchJson = async (path) => {
  const response = await fetch(`${API_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Error al cargar ${path}`);
  }

  return response.json();
};

const formatNumber = (value) =>
  new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(value);

function useAurexData() {
  const [data, setData] = useState({
    brand: null,
    models: [],
    financing: [],
    accreditations: [],
    dealers: []
  });
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    Promise.all([
      fetchJson("/brand"),
      fetchJson("/models"),
      fetchJson("/financing"),
      fetchJson("/accreditations"),
      fetchJson("/dealers")
    ])
      .then(([brand, models, financing, accreditations, dealers]) => {
        if (!active) return;
        setData({ brand, models, financing, accreditations, dealers });
        setStatus("ready");
      })
      .catch(() => {
        if (!active) return;
        setStatus("error");
      });

    return () => {
      active = false;
    };
  }, []);

  return { ...data, status };
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    ["Modelos", "#modelos"],
    ["Compra", "#compra"],
    ["Acreditacion", "#acreditacion"],
    ["Concesionarios", "#concesionarios"]
  ];

  return (
    <header className="site-header">
      <a className="brand-lockup" href="#inicio" aria-label="Inicio AUREX">
        <img src="/assets/aurex-logo.svg" alt="Logo AUREX" />
        <span>AUREX</span>
      </a>

      <nav className={`nav-links ${open ? "is-open" : ""}`} aria-label="Navegacion principal">
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
      </nav>

      <a className="header-cta" href="#compra">
        <Banknote size={18} />
        Reservar
      </a>

      <button
        className="icon-button menu-button"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Cerrar menu" : "Abrir menu"}
        title={open ? "Cerrar menu" : "Abrir menu"}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
    </header>
  );
}

function Hero({ brand, primaryModel }) {
  return (
    <section id="inicio" className="hero-section">
      <div className="hero-bg" aria-hidden="true" />
      <img className="hero-car" src="/assets/hero-aurex.svg" alt="" aria-hidden="true" />
      <div className="hero-content">
        <p className="eyebrow">
          <Sparkles size={18} />
          Edicion fundacional 2026
        </p>
        <h1>AUREX</h1>
        <p className="hero-copy">
          {brand?.tagline ||
            "Ingenieria colombiana para la elite del alto rendimiento."}
        </p>
        <div className="hero-actions">
          <a className="primary-action" href="#modelos">
            <Car size={20} />
            Ver modelos
          </a>
          <a className="secondary-action" href="#concesionarios">
            <MapPin size={20} />
            Ubicaciones
          </a>
        </div>
      </div>

      <div className="hero-metrics" aria-label="Metricas destacadas">
        <div>
          <span>{primaryModel?.powerHp || 1040} HP</span>
          <small>Potencia maxima</small>
        </div>
        <div>
          <span>{primaryModel?.acceleration || "2.3 s"}</span>
          <small>0 a 100 km/h</small>
        </div>
        <div>
          <span>{primaryModel?.topSpeed || "356 km/h"}</span>
          <small>Velocidad tope</small>
        </div>
      </div>
    </section>
  );
}

function ModelCard({ model, selected, onSelect }) {
  return (
    <article className={`model-card ${selected ? "is-selected" : ""}`}>
      <button type="button" onClick={() => onSelect(model.id)} className="model-cover">
        <img src={model.image} alt={`AUREX ${model.name}`} />
        <span>{model.label}</span>
      </button>
      <div className="model-body">
        <div>
          <h3>{model.name}</h3>
          <p>{model.description}</p>
        </div>
        <div className="model-price">
          <span>{model.priceFormatted}</span>
          <small>Reserva desde {model.reservationFormatted}</small>
        </div>
        <div className="spec-grid">
          <span>
            <Gauge size={17} />
            {model.powerHp} HP
          </span>
          <span>
            <Zap size={17} />
            {model.acceleration}
          </span>
          <span>
            <ArrowRight size={17} />
            {model.topSpeed}
          </span>
        </div>
        <div className="color-row">
          {model.colors.map((color) => (
            <span key={color}>{color}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

function ModelsSection({ models }) {
  const [selectedId, setSelectedId] = useState(models[0]?.id);
  const selectedModel = models.find((model) => model.id === selectedId) || models[0];

  useEffect(() => {
    if (!selectedId && models[0]) {
      setSelectedId(models[0].id);
    }
  }, [models, selectedId]);

  return (
    <section id="modelos" className="section shell">
      <div className="section-heading compact">
        <p className="eyebrow dark">
          <Gauge size={18} />
          Gama de alto rendimiento
        </p>
        <h2>Modelos para calle, circuito y coleccion.</h2>
        <p>
          Tres configuraciones con identidad propia, fabricacion limitada y una experiencia de
          entrega hecha para Colombia.
        </p>
      </div>

      <div className="models-layout">
        <div className="model-stage">
          <img src={selectedModel?.image} alt={`Render del ${selectedModel?.name || "AUREX"}`} />
          <div className="stage-copy">
            <span>{selectedModel?.name}</span>
            <strong>{selectedModel?.priceFormatted}</strong>
          </div>
        </div>

        <div className="model-list">
          {models.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              selected={model.id === selectedModel?.id}
              onSelect={setSelectedId}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function PurchaseSection({ models, financing }) {
  const reservationTotal = models.reduce((sum, model) => sum + model.reservationCop, 0);

  return (
    <section id="compra" className="purchase-band">
      <div className="shell purchase-layout">
        <div className="section-heading">
          <p className="eyebrow">
            <Banknote size={18} />
            Compra y credito
          </p>
          <h2>Reserva, configura y financia tu AUREX.</h2>
          <p>
            El flujo comercial combina reserva digital, asesoria personalizada, estudio de credito y
            entrega en concesionario oficial.
          </p>
          <div className="purchase-summary">
            <span>{formatNumber(models.length)}</span>
            <small>modelos activos</small>
            <span>{formatNumber(reservationTotal)}</span>
            <small>COP en cupos de reserva base</small>
          </div>
        </div>

        <div className="finance-panel">
          {financing.map((plan) => (
            <article key={plan.id} className="finance-card">
              <div className="finance-icon">
                <Banknote size={22} />
              </div>
              <div>
                <h3>{plan.name}</h3>
                <p>{plan.detail}</p>
              </div>
              <dl>
                <div>
                  <dt>Inicial</dt>
                  <dd>{plan.downPayment}</dd>
                </div>
                <div>
                  <dt>Plazo</dt>
                  <dd>{plan.termMonths} meses</dd>
                </div>
                <div>
                  <dt>Tasa</dt>
                  <dd>{plan.rate}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AccreditationSection({ brand, accreditations }) {
  return (
    <section id="acreditacion" className="section shell accreditation-section">
      <div className="section-heading compact">
        <p className="eyebrow dark">
          <ShieldCheck size={18} />
          Acreditacion y confianza
        </p>
        <h2>Lujo validado por procesos, garantia y trazabilidad.</h2>
        <p>{brand?.warranty}</p>
      </div>

      <div className="accreditation-grid">
        {accreditations.map((item) => (
          <article key={item.title} className="accreditation-card">
            <BadgeCheck size={24} />
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ColombiaMap({ dealers, selectedId, onSelect }) {
  const bounds = {
    minLat: -4.3,
    maxLat: 12.7,
    minLng: -81.8,
    maxLng: -66.8
  };

  const points = useMemo(
    () =>
      dealers.map((dealer) => ({
        ...dealer,
        x: ((dealer.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100,
        y: 100 - ((dealer.lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 100
      })),
    [dealers]
  );

  return (
    <div className="map-panel" aria-label="Mapa de concesionarios AUREX en Colombia">
      <svg viewBox="0 0 620 720" role="img" aria-label="Mapa estilizado de Colombia">
        <defs>
          <linearGradient id="mapGradient" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#1b2e34" />
            <stop offset="100%" stopColor="#395e56" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          className="colombia-shape"
          d="M260 28 L333 58 L372 110 L438 120 L478 168 L450 235 L507 286 L487 354 L535 427 L495 496 L426 510 L382 584 L309 678 L248 650 L230 570 L165 533 L134 461 L93 424 L118 338 L91 278 L142 214 L130 145 L194 96 Z"
        />
        <path
          className="map-river"
          d="M308 78 C280 160 314 220 286 284 C252 362 285 430 258 522 C248 556 255 606 290 650"
        />
        {points.map((point) => (
          <g
            key={point.id}
            transform={`translate(${80 + point.x * 4.4} ${50 + point.y * 6.1})`}
            className={point.id === selectedId ? "map-marker is-selected" : "map-marker"}
            onClick={() => onSelect(point.id)}
            tabIndex="0"
            role="button"
            aria-label={`Seleccionar concesionario ${point.city}`}
          >
            <circle r="16" />
            <circle r="5" />
            <text x="24" y="5">
              {point.city}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function DealersSection({ dealers }) {
  const [selectedId, setSelectedId] = useState(dealers[0]?.id);
  const selectedDealer = dealers.find((dealer) => dealer.id === selectedId) || dealers[0];

  useEffect(() => {
    if (!selectedId && dealers[0]) {
      setSelectedId(dealers[0].id);
    }
  }, [dealers, selectedId]);

  return (
    <section id="concesionarios" className="section shell dealers-section">
      <div className="section-heading compact">
        <p className="eyebrow dark">
          <MapPin size={18} />
          Concesionarios en Colombia
        </p>
        <h2>Showrooms oficiales en las ciudades clave.</h2>
        <p>
          Selecciona una ciudad para ver datos de contacto, servicios disponibles y cobertura
          comercial.
        </p>
      </div>

      <div className="dealers-layout">
        <ColombiaMap dealers={dealers} selectedId={selectedDealer?.id} onSelect={setSelectedId} />

        <div className="dealer-panel">
          <div className="dealer-detail">
            <span>{selectedDealer?.city}</span>
            <h3>{selectedDealer?.name}</h3>
            <p>{selectedDealer?.address}</p>
            <a href={`tel:${selectedDealer?.phone}`} className="phone-link">
              <Phone size={18} />
              {selectedDealer?.phone}
            </a>
            <div className="service-tags">
              {selectedDealer?.services.map((service) => (
                <span key={service}>
                  <CheckCircle2 size={16} />
                  {service}
                </span>
              ))}
            </div>
          </div>

          <div className="dealer-list" aria-label="Listado de concesionarios">
            {dealers.map((dealer) => (
              <button
                key={dealer.id}
                type="button"
                className={dealer.id === selectedDealer?.id ? "is-active" : ""}
                onClick={() => setSelectedId(dealer.id)}
              >
                <MapPin size={17} />
                {dealer.city}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ brand }) {
  return (
    <footer className="site-footer">
      <div className="shell footer-layout">
        <div>
          <img src="/assets/aurex-logo.svg" alt="Logo AUREX" />
          <p>
            {brand?.legalName || "AUREX Hypercars S.A.S."} crea una marca ficticia para fines
            academicos, con identidad, catalogo, credito y red comercial simulada.
          </p>
        </div>
        <div>
          <strong>Backend</strong>
          <span>API REST Express</span>
          <span>Endpoints /api</span>
          <span>Healthcheck incluido</span>
        </div>
        <div>
          <strong>Frontend</strong>
          <span>React + Vite</span>
          <span>Diseno responsive</span>
          <span>Assets propios</span>
        </div>
      </div>
    </footer>
  );
}

function LoadingState() {
  return (
    <main className="loading-screen">
      <img src="/assets/aurex-logo.svg" alt="Logo AUREX" />
      <span>Cargando experiencia AUREX</span>
    </main>
  );
}

function ErrorState() {
  return (
    <main className="loading-screen">
      <img src="/assets/aurex-logo.svg" alt="Logo AUREX" />
      <span>No se pudo conectar con la API. Verifica que el backend este activo.</span>
    </main>
  );
}

function App() {
  const { brand, models, financing, accreditations, dealers, status } = useAurexData();

  if (status === "loading") return <LoadingState />;
  if (status === "error") return <ErrorState />;

  return (
    <>
      <Header />
      <main>
        <Hero brand={brand} primaryModel={models[1] || models[0]} />
        <ModelsSection models={models} />
        <PurchaseSection models={models} financing={financing} />
        <AccreditationSection brand={brand} accreditations={accreditations} />
        <DealersSection dealers={dealers} />
      </main>
      <Footer brand={brand} />
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
