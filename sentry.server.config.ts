// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  Sentry.init({
    dsn: "https://498cb66b68b2cb4fecc7783f61679aa9@o4507133577068544.ingest.us.sentry.io/4507523373727744",

    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 1,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,

    // Uncomment the line below to enable Spotlight (https://spotlightjs.com)
    // spotlight: process.env.NODE_ENV === 'development',
    
  });
}
