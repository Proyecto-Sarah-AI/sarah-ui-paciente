# Sarah - UI Paciente 🏥
**Asistente Clínico Conversacional - Clínica Alemana de Valdivia**

Este repositorio contiene la interfaz de usuario (Frontend) orientada al paciente del proyecto **Sarah**. El sistema está diseñado para mejorar la adherencia al tratamiento y el seguimiento clínico mediante un asistente conversacional y módulos de registro de comportamiento.

---

## 📋 Estado del Proyecto
Actualmente, el proyecto se encuentra en su **Fase Inicial de Desarrollo (Sprint 1)**, con la infraestructura de despliegue configurada y los módulos base establecidos para asegurar la **disponibilidad** y **confiabilidad** del sistema.

### Hitos Completados:
* **Entorno de Desarrollo:** Inicialización con **Vite + React** para garantizar tiempos de carga menores a 2 segundos (**Rendimiento**).
* **Infraestructura Cloud:** Configuración de **CI/CD** mediante la vinculación de **GitHub** con **Vercel** para despliegues automáticos.
* **Módulo Legal (Regla 5.3):** Implementación del componente de **Consentimiento Informado**, requisito obligatorio antes de cualquier interacción con el sistema.

---

## 🚀 Tecnologías y Herramientas
* **Frontend:** React.js (Vite)
* **Despliegue:** Vercel (PaaS)
* **Control de Versiones:** Git / GitHub
* **Entorno de Trabajo:** Ubuntu (VMware / WSL)

---

## 🛠️ Instalación y Configuración Local

Para replicar el entorno de desarrollo en una máquina virtual o localmente, siga estos pasos:

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/CristobalEsp01/sarah-ui-paciente.git](https://github.com/CristobalEsp01/sarah-ui-paciente.git)
   cd sarah-ui-paciente
   ```

2. **Levantar el sistema**
   ```bash
   docker compose up -d --build
   ```

3. **Bajar el sistema**
   ```bash
   docker compose down -v
   ```

🔐 Requisitos No Funcionales Cubiertos

    Seguridad y Privacidad: Gestión de accesos mediante Personal Access Tokens (PAT) y cumplimiento de leyes de protección de datos mediante el flujo de consentimiento.

    Auditabilidad: Trazabilidad completa de cambios mediante un flujo de trabajo basado en ramas y commits descriptivos.

    Escalabilidad: Estructura de carpetas preparada para soportar el crecimiento de la base de usuarios (100+ pacientes).

👥 Equipo (UI Paciente)

    Cristóbal Espinoza - Responsable de Interfaz de Términos y Condiciones / Responsable del Equipo UI.

    Lorenzo Vera - Home / Dashboard.

    Martin Maza - Interfaz del Agente Conversacional.

    Nicolás Molina - Login y Registro.