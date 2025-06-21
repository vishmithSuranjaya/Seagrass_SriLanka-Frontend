import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";

const AddBlogModal = ({ show, onClose, onPost }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [metaDescription, setMetaDescription] = useState("");

  const handleOptimize = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required to optimize.");
      return;
    }

    try {
      const response = await fetch(
        "https://rashm-macq7mj4-eastus2.cognitiveservices.azure.com/openai/deployments/gpt-4o-mini/chat/completions?api-version=2025-01-01-preview",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key":
              "8hWstobpA36UxyYbYaVvDqDg045OdhhvNcTXcn0VO1faBm95wqUpJQQJ99BEACHYHv6XJ3w3AAAAACOGwu9c", // move to env for security
          },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content:
                  "You are an expert content writer and SEO specialist. Your task is to: 1. Improve grammar, clarity, and readability of a blog post. 2. Optimize for SEO by incorporating relevant keywords naturally. 3. Suggest a meta description. Return the result as JSON wrapped in ```json with fields `optimized_content`, `meta_description`,`title`",
              },
              { role: "user", content: `\n${content}` },
            ],
            max_tokens: 3000,
            temperature: 0.7,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `API error: ${response.status}`);
      }

      let contentStr = data.choices?.[0]?.message?.content || "";

      // Extract JSON from markdown
      if (contentStr.includes("```json")) {
        contentStr = contentStr
          .replace(/```json\s*/, "")
          .replace(/\s*```$/, "");
      }

      let parsed;
      try {
        parsed = JSON.parse(contentStr);
      } catch (err) {
        toast.error("Failed to parse GPT response.");
        console.error("Parse error:", err);
        return;
      }

      setTitle(parsed.title || title);
      setContent(parsed.optimized_content || content);
      setMetaDescription(parsed.meta_description || "");
      toast.success("Content optimized successfully!");
    } catch (error) {
      toast.error("Optimization failed.");
      console.error("Optimization error:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // In the parent component of AddBlogModal
  const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  formData.append("image", imageFile);
  formData.append("meta_description", metaDescription);
 
  const success = await onPost(formData); // 🔁 Calls parent onPost
  if (success) {
    // clear form fields
  }
};


  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl h-[550px] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-600 transition"
        >
          <IoMdClose size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-[#1B7B19]">
          Add a New Blog
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-6"
        >
          {/* Image Upload */}
          <div className="w-full md:w-1/3 flex flex-col items-center justify-center border border-dashed border-gray-400 rounded p-4">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded mb-4"
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center text-gray-500 mb-4 bg-gray-100 rounded">
                No image selected
              </div>
            )}
            <div className="flex flex-col gap-2 w-full items-center">
              <label className="bg-[#1B7B19] text-white px-4 py-2 rounded cursor-pointer hover:bg-green-800 transition">
                Browse Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {imagePreview && (
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="px-4 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Clear Image
                </button>
              )}
            </div>
          </div>

          {/* Text Inputs */}
          <div className="w-full md:w-2/3">
            <input
              type="text"
              placeholder="Blog Title"
              className="w-full mb-4 p-2 border border-gray-300 rounded"
              value={title || ""}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Blog Content"
              className="w-full mb-4 p-2 border border-gray-300 rounded h-70"
              value={content || ""}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>

            {/* Optional Meta Description Display */}
            {metaDescription && (
              <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 text-sm">
                <strong>Meta Description:</strong> {metaDescription}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleOptimize}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Optimize
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#1B7B19] text-white rounded hover:bg-green-800"
              >
                Post
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlogModal;
