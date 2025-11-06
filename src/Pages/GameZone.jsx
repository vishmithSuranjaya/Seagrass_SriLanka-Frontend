import React, { useState } from 'react';
import Breadcrumb from "../components/breadcrumb/BreadCrumb";
import Pagination from '../components/pagination/Pagination';
import Cover_Image from '../assets/Cover Image.jpg';
import { IoLogoAndroid } from "react-icons/io";
import { FaWindows } from "react-icons/fa6";

const GameZone = () => {
  const gamesPerPage = 4;

  const [games] = useState([
    {
      id: 1,
      title: 'Seagrass Sri Lanka Game',
      description: 'Dive into the vibrant underwater world of Sri Lanka in this immersive game, exploring lush seagrass meadows, colorful corals, and diverse marine life including turtles, fishes, and octopuses. Experience the beauty of the ocean while engaging with a realistic and dynamic environment that brings the sea to life.',
      image: Cover_Image,
      url: 'https://pasanramyanath.github.io/Seagrass-Sri-Lanka-Game/',
      Instructions: 'Instructions for playing',
      InstructionDescription: 'Use W, A, S, D to move, and right-click + mouse to look around. Use Shift + move to sprint. When you get close to trash, a "Press E to collect trash" prompt will appear. Collect as much trash as possible within 150 seconds.',
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [playingGame, setPlayingGame] = useState(null);

  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = games.slice(indexOfFirstGame, indexOfLastGame);

  return (
    <div className="mt-24 px-4 sm:px-6 md:px-20 mb-10">
      <Breadcrumb />

      {!playingGame && (
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-8 w-full sm:w-4/5 mx-auto justify-center">
          <a
            href="https://onedrive.live.com/personal/AF944010F370B723/_layouts/15/download.aspx?UniqueId=0f81b70b%2Dad6d%2D4bb5%2D8ded%2Dab3884d64ae0"
            download
            className="flex-1 flex items-center justify-center gap-3 sm:gap-4 bg-[#00628b] bg-opacity-40 hover:bg-opacity-70 text-white text-lg sm:text-xl font-semibold px-4 py-4 sm:px-6 sm:py-6 rounded-3xl shadow-lg transition-all transform hover:scale-105"
          >
            <FaWindows className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            Download for Windows X64
          </a>
          <a
            href="https://onedrive.live.com/personal/AF944010F370B723/_layouts/15/download.aspx?UniqueId=159c73fe%2Dbd2c%2D4ea8%2Db195%2Ded4e7c46eeee"
            download
            className="flex-1 flex items-center justify-center gap-3 sm:gap-4 bg-[#00628b] bg-opacity-40 hover:bg-opacity-70 text-white text-lg sm:text-xl font-semibold px-4 py-4 sm:px-6 sm:py-6 rounded-3xl shadow-lg transition-all transform hover:scale-105"
          >
            <IoLogoAndroid className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            Download for Android
          </a>
        </div>
      )}

      {playingGame ? (
        <div className="flex flex-col items-center w-full">
          <button
            onClick={() => setPlayingGame(null)}
            className="self-start mx-10 mb-4 sm:mb-6 bg-orange-600 hover:bg-red-700 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-2xl"
          >
            Go Back
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-green-700 mb-4 sm:mb-6 text-center sm:text-left">{playingGame.title}</h1>
          <div className="w-full sm:w-4/5 h-[60vh] sm:h-[100vh] rounded-2xl shadow-lg overflow-hidden">
            <iframe
              src={playingGame.url}
              title={playingGame.title}
              className="w-full h-full"
              allow="fullscreen; autoplay; clipboard-write; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      ) : (
        <>
          {currentGames.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">No games available.</p>
          ) : (
            <>
              {currentGames.map((game) => (
                <div
                  key={game.id}
                  className="border rounded-2xl shadow-md p-4 sm:p-6 flex flex-col md:flex-row gap-4 sm:gap-6 items-start mb-8 sm:mb-12 hover:shadow-lg transition-shadow"
                >
                  <div className="w-full md:w-80 lg:w-96 flex-shrink-0">
                    <img
                      src={game.image || 'https://via.placeholder.com/400x200?text=No+Image'}
                      alt={game.title}
                      className="w-full h-auto object-contain rounded-2xl"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-green-700 font-semibold mb-2 text-lg sm:text-xl">{game.title}</h2>
                      <p className="text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base leading-relaxed">{game.description}</p>
                      <h3 className="text-green-700 font-semibold mb-1 sm:mb-2 text-base sm:text-lg">{game.Instructions}</h3>
                      <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">{game.InstructionDescription}</p>
                    </div>
                    <div className="flex justify-center md:justify-end mt-4 sm:mt-6">
                      <button
                        onClick={() => setPlayingGame(game)}
                        className="bg-[#1B7B19] hover:bg-green-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl text-sm sm:text-base"
                      >
                        Play Game Online
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {games.length > gamesPerPage && (
                <Pagination
                  totalBlogs={games.length}
                  blogsPerPage={gamesPerPage}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default GameZone;
