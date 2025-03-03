function Footer() {
    return (
      <footer className="bg-black text-white py-8 mt-12">
        <div className="container mx-auto px-6 text-center md:text-left">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cột 1 */}
            <div>
              <h3 className="text-lg font-bold">Fashion Store</h3>
              <p className="mt-2 text-gray-400">
                Discover the latest fashion trends and exclusive discounts.
              </p>
            </div>
            {/* Cột 2 */}
            <div>
              <h3 className="text-lg font-bold">Quick Links</h3>
              <ul className="mt-2 space-y-2">
                <li><a href="/products" className="hover:text-gray-400">Products</a></li>
                <li><a href="/categories" className="hover:text-gray-400">Categories</a></li>
                <li><a href="/about" className="hover:text-gray-400">About</a></li>
              </ul>
            </div>
            {/* Cột 3 */}
            <div>
              <h3 className="text-lg font-bold">Contact Us</h3>
              <p className="mt-2 text-gray-400">Email: support@fashionstore.com</p>
              <p className="text-gray-400">Phone: +123 456 7890</p>
            </div>
          </div>
          <p className="mt-6 text-gray-500 text-sm">&copy; {new Date().getFullYear()} Fashion Store. All rights reserved.</p>
        </div>
      </footer>
    );
  }
  
  export default Footer;
  