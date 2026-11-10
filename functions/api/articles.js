export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    "SELECT id, title, slug, category, summary, created_at FROM articles WHERE published = 1 ORDER BY id DESC"
  ).all();
  return Response.json(results);
}

export async function onRequestPost({ request, env }) {
  const key = request.headers.get("x-admin-key");
  if (!env.ADMIN_KEY || key !== env.ADMIN_KEY) {
    return new Response("Wrong admin key", { status: 401 });
  }
  const a = await request.json();
  if (!a.title || !a.slug || !a.body) {
    return new Response("Title, slug and body are required", { status: 400 });
  }
  await env.DB.prepare(
    "INSERT INTO articles (title, slug, category, summary, body) VALUES (?, ?, ?, ?, ?)"
  ).bind(a.title, a.slug, a.category || "", a.summary || "", a.body).run();
  return Response.json({ ok: true });
}
