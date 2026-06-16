# Angular Zoneless — Demo Técnica

App interactiva para demostrar en vivo los conceptos de la charla **"Despidiendo a zone.js"**.  
Cada sección es una demo funcional que puedes mostrar mientras explicas el concepto.

---

## Cómo levantar el proyecto

```bash
npm install
ng serve --open
```

> La app corre en `http://localhost:4200` con `provideZonelessChangeDetection()` habilitado —  
> **no hay zone.js en el bundle**.

---

## Estructura del proyecto

```
src/
├── main.ts                               ← bootstrapApplication con provideZonelessChangeDetection()
├── app/
│   ├── app.component.ts                  ← Shell con navegación entre demos
│   ├── app.routes.ts                     ← Rutas lazy-loaded por feature
│   └── features/
│       ├── cd-comparison/                ← Demo 1: Zone vs Zoneless
│       │   ├── tree-node/                ← Nodo visual reutilizable
│       │   ├── zone-tree/                ← Árbol con CD Default (simula Zone-based)
│       │   └── zoneless-tree/            ← Árbol con OnPush + signals
│       ├── signals-demo/                 ← Demo 2: Signals como reactive consumers
│       │   ├── normal-counter/           ← Hijo OnPush con @Input() clásico
│       │   └── signal-counter/           ← Hijo OnPush con input() signal (API moderna)
│       ├── scheduler-demo/               ← Demo 3: APIs asíncronas antes vs ahora
│       │   └── old-style-demo/           ← Componente OnPush con variables normales
│       └── extra-tips/                   ← Demo 4: afterNextRender, PendingTasks, versiones
```

---

## Las 4 demos — qué mostrar en cada una

---

### Demo 1 — `cd-comparison` · 🌲 Zone vs Zoneless

**Ruta:** `/cd-comparison`

**Concepto que demuestra:**  
La diferencia entre detección de cambios **global top-down** (Zone.js) y **semi-local targeted** (Zoneless).

**Qué hay en pantalla:**  
Dos árboles de componentes (A → B/E → C/D/F/G/H). El nodo **E** es el que recibe el cambio.

**Cómo usarlo:**

1. Presiona **"Cambio en E → appRef.tick()"** (Zone-based).
   - Todos los nodos se iluminan — el árbol entero se chequea.
   - Contador: **8 nodos chequeados**.

2. Presiona **"signal.set() → notify()"** (Zoneless).
   - Solo A (ancestro), E (fuente), F y G (consumen el signal) se actualizan.
   - B, C, D, H quedan opacos — saltados.
   - Contador: **4 chequeados / 4 saltados**.

**Punto clave:**  
> *"Con Zone.js cualquier evento async recorre TODO el árbol. Con Zoneless solo se renderizan los componentes que realmente cambiaron."*

---

### Demo 2 — `signals-demo` · ⚡ Signals como Reactive Consumers

**Ruta:** `/signals-demo`

**Concepto que demuestra:**  
Por qué las variables normales fallan en Zoneless con `OnPush`, y cómo los signals y la API `input()` resuelven el problema.

**Qué hay en pantalla:**  
Tres escenarios con el mismo componente hijo (`OnPush`):

- **Escenario A** — El padre muta `user.score++` directamente (misma referencia).  
  El hijo **no se re-renderiza** — la vista queda stale.

- **Escenario B** — El padre crea `{ ...user, score: n+1 }` (nueva referencia).  
  El hijo **sí se re-renderiza** — `OnPush` detecta el cambio de `@Input`.

- **Escenario C** — Usa `input()` signal (API moderna de Angular 17+).  
  El input **es** un Signal. El hijo puede derivar `computed()` y `effect()` directamente,  
  sin `ngOnChanges` ni `SimpleChanges`. Reactive consumer nativo.

**Punto clave:**  
> *"OnPush con objetos mutados es la trampa más común al migrar. La solución es inmutabilidad (spread) o directamente signals con `input()`."*

---

### Demo 3 — `scheduler-demo` · � Detección de cambios: antes vs ahora

**Ruta:** `/scheduler-demo`

**Concepto que demuestra:**  
En Zoneless, las APIs del browser (`setInterval`, HTTP) no triggean CD automáticamente.  
Cómo se manejaba antes (manual) vs cómo se maneja ahora (APIs reactivas).

**Qué hay en pantalla:**  
Dos columnas:

**Izquierda — `OldStyleDemoComponent` (OnPush, variables normales):**
- **setInterval sin fix**: el intervalo corre (el log lo prueba en tiempo real) pero la vista queda congelada porque no hay `markForCheck()`.
- **setInterval con markForCheck()**: la vista se actualiza en cada tick.
- **HTTP sin fix**: la respuesta llega (visible en el log) pero la vista no cambia.
- **HTTP con markForCheck()**: funciona correctamente, pero requiere dos llamadas manuales.

**Derecha — signals + resource APIs:**
- `signal.update()` en el intervalo → CD automática, cero `markForCheck()`.
- `httpResource()` → declarativo y reactivo. Cambia el id signal y la request se reenvía sola.
- `rxResource()` → igual pero el loader devuelve un Observable — interop con RxJS.

**Punto clave:**  
> *"El patrón `markForCheck()` no desaparece — sigue siendo válido. Pero con signals y resource APIs ya no necesitas pensar en ello: el scheduler lo gestiona solo."*

---

### Demo 4 — `extra-tips` · 💡 Extra Tips

**Ruta:** `/extra-tips`

**Concepto que demuestra:**  
Qué cambia en el código al migrar a Zoneless: APIs que son no-ops, reemplazos, y la hoja de ruta de versiones.

**Qué hay en pantalla:**  
Cuatro tarjetas + tabla de versiones.

1. **`afterNextRender / afterEveryRender`** — Reemplaza `NgZone.onStable.pipe(take(1))`.  
   Presiona el botón para ver el timestamp en tiempo real.

2. **NgZone — no-ops seguros** — `run()` y `runOutsideAngular()` no hacen nada en Zoneless  
   pero tampoco rompen nada. `onMicrotaskEmpty`, `onStable`, `onUnstable` nunca se disparan.

3. **SSR — PendingTasks** — Con Zone.js Angular esperaba los async automáticamente.  
   Con Zoneless hay que señalarlo explícitamente con `PendingTasks.add()`.

4. **Dev Safeguard** — `provideCheckNoChangesConfig` detecta mutaciones de estado  
   que no pasaron por signals. Solo en development.

5. **Tabla de versiones** — v17.1 (experimental) → v20 (estable) → v21+ (default) → v22 (estándar).

**Punto clave:**  
> *"La migración es incremental. Una línea activa Zoneless hoy. Angular 22 lo convierte en el estándar — zone.js queda como opt-in legacy."*

---

## El punto de entrada más importante

```typescript
// src/main.ts
bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(), // ← esta es la única línea que cambia
    provideRouter(routes),
    provideHttpClient(),
  ],
});
```

Puedes verificar que no hay zone.js abriendo  
**DevTools → Network → Filter: zone** → no hay ninguna petición.

---

## Stack técnico

| Qué | Versión / Detalle |
|-----|-------------------|
| Angular | 20.x |
| Change Detection | `provideZonelessChangeDetection()` |
| State | `signal`, `computed`, `effect`, `input()` |
| HTTP | `httpResource`, `rxResource` |
| Componentes | Standalone, `ChangeDetectionStrategy.OnPush` |
| Routing | Lazy-loaded por feature |
| zone.js | ❌ No incluido |
