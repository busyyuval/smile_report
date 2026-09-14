export default {
    async fetch(request) {

        const url = new URL(request.url);

        if (url.pathname === "/send-email") {
            return new Response("השרת קיבל את הלחיצה!");
        }

        return new Response("Not found", { status: 404 });
    }
};