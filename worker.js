
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    const json = (data, status = 200) =>
      new Response(JSON.stringify(data), {
        status,
        headers: { ...headers, "Content-Type": "application/json" }
      });

    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    if (url.pathname === "/api/health") {
      return json({ app: "Clipora", status: "online" });
    }

    if (url.pathname === "/api/projects" && request.method === "POST") {
      let data;

      try {
        data = await request.json();
      } catch {
        return json({ error: "Invalid JSON" }, 400);
      }

      if (!data.videoUrl && !data.fileName) {
        return json({ error: "Video URL or file name required" }, 400);
      }

      return json({
        success: true,
        project: {
          id: crypto.randomUUID(),
          status: "received",
          videoUrl: data.videoUrl || null,
          fileName: data.fileName || null,
          format: data.format || "9:16",
          language: data.language || "English"
        },
        message: "Project received. AI processing is not connected yet."
      }, 201);
    }

    return env.ASSETS.fetch(request);
  }
};
