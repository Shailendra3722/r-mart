# R-MART E-Commerce Application
## Detailed Project Report Documentation

---

**Project Name:** R-Mart E-Commerce Platform
**Domain:** E-Commerce / Full-Stack Web Development
**Architecture:** Next.js Serverless + MongoDB + Firebase

---

## 1. PROJECT OVERVIEW

R-Mart is a fully-featured, modern e-commerce web application utilizing the Next.js App Router. It is designed to provide users with a seamless browsing and purchasing experience, featuring advanced functionalities such as category-based filtering, product reviews, a comprehensive shopping cart, and Razorpay-integrated checkout. It balances a robust backend administration panel with an aesthetically pleasing, responsive frontend.

---

## 2. TECHNOLOGY STACK & LANGUAGES

### 2.1 Core Programming Languages
- **TypeScript (v5+)**: Used throughout the application for strong typing, better intellisense, and reducing runtime errors.
- **JavaScript (ES6+)**: Compiled output and for dynamic logic.
- **HTML5 & CSS3**: Core markup and styling paradigms.

### 2.2 Frameworks & Libraries
- **Frontend Framework:** Next.js (v16.1.3)
- **UI Library:** React (v19.2.3), React DOM (v19.2.3)
- **Styling:** Tailwind CSS (v4) paired with `clsx` and `tailwind-merge` for conditional class joining.
- **Animations:** Framer Motion (v12.26.2) for smooth component mount/unmount and micro-interactions.
- **Icons:** Lucide React (v0.562.0)
- **Data Visualization:** Recharts (v3.6.0) used in the Admin Dashboard for visual data plotting (Sales, Revenue, User growth).

### 2.3 Backend & Database
- **Backend Architecture:** Next.js API Routes (Serverless Functions)
- **Database:** MongoDB
- **ODM (Object Data Modeling):** Mongoose (v9.1.4)

### 2.4 Authentication & Third-Party Services
- **Authentication:** Firebase (v12.8.0) used for standard Email/Password, Google OAuth, and Phone Authentication. Session management via Next.js cookies/tokens.
- **Payment Gateway:** Razorpay (v2.9.6) integrated into the backend and frontend for processing online payments using standard UPI, Cards, and Netbanking.
- **AI Integration (Optional):** OpenAI (v6.22.0) included for advanced features like AI-based search or automated cataloging.

---

## 3. FILE & FOLDER STRUCTURE

The application follows the Next.js App Router conventions with organized module separation.

```text
/r-mart
├── public/                 # Static assets (images, fonts, svgs)
├── src/                    # Source Code Directory
│   ├── app/                # Next.js App Router root
│   │   ├── (auth)/         # Authentication routes (Login, Register - logic separated)
│   │   ├── (store)/        # User-facing store routes (Home, Products, Cart, Checkout, Contact)
│   │   ├── admin/          # Admin Dashboard routes (Products, Orders, Users, Settings)
│   │   ├── api/            # Backend Serverless API Endpoints
│   │   │   ├── admin/      # Admin-specific operations
│   │   │   ├── contact/    # Contact form submissions
│   │   │   ├── coupons/    # Discount coupon management
│   │   │   ├── health/     # Server health checking
│   │   │   ├── newsletter/ # Newsletter subscriptions
│   │   │   ├── notifications/# App notifications API
│   │   │   ├── orders/     # Order placement and tracking
│   │   │   ├── payments/   # Razorpay webhook and order creation
│   │   │   ├── products/   # Product CRUD operations
│   │   │   ├── reviews/    # Product review submission and fetches
│   │   │   └── users/      # User profile management
│   │   ├── globals.css     # Global Tailwind CSS and base styles
│   │   └── layout.tsx      # Root Application Layout wrapper
│   ├── components/         # Reusable React Components
│   │   ├── admin/          # Admin specific UI (Sidebar, Tables, Charts)
│   │   ├── animations/     # Framer Motion wrapper components
│   │   ├── notifications/  # Notification dropdowns/toasts
│   │   ├── reviews/        # Stars and Review components
│   │   ├── skeletons/      # Loading skeleton fallbacks for Suspense
│   │   ├── store/          # Store-specific UI (ProductCard, CartDrawer, Navbar)
│   │   ├── ui/             # Baseline custom UI (Buttons, Inputs, Modals)
│   │   └── user/           # User dashboard components
│   ├── context/            # React Context API providers (CartContext, AuthContext)
│   ├── lib/                # Utility functions (DB connection, Firebase config, Razorpay helpers)
│   └── models/             # Mongoose schemas and data models
│       ├── Admin.ts        # Admin schema definition
│       └── index.ts        # Aggregated database schema models
├── .env.local              # Environment Variables
├── next.config.ts          # Next.js Configuration
├── package.json            # Node.js dependencies
└── tailwind.config.mjs     # Tailwind Design System Configuration
```

