
import { useState } from "react";
import { Link } from "react-router-dom";
import "./PlanTripPage.css";
import BookingSearch from "./BookingSearch";

function PlanTripPage() {
    const [destination, setDestination] = useState("");
    const [departure, setDeparture] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [travelers, setTravelers] = useState("2");
    const [travelStyle, setTravelStyle] = useState("Relaxing");
    const [budget, setBudget] = useState("");

    function handleSubmit(event) {
        event.preventDefault();

        if (
            !destination.trim() ||
            !departure ||
            !returnDate ||
            budget === ""
        ) {
            alert("Please complete all trip details.");
            return;
        }

        if (returnDate < departure) {
            alert("Your return date must be after your departure date.");
            return;
        }

        if (Number(budget) < 0 || !Number.isFinite(Number(budget))) {
            alert("Please enter a valid travel budget.");
            return;
        }

        const tripDetails = {
            destination: destination.trim(),
            departure: departure,
            returnDate: returnDate,
            travelers: travelers,
            travelStyle: travelStyle,
            budget: budget
        };

        try {
            sessionStorage.setItem("myTrip", JSON.stringify(tripDetails));
            alert("Your trip details have been saved for this session!");
        } catch (error) {
            alert("Your trip details could not be saved. Please try again.");
        }
    }

    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);

        if (section) {
            section.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }

    return (
        <div className="plan-trip-page">
            <nav className="navbar">
                <Link to="/" className="logo">
                    The World, by Me
                </Link>

                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/destinations/kyoto">Explore</Link>
                    <Link to="/#stories">Stories</Link>
                    <Link to="/plan-trip">Plan a Trip</Link>
                    <Link to="/activities">Activities</Link>
                </div>
            </nav>

            <header className="plan-trip-hero">
                <p className="plan-trip-tagline">
                    TRAVEL · DISCOVER · BEGIN AGAIN
                </p>

                <h1>Your journey starts here.</h1>

                <p>
                    Dream it. Plan it. Experience it.
                    Let's create a trip that feels like you.
                </p>
            </header>

            <main className="plan-trip-content">
                <section className="trip-form-section">
                    <p className="plan-trip-eyebrow">
                        STEP 01 — YOUR JOURNEY
                    </p>

                    <h2>Where would you like to go?</h2>

                    <p className="plan-trip-description">
                        Tell us a little about your next adventure.
                    </p>

                    <form onSubmit={handleSubmit} className="trip-form">
                        <label htmlFor="destination">Destination</label>

                        <input
                            id="destination"
                            type="text"
                            placeholder="e.g. Bali, Japan, Italy"
                            value={destination}
                            onChange={(event) =>
                                setDestination(event.target.value)
                            }
                            required
                        />

                        <div className="trip-form-row">
                            <div>
                                <label htmlFor="departure">
                                    Departure date
                                </label>

                                <input
                                    id="departure"
                                    type="date"
                                    value={departure}
                                    onChange={(event) => {
                                        const newDeparture = event.target.value;
                                        setDeparture(newDeparture);

                                        if (
                                            returnDate &&
                                            newDeparture &&
                                            returnDate < newDeparture
                                        ) {
                                            setReturnDate("");
                                        }
                                    }}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="returnDate">
                                    Return date
                                </label>

                                <input
                                    id="returnDate"
                                    type="date"
                                    min={departure || undefined}
                                    value={returnDate}
                                    onChange={(event) =>
                                        setReturnDate(event.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <label htmlFor="travelers">
                            Number of travelers
                        </label>

                        <select
                            id="travelers"
                            value={travelers}
                            onChange={(event) =>
                                setTravelers(event.target.value)
                            }
                        >
                            <option value="1">1 traveler</option>
                            <option value="2">2 travelers</option>
                            <option value="3">3 travelers</option>
                            <option value="4">4 travelers</option>
                            <option value="5">5 travelers</option>
                            <option value="6+">6 or more travelers</option>
                        </select>

                        <label htmlFor="travelStyle">
                            Your travel style
                        </label>

                        <select
                            id="travelStyle"
                            value={travelStyle}
                            onChange={(event) =>
                                setTravelStyle(event.target.value)
                            }
                        >
                            <option>Relaxing</option>
                            <option>Adventure</option>
                            <option>Romantic</option>
                            <option>Cultural</option>
                            <option>Food and Lifestyle</option>
                        </select>

                        <label htmlFor="budget">
                            Estimated total budget (SGD)
                        </label>

                        <input
                            id="budget"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="e.g. 2000"
                            value={budget}
                            onChange={(event) =>
                                setBudget(event.target.value)
                            }
                            required
                        />

                        <button
                            type="submit"
                            className="create-trip-button"
                        >
                            Save My Trip Details
                        </button>
                    </form>
                </section>

                <section className="trip-options-section">
                    <p className="plan-trip-eyebrow">
                        STEP 02 — MAKE IT HAPPEN
                    </p>

                    <h2>Bring your plans to life.</h2>

                    <p className="plan-trip-description">
                        Everything you need for a more meaningful journey.
                    </p>

                    <div className="trip-option-grid">
                        <article className="trip-option-card">
                            <span>01</span>
                            <h3>Find Your Stay</h3>
                            <p>
                                Discover hotels and beautiful places to stay.
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    scrollToSection("booking-options")
                                }
                            >
                                Explore Hotels
                            </button>
                        </article>

                        <article className="trip-option-card">
                            <span>02</span>
                            <h3>Plan Your Flight</h3>
                            <p>
                                Prepare for the journey to your destination.
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    scrollToSection("booking-options")
                                }
                            >
                                Explore Flights
                            </button>
                        </article>

                        <article className="trip-option-card">
                            <span>03</span>
                            <h3>Discover Activities</h3>
                            <p>
                                Find memorable experiences at your destination.
                            </p>

                            <Link to="/activities">
                                Explore Activities
                            </Link>
                        </article>

                        <article className="trip-option-card">
                            <span>04</span>
                            <h3>Build Your Itinerary</h3>
                            <p>
                                Organize the places you want to visit each day.
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    scrollToSection("itinerary-section")
                                }
                            >
                                Plan My Days
                            </button>
                        </article>
                    </div>
                </section>

                <section
                    id="booking-options"
                    className="trip-booking-section"
                >
                    <p className="plan-trip-eyebrow">
                        STEP 03 — BOOKING
                    </p>

                    <h2>Stay somewhere wonderful.</h2>

                    <p className="plan-trip-description">
                        Find your stay or plan your flight for your next adventure.
                    </p>

                    <BookingSearch />
                </section>

                <section
                    id="itinerary-section"
                    className="trip-itinerary-section"
                >
                    <p className="plan-trip-eyebrow">
                        STEP 04 — YOUR DAYS, YOUR WAY
                    </p>

                    <h2>Your journey, day by day.</h2>

                    <p className="plan-trip-description">
                        Next, we'll add a day-by-day itinerary planner where you can
                        organize your activities and travel plans.
                    </p>
                </section>
            </main>

            <footer className="plan-trip-footer">
                <p>The World, by Me</p>
                <span>
                    Your next chapter might begin somewhere beautiful.
                </span>
            </footer>
        </div>
    );
}

export default PlanTripPage;
