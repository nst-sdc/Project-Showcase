# Environment Variables Setup

For security reasons, environment variables should be stored in a `.env.local` file that is NOT committed to version control.

Create a file named `.env.local` in the project root with the following variables:

```
MONGODB_URI=mongodb+srv://your_username:<password>@cluster0.example.mongodb.net/?retryWrites=true&w=majority
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secure_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Replace the placeholder values with your actual credentials.

**IMPORTANT:** Never commit this file to Git or share it publicly.
