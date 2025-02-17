import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './App.css';

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

function App() {
  const mainRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      // --- Section 1: Hero Animations ---
      // Title fades in and moves up
      gsap.from(".hero-title", {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out"
      });
      
      // Floating phone parallax (moves slower than scroll)
      gsap.to(".hero-phone", {
        yPercent: 50,
        ease: "none",
        scrollTrigger: {
          trigger: ".section-1",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      // --- Section 2: Features Animations ---
      const tl2 = gsap.timeline({
        scrollTrigger: {
          trigger: ".section-2",
          start: "top 70%",
          end: "bottom center",
          scrub: 1
        }
      });

      tl2.from(".feature-card", {
        x: -100,
        opacity: 0,
        stagger: 0.2,
        duration: 1
      });

      // Background shapes parallax
      gsap.to(".floating-shape", {
        y: -150,
        rotation: 360,
        scrollTrigger: {
          trigger: ".section-2",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5
        }
      });

      // --- Section 3: Monetization Animations ---
      // Scale up effect for the big CTA
      gsap.from(".cta-box", {
        scale: 0.5,
        opacity: 0,
        scrollTrigger: {
          trigger: ".section-3",
          start: "top 60%",
          end: "center center",
          scrub: true
        }
      });

      // Parallax text behind
      gsap.to(".parallax-bg-text", {
        xPercent: -20,
        scrollTrigger: {
          trigger: ".section-3",
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });

    }, mainRef); // Scope to mainRef

    return () => ctx.revert(); // Cleanup on unmount
  }, []);

  return (
    <div className="app-container" ref={mainRef}>
      
      {/* SECTION 1: HERO */}
      <section className="section section-1">
        <div className="content-wrapper">
          <h1 className="hero-title">
            GO LIVE.<br />
            <span className="gradient-text">BE ICONIC.</span>
          </h1>
          <p className="hero-subtitle">The next-gen streaming platform for creators.</p>
          <button className="btn-primary">Start Streaming</button>
        </div>
        
        {/* Parallax Element: Mock Phone UI */}
        <div className="hero-phone">
          <div className="live-badge">LIVE 🔴</div>
          <div className="phone-screen">
            <div className="chat-bubble">OMG so cool! 🔥</div>
            <div className="chat-bubble">Love this stream ❤️</div>
          </div>
        </div>
      </section>

      {/* SECTION 2: FEATURES */}
      <section className="section section-2">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        
        <h2 className="section-heading">Connect Instantly</h2>
        <div className="cards-container">
          <div className="feature-card">
            <h3>4K Quality</h3>
            <p>Stream in ultra-high definition with zero latency.</p>
          </div>
          <div className="feature-card">
            <h3>Global Chat</h3>
            <p>Real-time interaction with fans worldwide.</p>
          </div>
          <div className="feature-card">
            <h3>Squad Stream</h3>
            <p>Invite up to 4 friends to stream together.</p>
          </div>
        </div>
      </section>

      {/* SECTION 3: MONETIZATION */}
      <section className="section section-3">
        <div className="parallax-bg-text">MONETIZE</div>
        <div className="cta-box">
          <h2>Turn Passion into Profit</h2>
          <p>Get paid for every view, sticker, and subscription.</p>
          <button className="btn-secondary">Join Creator Program</button>
        </div>
      </section>

      {/* EXTRA MINI FOOTER */}
      <footer className="mini-footer">
        <p>© 2025 StreamFlow Inc. All rights reserved.</p>
        <div className="footer-links">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Contact</span>
        </div>
      </footer>
    </div>
  );
}

export default App;