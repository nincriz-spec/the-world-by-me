
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import countries from "world-countries";
import "./CountryPage.css";

function getCountry(searchValue) {
  const value = decodeURIComponent(searchValue || "")
    .trim()
    .toLowerCase();

  return (
    countries.find((item) => {
      return (
        item.cca3.toLowerCase() === value ||
        item.name.common.toLowerCase() === value ||
        item.name.official.toLowerCase() === value
      );
    }) || null
  );
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

function GuideCards({ items, emptyMessage }) {
  if (!items || items.length === 0) {
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
                : "Open this guide to learn more about the destination."}
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

function CountryPage() {
  const { slug } = useParams();

  const [country, setCountry] = useState(null);
  const [guides, setGuides] = useState({});
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
      setGuides({});
      setError("");
      setGuideMessage("");

      const foundCountry = getCountry(slug);

      if (!foundCountry) {
        setError(
          "We couldn't find that country. Please check the spelling and try again."
        );
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
        area: foundCountry.area,
        landlocked: foundCountry.landlocked,
        flags: {
          svg: foundCountry.flags?.svg || "",
          alt:
            foundCountry.flags?.alt ||
            foundCountry.name.common + " flag"
        },
        languages: foundCountry.languages || {},
        currencies: foundCountry.currencies || {}
      };

      setCountry(countryData);
      setLoading(false);
      setGuideLoading(true);

      const name = foundCountry.name.common;

      const sections = [
        { key: "overview", query: name },
        { key: "places", query: name + " attractions" },
        { key: "activities", query: name + " activities things to do" },
        { key: "season", query: name + " climate weather when to go" },
        { key: "food", query: name + " food cuisine culture" },
        { key: "tips", query: name + " transportation travel tips" },
        { key: "budget", query: name + " travel costs budget accommodation" }
      ];

      const results = await Promise.allSettled(
        sections.map((section) => searchTravelGuides(section.query))
      );

      if (cancelled) return;

      const newGuides = {};
      let failedCount = 0;

      results.forEach((result, index) => {
        const key = sections[index].key;

        if (result.status === "fulfilled") {
          newGuides[key] = result.value;
        } else {
          newGuides[key] = [];
          failedCount += 1;
        }
      });

      setGuides(newGuides);

      if (failedCount === sections.length) {
        setGuideMessage(
          "Country facts loaded, but the travel guides are temporarily unavailable."
        );
      } else if (failedCount > 0) {
        setGuideMessage(
          "Some travel information could not be loaded. Try again later or use the external travel guide links."
        );
      }

      setGuideLoading(false);
    }

    loadCountry();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="country-page">
        <p className="country-loading">
          Discovering your destination...
        </p>
      </main>
    );
  }

  if (error || !country) {
    return (
      <main className="country-page country-error">
        <Link to="/" className="country-home-link">
          ← Back to home
        </Link>
        <h1>Let's find somewhere beautiful.</h1>
        <p>{error || "Country information is unavailable."}</p>
        <Link to="/" className="country-plan-button">
          Search again
        </Link>
      </main>
    );
  }

  const capital = country.capital.join(", ") || "Not available";

  const languages =
    Object.values(country.languages).join(", ") || "Not available";

  const currencies =
    Object.values(country.currencies)
      .map((currency) => currency.name)
      .join(", ") || "Not available";

  const area = country.area
    ? country.area.toLocaleString() + " km²"
    : "Not available";

  const budgetSearchUrl =
    "https://en.wikivoyage.org/wiki/Special:Search?search=" +
    encodeURIComponent(country.name.common + " travel costs budget");

  return (
    <div className="country-page">
      <nav className="country-nav">
        <Link to="/" className="country-logo">
          The World, by Me
        </Link>
        <Link to="/" className="country-home-link">
          ← Home
        </Link>
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
          Find beautiful places, local experiences, useful travel
          advice and inspiration for your next journey.
        </p>

        <Link
          to={
            "/plan-trip?destination=" +
            encodeURIComponent(country.name.common)
          }
          className="country-plan-button"
        >
          Plan a trip →
        </Link>
      </header>

      <main className="country-content">
        <section className="country-facts">
          <p className="country-eyebrow">GET TO KNOW THE COUNTRY</p>
          <h2>A little about {country.name.common}</h2>
          <p className="country-section-intro">
            Start with the essential facts before planning your visit.
          </p>

          <div className="country-facts-grid">
            <div>
              <span>Capital</span>
              <strong>{capital}</strong>
            </div>
            <div>
              <span>Region</span>
              <strong>{country.region || "Not available"}</strong>
            </div>
            <div>
              <span>Population</span>
              <strong>
                {country.population
                  ? country.population.toLocaleString()
                  : "Not available"}
              </strong>
            </div>
            <div>
              <span>Currency</span>
              <strong>{currencies}</strong>
            </div>
            <div>
              <span>Languages</span>
              <strong>{languages}</strong>
            </div>
            <div>
              <span>Land area</span>
              <strong>{area}</strong>
            </div>
          </div>
        </section>

        {guideMessage && (
          <p className="country-guide-message">{guideMessage}</p>
        )}

        {guideLoading && (
          <p className="country-guide-message">
            Gathering travel inspiration and practical guides...
          </p>
        )}

        <section className="country-guide-section">
          <p className="country-eyebrow">GET INSPIRED</p>
          <h2>Explore {country.name.common}</h2>
          <p className="country-section-intro">
            Start exploring with travel articles about the country.
          </p>
          <GuideCards
            items={guides.overview}
            emptyMessage="No general travel guides were found."
          />
          <p className="country-source-link">
            <a
              href={
                "https://en.wikivoyage.org/wiki/Special:Search?search=" +
                encodeURIComponent(country.name.common)
              }
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
            Find destination articles and ideas for places to explore.
          </p>
          <GuideCards
            items={guides.places}
            emptyMessage="No separate attraction guides were found. Try the general travel guides."
          />
        </section>

        <section className="country-guide-section">
          <p className="country-eyebrow">MAKE IT YOUR OWN</p>
          <h2>Things to do and experiences</h2>
          <p className="country-section-intro">
            Look for outdoor adventures, cultural experiences and
            activities for your trip.
          </p>
          <GuideCards
            items={guides.activities}
            emptyMessage="No separate activity guides were found."
          />
        </section>

        <section className="country-guide-section">
          <p className="country-eyebrow">PLAN AROUND THE SEASONS</p>
          <h2>Best time to visit</h2>
          <p className="country-section-intro">
            Climate and seasonal conditions vary by region. Check
            destination-specific guidance before choosing your dates.
          </p>
          <GuideCards
            items={guides.season}
            emptyMessage="Seasonal information was not found. Check the country's travel guides for climate advice."
          />
        </section>

        <section className="country-guide-section">
          <p className="country-eyebrow">TASTE SOMETHING NEW</p>
          <h2>Local food and culture</h2>
          <p className="country-section-intro">
            Discover local cuisine, customs and cultural experiences
            that can make your visit more memorable.
          </p>
          <GuideCards
            items={guides.food}
            emptyMessage="No specific food or culture guides were found."
          />
        </section>

        <section className="country-guide-section">
          <p className="country-eyebrow">TRAVEL WITH CONFIDENCE</p>
          <h2>Practical travel tips</h2>
          <p className="country-section-intro">
            Research transportation, local customs and other details
            before you leave.
          </p>
          <GuideCards
            items={guides.tips}
            emptyMessage="Practical travel articles were not found. Check official tourism and transport websites."
          />
        </section>

        <section className="country-budget-section">
          <p className="country-eyebrow">PLAN YOUR SPENDING</p>
          <h2>Travel budget and costs</h2>
          <p>
            Your total cost depends on accommodation, transport,
            meals, activities and the season. Compare budget,
            mid-range and higher-comfort options before booking.
          </p>

          <div className="country-budget-grid">
            <article>
              <h3>Budget travel</h3>
              <p>
                Consider hostels or simple stays, public transport,
                local eateries and free attractions.
              </p>
            </article>
            <article>
              <h3>Mid-range travel</h3>
              <p>
                Allow for private accommodation, a mix of local
                restaurants and paid experiences.
              </p>
            </article>
            <article>
              <h3>Comfort travel</h3>
              <p>
                Plan for higher-comfort hotels, convenient transport
                and more guided activities.
              </p>
            </article>
          </div>

          <p className="country-budget-note">
            These are planning categories, not country-specific
            price quotes. Check current prices before setting your
            final budget.
          </p>

          <p className="country-source-link">
            <a href={budgetSearchUrl} target="_blank" rel="noreferrer">
              Research {country.name.common} travel costs →
            </a>
          </p>

          <GuideCards
            items={guides.budget}
            emptyMessage="No dedicated budget guides were found. Research current accommodation, transport and meal prices before travelling."
          />
        </section>

        <section className="country-cta">
          <p className="country-eyebrow">YOUR STORY STARTS HERE</p>
          <h2>Ready to explore {country.name.common}?</h2>
          <p>
            Turn your inspiration into a trip you can look forward to.
          </p>
          <Link
            to={
              "/plan-trip?destination=" +
              encodeURIComponent(country.name.common)
            }
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
