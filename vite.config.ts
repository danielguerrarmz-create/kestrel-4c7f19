import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Serve `api/contact.ts` under `npm run dev`, so the contact form is testable without deploying.
 *
 * WHY THIS EXISTS. Vercel builds `api/` as serverless functions and Vite knows nothing about them,
 * so `POST /api/contact` 404s locally. The form handles that correctly (a 404 is not ok, so it
 * shows the direct contact route rather than promising a reply) — which means the FAILURE path is
 * the only one you can exercise locally, and the success path could only ever be tested in
 * production, against the inbox real clients write to.
 *
 * IT MOUNTS THE SAME MODULE THE DEPLOYMENT RUNS, and that is the entire justification for a
 * dev-only shim existing at all. It imports `deliver()` from `api/contact.ts` — the same decision
 * table, the same validation, the same provider call — so this cannot drift into "works in dev,
 * different in production", which is the failure mode a hand-written mock would have. All it
 * supplies is the HTTP plumbing Vercel supplies in the cloud.
 *
 * Reading the key from `process.env` means it stays out of this repo: run with
 * `RESEND_API_KEY=re_... npm run dev` to exercise a real send, or plain `npm run dev` to get the
 * honest 503 and see exactly what a visitor sees today.
 *
 * `apply: 'serve'` — never part of a production build.
 */
function contactEndpointDev(): Plugin {
  return {
    name: 'bower:contact-endpoint-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/contact', async (req, res) => {
        const { deliver, FORM_INBOX } = await server.ssrLoadModule('/api/contact.ts');
        const send = (code: number, body: unknown) => {
          res.statusCode = code;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(body));
        };
        if (req.method === 'GET') {
          return send(200, { configured: Boolean(process.env.RESEND_API_KEY), inbox: FORM_INBOX });
        }
        if (req.method !== 'POST') return send(405, { ok: false, reason: 'method-not-allowed' });
        const chunks: Buffer[] = [];
        for await (const c of req) chunks.push(c as Buffer);
        let payload: { email?: string; source?: string };
        try {
          payload = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
        } catch {
          return send(400, { ok: false, reason: 'invalid-email' });
        }
        const result = await deliver(
          { email: payload.email ?? '', source: payload.source },
          process.env,
          new Date().toISOString(),
        );
        // eslint-disable-next-line no-console
        console.log('[api/contact]', payload.email, '->', JSON.stringify(result));
        send(result.ok ? 200 : result.status, result);
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), contactEndpointDev()],
  // Dedicated dev port. strictPort: fail loudly instead of drifting onto a
  // neighbour's port (5173 portfolio, 5188 LSSC, 8787 Axon also run locally).
  server: { port: 5333, strictPort: true, open: true },
  build: {
    // The three.js stack is inherently ~1 MB minified; it is split into its own
    // cached chunk below, so don't warn about it on every build.
    chunkSizeWarningLimit: 1100,
    rollupOptions: {
      output: {
        // Split the heavy 3D stack (three + fiber + drei, and react which they
        // depend on) from app code: app-code edits no longer re-ship ~1 MB.
        //
        // RENAMED FROM `three` ON 2026-07-21, because it stopped being three. Every
        // three.js importer is now behind the dev-only engine gate (Root.tsx), so a
        // production build reaches none of them and rollup shakes the 3D stack out
        // entirely — measured 1,067 kB -> 146 kB, and what is left is react-dom, not
        // three. The chunk kept working and its NAME had become a lie, which is the
        // kind of artifact this repo gets burned by. The three ids stay listed so the
        // split is already correct the day the engine comes back.
        manualChunks: {
          vendor: ['three', '@react-three/fiber', '@react-three/drei'],
          // posthog-js, dynamically imported from src/posthog.ts. Listed here ONLY to name it:
          // rollup derives a chunk name from the entry FILE and posthog's is `module.js`, so the
          // build printed a 230 kB chunk called `module` — exactly the kind of artifact the note
          // above is about. Naming a chunk does not make it eager; it is still loaded at idle.
          posthog: ['posthog-js'],
        },
      },
    },
  },
});
