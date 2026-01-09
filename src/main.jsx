import { createRoot } from "react-dom/client";
import "mapbox-gl/dist/mapbox-gl.css";
import App from "./App";

createRoot(document.querySelector("#content")).render(<App />);
