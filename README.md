# Angular Zoneless — Demo Técnica

App interactiva para demostrar en vivo los conceptos de la charla **"Despidiendo a zone.js"**.  
Cada sección es una demo funcional que puedes mostrar mientras explicas el concepto.

---

## Cómo levantar el proyecto

```bash
# Desde la raíz del proyecto
cd /Users/robinson.rodriguez/projects/zoneless/zoneless-demo

# Levantar el servidor de desarrollo
ng serve --open
# o si ng no está en el PATH:
node node_modules/@angular/cli/bin/ng.js serve --open
```

> La app corre en `http://localhost:4200` y ya tiene `provideZonelessChangeDetection()` habilitado —  
> **no hay zone.js en el bundle**.

---

## Estructura del proyecto

```
src/
├── main.ts                          ← bootstrapApplication con provideZonelessChangeDetection()
├── app/
│   ├── app.component.ts             ← Shell con navegación entre demos
│   ├── app.routes.ts                ← Rutas lazy-loaded por feature
│   └── features/
│       ├── cd-comparison/           ← Demo 1: Zone vs Zoneless
│       ├── signals-demo/            ← Demo 2: Signals como reactive consumers
│       ├── scheduler-demo/          ← Demo 3: notify / markAncestors / markViewDirty
│       └── extra-tips/              ← Demo 4: afterNextRender, PendingTasks, versiones
```

---

## Las 4 demos — qué mostrar en cada una

---

### Demo 1 — `cd-comparison` · 🌲 Zone vs Zoneless

**Ruta:** `/cd-comparison`

**Concepto que demuestra:**  
La diferencia entre detección de cambios **global top-down** (Zone.js) y **semi-local targeted** (Zoneless).

**Qué hay en pantalla:**  
Dos árboles de componentes idénticos (A → B/E → C/D/F/G/H). Ambos representan la misma app.  
El nodo **E** es el que recibe el cambio de estado.

**Cómo usarlo en la demo:**

1. Presiona **"Cambio en E → appRef.tick()"** en el árbol Zone-based.
   - Todos los nodos se iluminan en verde → el árbol entero se chequea.
   - Los contadores suben en **todos** los nodos: A, B, C, D, E, F, G, H.
   - El contador "nodos chequeados" muestra **8/8**.

2. Presiona **"signal.set() → notify()"** en el árbol Zoneless.
   - Solo se iluminan: **A** (ancestro marcado), **E** (fuente del cambio), **F** y **G** (hijos que consumen el signal).
   - B, C, D, H quedan en gris/opaco → **saltados, no chequeados**.
   - El contador "nodos saltados" muestra **4**.

3. Presiona varias veces en ambos y compara los contadores acumulados.

**Punto clave para decir:**  
> *"Con Zone.js, cualquier evento async — un click, un timer, un fetch — dispara appRef.tick() y Angular recorre TODO el árbol. Con Zoneless, solo se renderizan los componentes que realmente cambiaron."*

---

### Demo 2 — `signals-demo` · ⚡ Signals como Reactive Consumers

**Ruta:** `/signals-demo`

**Concepto que demuestra:**  
Por qué las variables normales no funcionan en Zoneless, y cómo un Signal convierte la vista en un **reactive consumer** del grafo de signals.

**Qué hay en pantalla:**  
Dos paneles lado a lado:
- **Izquierda:** variable normal (`normalCount = 0`)
- **Derecha:** signal (`count = signal(0)`) con dos `computed()` derivados

**Cómo usarlo en la demo:**

1. Presiona **"normalCount++"** varias veces.
   - El número en pantalla **no cambia** (o cambia solo al hacer otras interacciones).
   - La advertencia en rojo explica por qué: sin Zone.js no hay nadie que dispare la CD.
   - El log muestra el mensaje: *"template NO se actualiza en Zoneless sin markForCheck"*.

2. Presiona **"count.update(n => n+1)"** en el panel de Signals.
   - El valor se actualiza **instantáneamente**.
   - Los `computed()` (`doubled`, `isEven`) se recalculan solos.
   - El `effect()` en el log se dispara automáticamente.

3. Muestra el código al final de la página que contrasta ambos enfoques.

**Punto clave para decir:**  
> *"El template de un componente es un 'reactive consumer' en el grafo de signals. Cuando un signal cambia, Angular sabe exactamente qué vista consumía ese valor y la marca como dirty — sin necesidad de Zone.js."*

---

### Demo 3 — `scheduler-demo` · 🔔 Operaciones del Scheduler

