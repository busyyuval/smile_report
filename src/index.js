export default {
    async fetch(request, env) {

        const url = new URL(request.url);

        if (url.pathname === "/send-email") {

            const response = await fetch("https://api.resend.com/emails", {
                method: "POST",

                headers: {
                    "Authorization": `Bearer ${env.RESEND_API_KEY}`,
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    from: "onboarding@resend.dev",
                    to: "busyyuval@gmail.com",
                    subject: "מישהו לחץ על הכפתור",
                    text: "מישהו לחץ עכשיו על הכפתור באתר!"
                })
            });

            if (response.ok) {
                return new Response("המייל נשלח!");
            }

            return new Response("שליחת המייל נכשלה", {
                status: 500
            });
        }

        return new Response("Not found", {
            status: 404
        });
    }
};