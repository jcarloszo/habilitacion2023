import React from "react";

const Header = () => {
  return (
    <>
      <div className="w-40 h-40 mx-auto animate__animated animate__tada">
        <img
          src="https://png.pngtree.com/png-vector/20220805/ourmid/pngtree-route-maps-png-image_6099764.png"
          alt="Logo"
        />
      </div>
      <h1 className="text-white mb-10 text-2xl text-center animate__animated animate__backInLeft">
        RouteOptimizer
      </h1>
    </>
  );
};

export default Header;
