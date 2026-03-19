import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../api/notifications';
import { useAuthStore } from '../store/useAuthStore';

const NOTIFICATIONS_QUERY_KEY = ['notifications'];

/**
 * useNotifications Hook
 * 
 * SINGLE SOURCE OF TRUTH: useQuery
 * - Notifications data lives only in React Query
 * - Mutations automatically sync via optimistic updates + invalidation
 * - unreadCount() and hasUnread() derive state from query data
 * - No duplicate state in Zustand
 * 
 * Optimistic Updates:
 * - onMutate: Update UI immediately
 * - onError: Rollback if request fails
 * - onSettled: Refetch to ensure consistency
 * 
 * Architecture: Clean Architecture + TanStack Query best practices
 */
export function useNotifications() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // ============================================================================
  // QUERY: Single source of truth for notifications data
  // ============================================================================
  const notificationsQuery = useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: notificationsApi.getNotifications,
    enabled: isAuthenticated,
    staleTime: 30000, // 30 seconds (more fresh than favorites)
    placeholderData: [],
  });

  // ============================================================================
  // DERIVED STATE: Computed from query data
  // ============================================================================
  const unreadCount = () => {
    if (!notificationsQuery.data) return 0;
    return notificationsQuery.data.filter((notif) => !notif.leido).length;
  };

  const hasUnread = () => {
    return unreadCount() > 0;
  };

  const getUnreadNotifications = () => {
    if (!notificationsQuery.data) return [];
    return notificationsQuery.data.filter((notif) => !notif.leido);
  };

  // ============================================================================
  // MUTATION: Mark notification as read (with optimistic update)
  // ============================================================================
  const markAsReadMutation = useMutation({
    mutationFn: notificationsApi.markAsRead,

    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });

      const previousNotifications =
        queryClient.getQueryData(NOTIFICATIONS_QUERY_KEY) || [];

      // Optimistic update: mark as read immediately
      queryClient.setQueryData(NOTIFICATIONS_QUERY_KEY, (current = []) =>
        current.map((notif) =>
          notif.id === notificationId ? { ...notif, leido: true } : notif
        )
      );

      return { previousNotifications, notificationId };
    },

    onError: (_error, _notificationId, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          NOTIFICATIONS_QUERY_KEY,
          context.previousNotifications
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });

  // ============================================================================
  // MUTATION: Mark all as read (with optimistic update)
  // ============================================================================
  const markAllAsReadMutation = useMutation({
    mutationFn: notificationsApi.markAllAsRead,

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });

      const previousNotifications =
        queryClient.getQueryData(NOTIFICATIONS_QUERY_KEY) || [];

      // Optimistic update: mark all as read immediately
      queryClient.setQueryData(NOTIFICATIONS_QUERY_KEY, (current = []) =>
        current.map((notif) => ({ ...notif, leido: true }))
      );

      return { previousNotifications };
    },

    onError: (_error, _args, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          NOTIFICATIONS_QUERY_KEY,
          context.previousNotifications
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });

  // ============================================================================
  // MUTATION: Delete notification (with optimistic update)
  // ============================================================================
  const deleteNotificationMutation = useMutation({
    mutationFn: notificationsApi.deleteNotification,

    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });

      const previousNotifications =
        queryClient.getQueryData(NOTIFICATIONS_QUERY_KEY) || [];

      // Optimistic update: remove notification immediately
      queryClient.setQueryData(NOTIFICATIONS_QUERY_KEY, (current = []) =>
        current.filter((notif) => notif.id !== notificationId)
      );

      return { previousNotifications, notificationId };
    },

    onError: (_error, _notificationId, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          NOTIFICATIONS_QUERY_KEY,
          context.previousNotifications
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });

  // ============================================================================
  // MUTATION: Delete all notifications (with optimistic update)
  // ============================================================================
  const deleteAllMutation = useMutation({
    mutationFn: notificationsApi.deleteAllNotifications,

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });

      const previousNotifications =
        queryClient.getQueryData(NOTIFICATIONS_QUERY_KEY) || [];

      // Optimistic update: clear all immediately
      queryClient.setQueryData(NOTIFICATIONS_QUERY_KEY, []);

      return { previousNotifications };
    },

    onError: (_error, _args, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          NOTIFICATIONS_QUERY_KEY,
          context.previousNotifications
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });

  // ============================================================================
  // Return hook API
  // ============================================================================
  return {
    // Data: From query (single source of truth)
    notifications: notificationsQuery.data || [],

    // Derived: Computed from query data
    unreadCount: unreadCount(),
    unreadNotifications: getUnreadNotifications(),
    hasUnread: hasUnread(),

    // Query state
    isLoading: notificationsQuery.isLoading,
    isError: notificationsQuery.isError,
    error: notificationsQuery.error,

    // Mutation states
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    isDeleting: deleteNotificationMutation.isPending,
    isDeletingAll: deleteAllMutation.isPending,

    // Actions
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    deleteNotification: deleteNotificationMutation.mutate,
    deleteAllNotifications: deleteAllMutation.mutate,

    // Advanced: Direct access to query for components that need it
    notificationsQuery,
  };
}
