import React, { useState, useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { FaUndo, FaRedo } from "react-icons/fa"; // Import for Undo/Redo icons
import { toast } from "react-toastify";

const AddBlogModal = ({ show, onClose, onPost }) => {
  // Current state for form fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [metaDescription, setMetaDescription] = useState("");

  // State for undo/redo history
  // Each history entry is an object { title: string, content: string }
  const [pastStates, setPastStates] = useState([]); // Stores previous [title, content] pairs
  const [futureStates, setFutureStates] = useState([]); // Stores future [title, content] pairs for redo
  const [isTyping, setIsTyping] = useState(false); // Flag to debounce history saving

  const debounceTimeoutRef = useRef(null);
  // Key to solving the "multiple presses" issue:
  // A ref to signal if the state change is specifically due to an undo/redo action.
  const isNavigatingHistoryRef = useRef(false);

  // Effect to manage history when title or content changes
  useEffect(() => {
    // Determine if the current state is different from the last state in history
    const lastPastState = pastStates[pastStates.length - 1];
    const isCurrentStateDifferent =
      lastPastState?.title !== title || lastPastState?.content !== content;

    // Only save history if:
    // 1. User has paused typing (`!isTyping`)
    // 2. The current state is actually different from the last saved state (`isCurrentStateDifferent`)
    // 3. The change is NOT due to an undo/redo action (`!isNavigatingHistoryRef.current`)
    if (!isTyping && isCurrentStateDifferent && !isNavigatingHistoryRef.current) {
      setPastStates((prev) => {
        // Add the current state to the pastStates
        const newPast = [...prev, { title, content }];
        // Limit history size to prevent excessive memory usage
        // Keeps only the last 50 states, or fewer if the history isn't that long yet
        return newPast.slice(Math.max(newPast.length - 50, 0));
      });
      // Any new, non-history action (like typing or optimization) clears the redo history
      setFutureStates([]);
    }
  }, [title, content, isTyping, pastStates]); // Dependencies for useEffect

  // Helper function to handle input changes with debouncing
  const handleStateChange = (setter, value) => {
    setter(value); // Update the component's state immediately

    setIsTyping(true); // Indicate that the user is actively typing

    // Clear any existing debounce timeout to reset the timer
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set a new timeout. When this timeout fires, it means the user has paused typing.
    debounceTimeoutRef.current = setTimeout(() => {
      setIsTyping(false); // Signal that typing has finished, allowing useEffect to save history
    }, 500); // 500ms debounce time
  };

  const handleUndo = () => {
    // Ensure there are states in the past to undo to
    if (pastStates.length > 0) {
      // Set the flag to true to prevent useEffect from recording this state change
      isNavigatingHistoryRef.current = true;

      // Save the *current* state to futureStates, so it can be redone
      setFutureStates((prev) => [{ title, content }, ...prev]);

      // Get the last state from pastStates and remove it from the array
      const newPast = [...pastStates];
      const previousState = newPast.pop();
      setPastStates(newPast); // Update pastStates

      // Apply the previous state to the component's title and content
      if (previousState) {
        setTitle(previousState.title);
        setContent(previousState.content);
      }

      // Reset the flag after a short delay (0ms) to ensure the state update has propagated
      // before allowing new history records. This is crucial for fixing the "multiple presses" issue.
      setTimeout(() => {
        isNavigatingHistoryRef.current = false;
      }, 0);
    }
    // Special case: If pastStates is empty but there's still content,
    // it means we're at the very first state before any recorded changes.
    // Undo should revert to empty inputs.
    else if (title !== "" || content !== "") {
      isNavigatingHistoryRef.current = true;
      setFutureStates((prev) => [{ title, content }, ...prev]); // Save current non-empty state for redo
      setTitle("");
      setContent("");
      setTimeout(() => {
        isNavigatingHistoryRef.current = false;
      }, 0);
    }
  };

  const handleRedo = () => {
    // Ensure there are states in the future to redo
    if (futureStates.length > 0) {
      // Set the flag to true to prevent useEffect from recording this state change
      isNavigatingHistoryRef.current = true;

      // Save the *current* state to pastStates, so it can be undone again
      setPastStates((prev) => [...prev, { title, content }]);

      // Get the next state from futureStates and remove it from the array
      const newFuture = [...futureStates];
      const nextState = newFuture.shift();
      setFutureStates(newFuture); // Update futureStates

      // Apply the next state to the component's title and content
      if (nextState) {
        setTitle(nextState.title);
        setContent(nextState.content);
      }

      // Reset the flag after a short delay (0ms)
      setTimeout(() => {
        isNavigatingHistoryRef.current = false;
      }, 0);
    }
  };

  const handleOptimize = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required to optimize.");
      return;
    }

    // --- IMPORTANT: Save current state BEFORE the optimization API call ---
    // This allows the user to undo the optimization result if they don't like it.
    setPastStates((prev) => [...prev, { title, content }]);
    setFutureStates([]); // Optimization is a new action, so clear redo history

    try {
      const response = await fetch(
        "https://rashm-macq7mj4-eastus2.cognitiveservices.azure.com/openai/deployments/gpt-4o-mini/chat/completions?api-version=2025-01-01-preview",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key":
              "8hWstobpA36UxyYbYaVvDqDg045OdhhvNcTXcn0VO1faBm95wqUpJQQJ99BEACHYHv6XJ3w3AAAAACOGwu9c", // !!! SECURITY ALERT: Move this API key to an environment variable (.env file) for production !!!
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

      // Extract JSON from markdown if the API response wraps it
      if (contentStr.includes("```json")) {
        contentStr = contentStr
          .replace(/```json\s*/, "")
          .replace(/\s*```$/, "");
      }

      let parsed;
      try {
        parsed = JSON.parse(contentStr);
      } catch (err) {
        toast.error("Failed to parse AI response.");
        console.error("Parse error:", err);
        // If parsing fails, revert the history state that was added before the optimization attempt
        setPastStates((prev) => prev.slice(0, -1));
        return;
      }

      // Temporarily set the flag to true before updating state from optimization result
      isNavigatingHistoryRef.current = true;
      setTitle(parsed.title || title); // Use optimized title, or original if not provided
      setContent(parsed.optimized_content || content); // Use optimized content, or original if not provided
      setMetaDescription(parsed.meta_description || ""); // Set meta description
      toast.success("Content optimized successfully!");
      // Reset the flag after a short delay
      setTimeout(() => {
        isNavigatingHistoryRef.current = false;
      }, 0);
    } catch (error) {
      toast.error("Optimization failed.");
      console.error("Optimization error:", error);
      // If optimization fails, revert the history state that was added before the attempt
      setPastStates((prev) => prev.slice(0, -1));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Save current state BEFORE the submission attempt
    // This allows undoing the form clear if the post is successful
    setPastStates((prev) => [...prev, { title, content }]);
    setFutureStates([]); // Submission is a new action, so clear redo history

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", imageFile);
    formData.append("meta_description", metaDescription);

    const success = await onPost(formData); // Call the parent's onPost function

    if (success) {
      // Clear form fields on successful submission
      setTitle("");
      setContent("");
      setImageFile(null);
      setImagePreview(null);
      setMetaDescription("");
      // Clear history completely as a new blog has been posted and form is reset
      setPastStates([]);
      setFutureStates([]);
      toast.success("Blog posted successfully!");
      onClose(); // Close the modal
    } else {
      // If submission failed, revert the history state that was added before the attempt
      setPastStates((prev) => prev.slice(0, -1));
      toast.error("Failed to post blog. Please try again.");
    }
  };

  // If the 'show' prop is false, the modal should not be rendered
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl h-[550px] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-600 transition"
          aria-label="Close modal" // Good practice for accessibility
        >
          <IoMdClose size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-[#1B7B19]">
          Add a New Blog
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6">
          {/* Image Upload Section */}
          <div className="w-full md:w-1/3 flex flex-col items-center justify-center border border-dashed border-gray-400 rounded p-4">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Image Preview" // Accessibility
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

          {/* Text Inputs Section */}
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

            {/* Optional Meta Description Display */}
            {metaDescription && (
              <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 text-sm">
                <strong>Meta Description:</strong> {metaDescription}
              </div>
            )}

            <div className="flex justify-between items-center mt-4">
              {/* Undo/Redo Buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleUndo}
                  // Disable if no past states to revert to, OR if currently at initial empty state
                  disabled={pastStates.length === 0 && title === "" && content === ""}
                  className={`px-4 py-2 rounded flex items-center gap-1 ${
                    (pastStates.length === 0 && title === "" && content === "")
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                  title="Undo" // Tooltip for accessibility
                >
                  <FaUndo /> {/* Undo Icon */}
                  <span>Undo</span>
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
                  title="Redo" // Tooltip for accessibility
                >
                  <FaRedo /> {/* Redo Icon */}
                  <span>Redo</span>
                </button>
              </div>

              {/* Optimize and Post Buttons */}
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