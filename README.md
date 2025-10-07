<h1 align="center">Tutorr</h1>

<h2>Introduction</h2>

<p>
  <b>Tutorr</b> is a <b>marketplace-style freelancing platform</b> that connects teachers and students,
  enabling them to discover, connect, and schedule sessions seamlessly.
</p>

<br/>

<p>
  Built with a <b>modern monorepo architecture</b> using
  <a href="https://turbo.build/repo" target="_blank"> Turborepo</a>,
  Tutorr ensures scalability, modularity, and lightning-fast builds across multiple apps and packages.
</p>

---

##  Tech Stack

| Layer | Tech |
|-------|------|
| **Framework** | [Next.js](https://nextjs.org/), [Express.js](https://expressjs.com/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/) |
| **Message Queue** | [Redis](https://redis.io/), [BullMQ](https://docs.bullmq.io/) |
| **Object Storage** | [Cloudinary](https://cloudinary.com/) |
| **Authentication** | Built from scratch  |
| **UI** | TailwindCSS + ShadCN/UI + TypeScript |
| **Monorepo Tooling** | [Turborepo](https://turbo.build/repo) |
| **Deployment** | Vercel (web), EC2 (bgsvc) , EC2(worker-cron)|

---

<h2>Project Structure</h2>

<p>
The <b>Tutorr</b> monorepo is organized using <a href="https://turbo.build/repo" target="_blank">Turborepo</a>, ensuring modularity and separation of concerns between different services, packages, and shared logic.
</p>

```
tutorr/
├── apps/
│ ├── apps/ # Next.js frontend application (main web app)
│ ├── bgsvc/ # Background services , cron jobs and delayed notification service 
│ └── worker-cron/ # Worker to process bookings 
│
├── packages/
│ ├── common/ # Shared types, constants, and utility functions
│ ├── db/ # Prisma ORM schema and database client
│ ├── emails/ # Email templates and transactional mail logic
│ └── <default-folder>/ # Other shared resources or internal tooling
│
├── turbo.json # Turborepo configuration
├── package.json # Root dependency and script management
├── pnpm-workspace.yaml # Defines monorepo workspace structure
└── README.md # Project documentation
```
<h2> Setup Instructions</h2>

<p>
Follow these steps to set up <b>Tutorr</b> locally on your system.
</p>

---

<h3> Clone the Repository</h3>

```bash
git clone https://github.com/<your-username>/tutorr.git
cd tutorr
```

<h3>Add Environment Variables</h3> <p> You need to create <code>.env</code> files in the following locations: </p>

```bash
tutorr/
├── .env                # Root-level environment variables
├── apps/
│   ├── .env            # For frontend/backend app configurations
│
└── packages/
    └── db/
        └── .env        # Database configuration
```

<br/> 
<h4>Sample <code>.env</code> Configuration</h4>

```
# Env for apps/web folder
JWT_SECRET=
NEXT_PUBLIC_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_API_KEY= 
NEXT_PUBLIC_CLOUDINARY_API_SECRET=
REDIS_HOST ="localhost"
REDIS_PORT =6379
NEXT_PUBLIC_BACKEND_URL ="http://localhost:8001"
NEXT_PUBLIC_RAZORPAY_KEY =
RAZORPAY_SECRET_KEY=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
RAZORPAYX_ACCOUNT_NUMBER=
RAZORPAYX_SECRET =
RAZORPAYX_KEY_ID =


# Env for root

NEXT_PUBLIC_CLOUD_NAME="dmlnvdv3y"
NEXT_PUBLIC_CLOUDINARY_API_KEY="368237727792749"
NEXT_PUBLIC_CLOUDINARY_API_SECRET="y_HcSJ7oteNNww9Km_bTdhOTq14"
REDIS_URL=rediss://default:ATQDAAIncDIyZjJkZGFkNTM2NmQ0Nzg5YTA5NjVjYjhkYjNiMjk4M3AyMTMzMTU@delicate-octopus-13315.upstash.io:6379
REDIS_PORT =6379
RAZORPAY_KEY=rzp_test_RDppVjCb1nRJNQ
RAZORPAY_SECRET_KEY=GpMSC6B04srpjDrA8T0yBi1Z
RESEND_API_KEY=re_SUZz8F9m_BreDVEPaUXmRKxFvYfW6XunB
GMAIL_PASS =nrvrgsjmgmmzbpmq
GMAIL_USER =noreplytutorr@gmail.com
REDIS_HOST ="localhost"
NODE_ENV = "development"








