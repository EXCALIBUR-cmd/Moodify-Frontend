// App.jsx (example)
import React, { useState } from "react";
import FacialExpression from "./components/FacialExpression";
import MoodSongs from "./components/MoodSongs";
function App() {
   const [Songs, setSongs] = useState([
      {  title: "song1", artist: "artist1", url: "url1" },
    ]);
  const [darkMode, setDarkMode] = useState(false);
  return (
    <div>
      <FacialExpression darkMode={darkMode} setDarkMode={setDarkMode} setSongs={setSongs}/>
      <MoodSongs darkMode={darkMode} songs={Songs} />
    </div>
  );
}
export default App;
