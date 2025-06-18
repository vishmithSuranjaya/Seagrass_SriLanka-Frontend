import React, { useEffect, useState } from "react";
import Breadcrumb from "../components/breadcrumb/BreadCrumb";

const FOLDER_ID = "1p7TD0Ox9-rj1uUje6jeQAsCXXXU-tSnN";
const API_KEY = "AIzaSyD-eO513O30n0KEjyobm3kpimOHFitcxwo";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchImages = async () => {
      let allFiles = [];
      let nextPageToken = null;

      try {
        do {
          const url = `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents&key=${API_KEY}&fields=nextPageToken,files(id,name,mimeType,thumbnailLink)&pageSize=100${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
          const res = await fetch(url);
          const data = await res.json();

          if (data.error) {
            setErrorMessage(data.error.message);
            return;
          }

          const imageFiles = data.files.filter((file) =>
            file.mimeType.startsWith("image/")
          );

          allFiles = [...allFiles, ...imageFiles];
          nextPageToken = data.nextPageToken;
        } while (nextPageToken);

        setImages(allFiles);
      } catch (error) {
        setErrorMessage("Failed to load images.");
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="mt-24 px-4 sm:px-10 lg:px-20 pb-20 max-w-7xl mx-auto">
      <Breadcrumb />
      <h1 className="text-4xl font-bold text-center text-green-700 mb-12">
        Gallery
      </h1>

      {errorMessage && (
        <div className="text-red-600 text-center mb-6 font-semibold">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((img) => (
          <div
            key={img.id}
            className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={img.thumbnailLink}
                alt={img.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
