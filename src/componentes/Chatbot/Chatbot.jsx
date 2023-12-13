import React, { useEffect, useState } from "react";
import "./Chatbot.css";

const Chatbot = () => {

    const [show, setShow] = useState(false);

    const toggleChat = () => {
        setShow(!show);
    }

    return (<>
        <div className={"chatBot-container" + (show ? " active" : "")}>
            <div><div className="btn-toggle-chatbot" onClick={toggleChat}>
                Ayuda
            </div></div>
            <div className="chatBot-iframe">
                <iframe
                    title="Mi iFrame"
                    src="https://web.powerva.microsoft.com/environments/Default-843d9746-0674-48bf-a402-a45cd06f541a/bots/cr5a9_routeOptimizer/webchat?__version__=2"
                    frameBorder="0"
                    style={{ width: '100%', height: '100%' }}
                />
            </div>
        </div>
    </>)
}

export default Chatbot;