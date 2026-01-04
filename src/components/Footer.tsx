
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-100 mt-12 py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-stone-500">
        <p>&copy; {new Date().getFullYear()} IYASAKA. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;