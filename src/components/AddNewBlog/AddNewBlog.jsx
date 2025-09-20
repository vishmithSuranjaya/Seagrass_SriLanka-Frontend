import React, { useState, useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { FaUndo, FaRedo } from "react-icons/fa";
import { toast } from "react-toastify";

const AddBlogModal = ({ show, onClose, onPost }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [metaDescription, setMetaDescription] = useState("");

  const [pastStates, setPastStates] = useState([]);
  const [futureStates, setFutureStates] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const debounceTimeoutRef = useRef(null);
  const isNavigatingHistoryRef = useRef(false);

  // Track past states for undo/redo
  useEffect(() => {
    const lastPastState = pastStates[pastStates.length - 1];
    const isCurrentStateDifferent =
      lastPastState?.title !== title || lastPastState?.content !== content;

    if (!isTyping && isCurrentStateDifferent && !isNavigatingHistoryRef.current) {
      setPastStates((prev) => {
        const newPast = [...prev, { title, content }];
        return newPast.slice(Math.max(newPast.length - 50, 0));
      });
      setFutureStates([]);
    }
  }, [title, content, isTyping, pastStates]);

  const handleStateChange = (setter, value) => {
    setter(value);
    setIsTyping(true);
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => setIsTyping(false), 500);
  };

  const handleUndo = () => {
    if (pastStates.length > 0) {
      isNavigatingHistoryRef.current = true;
      setFutureStates((prev) => [{ title, content }, ...prev]);
      const newPast = [...pastStates];
      const previousState = newPast.pop();
      setPastStates(newPast);

      if (previousState) {
        setTitle(previousState.title);
        setContent(previousState.content);
      }
      setTimeout(() => (isNavigatingHistoryRef.current = false), 0);
    } else if (title !== "" || content !== "") {
      isNavigatingHistoryRef.current = true;
      setFutureStates((prev) => [{ title, content }, ...prev]);
      setTitle("");
      setContent("");
      setTimeout(() => (isNavigatingHistoryRef.current = false), 0);
    }
  };

  const handleRedo = () => {
    if (futureStates.length > 0) {
      isNavigatingHistoryRef.current = true;
      setPastStates((prev) => [...prev, { title, content }]);
      const newFuture = [...futureStates];
      const nextState = newFuture.shift();
      setFutureStates(newFuture);

      if (nextState) {
        setTitle(nextState.title);
        setContent(nextState.content);
      }
      setTimeout(() => (isNavigatingHistoryRef.current = false), 0);
    }
  };

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
            "api-key": "8hWstobpA36UxyYbYaVvDqDg045OdhhvNcTXcn0VO1faBm95wqUpJQQJ99BEACHYHv6XJ3w3AAAAACOGwu9c", 
          },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content: `You are an expert content writer, SEO specialist, and marine biologist specializing in seagrass ecosystems.
Your task is to:
1. Improve grammar, clarity, and readability of a blog post.
2. Optimize for SEO by incorporating relevant keywords naturally.
3. Suggest a meta description.
4. Suggest a title.
5. Confirm whether the article is truly about seagrass-related topics.

Return JSON strictly: 
{ "optimized_content": "...", "meta_description": "...", "title": "...", "is_seagrass_related": true/false, "reason": "short explanation" }

Blog post:
${content}`,
              },
            ],
            max_tokens: 3000,
            temperature: 0.7,
          }),
        }
      );

      const data = await response.json();
      let contentStr = data.choices?.[0]?.message?.content || "";
      if (contentStr.includes("```json")) {
        contentStr = contentStr.replace(/```json\s*/, "").replace(/\s*```$/, "");
      }
      const parsed = JSON.parse(contentStr);

      if (!parsed.is_seagrass_related) {
        toast.error("Content is Not about seagrass");
        return;
      }

      // Update fields with optimized content
      setTitle(parsed.title || title);
      setContent(parsed.optimized_content || content);
      setMetaDescription(parsed.meta_description || "");
      toast.success("Content optimized & validated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Optimization failed.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // POST with validation before sending to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Title and content cannot be empty.");
      return;
    }

    try {
      // Step 1: Validate content using Azure
      const validateResponse = await fetch(
        "https://rashm-macq7mj4-eastus2.cognitiveservices.azure.com/openai/deployments/gpt-4o-mini/chat/completions?api-version=2025-01-01-preview",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": "8hWstobpA36UxyYbYaVvDqDg045OdhhvNcTXcn0VO1faBm95wqUpJQQJ99BEACHYHv6XJ3w3AAAAACOGwu9c", 
          },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content: `
You are a marine biologist.
Check if this blog is about seagrass.
Return JSON: { "is_seagrass_related": true/false, "reason": "short explanation" }

Blog:
${content}`,
              },
            ],
            max_tokens: 300,
            temperature: 0,
          }),
        }
      );

      const validateData = await validateResponse.json();
      let contentStr = validateData.choices?.[0]?.message?.content || "";
      if (contentStr.includes("```json")) {
        contentStr = contentStr.replace(/```json\s*/, "").replace(/\s*```$/, "");
      }
      const parsed = JSON.parse(contentStr);

      if (!parsed.is_seagrass_related) {
        toast.error("Cannot post: Content does not seem related to seagrass. Please revise your blog.");
        return;
      }

      // Step 2: Post to backend
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("image", imageFile);
      formData.append("meta_description", metaDescription);

      const success = await onPost(formData);
      if (success) {
        setTitle("");
        setContent("");
        setImageFile(null);
        setImagePreview(null);
        setMetaDescription("");
        setPastStates([]);
        setFutureStates([]);
        toast.success("Blog posted successfully!");
        onClose();
      } else {
        toast.error("Failed to post blog. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Validation or posting failed.");
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

        <h2 className="text-2xl font-bold mb-4 text-[#1B7B19]">Add a New Blog</h2>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6">
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

          <div className="w-full md:w-2/3">
            <input
              type="text"
              placeholder="Blog Title"
              className="w-full mb-4 p-2 border border-gray-300 rounded"
              value={title}
              onChange={(e) => handleStateChange(setTitle, e.target.value)}
            />
            <textarea
              placeholder="Blog Content"
              className="w-full mb-4 p-2 border border-gray-300 rounded h-70"
              value={content}
              onChange={(e) => handleStateChange(setContent, e.target.value)}
            ></textarea>

            {metaDescription && (
              <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 text-sm">
                <strong>Meta Description:</strong> {metaDescription}
              </div>
            )}

            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={pastStates.length === 0 && title === "" && content === ""}
                  className={`px-4 py-2 rounded flex items-center gap-1 ${
                    pastStates.length === 0 && title === "" && content === ""
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  <FaUndo /> Undo
                </button>
                <button
                  type="button"
                  onClick={handleRedo}
                  disabled={futureStates.length === 0}
                  className={`px-4 py-2 rounded flex items-center gap-1 ${
                    futureStates.length === 0
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  <FaRedo /> Redo
                </button>
              </div>

              <div className="flex gap-2">
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlogModal;
