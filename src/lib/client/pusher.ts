import { dev } from '$app/environment';
import { PUBLIC_PUSHER_APP_KEY } from '$env/static/public';
import Pusher from 'pusher-js';

Pusher.logToConsole = dev ? true : false;

const pusherClient = new Pusher(PUBLIC_PUSHER_APP_KEY, { cluster: 'eu' });

export default pusherClient;
