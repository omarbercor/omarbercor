---
order: 5
title: "Mi Homelab en 2026"
subtitle: "Por qué regresé el control de mis servicios a Proxmox, contenedores LXC y hardware propio en lugar de rentarlo todo en la nube"
excerpt: "Arquitectura detallada, segmentación de redes VLAN, virtualización ligera con LXC y el análisis financiero de recuperar el control de tus herramientas de trabajo."
date: "Junio 2026"
readTime: "10 min lectura"
category: "Infraestructura & Privacidad"
tags: ["Homelab","Proxmox","LXC","Self-Hosting","DevOps"]
coverImage: "/images/writing/photo-1544197150-b99a580bb7a8.jpg"
---

Durante años, la corriente dominante en la industria nos convenció de que cualquier aplicación, base de datos o script auxiliar debía ejecutarse en una instancia administrada en la nube pública. Para proyectos corporativos de escala global, la nube sigue siendo insustituible; pero para herramientas personales, entornos de desarrollo, almacenamiento y automatizaciones internas, la acumulación de micro-facturas SaaS se volvió insostenible.

En 2026, mi centro de comando técnico corre sobre mi propio hardware gobernado por **Proxmox VE**.

### La elegancia de los contenedores LXC
A diferencia de levantar pesadas máquinas virtuales completas para cada servicio, los contenedores LXC comparten el kernel de Linux del host con aislamiento estricto:
- Tiempos de arranque en milisegundos.
- Consumo de RAM y CPU ridículamente bajo (servidores completos operando con 256MB de memoria).
- Facilidad para asignar volúmenes ZFS y respaldos snapshot instantáneos.

### La topología de servicios
En este entorno residen:
1. **n8n:** Orquestación de flujos y tareas programadas continuas.
2. **PostgreSQL & Redis:** Bases de datos de desarrollo y colas de trabajo.
3. **Ollama:** Inferencia de modelos de lenguaje sobre hardware local.
4. **Nginx Proxy Manager & Cloudflare Tunnels:** Enrutamiento seguro con certificados SSL automáticos sin abrir puertos directos en el router residencial.
5. **Vaultwarden & Gitea:** Gestión de credenciales y repositorios espejo privados.

> "El homelab no es un capricho nostálgico de administración de sistemas; es el laboratorio definitivo para experimentar con arquitecturas resilientes sin un taxímetro cobrándote por cada segundo de ejecución."
