# ✅ REFACTORIZACIÓN COMPLETADA: Clean Architecture State Management

## 📊 Resumen Ejecutivo

Se refactorizó completamente el estado de **favoritos** y **notificaciones** eliminando duplicación entre Zustand y TanStack Query, implementando **Clean Architecture**.

**Commit**: `25ec5db` - Refactor state management: Clean Architecture for Favorites & Notifications

---

## 🎯 Problema Original

```
❌ ANTES (Duplicación de Estado)
┌─────────────────────────────────────────┐
│         Zustand Store                   │
│  favorites: [1, 2, 3]  (duplicado)     │
└─────────────────────────────────────────┘
          ↓ (useEffect de sincronización)
┌─────────────────────────────────────────┐
│      TanStack Query                     │
│  favoriteItems: [{...}, {...}, {...}]  │
│  (fuente real, pero inconsistente)     │
└─────────────────────────────────────────┘

Problemas:
- Duplicación de datos
- useEffect manual de sincronización
- Bugs de inconsistencia
- Código más complejo
```

---

## ✅ Solución Implementada

```
✅ DESPUÉS (Single Source of Truth)

TanStack Query (ÚNICA FUENTE DE VERDAD)
┌─────────────────────────────────────────┐
│  favoriteItems: [{...}, {...}, {...}]  │
│  (caché, optimistic updates, refetch)  │
└─────────────────────────────────────────┘
          ↓
Custom Hook (Coordinador)
┌─────────────────────────────────────────┐
│  useFavorites()                         │
│  - isFavorite() [DERIVADO]              │
│  - toggleFavorite() [OPTIMISTIC]        │
│  - addFavorite()                        │
│  - removeFavorite()                     │
└─────────────────────────────────────────┘
      ↙              ↘
  Componentes    Zustand Store
               (SOLO UI STATE)
            isSidebarOpen: bool
            filterType: string
            sortBy: string

Beneficios:
✅ Una sola fuente de verdad
✅ Optimistic updates (UI inmediata)
✅ Rollback automático en error
✅ Cero duplicación
✅ Código limpio
```

---

## 📝 Archivos Modificados

### Stores (Refactorizados)

#### 1. `src/store/useFavoritesStore.js`
```javascript
// ❌ ANTES
favorites: []
setFavorites()
addFavoriteId()
removeFavoriteId()

// ✅ DESPUÉS
isSidebarOpen: false      // UI state
filterType: null          // UI state
sortBy: 'created_at'      // UI state
// Datos ahora vienen de useQuery
```

#### 2. `src/store/useNotificationStore.js`
```javascript
// ❌ ANTES
unreadCount: 0            // Duplicado con query
lastNotification: null    // Duplicado con query
incrementUnread()
clearUnread()

// ✅ DESPUÉS
isNotificationPanelOpen: false  // UI state
notificationSound: true         // UI state
notificationPreference: 'all'   // UI state
// Datos ahora vienen de useQuery
```

---

## 🪝 Hooks (Refactorizados/Nuevos)

### 1. `src/hooks/useFavorites.js` (REFACTORIZADO)

**API**:
```javascript
const {
  // Datos (de Query - SINGLE SOURCE OF TRUTH)
  favoriteItems,        // Array completo
  
  // Derivados (computados from query)
  isFavorite(id),       // Función que checkea si está favoriteado
  
  // Acciones con optimistic updates
  toggleFavorite(resource),
  addFavorite(resource),
  removeFavorite(resourceId),
  
  // Estados
  isLoading,
  isError,
  isUpdatingFavorite,
  isAddingFavorite,
  isRemovingFavorite,
  
  // Avanzado
  favoritesQuery
} = useFavorites()
```

**Optimistic Updates Flow**:
```
toggleFavorite()
    ↓
onMutate: Actualiza UI inmediatamente ← UI reactiva
    ↓ (en paralelo)
    ├─ Request al servidor
    │   ├─ SUCCESS: Invalida query (refresh)
    │   └─ ERROR: Rollback a estado anterior
    ↓
Usuario ve cambios al instante ✅
```

