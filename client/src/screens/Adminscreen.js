import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Swal from "sweetalert2";
const { TabPane } = Tabs;

function Adminscreen() {
  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("currentUser")).isAdmin) {
      window.location.href = "/home";
    }
  }, []);
  return (
    <div className="ml-2 mt-3 mr-3 bs">
      <h1 className="text-center">
        <b style={{ fontSize: "30px" }}>Admin Pannel</b>
      </h1>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Bookings" key="1">
          <Booking />
        </TabPane>
        <TabPane tab="Rooms" key="2">
          <Rooms />
        </TabPane>

        <TabPane tab="Add Rooms" key="3">
          <AddRoom />
        </TabPane>
        <TabPane tab="Users" key="4">
          <Users />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Adminscreen;

export function Booking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await (
          await axios.get("/api/bookings/getallbookings")
        ).data;
        setBookings(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
        setError(error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="row">
      <div className="col-md-12">
        <h1>Booking</h1>
        {loading && <Loader />}
        {error && <Error message={error} />}

        <table className="table table-bordered table-dark">
          <thead className="bs">
            <tr>
              <th>BookingId</th>
              <th>UserId</th>
              <th>Room</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.bookingId}>
                <td>{booking._id}</td>
                <td>{booking.userid}</td>
                <td>{booking.room}</td>
                <td>{booking.fromdate}</td>
                <td>{booking.todate}</td>
                <td>{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await (await axios.get("/api/rooms/getallrooms")).data;
        setRooms(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
        setError(error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="row">
      <div className="col-md-12">
        <h1>Rooms</h1>
        {loading && <Loader />}
        {error && <Error message={error} />}

        <table className="table table-bordered table-dark">
          <thead className="bs">
            <tr>
              <th>RoomId</th>
              <th>Name</th>
              <th>Type</th>
              <th>Rent Per Day</th>
              <th>Max Count</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room._id}>
                <td>{room._id}</td>
                <td>{room.name}</td>
                <td>{room.type}</td>
                <td>{room.rentperday}</td>
                <td>{room.maxcount}</td>
                <td>{room.phonenumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await (await axios.get("/api/users/getallusers")).data;
        setUsers(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
        setError(error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="row">
      <div className="col-md-12">
        <h1>Users</h1>
        {loading && <Loader />}
        {error && <Error message={error} />}

        <table className="table table-bordered table-dark">
          <thead className="bs">
            <tr>
              <th>User Id</th>
              <th>User Name</th>
              <th>Email</th>
              <th>isAdmin</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Add Rooms Component

export function AddRoom() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [rentPerDay, SetRentPerDay] = useState("");
  const [maxCount, setMaxCount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [imageUrl1, setImageUrl1] = useState("");
  const [imageUrl2, setImageUrl2] = useState("");
  const [imageUrl3, setImageUrl3] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  
  async function addRoom() {
    const newRoom = {
      name,
      maxcount: maxCount,
      phonenumber,
      rentperday: rentPerDay,
      imageurls: [imageUrl1, imageUrl2, imageUrl3],
      description,
      type,
    };
    console.log(newRoom);
    try {
      setLoading(true);
      const res = await (await axios.post("/api/rooms/addroom", newRoom)).data;
      console.log(res);
      setLoading(false)
      Swal.fire("Congrats", "New Room Successfully Added", "success").then(
        (res) => {
          window.location.reload();
        }
      );
    } catch (error) {
      console.log(error);
      setLoading(false)
      Swal.fire("Oops", "Something went wrong", "error");
    }
  }

  return (
    <div className="row">
      <div className="col-md-5">
      {loading && <Loader/>}
        <input
          type="text"
          placeholder="Room Name"
          className="form-control"
          style={{ margin: "4px 0" }}
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Rent Per Day"
          className="form-control"
          style={{ margin: "4px 0" }}
          required
          value={rentPerDay}
          onChange={(e) => SetRentPerDay(e.target.value)}
        />
        <input
          type="text"
          placeholder="Max Count"
          className="form-control"
          style={{ margin: "4px 0" }}
          required
          value={maxCount}
          onChange={(e) => setMaxCount(e.target.value)}
        />
        <input
          type="tel"
          placeholder="Phone Number"
          className="form-control"
          style={{ margin: "4px 0" }}
          required
          value={phonenumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <textarea
          className="form-control"
          placeholder="Description"
          style={{ margin: "4px 0" }}
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>

      <div className="col-md-5">
        <input
          type="text"
          placeholder="Type"
          className="form-control"
          style={{ margin: "4px 0" }}
          required
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image Url 1"
          className="form-control"
          style={{ margin: "4px 0" }}
          required
          value={imageUrl1}
          onChange={(e) => setImageUrl1(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image Url 2"
          className="form-control"
          style={{ margin: "4px 0" }}
          required
          value={imageUrl2}
          onChange={(e) => setImageUrl2(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image url 3"
          className="form-control"
          style={{ margin: "4px 0" }}
          required
          value={imageUrl3}
          onChange={(e) => setImageUrl3(e.target.value)}
        />

        <div className="text-right">
          <button className="btn btn-primary mt-2" onClick={addRoom}>
            Add Room
          </button>
        </div>
      </div>
    </div>
  );
}
