// App.jsx
import React, { useState, useEffect, useRef } from "react";
import { usePumpfunTokenTrades } from "./usePumpfunTokenTrades";

const TOKEN_KEY = "21Fgdm3c2yBRVqp4T21PKPgskeHZMdFL4Fq5ZpU3pump";

// 3 random images for buys & sells
const buyImages = ["/images/buy1.png", "/images/buy2.png", "/images/buy3.png"];
const sellImages = ["/images/sell1.png", "/images/sell2.png", "/images/sell3.png"];

export default function App() {
  const trades = usePumpfunTokenTrades(TOKEN_KEY);
  const [floatingTrades, setFloatingTrades] = useState([]);
  const zIndexCounter = useRef(1000);
  const containerRef = useRef(null);

  useEffect(() => {
    if (trades.length === 0) return;

    const latestTrade = trades[0];
    const isBuy = latestTrade.txType === "buy";
    const type = isBuy ? "Bought" : "Sold";
    const sol = latestTrade.solAmount.toFixed(4);

    const image = isBuy
      ? buyImages[Math.floor(Math.random() * buyImages.length)]
      : sellImages[Math.floor(Math.random() * sellImages.length)];

    const spawnX = 45 + Math.random() * 10;
    const spawnY = 45 + Math.random() * 10;

    const driftX = (Math.random() * 1 + 1) * (Math.random() < 0.1 ? -1 : 0.15);
    const driftY = (Math.random() * 1 + 1) * (Math.random() < 0.1 ? -1 : 0.15);
    const rotation = Math.random() * 120 - 60;

    const newFloatingTrade = {
      id: Date.now(),
      type,
      sol,
      image,
      x: spawnX,
      y: spawnY,
      rotation,
      zIndex: zIndexCounter.current++,
      driftX,
      driftY,
    };

    setFloatingTrades((prev) => [...prev, newFloatingTrade]);

    setTimeout(() => {
      setFloatingTrades((prev) =>
        prev.filter((t) => t.id !== newFloatingTrade.id)
      );
    }, 30000);
  }, [trades]);

  useEffect(() => {
    let animationFrame;
    const container = containerRef.current;
    if (!container) return;

    const updatePositions = () => {
      setFloatingTrades((prev) =>
        prev.map((trade) => {
          let newX = trade.x + trade.driftX;
          let newY = trade.y + trade.driftY;

          if (newX <= 0 || newX >= 95) trade.driftX *= -1;
          if (newY <= 0 || newY >= 95) trade.driftY *= -1;

          return { ...trade, x: newX, y: newY };
        })
      );
      animationFrame = requestAnimationFrame(updatePositions);
    };

    animationFrame = requestAnimationFrame(updatePositions);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#121212",
        overflow: "hidden",
      }}
    >
      {/* Floating Twitter X logo */}
      <a
        href="https://x.com/i/communities/1968947003166969909"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-x"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          fill="white"
          viewBox="0 0 24 24"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.21l-5.213-6.823-5.961 6.823H1.726l7.73-8.853L1.254 2.25h7.795l4.713 6.211 4.482-6.211z"></path>
        </svg>
      </a>

      {/* Static background text */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "clamp(2rem, 8vw, 12rem)",
          fontWeight: "900",
          color: "rgba(255, 255, 255, 0.05)",
          textAlign: "center",
          whiteSpace: "pre-line",
          pointerEvents: "none",
          zIndex: 0,
          lineHeight: 1.2,
        }}
      >
        BUY AND WATCH{"\n"}THE $CHAOS
      </div>

      {/* Floating trades */}
      {floatingTrades.map((trade) => (
        <div
          key={trade.id}
          style={{
            position: "absolute",
            left: `${trade.x}%`,
            top: `${trade.y}%`,
            zIndex: trade.zIndex,
            transform: `rotate(${trade.rotation}deg)`,
            textAlign: "center",
            whiteSpace: "pre-line",
          }}
        >
          <img
            src={trade.image}
            alt={trade.type}
            style={{
              width: 80,
              height: 80,
              objectFit: "contain",
              display: "block",
              margin: "0 auto",
            }}
          />
          <div
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: trade.type === "Bought" ? "#00ff00" : "#ff3333",
              textShadow: "2px 2px 4px black",
            }}
          >
            {trade.type}
          </div>
          <div
            style={{
              fontSize: 16,
              color: "#ffffff",
              textShadow: "2px 2px 4px black",
            }}
          >
            {trade.sol} SOL
          </div>
        </div>
      ))}

      {/* Animation keyframes for floating X */}
      <style>
        {`
          .floating-x {
            position: absolute;
            top: 10px;
            left: 0%;
            z-index: 2000;
            animation: floatX 15s linear infinite alternate;
            display: inline-block;
          }
          .floating-x:hover {
            animation-play-state: paused;
          }
          @keyframes floatX {
            from { left: 0%; }
            to { left: 90%; }
          }
        `}
      </style>
    </div>
  );
}
