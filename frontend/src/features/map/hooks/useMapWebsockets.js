import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getEcho, leaveEchoChannel } from '../../../lib/echo';
import { useToast } from '../../../hooks/useToast';
import { useNotificationStore } from '../../../store/useNotificationStore';

const CHANNEL_NAME = 'mapa-actualizaciones';
const EVENT_NAME = '.nuevo-evento-publicado';

export function useMapWebsockets() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const incrementUnread = useNotificationStore((state) => state.incrementUnread);

  useEffect(() => {
    const echo = getEcho();

    if (!echo) {
      return undefined;
    }

    const channel = echo.channel(CHANNEL_NAME);

    channel.listen(EVENT_NAME, (payload) => {
      queryClient.invalidateQueries({ queryKey: ['map-markers'] });
      queryClient.invalidateQueries({ queryKey: ['map-markers', 'eventos'] });
      queryClient.invalidateQueries({ queryKey: ['eventos', 'proximos'] });

      toast({
        title: 'Nuevo evento publicado',
        description: '¡Se ha publicado un nuevo evento! Revisa el mapa',
      });

      incrementUnread({
        type: 'evento',
        payload,
      });
    });

    return () => {
      leaveEchoChannel(CHANNEL_NAME);
    };
  }, [incrementUnread, queryClient, toast]);
}
