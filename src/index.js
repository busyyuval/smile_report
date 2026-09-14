const RECIPIENT_EMAIL = "busyyuval@gmail.com";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/send-email") return handleSendEmail(request, env);
    return env.ASSETS.fetch(request);
  }
};

async function handleSendEmail(request, env) {
  if (request.method !== "POST") return json({ error: "הפעולה אינה נתמכת." }, 405);

  let data;
  try { data = await request.json(); } catch { return json({ error: "המידע שנשלח אינו תקין." }, 400); }

  const status = typeof data.status === "string" ? data.status.trim() : "";
  const note = typeof data.note === "string" ? data.note.trim() : "";
  if (!["מחייכת", "לא מחייכת"].includes(status)) return json({ error: "יש לבחור אחת מאפשרויות הדיווח." }, 400);
  if (note.length > 1000) return json({ error: "ההערה ארוכה מדי." }, 400);

  const emailText = ["התקבל דיווח חדש מדו״ח 2", "", `סטטוס: ${status}`, `הערה: ${note || "לא נכתבה הערה"}`].join("\n");

  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: "onboarding@resend.dev", to: RECIPIENT_EMAIL, subject: `דו״ח 2 — ${status}`, text: emailText })
    });
    if (!resendResponse.ok) {
      console.error("Resend error:", await resendResponse.text());
      return json({ error: "שליחת המייל נכשלה. נסי שוב." }, 500);
    }
    return json({ success: true });
  } catch (error) {
    console.error("Send email error:", error);
    return json({ error: "אירעה שגיאה בשליחת הדיווח." }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json; charset=UTF-8" } });
}
