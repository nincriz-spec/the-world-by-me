import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./PlanTripPage.css";
import BookingSearch from "./BookingSearch";

function PlanTripPage() {

    const [departure, setDeparture] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [travelers, setTravelers] = useState("2");
    const [travelStyle, setTravelStyle] = useState("Relaxing");
    const [budget, setBudget] = useState("");
    const [budgetCurrency, setBudgetCurrency] = useState("SGD");
    const [searchParams] = useSearchParams();
    const [destination, setDestination] = useState(() => {
        return searchParams.get("destination") || "";
    });

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

        if (
            Number(budget) < 0 ||
            !Number.isFinite(Number(budget))
        ) {
            alert("Please enter a valid travel budget.");
            return;
        }

        const tripDetails = {
            destination: destination.trim(),
            departure: departure,
            returnDate: returnDate,
            travelers: travelers,
            travelStyle: travelStyle,
            budget: budget,
            budgetCurrency: budgetCurrency
        };

        try {
            sessionStorage.setItem(
                "myTrip",
                JSON.stringify(tripDetails)
            );

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
                    <Link to="/package-tours">Package Tour</Link>
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
                        <label htmlFor="destination">
                            Destination
                        </label>

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

                        <div className="trip-form-row budget-currency-row">
                            <div>
                                <label htmlFor="budget">
                                    Estimated total budget
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
                            </div>

                            <div>
                                <label htmlFor="budgetCurrency">
                                    Currency
                                </label>

                                <select
                                    id="budgetCurrency"
                                    value={budgetCurrency}
                                    onChange={(event) =>
                                        setBudgetCurrency(event.target.value)
                                    }
                                >
                                    <option value="SGD">SGD — S$</option>
                                    <option value="PHP">PHP — ₱</option>
                                    <option value="USD">USD — US$</option>
                                    <option value="EUR">EUR — €</option>
                                    <option value="GBP">GBP — £</option>
                                    <option value="JPY">JPY — ¥</option>
                                    <option value="MYR">MYR — RM</option>
                                    <option value="THB">THB — ฿</option>
                                    <option value="IDR">IDR — Rp</option>
                                    <option value="AUD">AUD — A$</option>
                                    <option value="CNY">CNY — ¥</option>
                                    <option value="KRW">KRW — ₩</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="create-trip-button"
                        >
                            Save My Trip Details
                        </button>
                    </form>
                </section>

                <section
                    id="booking-options"
                    className="trip-booking-section"
                >
                    <p className="plan-trip-eyebrow">
                        STEP 02 — BOOKING
                    </p>

                    <h2>Stay somewhere wonderful.</h2>

                    <p className="plan-trip-description">
                        Find your stay or plan your flight for your next adventure.
                    </p>

                    <BookingSearch initialDestination={destination} />
                </section>

                <section
                    id="itinerary-section"
                    className="trip-itinerary-section"
                >
                    <p className="plan-trip-eyebrow">
                        STEP 03 — YOUR DAYS, YOUR WAY
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