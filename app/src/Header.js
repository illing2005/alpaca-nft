import React from "react";
import logo from "./logo_alpaca.svg";

const Header = () => {
  return (
    <header className="mb-auto">
      <div>
        <h3 className="float-md-start mb-0">
          <img src={logo} />
        </h3>
      </div>
    </header>
  );
};

export default Header;
