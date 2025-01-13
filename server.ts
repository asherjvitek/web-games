import { serve } from Deno;

serve(async (_req) => {
    const filepath = new URL(_req.url).pathname;

    const filesize = (await Deno.stat(filepath)).size
    return new Response(filepath);
})
