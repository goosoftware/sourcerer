import React, { useState } from "react";
import Rust from "./components/Rust";
import TypeScript from "./components/TypeScript";

const App = () => {
  const [rust, setRust] = useState("");

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <div style={{ flex: 3 }}>
        <TypeScript setRust={setRust} />
      </div>
      <div style={{ flex: 5 }}>
        <Rust rust={rust} />
      </div>
    </div>
  );
};
export default App;
