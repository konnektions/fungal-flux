fungal-flux

## Production Environment Variables

For the production deployment to work correctly, you must set the following environment variables in your Vercel project settings:

- `VITE_SUPABASE_URL`: The URL of your Supabase project.
- `VITE_SUPABASE_ANON_KEY`: The anonymous key for your Supabase project.

These variables are essential for connecting to the Supabase backend and ensuring the application functions as expected. Without them, the production build will fail.
