import { useEffect, useRef } from "react";

export default function TopHeader() {
    const marqueeRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const marquee = marqueeRef.current;
        if (marquee) {
            const contentWidth = marquee.scrollWidth;
            const duration = contentWidth / 60;
            marquee.style.animation = `marquee ${duration}s linear infinite`;

            marquee.addEventListener('mouseenter', () => {
                marquee.style.animationPlayState = 'paused';
            });
            marquee.addEventListener('mouseleave', () => {
                marquee.style.animationPlayState = 'running';
            });

            return () => {
                marquee.removeEventListener('mouseenter', () => { });
                marquee.removeEventListener('mouseleave', () => { });
            };
        }
    }, []);

    return (
        <div className="bg-black text-white overflow-hidden fixed top-0 w-full z-[60] h-8 flex items-center">
            <div
                ref={marqueeRef}
                className="whitespace-nowrap inline-block w-full"
            >
                <span className="text-xs px-4">
                    Welcome to Luxe Furniture - Get 15% OFF your first purchase!
                    Discover premium furniture for your home - Quality guaranteed!
                    Welcome to Luxe Furniture - Get 15% OFF your first purchase!
                </span>
            </div>
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
            `}</style>
        </div>
    );
}