---

## 4. DATABASE SCHEMA (MongoDB with Mongoose)

The project relies on a robust set of relational-style patterns implemented in a NoSQL environment.

### 4.1 Product Model
- `id` (String): Unique identifier.
- `name` (String): Product Title.
- `price` (Number): Current selling price.
- `originalPrice` (Number): MSRP / Original price for strikethrough.
- `description` (String): Detailed product description.
- `category` (String): e.g., 'men', 'women', 'kids'.
- `image` (String): Primary image URL.
- `images` (String[]): Array of secondary slider images.
- `stock` (Number): Remaining inventory.
- `discount` (Number): Calculated discount percentage.
- `rating` & `avgRating` (Number): Ratings logic.
- `reviews` & `reviewCount` (Number): Total review counts.
- `createdAt` & `updatedAt` (Date): Timestamps.

### 4.2 Order Model
- `id` (String): Unique Order ID.
- `userId` (String): Linking to Firebase Auth UID/System User.
- `date` (String): ISO Date String.
- `status` (String/Enum): 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'.
- `total` (Number): Grand total cost.
- `items` (Array of Objects): Snapshot of purchased items `(productId, name, price, quantity, image, selectedSize, selectedColor)`.
- `shippingAddress` (Object): `{name, mobile, pincode, address, landmark, city, state}`.
- `paymentMethod` (String): 'COD' or 'Online'.
- `paymentStatus` (String/Enum): 'Pending', 'Paid', 'Failed', 'Refunded'.
- `razorpayOrderId`, `razorpayPaymentId`, `razorpaySignature`: Verification tokens for online payments.
- `transactionId`, `paidAt`: For logging precise transaction states.
- `logistics`: Tracking variables `(courier, trackingId, awbNumber)`.

### 4.3 User Model
- `uid` (String): Firebase assigned User ID.
- `name`, `email`, `mobile` (String): Core user data.
- `role` (String/Enum): 'user', 'admin'. Maintains authorization depth.
- `photoURL` (String): Avatar image.
- `provider` (String): 'google', 'phone', 'email'.
- `joinedAt` (Date): Registration Timestamps.

### 4.4 Notification Model
- `id` (String).
- `type` (Enum): 'order', 'payment', 'delivery', 'account', 'product', 'system'.
- `title` & `message` (String): Notification text structure.
- `targetAudience` (Enum): 'admin', 'user', 'both'.
- `relatedId` & `relatedType`: 'order', 'product', 'user', 'payment'.
- `isRead` (Boolean): Notification toggles.

### 4.5 Additional Models
- **Contact:** `name`, `email`, `subject`, `message`, `read`, `createdAt`.
- **Subscriber:** `email`, `isActive`, `subscribedAt`.
- **Admin:** Separate collection for core administration (`username`, `password`, `email`).

---

## 5. API ENDPOINTS & ROUTES

The backend leverages Next.js App Router API Routes (`/api/...`), acting as RESTful conduits targeting MongoDB collections.

### 5.1 Authentication & Profile Module
- `POST /api/users/sync`: Synchronizes a Firebase Authentication user entity with the MongoDB User Collection.
- `GET /api/users/[id]`: Parses user dashboard configuration via session IDs.
- `PATCH /api/users/update`: Endpoint updating mutable profile details (phone numbers, display names).