### 2. `src/hooks/useNotifications.js` (NUEVO)

**API**:
```javascript
const {
  // Datos (de Query)
  notifications,              // Array completo
  
  // Derivados (computados)
  unreadCount,               // Número de no leídas
  unreadNotifications,       // Array filtrado
  hasUnread,                 // Boolean
  
  // Acciones con optimistic updates
  markAsRead(notificationId),
  markAllAsRead(),
  deleteNotification(notificationId),
  deleteAllNotifications(),
  
  // Estados
  isLoading,
  isError,
  isMarkingAsRead,
  isDeleting,
  
  // Avanzado
  notificationsQuery
} = useNotifications()
```

---

## 📱 Componentes Actualizados

### MainMap.jsx
```javascript
// ❌ ANTES
const favoriteIds = useFavoritesStore(state => state.favorites)

// ✅ DESPUÉS
const { favoriteItems } = useFavorites()
const favoriteIds = useMemo(() => 
  favoriteItems.map(f => f.referencia_id),
  [favoriteItems]
)
```

### PlaceDetailCard.jsx
✅ Ya estaba usando `useFavorites()` correctamente

### FavoritesPage.jsx
✅ Ya estaba usando `useFavorites()` correctamente

---

## 📚 Nueva Documentación

### 1. `src/docs/CLEAN_ARCHITECTURE_STATE_MANAGEMENT.md`
Guía completa de arquitectura con:
- Problema original
- Solución implementada
- Ejemplos de uso en componentes
- Flujo de optimistic updates
- Testing
- Patrones comunes

### 2. `src/hooks/README.md`
Guía de referencia para hooks con:
- API de cada hook
- Ejemplos de uso
- Patrón de arquitectura
- Troubleshooting
- Checklist de migración
- Tips de performance

### 3. `src/hooks/useFavorites.test.js`
Suite completa de tests verificando:
- Optimistic updates funcionan
- Rollback en error
- Derivación de estado
- Query invalidation
- Edge cases

---

## 🚀 Archivos Nuevos

```
src/
├── api/
│   └── notifications.js          ✨ NEW - API para notificaciones
├── hooks/
│   ├── useNotifications.js        ✨ NEW - Hook de notificaciones
│   ├── useFavorites.test.js       ✨ NEW - Tests para optimistic updates
│   └── README.md                  ✨ NEW - Guía de hooks
└── docs/
    └── CLEAN_ARCHITECTURE_STATE_MANAGEMENT.md  ✨ NEW - Arquitectura completa
```

---

## 📊 Comparativa Before/After

| Aspecto | Antes ❌ | Después ✅ |
|---------|---------|-----------|
| **Fuentes de verdad** | 2 (Store + Query) | 1 (Query) |
| **Líneas duplicadas** | 50+ | 0 |
| **useEffect sync** | Sí, manual | No, automático |
| **Optimistic updates** | No | Sí, built-in |
| **Rollback automático** | No | Sí |
| **Derivado isFavorite** | Acceso a array | Función .some() |
| **Líneas de código hook** | 131 | 157 (pero mejor estructurado) |
| **Testabilidad** | Media | Alta |
| **Bugs de sincronización** | Posible | Imposible |

---

## 🧪 Testing

### Comando
```bash
npm test -- useFavorites.test.js
```

### Casos de Prueba
- ✅ Optimistic update al agregar favorito
- ✅ Rollback automático en error
- ✅ isFavorite derivado de query data
- ✅ Query invalidation después de mutation
- ✅ Toggle múltiple rápido
- ✅ Remover favorito con rollback
- ✅ Edge cases (undefined data, null, etc)

---

## 🎓 Patrones Implementados

### 1. Single Source of Truth
```javascript
// Query es la única fuente
const favoritesQuery = useQuery({
  queryKey: FAVORITES_QUERY_KEY,
  queryFn: favoritesApi.getFavorites
})
// No duplicamos este data en Zustand
```

