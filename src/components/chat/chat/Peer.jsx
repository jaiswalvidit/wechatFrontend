import React, { useMemo } from "react";

// Create a context for managing the peer connection
const PeerContext = React.createContext(null);

// Define the PeerProvider component
export const PeerProvider = (props) => {
    // Destructure user credentials from props
    const { username, credentials } = props;

    // Create a new RTCPeerConnection instance
    const peer = useMemo(() => new RTCPeerConnection({
      
    }), []); // Include username and credentials in the dependencies array

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
        <PeerContext.Provider value={{ peer, createAnswer, createOffer, setRemoteAns }}>
            {props.children}
        </PeerContext.Provider>
    );
};

export const usePeer = () => {
    return React.useContext(PeerContext);
};

export default PeerContext; // Export the PeerContext for consuming in other components
