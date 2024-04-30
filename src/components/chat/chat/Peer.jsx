import React, { useMemo } from "react";

// Create a context for managing the peer connection
const PeerContext = React.createContext(null);


export const usePeer=()=>{
    return React.useContext(PeerContext);
}
// Define the PeerProvider component
export const PeerProvider = (props) => {
    // Create a new RTCPeerConnection instance
    const peer = useMemo(() => new RTCPeerConnection({
        iceServers: [
            {
                urls: [
                    // Add ICE server URLs here
                    // For example:
                    'stun:stun.l.google.com:19302',
                    'turn:global.stun.twilio.com:3478'
                ],
               
            }
        ]
    }), []);


    const createOffer=async()=>{
        const offer=await peer.createOffer();
        await peer.localDescription(offer);
        return offer;
    }

    const createAnswer=async(offer)=>{
        await peer.setRemoteDescription(offer); 
         const answer=await peer.createAnswer();
         await peer.setLocalDescription(answer);
         return answer;

    }

    const setRemoteAns=async(ans)=>{
        await peer.setRemoteDescription(ans);
    }
    // Provide the peer connection instance through the context
    return (
        <PeerContext.Provider value={{ peer,createAnswer,createOffer,setRemoteAns }}>
            {props.children}
        </PeerContext.Provider>
    );
};

export default PeerContext; // Export the PeerContext for consuming in other components
