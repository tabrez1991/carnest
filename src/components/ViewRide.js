import React, { useState } from "react";

const ViewRide = (props) => {
    const { ride, handleCloseModal } = props;

    console.log("view ride",ride)
    return (
        <div style={{ padding: "20px" }}>
            <h2>Ride Details</h2>
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        background: "#fff",
                        padding: "20px",
                        borderRadius: "8px",
                        width: "400px",
                        textAlign: "left",
                    }}
                >
                    <h3>Ride Details</h3>
                    <p><strong>Driver:</strong> {ride.driver_name}</p>
                    <p><strong>From:</strong> {ride.going_from}</p>
                    <p><strong>To:</strong> {ride.going_to}</p>
                    <p><strong>Date:</strong> {new Date(ride.ride_date).toLocaleString()}</p>
                    <p><strong>Passenger:</strong> {ride.Passenger_name}</p>
                    <p><strong>Seats Selected:</strong> {ride.selected_seats.join(", ")}</p>
                    <p><strong>Total Price:</strong> ₹{ride.total_price}</p>
                    <p><strong>Status:</strong> {ride.status}</p>
                    <p><strong>Notes:</strong> {ride.additional_notes}</p>
                    <button
                        onClick={handleCloseModal}
                        style={{
                            background: "#f44336",
                            color: "#fff",
                            padding: "10px 20px",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            marginTop: "10px",
                        }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewRide;
