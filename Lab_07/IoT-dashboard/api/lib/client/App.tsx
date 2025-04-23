import React, { useEffect } from "react";
import { io } from "socket.io-client";

const App: React.FC = () => {
  useEffect(() => {
    const socket = io("http://localhost:3100");

    socket.on("connect", () => {
      console.log("Połączono z WebSocket");
    });

    socket.on("message", (data) => {
      console.log("Otrzymano wiadomość:", data);

      const listItem = document.createElement("li");
      listItem.textContent = `Wiadomość: ${data}`;
      document.getElementById("sensorDataList")?.appendChild(listItem);
    });

    socket.on("sensor-data", (data) => {
      console.log("Otrzymano dane sensora:", data);

      const listItem = document.createElement("li");
      listItem.textContent = `Temperatura: ${data.temperature}°C, Wilgotność: ${data.humidity}%, Ciśnienie: ${data.pressure} hPa`;
      document.getElementById("sensorDataList")?.appendChild(listItem);
    });

    socket.on("disconnect", () => {
      console.log("Rozłączono z WebSocket");
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Dane z WebSocket</h1>
      <ul id="sensorDataList"></ul>
    </div>
  );
};

export default App;
