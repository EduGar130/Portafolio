# Contexto del Proyecto: Portafolio Personal

Fecha de actualizacion: 2026-04-02

## Vision general

Este proyecto es un portafolio personal en frontend vanilla (HTML, CSS, JS) con enfoque visual tipo archivador abierto.

La metafora principal es:

- En PC, el navegador se comporta como pestanas/marcadores laterales de carpeta.
- En movil, la navegacion se transforma en barra inferior.
- Cada seccion funciona como una hoja de libreta con fondo cuadriculado.
- El scroll es cautivo y personalizado (desktop vertical, movil horizontal).

## Identidad visual y UX (estado actual)

Implementado y operativo:

- Metafora de archivador mediante sidebar principal + sidebar secundario decorativo.
- Navegacion por iconos sin texto en PC.
- Reposicionamiento responsive a barra inferior en movil (breakpoint 768px).
- Fondo tipo papel/cuadricula por capas (patron + textura + ruido).
- Tema claro/oscuro con rueda visual dedicada.
- Selector de idioma ES/EN con rueda visual dedicada.
- Tarjeta destacada de experiencia con estetica de papel, badge IBM Partner, entrada por interseccion y CTA al modal de Minsait.

## Arquitectura tecnica

- Stack: HTML5 + CSS3 + JavaScript vanilla.
- Sin framework de build (sitio estatico).
- i18n con JSON locales:
  - `assets/es.json`
  - `assets/en.json`
- Scripts principales:
  - `js/script.js` (navegacion, i18n, tema, SEO dinamico, modales, scroll, reveal de tarjeta destacada)
  - `js/veritas.js` (logica de `veritas.html`)
  - `js/loadSections.js` (actualmente minimal/stub)
- Estilos:
  - `css/styles.css` (sitio principal)
  - `css/veritas.css` (pagina Veritas)

## Flujo funcional resumido

1. Carga `index.html` con secciones embebidas en una sola pagina.
2. `js/script.js` inicializa idioma, tema, listeners y modo de navegacion segun viewport.
3. Desktop: scroll vertical cautivo por seccion.
4. Movil: desplazamiento horizontal por seccion con interaccion tactil.
5. Sidebar y estado visual se sincronizan con la seccion activa.

## Convenciones utiles para futuras tareas

- Breakpoint principal de comportamiento: `768px`.
- El concepto visual no debe romperse:
  - PC: navegacion lateral tipo carpeta (iconos como marcadores).
  - Movil: navegacion inferior.
  - Secciones: aspecto hoja/cuadricula.
  - Scroll: controlado/cautivo.
- Si se modifica i18n, mantener paridad de claves entre `es.json` y `en.json`.
- Evitar cambios que conviertan el layout en plantilla generica; preservar el lenguaje visual de archivador.

## Estado de deuda tecnica detectada (alto nivel)

- Existe carpeta `sections/` con HTMLs que no gobiernan el flujo principal actual.
- `js/loadSections.js` hoy no implementa carga dinamica real.
- `js/script.js` concentra mucha logica y tiene puntos fragiles por selectores/IDs acoplados.

## Objetivo de este documento

Servir como referencia rapida y estable para futuras conversaciones, refactors y decisiones de diseno/arquitectura, manteniendo la identidad visual original del portafolio.
