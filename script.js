function checkURL() {
  const input = document.getElementById("urlInput").value.trim();
  const result = document.getElementById("result");

  // Reset classes
  result.className = "result";
  result.classList.remove("hidden", "safe", "danger", "warning");

  if (!input) {
    result.classList.add("warning");
    result.innerHTML = "⚠️ Please enter a URL first.";
    return;
  }

  const warnings = [];

  // Check 1: Does it use HTTPS?
  if (!input.startsWith("https://")) {
    warnings.push("🔴 Does NOT use HTTPS — connection is not secure");
  }

  // Check 2: Suspicious keywords in URL
  const suspiciousWords = [
    "login", "verify", "secure", "update", "free",
    "prize", "winner", "bank", "confirm", "account",
    "password", "signin", "click", "urgent", "limited"
  ];
  suspiciousWords.forEach(word => {
    if (input.toLowerCase().includes(word)) {
      warnings.push(`🔴 Contains suspicious word: "<strong>${word}</strong>"`);
    }
  });

  // Check 3: IP address used instead of domain name
  if (/https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(input)) {
    warnings.push("🔴 Uses an IP address instead of a real domain name");
  }

  // Check 4: Unusually long URL
  if (input.length > 100) {
    warnings.push("🟡 URL is unusually long — common in phishing links");
  }

  // Check 5: Too many dots (fake subdomain tricks)
  const dotCount = (input.match(/\./g) || []).length;
  if (dotCount > 4) {
    warnings.push("🟡 Too many dots in URL — possible fake domain trick");
  }

  // Check 6: URL shorteners (hides real destination)
  const shorteners = ["bit.ly", "tinyurl", "t.co", "goo.gl", "rb.gy", "ow.ly", "cutt.ly", "is.gd"];
  shorteners.forEach(s => {
    if (input.includes(s)) {
      warnings.push(`🟡 Uses URL shortener (<strong>${s}</strong>) — real destination is hidden`);
    }
  });

  // Check 7: Special characters that look like real letters (homograph attack)
  if (/[àáâãäåæçèéêëìíîïðñòóôõöùúûüýþÿ]/i.test(input)) {
    warnings.push("🔴 Contains unusual characters — possible fake lookalike domain");
  }

  // Check 8: Multiple redirects signal (@)
  if (input.includes("@")) {
    warnings.push("🔴 Contains '@' symbol — may redirect to a different site");
  }

  // Show result
  if (warnings.length === 0) {
    result.classList.add("safe");
    result.innerHTML = `
      ✅ <strong>Looks Safe!</strong><br><br>
      No suspicious signs found in this URL.<br>
      <small>⚡ Always stay cautious — no checker is 100% perfect!</small>
    `;
  } else if (warnings.length <= 2) {
    result.classList.add("warning");
    result.innerHTML = `
      ⚠️ <strong>Be Careful! (${warnings.length} warning${warnings.length > 1 ? "s" : ""} found)</strong><br><br>
      ${warnings.join("<br>")}
    `;
  } else {
    result.classList.add("danger");
    result.innerHTML = `
      🚨 <strong>SUSPICIOUS URL! (${warnings.length} red flags found)</strong><br><br>
      ${warnings.join("<br>")}
    `;
  }
}

// Allow pressing Enter key to trigger check
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("urlInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter") checkURL();
  });
});