### 2. Derived State
```javascript
// En lugar de guardar IDs en store
const isFavorite = (resourceId) => {
  return favoritesQuery.data?.some(item =>
    item.referencia_id === resourceId
  )
}
// Se deriva automáticamente
```

### 3. Optimistic Updates
```javascript
onMutate: async (resource) => {
  // UI se actualiza INMEDIATAMENTE
  queryClient.setQueryData(QUERY_KEY, (current) => [
    resource,
    ...current
  ])
}

onError: (_error, _args, context) => {
  // Si falla, rollback automático
  queryClient.setQueryData(QUERY_KEY, context.previousData)
}

onSettled: () => {
  // Refetch para consistencia final
  queryClient.invalidateQueries(QUERY_KEY)
}
```

---

## 📋 Checklist de Migración

Para migrar otros estados (cart, wishlist, etc):

- [ ] Crear API hook (getXXX, addXXX, removeXXX)
- [ ] Crear custom hook (useXXX.js)
  - [ ] Query para datos
  - [ ] Funciones derivadas
  - [ ] Mutations con optimistic updates
- [ ] Limpiar store (solo UI state)
- [ ] Actualizar componentes (usar hook, no store)
- [ ] Crear tests
- [ ] Crear documentación

---

## 🔄 Flujo Detallado: Toggle Favorito

```
┌─────────────────────────────────────────────────────────────┐
│ Usuario hace click en ♥                                     │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ toggleFavorite(resource)                                    │
│ → Dispara useMutation.mutate()                             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ onMutate:                                                   │
│ 1. Cancela requests pending                               │
│ 2. Guarda previousFavorites (para rollback)               │
│ 3. ACTUALIZA UI INMEDIATAMENTE (optimistic)               │
│    queryClient.setQueryData(KEY, [...favorites, resource])│
│ 4. Retorna { previousFavorites }                          │
│                                                             │
│ → isFavorite(resource.id) ahora retorna TRUE ✅            │
└─────────────────────────────────────────────────────────────┘
                    ↓              ↓
         (en paralelo)      (en paralelo)
            ↓                      ↓
    ┌─────────────────┐  ┌──────────────────┐
    │ Servidor OK ✅  │  │ Servidor ERROR ❌ │
    │                 │  │                  │
    │ onSuccess:      │  │ onError:         │
    │ Nada (data ya   │  │ Rollback a       │
    │ está en cache)  │  │ previousFavorites│
    │                 │  │                  │
    │ onSettled:      │  │ onSettled:       │
    │ invalidate()    │  │ invalidate()     │
    │ → refetch       │  │ → refetch        │
    └─────────────────┘  └──────────────────┘
            ↓                      ↓
    Favorito guardado    Favorito removido
    permanentemente      (rollback)
```

---

## ⚡ Performance

### Optimizaciones Implementadas

1. **Memoization**:
   ```javascript
   const favoriteIds = useMemo(() =>
     favoriteItems.map(f => f.referencia_id),
     [favoriteItems]
   )
   ```

2. **Query staleTime**:
   - Favorites: 60 segundos
   - Notifications: 30 segundos
   - Previene refetches innecesarios

3. **Optimistic Updates**:
   - No espera servidor
   - UI reactiva al instante
   - Rollback si falla

### Resultado
- ✅ Sin duplicación = menos memory
- ✅ Menos re-renders = mejor performance
- ✅ Optimistic updates = mejor UX

---

## 📌 Próximos Pasos

Aplicar este patrón a:
- [ ] Cart/Carrito
- [ ] Wishlist
- [ ] User preferences
- [ ] Cualquier estado que se pueda cachar

---

## 🎯 Conclusión

Se implementó **Clean Architecture** eliminando:
- ❌ Duplicación de estado
- ❌ useEffect de sincronización manual
- ❌ Bugs de inconsistencia

Introduciendo:
- ✅ Single source of truth
- ✅ Optimistic updates
- ✅ Automatic rollback
- ✅ Código más limpio y testeable

**Commit**: `25ec5db` ✨
