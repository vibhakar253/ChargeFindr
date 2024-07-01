const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv').config();

const app = express();
const port = 7000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Error connecting to MongoDB:", err));

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: { type: String, unique: true, required: true },
});

const adminSchema = new mongoose.Schema({
  adminID: { type: String, unique: true, required: true },
  adminpassword: { type: String, required: true },
  adminemail: { type: String, unique: true, required: true },
});

const bookingSchema = new mongoose.Schema({
  stationName: { type: String, required: true },
  timeSlot: { type: String, required: true },
  connectorType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema, 'booking');
const User = mongoose.model('User', userSchema, 'Users');
const Admin = mongoose.model('Admin', adminSchema, 'Admins');

const stationSchema = new mongoose.Schema({
  area: String,
  name: String,
  address: String,
  contact: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  status: String,
  evports: Number,
  capacity: Number,
  connectorsType: [String],
  timeSlots: [{
    date: String, // You can use Date type if you prefer
    startTime: String,
    endTime: String
  }]
});

const Station = mongoose.model('Station', stationSchema, 'stations');

app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    console.log("Received registration request:", req.body);

    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) {
      return res.status(400).json({ error: "Username or email already exists" });
    }

    const newUser = new User({ username, password, email });
    await newUser.save();
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "An error occurred during registration" });
  }
});

app.post('/adminregister', async (req, res) => {
  const { adminID, adminemail, adminpassword } = req.body;

  try {
    const adminExists = await Admin.findOne({ adminemail });
    if (adminExists) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const newAdmin = new Admin({ adminID, adminemail, adminpassword });
    await newAdmin.save();
    res.status(200).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({ error: 'An error occurred while registering admin' });
  }
});

const writeStationsToFile = async () => {
  try {
    const stations = await Station.find();
    const filePath = path.join(__dirname, 'stations.json');
    fs.writeFileSync(filePath, JSON.stringify(stations, null, 2));
  } catch (error) {
    console.error('Error writing stations to file:', error);
  }
};

app.post('/stations', async (req, res) => {
  const { area, name, address, contact, location, evports, capacity, connectorsType, timeSlots } = req.body;

  try {
    const newStation = new Station({
      area,
      name,
      address,
      contact,
      location,
      evports,
      capacity,
      connectorsType,
      timeSlots // Include timeSlots
    });

    await newStation.save();
    await writeStationsToFile();
    res.status(200).json({ message: "Station created successfully" });
  } catch (error) {
    console.error("Error creating station:", error);
    res.status(500).json({ error: "An error occurred while creating the station" });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'username'); // Projection to include only the username field
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "An error occurred while fetching users" });
  }
});

app.get('/stations', async (req, res) => {
  try {
    const stations = await Station.find();
    res.status(200).json(stations);
  } catch (error) {
    console.error("Error fetching stations:", error);
    res.status(500).json({ error: "An error occurred while fetching stations" });
  }
});

app.get('/stations/:stationId', async (req, res) => {
  const stationId = req.params.stationId;

  try {
    const station = await Station.findById(stationId);
    if (station) {
      res.status(200).json(station);
    } else {
      res.status(404).json({ error: 'Station not found' });
    }
  } catch (error) {
    console.error('Error fetching station details:', error);
    res.status(500).json({ error: 'An error occurred while fetching station details' });
  }
});

app.delete('/stations/:id', async (req, res) => {
  const stationId = req.params.id;

  try {
    const station = await Station.findByIdAndDelete(stationId);

    if (!station) {
      return res.status(404).json({ error: 'Station not found' });
    }

    await writeStationsToFile();
    res.status(200).json({ message: 'Station deleted successfully' });
  } catch (error) {
    console.error('Error deleting station:', error);
    res.status(500).json({ error: 'An error occurred while deleting the station' });
  }
});

app.put('/stations/:id', async (req, res) => {
  const stationId = req.params.id;
  const { area, name, address, contact, location, evports, capacity, connectorsType, timeSlots } = req.body;

  try {
    const station = await Station.findById(stationId);

    if (!station) {
      return res.status(404).json({ error: 'Station not found' });
    }

    station.area = area;
    station.name = name;
    station.address = address;
    station.contact = contact;
    station.location = location;
    station.evports = evports;
    station.capacity = capacity;
    station.connectorsType = connectorsType;
    station.timeSlots = timeSlots;

    await station.save();
    await writeStationsToFile();
    res.status(200).json({ message: 'Station updated successfully' });
  } catch (error) {
    console.error('Error updating station:', error);
    res.status(500).json({ error: 'An error occurred while updating the station' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Received login request:", req.body);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    req.session.userId = user._id;
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.log('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.post('/admin', async (req, res) => {
  const { adminemail, adminpassword } = req.body;

  try {
    console.log("Received login request:", req.body);

    const user = await Admin.findOne({ adminemail });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    if (user.adminpassword !== adminpassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    req.session.userId = user._id;
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.log('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.post('/bookings', async (req, res) => {
  const { username, stationName, timeSlot, connectorType } = req.body;

  try {
    const newBooking = new Booking({
      username,
      stationName,
      timeSlot,
      connectorType
    });

    await newBooking.save();
    res.status(200).json({ message: "Booking created successfully" });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "An error occurred while creating the booking" });
  }
});

app.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "An error occurred while fetching bookings" });
  }
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});