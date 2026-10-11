import { Link, useParams } from "react-router-dom";

const destinations = {
  kyoto: {
    name: "Kyoto",
    country: "Japan",
    subtitle: "Where tradition meets quiet beauty.",
    description:
      "Wander through peaceful bamboo groves, discover ancient temples, and experience the timeless charm of Japan's cultural heart.",
    bestTime: "March–May and October–November",
    experiences: "Temple visits, bamboo forests, traditional tea houses"
  },
  bali: {
    name: "Bali",
    country: "Indonesia",
    subtitle: "A little island, a world of wonder.",
    description:
      "Find your own rhythm among tropical beaches, lush rice terraces, beautiful sunsets, and peaceful island retreats.",
    bestTime: "April–October",
    experiences: "Beach sunsets, rice terraces, waterfalls"
  },
  paris: {
    name: "Paris",
    country: "France",
    subtitle: "For the moments that feel like a movie.",
    description:
      "Spend slow mornings in charming cafés, admire elegant architecture, and discover the romance hidden in every Parisian street.",
    bestTime: "April–June and September–October",
    experiences: "Cafés, art museums, riverside walks"
  },
  rome: {
    name: "Rome",
    country: "Italy",
    subtitle: "A beautiful story written in history.",
    description:
      "Explore ancient landmarks, enjoy long Italian meals, and lose yourself in cobblestone streets filled with character.",
    bestTime: "April–May and September–October",
    experiences: "Historic landmarks, Italian food, piazzas"
  },
  seoul: {
    name: "Seoul",
    country: "South Korea",
    subtitle: "Where old-world charm meets new energy.",
    description:
      "Discover traditional palaces, stylish neighbourhoods, bustling markets, and the creative energy of modern Korea.",
    bestTime: "April–May and September–November",
    experiences: "Palaces, street food, shopping"
  },
  singapore: {
    name: "Singapore",
    country: "Singapore",
    subtitle: "A little city with endless discoveries.",
    description:
      "Enjoy a vibrant mix of gardens, waterfront views, incredible food, and contemporary city life in one compact destination.",
    bestTime: "February–April",
    experiences: "Gardens, hawker food, waterfront attractions"
  }
};

function DestinationPage() {
  const { slug } = useParams();
  const destination = destinations[slug];

  if (!destination) {
    return (
      <main className="destination-detail">
        <h1>Destination not found</h1>
        <Link to="/">Return to homepage</Link>
      </main>
    );
  }

  return (
    <main className="destination-detail">
      <Link to="/" className="back-link">
        ← Back to homepage
      </Link>

      <section className={`destination-card destination-detail-hero ${slug}`}>
        <div className="destination-detail-overlay">
          <p className="destination-country">{destination.country}</p>
          <h1>{destination.name}</h1>
          <p>{destination.subtitle}</p>
        </div>
      </section>

      <section className="destination-description">
        <p className="section-eyebrow">YOUR NEXT CHAPTER</p>
        <h2>Discover {destination.name}</h2>
        <p>{destination.description}</p>

        <div className="destination-facts">
          <div>
            <h3>Best time to visit</h3>
            <p>{destination.bestTime}</p>
          </div>

          <div>
            <h3>Don't miss</h3>
            <p>{destination.experiences}</p>
          </div>
        </div>

        <Link to="/" className="destination-home-link">
          Explore more destinations
        </Link>
      </section>
    </main>
  );
}

export default DestinationPage;