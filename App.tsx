import React, { Suspense } from 'react';
import { HeroScene } from './components/HeroScene';

const App: React.FC = () => {
  return (
    <div className="w-full h-screen bg-[#050505] text-white flex flex-col font-sans overflow-hidden">
      
      {/* The 3D Scroll Experience Container */}
      <section className="relative w-full h-full bg-black">
        <div className="absolute inset-0">
          <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-cyan-900 font-mono tracking-widest text-xs">INITIALIZING ENGINE...</div>}>
            <HeroScene />
          </Suspense>
        </div>
        
        {/* Subtle scroll hint overlay */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 pointer-events-none opacity-50 z-10">
           <div className="animate-bounce text-cyan-500 text-sm font-mono tracking-widest">SCROLL TO BUILD</div>
        </div>
      </section>

    </div>
  );
};

export default App;