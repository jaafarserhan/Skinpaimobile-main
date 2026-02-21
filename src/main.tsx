
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";
  import "./i18n";
  import { RTLProvider } from "./contexts/RTLContext";
  import { AuthProvider } from "./contexts/AuthContext";

  createRoot(document.getElementById("root")!).render(
    <RTLProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </RTLProvider>
  );
  