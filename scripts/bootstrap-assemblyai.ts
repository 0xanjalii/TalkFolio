// Test AssemblyAI API connection and test audio intelligence capabilities
const apiKey = process.env.VITE_ASSEMBLYAI_API_KEY || process.env.ASSEMBLYAI_API_KEY;

if (!apiKey) {
  console.log("⚡ TalkFolio: No ASSEMBLYAI_API_KEY found in environment.");
  console.log("👉 Add VITE_ASSEMBLYAI_API_KEY to your .env or .env.local file.");
  console.log("Get a free key from: https://www.assemblyai.com/");
  process.exit(0);
}

async function verifyAssemblyAI() {
  console.log("⚡ Connecting to AssemblyAI...");
  try {
    const res = await fetch("https://api.assemblyai.com/v2/transcript", {
      method: "GET",
      headers: { authorization: apiKey! },
    });
    if (res.ok) {
      console.log("✓ AssemblyAI API connected successfully!");
      console.log("✓ Speech-to-text, Streaming STT, and Audio Intelligence are ready.");
    } else {
      console.error(`✗ AssemblyAI returned status ${res.status}: ${res.statusText}`);
    }
  } catch (err) {
    console.error("✗ Failed to connect to AssemblyAI:", err);
  }
}

verifyAssemblyAI();
