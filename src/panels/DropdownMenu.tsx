import React, { useState } from "react";
import '../styles/DropdownMenu.css';

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <div onClick={() => setIsOpen(prev => !prev)}>
        {trigger}
      </div>

      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: "fixed",
              top: 0, left: 0,
              width: "100%", height: "100%",
              background: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
            }}
          />

          {/* Dropdown content */}
          <div id="popup" style={{
            position: "fixed",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "16px",
            zIndex: 1000,
          }}>
            {children}
          </div>
        </>
      )}
    </div>
  );
};

export default DropdownMenu;