# Sharon Lost + Found

A welcoming, mobile-first lost-and-found board for Sharon residents. Residents can add a found item with a photo, browse and search the board, suggest an owner by text, and mark a find as claimed.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## SMS notifications

The “Know whose it is?” form sends a text through Twilio when these Vercel environment variables are configured:

```bash
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_PHONE_NUMBER
```

Without those variables, the board remains usable and clearly reports that SMS is not connected. Use `.env.example` as the starting point for local configuration.

## Print code

The bottom of the live site has a QR code for `https://sharonlostandfound.viraat.dev`; use the **Print the code** action to make a lobby poster.
