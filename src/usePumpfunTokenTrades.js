// usePumpfunTokenTrades.js
import { useEffect, useState } from "react";

export function usePumpfunTokenTrades(tokenKey) {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("wss://pumpportal.fun/api/data?api-key=64rnmca48tbppuhpewnk2njuarrp4dbbcdvppk24anh4urtted4qedu871x6rmj5c9w5mrke8n7qcy3fddn38n3275j30p2h8n368mv5e5346c23dh66ru3k8x73edhfb9vq6j3584ykuax952ujab8t74nahcwvn4rkb909wrn8pam8gnpwcvh8d858tkm8nvpwc37610kuf8");

    ws.onopen = () => {
      ws.send(JSON.stringify({
        method: "subscribeTokenTrade",
        keys: [tokenKey]
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.txType) {
        setTrades(prev => [data, ...prev]);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      ws.close();
    };
  }, [tokenKey]);

  return trades;
}
