import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';

export default function Footer() {
  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-green-700 text-white">
      <footer className="px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          
          {/* Column 1: Logo with image */}
          <div>
            <div className="mb-4">
              <img
                src="/seagrass-logo.png"
                alt="Seagrass Logo"
                className="w-65 h-48 object-contain mt-2"
              />
              <h1 className="text-2xl font-bold mb-2">Seagrass Sri Lanka</h1>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h2 className="text-xl font-bold mb-2">Quick Links</h2>
            <ul className="space-y-1 text-base">
              <li><Nav.Link as={Link} to="/" className="hover:text-lime-300 text-white transition-colors duration-200">Home</Nav.Link></li>
              <li><Nav.Link as={Link} to="/news" className="hover:text-lime-300 text-white transition-colors duration-200">News</Nav.Link></li>
              <li><Nav.Link as={Link} to="/reports" className="hover:text-lime-300 text-white transition-colors duration-200">Reports</Nav.Link></li>
              <li><Nav.Link as={Link} to="/blogs" className="hover:text-lime-300 text-white transition-colors duration-200">Blogs</Nav.Link></li>
              <li><Nav.Link as={Link} to="/articles" className="hover:text-lime-300 text-white transition-colors duration-200">Articles</Nav.Link></li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h2 className="text-xl font-bold mb-2">Services</h2>
            <ul className="space-y-1 text-base">
              <li><Nav.Link as={Link} to="/news" className="hover:text-lime-300 text-white transition-colors duration-200">News</Nav.Link></li>
              <li><Nav.Link as={Link} to="/reports" className="hover:text-lime-300 text-white transition-colors duration-200">Reports</Nav.Link></li>
              <li><Nav.Link as={Link} to="/blogs" className="hover:text-lime-300 text-white transition-colors duration-200">Blog</Nav.Link></li>
              <li><Nav.Link as={Link} to="/courses" className="hover:text-lime-300 text-white transition-colors duration-200">Courses</Nav.Link></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h2 className="text-xl font-bold mb-2">Contact</h2>
            <p className="mb-1 text-base">+1097-015-2126</p>
            <p className="mb-1 text-base">
              <Nav.Link as={Link} to="/contact" className="hover:text-lime-300 text-white transition-colors duration-200">
                seagrass@master.com
              </Nav.Link>
            </p>
            <p className="mb-1 text-base">WhatsApp</p>
          </div>

          {/* Column 5: Social */}
          <div>
            <h2 className="text-xl font-bold mb-2">Social</h2>
            <div className="flex space-x-6 mt-4 pl-10">
              <Nav.Link as={Link} to="/facebook" aria-label="Facebook">
                <Facebook className="hover:text-lime-300 transition-colors duration-200" />
              </Nav.Link>
              <Nav.Link as={Link} to="/instagram" aria-label="Instagram">
                <Instagram className="hover:text-lime-300 transition-colors duration-200" />
              </Nav.Link>
              <Nav.Link as={Link} to="/twitter" aria-label="Twitter">
                <Twitter className="hover:text-lime-300 transition-colors duration-200" />
              </Nav.Link>
              <Nav.Link as={Link} to="/youtube" aria-label="YouTube">
                <Youtube className="hover:text-lime-300 transition-colors duration-200" />
              </Nav.Link>
            </div>
          </div>
        </div>

        <hr className="my-6 border-white opacity-30" />
        <p className="text-center text-base font-semibold">
          © 2025 Seagrass Sri Lanka. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
