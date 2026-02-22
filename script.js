async function analyze() {
  const text = document.getElementById("inputText").value;

  const response = await fetch("/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text })
  });

  const data = await response.json();

  document.getElementById("result").innerHTML = `
  <h3>Insight</h3>
  <p><strong>Word Count:</strong> ${data.words}</p>
  <p><strong>Sentences:</strong> ${data.sentences}</p>
  <p>${data.message}</p>
`;
}
