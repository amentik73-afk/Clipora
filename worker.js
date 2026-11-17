
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const json = (data, status = 200) =>
      new Response(JSON.stringify(data), {
        status,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });

    if (url.pathname === "/api/health") {
      return json({
        status: "online",
        app: "Clipora",
        message: "Clipora backend is running"
      });
    }

    if (url.pathname === "/api/projects" && request.method === "POST") {
      let data;

      try {
        data = await request.json();
      } catch {
        return json({ error: "Invalid JSON" }, 400);
      }

      if (!data || (!data.videoUrl && !data.fileName)) {
        return json({
          error: "Please provide a video URL or file name"
        }, 400);
      }

      return json({
        success: true,
        project: {
          id: crypto.randomUUID(),
          status: "received",
          videoUrl: data.videoUrl || null,
          fileName: data.fileName || null,
          format: data.format || "9:16",
          language: data.language || "English",
          createdAt: new Date().toISOString()
        },
        message: "Project received. AI processing is not connected yet."
      }, 201);
    }

    return json({
      app: "Clipora",
      status: "online",
      endpoints: ["/api/health", "/api/projects"]
    });
  }
};
