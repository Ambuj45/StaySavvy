import React, { useState, useEffect } from "react";
import axios from "axios";
import StripeCheckout from "react-stripe-checkout";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import swal from "sweetalert2";

function Bookingscreen() {
  const { roomid, fromdate, todate } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [room, setRoom] = useState(null);

  const formattedFromDate = moment(fromdate, "DD-MM-YYYY").format("YYYY-MM-DD");
  const formattedToDate = moment(todate, "DD-MM-YYYY").format("YYYY-MM-DD");
  const totalDays =
    moment
      .duration(moment(formattedToDate).diff(moment(formattedFromDate)))
      .asDays() + 1;

  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.post("/api/rooms/getroombyid", { roomid });
        setTotalAmount(data.rentperday * totalDays);
        setRoom(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        setError(true);
      }
    };

    fetchRoomData();
  }, [roomid, totalDays]);

  async function onToken(token) {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      swal.fire("Error", "User not logged in", "error");
      return;
    }

    const bookingDetails = {
      room,
      userid: JSON.parse(currentUser)._id,
      fromdate: formattedFromDate,
      todate: formattedToDate,
      totalamount: totalAmount,
      totaldays: totalDays,
      token: token,
    };

    console.log("Booking Details:", bookingDetails); // Log the booking details

    try {
      setLoading(true);
      await axios.post("/api/bookings/bookroom", bookingDetails);
      setLoading(false);
      swal
        .fire("Congratulations", "Your Room Booked Successfully", "success")
        .then((result) => {
          window.location.href = "/bookings";
        });
    } catch (error) {
      console.error(error);
      setLoading(false);
      swal.fire("Oops", "Something went wrong", "error");
    }
  }

  return (
    <div className="m-5">
      {loading ? (
        <h1>
          <Loader />
        </h1>
      ) : error ? (
        <Error />
      ) : room ? (
        <div>
          <div className="row justify-content-center mt-5 bs">
            <div className="col-md-5">
              <h1>{room.name}</h1>
              <img src={room.imageurls[0]} className="bigimg" alt="Room" />
            </div>

            <div className="col-md-5">
              <div style={{ textAlign: "right" }}>
                <h1>Booking Details</h1>
                <hr />
                <b>
                  <p>
                    Name: {JSON.parse(localStorage.getItem("currentUser")).name}
                  </p>
                  <p>From Date: {fromdate}</p>
                  <p>To Date: {todate}</p>
                  <p>Max Count: {room.maxcount}</p>
                </b>
              </div>

              <div style={{ textAlign: "right" }}>
                <b>
                  <h1>Amount</h1>
                  <hr />
                  <p>Total days: {totalDays}</p>
                  <p>Rent per day: {room.rentperday}</p>
                  <p>Total Amount: {totalAmount}</p>
                </b>
              </div>

              <div style={{ float: "right" }}>
                <StripeCheckout
                  amount={totalAmount * 100}
                  token={onToken}
                  currency="INR"
                  stripeKey="pk_test_51PYpepDJRiiJEigKyeaoNcDEraLUdl0K3quE4H7cTGhom4WRU0MRpS25OYO6I3ao0p8Q0z2ejKFAf13fJHidirV300241iI79M"
                >
                  <button className="btn btn-primary">Pay Now</button>
                </StripeCheckout>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Error />
      )}
    </div>
  );
}

export default Bookingscreen;
