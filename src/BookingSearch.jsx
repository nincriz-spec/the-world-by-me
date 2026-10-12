
import { useState, useEffect } from "react";

function BookingSearch({ initialDestination = "" }) {
    const [activeTab, setActiveTab] = useState("hotels");

    // Message shown after searching or when validation fails
    const [message, setMessage] = useState("");

    // Hotel details
    const [destination, setDestination] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState("2");

    // Flight details
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [departure, setDeparture] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [tripType, setTripType] = useState("round-trip");
    const [passengers, setPassengers] = useState("1");

    // Multi-city flight segments
    const [flightSegments, setFlightSegments] = useState([
        { from: "", to: "", departure: "" },
        { from: "", to: "", departure: "" }
    ]);

    // Tour details
    const [tourDestination, setTourDestination] = useState("");
    const [tourDate, setTourDate] = useState("");
    const [tourGuests, setTourGuests] = useState("2");

    // Fill in the destination from the trip planner
    useEffect(() => {
        if (initialDestination.trim()) {
            setDestination(initialDestination);
            setTo(initialDestination);
            setTourDestination(initialDestination);
        }
    }, [initialDestination]);

    // Today's date in YYYY-MM-DD format
    function getToday() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    function changeTab(tab) {
        setActiveTab(tab);
        setMessage("");
    }

    function changeTripType(type) {
        setTripType(type);
        setMessage("");
    }

    // Update a multi-city flight segment
    function updateFlightSegment(index, field, value) {
        const updatedSegments = flightSegments.map((segment, i) => {
            if (i === index) {
                return {
                    ...segment,
                    [field]: value
                };
            }

            return segment;
        });

        setFlightSegments(updatedSegments);
        setMessage("");
    }

    // Add another segment, up to six
    function addFlightSegment() {
        if (flightSegments.length >= 6) {
            setMessage("You can add up to 6 flight segments.");
            return;
        }

        setFlightSegments([
            ...flightSegments,
            { from: "", to: "", departure: "" }
        ]);

        setMessage("");
    }

    // Remove a segment
    function removeFlightSegment(index) {
        if (flightSegments.length <= 2) {
            setMessage("A multi-city trip needs at least 2 flight segments.");
            return;
        }

        const updatedSegments = flightSegments.filter(
            (segment, i) => i !== index
        );

        setFlightSegments(updatedSegments);
        setMessage("");
    }

    // Hotel search validation
    function handleHotelSearch(event) {
        event.preventDefault();
        setMessage("");

        const today = getToday();

        if (!destination.trim()) {
            setMessage("Please enter your destination.");
            return;
        }

        if (!checkIn || checkIn < today) {
            setMessage("Please choose a valid check-in date.");
            return;
        }

        if (!checkOut || checkOut <= checkIn) {
            setMessage("Check-out must be after check-in.");
            return;
        }

        setMessage(
            `Your hotel search is ready for ${destination.trim()}, from ${checkIn} to ${checkOut}, for ${guests} guest(s). Live hotel search and booking are not connected yet.`
        );
    }

    // Flight search validation
    function handleFlightSearch(event) {
        event.preventDefault();
        setMessage("");

        const today = getToday();

        if (tripType === "multi-city") {
            for (let i = 0; i < flightSegments.length; i++) {
                const segment = flightSegments[i];

                if (!segment.from.trim() || !segment.to.trim()) {
                    setMessage(
                        `Please enter the departure and destination for flight ${i + 1}.`
                    );
                    return;
                }

                if (
                    segment.from.trim().toLowerCase() ===
                    segment.to.trim().toLowerCase()
                ) {
                    setMessage(
                        `Flight ${i + 1} must have different departure and destination locations.`
                    );
                    return;
                }

                if (!segment.departure || segment.departure < today) {
                    setMessage(
                        `Please choose a valid departure date for flight ${i + 1}.`
                    );
                    return;
                }

                if (
                    i > 0 &&
                    segment.departure < flightSegments[i - 1].departure
                ) {
                    setMessage(
                        "Each flight date must be on or after the previous flight date."
                    );
                    return;
                }

                if (
                    i > 0 &&
                    segment.from.trim().toLowerCase() !==
                    flightSegments[i - 1].to.trim().toLowerCase()
                ) {
                    setMessage(
                        `Flight ${i + 1} should depart from the destination of flight ${i}.`
                    );
                    return;
                }
            }

            const route = flightSegments
                .map(
                    (segment) =>
                        `${segment.from.trim()} → ${segment.to.trim()} (${segment.departure})`
                )
                .join(" | ");

            setMessage(
                `Your multi-city trip is ready: ${route}. Passengers: ${passengers}. Live flight search and booking are not connected yet.`
            );

            return;
        }

        if (!from.trim() || !to.trim()) {
            setMessage("Please enter both your departure and destination.");
            return;
        }

        if (from.trim().toLowerCase() === to.trim().toLowerCase()) {
            setMessage("Your departure and destination must be different.");
            return;
        }

        if (!departure || departure < today) {
            setMessage("Please choose a valid departure date.");
            return;
        }

        if (
            tripType === "round-trip" &&
            (!returnDate || returnDate <= departure)
        ) {
            setMessage("Your return date must be after your departure date.");
            return;
        }

        setMessage(
            `Your ${tripType === "round-trip" ? "round-trip" : "one-way"} flight search is ready from ${from.trim()} to ${to.trim()} for ${passengers} passenger(s). Live flight search and booking are not connected yet.`
        );
    }

    // Tour search validation
    function handleTourSearch(event) {
        event.preventDefault();
        setMessage("");

        if (!tourDestination.trim()) {
            setMessage("Please enter your tour destination.");
            return;
        }

        if (!tourDate || tourDate < getToday()) {
            setMessage("Please choose a valid tour date.");
            return;
        }

        setMessage(
            `Your tour search is ready for ${tourDestination.trim()} on ${tourDate} for ${tourGuests} guest(s). Live tour availability and booking are not connected yet.`
        );
    }

    return (
        <section className="booking-section" id="booking">
            <div className="booking-panel">
                <div className="booking-panel-header">
                    <p className="booking-eyebrow">
                        YOUR NEXT ADVENTURE
                    </p>

                    <h2>Plan your next escape.</h2>

                    <p>Beautiful journeys begin here.</p>

                    <div
                        className="booking-tabs"
                        role="tablist"
                        aria-label="Booking type"
                    >
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === "hotels"}
                            className={`booking-tab ${activeTab === "hotels" ? "active" : ""}`}
                            onClick={() => changeTab("hotels")}
                        >
                            <span aria-hidden="true">⌂</span> Hotels
                        </button>

                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === "flights"}
                            className={`booking-tab ${activeTab === "flights" ? "active" : ""}`}
                            onClick={() => changeTab("flights")}
                        >
                            <span aria-hidden="true">✈</span> Flights
                        </button>

                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === "tours"}
                            className={`booking-tab ${activeTab === "tours" ? "active" : ""}`}
                            onClick={() => changeTab("tours")}
                        >
                            <span aria-hidden="true">✧</span> Tours
                        </button>
                    </div>
                </div>

                <div className="booking-panel-body">
                    {activeTab === "hotels" && (
                        <form
                            className="unified-booking-form"
                            onSubmit={handleHotelSearch}
                            role="tabpanel"
                        >
                            <div className="booking-field">
                                <label htmlFor="hotel-destination">
                                    DESTINATION
                                </label>
                                <input
                                    id="hotel-destination"
                                    type="text"
                                    placeholder="Where would you like to stay?"
                                    value={destination}
                                    onChange={(event) =>
                                        setDestination(event.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="booking-field">
                                <label htmlFor="hotel-checkin">CHECK-IN</label>
                                <input
                                    id="hotel-checkin"
                                    type="date"
                                    min={getToday()}
                                    value={checkIn}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        setCheckIn(value);

                                        if (checkOut && checkOut <= value) {
                                            setCheckOut("");
                                        }

                                        setMessage("");
                                    }}
                                    required
                                />
                            </div>

                            <div className="booking-field">
                                <label htmlFor="hotel-checkout">CHECK-OUT</label>
                                <input
                                    id="hotel-checkout"
                                    type="date"
                                    min={checkIn || getToday()}
                                    value={checkOut}
                                    onChange={(event) => {
                                        setCheckOut(event.target.value);
                                        setMessage("");
                                    }}
                                    required
                                />
                            </div>

                            <div className="booking-field">
                                <label htmlFor="hotel-guests">GUESTS</label>
                                <select
                                    id="hotel-guests"
                                    value={guests}
                                    onChange={(event) =>
                                        setGuests(event.target.value)
                                    }
                                >
                                    <option value="1">1 guest</option>
                                    <option value="2">2 guests</option>
                                    <option value="3">3 guests</option>
                                    <option value="4">4 guests</option>
                                    <option value="5">5 guests</option>
                                    <option value="6">6+ guests</option>
                                </select>
                            </div>

                            <button type="submit" className="booking-search-button">
                                Search Hotels <span aria-hidden="true">→</span>
                            </button>
                        </form>
                    )}

                    {activeTab === "flights" && (
                        <form
                            className="unified-booking-form"
                            onSubmit={handleFlightSearch}
                            role="tabpanel"
                        >
                            <div className="booking-trip-types">
                                <label>
                                    <input
                                        type="radio"
                                        name="booking-trip-type"
                                        value="round-trip"
                                        checked={tripType === "round-trip"}
                                        onChange={() => changeTripType("round-trip")}
                                    />
                                    Round trip
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        name="booking-trip-type"
                                        value="one-way"
                                        checked={tripType === "one-way"}
                                        onChange={() => changeTripType("one-way")}
                                    />
                                    One way
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        name="booking-trip-type"
                                        value="multi-city"
                                        checked={tripType === "multi-city"}
                                        onChange={() => changeTripType("multi-city")}
                                    />
                                    Multi-city
                                </label>
                            </div>

                            {tripType !== "multi-city" && (
                                <>
                                    <div className="booking-field">
                                        <label htmlFor="flight-from">FROM</label>
                                        <input
                                            id="flight-from"
                                            type="text"
                                            placeholder="City or airport"
                                            value={from}
                                            onChange={(event) => setFrom(event.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="booking-field">
                                        <label htmlFor="flight-to">TO</label>
                                        <input
                                            id="flight-to"
                                            type="text"
                                            placeholder="Where to?"
                                            value={to}
                                            onChange={(event) => setTo(event.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="booking-field">
                                        <label htmlFor="flight-departure">DEPARTURE</label>
                                        <input
                                            id="flight-departure"
                                            type="date"
                                            min={getToday()}
                                            value={departure}
                                            onChange={(event) => {
                                                const value = event.target.value;
                                                setDeparture(value);

                                                if (returnDate && returnDate <= value) {
                                                    setReturnDate("");
                                                }

                                                setMessage("");
                                            }}
                                            required
                                        />
                                    </div>

                                    {tripType === "round-trip" && (
                                        <div className="booking-field">
                                            <label htmlFor="flight-return">RETURN</label>
                                            <input
                                                id="flight-return"
                                                type="date"
                                                min={departure || getToday()}
                                                value={returnDate}
                                                onChange={(event) => {
                                                    setReturnDate(event.target.value);
                                                    setMessage("");
                                                }}
                                                required
                                            />
                                        </div>
                                    )}
                                </>
                            )}

                            {tripType === "multi-city" && (
                                <div className="multi-city-flights">
                                    <p className="booking-note">
                                        Plan your journey across multiple destinations.
                                        Add between 2 and 6 flight segments.
                                    </p>

                                    {flightSegments.map((segment, index) => (
                                        <div
                                            className="multi-city-segment"
                                            key={index}
                                        >
                                            <div className="multi-city-segment-header">
                                                <h3>Flight {index + 1}</h3>

                                                {flightSegments.length > 2 && (
                                                    <button
                                                        type="button"
                                                        className="remove-flight-button"
                                                        onClick={() => removeFlightSegment(index)}
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>

                                            <div className="booking-field">
                                                <label htmlFor={`multi-from-${index}`}>
                                                    FROM
                                                </label>
                                                <input
                                                    id={`multi-from-${index}`}
                                                    type="text"
                                                    placeholder="City or airport"
                                                    value={segment.from}
                                                    onChange={(event) =>
                                                        updateFlightSegment(
                                                            index,
                                                            "from",
                                                            event.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>

                                            <div className="booking-field">
                                                <label htmlFor={`multi-to-${index}`}>
                                                    TO
                                                </label>
                                                <input
                                                    id={`multi-to-${index}`}
                                                    type="text"
                                                    placeholder="Next destination"
                                                    value={segment.to}
                                                    onChange={(event) =>
                                                        updateFlightSegment(
                                                            index,
                                                            "to",
                                                            event.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>

                                            <div className="booking-field">
                                                <label htmlFor={`multi-date-${index}`}>
                                                    DEPARTURE DATE
                                                </label>
                                                <input
                                                    id={`multi-date-${index}`}
                                                    type="date"
                                                    min={
                                                        index > 0 && flightSegments[index - 1].departure
                                                            ? flightSegments[index - 1].departure
                                                            : getToday()
                                                    }
                                                    value={segment.departure}
                                                    onChange={(event) =>
                                                        updateFlightSegment(
                                                            index,
                                                            "departure",
                                                            event.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        className="add-flight-button"
                                        onClick={addFlightSegment}
                                        disabled={flightSegments.length >= 6}
                                    >
                                        + Add another flight
                                    </button>

                                    <p className="booking-note">
                                        {flightSegments.length} of 6 flight segments added
                                    </p>
                                </div>
                            )}

                            <div className="booking-field">
                                <label htmlFor="flight-passengers">PASSENGERS</label>
                                <select
                                    id="flight-passengers"
                                    value={passengers}
                                    onChange={(event) => setPassengers(event.target.value)}
                                >
                                    <option value="1">1 passenger</option>
                                    <option value="2">2 passengers</option>
                                    <option value="3">3 passengers</option>
                                    <option value="4">4 passengers</option>
                                    <option value="5">5 passengers</option>
                                    <option value="6">6 passengers</option>
                                    <option value="7">7 passengers</option>
                                    <option value="8">8 passengers</option>
                                    <option value="9">9 passengers</option>
                                </select>
                            </div>

                            <button type="submit" className="booking-search-button">
                                Search Flights <span aria-hidden="true">→</span>
                            </button>
                        </form>
                    )}

                    {activeTab === "tours" && (
                        <form
                            className="unified-booking-form"
                            onSubmit={handleTourSearch}
                            role="tabpanel"
                        >
                            <div className="booking-field">
                                <label htmlFor="tour-destination">DESTINATION</label>
                                <input
                                    id="tour-destination"
                                    type="text"
                                    placeholder="Where would you like to explore?"
                                    value={tourDestination}
                                    onChange={(event) =>
                                        setTourDestination(event.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="booking-field">
                                <label htmlFor="tour-date">TOUR DATE</label>
                                <input
                                    id="tour-date"
                                    type="date"
                                    min={getToday()}
                                    value={tourDate}
                                    onChange={(event) => {
                                        setTourDate(event.target.value);
                                        setMessage("");
                                    }}
                                    required
                                />
                            </div>

                            <div className="booking-field">
                                <label htmlFor="tour-guests">GUESTS</label>
                                <select
                                    id="tour-guests"
                                    value={tourGuests}
                                    onChange={(event) =>
                                        setTourGuests(event.target.value)
                                    }
                                >
                                    <option value="1">1 guest</option>
                                    <option value="2">2 guests</option>
                                    <option value="3">3 guests</option>
                                    <option value="4">4 guests</option>
                                    <option value="5">5 guests</option>
                                    <option value="6">6+ guests</option>
                                </select>
                            </div>

                            <button type="submit" className="booking-search-button">
                                Search Tours <span aria-hidden="true">→</span>
                            </button>
                        </form>
                    )}

                    {message && (
                        <p className="booking-message" role="status">
                            {message}
                        </p>
                    )}

                    <p className="booking-note">
                        Discover your next destination with The World, by Me.
                    </p>
                </div>
            </div>
        </section>
    );
}

export default BookingSearch;
