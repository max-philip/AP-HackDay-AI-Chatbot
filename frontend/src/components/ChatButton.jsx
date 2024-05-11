import { React } from "react";
import './ChatButton.css';

    
const ChatButton = ({openChat}) => {

    const styles = {
        cls1: {
          fill: "none",
          stroke: "#dc1928",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2px",
        },
        cls2: {
          fill: "rgb(236 125 134)",
        },
      };
  return (
    <button className="chat-button" onClick={() => openChat()}>
        <svg data-name="Layer 1" id="Layer_1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <defs>
            
         
            </defs>
            <title/>
            <path style={styles.cls1} d="M27.2,27.9l-2.8-5.6A5.6,5.6,0,0,0,30,16.7v-7a5.6,5.6,0,0,0-5.6-5.6H7.6A5.6,5.6,0,0,0,2,9.7v7a5.6,5.6,0,0,0,5.6,5.6H16Z"/>
            <circle style={styles.cls2} cx="9" cy="13.2" r="1.4"/>
            <circle style={styles.cls2} cx="16" cy="13.2" r="1.4"/>
            <circle style={styles.cls2} cx="23" cy="13.2" r="1.4"/>
        </svg>
    </button>
  );
};


export default ChatButton;