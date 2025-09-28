import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Linkedin } from "lucide-react";

import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";

export default function Footer() {
  return (
    <div className="footer bottom-0 w-full bg-[#1B7B18] text-white font-semibold">
      <footer className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {/* Column 1: Logo */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <img
              src="/seagrass-logo.png"
              alt="Seagrass Logo"
              className="h-24 sm:h-28 object-contain mb-3"
            />
            <h1 className="text-2xl font-bold">Seagrass Sri Lanka</h1>
          </div>

          {/* Column 2: Quick Links */}
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold mb-2">Quick Links</h2>
            <ul className="space-y-1 text-base">
              <li>
                <Nav.Link
                  as={Link}
                  to="/"
                  className="hover:text-lime-300 text-white"
                >
                  Home
                </Nav.Link>
              </li>
              <li>
                <Nav.Link
                  as={Link}
                  to="/news"
                  className="hover:text-lime-300 text-white"
                >
                  News
                </Nav.Link>
              </li>
              <li>
                <Nav.Link
                  as={Link}
                  to="/reports"
                  className="hover:text-lime-300 text-white"
                >
                  Reports
                </Nav.Link>
              </li>
              <li>
                <Nav.Link
                  as={Link}
                  to="/blog"
                  className="hover:text-lime-300 text-white"
                >
                  Blogs
                </Nav.Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold mb-2">Services</h2>
            <ul className="space-y-1 text-base">
              <li>
                <Nav.Link
                  as={Link}
                  to="/identify seagrass"
                  className="hover:text-lime-300 text-white"
                >
                  Identify Seagrass
                </Nav.Link>
              </li>
              <li>
                <Nav.Link
                  as={Link}
                  to="/game zone"
                  className="hover:text-lime-300 text-white"
                >
                  Play Game
                </Nav.Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold mb-2">Contact</h2>
            <p className="mb-1 text-base">+1097-015-2126</p>
            <p className="mb-1 text-base">
              <Nav.Link
                as={Link}
                to="/contact"
                className="hover:text-lime-300 text-white"
              >
                seagrass@master.com
              </Nav.Link>
            </p>
            <p className="mb-1 text-base">WhatsApp</p>
          </div>

          {/* Column 5: Social */}
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold mb-2">Social</h2>
            <div className="flex justify-center sm:justify-start space-x-5 mt-4">
              <Nav.Link
                href="https://www.facebook.com/groups/859502714156201/?ref=share&mibextid=NSMWBT"
                target="_blank"
                aria-label="Facebook"
              >
                <Facebook className="hover:text-lime-300" />
              </Nav.Link>
              <Nav.Link 
                href="https://www.linkedin.com/"
                target="_blank"
                aria-label="LinkedIn">
                <Linkedin className="hover:text-lime-300 transition-colors duration-200" />
              </Nav.Link>
            </div>
          </div>
        </div>

        {/* Divider and Copyright */}
        <hr className="my-6 border-white opacity-30" />
        <p className="text-center text-base font-semibold">
          © 2025 Seagrass Sri Lanka. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
