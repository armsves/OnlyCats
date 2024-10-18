import React from 'react';
import "./index.css";

const Footer = () => {
  return (
    <div className="pageFooter">
      <div className="centeredContainer">
        <img src="paw.png" width="30px" height="30px" alt="logo" />
        <span>2024 OnlyCats</span>
      </div>

      <div className="centeredContainer">
        <a href="https://internetcomputer.org/" target="_blank">
          <img src="ICPwhite.png" width="30px" height="30px" alt="ICP logo" />
        </a>
      </div>

      <div className="centeredContainer">
        <a href="https://www.walrus.xyz/" target="_blank">
          <img src="walrus.png" width="30px" height="30px" alt="Walrus logo" />
        </a>
      </div>

      <div className="centeredContainer">
        <a href="https://github.com/armsves/OnlyCats" target="_blank">
          <img src="github.png" width="30px" height="30px" alt="GitHub logo" />
        </a>
      </div>

      <div className="centeredContainer">
        <a href="https://twitter.com/armsves" target="_blank">
          <img src="twitter.png" width="30px" height="30px" alt="X/Twitter logo" />
        </a>
      </div>

    </div>
  );
};


export default Footer;