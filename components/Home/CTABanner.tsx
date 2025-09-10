"use client"
import { useEffect, useState } from 'react';
const ConstellationBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="banner-container">
      <div className="stars-background">
        {[...Array(25)].map((_, i) => (
          <div key={i} className="star" style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`
          }}></div>
        ))}
      </div>
      
      <div className={`banner-content ${isVisible ? 'visible' : ''}`}>
        <div className="top-text">
          <span className="new-collection-text">New Collection Is Out Now!</span>
        </div>
        
        <div className="main-content">
          <p className="description-text">
            The origins of the first constellations date back to prehistoric times. Their purpose was to tell stories of their beliefs, experiences, creation, or mythology.
          </p>
          
          <div className="constellation-word">
            <span className="constellation-text">WORLD IN</span>
            <span className="constellation-o">O</span>
          </div>
          
          <div className="decoration-element">
            <div className="celestial-line"></div>
            <div className="celestial-dot"></div>
            <div className="celestial-line"></div>
          </div>
        </div>
        
        <button className="explore-button">
          Discover Now
          <span className="button-arrow">→</span>
        </button>
      </div>

      <style jsx>{`
        .banner-container {
          position: relative;
          height: 55vh;
          min-height: 380px;
          max-height: 550px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #fff5f5 0%, #ffe6e6 50%, #ffd6d6 100%);
          color: #333;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          overflow: hidden;
          padding: 1.5rem;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(255, 105, 180, 0.15);
        }
        
        .stars-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .star {
          position: absolute;
          background-color: #ff85a2;
          border-radius: 50%;
          animation: twinkle 3s infinite ease-in-out;
          opacity: 0.5;
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        
        .banner-content {
          max-width: 800px;
          text-align: center;
          opacity: 0;
          transform: translateY(15px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
          z-index: 2;
          padding: 2rem;
        }
        
        .banner-content.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .top-text {
          margin-bottom: 1.5rem;
        }
        
        .new-collection-text {
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #ff4d8d;
          opacity: 0.9;
        }
        
        .description-text {
          max-width: 500px;
          margin: 0 auto 2rem;
          font-size: 0.95rem;
          line-height: 1.6;
          font-weight: 400;
          opacity: 0.8;
          color: #666;
        }
        
        .constellation-word {
          font-family: 'Inter', sans-serif;
          font-size: 2.8rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          position: relative;
          display: inline-block;
        }
        
        .constellation-text {
          letter-spacing: 0.05em;
          color: #444;
        }
        
        .constellation-o {
          color: #ff4d8d;
          display: inline-block;
          animation: pulse 2.5s infinite ease-in-out;
          margin-left: 0.2rem;
        }
        
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1);
            text-shadow: 0 0 0 rgba(255, 77, 141, 0);
          }
          50% { 
            transform: scale(1.1);
            text-shadow: 0 0 15px rgba(255, 77, 141, 0.3);
          }
        }
        
        .decoration-element {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 1.5rem auto;
          max-width: 220px;
        }
        
        .celestial-line {
          height: 1px;
          flex-grow: 1;
          background: linear-gradient(90deg, transparent, rgba(255, 77, 141, 0.3), transparent);
        }
        
        .celestial-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #ff4d8d;
          margin: 0 0.8rem;
          box-shadow: 0 0 8px rgba(255, 77, 141, 0.4);
        }
        
        .explore-button {
          background: transparent;
          color: #ff4d8d;
          border: 1px solid rgba(255, 77, 141, 0.4);
          padding: 0.8rem 1.8rem;
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          border-radius: 30px;
          margin-top: 0.5rem;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(5px);
        }
        
        .explore-button:before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 77, 141, 0.1), transparent);
          transition: all 0.6s ease;
        }
        
        .explore-button:hover:before {
          left: 100%;
        }
        
        .explore-button:hover {
          border-color: #ff4d8d;
          background-color: rgba(255, 77, 141, 0.1);
          box-shadow: 0 0 15px rgba(255, 77, 141, 0.2);
          color: #ff4d8d;
        }
        
        .button-arrow {
          transition: transform 0.3s ease;
        }
        
        .explore-button:hover .button-arrow {
          transform: translateX(3px);
        }
        
        /* Responsive styles */
        @media (max-width: 768px) {
          .banner-container {
            height: 50vh;
            min-height: 350px;
            padding: 1rem;
          }
          
          .banner-content {
            padding: 1.5rem;
          }
          
          .constellation-word {
            font-size: 2.2rem;
          }
          
          .description-text {
            font-size: 0.9rem;
            padding: 0 0.5rem;
          }
        }
        
        @media (max-width: 480px) {
          .banner-container {
            height: 45vh;
            min-height: 320px;
          }
          
          .constellation-word {
            font-size: 1.8rem;
          }
          
          .new-collection-text {
            font-size: 0.8rem;
          }
          
          .explore-button {
            padding: 0.7rem 1.5rem;
            font-size: 0.8rem;
          }
          
          .description-text {
            margin-bottom: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ConstellationBanner;