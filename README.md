# Sermo

A chat application built with NextJS, Firebase, and Pusher. Click [here](https://sermo-arnnied.vercel.app) to view the live demo.

## Getting Started

1. Create a `.env` file in the root of the project and add the following:

```bash
API_URL=                            # The URL of your configured firebase functions
NEXT_PUBLIC_PUSHER_KEY=             # Your Pusher key
NEXT_PUBLIC_PUSHER_CLUSTER=         # Your Pusher cluster
```

2. Create another `.env` file in the `functions` directory and add the following:

```bash
PUSHER_APP_ID=                      # Your Pusher app ID
PUSHER_KEY=                         # Your Pusher key
PUSHER_SECRET=                      # Your Pusher secret
PUSHER_CLUSTER=                     # Your Pusher cluster
```

3. Install the dependencies:

```bash
yarn
# or
npm install
```

4. Run the Firebase functions:

```bash
cd functions
yarn serve
# or
npm run serve
```

5. Run the development server:

```bash
yarn dev
# or
npm run dev
```
