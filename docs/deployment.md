# Deployment Guide

This guide covers deploying AI Resume Analyzer to **free-tier** platforms:

- **Frontend** → Vercel
- **Backend** → Render
- **AI Service** → Railway
- **Database** → Supabase (PostgreSQL)

---

## Prerequisites

- GitHub repository with the project
- Accounts: Vercel, Render, Railway, Supabase
- OpenAI API key

---

## 1. Database (Supabase)

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Settings → Database** and copy the connection string
3. Use format: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`
4. Enable connection pooling (port 6543) for serverless backends

---

## 2. Backend (Render)

1. Create a **Web Service** at [render.com](https://render.com)
2. Connect your GitHub repo and select the **backend** folder as root (or use monorepo setup)
3. **Build Command:** `mvn clean package -DskipTests`
4. **Start Command:** `java -jar target/ai-resume-analyzer-backend-1.0.0.jar`
5. **Environment Variables:**
   - `DATABASE_URL` – Supabase connection string
   - `JWT_SECRET` – Generate: `openssl rand -base64 32`
   - `AI_SERVICE_URL` – Your Railway AI service URL (set after step 3)

---

## 3. AI Service (Railway)

1. Create a new project at [railway.app](https://railway.app)
2. Deploy from GitHub, select **ai-service** folder (or use `railway.json` for monorepo)
3. **Environment Variables:**
   - `OPENAI_API_KEY` – Your OpenAI API key
4. Expose a public URL (Railway will assign one)
5. Copy this URL and set it as `AI_SERVICE_URL` in Render

---

## 4. Frontend (Vercel)

1. Create a project at [vercel.com](https://vercel.com)
2. Import from GitHub, set **Root Directory** to `frontend`
3. **Build Command:** `npm run build`
4. **Output Directory:** `dist`
5. **Environment Variables:**
   - `VITE_API_URL` – Your Render backend URL (e.g. `https://your-backend.onrender.com`)

For Vercel, the frontend needs to call the backend. Configure API proxy in `vite.config.ts`:

```ts
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || ''),
  },
})
```

And in `api.ts`, use:

```ts
baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api'
```

---

## 5. CORS

Ensure the backend allows your Vercel frontend origin:

```yaml
# application.yml (or Render env)
# Add CORS allowed origin for your Vercel URL
```

Create a `WebMvcConfigurer` or add CORS in `SecurityConfig`:

```java
@Bean
public CorsFilter corsFilter() {
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowCredentials(true);
    config.addAllowedOrigin("https://your-app.vercel.app");
    config.addAllowedHeader("*");
    config.addAllowedMethod("*");
    source.registerCorsConfiguration("/**", config);
    return new CorsFilter(source);
}
```

Or use an env variable for the allowed origin.

---

## Environment Variables Summary

| Service    | Variable       | Description                    |
|-----------|----------------|--------------------------------|
| Backend   | DATABASE_URL   | Supabase PostgreSQL URL        |
| Backend   | JWT_SECRET     | Base64-encoded secret (32+ bytes) |
| Backend   | AI_SERVICE_URL | Railway AI service URL         |
| AI Service| OPENAI_API_KEY | OpenAI API key                 |
| Frontend  | VITE_API_URL   | Render backend URL             |

---

## Docker Deployment (Alternative)

For self-hosting with Docker:

```bash
cd docker
export OPENAI_API_KEY=sk-...
export JWT_SECRET=$(openssl rand -base64 32)
docker-compose up -d
```

Ensure `DATABASE_URL` points to your PostgreSQL instance (e.g. Supabase or a VPS).

---

## Post-Deployment

1. Verify backend health: `GET https://your-backend.onrender.com/actuator/health`
2. Verify AI service: `GET https://your-ai-service.railway.app/health`
3. Test frontend login and resume upload flow
4. Monitor logs for errors on each platform
