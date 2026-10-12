
import { Link, useParams } from "react-router-dom";

const destinations = {
  kyoto: {
    name: "Kyoto",
    country: "Japan",
    subtitle: "Where tradition meets quiet beauty.",
    description:
      "Wander through peaceful bamboo groves, discover ancient temples, and experience the timeless charm of Japan's cultural heart.",
    bestTime: "March–May and October–November",
    experiences: "Temple visits, bamboo forests, traditional tea houses",
    highlights: [
      {
        name: "Arashiyama Bamboo Grove",
        description: "Walk among towering bamboo and enjoy a peaceful natural escape."
      },
      {
        name: "Fushimi Inari Shrine",
        description: "Discover the famous pathways lined with thousands of red torii gates."
      },
      {
        name: "Kiyomizu-dera",
        description: "Admire historic temple architecture and views across Kyoto."
      }
    ]
  },
  bali: {
    name: "Bali",
    country: "Indonesia",
    subtitle: "A little island, a world of wonder.",
    description:
      "Find your own rhythm among tropical beaches, lush rice terraces, beautiful sunsets, and peaceful island retreats.",
    bestTime: "April–October",
    experiences: "Beach sunsets, rice terraces, waterfalls",
    highlights: [
      {
        name: "Ubud",
        description: "Explore art, local culture, and the lush scenery of Bali's interior."
      },
      {
        name: "Tegallalang Rice Terraces",
        description: "Take in the island's iconic green terraced landscapes."
      },
      {
        name: "Uluwatu",
        description: "Enjoy dramatic coastal cliffs and beautiful ocean views."
      }
    ]
  },
  paris: {
    name: "Paris",
    country: "France",
    subtitle: "For the moments that feel like a movie.",
    description:
      "Spend slow mornings in charming cafés, admire elegant architecture, and discover the romance hidden in every Parisian street.",
    bestTime: "April–June and September–October",
    experiences: "Cafés, art museums, riverside walks",
    highlights: [
      {
        name: "Eiffel Tower",
        description: "See one of the world's most recognisable landmarks."
      },
      {
        name: "Louvre Museum",
        description: "Explore an extraordinary collection of art and history."
      },
      {
        name: "Montmartre",
        description: "Wander through artistic streets, cafés, and charming squares."
      }
    ]
  },
  rome: {
    name: "Rome",
    country: "Italy",
    subtitle: "A beautiful story written in history.",
    description:
      "Explore ancient landmarks, enjoy long Italian meals, and lose yourself in cobblestone streets filled with character.",
    bestTime: "April–May and September–October",
    experiences: "Historic landmarks, Italian food, piazzas",
    highlights: [
      {
        name: "Colosseum",
        description: "Discover the history of Rome's famous ancient amphitheatre."
      },
      {
        name: "Trevi Fountain",
        description: "Visit the celebrated fountain in the heart of the city."
      },
      {
        name: "Trastevere",
        description: "Enjoy atmospheric streets, restaurants, and neighbourhood life."
      }
    ]
  },
  seoul: {
    name: "Seoul",
    country: "South Korea",
    subtitle: "Where old-world charm meets new energy.",
    description:
      "Discover traditional palaces, stylish neighbourhoods, bustling markets, and the creative energy of modern Korea.",
    bestTime: "April–May and September–November",
    experiences: "Palaces, street food, shopping",
    highlights: [
      {
        name: "Gyeongbokgung Palace",
        description: "Explore traditional Korean palace architecture and grounds."
      },
      {
        name: "Bukchon Hanok Village",
        description: "See traditional Korean houses in a historic neighbourhood."
      },
      {
        name: "Myeongdong",
        description: "Browse popular shopping streets and sample Korean street food."
      }
    ]
  },
  singapore: {
    name: "Singapore",
    country: "Singapore",
    subtitle: "A little city with endless discoveries.",
    description:
      "Enjoy a vibrant mix of gardens, waterfront views, incredible food, and contemporary city life in one compact destination.",
    bestTime: "February–April",
    experiences: "Gardens, hawker food, waterfront attractions",
    highlights: [
      {
        name: "Gardens by the Bay",
        description: "Discover striking gardens and the famous Supertree structures."
      },
      {
        name: "Marina Bay",
        description: "Enjoy waterfront walks and views of the city skyline."
      },
      {
        name: "Chinatown",
        description: "Explore heritage streets, local food, and cultural landmarks."
      }
    ]
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
          <Link to="/plan-trip" className="destination-plan-button">
            Plan Your Trip
          </Link>
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
            <h3>Experiences to enjoy</h3>
            <p>{destination.experiences}</p>
          </div>
        </div>
      </section>

      <section className="destination-highlights">
        <p className="section-eyebrow">PLACES TO EXPLORE</p>
        <h2>Discover the highlights of {destination.name}</h2>

        <div className="destination-highlights-grid">
          {destination.highlights.map((place) => (
            <article className="destination-highlight-card" key={place.name}>
              <h3>{place.name}</h3>
              <p>{place.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="destination-next-step">
        <h2>Your next adventure starts here.</h2>
        <p>Turn your inspiration into a journey of your own.</p>
        <Link to="/plan-trip" className="destination-plan-button">
          Start Planning
        </Link>
        <p>
          <Link to="/" className="destination-home-link">
            Explore more destinations
          </Link>
        </p>
      </section>
    </main>
  );
}

export default DestinationPage;
