import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import BreadCrumb from "../components/breadcrumb/BreadCrumb";
import { motion, AnimatePresence } from "framer-motion";

const SeagrassIdentify = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [annotatedImage, setAnnotatedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null); // ref for file input

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setAnnotatedImage(null);
    } else {
      alert("Please select a valid image.");
    }
  };

  const handleClear = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setAnnotatedImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // reset input so same file can be re-uploaded
    }
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleIdentify = async () => {
    if (!image) {
      toast.error("Please upload an image before identifying.");
      return;
    }

    setLoading(true);
    setResult(null);
    setAnnotatedImage(null);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to get prediction");
        setLoading(false);
        return;
      }

      setResult({
        prediction: data.prediction.replace(/_/g, " "),
        confidence: (data.confidence * 100).toFixed(2),
      });

      if (data.annotated_image) setAnnotatedImage(data.annotated_image);
      toast.success("Identification successful!");
    } catch (error) {
      toast.error("Network error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-20 flex flex-col mt-24 mb-10">
      <ToastContainer />
      <div className="pb-10">
        <BreadCrumb />
      </div>

      <div className="max-w-full mb-10">
        <p className="text-900 text-sm sm:text-xl font-poppins leading-relaxed font-serif">
          Seagrasses are flowering marine plants found in shallow coastal waters, forming dense underwater meadows. Sri Lanka hosts about 15 species of seagrasses, distributed along its northern, eastern, western, and southern coastlines. These plants play a crucial role in maintaining healthy marine ecosystems by providing habitat and nursery grounds for fish, sea turtles, and other marine life.
          <br /><br />
          Beyond biodiversity support, seagrass meadows help stabilize coastlines, prevent erosion, and capture significant amounts of carbon, contributing to climate change mitigation. However, seagrasses face threats from coastal development, pollution, and climate change, making their identification and conservation critical for sustaining coastal environments.
        </p>
      </div>

      <div className="flex flex-wrap mt-6 mb-10 justify-center w-full">
        <div className="bg-gray-100 w-full sm:w-[1000px] rounded-lg p-6 shadow-md">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef} // attach ref here
                className="hidden"
              />
              <label
                htmlFor="fileInput"
                className="cursor-pointer inline-block bg-white text-gray-700 border border-gray-400 px-4 py-2 rounded-sm shadow-sm hover:bg-gray-100 transition"
              >
                📁 Browse Image
              </label>
              {image && (
                <span className="ml-3 text-sm text-gray-600 block sm:inline mt-2 sm:mt-0">
                  {image.name}
                </span>
              )}
            </div>

            {image && (
              <button
                onClick={handleClear}
                className="mt-3 sm:mt-0 sm:ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-sm transition"
                disabled={loading}
              >
                Clear
              </button>
            )}
          </div>

          <button
            onClick={handleIdentify}
            disabled={loading}
            className="bg-[#1B7B19] hover:bg-green-700 text-white px-4 py-2 rounded-sm transition-all duration-200 w-full"
          >
            {loading ? "Identifying..." : "Identify Seagrass"}
          </button>

          {/* Results Section */}
          <div className="bg-white w-full mt-6 p-6 rounded-lg shadow-lg border-l-8 border-green-600">
            <h2 className="font-bold text-2xl mb-4 text-green-800 text-center">
              Results
            </h2>

            <AnimatePresence>
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="text-gray-700 text-center"
                >
                  <p className="text-xl mb-2">
                    <span className="font-semibold">Seagrass Type :</span>{" "}
                    <span className="text-green-700">{result.prediction}</span>
                  </p>
                  <p className="text-xl mb-2">
                    <span className="font-semibold">Confidence:</span>{" "}
                    <span className="text-blue-600">{result.confidence}%</span>
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-4 mt-2 overflow-hidden">
                    <div
                      className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${result.confidence}%` }}
                    ></div>
                  </div>
                </motion.div>
              ) : (
                <motion.p
                  key="no-result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-gray-500 italic text-center"
                >
                  {image ? "Image ready for analysis." : "No results yet."}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {(preview || annotatedImage) && (
            <div className="flex flex-col sm:flex-row justify-center items-start gap-6 mt-6">
              {preview && (
                <div className="w-full sm:w-1/2">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700 text-center">
                    Uploaded Image
                  </h3>
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-auto rounded-md border border-gray-300"
                  />
                </div>
              )}

              {annotatedImage && (
                <div className="w-full sm:w-1/2">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700 text-center">
                    Annotated Detection
                  </h3>
                  <img
                    src={annotatedImage}
                    alt="Detected Seagrass"
                    className="w-full h-auto rounded-md border border-gray-300"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeagrassIdentify;
