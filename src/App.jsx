
import "./App.css";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import allCountries from "world-countries";

import DestinationPage from "./DestinationPage";
import ActivitiesPage from "./ActivitiesPage";
import PlanTripPage from "./PlanTripPage";
import PackageTours from "./PackageTours";
import StoriesPage from "./StoriesPage";
import CountryPage from "./CountryPage";

const destinationSuggestions = [
  { name: "Kyoto", country: "Japan" },
  { name: "Bali", country: "Indonesia" },
  { name: "Paris", country: "France" },
  { name: "Rome", country: "Italy" },
  { name: "Seoul", country: "South Korea" },
  { name: "Singapore", country: "Singapore" },
  { name: "Bangkok", country: "Thailand" },
  { name: "Phuket", country: "Thailand" },
  { name: "Lucerne", country: "Switzerland" },
  { name: "Interlaken", country: "Switzerland" },
  { name: "Sydney", country: "Australia" },
  { name: "London", country: "United Kingdom" },
  { name: "New York", country: "United States" },
  { name: "Dubai", country: "United Arab Emirates" },
  { name: "Barcelona", country: "Spain" }
];

function DestinationSearch() {
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();

  // Get country information locally instead of using the old API.
  const countries = allCountries.map((item) => ({
    name: item.name,
    cca3: item.cca3,
    region: item.region,
    flags: {
      emoji: item.flag || "",
      svg: item.flags?.svg || ""
    }
  }));

  const searchText = search.trim().toLowerCase();

  const matchingCountries = searchText
    ? countries.filter((country) => {
        return (
          country.name.common.toLowerCase().includes(searchText) ||
          country.name.official.toLowerCase().includes(searchText)
        );
      })
    : [];

  const matchingDestinations = searchText
    ? destinationSuggestions.filter((destination) => {
        const fullName =
          destination.name + " " + destination.country;

        return fullName.toLowerCase().includes(searchText);
      })
    : [];

  function chooseCountry(country) {
    if (!country || !country.cca3) {
      return;
    }

    setShowSuggestions(false);
    navigate("/country/" + country.cca3.toLowerCase());
  }

  function findCountryByName(countryName) {
    const name = countryName.trim().toLowerCase();

    return countries.find((country) => {
      return (
        country.name.common.toLowerCase() === name ||
        country.name.official.toLowerCase() === name
      );
    });
  }

  // A city search opens the guide for its associated country.
  function chooseDestination(destination) {
    const country = findCountryByName(destination.country);

    if (country) {
      chooseCountry(country);
    } else {
      setSearch(destination.country);
      setShowSuggestions(true);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    const text = search.trim().toLowerCase();

    if (!text) {
      return;
    }

    // First, find an exact country name.
    const exactCountry = findCountryByName(search);

    if (exactCountry) {
      chooseCountry(exactCountry);
      return;
    }

    // Next, find an exact city or "City, Country" search.
    const exactDestination = destinationSuggestions.find(
      (destination) => {
        return (
          destination.name.toLowerCase() === text ||
          (
            destination.name + ", " + destination.country
          ).toLowerCase() === text
        );
      }
    );

    if (exactDestination) {
      chooseDestination(exactDestination);
      return;
    }

    // Finally, try a partial country-name match.
    const partialCountry = countries.find((country) => {
      return (
        country.name.common.toLowerCase().startsWith(text) ||
        country.name.official.toLowerCase().startsWith(text)
      );
    });

    if (partialCountry) {
      chooseCountry(partialCountry);
      return;
    }

    // Keep unrecognised searches on the homepage.
    setShowSuggestions(true);
  }

  return (
    <div className="destination-search">
      <form
        onSubmit={handleSubmit}
        className="destination-search-form"
      >
        <input
          type="text"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search any country or destination..."
          aria-label="Search countries and destinations"
          autoComplete="off"
        />

        <button type="submit">Search</button>
      </form>

      {showSuggestions && searchText !== "" && (
        <div className="destination-suggestions">
          {matchingCountries.slice(0, 5).map((country) => (
            <button
              type="button"
              key={country.cca3}
              onClick={() => chooseCountry(country)}
              className="destination-suggestion"
            >
              <span>
                {country.flags.emoji} {country.name.common}
              </span>
              <span>{country.region || "Country"}</span>
            </button>
          ))}

          {matchingDestinations.slice(0, 3).map(
            (destination) => (
              <button
                type="button"
                key={destination.name + destination.country}
                onClick={() => chooseDestination(destination)}
                className="destination-suggestion"
              >
                <span>{destination.name}</span>
                <span>{destination.country}</span>
              </button>
            )
          )}

          {matchingCountries.length === 0 &&
            matchingDestinations.length === 0 && (
              <p className="destination-search-hint">
                No suggestions found. Check the spelling or try
                another country name.
              </p>
            )}
        </div>
      )}
    </div>
  );
}

function HomePage() {
  return (
    <div className="website">
      <nav className="navbar">
        <Link to="/" className="logo">
          The World, by Me
        </Link>

        <div className="nav-links">
          <a href="#destinations">Explore</a>
          <Link to="/stories">Stories</Link>
          <Link to="/plan-trip">Plan a Trip</Link>
          <Link to="/activities">Activities</Link>
          <Link to="/package-tours">Package Tours</Link>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-content">
          <p className="hero-tagline">
            TRAVEL · DISCOVER · BEGIN AGAIN
          </p>

          <h1>
            Your next chapter might begin somewhere beautiful
          </h1>

          <p className="hero-description">
            Discover inspiring destinations, thoughtful travel guides,
            and little places that stay with you long after you leave.
          </p>

          <a href="#destinations" className="hero-button">
            Explore the world
          </a>
        </div>
      </header>

      <main>
        <section id="destinations" className="section">
          <p className="eyebrow">YOUR NEXT ADVENTURE</p>
          <h2>Where will your story take you?</h2>

          <p className="section-description">
            From sunlit coastlines to cities filled with culture,
            discover places worth dreaming about.
          </p>

          <DestinationSearch />

          <div className="destination-grid">
            <Link
              to="/destinations/kyoto"
              className="destination-card kyoto"
            >
              <h3>Kyoto, Japan</h3>
              <p>Tradition in every little detail.</p>
            </Link>

            <Link
              to="/destinations/bali"
              className="destination-card bali"
            >
              <h3>Bali, Indonesia</h3>
              <p>Slow mornings and tropical escapes.</p>
            </Link>

            <Link
              to="/destinations/paris"
              className="destination-card paris"
            >
              <h3>Paris, France</h3>
              <p>Romance around every corner.</p>
            </Link>

            <Link
              to="/destinations/rome"
              className="destination-card rome"
            >
              <h3>Rome, Italy</h3>
              <p>History, art, and unforgettable evenings.</p>
            </Link>

            <Link
              to="/destinations/seoul"
              className="destination-card seoul"
            >
              <h3>Seoul, South Korea</h3>
              <p>
                A vibrant city where tradition meets modern life.
              </p>
            </Link>

            <Link
              to="/destinations/singapore"
              className="destination-card singapore"
            >
              <h3>Singapore</h3>
              <p>
                A little island filled with extraordinary experiences.
              </p>
            </Link>
          </div>
        </section>

        <section id="planner" className="planner-section">
          <p className="eyebrow">MAKE IT HAPPEN</p>
          <h2>Dream it. Plan it. Go.</h2>

          <p>
            Turn your travel inspiration into a real itinerary.
            Your next chapter starts with a plan.
          </p>

          <Link to="/plan-trip" className="text-link">
            Start planning your trip →
          </Link>
        </section>

        <section id="stories" className="section story-section">
          <p className="eyebrow">NOT JUST PLACES, BUT FEELINGS</p>
          <h2>A world of stories, waiting to be lived.</h2>

          <p className="section-description">
            Every journey means something different to each of us.
            Find inspiration, discover somewhere new, and create
            memories that are yours to keep.
          </p>
        </section>
      </main>

      <footer className="footer">
        <Link to="/" className="logo">
          The World, by Me
        </Link>

        <p>Your next chapter might begin somewhere beautiful.</p>
        <p>© 2026 The World, by Me</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route
        path="/country/:slug"
        element={<CountryPage />}
      />

      <Route
        path="/destinations/:slug"
        element={<DestinationPage />}
      />

      <Route
        path="/activities"
        element={<ActivitiesPage />}
      />

      <Route
        path="/activities/:slug"
        element={<ActivitiesPage />}
      />

      <Route
        path="/plan-trip"
        element={<PlanTripPage />}
      />

      <Route
        path="/package-tours"
        element={<PackageTours />}
      />

      <Route
        path="/stories"
        element={<StoriesPage />}
      />
    </Routes>
  );
}

export default App;
