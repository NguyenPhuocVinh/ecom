import { useState, useEffect } from 'react';
import { FaShoppingCart, FaUser } from 'react-icons/fa'; 

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-[32px] left-0 w-full z-[50] h-[80px] transition-all duration-300 ease-in-out
        ${isScrolled ? 'bg-white shadow-md backdrop-blur-md' : 'bg-transparent'}`}
    >
      <div className="container mx-auto px-6 md:px-20 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold">
          <a href="/">FashionStore</a>
        </div>
        <nav className="hidden md:flex space-x-8 items-center">
          <a href="/products" className="hover:text-gray-600">Products</a>
          <a href="/categories" className="hover:text-gray-600">Categories</a>
          <a href="/about" className="hover:text-gray-600">About</a>
        </nav>
        <div className="hidden md:flex items-center space-x-6">
          <a href="/cart" className="hover:text-gray-600 flex items-center gap-2">
            <FaShoppingCart className="text-xl" /> 
            <span className="hidden md:inline">(0)</span> 
          </a>
          <a href="/login" className="hover:text-gray-600 flex items-center">
            <FaUser className="text-xl" />
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;
