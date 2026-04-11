# Proyecto Sarah 🩺
**Plataforma de Acompañamiento Clínico - Clínica Alemana de Valdivia**

Sarah es un agente de Inteligencia Artificial diseñado para acompañar a pacientes médicos, facilitando el seguimiento de sus tratamientos, recordatorios de medicamentos y resolución de dudas clínicas en tiempo real.

## 👥 Equipo de Desarrollo
* **Cristóbal** 
* **Lorenzo**
* **Martín**
* **Nico**

---

## 🛠️ Stack Tecnológico
* **Frontend:** React + Vite
* **Estilos:** Tailwind CSS (Implementación sin librerías externas de UI para mayor control de diseño) // Se cambiara a BaseUI por decision del equipo SophiaLT
* **Iconografía:** Lucide React
* **Enrutamiento:** React Router DOM
* **Infraestructura Local:** Docker & Docker Compose
* **Despliegue:** Vercel (Producción)

---

## 🚀 Estado del Proyecto (Hitos)

### ✅ Completado
* **Módulo de Consentimiento Informado (`/consent`):** Interfaz para la aceptación de términos legales y tratamiento de datos (Ley N°20.584), con persistencia de estado en `localStorage`.
* **Dashboard de Paciente (`/home`):** Panel principal que incluye el estado del próximo medicamento, enlaces de acceso rápido y la estructura base.
* **Infraestructura Dockerizada:** Entorno local configurado con Hot Module Replacement (HMR) mediante volúmenes.
* **Pipeline de Despliegue:** Configuración de enrutamiento para SPA (`vercel.json`) y bypass de despliegue mediante Vercel CLI.

### ⏳ Pendiente (Próximos Pasos)
* **Interfaz de Chat con Sarah (IA):** Integración del flujo de conversación directamente dentro del componente `Home.jsx` (unificando el panel de control con el asistente interactivo).
* **Conexión Backend/LLM:** Enlace de la interfaz con el modelo de lenguaje para procesar las consultas del paciente.

---

## 💻 Entorno de Desarrollo Local (Docker)

El proyecto está dockerizado para asegurar que todo el equipo trabaje con la misma versión de dependencias (Node 20). 

### Requisitos
* Docker y Docker Compose instalados.

### Levantar el entorno
1. Clona el repositorio y entra a la carpeta del proyecto.
2. Construye y levanta el contenedor en modo "detached":
   ```bash
   sudo docker compose up -d --build
   ```
3. Instala las dependencias dentro del contenedor (si es la primera vez o se actualizo el package.json)
   ```bash
      sudo docker compose exec app npm install
   ```
4. Accede a la aplicacion en vivo desde tu navegador
   ```bash 
   URL: http://localhost:3005
   ```

* Nota: Cualquier cambio realizado en el codigo fuente (.jsx, .css, etc.) se reflejara automaticamente en el navegador gracias a la configuracion de volumenes en el docker-compose.yml

### Despliegue a Produccion
La aplicacion esta alojada en Vercel. Debido a restricciones del plan de equipo, los despliegues se realizan manualmente a traves de la terminal usando Vercel CLI.

## Intrucciones de despliegue
1. Asegurate de tener los ultimos cambios en tu rama local (git pull)
2. Verifica que tienes vercel instalado globalmente en tu sistema anfitrion
   ```bash
   npm i -g vercel
   ```
3. Lanza el despliegue a produccion
   ```bash
   vercel --prod
   ```

