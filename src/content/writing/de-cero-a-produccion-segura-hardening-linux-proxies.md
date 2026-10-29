---
order: 7
title: "De cero a producción segura"
subtitle: "Guía rápida de hardening en servidores Linux y proxies inversos para dormir tranquilo con tus aplicaciones auto-hospedadas"
excerpt: "Protocolos esenciales de fortificación en servidores Linux: llaves SSH sin contraseña, fail2ban, cortafuegos UFW estricto y configuración óptima de proxies inversos SSL."
date: "Abril 2026"
readTime: "9 min lectura"
category: "Infraestructura & Privacidad"
tags: ["Linux Hardening","Reverse Proxy","SSH","Seguridad","Sysadmin"]
coverImage: "/images/writing/photo-1526374965328-7f61d4dc18c5.jpg"
---

Poner una máquina Linux en internet con su configuración por defecto es cuestión de minutos antes de que scripts automatizados comiencen a probar combinaciones de fuerza bruta en el puerto 22.

Asegurar una instancia no requiere meses de estudio de ciberseguridad avanzada; requiere aplicar con rigor una lista disciplinada de medidas de mitigación inmediatas.

### 1. Fortificación inmediata de SSH
El primer paso tras inicializar cualquier máquina:
- Desactivar completamente la autenticación mediante contraseña (`PasswordAuthentication no`).
- Deshabilitar el acceso directo como root (`PermitRootLogin no`).
- Exigir pares de llaves modernas Ed25519 con passphrases seguras.
- Mover el puerto por defecto o implementar restricciones por IP de origen.

### 2. Capa de firewall y contención (UFW + Fail2ban)
Cerrar todos los puertos excepto los estrictamente necesarios:
- Solo permitir tráfico en el puerto web (`80/443`) y el puerto administrativo SSH.
- Implementar **Fail2ban** para bloquear automáticamente direcciones IP tras intentos fallidos repetidos.

### 3. Proxies Inversos como escudo frontal
Tus aplicaciones en Node, Astro o PHP nunca deben exponerse directamente al exterior:
- Todo el tráfico ingresa a través de un proxy inverso blindado (Nginx o Caddy).
- El proxy administra la terminación SSL con TLS 1.3 y renueva los certificados de forma autónoma.
- Se inyectan cabeceras de seguridad estrictas (`HSTS`, `X-Content-Type-Options`, `X-Frame-Options`, `Content-Security-Policy`).
