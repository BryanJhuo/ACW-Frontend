import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto w-full bg-gray-50 py-4 px-8 shadow-[0_-4px_6px_-4px_rgba(0,0,0,0.2)]">
      <div className="grid grid-cols-4 gap-4 text-gray-700 text-sm text-left">
        {/* 第一列：圖標區塊 */}
        <div className="flex flex-col items-start justify-start w-full max-w-[400px] mx-auto">
          <p className="font-bold text-3xl">🅱️</p>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2 justify-start">
              <span className="text-xl text-gray-500">📸📖🎥❤️</span>
            </li>
          </ul>
        </div>

        {/* 使用案例區塊 */}
        <div className="flex flex-col items-start">
          <p className="font-bold">Use cases</p>
          <ul>
            <li>UI design</li>
            <li>UX design</li>
            <li>Wireframing</li>
            <li>Diagramming</li>
            <li>Brainstorming</li>
            <li>Online whiteboard</li>
            <li>Team collaboration</li>
          </ul>
        </div>

        {/* 探索區塊 */}
        <div className="flex flex-col items-start">
          <p className="font-bold">Explore</p>
          <ul>
            <li>Design</li>
            <li>Prototyping</li>
            <li>Development features</li>
            <li>Design systems</li>
            <li>Collaboration features</li>
            <li>Design process</li>
            <li>FigJam</li>
          </ul>
        </div>

        {/* 資源區塊 */}
        <div className="flex flex-col items-start">
          <p className="font-bold">Resources</p>
          <ul>
            <li>Blog</li>
            <li>Best practices</li>
            <li>Colors</li>
            <li>Color wheel</li>
            <li>Support</li>
            <li>Developers</li>
            <li>Resource library</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