**Ruta:** `/scheduler-demo`

**Concepto que demuestra:**  
Las tres operaciones internas del **Zoneless Scheduler** que reemplazan el `onMicrotaskEmpty` de Zone.js.

**Qué hay en pantalla:**  
- Dos "vistas" reactivas que consumen un signal (`stateValue`) y un `computed()`.
- Tres tarjetas clicables: `notify()`, `markAncestors`, `markViewDirty`.
- Un log en tiempo real que muestra cada operación con timestamp de milisegundos.

**Cómo usarlo en la demo:**

1. Haz clic en **`notify()`**.
   - Las vistas se iluminan (animación glow).
   - El log muestra la secuencia completa:
     ```
     notify    signal.set(1) → scheduler.notify() → CD en próximo frame
     mark      markAncestors(viewRef) → ancestros marcados como HasChildViewsToRefresh
     render    Solo SchedulerDemoComponent re-renderiza
     ```
   - El valor en las vistas sube en +1.

2. Haz clic en **`markAncestors`**.
   - No cambia el valor de la vista, pero el log muestra el recorrido hacia la raíz.
   - Explica que esto es lo que sucede internamente cuando un signal notifica.

3. Haz clic en **`markViewDirty`**.
   - Muestra que también puedes marcar una vista manualmente sin signal.
   - Equivalente a `ChangeDetectorRef.markForCheck()` que ya conocen.

**Punto clave para decir:**  
> *"El scheduler zoneless tiene tres operaciones: notify() cuando algo cambia, markAncestors para subir la marca hacia la raíz, y markViewDirty para marcar la vista exacta. En Zone.js esto era automático pero opaco. En Zoneless es explícito y predecible."*

---

### Demo 4 — `extra-tips` · 💡 Extra Tips

**Ruta:** `/extra-tips`

**Concepto que demuestra:**  
Qué cambia en el código cuando migras a Zoneless: APIs que desaparecen, reemplazos, y la hoja de ruta de versiones.

**Qué hay en pantalla:**  
Cuatro tarjetas con código + una tabla de versiones al final.

**Cómo recorrerla:**

1. **`afterNextRender / afterEveryRender`** — Muestra el botón interactivo.
   - Presiona "Ejecutar afterNextRender()" y observa el timestamp que aparece.
   - Explica que reemplaza `NgZone.onStable.pipe(take(1)).subscribe(...)`.

2. **NgZone — no-ops seguros** — Muestra el código estático.
   - `NgZone.run()` y `runOutsideAngular()` se vuelven no-ops → no rompen nada.
   - `NgZone.isInAngularZone()` siempre retorna `true` → evitar como condición.
   - `onMicrotaskEmpty`, `onUnstable`, `onStable` **nunca se disparan**.

3. **SSR — PendingTasks** — Muestra el snippet de código.
   - En SSR con Zone.js, Angular esperaba automáticamente a que terminaran los async.
   - Con Zoneless hay que señalar explícitamente el trabajo pendiente con `PendingTasks.add()`.

4. **Dev Safeguard** — Muestra `provideCheckNoChangesConfig`.
   - Herramienta de desarrollo que detecta mutaciones de estado que no pasaron por signals.
   - Solo usar en development, nunca en producción.

5. **Tabla de versiones** — Úsala como cierre.
   - Recorre la línea v17.1 → v18 → v20 → v21+ → v22.
   - Destaca que en **v20 (actual) ya es estable** con `provideZonelessChangeDetection()`.
   - En **v21+ ya es el default** — no necesitas ningún provider.

**Punto clave para decir:**  
> *"La migración es incremental. Hoy puedes activar Zoneless con una línea. Si tu app usa OnPush, ya es compatible. Angular 22 lo convierte en el estándar — zone.js queda como opt-in legacy."*

---

## El punto de entrada más importante

```typescript
// src/main.ts
bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(), // ← esta es la única línea que cambia
    provideRouter(routes),
  ],
});
```

Toda la app corre sin `zone.js` en los polyfills. Puedes demostrarlo abriendo  
**DevTools → Network → Filter: zone** → no hay ninguna petición de `zone.js`.

---

## Stack técnico

| Qué | Versión |
|-----|---------|
| Angular | 20.x |
| Change Detection | `provideZonelessChangeDetection()` |
| State | Signals (`signal`, `computed`, `effect`) |
| Componentes | Standalone, `ChangeDetectionStrategy.OnPush` |
| Routing | Lazy-loaded por feature |
| Estilos | SCSS inline en cada componente |
| zone.js | ❌ No incluido |
