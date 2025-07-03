import React, { useState, useEffect } from 'react';
import { Play, Heart, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';


const DiscoverHomepage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const parallaxOffset = scrollY * 0.5;

  return (
    <>
      {/* Global CSS Reset */}
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            margin: 0;
            padding: 0;
            overflow-x: hidden;
          }
          
          html {
            margin: 0;
            padding: 0;
          }
        `}
      </style>

      <div style={{ 
        fontFamily: 'Arial, sans-serif',
        margin: 0,
        padding: 0,
        backgroundColor: '#f0f0f0',
        width: '100vw',
        minHeight: '100vh',
        position: 'relative'
      }}>
        {/* Navigation */}
        <nav style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: '20px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            gap: '30px',
            alignItems: 'center'
          }}>
            <Link 
              to="/projects"
              style={{ color: 'white', textDecoration: 'none', fontSize: '20px', cursor: 'pointer' }}
            >
            Projects
            </Link>

            <Link 
              to="/about"
              style={{ color: 'white', textDecoration: 'none', fontSize: '20px', cursor: 'pointer' }}
             > 
            About
            </Link>

          </div>
          
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            overflow: 'hidden'
          }}>
            <img 
              src="/Newton_logo.jpg" 
              alt="Newton Logo" 
              style={{ 
                width: '60px', 
                height: '60px', 
                objectFit: 'contain' 
              }} 
            />
          </div>
        </nav>

        {/* Hero Section */}
        <div style={{
          height: '100vh',
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          margin: 0,
          padding: 0,
        }}>
          {/* Background Video */}
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 0,
              objectFit: 'cover',
              margin: 0,
              padding: 0
            }}
          >
            <source src="/bg1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Dark overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2))',
            zIndex: 1
          }} />

          {/* Main content */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, calc(-50% + ${parallaxOffset}px))`,
            textAlign: 'center',
            zIndex: 2,
            width: '100%'
          }}>
            <h1 style={{
              fontSize: 'clamp(4rem, 12vw, 8rem)',
              fontWeight: '900',
              color: 'white',
              margin: 0,
              letterSpacing: '0.1em',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              marginBottom: '20px'
            }}>
              SHOWCASE
            </h1>
            
            <p style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '18px',
              maxWidth: '800px',
              margin: '0 auto 40px',
              lineHeight: 1.6,
              padding: '0 20px'
            }}>
              Submit your academic or professional projects with ease and efficiency.<br></br>
                  Track progress, collaborate with mentors, and showcase your work — all in one place.
            </p>

            <button style={{
              background: 'linear-gradient(135deg, rgba(5, 78, 146, 0.84) 0%, transparent 100%)',
              color: 'white',
              border: 'none',
              padding: '15px 40px',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '50px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              boxShadow: '0 8px 25px rgba(248, 242, 242, 0)',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.6)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
            }}>
              <Play size={16} fill="white" />
              START NOW
            </button>
          </div>

          {/* Bottom actions */}
          <div style={{
            position: 'absolute',
            bottom: '30px',
            right: '30px',
            zIndex: 2,
            display: 'flex',
            gap: '15px'
          }}>
            <button style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.transform = 'scale(1)';
            }}>
              <Heart size={20} />
            </button>
            
            <button style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.transform = 'scale(1)';
            }}>
              <Share2 size={20} />
            </button>
          </div>

          {/* Scroll indicator */}
          <div style={{
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            color: 'white',
            textAlign: 'center'
          }}>
            <div style={{
              width: '2px',
              height: '30px',
              background: 'white',
              margin: '0 auto 10px',
              opacity: 0.7,
              animation: 'pulse 2s infinite'
            }} />
            <style>
              {`
                @keyframes pulse {
                  0%, 100% { opacity: 0.7; }
                  50% { opacity: 0.3; }
                }
              `}
            </style>
          </div>
        </div>        
      </div>
    </>
  );
};

export default DiscoverHomepage;