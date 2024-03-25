#!/bin/bash

# Navigate to the Rust application directory and run it in a new terminal
konsole --noclose -e bash -c 'cd website_backend/; echo "Starting Rust backend server..."; cargo run; exec bash' &

# Navigate to the React application directory, build the app, and start the development server in a new terminal
konsole --noclose -e bash -c 'cd website_spa/; echo "Building and starting React development server..."; npm install; npm run build; npm start; exec bash' &
