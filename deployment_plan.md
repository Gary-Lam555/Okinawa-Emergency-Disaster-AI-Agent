# Okinawa Emergency Portal (OkiSafe AI) - Deployment Plan

This deployment plan outlines options for hosting the **OkiSafe AI** static web application. Because the application is a zero-dependency HTML5, CSS3, and ES6 client-side app, it is highly resilient, extremely fast, and can be deployed to global Content Delivery Networks (CDNs) for free. 

Global CDNs are highly recommended for disaster portals because they distribute traffic across edge servers, preventing crashes during local traffic surges or regional network outtages.

---

## ⚡ Option 1: GitHub Pages (Recommended for Open Source)
GitHub Pages hosts static files directly from a GitHub repository.

1. **Create Repository**: Push your code to a GitHub repository (e.g. `https://github.com/yourusername/okisafe-ai`).
2. **Configure Pages**:
   - Go to your repository **Settings**.
   - Scroll down to the **Pages** menu on the left sidebar.
   - Under **Build and deployment**, select **Deploy from a branch**.
   - Under **Branch**, select `main` (or `master`) and folder `/ (root)`.
   - Click **Save**.
3. **Live Access**: Your site will be live at `https://yourusername.github.io/okisafe-ai/` within minutes.

---

## ☁️ Option 2: Cloudflare Pages (Recommended for Maximum Resilience)
Cloudflare's CDN has supreme DDoS protection and edge performance.

1. **Create Cloudflare Account**: Log in to the Cloudflare dashboard.
2. **Deploy Site**:
   - Go to **Workers & Pages** -> **Create application** -> **Pages**.
   - Connect your GitHub account and select your `okisafe-ai` repository.
   - Leave the build settings empty (since it is a static app with no build commands).
   - Set the output directory to `.` or `/`.
   - Click **Save and Deploy**.
3. **Live Access**: Your site will be live at `https://okisafe-ai.pages.dev/`. You can also configure a custom domain with free SSL.

---

## 🚀 Option 3: Vercel or Netlify (Quickest Drag-and-Drop)
For instant hosting without command line setups:

### Netlify:
1. Log in to [Netlify](https://www.netlify.com/).
2. Go to your Team dashboard and scroll to the bottom.
3. Drag and drop your local `CapstoneProject` folder directly into the **"Want to deploy a new site without connecting to Git?"** box.
4. Netlify will generate a live URL instantly.

### Vercel:
1. Install the Vercel CLI or connect Vercel to your GitHub account.
2. If using CLI, run `npm install -g vercel && vercel` in the project directory.
3. Follow the CLI prompts to deploy instantly.

---

## 🛠️ Local Offline Deployment (For Emergency Workers)
During local network cuts, the app can be run locally off-grid:

1. **Zip Archive**: Pack the `CapstoneProject` folder into a `.zip` archive.
2. **USB Distribution**: Distribute the archive to local emergency services, municipal officials, and shelters via USB drives.
3. **Direct Launch**: Users can unzip the folder on any computer or phone and double-click `index.html` to run the portal fully offline with the simulated AI Agent.
