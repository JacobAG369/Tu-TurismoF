// websockets con Laravel Echo. si VITE_REVERB_APP_KEY no está, simplemente no hace nada.
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

if (typeof window !== 'undefined') {
  window.Pusher = Pusher;
}

let echoInstance = null;
let warnedMissingConfig = false;

export function getEcho() {
  if (echoInstance || typeof window === 'undefined') {
    return echoInstance;
  }

  const reverbKey = import.meta.env.VITE_REVERB_APP_KEY;

  if (!reverbKey) {
    if (!warnedMissingConfig) {
      warnedMissingConfig = true;
      console.warn('Laravel Echo disabled: missing VITE_REVERB_APP_KEY.');
    }

    return null;
  }

  echoInstance = new Echo({
    broadcaster: 'reverb',
    key: reverbKey,
    wsHost: import.meta.env.VITE_REVERB_HOST || 'localhost',
    wsPort: Number(import.meta.env.VITE_REVERB_PORT || 8001),
    wssPort: Number(import.meta.env.VITE_REVERB_PORT || 8001),
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME || 'http') === 'https',
    enabledTransports: ['ws', 'wss'],
  });

  return echoInstance;
}

export function leaveEchoChannel(channelName) {
  if (!echoInstance) {
    return;
  }

  echoInstance.leaveChannel(channelName);
}
