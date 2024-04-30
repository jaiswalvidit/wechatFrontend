import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { AccountContext } from '../../context/AccountProvider';
import { usePeer } from './chat/Peer';

const Room = () => {
    const { socket } = useContext(AccountContext);
    const videoRef = useRef(null);
    const { createOffer, createAnswer, setRemoteAns } = usePeer();

    const handleNewUserJoined = useCallback(async (data) => {
        const { emailId } = data;
        const offer = await createOffer();
        socket.emit('call-user', { emailId, offer });
    }, [createOffer, socket]);

    const handleIncomingCall = useCallback(async (data) => {
        const { from, offer } = data;
        const ans = await createAnswer(offer);
        socket.emit('call-accepted', { from, ans });
    }, [createAnswer, socket]);

    const handleCallAccepted = useCallback(async (data) => {
        const { ans } = data;
        await setRemoteAns(ans);
    }, [setRemoteAns]);

    useEffect(() => {
        socket.on('incoming call', handleIncomingCall);
        socket.on('user-joined', handleNewUserJoined);
        socket.on('call-accepted', handleCallAccepted);

        return () => {
            socket.off('incoming call', handleIncomingCall);
            socket.off('user-joined', handleNewUserJoined);
            socket.off('call-accepted', handleCallAccepted);
        };
    }, [handleIncomingCall, handleNewUserJoined, handleCallAccepted, socket]);

    return (
        <div>
            <h1>Room</h1>
            <video ref={videoRef} playsInline autoPlay style={{ width: '100%' }}></video>
        </div>
    );
};

export default Room;
