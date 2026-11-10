export async function onRequestGet({ request, env }) {
  const slug = new URL(request.url).searchParams.get("slug");
  const row = await env.DB.prepare(
    "SELECT title, category, summary, body, created_at FROM articles WHERE slug = ? AND published = 1"
  ).bind(slug).first();
  if (!row) return new Response("Not found", { status: 404 });
  return Response.json(row);
}
