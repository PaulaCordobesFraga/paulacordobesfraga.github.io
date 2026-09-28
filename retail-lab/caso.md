# Retail Lab — Excel, estrategia comercial y experiencia de cliente

Caso práctico de una tienda ficticia de moda, con datos simulados y un plan comercial propuesto.

## Resumen ejecutivo

**Reto:** decidir qué revisar primero para vender de forma sostenible: promociones, surtido o devoluciones.

**Alcance:** 1.500 pedidos monoproducto simulados, enero–junio de 2026, tres categorías y dos canales. El panel permite explorar la misma población por canal y categoría. Las decisiones propuestas combinan criterio comercial, atención al cliente y lectura económica.

**Entregables:** libro de Excel con fórmulas y simulador, panel interactivo, datos descargables, generador reproducible, método, propuesta experimental y plan de 90 días. No hay una implementación comercial ni impacto conseguido.

## Relación con la formación

**Excel — Santander Open Academy:** aplicación de tablas filtrables, SUMIFS, ratios, fórmulas de ventas netas y un simulador de descuentos. El archivo Retail-Lab-Excel.xlsx permite inspeccionar los cálculos y modificar los supuestos de la promoción.

**Inside LVMH — Retail & Customer Experience:** propuesta de mejora del recorrido de compra, atención a la información de producto y diseño de una prueba centrada en la experiencia de cliente.

Caso independiente, sin afiliación ni evaluación por estas entidades. La relación corresponde a las áreas de formación; no se afirma que las técnicas concretas formen parte del temario certificado.

## Qué muestran los datos simulados

- Ventas netas de 103.941 €, después de descuentos y devoluciones.
- Contribución parcial de 53.083 €: excluye costes fijos, envío inicial y captación. No debe llamarse beneficio neto.
- 160 devoluciones sobre 2.045 unidades: 7,8 %.
- Online: 117 / 1.031 unidades devueltas (11,3 %); tienda: 43 / 1.014 (4,2 %).

La diferencia entre canales es descriptiva, no causal. Está condicionada por las reglas del generador. No demuestra que vender online provoque devoluciones ni que una guía de tallas vaya a reducirlas. No usar estos porcentajes como referencias del sector.

## Recomendación comercial

Priorizar un diagnóstico de devoluciones online y evitar descuentos generales sin comprobar su punto de equilibrio. La propuesta es investigar antes de aumentar compras o escalar campañas.

1. Recoger motivos de devolución por producto: talla, expectativa, defecto y otros; permitir texto libre y proteger la privacidad.
2. Revisar fichas, guía de tallas, fotografías, plazos y política de devolución. Son hipótesis de mejora, no deficiencias observadas en una empresa real.
3. Contrastar stock y rotación antes de aumentar inversión en categorías con más contribución. El conjunto no contiene inventario ni visitas web.
4. Incorporar transporte y captación al análisis económico antes de aprobar una promoción.

## Experiencia de cliente: una propuesta concreta

**Antes de comprar:** medidas de la prenda, instrucciones para medirse, ajuste descrito con claridad y condiciones de devolución visibles.

**Al recibir:** información de cuidado y un acceso sencillo a cambios o devoluciones.

**Tras devolver:** recoger el motivo sin dificultar la devolución. Usar los resultados para mejorar información y producto, sin penalizar al cliente.

**Ejemplo de microcopy para una ficha ficticia:** «Consulta las medidas de esta prenda y compáralas con una que te quede bien. Si dudas entre dos tallas, revisa el tipo de ajuste antes de elegir». Validar el contenido con medidas reales antes de usarlo.

## Diseño de prueba

Hipótesis: una guía de tallas más clara podría reducir devoluciones por talla sin perjudicar la conversión.

- Asignar visitantes elegibles al azar entre ficha actual y ficha mejorada; mantener una versión por visitante y registrar exposición.
- Evaluar devoluciones por talla / unidades entregadas una vez cerrada la misma ventana de devolución en ambos grupos.
- Vigilar conversión (pedidos / visitantes elegibles), contribución completa por visitante, satisfacción y consultas al soporte.
- Definir previamente efecto mínimo relevante, tamaño de muestra, duración y criterio de parada con el equipo. No hay tráfico suficiente en este caso para calcularlos: faltan visitantes y datos de conversión.
- Revisar intervalos de incertidumbre y diferencias de mezcla. No detener la prueba al primer resultado favorable.
- Escalar solo si el beneficio económico esperado cubre la implementación y no hay un deterioro relevante de las métricas de protección.

