
import { Link, useParams } from "react-router-dom";
import "./App.css";

const destinations = [
    { slug: "kyoto", name: "Kyoto", country: "Japan", description: "Tradition, temples and timeless beauty." },
    { slug: "bali", name: "Bali", country: "Indonesia", description: "Tropical escapes and island adventures." },
    { slug: "paris", name: "Paris", country: "France", description: "Romance, art and beautiful streets." },
    { slug: "rome", name: "Rome", country: "Italy", description: "Ancient history and Italian charm." },
    { slug: "seoul", name: "Seoul", country: "South Korea", description: "Modern culture, food and tradition." },
    { slug: "singapore", name: "Singapore", country: "Singapore", description: "City experiences and lush gardens." }
];

const activities = {
    kyoto: [
        { name: "Traditional Tea Ceremony", category: "Culture", duration: "1–2 hours", price: "Varies by venue", description: "Experience Japanese tea traditions in a peaceful setting." },
        { name: "Fushimi Inari Shrine Walk", category: "Sightseeing", duration: "2–3 hours", price: "Free entry", description: "Walk beneath the famous rows of red torii gates." },
        { name: "Arashiyama Bamboo Grove", category: "Nature", duration: "1–2 hours", price: "Free entry", description: "Explore one of Kyoto's most iconic bamboo paths." }
    ],
    bali: [
        { name: "Tegallalang Rice Terraces", category: "Nature", duration: "2–3 hours", price: "Entry fees may apply", description: "Admire Bali's beautiful green rice terraces." },
        { name: "Balinese Cooking Class", category: "Food", duration: "3–4 hours", price: "Varies by provider", description: "Discover local ingredients and learn traditional recipes." },
        { name: "Uluwatu Temple Visit", category: "Culture", duration: "2–3 hours", price: "Entry fees apply", description: "Visit a dramatic clifftop temple overlooking the ocean." }
    ],
    paris: [
        { name: "Eiffel Tower Visit", category: "Sightseeing", duration: "2–3 hours", price: "Ticket required", description: "Enjoy views across Paris from its iconic landmark." },
        { name: "Louvre Museum", category: "Art & Culture", duration: "3–4 hours", price: "Ticket required", description: "Explore world-famous art and historic collections." },
        { name: "Seine River Cruise", category: "Relaxation", duration: "1–2 hours", price: "Ticket required", description: "See Paris landmarks from the water." }
    ],
    rome: [
        { name: "Colosseum Tour", category: "History", duration: "2–3 hours", price: "Ticket required", description: "Discover the story of ancient Rome's famous amphitheatre." },
        { name: "Vatican Museums", category: "Art & Culture", duration: "3–4 hours", price: "Ticket required", description: "See remarkable art and historic collections." },
        { name: "Trastevere Food Walk", category: "Food", duration: "2–3 hours", price: "Varies by provider", description: "Explore a charming neighbourhood and its Italian food." }
    ],
    seoul: [
        { name: "Gyeongbokgung Palace", category: "History", duration: "2–3 hours", price: "Entry fees may apply", description: "Explore a grand royal palace and its grounds." },
        { name: "Korean Food Tour", category: "Food", duration: "2–3 hours", price: "Varies by provider", description: "Discover Korean favourites in local food spots." },
        { name: "Bukchon Hanok Village", category: "Culture", duration: "1–2 hours", price: "Check local access rules", description: "See traditional Korean architecture in a historic area." }
    ],
    singapore: [
        { name: "Gardens by the Bay", category: "Nature", duration: "2–4 hours", price: "Some areas require tickets", description: "Explore lush gardens and the iconic Supertrees." },
        { name: "Marina Bay Waterfront Walk", category: "Sightseeing", duration: "1–2 hours", price: "Free", description: "Enjoy skyline views and famous waterfront landmarks." },
        { name: "Hawker Food Experience", category: "Food", duration: "1–2 hours", price: "Pay for food", description: "Taste local favourites at a Singapore hawker centre." }
    ]
};

function ActivitiesPage() {
    const { slug } = useParams();
    const destination = destinations.find((place) => place.slug === slug);

    return (
           <div className="activities">
            <nav className="navbar">
                <Link to="/" className="logo">
                    The World, by Me
                </Link>

                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/destinations/kyoto">Explore</Link>
                    <Link to="/stories">Stories</Link>
                    <Link to="/plan-trip">Plan a Trip</Link>
                    <Link to="/activities">Activities</Link>
                    <Link to="/package-tours">Package Tour</Link>
                </div>
            </nav>

            <main className="activities-page">
                {!slug && (
                    <>
                        <p className="eyebrow">MAKE EVERY MOMENT COUNT</p>
                        <h1>Find Your Next Experience</h1>
                        <p className="activities-intro">
                            From cultural discoveries to unforgettable adventures,
                            find experiences that make each destination special.
                        </p>

                        <div className="activities-destination-grid">
                            {destinations.map((place) => (
                                <Link
                                    to={`/activities/${place.slug}`}
                                    className="activities-destination-card"
                                    key={place.slug}
                                >
                                    <span className="activities-card-label">
                                        {place.country}
                                    </span>
                                    <h2>{place.name}</h2>
                                    <p>{place.description}</p>
                                    <span className="activities-card-link">
                                        Explore activities →
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </>
                )}

                {slug && destination && (
                    <>
                        <Link to="/activities" className="activities-back">
                            ← All destinations
                        </Link>

                        <p className="eyebrow">EXPERIENCES IN {destination.country.toUpperCase()}</p>
                        <h1>Things to Do in {destination.name}</h1>
                        <p className="activities-intro">
                            Discover experiences and find inspiration for your next journey.
                        </p>

                        <div className="activity-grid">
                            {activities[slug].map((activity) => (
                                <article className="activity-card" key={activity.name}>
                                    <p className="activity-category">{activity.category}</p>
                                    <h2>{activity.name}</h2>
                                    <p className="activity-description">
                                        {activity.description}
                                    </p>
                                    <div className="activity-details">
                                        <p><strong>Duration:</strong> {activity.duration}</p>
                                        <p><strong>Cost:</strong> {activity.price}</p>
                                    </div>
                                </article>
                            ))}
                        </div>

                        <div className="activities-next-step">
                            <h2>Your journey starts here.</h2>
                            <p>Found something you love? You can use these ideas when we build your trip planner.</p>
                            <Link to="/" className="activities-home-link">
                                Back to Home
                            </Link>
                        </div>
                    </>
                )}

                {slug && !destination && (
                    <>
                        <h1>Destination not found</h1>
                        <p>Please choose a destination from our activities page.</p>
                        <Link to="/activities">Browse destinations</Link>
                    </>
                )}
            </main>

            <footer className="footer">
                <p>The World, by Me</p>
                <p>Your next chapter might begin somewhere beautiful.</p>
            </footer>
        </div>
    );
}

export default ActivitiesPage;
