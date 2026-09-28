import React from 'react';
import {EvidenceChart,DataComponent,MetricCard,Filters,Section,SortableRegion,SortableItem,useDataApp} from '../../data-app-public.jsx';
import './retail.css';
const euro=n=>new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n);
const pct=n=>new Intl.NumberFormat('es-ES',{style:'percent',maximumFractionDigits:1}).format(n);
const sum=(r,k)=>r.reduce((s,x)=>s+x[k],0);
function aggregate(rows,key){return [...new Set(rows.map(r=>r[key]))].sort().map(v=>{const a=rows.filter(r=>r[key]===v);return {[key]:v,ventas:sum(a,'netCents')/100,contribucion:sum(a,'contributionCents')/100,returnRate:sum(a,'returned')/sum(a,'units'),units:sum(a,'units'),returns:sum(a,'returned')};});}
export function DashboardContent(){
 const app=useDataApp(); const rows=app.reviewedRows('sales',['month','category','channel','order']);
 const rev=sum(rows,'netCents')/100,con=sum(rows,'contributionCents')/100,units=sum(rows,'units'),returns=sum(rows,'returned');
 const monthly=aggregate(rows,'month'),cats=aggregate(rows,'category'),channels=aggregate(rows,'channel');
 const metrics=[['sales-kpi','Ventas netas',euro(rev)],['con-kpi','Contribución parcial',euro(con)],['returns-kpi','Devoluciones',pct(returns/units)],['discount-kpi','Descuento ponderado',pct(sum(rows,'discountCents')/sum(rows,'listCents'))]];
 return <article className="retail-case">
 <div className="retail-intro"><p className="retail-eyebrow">PROYECTO APLICADO · EXCEL + RETAIL</p><h1>Estrategia comercial y experiencia de cliente</h1><p>Análisis de ventas, evaluación de promociones y propuesta de mejora del recorrido de compra. Tienda ficticia de moda · enero–junio de 2026 · 1.500 pedidos simulados.</p><p className="retail-training">Aplicación práctica de Excel y de las áreas Retail &amp; Customer Experience de su formación. Caso independiente con datos simulados.</p><a className="retail-download" href="./Retail-Lab-Excel.xlsx" download>Descargar proyecto en Excel ↓</a><span> · </span><a href="./caso.html">Caso de negocio y método</a><span> · </span><a href="./ventas-simuladas.csv" download>Descargar datos CSV</a><span> · </span><a href="../">Volver al portfolio</a></div>
 <Filters filters={app.snapshot.filters} queries={app.queries} values={app.filters} onChange={app.setFilter}/>
 {!rows.length?<p>No hay pedidos para esta selección.</p>:<>
 <SortableRegion id="retail:metrics" variant="canvas" columns={12} rows={[{id:'retail:kpis',kind:'metrics',items:metrics.map(x=>x[0])}]} spacing="standard">
 {metrics.map(([id,title,value])=><SortableItem key={id} id={id} label={title} kind="metric" span={3}><MetricCard id={id} queryId="sales" title={title} value={value} sourceRows={rows} displayRows={[{indicador:title,valor:value}]}/></SortableItem>)}
 </SortableRegion>
 <p className="retail-note" data-reviewed-rows>{rows.length.toLocaleString('es-ES')} pedidos · {units.toLocaleString('es-ES')} unidades · {returns} devueltas. Contribución parcial / ventas netas: {pct(con/rev)}. No incluye costes fijos, transporte inicial ni captación; no equivale a beneficio neto.</p>
 <Section id="trend-title" title="01 · Evolución comercial">
 <EvidenceChart id="monthly" queryId="sales" title="Ventas y contribución parcial por mes (€)" rows={monthly} sourceRows={rows} variant="card" height={300} spec={{type:'line',x:'month',y:'ventas',fields:['ventas','contribucion'],currency:'EUR',valueDecimals:0,stackable:false,legend:{labels:{ventas:'Ventas netas',contribucion:'Contribución parcial'}}}}/>
 </Section>
 <Section id="segments-title" title="02 · Surtido y experiencia de compra" columns={2}>
 <EvidenceChart id="category" queryId="sales" title="Contribución parcial por categoría (€)" rows={cats} sourceRows={rows} variant="card" height={280} spec={{type:'horizontalBar',x:'category',y:'contribucion',currency:'EUR',valueDecimals:0}}/>
 <EvidenceChart id="channel" queryId="sales" title="Devoluciones por canal (% de unidades)" rows={channels} sourceRows={rows} variant="card" height={280} spec={{type:'bar',x:'channel',y:'returnRate',valueDecimals:1}}/>
 </Section>
 <Section id="decisions-title" title="03 · De la evidencia a la decisión">
 <DataComponent id="decisions" queryId="sales" title="Lectura de la selección actual" sourceRows={rows} displayRows={cats} variant="card">
 <div data-reviewed-rows><p><strong>{[...cats].sort((a,b)=>b.contribucion-a.contribucion)[0]?.category}</strong> concentra la mayor contribución parcial de esta selección. Antes de ampliar compras, comprobar rotación, stock y demanda: no están disponibles en este conjunto.</p><p>La tasa de devolución de los pedidos seleccionados es <strong>{pct(returns/units)}</strong>. Revisar tallas, expectativas de producto y motivos de devolución sería el siguiente paso; el canal por sí solo no demuestra la causa.</p></div>
 </DataComponent>
 </Section>
 </>}
 <Section id="plan-title" title="04 · Plan propuesto de 30 / 60 / 90 días">
 <div className="retail-plan"><div><b>30 días · Diagnosticar</b><p>Registrar motivos de devolución y costes de envío/captación. Revisar margen por SKU, stock y calidad de las fichas de producto.</p><small>Entregable: línea base y lista de incidencias priorizada.</small></div><div><b>60 días · Experimentar</b><p>Probar una guía de tallas mejorada frente a la versión actual. Comparar pedidos equivalentes y esperar a que cierre la ventana de devolución.</p><small>Medir devoluciones por unidad; vigilar conversión y satisfacción.</small></div><div><b>90 días · Decidir</b><p>Evaluar contribución completa, devoluciones y conversión. Mantener la prueba solo si la mejora compensa su coste y no empeora la compra.</p><small>No se presupone un resultado ni se promete un incremento de ventas.</small></div></div>
 </Section>
 <Section id="promo-title" title="05 · Ejercicio de decisión: una promoción del 20 %">
 <div className="retail-example"><h3>Producto hipotético: precio 60 € · coste 24 €</h3><p>Sin descuento deja 36 € por unidad; al 20 %, deja 24 €. Para mantener 360 € de contribución se necesitan 15 unidades en vez de 10: <strong>un 50 % más de volumen</strong>.</p><p>Supuesto didáctico independiente de los filtros: sin devoluciones ni costes adicionales. Es un umbral contable, no una predicción de demanda. Una promoción debe superar este umbral y cubrir sus costes antes de considerarse rentable.</p></div>
 </Section>
 <Section id="method-title" title="Método y límites">
 <p>Una fila por pedido monoproducto. Ventas netas = precio × (1 − descuento) × unidades retenidas. Contribución parcial = ventas netas − coste del producto retenido − manipulación de devoluciones. Sin IVA; devolución imputada al mes del pedido; todas las cohortes cerradas y productos recuperables. Los patrones dependen del generador sintético y no describen el mercado.</p><p>Los filtros afectan a los indicadores, gráficos y lectura comercial; el plan y el ejercicio promocional son propuestas generales. Consulta los datos de cada gráfico en su menú de fuentes.</p>
 </Section>
 </article>;
}
