import { useEffect } from 'react';
import WebApp from '@twa-dev/sdk';

export const useTelegram = () => {
  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
  }, []);

  return {
    user: WebApp.initDataUnsafe?.user,
    close: WebApp.close,
    expand: WebApp.expand
  };
};