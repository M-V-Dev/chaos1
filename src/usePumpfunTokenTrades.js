// usePumpfunTokenTrades.js
import { useEffect, useState } from "react";

export function usePumpfunTokenTrades(tokenKey) {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    // ✅ Read API key from Vite/Vercel env variable
    const apiKey = import.meta.env.VITE_PUMPFUN_API_KEY;

    if (!apiKey) {
      console.error("❌ Missing VITE_PUMPFUN_API_KEY environment variable");
      return;
    }

    const ws = new WebSocket(
      `wss://pumpportal.fun/api/data?api-key=${apiKey}`
    );

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      ws.send(
        JSON.stringify({
          method: "subscribeTokenTrade",
          keys: [tokenKey],
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.txType) {
          setTrades((prev) => [data, ...prev]);
        }
      } catch (err) {
        console.error("❌ Failed to parse WebSocket message:", err);
      }
    };

    ws.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
    };

    ws.onclose = () => {
      console.log("⚠️ WebSocket closed");
    };

    return () => {
      ws.close();
    };
  }, [tokenKey]);

  return trades;
}
