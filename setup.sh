#!/bin/bash

# Create .env.local file with environment variables
cat > .env.local << EOF
MONGODB_URI=mongodb+srv://arpitsarang2020:<db_password>@cluster0.md03rex.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=c7a1f9d8e6b4a3f2d1c9b8a7f6e5d4c3a2b1c0d9e8f7a6b5c4d3e2f1
CLOUDINARY_CLOUD_NAME=dmxdixmnr
CLOUDINARY_API_KEY=923814491748517
CLOUDINARY_API_SECRET=0YeZ158ncpADHqlYkRpp79q5O8Y
EOF

echo "Environment variables set up complete!"
echo "Don't forget to replace <db_password> with your actual MongoDB password in .env.local"
echo ""
echo "To run the project:"
echo "1. Install dependencies: npm install --legacy-peer-deps"
echo "2. Start the development server: npm run dev"
echo "3. Open http://localhost:3000 in your browser"