## Promociones: caso numérico

Producto hipotético a 60 €, coste 24 €. Sin descuento: 36 € por unidad. Descuento del 20 %: precio 48 €, contribución 24 €. Para igualar la contribución de diez unidades a precio completo se necesitan quince rebajadas: +50 % de unidades. Sin retornos ni otros costes. El umbral no implica que exista esa demanda.

Fórmula general del aumento mínimo de volumen: `(precio − coste) / (precio × (1 − descuento) − coste) − 1`, solo si el denominador es positivo. Con denominador cero o negativo, vender más no recupera la contribución inicial bajo esos supuestos.

## Plan de trabajo

| Periodo | Acción | Entregable y criterio |
| --- | --- | --- |
| Días 1–30 | Completar costes, motivos de devolución e inventario | Línea base conciliada y lista priorizada de hipótesis |
| Días 31–60 | Preparar prueba de información de tallas | Asignación y medición verificadas; ventana de devolución definida |
| Días 61–90 | Esperar cohortes maduras y evaluar | Decisión documentada: ampliar, ajustar o detener; sin resultado garantizado |

## Diccionario y método

Importes de origen en céntimos; presentación en euros, sin IVA. Una fila equivale a un pedido con una categoría y precio único. No hay identificadores de clientes. `order` es una clave sintética.

- `month`: mes del pedido; `category`: Prendas, Calzado o Accesorios; `channel`: Tienda u Online.
- `units`: unidades pedidas; `returned`: unidades devueltas.
- `unitPrice`, `unitCost`: precio y coste unitarios en euros.
- `discountPct`: descuento entero en puntos porcentuales.
- `listCents`: precio × unidades × 100.
- `discountCents`: precio × unidades × porcentaje de descuento.
- `netCents`: precio × (100 − descuento) × (unidades − devueltas).
- `cogsCents`: coste × 100 × unidades retenidas.
- `returnCostCents`: manipulación, 600 céntimos por unidad online y 200 en tienda, supuestos didácticos.
- `contributionCents`: netCents − cogsCents − returnCostCents.

Se recupera el coste íntegro de las unidades devueltas. Las devoluciones se atribuyen al mes del pedido y todas las cohortes se consideran cerradas. No se modelan daños, plazos, IVA, costes fijos, transporte inicial ni captación. Las tasas globales se calculan con numeradores y denominadores sumados, nunca como promedio simple de tasas de grupo.

Generación con Python estándar, semilla 27092026. Ejecutar `python3 generate.py` crea el mismo CSV y snapshot analítico. El generador contiene comprobaciones de claves, unidades, fórmulas y conciliación por categoría. La creación del panel utilizó el componente Data de ChatGPT; no requiere ese entorno para visualizarlo publicado.

## Cómo trabajarlo antes de una entrevista

1. Abrir el CSV en Excel y comprobar los totales con una tabla dinámica por mes, categoría y canal.
2. Recalcular ventas netas y contribución de cinco pedidos, incluyendo uno devuelto.
3. Elegir una decisión propia y explicar por qué se prioriza sobre las otras.
4. Cambiar un supuesto de coste y analizar cómo cambia la recomendación.
5. Escribir una reflexión personal y registrar las modificaciones realizadas. Solo entonces describir con precisión la aportación propia.

**Preguntas para practicar:**

- ¿Por qué más ventas no siempre significan más rentabilidad?
- ¿Qué costes faltan para aprobar una campaña?
- ¿Qué puede explicar la diferencia de devoluciones entre canales?
- ¿Qué dato pedirías primero y cómo cambiaría tu decisión?
- ¿Cómo distinguirías una mejora real de una variación aleatoria?
- ¿Qué parte revisaste o realizaste tú y qué parte se preparó con IA?


