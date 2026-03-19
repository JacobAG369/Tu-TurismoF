# Clean Architecture: State Management Refactoring

## Overview

Refactorización completa del estado de favoritos y notificaciones eliminando la duplicación entre Zustand y TanStack Query. Ahora sigue el patrón de **Clean Architecture** con:

- **TanStack Query**: Única fuente de verdad para datos (favoritos, notificaciones)
- **Zustand Store**: Solo para estado de UI (sidebars, filters, preferences)
- **Custom Hooks**: Coordinan entre Query y Store, derivando estado

## Cambios Realizados

### 1. ✅ useFavoritesStore (Refactorizado)

**Antes** (❌ Problema):
```javascript
// Duplicaba estado de favoritos
favorites: [],
setFavorites,
addFavoriteId,
removeFavoriteId,
```

**Después** (✅ Solución):
```javascript
// Solo UI state, datos en Query
isSidebarOpen: false,
filterType: null,  // 'lugar' | 'evento' | 'restaurante'
sortBy: 'created_at'
```

**Razón**: Los datos viven en useQuery. El store solo maneja UI.

---

### 2. ✅ useFavorites Hook (Refactorizado)

**Nueva arquitectura**:

```javascript
// QUERY = Única fuente de verdad
const favoritesQuery = useQuery({
  queryKey: FAVORITES_QUERY_KEY,
  queryFn: favoritesApi.getFavorites,
  enabled: isAuthenticated,
})

// DERIVED STATE = Computed from query data
const isFavorite = (resourceId) => {
  return favoritesQuery.data?.some(item => 
    item.referencia_id === resourceId
  )
}

// OPTIMISTIC UPDATES = Immediate UI feedback
onMutate: async (resource) => {
  // Cancel ongoing queries
  await queryClient.cancelQueries(FAVORITES_QUERY_KEY)
  
  // Save previous data for rollback
  const previousFavorites = queryClient.getQueryData(FAVORITES_QUERY_KEY)
  
  // Update UI immediately (optimistic)
  queryClient.setQueryData(FAVORITES_QUERY_KEY, (current) => [
    optimistic,
    ...current
  ])
  
  return { previousFavorites }
}

onError: (error, resource, context) => {
  // Rollback on failure
  queryClient.setQueryData(FAVORITES_QUERY_KEY, context.previousFavorites)
}

onSettled: () => {
  // Refetch after mutation
  queryClient.invalidateQueries(FAVORITES_QUERY_KEY)
}
```

**Ventajas**:
- ✅ Optimistic updates (UI reactiva al instante)
- ✅ Rollback automático si falla
- ✅ Datos siempre sincronizados
- ✅ Una sola fuente de verdad
- ✅ Sin duplicación de estado

---

### 3. ✅ useNotifications Hook (Nueva)

Patrón idéntico a favoritos:

```javascript
const unreadCount = () => 
  notifications.filter(n => !n.leido).length

const hasUnread = () => unreadCount() > 0

// Same mutation pattern with optimistic updates
const markAsReadMutation = useMutation({
  mutationFn: notificationsApi.markAsRead,
  onMutate: async (notificationId) => {
    // Optimistic: mark as read immediately
    queryClient.setQueryData(NOTIFICATIONS_QUERY_KEY, (current) =>
      current.map(n => 
        n.id === notificationId ? {...n, leido: true} : n
      )
    )
  },
  onError: (error, args, context) => {
    // Rollback
    queryClient.setQueryData(NOTIFICATIONS_QUERY_KEY, context.previousNotifications)
  },
  onSettled: () => {
    // Refresh
    queryClient.invalidateQueries(NOTIFICATIONS_QUERY_KEY)
  }
})
```

---

## Uso en Componentes

### PlaceDetailCard (Favoritos)

```javascript
export default function PlaceDetailCard({ marker, onClose }) {
  const { isAuthenticated } = useAuthStore()
  
  // Hook maneja todo: query, mutations, estado
  const { isFavorite, toggleFavorite, isUpdatingFavorite } = useFavorites()

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión')
      return
    }
    
    // Optimistic update ocurre aquí automáticamente
    toggleFavorite(marker)
  }

  const favorited = isFavorite(marker.id) // ✅ Derivado de query

  return (
    <Button
      onClick={handleFavoriteClick}
      disabled={isUpdatingFavorite}
      className={favorited ? 'red-theme' : ''}
    >
      <Heart className={favorited ? 'fill' : ''} />
    </Button>
  )
}
```

**Cómo funciona**:
1. Usuario hace click en Heart
2. `toggleFavorite()` dispara mutation
3. `onMutate` actualiza UI al instante (optimistic)
4. Servidor procesa request en background
5. Si OK: `onSettled` invalida query para refresh
6. Si error: `onError` revierte cambios

---

### MainMap (Favoritos en Mapa)

```javascript
export default function MainMap() {
  const theme = useThemeStore(state => state.theme)
  
  // Obtiene datos de query
  const { favoriteItems } = useFavorites()
  
  // Convierte a IDs para MarkersLayer
  const favoriteIds = useMemo(() => {
    return favoriteItems.map(fav => fav.referencia_id)
  }, [favoriteItems])

  return (
    <MapContainer>
      <MarkersLayer 
        markers={markers}
        favoriteIds={favoriteIds}  // ✅ Reactive
        onMarkerClick={setSelectedMarkerId}
      />
    </MapContainer>
  )
}
```

---

