
import { useState } from "react";
import { Link } from "react-router-dom";
import "./StoriesPage.css";

const stories = [
  {
    id: 1,
    category: "Destinations",
    title: "A Quiet Morning in Kyoto",
    location: "Kyoto, Japan",
    description:
      "Discover traditional streets, peaceful temples and the beauty of slowing down in Japan.",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80",
    destinationLink: "/destinations/kyoto",
    readTime: "5 min read"
  },
  {
    id: 2,
    category: "Personal Journeys",
    title: "Learning to Travel at My Own Pace",
    location: "A journey of discovery",
    description:
      "A reminder that meaningful journeys are not about seeing everything, but enjoying every moment.",
    image:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1000&q=80",
    destinationLink: "/plan-trip",
    readTime: "4 min read"
  },
  {
    id: 3,
    category: "Travel Tips",
    title: "How to Plan a Holiday on a Budget",
    location: "Your next adventure",
    description:
      "Simple ways to organise your travel budget, compare options and make your money go further.",
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80",
    destinationLink: "/plan-trip",
    readTime: "6 min read"
  },
  {
    id: 4,
    category: "Hidden Gems",
    title: "Little Corners of Bali Worth Discovering",
    location: "Bali, Indonesia",
    description:
      "Look beyond the familiar and discover scenic landscapes, local neighbourhoods and slower days.",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80",
    destinationLink: "/destinations/bali",
    readTime: "5 min read"
  },
  {
    id: 5,
    category: "Destinations",
    title: "Finding Romance in the Streets of Paris",
    location: "Paris, France",
    description:
      "From charming streets to café corners, discover ideas for a memorable Parisian escape.",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80",
    destinationLink: "/destinations/paris",
    readTime: "5 min read"
  },
  {
    id: 6,
    category: "Travel Tips",
    title: "The Art of Packing Light",
    location: "Travel smarter",
    description:
      "A practical approach to packing the essentials without bringing your entire wardrobe.",
    image:
      "https://images.unsplash.com/photo-1553531384-411a247ccd73?auto=format&fit=crop&w=1000&q=80",
    destinationLink: "/plan-trip",
    readTime: "3 min read"
  }
];

const categories = [
  "All Stories",
  "Destinations",
  "Personal Journeys",
  "Travel Tips",
  "Hidden Gems"
];

function StoriesPage() {
  const [activeCategory, setActiveCategory] = useState("All Stories");

  const filteredStories = stories.filter((story) => {
    return (
      activeCategory === "All Stories" ||
      story.category === activeCategory
    );
  });

  const featuredStory = stories[0];

  return (
    <main className="stories-page">
      {/* NAVBAR */}
      <nav className="navbar">
        <Link to="/" className="logo">
          The World, by Me
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/#destinations">Explore</Link>
          <Link to="/stories" className="stories-nav-active">
            Stories
          </Link>
          <Link to="/plan-trip">Plan a Trip</Link>
          <Link to="/activities">Activities</Link>
          <Link to="/package-tours">Package Tours</Link>
        </div>
      </nav>

      {/* HERO */}
      <header className="stories-hero">
        <p className="stories-eyebrow">STORIES & INSPIRATION</p>

        <h1>Every journey has a story.</h1>

        <p>
          Places to discover, moments to remember, and inspiration
          for wherever your heart wants to go next.
        </p>

        <a href="#latest-stories" className="stories-primary-button">
          Find your inspiration
        </a>
      </header>

      {/* FEATURED STORY */}
      <section className="stories-featured-section">
        <div className="stories-featured-image">
          <img
            src={featuredStory.image}
            alt="Traditional streets and architecture in Kyoto, Japan"
          />
        </div>

        <div className="stories-featured-content">
          <p className="stories-eyebrow">THE FEATURED STORY</p>

          <span className="stories-category-label">
            {featuredStory.category}
          </span>

          <h2>{featuredStory.title}</h2>

          <p className="stories-location">
            {featuredStory.location}
          </p>

          <p>{featuredStory.description}</p>

          <Link
            to={featuredStory.destinationLink}
            className="stories-text-link"
          >
            Explore Kyoto <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* STORY CATEGORIES AND CARDS */}
      <section
        className="stories-list-section"
        id="latest-stories"
      >
        <div className="stories-section-heading">
          <p className="stories-eyebrow">YOUR NEXT CHAPTER</p>

          <h2>Stories for the curious.</h2>

          <p>
            Find your next destination, learn something useful,
            or simply dream about where you might go.
          </p>
        </div>

        <div className="stories-category-filters">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={
                activeCategory === category
                  ? "stories-filter-button stories-filter-active"
                  : "stories-filter-button"
              }
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
            >
              {category}
            </button>
          ))}
        </div>

        <p className="stories-results-count">
          {filteredStories.length}{" "}
          {filteredStories.length === 1 ? "story" : "stories"}
        </p>

        <div className="stories-grid">
          {filteredStories.map((story) => (
            <article className="stories-card" key={story.id}>
              <Link
                to={story.destinationLink}
                className="stories-card-image-link"
                aria-label={`Explore ${story.title}`}
              >
                <img
                  className="stories-card-image"
                  src={story.image}
                  alt={story.title}
                  loading="lazy"
                />
              </Link>

              <div className="stories-card-content">
                <p className="stories-card-category">
                  {story.category}
                </p>

                <h3>{story.title}</h3>

                <p className="stories-card-location">
                  {story.location}
                </p>

                <p className="stories-card-description">
                  {story.description}
                </p>

                <div className="stories-card-bottom">
                  <span>{story.readTime}</span>

                  <Link to={story.destinationLink}>
                    Explore <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PLAN A TRIP */}
      <section className="stories-plan-cta">
        <p className="stories-eyebrow">YOUR STORY STARTS HERE</p>

        <h2>Somewhere is waiting for you.</h2>

        <p>
          Turn the places you dream about into a journey of your own.
        </p>

        <Link to="/plan-trip" className="stories-primary-button">
          Plan Your Next Trip
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="stories-footer">
        <Link to="/" className="stories-footer-brand">
          The World, by Me
        </Link>

        <p>Find your own way around the world.</p>
      </footer>
    </main>
  );
}

export default StoriesPage;
