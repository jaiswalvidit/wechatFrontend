import React, { useContext, useEffect, useRef } from 'react';
import SimplePeer from 'simple-peer';
import { AccountContext } from '../../context/AccountProvider';

const Room = () => {
    const { socket, userDetails } = useContext(AccountContext);
    const peerRef = useRef(null);
    const videoRef = useRef(null);

    useEffect(() => {
        socket.on('incoming call', data => {
            console.log('Incoming call', data);
            handleIncomingCall(data);
        });

        return () => {
            if (peerRef.current) {
                peerRef.current.destroy();
                peerRef.current = null;
            }
            socket.off('incoming call');
        };
    }, [socket]);

    const handleIncomingCall = (data) => {
        const peer = new SimplePeer({
            initiator: false,
            trickle: false,
            stream: videoRef.current?.srcObject, // Assuming you have your own stream attached
        });

        peer.on('signal', signal => {
            socket.emit('accept call', { signal, callerId: data.callerId });
        });

        peer.on('stream', stream => {
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        });

        peer.signal(data.signal);
        peerRef.current = peer;
    };

    const startCall = (userId) => {
        const peer = new SimplePeer({
            initiator: true,
            trickle: false,
            stream: videoRef.current?.srcObject,
        });

        peer.on('signal', signal => {
            socket.emit('call user', { userId, signal });
        });

        peer.on('stream', stream => {
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        });

        peerRef.current = peer;
    };

    return (
        <div>
            <h1>Room</h1>
            <button onClick={() => startCall(userDetails._id)}>Start Call</button>
            <video ref={videoRef} playsInline autoPlay style={{ width: '100%' }}></video>
        </div>
    );
};

export default Room;
