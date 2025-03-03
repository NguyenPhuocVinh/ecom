import { useEffect, useRef } from 'react';

function TopHeader() {
  const marqueeRef = useRef(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (marquee) {
      marquee.style.animation = `marquee 20s linear infinite`;
    }
  }, []);

  return (
    <div className="bg-black text-white py-2 overflow-hidden fixed top-0 w-full z-[60]">
      <div ref={marqueeRef} className="whitespace-nowrap flex">
        <span className="text-sm">
          Welcome to Fashion Store - Enjoy 20% OFF your first order!
        </span>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); } 
          100% { transform: translateX(-100%); } 
        }
      `}</style>
    </div>
  );
}

export default TopHeader;
