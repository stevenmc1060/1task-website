# 1task Sanity Studio

1. The Studio and website are connected to Sanity project `c7sbklat` and its `production` dataset.
2. From this directory run `npm install`, then `npm run dev`.
3. Add your website URL and `http://localhost:3000` as CORS origins in Sanity under **Settings → API settings**. Credentials are not needed for the public website.
4. Create an Author and a Post, then publish the Post. It will appear at `/learn/`.

Never add a Sanity API token to the website's browser JavaScript.