### Notificación Badge (Notificaciones)

```javascript
function NotificationBell() {
  const { unreadCount, notifications } = useNotifications()
  
  return (
    <button>
      <Bell />
      {unreadCount > 0 && (
        <span className="badge">{unreadCount}</span>
      )}
    </button>
  )
}
```

---

### Panel de Notificaciones (Notificaciones)

```javascript
function NotificationPanel() {
  const { 
    notifications, 
    unreadNotifications,
    markAsRead,
    deleteNotification,
    isMarkingAsRead
  } = useNotifications()

  return (
    <div>
      {notifications.map(notif => (
        <div key={notif.id} className={notif.leido ? 'read' : 'unread'}>
          <div>{notif.contenido}</div>
          
          {!notif.leido && (
            <button
              onClick={() => markAsRead(notif.id)}  // Optimistic
              disabled={isMarkingAsRead}
            >
              Marcar como leído
            </button>
          )}
          
          <button
            onClick={() => deleteNotification(notif.id)}  // Optimistic
          >
            Eliminar
          </button>
        </div>
      ))}
    </div>
  )
}
```

---

## API Hooks Completo

### useFavorites()

```javascript
{
  // Datos (de query)
  favoriteItems: [],      // Array de favoritos normalizados
  
  // Derived (computado de query data)
  isFavorite: (resourceId) => boolean,
  
  // Query state
  isLoading: false,
  isError: false,
  error: null,
  
  // Mutation state
  isUpdatingFavorite: false,
  isAddingFavorite: false,
  isRemovingFavorite: false,
  
  // Actions
  toggleFavorite: (resource) => void,      // Add or remove
  addFavorite: (resource) => void,
  removeFavorite: (resourceId) => void,
  
  // Advanced
  favoritesQuery: UseQueryResult,
}
```

### useNotifications()

```javascript
{
  // Datos (de query)
  notifications: [],           // Array de notificaciones
  
  // Derived (computado de query data)
  unreadCount: number,         // Computed
  unreadNotifications: [],     // Computed
  hasUnread: boolean,          // Computed
  
  // Query state
  isLoading: false,
  isError: false,
  error: null,
  
  // Mutation state
  isMarkingAsRead: false,
  isMarkingAllAsRead: false,
  isDeleting: false,
  isDeletingAll: false,
  
  // Actions
  markAsRead: (notificationId) => void,
  markAllAsRead: () => void,
  deleteNotification: (notificationId) => void,
  deleteAllNotifications: () => void,
  
  // Advanced
  notificationsQuery: UseQueryResult,
}
```

---

## Beneficios

### ✅ Sin Duplicación
```
ANTES:
- Zustand: favorites array (duplicado)
- Query: favoriteItems data (fuente real)
- Sincronización manual con useEffect (bug-prone)

DESPUÉS:
- Query: favoriteItems data (ÚNICA fuente)
- Zustand: solo UI state
- Automáticamente sincronizado
```

### ✅ Optimistic Updates
```
Usuario hace click → UI actualiza inmediatamente
                  ↓
            Request en background
                  ↓
              Si OK: refresh
              Si error: rollback automático
```

### ✅ Código Limpio
- Menos boilerplate
- Menos acciones de Zustand
- Menos useEffect
- Menos bugs de sincronización

### ✅ Performance
- Datos cacheados en Query
- Re-renders solo cuando cambia data
- Optimistic updates no requieren request round-trip

---

## Migración de Componentes

### Checklist para actualizar componentes

- [ ] Cambiar `useFavoritesStore()` por `useFavorites()`
- [ ] Cambiar `favorites` por `favoriteItems` (si necesitas array)
- [ ] Cambiar `isFavorite()` - ahora se deriva automáticamente
- [ ] Cambiar `toggleFavorite()` - ahora con optimistic updates
- [ ] Cambiar `addFavoriteId/removeFavoriteId` por `addFavorite/removeFavorite`
- [ ] Remover cualquier `useEffect` que sincronizaba estado

### Componentes ya migrando ✅

- ✅ PlaceDetailCard.jsx
- ✅ MainMap.jsx
- ✅ FavoritesPage.jsx
- ✅ AppLayout.jsx

---

## Testing Optimistic Updates

```javascript
// test/hooks/useFavorites.test.js

test('toggleFavorite updates UI immediately (optimistic)', () => {
  const { result } = renderHook(() => useFavorites())
  
  // Inicial: no es favorito
  expect(result.current.isFavorite('id-1')).toBe(false)
  
  // Usuario togglea
  act(() => {
    result.current.toggleFavorite({ id: 'id-1', nombre: 'Test' })
  })
  
  // UI se actualiza INMEDIATAMENTE (optimistic)
  expect(result.current.isFavorite('id-1')).toBe(true)
  
  // Eventually server confirms (or rollback on error)
  await waitFor(() => {
    expect(result.current.isUpdatingFavorite).toBe(false)
  })
})
```

---

## Conclusión

Esta refactorización implementa **Clean Architecture** eliminando:
- ❌ Duplicación de estado
- ❌ Sincronización manual con useEffect
- ❌ Bugs de inconsistencia

Introduciendo:
- ✅ Single source of truth (Query)
- ✅ Optimistic updates (UI reactiva)
- ✅ Automatic rollback on error
- ✅ Clean separation of concerns

**Patrón aplicable a**: favoritos, notificaciones, cart, wishlist, cualquier dato que se mutaba.
