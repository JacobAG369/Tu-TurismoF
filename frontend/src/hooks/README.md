# Custom Hooks - Architecture Guide

## Overview

Custom hooks que implementan **Clean Architecture** separando:
- **Query**: Datos (única fuente de verdad)
- **Store**: UI State (sidebars, filters, preferences)
- **Hook**: Coordina entre Query y Store

## hooks/

### useFavorites.js
Gestiona estado de favoritos con optimistic updates.

**API**:
```javascript
const {
  favoriteItems,           // Array de favoritos
  isFavorite(resourceId),  // Función derivada
  toggleFavorite,          // Add or remove
  isUpdatingFavorite,      // Loading state
} = useFavorites()
```

**Características**:
- ✅ Single source of truth (Query)
- ✅ Optimistic updates (UI inmediata)
- ✅ Automatic rollback on error
- ✅ Zero duplicated state

**Ejemplo**:
```javascript
function PlaceCard({ place }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  
  return (
    <button
      onClick={() => toggleFavorite(place)}
      className={isFavorite(place.id) ? 'favorited' : ''}
    >
      ♥ {isFavorite(place.id) ? 'Guardado' : 'Guardar'}
    </button>
  )
}
```

---

### useNotifications.js
Gestiona notificaciones con optimistic updates.

**API**:
```javascript
const {
  notifications,           // Array de notificaciones
  unreadCount,             // Número de no leídas
  hasUnread,               // Boolean
  markAsRead,              // Mark single as read
  markAllAsRead,           // Mark all as read
  deleteNotification,      // Delete single
  deleteAllNotifications,  // Delete all
} = useNotifications()
```

**Características**:
- ✅ Computed unread count
- ✅ Optimistic updates para read/delete
- ✅ Query cacheada por 30 segundos
- ✅ Automatic refetch on mutation

**Ejemplo**:
```javascript
function NotificationBell() {
  const { unreadCount, markAllAsRead } = useNotifications()
  
  return (
    <button>
      🔔 {unreadCount > 0 && <span>{unreadCount}</span>}
    </button>
  )
}

function NotificationsList() {
  const { 
    notifications, 
    markAsRead, 
    deleteNotification,
    isMarkingAsRead 
  } = useNotifications()
  
  return (
    <ul>
      {notifications.map(notif => (
        <li key={notif.id} className={notif.leido ? 'read' : 'unread'}>
          {notif.contenido}
          
          {!notif.leido && (
            <button onClick={() => markAsRead(notif.id)}>
              {isMarkingAsRead ? '...' : 'Marcar leído'}
            </button>
          )}
          
          <button onClick={() => deleteNotification(notif.id)}>
            Eliminar
          </button>
        </li>
      ))}
    </ul>
  )
}
```

---

## Architecture Pattern

### Problem (Before)
```
Zustand Store: favorites = [1, 2, 3]  ← Duplicated!
    ↓
useEffect: favoritesQuery.data → setFavorites()  ← Manual sync
    ↓
Query: favoriteItems = [{...}, {...}, {...}]  ← Real data
    ↓
Inconsistency bugs when out of sync ❌
```

### Solution (After)
```
Query: favoriteItems = [{...}, {...}, {...}]  ← Single source
    ↓
Hook: isFavorite() derives from query.data
    ↓
Store: Only UI state (filters, sidebar)
    ↓
No duplicated state, automatic consistency ✅
```

---

## Optimistic Updates Flow

```
User clicks favorite
    ↓
toggleFavorite()
    ↓
onMutate: Update UI immediately (optimistic)
    ↓ (in parallel)
    ├─ Server processes request
    │   ├─ SUCCESS: onSettled() invalidates query (refresh)
    │   └─ ERROR: onError() reverts to previousFavorites
    │
User sees changes instantly ✅
```

**Key benefit**: No waiting for server response

---

## Query Configuration

