# AskNutritionist Chatbot Plugin

This is a custom Node.js and Express-based plugin built for the AskNutritionist project. It serves as a backend service for handling chatbot message interactions, designed to eventually connect to an AI like ChatGPT.

## Features

- Accepts POST requests to `/api/chat` with user messages
- Returns formatted replies (mock data for now)
- Designed to integrate with a React-based frontend chat UI
- Configured to run locally on port 3001
- CORS-enabled for frontend connection

## Setup

1. Clone or download the repo
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm start
   ```

   The plugin will be available at `http://localhost:3001`.

## API Endpoint

### POST `/api/chat`

- **Request body:**
  ```json
  {
    "message": "Hello"
  }
  ```

- **Response body:**
  ```json
  {
    "reply": "This is a reply to: 'Hello'"
  }
  ```

## Technologies Used

- Node.js
- Express.js
- JavaScript (ES6)
- CORS

## Purpose

This plugin was developed as part of a Level UP internship project to simulate a chatbot backend. It is structured to support future integration with a real AI service such as OpenAI's GPT model.

## Author

Arslan Ali
