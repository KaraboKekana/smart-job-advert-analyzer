"use client";

import { useState } from "react";
import Tesseract from "tesseract.js";

export default function Home() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [fileName, setFileName] = useState("");
  const [requirements, setRequirements] = useState<string[]>([]);
  const [summary, setSummary] = useState("");
  const [link, setLink] = useState(""); 

  const handleUpload = async (event: any) => {
    
    const file = event.target.files[0];
    if (!file) return;
    setText("");
    setEmail("");
    setDate("");
    setRequirements([]);
    setSummary("");
    setFileName(file.name);

    // Allow only images
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (JPG or PNG). PDF support coming soon.");
      return;
    }

    setLoading(true);

    try {
      const result = await Tesseract.recognize(file, "eng");
      const extractedText = result.data.text;

      setText(extractedText);

      // Detect email
      const emailMatch = extractedText.match(
        /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
      );

      // Detect closing date
      const dateMatch = extractedText.match(
        /\d{1,2}\s(March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar)/i
      );

      if (emailMatch) setEmail(emailMatch[0]);
      if (dateMatch) setDate(dateMatch[0]);

      // Detect requirements
      const lines = extractedText.split("\n");

      const detectedRequirements = lines.filter((line) =>
        line.toLowerCase().includes("must") ||
        line.toLowerCase().includes("require") ||
        line.toLowerCase().includes("degree") ||
        line.toLowerCase().includes("experience") ||
        line.toLowerCase().includes("age")
      );

      setRequirements(detectedRequirements);
      const jobSummary = `
Qualification: ${detectedRequirements.find(r => r.toLowerCase().includes("degree")) || "Not detected"}

Age Requirement: ${detectedRequirements.find(r => r.toLowerCase().includes("age")) || "Not detected"}

Closing Date: ${dateMatch ? dateMatch[0] : "Not detected"}

Application Email: ${emailMatch ? emailMatch[0] : "Not detected"}
`;
const linkMatch = extractedText.match(
  /(https?:\/\/[^\s]+)/i
);

if (linkMatch) setLink(linkMatch[0]);
{link && (
  <p className="mt-2 text-blue-400">
    🔗 Application Link: 
    <a href={link} target="_blank" className="underline ml-1">
      {link}
    </a>
  </p>
)}

setSummary(jobSummary);

    } catch (error) {
      console.error("OCR Error:", error);
      alert("Could not read the image. Please try another image.");
    }

    setLoading(false);
  };

  return (
  <main className="p-10">
    <h1 className="text-3xl font-bold mb-6">
      Job Advert Analyzer MVP
    </h1>

    <input type="file" accept="image/*" onChange={handleUpload} />

    {fileName && (
      <p className="mt-2 text-sm text-gray-300">
        Chosen file: {fileName}
      </p>
    )}

    {loading && (
      <p className="mt-4">
        Analyzing image...
      </p>
    )}

    {email && (
      <p className="mt-4 text-green-400">
        📧 Application Email: {email}
      </p>
    )}

    {date && (
      <p className="mt-2 text-yellow-400">
        📅 Closing Date: {date}
      </p>
    )}

    {summary && (
      <div className="mt-6 p-4 bg-blue-100 text-black rounded">
        <h2 className="text-xl font-semibold mb-2">
          Job Summary
        </h2>

        <pre className="whitespace-pre-wrap">
          {summary}
        </pre>
      </div>
    )}

    {requirements.length > 0 && (
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">
          Key Requirements
        </h2>

        <ul className="list-disc pl-6">
          {requirements.map((req, index) => (
            <li key={index}>{req}</li>
          ))}
        </ul>
      </div>
    )}

    {text && (
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">
          Extracted Text
        </h2>

        <pre className="bg-gray-100 p-4 rounded text-black whitespace-pre-wrap">
          {text}
        </pre>
      </div>
    )}
  </main>
);