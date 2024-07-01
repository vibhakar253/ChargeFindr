


# ChargeFindr

ChargeFindr is a web application designed to help users find and book electric vehicle (EV) charging stations. It also includes an admin interface for managing charging stations and time slots.

![ChargeFindr](./assets/FindJuice.png)

## Table of Contents

1. [Features](#features)
2. [Technology Stack](#technology-stack)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Admin Interface](#admin-interface)
6. [Booking Process](#booking-process)
7. [Environment Variables](#environment-variables)
8. [File Structure](#file-structure)
9. [Contributing](#contributing)

## Features

- **User Registration and Login**: Secure authentication for users.
- **Station Finder**: Locate nearby EV charging stations on Google Maps.
- **Booking System**: Reserve time slots for charging vehicles.
- **Admin Management**: Add and manage stations and slots.
- **Interactive UI**: Smooth navigation and intuitive interface.
- **Real-time Directions**: Get directions to the selected station.

## Technology Stack

- **Frontend**: React, Vite, React Icons, Google Maps API, Geolocation API, GSAP.
- **Backend**: Node.js, Express, MongoDB, Mongoose.
- **Styling**: CSS, including custom scrollbar styles and responsive design.

## Installation

### Prerequisites

- Node.js (>= v14.0.0)
- npm or yarn
- MongoDB instance (local or cloud)

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/chargefindr.git
   cd chargefindr
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory with the following variables:
   ```bash
   MONGO_URI=your_mongo_connection_string
   REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The app will be available at `http://localhost:3000`.

5. **Run the Backend Server**:
   ```bash
   npm run server
   # or
   yarn server
   ```

   The backend server will be running on `http://localhost:5000`.

## Usage

### User Interface

- **Home Page**: Allows users to search for nearby charging stations.
- **Find Stations**: Shows available stations on a map.
- **Booking Page**: Select a station, choose a connector type, date, and time slot for booking.
- **Profile**: View and manage your bookings.

### Admin Interface

Accessible by navigating to the `/admin` path.

1. **Login**: Admin login using predefined credentials.
2. **Dashboard**: Manage stations and time slots.
3. **Add New Station**: Add details of a new charging station.
4. **Edit Slots**: Modify existing slots for a station.

### Booking Process

1. **Search for Stations**: Use the search bar to find stations based on location.
2. **Select a Station**: Click on a station to view details.
3. **Choose Connector Type and Time Slot**: Pick a connector and available time.
4. **Confirm Booking**: Finalize your booking and receive a confirmation.

## Environment Variables

| Variable                        | Description                                    |
|---------------------------------|------------------------------------------------|
| `MONGO_URI`                     | MongoDB connection string                      |
| `REACT_APP_GOOGLE_MAPS_API_KEY` | API key for Google Maps services               |



## Contributing

We welcome contributions! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push the branch to your fork.
4. Submit a pull request with a detailed description of your changes.

