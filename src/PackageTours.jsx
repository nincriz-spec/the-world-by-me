
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./PackageTours.css";
import { convertCurrency, formatCurrency } from "./currency";

const packages = [
    {
        id: 1,
        title: "Kyoto Cultural Discovery",
        destination: "Kyoto, Japan",
        type: "Local tour",
        style: "Group",
        days: "1 day",
        price: 95,
        description: "Discover traditional streets, temples and Japanese culture.",
        includes: "Local guide and cultural stops"
    },
    {
        id: 2,
        title: "Bali Island Escape",
        destination: "Bali, Indonesia",
        type: "Holiday package",
        style: "Group",
        days: "5 days, 4 nights",
        price: 850,
        description: "Enjoy island scenery, local experiences and relaxing days.",
        includes: "Sample hotel and tour package"
    },
    {
        id: 3,
        title: "Paris Highlights",
        destination: "Paris, France",
        type: "Local tour",
        style: "Private",
        days: "1 day",
        price: 220,
        description: "Explore famous landmarks with a private guide.",
        includes: "Private guided sightseeing"
    },
    {
        id: 4,
        title: "Romantic Italy Journey",
        destination: "Rome, Italy",
        type: "Holiday package",
        style: "Private",
        days: "6 days, 5 nights",
        price: 1800,
        description: "A flexible Italian getaway with time to explore at your own pace.",
        includes: "Sample accommodation and experiences"
    },
    {
        id: 5,
        title: "Seoul City Experience",
        destination: "Seoul, South Korea",
        type: "Local tour",
        style: "Group",
        days: "1 day",
        price: 110,
        description: "Explore city highlights, markets and local culture.",
        includes: "Sample guided city tour"
    },
    {
        id: 6,
        title: "Singapore City Break",
        destination: "Singapore",
        type: "Holiday package",
        style: "Private",
        days: "3 days, 2 nights",
        price: 500,
        description: "Enjoy a flexible city break with sightseeing options.",
        includes: "Sample accommodation and experiences"
    }
];

const currencies = [
    "SGD", "PHP", "USD", "EUR", "GBP", "JPY",
    "MYR", "THB", "IDR", "AUD", "CNY", "KRW"
];

function PackageTours() {
    const [destination, setDestination] = useState("All destinations");
    const [type, setType] = useState("All");
    const [style, setStyle] = useState("All");
    const [currency, setCurrency] = useState("SGD");
    const [prices, setPrices] = useState({});
    const [loadingPrices, setLoadingPrices] = useState(false);
    const [priceError, setPriceError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadPrices() {
            setLoadingPrices(true);
            setPriceError("");

            try {
                const convertedPrices = {};

                for (const tour of packages) {
                    convertedPrices[tour.id] = await convertCurrency(
                        tour.price,
                        "SGD",
                        currency
                    );
                }

                if (!cancelled) {
                    setPrices(convertedPrices);
                }
            } catch (error) {
                if (!cancelled) {
                    setPrices({});
                    setPriceError(
                        "Prices in this currency are temporarily unavailable."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoadingPrices(false);
                }
            }
        }

        loadPrices();

        return () => {
            cancelled = true;
        };
    }, [currency]);

    const destinations = [
        "All destinations",
        ...new Set(packages.map((tour) => tour.destination))
    ];

    const filteredPackages = packages.filter((tour) => {
        const matchesDestination =
            destination === "All destinations" ||
            tour.destination === destination;

        const matchesType = type === "All" || tour.type === type;
        const matchesStyle = style === "All" || tour.style === style;

        return matchesDestination && matchesType && matchesStyle;
    });

    return (
        <main className="package-tours-page">
            {/* NAVBAR */}
            <nav className="navbar">
                <Link to="/" className="logo">
                    The World, by Me
                </Link>

                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/#destinations">Explore</Link>
                    <Link to="/#stories">Stories</Link>
                    <Link to="/plan-trip">Plan a Trip</Link>
                    <Link to="/activities">Activities</Link>
                    <Link to="/package-tours">Package Tours</Link>
                </div>
            </nav>

            {/* PACKAGE FILTERS */}
            <section className="package-filter-section">
                <div className="package-section-heading">
                    <p className="package-eyebrow">YOUR NEXT ADVENTURE</p>
                    <h2>Explore Package Tours</h2>
                    <p>Find experiences for your travel style and budget.</p>
                </div>

                <div className="package-filters">
                    <label>
                        Destination
                        <select
                            value={destination}
                            onChange={(event) => setDestination(event.target.value)}
                        >
                            {destinations.map((place) => (
                                <option key={place} value={place}>
                                    {place}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Package type
                        <select
                            value={type}
                            onChange={(event) => setType(event.target.value)}
                        >
                            <option value="All">All package types</option>
                            <option value="Local tour">Local tours</option>
                            <option value="Holiday package">Holiday packages</option>
                        </select>
                    </label>

                    <label>
                        Travel style
                        <select
                            value={style}
                            onChange={(event) => setStyle(event.target.value)}
                        >
                            <option value="All">Group and private</option>
                            <option value="Group">Group tours</option>
                            <option value="Private">Private tours</option>
                        </select>
                    </label>

                    <label>
                        Display currency
                        <select
                            value={currency}
                            onChange={(event) => setCurrency(event.target.value)}
                        >
                            {currencies.map((code) => (
                                <option key={code} value={code}>
                                    {code}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                <p className="package-results-count">
                    {filteredPackages.length} packages found
                </p>

                {loadingPrices && (
                    <p className="package-status">
                        Updating exchange rates...
                    </p>
                )}

                {priceError && (
                    <p className="package-status package-error">
                        {priceError}
                    </p>
                )}

                <div className="package-grid">
                    {filteredPackages.map((tour) => (
                        <article className="package-card" key={tour.id}>
                            <div className="package-card-top">
                                <span>{tour.type}</span>
                                <span>{tour.style} tour</span>
                            </div>

                            <div className="package-card-body">
                                <p className="package-destination">
                                    {tour.destination}
                                </p>

                                <h3>{tour.title}</h3>

                                <p className="package-description">
                                    {tour.description}
                                </p>

                                <div className="package-details">
                                    <span>{tour.days}</span>
                                    <span>{tour.includes}</span>
                                </div>

                                <div className="package-price">
                                    <p>Sample price from</p>

                                    {priceError ? (
                                        <strong>Price unavailable</strong>
                                    ) : loadingPrices || prices[tour.id] === undefined ? (
                                        <strong>Loading...</strong>
                                    ) : (
                                        <strong>
                                            {formatCurrency(
                                                prices[tour.id],
                                                currency
                                            )}
                                        </strong>
                                    )}

                                    <small>
                                        Illustrative price only; actual inclusions and supplier
                                        prices must be confirmed.
                                    </small>
                                </div>

                                <button
                                    className="package-view-button"
                                    type="button"
                                    onClick={() =>
                                        alert(
                                            "This is a sample package. Booking links will be added when a tour provider is connected."
                                        )
                                    }
                                >
                                    View Package
                                </button>
                            </div>
                        </article>
                    ))}
                </div>

                {filteredPackages.length === 0 && (
                    <p className="package-status">
                        No packages match these filters. Try another selection.
                    </p>
                )}
            </section>

            <footer className="plan-trip-footer">
                <p>The World, by Me</p>
                <span>
                    Your next chapter might begin somewhere beautiful.
                </span>
            </footer>
        </main>
    );
}

export default PackageTours;
