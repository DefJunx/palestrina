import { PUSHER_APP_ID, PUSHER_APP_SECRET } from '$env/static/private';
import { PUBLIC_PUSHER_APP_KEY } from '$env/static/public';
import Pusher from 'pusher';

const pusherServer = new Pusher({
  appId: PUSHER_APP_ID,
  key: PUBLIC_PUSHER_APP_KEY,
  secret: PUSHER_APP_SECRET,
  cluster: 'eu',
  useTLS: true
});

export default pusherServer;