### Favorites
- **staleTime**: 60 seconds (1 minute)
- **gcTime**: 5 minutes (garbage collection)
- **retry**: false (mutations only)
- **placeholderData**: [] (show empty while loading)

### Notifications
- **staleTime**: 30 seconds (more fresh)
- **gcTime**: 5 minutes
- **retry**: false
- **placeholderData**: []

---

## Testing Guide

### Test Optimistic Updates
```javascript
test('favorites update optimistically', async () => {
  const { result } = renderHook(() => useFavorites())
  
  // Before: not favorited
  expect(result.current.isFavorite('id-1')).toBe(false)
  
  // User clicks
  act(() => {
    result.current.toggleFavorite({ id: 'id-1' })
  })
  
  // After: IMMEDIATELY favorited (optimistic)
  expect(result.current.isFavorite('id-1')).toBe(true)
  
  // Eventually server confirms
  await waitFor(() => {
    expect(result.current.isUpdatingFavorite).toBe(false)
  })
})
```

See `useFavorites.test.js` for comprehensive test suite.

---

## Common Patterns

### Pattern 1: Derived State
```javascript
// ❌ BAD: Store state
const favorites = useFavoritesStore(s => s.favorites)

// ✅ GOOD: Derive from query
const { favoriteItems } = useFavorites()
const isFav = (id) => favoriteItems.some(f => f.referencia_id === id)
```

### Pattern 2: Mutation with optimistic update
```javascript
// ❌ BAD: Manual state management
const add = () => {
  setLoading(true)
  addFavoriteId(resourceId)
  try {
    await api.add(resource)
  } catch (e) {
    removeFavoriteId(resourceId)
  } finally {
    setLoading(false)
  }
}

// ✅ GOOD: Mutation handles it
const { toggleFavorite } = useFavorites()
const add = () => toggleFavorite(resource)
```

### Pattern 3: Computed values
```javascript
// ❌ BAD: Store them
const unreadCount = store.unreadCount  // Must update manually

// ✅ GOOD: Derive them
const { unreadCount } = useNotifications()  // Auto-computed
```

---

## Troubleshooting

### Q: Hook returns stale data
**A**: Query might be stale. Check `staleTime`:
```javascript
const notificationsQuery = useQuery({
  staleTime: 30000,  // Increase if needed
})
```

### Q: Optimistic update not showing
**A**: Ensure `onMutate` updates queryClient:
```javascript
onMutate: async (resource) => {
  // Must update cache immediately
  queryClient.setQueryData(QUERY_KEY, (current) => [
    resource,
    ...current
  ])
}
```

### Q: Error doesn't rollback
**A**: `onError` must restore previousData:
```javascript
onError: (error, args, context) => {
  queryClient.setQueryData(QUERY_KEY, context.previousData)
}
```

---

## Migration Checklist

When refactoring a component:

- [ ] Replace store usage with custom hook
- [ ] Remove useEffect syncing logic
- [ ] Use derived state instead of storing IDs
- [ ] Test optimistic updates work
- [ ] Verify loading/error states
- [ ] Check accessibility (disabled buttons during mutation)

---

## Performance Tips

1. **Memoize derived values**:
   ```javascript
   const favoriteIds = useMemo(
     () => favoriteItems.map(f => f.referencia_id),
     [favoriteItems]
   )
   ```

2. **Use Query selectors** to avoid re-renders:
   ```javascript
   const isFav = (id) => favoriteItems.some(f => f.id === id)
   // Instead of: const favoriteItems = useFavorites().favoriteItems
   ```

3. **Invalidate strategically**:
   ```javascript
   onSettled: () => {
     queryClient.invalidateQueries({ queryKey: FAVORITES_KEY })
     // Don't invalidate unrelated queries
   }
   ```

---

## References

- [Clean Architecture](../docs/CLEAN_ARCHITECTURE_STATE_MANAGEMENT.md)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://github.com/pmndrs/zustand)