### 5.2 Product Catalog Module
- `GET /api/products`: General query endpoint supporting parameterization for categories (`?category=men`), queries (`?search=shirt`), limit constraints, and sort metrics.
- `GET /api/products/[id]`: Specific dynamic routing to resolve detailed single product metrics.
- `POST /api/products` (Admin specific): Requires middleware verification. Pushes a new item into the inventory matrix.
- `PUT /api/products/[id]` (Admin specific): Resolves partial schema object changes like updating inventory count bounds.
- `DELETE /api/products/[id]` (Admin specific): Wipes product traces.

### 5.3 Checkout & Payment Module
- `GET /api/orders/user/[userId]`: Maps User IDs to relational Order records.
- `POST /api/orders/create`: Main checkout fulfillment trigger creating an order doc string based on user cart contents.
- `POST /api/payments/create-order`: Communicates specifically with razorpay SDK requesting an active sub-identifier token payload (`razorpay_order_id`).
- `POST /api/payments/verify`: Listens for Razorpay's finalized crypto-secured webhook validating whether the user successfully executed an online transaction.
- `PATCH /api/orders/[id]/status` (Admin Specific): Adjusts real-time shipment status from Pending -> Shipped -> Delivered. Includes trigger options referencing shipping data.

### 5.4 Form & Site Functionality Modules
- `POST /api/contact`: Form ingest capturing queries and funneling them into MongoDB's `Contact` collection.
- `POST /api/newsletter`: Adds addresses to the `Subscriber` repository for email marketing blasts.
- `GET /api/health`: Base configuration validation ping.

### 5.5 Administrative Aggregation API
- `GET /api/admin/dashboard`: Triggers multi-aggregate MongoDB pipelines fetching data sets for metrics (User Growth, Total Gross Volume, Average Order Value). Converts into JSON formats native for frontend `Recharts` consumption.

---

## 6. CORE APPLICATION WORKFLOWS

### 6.1 Customer Lifecycle Flow
1. Landing Page -> View `Hero` elements and Featured Products -> `Cart additions limit cached in frontend Context state memory`.
2. Login Requirement -> If proceeding to checkout, redirects handle FireBase Auth -> Trigger `users/sync` logic to preserve.
3. Address Phase -> Input strict form parameters (Pin, State, Address) into component controlled state.
4. Final Selection -> User executes COD (sends straight to `orders/create`) OR Executes Razorpay (creates instance -> overlays UI checkout interface -> verifies signature -> signals success -> saves).
5. Notification Dispatched -> `Notification Model` created and `Order` mapped for subsequent dashboard querying.

### 6.2 Administrator Lifecycle Flow
1. Custom Middleware Validation -> System requests Firebase session -> Cross-references against internal Database `Admin Accounts`.
2. Views real-time aggregated metrics and chart blocks.
3. Accesses `Products` sub-menu -> Dispatches REST triggers allowing CRUD lifecycle for standard objects.
4. Manages `Order` queues -> Views specific Order details -> Verifies payment traces natively inside dashboard without external jumping -> Manually flips delivery flags.

---

## 7. SYSTEM REQUIREMENTS AND OPERATIONAL DEPENDENCIES

### 7.1 Development Dependencies
- **Node.js**: Environment mapping >= v18.17 (v20+ recommended).
- **Package Manager**: NPM/Yarn/PNPM natively.
- **VCS**: Git (Required for staging and iterative production workflows).

### 7.2 Cloud Environment Dependencies
- **MongoDB Atlas Cluster**: Required an active replica set URI mapped cleanly into `.env.local` to process operations.
- **Firebase Project Console**: Specific OAuth API Key, Auth Domain, and App IDs required for login handshake completion.
- **Razorpay Sandbox/Live Account**: Access Keys mandatory explicitly if `Online Payment` methods are fully integrated within the application's runtime.

*Documentation accurately tracks R-Mart codebase logic up to the most recent Next.js 16.1.3 updates and provides a comprehensive breakdown to guide 70+ pages of elaborations on technical decisions, design logic mapping, integration trials, ER diagrams representations, and final code outcomes.*
