import { React } from "react";

const PreChat = () => {
  return (
    <>
      <div className={`message assistant-message`}>
        Hi, I'm your Australia Post virtual assistant. How can I help you today?
      </div>
      <div className={`message assistant-message`}>
        Here are some of the most popular recent user queries:
        <ul>
          <li>
            <a href="https://auspost.com.au/help-and-support/answers?s=000002039" target='_blank'>
              What should I do if my parcel is not delivered?
            </a>
          </li>
          <li>
            <a href="https://auspost.com.au/content/dam/auspost_corp/media/documents/mypost-business-postage-rates-guide.pdf" target='_blank'>
              How can I save costs for my small business?
            </a>
          </li>
          <li>
            <a href="https://auspost.com.au/locate/" target='_blank'>
              Where can I locate and see the services provided by Post Offices?
            </a>
          </li>
          <li>
            <a href="https://auspost.com.au/receiving/manage-deliveries-in-transit" target='_blank'>
              Why is my package still in transit, despite not moving?
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default PreChat;
