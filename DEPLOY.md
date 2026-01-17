# Deploying R Mart to the Web

Since you mentioned you want to "publish it in google page without using localhost", you need to deploy your Next.js application.

The easiest way to do this is using **Vercel** (the creators of Next.js). It's free for personal projects and very easy to use.

## Option 1: Deploy using Vercel (Recommended)

1.  **Push to GitHub**:
    - Make sure your code is pushed to a GitHub repository.
    - If you haven't, run:
      ```bash
      git init
      git add .
      git commit -m "Initial commit"
      # Create a new repo on github.com and follow instructions to push
      ```

2.  **Import to Vercel**:
    - Go to [vercel.com](https://vercel.com/signup).
    - Sign up with GitHub.
    - Click "Add New..." -> "Project".
    - Select your `r-mart` repository.
    - Click **Deploy**.

3.  **Done!**:
    - Vercel will give you a live URL (e.g., `r-mart.vercel.app`).
    - You can share this link with anyone, and it will work on their phone/laptop.

## Option 2: Run "Build" Locally (for production simulation)

If you just want to run the optimized version locally:

1.  **Build the app**:
    ```bash
    npm run build
    ```
    This creates an optimized, production-ready version of your app.

2.  **Start the production server**:
    ```bash
    npm run start
    ```
    This runs the app on `localhost:3000` but much faster and smoother than `dev` mode.

## Admin Access in Production
- **User Login**: Use any mobile number + OTP `1234`.
- **Admin Login**:
  - Email: `admin@rmart.com`
  - Password: `admin123`
- **Address**: `your-production-url.vercel.app/admin`
