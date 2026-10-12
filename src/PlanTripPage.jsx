
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./PlanTripPage.css";
import BookingSearch from "./BookingSearch";

function PlanTripPage() {
    const [searchParams] = useSearchParams();

    // Restore previously saved trip details and itinerary.
    function loadSavedTrip() {
        try {
            const savedTrip = sessionStorage.getItem("myTrip");

            if (savedTrip) {
                return JSON.parse(savedTrip);
            }
        } catch (error) {
            console.error("Could not load saved trip:", error);
        }

        return {};
    }

    const savedTrip = loadSavedTrip();

    const [departure, setDeparture] = useState(savedTrip.departure || "");
    const [returnDate, setReturnDate] = useState(savedTrip.returnDate || "");
    const [travelers, setTravelers] = useState(savedTrip.travelers || "2");
    const [travelStyle, setTravelStyle] = useState(savedTrip.travelStyle || "Relaxing");
    const [budget, setBudget] = useState(savedTrip.budget || "");
    const [budgetCurrency, setBudgetCurrency] = useState(savedTrip.budgetCurrency || "SGD");
    const [destination, setDestination] = useState(
        savedTrip.destination || searchParams.get("destination") || ""
    );

    const [activities, setActivities] = useState(savedTrip.activities || []);
    const [activityName, setActivityName] = useState("");
    const [activityDay, setActivityDay] = useState("1");
    const [activityTime, setActivityTime] = useState("09:00");
    const [activityLocation, setActivityLocation] = useState("");
    const [activityType, setActivityType] = useState("Sightseeing");
    const [activityCost, setActivityCost] = useState("0");
    const [activityNotes, setActivityNotes] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");

    // Calculate the number of days from the selected dates.
    function getTripDays() {
        if (!departure || !returnDate || returnDate < departure) {
            return 1;
        }

        const start = new Date(departure + "T00:00:00");
        const end = new Date(returnDate + "T00:00:00");
        const difference = Math.round((end - start) / 86400000);

        return difference + 1;
    }

    const tripDays = getTripDays();

    function formatDate(dateString) {
        if (!dateString) {
            return "Choose your travel dates";
        }

        return new Date(dateString + "T00:00:00").toLocaleDateString(
            "en-SG",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
    }

    function formatMoney(amount) {
        return new Intl.NumberFormat("en-SG", {
            style: "currency",
            currency: budgetCurrency,
            maximumFractionDigits: 2
        }).format(Number(amount) || 0);
    }

    function saveTrip(tripDetails) {
        try {
            sessionStorage.setItem("myTrip", JSON.stringify(tripDetails));
            return true;
        } catch (error) {
            console.error("Could not save trip:", error);
            setMessage("Your trip could not be saved. Please try again.");
            return false;
        }
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (!destination.trim() || !departure || !returnDate || budget === "") {
            alert("Please complete all trip details.");
            return;
        }

        if (returnDate < departure) {
            alert("Your return date must be after your departure date.");
            return;
        }

        if (!Number.isFinite(Number(budget)) || Number(budget) < 0) {
            alert("Please enter a valid travel budget.");
            return;
        }

        const tripDetails = {
            destination: destination.trim(),
            departure,
            returnDate,
            travelers,
            travelStyle,
            budget,
            budgetCurrency,
            activities
        };

        if (saveTrip(tripDetails)) {
            setMessage("Your trip details have been saved!");
        }
    }

    function resetActivityForm() {
        setActivityName("");
        setActivityDay("1");
        setActivityTime("09:00");
        setActivityLocation("");
        setActivityType("Sightseeing");
        setActivityCost("0");
        setActivityNotes("");
        setEditingId(null);
    }

    function handleActivitySubmit(event) {
        event.preventDefault();

        if (!activityName.trim()) {
            setMessage("Please enter an activity name.");
            return;
        }

        const cost = Number(activityCost);

        if (!Number.isFinite(cost) || cost < 0) {
            setMessage("Please enter a valid activity cost.");
            return;
        }

        const newActivity = {
            id: editingId || Date.now(),
            name: activityName.trim(),
            day: Number(activityDay),
            time: activityTime,
            location: activityLocation.trim(),
            type: activityType,
            cost,
            notes: activityNotes.trim()
        };

        let updatedActivities;

        if (editingId !== null) {
            updatedActivities = activities.map((activity) => {
                if (activity.id === editingId) {
                    return newActivity;
                }

                return activity;
            });
        } else {
            updatedActivities = [...activities, newActivity];
        }

        updatedActivities.sort((a, b) => {
            if (a.day !== b.day) {
                return a.day - b.day;
            }

            return a.time.localeCompare(b.time);
        });

        setActivities(updatedActivities);

        const tripDetails = {
            destination: destination.trim(),
            departure,
            returnDate,
            travelers,
            travelStyle,
            budget,
            budgetCurrency,
            activities: updatedActivities
        };

        saveTrip(tripDetails);
        setMessage(editingId !== null ? "Activity updated!" : "Activity added!");
        resetActivityForm();
    }

    function editActivity(activity) {
        setEditingId(activity.id);
        setActivityName(activity.name);
        setActivityDay(String(activity.day));
        setActivityTime(activity.time);
        setActivityLocation(activity.location || "");
        setActivityType(activity.type || "Sightseeing");
        setActivityCost(String(activity.cost || 0));
        setActivityNotes(activity.notes || "");

        document.getElementById("activity-form")?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    function deleteActivity(activityId) {
        const updatedActivities = activities.filter(
            (activity) => activity.id !== activityId
        );

        setActivities(updatedActivities);

        saveTrip({
            destination: destination.trim(),
            departure,
            returnDate,
            travelers,
            travelStyle,
            budget,
            budgetCurrency,
            activities: updatedActivities
        });

        if (editingId === activityId) {
            resetActivityForm();
        }

        setMessage("Activity removed.");
    }

    function clearItinerary() {
        if (!window.confirm("Remove all activities from your itinerary?")) {
            return;
        }

        setActivities([]);

        saveTrip({
            destination: destination.trim(),
            departure,
            returnDate,
            travelers,
            travelStyle,
            budget,
            budgetCurrency,
            activities: []
        });

        resetActivityForm();
        setMessage("Your itinerary has been cleared.");
    }

    function scrollToSection(sectionId) {
        document.getElementById(sectionId)?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    const totalActivityCost = activities.reduce((total, activity) => {
        return total + Number(activity.cost || 0);
    }, 0);

    const remainingBudget = Number(budget || 0) - totalActivityCost;

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
                    <p className="plan-trip-eyebrow">STEP 01 — YOUR JOURNEY</p>

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
                            onChange={(event) => setDestination(event.target.value)}
                            required
                        />

                        <div className="trip-form-row">
                            <div>
                                <label htmlFor="departure">Departure date</label>
                                <input
                                    id="departure"
                                    type="date"
                                    value={departure}
                                    onChange={(event) => {
                                        const newDeparture = event.target.value;
                                        setDeparture(newDeparture);

                                        if (returnDate && returnDate < newDeparture) {
                                            setReturnDate("");
                                        }
                                    }}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="returnDate">Return date</label>
                                <input
                                    id="returnDate"
                                    type="date"
                                    min={departure || undefined}
                                    value={returnDate}
                                    onChange={(event) => setReturnDate(event.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <label htmlFor="travelers">Number of travelers</label>
                        <select
                            id="travelers"
                            value={travelers}
                            onChange={(event) => setTravelers(event.target.value)}
                        >
                            <option value="1">1 traveler</option>
                            <option value="2">2 travelers</option>
                            <option value="3">3 travelers</option>
                            <option value="4">4 travelers</option>
                            <option value="5">5 travelers</option>
                            <option value="6+">6 or more travelers</option>
                        </select>

                        <label htmlFor="travelStyle">Your travel style</label>
                        <select
                            id="travelStyle"
                            value={travelStyle}
                            onChange={(event) => setTravelStyle(event.target.value)}
                        >
                            <option>Relaxing</option>
                            <option>Adventure</option>
                            <option>Romantic</option>
                            <option>Cultural</option>
                            <option>Food and Lifestyle</option>
                        </select>

                        <div className="trip-form-row budget-currency-row">
                            <div>
                                <label htmlFor="budget">Estimated total budget</label>
                                <input
                                    id="budget"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="e.g. 2000"
                                    value={budget}
                                    onChange={(event) => setBudget(event.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="budgetCurrency">Currency</label>
                                <select
                                    id="budgetCurrency"
                                    value={budgetCurrency}
                                    onChange={(event) => setBudgetCurrency(event.target.value)}
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

                        <button type="submit" className="create-trip-button">
                            Save My Trip Details
                        </button>

                        {message && (
                            <p className="planner-message" role="status">
                                {message}
                            </p>
                        )}
                    </form>
                </section>

                <section id="booking-options" className="trip-booking-section">
                    <p className="plan-trip-eyebrow">STEP 02 — BOOKING</p>

                    <h2>Stay somewhere wonderful.</h2>

                    <p className="plan-trip-description">
                        Find your stay or plan your flight for your next adventure.
                    </p>

                    <BookingSearch initialDestination={destination} />
                </section>

                <section id="itinerary-section" className="trip-itinerary-section">
                    <p className="plan-trip-eyebrow">
                        STEP 03 — YOUR DAYS, YOUR WAY
                    </p>

                    <h2>Your journey, day by day.</h2>

                    <p className="plan-trip-description">
                        Turn your ideas into a personal itinerary. Add places,
                        activities, timings, and estimated costs for each day.
                    </p>

                    <div className="itinerary-summary">
                        <div>
                            <span className="itinerary-summary-label">DESTINATION</span>
                            <strong>{destination.trim() || "Your destination"}</strong>
                        </div>

                        <div>
                            <span className="itinerary-summary-label">TRAVEL DATES</span>
                            <strong>
                                {formatDate(departure)} – {formatDate(returnDate)}
                            </strong>
                        </div>

                        <div>
                            <span className="itinerary-summary-label">PLANNED DAYS</span>
                            <strong>
                                {departure && returnDate && returnDate >= departure
                                    ? tripDays
                                    : "—"}
                            </strong>
                        </div>
                    </div>

                    <div className="itinerary-budget">
                        <div>
                            <span className="itinerary-summary-label">
                                ESTIMATED ACTIVITY COST
                            </span>
                            <strong>{formatMoney(totalActivityCost)}</strong>
                        </div>

                        <div>
                            <span className="itinerary-summary-label">
                                {remainingBudget < 0 ? "OVER BUDGET" : "BUDGET REMAINING"}
                            </span>
                            <strong className={remainingBudget < 0 ? "budget-warning" : ""}>
                                {formatMoney(Math.abs(remainingBudget))}
                                {remainingBudget < 0 ? " over" : ""}
                            </strong>
                        </div>
                    </div>

                    <div className="itinerary-actions">
                        <button
                            type="button"
                            className="itinerary-secondary-button"
                            onClick={() => scrollToSection("activity-form")}
                        >
                            + Add an activity
                        </button>

                        <button
                            type="button"
                            className="itinerary-secondary-button"
                            onClick={() => window.print()}
                        >
                            Print / Save PDF
                        </button>

                        {activities.length > 0 && (
                            <button
                                type="button"
                                className="itinerary-clear-button"
                                onClick={clearItinerary}
                            >
                                Clear itinerary
                            </button>
                        )}
                    </div>

                    <form
                        id="activity-form"
                        className="activity-form"
                        onSubmit={handleActivitySubmit}
                    >
                        <h3>{editingId !== null ? "Edit activity" : "Add to your itinerary"}</h3>

                        <div className="activity-form-grid">
                            <div className="activity-field activity-field-wide">
                                <label htmlFor="activityName">Activity name *</label>
                                <input
                                    id="activityName"
                                    type="text"
                                    placeholder="e.g. Visit a local market"
                                    value={activityName}
                                    onChange={(event) => setActivityName(event.target.value)}
                                    required
                                />
                            </div>

                            <div className="activity-field">
                                <label htmlFor="activityDay">Trip day</label>
                                <select
                                    id="activityDay"
                                    value={activityDay}
                                    onChange={(event) => setActivityDay(event.target.value)}
                                >
                                    {Array.from({ length: tripDays }, (_, index) => (
                                        <option key={index + 1} value={index + 1}>
                                            Day {index + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="activity-field">
                                <label htmlFor="activityTime">Time</label>
                                <input
                                    id="activityTime"
                                    type="time"
                                    value={activityTime}
                                    onChange={(event) => setActivityTime(event.target.value)}
                                    required
                                />
                            </div>

                            <div className="activity-field">
                                <label htmlFor="activityType">Category</label>
                                <select
                                    id="activityType"
                                    value={activityType}
                                    onChange={(event) => setActivityType(event.target.value)}
                                >
                                    <option>Sightseeing</option>
                                    <option>Food & Drink</option>
                                    <option>Culture</option>
                                    <option>Shopping</option>
                                    <option>Adventure</option>
                                    <option>Relaxation</option>
                                    <option>Transport</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div className="activity-field">
                                <label htmlFor="activityCost">
                                    Estimated cost ({budgetCurrency})
                                </label>
                                <input
                                    id="activityCost"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={activityCost}
                                    onChange={(event) => setActivityCost(event.target.value)}
                                />
                            </div>

                            <div className="activity-field activity-field-wide">
                                <label htmlFor="activityLocation">Location (optional)</label>
                                <input
                                    id="activityLocation"
                                    type="text"
                                    placeholder="Address, attraction, or meeting point"
                                    value={activityLocation}
                                    onChange={(event) => setActivityLocation(event.target.value)}
                                />
                            </div>

                            <div className="activity-field activity-field-wide">
                                <label htmlFor="activityNotes">Notes (optional)</label>
                                <textarea
                                    id="activityNotes"
                                    rows="3"
                                    placeholder="Opening hours, reservation details, reminders..."
                                    value={activityNotes}
                                    onChange={(event) => setActivityNotes(event.target.value)}
                                />
                            </div>
                        </div>

                        <div className="activity-form-actions">
                            <button type="submit" className="create-trip-button">
                                {editingId !== null ? "Save Changes" : "Add Activity"}
                            </button>

                            {editingId !== null && (
                                <button
                                    type="button"
                                    className="itinerary-secondary-button"
                                    onClick={resetActivityForm}
                                >
                                    Cancel edit
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="itinerary-days">
                        {Array.from({ length: tripDays }, (_, index) => {
                            const dayNumber = index + 1;
                            const dayActivities = activities.filter(
                                (activity) => activity.day === dayNumber
                            );

                            const dateForDay = departure
                                ? new Date(
                                    new Date(departure + "T00:00:00").getTime() +
                                    index * 86400000
                                ).toISOString().slice(0, 10)
                                : "";

                            return (
                                <article className="itinerary-day-card" key={dayNumber}>
                                    <div className="itinerary-day-heading">
                                        <div>
                                            <span className="itinerary-day-number">
                                                DAY {String(dayNumber).padStart(2, "0")}
                                            </span>
                                            <h3>
                                                {dateForDay
                                                    ? formatDate(dateForDay)
                                                    : `Day ${dayNumber}`}
                                            </h3>
                                        </div>

                                        <span className="itinerary-activity-count">
                                            {dayActivities.length}{" "}
                                            {dayActivities.length === 1 ? "activity" : "activities"}
                                        </span>
                                    </div>

                                    {dayActivities.length === 0 ? (
                                        <div className="itinerary-empty">
                                            <p>Your day is still open.</p>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setActivityDay(String(dayNumber));
                                                    scrollToSection("activity-form");
                                                }}
                                            >
                                                Plan this day →
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="itinerary-activity-list">
                                            {dayActivities
                                                .slice()
                                                .sort((a, b) => a.time.localeCompare(b.time))
                                                .map((activity) => (
                                                    <div
                                                        className="itinerary-activity"
                                                        key={activity.id}
                                                    >
                                                        <div className="activity-time">
                                                            {activity.time}
                                                        </div>

                                                        <div className="activity-details">
                                                            <span className="activity-category">
                                                                {activity.type}
                                                            </span>
                                                            <h4>{activity.name}</h4>

                                                            {activity.location && (
                                                                <p>⌖ {activity.location}</p>
                                                            )}

                                                            {activity.notes && (
                                                                <p>{activity.notes}</p>
                                                            )}

                                                            <strong>
                                                                {formatMoney(activity.cost)}
                                                            </strong>
                                                        </div>

                                                        <div className="activity-controls">
                                                            <button
                                                                type="button"
                                                                onClick={() => editActivity(activity)}
                                                                aria-label={`Edit ${activity.name}`}
                                                            >
                                                                Edit
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => deleteActivity(activity.id)}
                                                                aria-label={`Delete ${activity.name}`}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </div>

                    <p className="planner-note">
                        Your itinerary is saved in this browser session. Activity
                        costs are estimates and are not live booking prices.
                    </p>

                    {message && (
                        <p className="planner-message" role="status">
                            {message}
                        </p>
                    )}
                </section>
            </main>

            <footer className="plan-trip-footer">
                <p>The World, by Me</p>
                <span>Your next chapter might begin somewhere beautiful.</span>
            </footer>
        </div>
    );
}

export default PlanTripPage;
