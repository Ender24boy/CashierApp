import React, { useContext } from 'react';
import './Chime.css';
import { PaymentContext } from '../../App';

const ChimeSection: React.FC = () => {
  const { recipient } = useContext(PaymentContext);
    
  return (
    <div className="chime-section">
      <div className="section-content">
        <h2>Chime Payment Instructions</h2>
        <div className="instructions-container">
          <ol className="instruction-list">
            <li>Open your Chime mobile app</li>
            <li>Tap the "Pay" icon at the bottom of the screen</li>
            <li>Select "Pay Friends"</li>
            <li>Choose one of the following methods:
              <ul>
                <li>Enter recipient's phone number: (TBD)</li>
                <li>Enter recipient's name: {recipient}</li>
              </ul>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ChimeSection;