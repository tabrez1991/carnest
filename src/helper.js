export const generateSeatList = (totalSeats) => {
    if (totalSeats < 2) {
        throw new Error("Invalid number of seats. Must be at least 2.");
    }

    const seatList = [];

    // Add the front passenger seat
    if (totalSeats >= 2) seatList.push("front passenger");

    // Logic for middle seats (for vehicles with 5+ seats)
    const hasMiddleRow = totalSeats > 4;
    if (hasMiddleRow) {
        seatList.push("middle left");
        if (totalSeats > 5) seatList.push("middle right");
        if (totalSeats > 6) seatList.push("middle center");
    }

    // Logic for back seats (starting with the back left and back right)
    seatList.push("back left", "back right");
    if (totalSeats > 6) seatList.push("back center");

    return seatList.slice(0, totalSeats - 1); // Ensure it matches the exact number of seats
};