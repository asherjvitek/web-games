import { typeByExtension } from "https://deno.land/std/media_types/mod.ts";
import { extname } from "https://deno.land/std/path/mod.ts";

Deno.serve(async (req) => {
    let path = new URL(req.url).pathname;

    if (path.endsWith("/")) {
        path = "/index.html";
    }

    try {
        const file = await Deno.open(`.${path}`);

        return new Response(file.readable, {
            headers: {
                "content-type": typeByExtension(extname(path))
            }
        });
    } catch (error) {
        if (error.code === "ENOENT") {
            return new Response("Not Found", { status: 404 });
        }

        return new Response("Internal Server Error", { status: 500 });
    }
})
