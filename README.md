# Promotional Activities Dashboard

A full-stack MERN application for managing promotional activities.

## Features

-   Create, view, edit, and delete promotional activities
-   Dashboard with key metrics and visualizations
-   Filter promotions by date range
-   Form validation for data integrity
-   Responsive design with Bootstrap 5

## Tech Stack

-   **Frontend**: React, Redux Toolkit, Bootstrap 5, React-Bootstrap
-   **Backend**: Node.js, Express
-   **Database**: MongoDB with Mongoose
-   **State Management**: Redux with Redux Toolkit
-   **Styling**: Bootstrap 5 and custom CSS

## Getting Started

### Prerequisites

-   Node.js (v14 or higher)
-   MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Install dependencies:
    ```
    npm install
    ```
3. Create a `.env` file in the root directory with the following variables:
    ```
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/promo-dashboard
    ```
    (Replace the MongoDB URI with your own if needed)

### Running the Application

1. Start the backend server:

    ```
    npm run server
    ```

2. In a separate terminal, start the frontend development server:

    ```
    npm run dev
    ```

3. Open your browser and navigate to the URL shown in your terminal (http://localhost:5173)

## Project Structure
### Frontend

-   `/src` - Frontend React application
    -   `/components` - React components
    -   `/store` - Redux store and slices
-   `/public` - Static assets

### Backend

-   `/bin` - Bin react
-   `/models` - Models folder
-   `/public` - Public folder
-   `/routes` - Routes folder
-   `/views` - Views templates


## API Endpoints

-   `GET /api/promotions` - Get all promotions
-   `POST /api/promotions` - Create a new promotion
-   `PUT /api/promotions/:id` - Update a promotion
-   `DELETE /api/promotions/:id` - Delete a promotion
