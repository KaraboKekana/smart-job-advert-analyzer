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
  const [link, setLink] = useState("");

  const handleUpload = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    setText("");
    setEmail("");
    setDate("");
    setRequirements([]);
    setLink("");
    setFileName(file.name);

    if (!file.type.startsWith("image/")) {
     alert("Only image files are supported for now (JPG, PNG). PDF support coming soon.");
      return;
    }

    setLoading(true);

    try {
      const result = await Tesseract.recognize(file, "eng");
      const extractedText = result.data.text;

      setText(extractedText);

      const emailMatch = extractedText.match(
        /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
      );

      const dateMatch = extractedText.match(
        /\d{1,2}\s(March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar)/i
      );

      const linkMatch = extractedText.match(/(https?:\/\/[^\s]+)/i);

      if (emailMatch) setEmail(emailMatch[0]);
      if (dateMatch) setDate(dateMatch[0]);
      if (linkMatch) setLink(linkMatch[0]);

      const lines = extractedText.split("\n");

      const detectedRequirements = lines
        .map((line) => line.replace(/^>\s*/, "").trim())
        .filter(
          (line) =>
            line.toLowerCase().includes("must") ||
            line.toLowerCase().includes("require") ||
            line.toLowerCase().includes("degree") ||
            line.toLowerCase().includes("experience") ||
            line.toLowerCase().includes("age")
        );

      setRequirements(detectedRequirements);
    } catch (error) {
      console.error("OCR Error:", error);
      alert("Could not read the image.");
    }

    setLoading(false);
  };

  const qualification =
    requirements.find((r) => r.toLowerCase().includes("degree")) ||
    "Not detected";

  const age =
    requirements.find((r) => r.toLowerCase().includes("age")) ||
    "Not detected";

    const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  alert("Email copied to clipboard!");
};

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <div className="w-full max-w-2xl">

        {/* Title */}
        <h1 className="text-4xl font-bold mb-2 text-center">
          Smart Job Advert Analyzer
        </h1>

        <p className="text-xs text-center text-gray-500 mb-4">
          Built by Karabo Kekana
        </p>

        <p className="text-gray-400 text-center mb-6">
          Upload a job advert image (JPG or PNG) and instantly extract key details
        </p>

       {/* Upload */}
<label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-block mb-2">
  📤 Upload or Replace Job Advert
  <input
    type="file"
    accept="image/*"
    onChange={handleUpload}
    className="hidden"
  />
</label>

<p className="text-xs text-gray-500 mt-2">
  Supported formats: JPG, PNG (PDF coming soon)
</p>


        {fileName && (
          <p className="text-sm text-gray-300 mb-4">
            Chosen file: {fileName}
          </p>
        )}

        {loading && (
          <p className="text-blue-400 animate-pulse mb-4">
            🔍 Analyzing image...
          </p>
        )}

        <hr className="my-6 border-gray-700" />

       {/* Key Info */}
<div className="space-y-4">

  {email && (
    <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 hover:border-gray-500 transition w-full">
      <p className="text-xs text-gray-400">Application Email</p>

      <p className="text-green-400 text-sm break-all w-full">
        {email}
      </p>

      <button
        onClick={() => copyToClipboard(email)}
        className="mt-2 text-xs bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded w-fit"
      >
        📋 Copy
      </button>
    </div>
  )}

  {date && (
    <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 hover:border-gray-500 transition w-full">
      <p className="text-xs text-gray-400">Closing Date</p>
      <p className="text-yellow-400 text-sm">{date}</p>
    </div>
  )}

</div>

        {/* Link */}
        {link && (
          <div className="mt-4 mb-6 text-blue-400">
            🔗{" "}
            <a href={link} target="_blank" className="underline">
              Apply Here
            </a>
          </div>
        )}

        <hr className="my-6 border-gray-700" />

        {/* Summary */}
        {(email || date || requirements.length > 0) && (
          <div className="mt-8 bg-gray-800 p-4 rounded-2xl border border-gray-700 hover:border-gray-500 transition mb-6">
            <h2 className="text-lg font-semibold mb-2">Job Summary</h2>

            <p>
              <span className="text-gray-400">Qualification:</span>{" "}
              {qualification}
            </p>
            <p>
              <span className="text-gray-400">Age Requirement:</span> {age}
            </p>
            <p>
              <span className="text-gray-400">Closing Date:</span>{" "}
              {date || "Not detected"}
            </p>
            <p>
              <span className="text-gray-400">Application Email:</span>{" "}
              {email || "Not detected"}
            </p>
          </div>
        )}

        <hr className="my-6 border-gray-700" />

        {/* Requirements */}
        {requirements.length > 0 && (
          <div className="mt-8 bg-gray-800 p-4 rounded-2xl border border-gray-700 hover:border-gray-500 transition mb-6">
            <h2 className="text-lg font-semibold mb-2">Requirements</h2>

            <ul className="space-y-2">
              {requirements.map((req, index) => (
                <li key={index} className="text-gray-300">
                  • {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        <hr className="my-6 border-gray-700" />

        {/* Extracted Text */}
        {text && (
          <div className="mt-8 bg-gray-800 p-4 rounded-2xl border border-gray-700 hover:border-gray-500 transition">
            <h2 className="text-lg font-semibold mb-2">Extracted Text</h2>

            <pre className="text-sm text-gray-400 whitespace-pre-wrap">
              {text}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}