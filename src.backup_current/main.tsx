import { createRoot } from "react-dom/client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import "./index.css";
import App from "./App";

const convexUrl = import.meta.env.VITE_CONVEX_URL;

if (!convexUrl) {
  createRoot(document.getElementById("root")!).render(
    <div style={{ padding: '2rem', fontFamily: 'system-ui', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#3182ce', marginBottom: '1rem' }}>🚀 Aqraply Application</h1>
      <div style={{ backgroundColor: '#f7fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <h2 style={{ color: '#2d3748' }}>🔧 Convex Configuration Needed</h2>
        <p style={{ color: '#4a5568', lineHeight: '1.6' }}>
          The application is running but needs Convex backend configuration to work properly.
        </p>
        <div style={{ backgroundColor: '#fed7d7', padding: '1rem', borderRadius: '4px', marginTop: '1rem' }}>
          <strong>Issue:</strong> Missing VITE_CONVEX_URL<br/>
          <strong>Solution:</strong> Add VITE_CONVEX_URL to .env.local file
        </div>
      </div>
      <div style={{ backgroundColor: '#c6f6d5', padding: '1rem', borderRadius: '8px' }}>
        <h3 style={{ color: '#22543d' }}>✅ What's Working:</h3>
        <ul style={{ color: '#2f855a' }}>
          <li>Vite development server is running correctly</li>
          <li>JavaScript MIME types are fixed</li>
          <li>React application structure is ready</li>
          <li>All source files are in place</li>
        </ul>
      </div>
    </div>
  );
} else {
  const convex = new ConvexReactClient(convexUrl);

  createRoot(document.getElementById("root")!).render(
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  );
}
