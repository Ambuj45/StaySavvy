import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";

import { Tabs } from "antd";

const { TabPane } = Tabs;

const ProfileScreen = () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div className="ml-3 mt-3">
      <Tabs defaultActiveKey="1">
        <TabPane tab="Profile" key="1">
          <h1>My Profile</h1>
          <br />
          <h1>Name: {user.name}</h1>
          <h1>Email: {user.email}</h1>
          <h1>IsAdmin: {user.isAdmin ? "Yes" : "No"}</h1>
        </TabPane>
        <TabPane tab="Bookings" key="2">
          <MyBookings />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ProfileScreen;

export function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const user = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axios.post("/api/bookings/getbookingsbyuserid", {
          userid: user._id,
        });
        console.log(response.data);
        setBookings(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        setError(true);
      }
    };

    if (user && user._id) {
      fetchBookings();
    }
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div>
      <div className="row md-6">
        <div className="col md-6">
          {loading && <Loader />}
          {error && <Error message="Failed to fetch bookings" />}
          {bookings &&
            bookings.map((booking) => (
              <div className="bs">
                <h1>{booking.room}</h1>
                <p>
                  {" "}
                  <b>BookingId</b>:{booking._id}
                </p>
                <p>
                  <b>CheckIn</b>:{booking.fromdate}
                </p>
                <p>
                  <b>Checkout</b>:{booking.todate}
                </p>
                <p>
                  <b>Amount</b>:{booking.totalamount}
                </p>
                <p>
                  <b>status</b>:
                  {booking.status == "booked" ? "conformed" : "cancel"}
                </p>

                <div className="text-right">
                  <button className="btn btn-primary">Cancel Booking</button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
