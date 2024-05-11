import { React } from "react";

export const Header = ({minimseChat}) => {
  return (
    <div className="chatbot-header">
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M0 18a17.983 17.983 0 0011.625 16.842V1.158A17.983 17.983 0 000 18zM18 0c-.491 0-.999.016-1.475.048v1.268h.096c6.85.048 12.37 5.281 12.322 11.688-.048 6.376-5.598 11.514-12.418 11.498v11.435c.492.047.984.063 1.475.063 9.944 0 18-8.056 18-18S27.944 0 18 0z"
          fill="#DC1928"
        ></path>
      </svg>
      PostAI (AI Powered Chat)

      <button className="minimise" onClick={() => minimseChat()}>
      <svg fill="none" height="15" viewBox="0 0 15 15" width="15" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="M13.8536 1.85356L10.7071 5.00001L13 5.00001V6.00001L9.00001 6.00001V2.00001H10V4.2929L13.1465 1.14645L13.8536 1.85356ZM2.00001 9.00001L6.00001 9.00001L6.00001 13H5.00001L5.00001 10.7071L1.85356 13.8536L1.14645 13.1465L4.2929 10L2.00001 10L2.00001 9.00001Z" fill="black" fillRule="evenodd"/></svg>
      </button>
    </div>
  );
};
