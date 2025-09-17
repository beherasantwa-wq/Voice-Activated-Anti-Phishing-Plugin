function analyzeUrl(url) {
  if (!url) return {score: 0, label: "No URL", reasons: ["No active tab URL found"]};

  let score = 0;
  let reasons = [];

  if (!url.startsWith("https://")) { score += 20; reasons.push("Not using HTTPS"); }
  if (url.length > 80) { score += 10; reasons.push("Long URL"); }
  if (url.includes("login") || url.includes("verify")) { score += 20; reasons.push("Suspicious keywords"); }
  if (url.includes("@")) { score += 10; reasons.push("Contains @ in URL"); }
  if (url.match(/\d+\.\d+\.\d+\.\d+/)) { score += 20; reasons.push("IP address in URL"); }

  let label = "Safe";
  if (score >= 60) label = "Danger";
  else if (score >= 30) label = "Caution";

  return {score, label, reasons};
}

function speak(text) {
  console.log("Speaking:", text);
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  speechSynthesis.speak(utter);
}

document.getElementById("checkBtn").addEventListener("click", () => {
  chrome.runtime.sendMessage({type: "GET_URL"}, (res) => {
    const data = analyzeUrl(res.url);
    document.getElementById("score").innerText = data.label + " (" + data.score + ")";
    const ul = document.getElementById("reasons");
    ul.innerHTML = "";
    data.reasons.forEach(r => {
      const li = document.createElement("li");
      li.innerText = r;
      ul.appendChild(li);
    });
    speak(data.label + ". Risk score " + data.score + " out of 100.");
  });
});

document.getElementById("testVoice").addEventListener("click", () => {
  speak("This is a test voice message from Suraksha Anti Phishing extension.");
});