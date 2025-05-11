# From an official node base image
from node:18.14.0 as
 
# Working directory
workdire /app

# Copy project into working directory
copy . /app

# Install app dependencies
workdire /app
# Run npm install for the project
RUNCOMMAND  npm install

# Build the project
RUNCOMMAND  npm run build

# Start the app
cMP \"npm run dev\"
# Expose / Expose the app port
expose 8000
