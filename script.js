function analyze() {
  const text = document.getElementById("inputText").value;

  if (!text) {
    alert("Paste something first");
    return;
  }

  const words = text.trim().split(/\s+/).length;
  const sentences = text.split(/[.!?]/).length - 1;

  document.getElementById("result").innerHTML = `
    <h3>Basic Insight</h3>
    <p><b>Word Count:</b> ${words}</p>
    <p><b>Sentences:</b> ${sentences}</p>
    <p>This confirms the frontend is fully working.</p>
  `;
}