/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { Map } from "./pages/Map";
import { Reports } from "./pages/Reports";
import { Admin } from "./pages/Admin";
import { NewsTicker } from "./components/NewsTicker";

export default function App() {
  return (
    <BrowserRouter>
      {/* Global Watermark */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center opacity-[0.04] mix-blend-screen">
        <img 
          src="https://i.postimg.cc/DZVN4Sb1/nshrt-asʿar-alnft-w-alslʿ-covered-07-1-removebg-preview.png" 
          alt="Watermark" 
          className="w-[80vw] max-w-[800px] object-contain grayscale"
          referrerPolicy="no-referrer"
        />
      </div>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <NewsTicker />
        <div className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/map" element={<Map />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
