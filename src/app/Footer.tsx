import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="mt-6 p-4 bg-gray-800 text-white text-center">
      <p>About Me</p>
      <p>
        Check out my GitHub repository:
        <a
          href="https://github.com/noxhsxrk"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline"
        >
          {" "}
          noxhsxrk
        </a>
      </p>
    </footer>
  );
};

export default Footer;
