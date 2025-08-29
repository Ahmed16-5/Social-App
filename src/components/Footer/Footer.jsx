import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-10">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-xl font-semibold mb-4 md:mb-0">
            Social<span className="text-blue-400">App</span>
          </h2>

          <div className="flex space-x-5">
            <a href="#" className="hover:text-blue-400 transition-colors">
              <FaFacebook size={20} />
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="hover:text-pink-400 transition-colors">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="hover:text-blue-300 transition-colors">
              <FaLinkedin size={20} />
            </a>
            <a href="#" className="hover:text-gray-400 transition-colors">
              <FaGithub size={20} />
            </a>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 mb-6">
          <a href="#" className="hover:text-white">
            About
          </a>
          <a href="#" className="hover:text-white">
            Privacy
          </a>
          <a href="#" className="hover:text-white">
            Terms
          </a>
          <a href="#" className="hover:text-white">
            Help
          </a>
          <a href="#" className="hover:text-white">
            Contact
          </a>
        </div>

        <p className="text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} SocialApp. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
 git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/Ahmed16-5/Social-App.git
git push -u origin main