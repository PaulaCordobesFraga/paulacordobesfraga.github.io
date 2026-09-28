import random,json,csv
from pathlib import Path
p=Path(__file__).parent
rng=random.Random(27092026)
rows=[]
for m in range(1,7):
 for i in range(180+20*m):
  cat=rng.choices(['Prendas','Calzado','Accesorios'],[5,3,2])[0]
  channel=rng.choice(['Tienda','Online'])
  price={'Prendas':60,'Calzado':90,'Accesorios':30}[cat]
  cost={'Prendas':24,'Calzado':42,'Accesorios':9}[cat]
  units=rng.choices([1,2,3],[8,2,1])[0]
  discount=rng.choices([0,10,20,30],[4,3,2,1+m/3])[0]
  ret=sum(rng.random()<({'Prendas':.12,'Calzado':.18,'Accesorios':.04}[cat] if channel=='Online' else .04) for _ in range(units))
  gross=price*units*100
  net=price*(100-discount)*(units-ret)
  cogs=cost*100*(units-ret)
  handling=ret*(600 if channel=='Online' else 200)
  rows.append(dict(order=f'SIM-{len(rows)+1:04}',month=f'2026-{m:02}',category=cat,channel=channel,units=units,returned=ret,listCents=gross,discountCents=price*units*discount,netCents=net,cogsCents=cogs,returnCostCents=handling,contributionCents=net-cogs-handling,unitPrice=price,unitCost=cost,discountPct=discount))
with (p/'ventas-simuladas.csv').open('w') as f:
 w=csv.DictWriter(f,fieldnames=rows[0]);w.writeheader();w.writerows(rows)
source={'label':'Simulación reproducible · semilla 27092026','description':'Tienda ficticia. Generado con Python random, sin datos personales ni ventas reales. Una fila por pedido monoproducto; enero-junio 2026. Importe en céntimos, sin IVA. Las devoluciones se imputan al mes del pedido; todas las cohortes se consideran cerradas. Artículos devueltos recuperables al coste íntegro. No incluye costes fijos, envío inicial ni captación.','filters':['Enero-junio 2026; pedidos sintéticos; cohortes cerradas'],'metricDefinitions':[{'label':'Ventas netas','definition':'Precio × (1−descuento) × (unidades−devoluciones). Sin IVA.'},{'label':'Contribución parcial','definition':'Ventas netas − coste de unidades retenidas − manipulación de devoluciones. No es beneficio neto ni margen de contribución completo.'},{'label':'Tasa de devolución','definition':'Unidades devueltas / unidades vendidas, ponderada por unidades.'},{'label':'Descuento ponderado','definition':'Descuento bruto en euros / ventas brutas a precio de tarifa, antes de devoluciones.'}]}
snapshot={'id':'retail-lab-sim-2026','surface':'dashboard','title':'Retail Lab · decisiones comerciales','generatedAt':'2026-09-28T12:00:00Z','status':'synthetic','buildStatus':'creating','filters':[{'id':'channel','label':'Canal','field':'channel','defaultValue':'all'},{'id':'category','label':'Categoría','field':'category','defaultValue':'all'}],'queries':{'sales':{'rows':rows,'source':source}}}
(p/'snapshot.json').write_text(json.dumps(snapshot,ensure_ascii=False))
# Integrity checks independent of exported net field
assert len({r['order'] for r in rows})==len(rows)
assert all(0<=r['returned']<=r['units'] for r in rows)
assert sum(r['netCents'] for r in rows)==sum(r['unitPrice']*(100-r['discountPct'])*(r['units']-r['returned']) for r in rows)
for k in ['netCents','contributionCents','units','returned']:
 assert sum(r[k] for r in rows)==sum(sum(r[k] for r in rows if r['category']==c) for c in ['Prendas','Calzado','Accesorios'])
print(json.dumps({'orders':len(rows),'totals':{k:sum(r[k] for r in rows) for k in ['netCents','contributionCents','units','returned']}}))
