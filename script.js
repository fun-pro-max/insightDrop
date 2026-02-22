async function analyze() {
  const text = document.getElementById("inputText").value;
  const file = document.getElementById("fileInput").files[0];

  const formData = new FormData();

  if (text) formData.append("text", text);
  if (file) formData.append("file", file);

  const response = await fetch("/analyze", {
    method: "POST",
    body: formData
  });

  const data = await response.json();

  document.getElementById("result").innerHTML = `
    <h2>${data.app}</h2>
    <p><em>Mode: ${data.mode}</em></p>

    <h3>Summary</h3>
    <p>${data.summary}</p>

    <h3>Key Concepts</h3>
    <p>${data.keywords.join(", ")}</p>

    <h3>Stats</h3>
    <p>${data.wordCount} words • ${data.sentenceCount} sentences</p>
    <p>Estimated reading time: ${data.readingTime} min</p>
  `;
}