import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';

const SeagrassIdentify = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      const previewURL = URL.createObjectURL(file);
      setPreview(previewURL);
    } else {
      alert('Please select a valid image.');
    }
  };

  const handleClear = () => {
    setImage(null);
    setPreview(null);
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleIdentify = () => {
  if (!image) {
    toast.error("Please upload an image before identifying.");
    return;
  }
  console.log("Identifying seagrass from image:", image);
  toast.success("Image submitted for identification!");
};

  return (
    <div className="min-h-screen bg-white px-6 py-10 flex flex-col items-center mt-25">
      {/*react toast container */}
      <ToastContainer />

      {/* Description */}
      <div className="max-w-full mb-10">
        <p className="text-gray-900 text-sm sm:text-lg font-poppins leading-relaxed">
          Seagrasses are flowering marine plants found in shallow coastal waters, forming dense underwater meadows. Sri Lanka hosts about 15 species of seagrasses, distributed along its northern, eastern, western, and southern coastlines. These plants play a crucial role in maintaining healthy marine ecosystems by providing habitat and nursery grounds for fish, sea turtles, and other marine life.
          <br></br><br></br>
Beyond biodiversity support, seagrass meadows help stabilize coastlines, prevent erosion, and capture significant amounts of carbon, contributing to climate change mitigation. However, seagrasses face threats from coastal development, pollution, and climate change, making their identification and conservation critical for sustaining coastal environments.
        </p>
      </div>

      {/* Upload Section */}
      <div className="flex justify-center w-full">
        <div className="bg-gray-100 w-full sm:w-[500px] rounded-lg p-6 shadow-md">
          {/* File Input */}
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="fileInput"
                className="cursor-pointer inline-block bg-white text-gray-700 border border-gray-400 px-4 py-2 rounded-sm shadow-sm hover:bg-gray-100 transition"
              >
                📁 Browse Image
              </label>
              {image && (
                <span className="ml-3 text-sm text-gray-600 block sm:inline mt-2 sm:mt-0">{image.name}</span>
              )}
            </div>

            {image && (
              <button
                onClick={handleClear}
                className="mt-3 sm:mt-0 sm:ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-sm transition"
              >
                ❌ Clear
              </button>
            )}
          </div>

          {/* Preview */}
          {preview && (
            <div className="mb-4">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-auto rounded-md border border-gray-300"
              />
            </div>
          )}

          {/* Identify Button */}
          <button
            onClick={handleIdentify}
            className="bg-[#1B7B19] hover:bg-green-700 text-white px-4 py-2 rounded-sm transition-all duration-200 w-full"
          >
            Identify Seagrass
          </button>

          {/* Results */}
          <div className="bg-white w-full mt-6 p-4 rounded-sm shadow-sm">
            <h2 className="font-semibold text-lg mb-2">Results</h2>
            <p className="text-gray-600 italic">
              {image ? "Image ready for analysis." : "No results yet."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeagrassIdentify;
