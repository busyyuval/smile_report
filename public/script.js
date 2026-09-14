const button = document.querySelector("button");

button.addEventListener("click", async function() {

    const response = await fetch("/send-email");

    const text = await response.text();

    alert(text);
});