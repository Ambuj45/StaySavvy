import React, { useEffect, useState } from "react";
import axios from "axios";
import "antd/dist/reset.css";
import Room from "../components/Room";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import { DatePicker, Select, Space } from "antd";

const { RangePicker } = DatePicker;

function Homescreen() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [duplicateRooms, setDuplicateRooms] = useState([]);
  const [searchkey, setSearchkey] = useState("");
  const [type, setType] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/rooms/getallrooms");
        setRooms(data);
        setDuplicateRooms(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        console.log(error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  function filterByDate(dates) {
    if (dates && dates.length === 2) {
      const fromDateFormatted = moment(dates[0]).format("DD-MM-YYYY");
      const toDateFormatted = moment(dates[1]).format("DD-MM-YYYY");

      setFromDate(fromDateFormatted);
      setToDate(toDateFormatted);

      const tempRooms = [];

      for (const room of duplicateRooms) {
        let availability = true;

        if (room.currentbookings.length > 0) {
          for (const booking of room.currentbookings) {
            const bookingFromDate = moment(booking.fromdate, "DD-MM-YYYY");
            const bookingToDate = moment(booking.todate, "DD-MM-YYYY");

            if (
              moment(fromDateFormatted, "DD-MM-YYYY").isBetween(
                bookingFromDate,
                bookingToDate,
                null,
                "[]"
              ) ||
              moment(toDateFormatted, "DD-MM-YYYY").isBetween(
                bookingFromDate,
                bookingToDate,
                null,
                "[]"
              ) ||
              bookingFromDate.isBetween(
                moment(fromDateFormatted, "DD-MM-YYYY"),
                moment(toDateFormatted, "DD-MM-YYYY"),
                null,
                "[]"
              ) ||
              bookingToDate.isBetween(
                moment(fromDateFormatted, "DD-MM-YYYY"),
                moment(toDateFormatted, "DD-MM-YYYY"),
                null,
                "[]"
              )
            ) {
              availability = false;
              break;
            }
          }
        }

        if (availability || room.currentbookings.length === 0) {
          tempRooms.push(room);
        }
      }

      setRooms(tempRooms);
    }
  }

  function filterBysearch() {
    const temprooms = duplicateRooms.filter((room) =>
      room.name.toLowerCase().includes(searchkey.toLowerCase())
    );
    setRooms(temprooms);
  }

  function filterBytype(type) {
    setType(type);
    if (type === "All") {
      setRooms(duplicateRooms);
    } else {
      const tempRooms = duplicateRooms.filter(
        (room) => room.type.toLowerCase() === type.toLowerCase()
      );
      setRooms(tempRooms);
    }
  }

  return (
    <div className="container">
      <div className="row mt-5 bs">
        <div className="col-md-3">
          <RangePicker format="DD-MM-YYYY" onChange={filterByDate} />
        </div>

        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="search rooms"
            value={searchkey}
            onChange={(e) => setSearchkey(e.target.value)}
            onKeyUp={filterBysearch}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-control"
            value={type}
            onChange={(e) => filterBytype(e.target.value)}
          >
            <option value="All">All</option>
            <option value="delux">Delux</option>
            <option value="non-delux">Non-Delux</option>
          </select>
        </div>
      </div>

      <div className="row justify-content-center mt-5">
        {loading ? (
          <Loader />
        ) : error ? (
          <Error />
        ) : rooms.length > 0 ? (
          rooms.map((room) => (
            <div className="col-md-9 mt-3" key={room._id}>
              <Room room={room} fromdate={fromDate} todate={toDate} />
            </div>
          ))
        ) : (
          <div>No rooms available</div>
        )}
      </div>
    </div>
  );
}

export default Homescreen;
