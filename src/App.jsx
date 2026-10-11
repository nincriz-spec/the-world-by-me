import './index.css';
import "./App.css";
import { Link, Routes, Route } from "react-router-dom";
import DestinationPage from "./DestinationPage";

function HomePage()  {
  return (
    <div className="website">
      <nav className="navbar">
        <a href="#" className="logo">The World, by Me</a>

        <div className="nav-links">
          <a href="#destinations">Explore</a>
          <a href="#stories">Stories</a>
          <a href="#planner">Plan a Trip</a>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-content">
          <p className="eyebrow">A WORLD OF POSSIBILITIES</p>

          <h1>Somewhere beautiful is waiting.</h1>

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

          <div className="destination-grid">
            <Link to="/destinations/kyoto" className="destination-card kyoto">
              <h3>Kyoto, Japan</h3>
              <p>Tradition in every little detail.</p>
            </Link>

            <Link to="/destinations/bali" className="destination-card bali">
              <h3>Bali, Indonesia</h3>
              <p>Slow mornings and tropical escapes.</p>
            </Link>

            <Link to="/destinations/paris"  className="destination-card paris">
              <h3>Paris, France</h3>
              <p>Romance around every corner.</p>
            </Link>

           <Link to="/destinations/rome" className="destination-card rome">
              <h3>Rome, Italy</h3>
              <p>History, art, and unforgettable evenings.</p>
            </Link>

            <Link to="/destinations/seoul"  className="destination-card seoul">
              <h3>Seoul, South Korea</h3>
              <p>A vibrant city where tradition meets modern life.</p>
            </Link>

            <Link to="/destinations/singapore"  className="destination-card singapore">
              <h3>Singapore</h3>
              <p>A little island filled with extraordinary experiences.</p>
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

          <a href="#destinations" className="text-link">
            Find your destination →
          </a>
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
        <a href="#" className="logo">The World, by Me</a>
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
        path="/destinations/:slug"
        element={<DestinationPage />}
      />
    </Routes>
  );
}

export default App;