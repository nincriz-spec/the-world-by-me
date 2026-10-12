
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import countries from "world-countries";
import "./CountryPage.css";

function getCountry(searchValue) {
  const value = decodeURIComponent(searchValue || "").trim().toLowerCase();

  return countries.find((item) => {
    return (
      item.cca3.toLowerCase() === value ||
      item.name.common.toLowerCase() === value ||
      item.name.official.toLowerCase() === value
    );
  }) || null;
}

async function searchTravelGuides(searchTerm) {
  const url =
    "https://en.wikivoyage.org/w/api.php" +
    "?action=query&generator=search&gsrnamespace=0&gsrlimit=6" +
    "&prop=extracts%7Cpageimages&exintro=1&explaintext=1" +
    "&piprop=thumbnail&pithumbsize=600&format=json&origin=*" +
    "&gsrsearch=" + encodeURIComponent(searchTerm);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Travel guides could not be loaded.");
  }

  const data = await response.json();

  if (!data.query || !data.query.pages) {
    return [];
  }

  return Object.values(data.query.pages);
}

function CountryPage() {
  const { slug } = useParams();

  const [country, setCountry] = useState(null);
  const [overview, setOverview] = useState([]);
  const [places, setPlaces] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guideLoading, setGuideLoading] = useState(false);
  const [error, setError] = useState("");
  const [guideMessage, setGuideMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCountry() {
      setLoading(true);
      setGuideLoading(false);
      setCountry(null);
      setOverview([]);
      setPlaces([]);
      setActivities([]);
      setError("");
      setGuideMessage("");

      const foundCountry = getCountry(slug);

      if (!foundCountry) {
        setError("We couldn't find that country. Please check the spelling and try again.");
        setLoading(false);
        return;
      }

      const countryData = {
        name: foundCountry.name,
        cca3: foundCountry.cca3,
        capital: foundCountry.capital || [],
        region: foundCountry.region || "",
        subregion: foundCountry.subregion || "",
        population: foundCountry.population,
        flags: {
          svg: foundCountry.flags?.svg || "",
          alt: foundCountry.flags?.alt || foundCountry.name.common + " flag"
        },
        languages: foundCountry.languages || {},
        currencies: foundCountry.currencies || {}
      };

      setCountry(countryData);
      setLoading(false);
      setGuideLoading(true);

      try {
        const countryName = foundCountry.name.common;

        const results = await Promise.allSettled([
          searchTravelGuides(countryName),
          searchTravelGuides(countryName + " attractions"),
          searchTravelGuides(countryName + " things to do")
        ]);

        if (cancelled) return;

        if (results[0].status === "fulfilled") {
          setOverview(results[0].value);
        }

        if (results[1].status === "fulfilled") {
          setPlaces(results[1].value);
        }

        if (results[2].status === "fulfilled") {
          setActivities(results[2].value);
        }

        if (results.every((result) => result.status === "rejected")) {
          setGuideMessage("Country information loaded, but travel guides are temporarily unavailable.");
        } else if (results.some((result) => result.status === "rejected")) {
          setGuideMessage("Some travel guides could not be loaded. You can use the links below to explore.");
        }
      } catch {
        if (!cancelled) {
          setGuideMessage("Travel guides are temporarily unavailable.");
        }
      } finally {
        if (!cancelled) {
          setGuideLoading(false);
        }
      }
    }

    loadCountry();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  function renderGuideCards(items, emptyMessage) {
    if (items.length === 0) {
      return <p className="country-empty">{emptyMessage}</p>;
    }

    return (
      <div className="country-guide-grid">
        {items.map((item) => (
          <article className="country-guide-card" key={item.pageid}>
            {item.thumbnail && (
              <img
                src={item.thumbnail.source}
                alt={item.title}
                loading="lazy"
              />
            )}

            <div className="country-guide-card-content">
              <h3>{item.title}</h3>
              <p>
                {item.extract
                  ? item.extract.slice(0, 300) +
                    (item.extract.length > 300 ? "…" : "")
                  : "Open this travel guide to learn more about this destination."}
              </p>

              <a
                href={
                  "https://en.wikivoyage.org/wiki/" +
                  encodeURIComponent(item.title.replace(/ /g, "_"))
                }
                target="_blank"
                rel="noreferrer"
              >
                Read travel guide →
              </a>
            </div>
          </article>
        ))}
      </div>
    );
  }

  if (loading) {
    return (
      <main className="country-page">
        <p>Discovering your destination...</p>
      </main>
    );
  }

  if (error || !country) {
    return (
      <main className="country-page country-error">
        <Link to="/" className="country-home-link">← Back to home</Link>
        <h1>Let's find somewhere beautiful.</h1>
        <p>{error || "Country information is unavailable."}</p>
        <Link to="/" className="country-plan-button">Search again</Link>
      </main>
    );
  }

  const capital = country.capital.join(", ") || "Not available";
  const languages = Object.values(country.languages).join(", ") || "Not available";
  const currencies = Object.values(country.currencies)
    .map((currency) => currency.name)
    .join(", ") || "Not available";

  return (
    <div className="country-page">
      <nav className="country-nav">
        <Link to="/" className="country-logo">The World, by Me</Link>
        <Link to="/" className="country-home-link">← Home</Link>
      </nav>

      <header className="country-hero">
        {country.flags.svg && (
          <img
            className="country-flag"
            src={country.flags.svg}
            alt={country.flags.alt}
          />
        )}

        <p className="country-eyebrow">YOUR NEXT ADVENTURE</p>
        <h1>Discover {country.name.common}</h1>
        <p>
          Find places to visit, travel inspiration and things to do
          in {country.name.common}.
        </p>

        <Link
          to={"/plan-trip?destination=" + encodeURIComponent(country.name.common)}
          className="country-plan-button"
        >
          Plan a trip →
        </Link>
      </header>

      <main className="country-content">
        <section className="country-facts">
          <h2>A little about {country.name.common}</h2>

          <div className="country-facts-grid">
            <div><span>Capital</span><strong>{capital}</strong></div>
            <div><span>Region</span><strong>{country.region || "Not available"}</strong></div>
            <div>
              <span>Population</span>
              <strong>{country.population?.toLocaleString() || "Not available"}</strong>
            </div>
            <div><span>Currency</span><strong>{currencies}</strong></div>
            <div><span>Languages</span><strong>{languages}</strong></div>
            <div><span>Subregion</span><strong>{country.subregion || "Not available"}</strong></div>
          </div>
        </section>

        {guideMessage && <p className="country-guide-message">{guideMessage}</p>}
        {guideLoading && (
          <p className="country-guide-message">Finding travel guides and things to explore...</p>
        )}

        <section className="country-guide-section">
          <p className="country-eyebrow">GET INSPIRED</p>
          <h2>Explore {country.name.common}</h2>
          <p className="country-section-intro">
            Travel guides and destination ideas from Wikivoyage.
          </p>
          {renderGuideCards(overview, "No general travel guides were found. Try the country travel guide link below.")}
          <p className="country-source-link">
            <a
              href={"https://en.wikivoyage.org/wiki/Special:Search?search=" + encodeURIComponent(country.name.common)}
              target="_blank"
              rel="noreferrer"
            >
              Browse all {country.name.common} travel guides →
            </a>
          </p>
        </section>

        <section className="country-guide-section">
          <p className="country-eyebrow">PLACES TO DISCOVER</p>
          <h2>Tourist destinations</h2>
          <p className="country-section-intro">
            Explore travel articles related to attractions and destinations.
          </p>
          {renderGuideCards(places, "No separate attraction guides were found. Browse the country's travel guide for more ideas.")}
        </section>

        <section className="country-guide-section">
          <p className="country-eyebrow">MAKE IT YOUR OWN</p>
          <h2>Activities and experiences</h2>
          <p className="country-section-intro">
            Discover travel articles that may help you find activities, outdoor adventures and local experiences.
          </p>
          {renderGuideCards(activities, "No separate activity guides were found. Check the general travel guides for ideas.")}
        </section>

        <section className="country-cta">
          <p className="country-eyebrow">YOUR STORY STARTS HERE</p>
          <h2>Ready to explore {country.name.common}?</h2>
          <p>Save your inspiration for the next step of your journey.</p>
          <Link
            to={"/plan-trip?destination=" + encodeURIComponent(country.name.common)}
            className="country-plan-button"
          >
            Start planning →
          </Link>
        </section>
      </main>

      <footer className="country-footer">
        The World, by Me · Find a place that stays with you.
      </footer>
    </div>
  );
}

export default CountryPage;
