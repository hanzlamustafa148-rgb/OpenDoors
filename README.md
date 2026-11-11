# OpenDoors 🏠

A full-stack Airbnb-style stay-listing app. Users can browse stays, filter by category, search by place, post their own listings with photos, review other listings, and see each property on an interactive map.

**Live demo:** [https://opendoors-project.onrender.com/](https://opendoors-project.onrender.com/)

> Hosted on a free tier, so the first load may take around 30–60 seconds while the server wakes up.

## Features

- **Authentication:** sign up, log in and log out using Passport.js (local strategy) with hashed passwords. Sessions are stored in MongoDB.
- **Listings CRUD:** create, view, edit and delete listings, each with title, description, price, location, country and category.
- **Image upload:** listing photos are uploaded through Multer to Cloudinary.
- **Authorization:** only a listing's owner can edit or delete it, and only a review's author can delete that review.
- **Reviews:** star rating and comment on each listing. Deleting a listing also deletes its reviews.
- **Search and filters:** search by title, location or country, and filter by 13 categories (Trending, Rooms, Mountains, Castles, Beach and more).
- **Interactive map:** the location is geocoded to coordinates (OpenStreetMap Nominatim) and shown on a Leaflet map.
- **Price toggle:** a switch shows prices with or without 18% GST.
- **Validation and error handling:** Joi validates listing and review input; a central error handler and 404 page cover failures.
- **Flash messages** for feedback after actions, and redirect-back-after-login.
- **Responsive UI** built with Bootstrap 5.

## Tech Stack

| Layer | Tools |
|---|---|
| Runtime / Server | Node.js, Express 5 |
| Database | MongoDB Atlas, Mongoose |
| Views | EJS, ejs-mate (layouts), Bootstrap 5, Font Awesome |
| Auth | Passport.js, passport-local-mongoose, express-session, connect-mongo |
| Uploads | Multer, Cloudinary |
| Validation | Joi |
| Maps | Leaflet, OpenStreetMap / Nominatim |

## Architecture

The project follows the **MVC pattern**: models define the data, controllers hold the logic, routes map URLs to controllers, and EJS templates render the views. Reviews are referenced from listings (one-to-many), and nested routes such as `/listings/:id/reviews` keep the URL structure RESTful.

```
├── app.js              # App setup, sessions, passport, error handling
├── models/             # Listing, Review, User (Mongoose schemas)
├── controllers/        # listing, reviews, users logic
├── routes/             # listing, review, user routers
├── middleware.js       # isLoggedIn, isOwner, isReviewAuthor, Joi validation
├── schema.js           # Joi schemas
├── cloudConfig.js      # Cloudinary + Multer storage
├── utils/              # wrapAsync, ExpressError, geocode
├── views/              # EJS templates (layouts, includes, listings, users)
├── public/             # CSS and client-side JS
└── init/               # Database seed scripts
```

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB Atlas cluster (or a local MongoDB)
- A free Cloudinary account

### Setup

```bash
git clone https://github.com/hanzlamustafa148-rgb/OpenDoors.git
cd OpenDoors
npm install
```

Create a `.env` file in the project root:

```env
ATLASDB_URL=your_mongodb_connection_string
SECRET=your_session_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

Optional: seed sample listings (check the connection string at the top of the file first):

```bash
node init/index.js
```

Start the server:

```bash
node app.js
```

Open **http://localhost:8080**.

## Routes

| Method | Route | Description | Access |
|---|---|---|---|
| GET | `/listings` | All listings (supports `?category=` and `?q=`) | Public |
| GET | `/listings/:id` | Listing details, reviews, map | Public |
| GET/POST | `/listings/new`, `/listings` | Create a listing | Logged in |
| GET/PUT | `/listings/:id/edit`, `/listings/:id` | Edit a listing | Owner |
| DELETE | `/listings/:id` | Delete a listing | Owner |
| POST | `/listings/:id/reviews` | Add a review | Logged in |
| DELETE | `/listings/:id/reviews/:reviewId` | Delete a review | Review author |
| GET/POST | `/signup`, `/login`, `/logout` | Authentication | Public |

## What I Learned

- Structuring an Express app with MVC and modular routers
- Session-based authentication and authorization with Passport.js
- Modeling one-to-many relationships in MongoDB and cleaning up with Mongoose middleware
- Handling file uploads with Multer and Cloudinary
- Validating input on the server with Joi
- Integrating third-party APIs (geocoding and maps)

## Future Improvements

- Booking and availability calendar
- Wishlist / favorites
- Automated tests
- Rate limiting and security headers (Helmet)
- A React frontend over a JSON API

## Author

**Hanzla Mustafa** · [LinkedIn](https://www.linkedin.com/in/hanzla-mustafa-7070313a9/) · [GitHub](https://github.com/hanzlamustafa148-rgb)
