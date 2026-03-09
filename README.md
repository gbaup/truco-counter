# Truco Counter

Aplicación web para llevar el marcador durante partidas de **Truco**, el juego de cartas más popular de Argentina y el Río de la Plata.

## 🃏 ¿Qué es esto?

Truco Counter es una herramienta digital que reemplaza el clásico anotador de papel. Permite registrar los puntos de cada equipo en tiempo real, configurar partidas personalizadas y guardar un historial de resultados.

## ✨ Funcionalidades

- **Autenticación de usuarios** — inicio de sesión seguro con JWT y contraseñas encriptadas con bcrypt.
- **Configuración de partida** — elegí la cantidad de jugadores por equipo y el puntaje máximo.
- **Marcador en tiempo real** — sumá y restá puntos para cada equipo ("Nosotros" vs "Ellos") de forma intuitiva.
- **Modal de ganador** — celebración al finalizar la partida con opción de revancha.
- **Historial de estadísticas** — revisá los resultados de tus partidas anteriores.
- **Versus** — compará el rendimiento entre jugadores o equipos.
- **Internacionalización (i18n)** — soporte para español formal y español coloquial rioplatense, usando `react-i18next`.

## 🛠️ Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| [Next.js](https://nextjs.org/) | 16 | Framework principal (App Router) |
| [React](https://react.dev/) | 19 | Interfaz de usuario |
| [TypeScript](https://www.typescriptlang.org/) | 5 | Tipado estático |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Estilos |
| [Prisma](https://www.prisma.io/) | 7 | ORM para base de datos |
| [Supabase / PostgreSQL](https://supabase.com/) | — | Base de datos |
| [react-i18next](https://react.i18next.com/) | 16 | Internacionalización |
| [jose](https://github.com/panva/jose) | 6 | Tokens JWT |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | 3 | Hash de contraseñas |
| [Sonner](https://sonner.emilkowal.ski/) | 2 | Notificaciones toast |
| [Husky](https://typicode.github.io/husky/) | 9 | Git hooks |

## 🚀 Instalación y uso

### Prerrequisitos

- Node.js 18+
- Una base de datos PostgreSQL (se recomienda [Supabase](https://supabase.com/))

### Pasos

1. **Cloná el repositorio**

   \`\`\`bash
   git clone https://github.com/gbaup/truco-counter.git
   cd truco-counter
   \`\`\`

2. **Instalá las dependencias**

   \`\`\`bash
   npm install
   \`\`\`

3. **Configurá las variables de entorno**

   Creá un archivo \`.env\` en la raíz del proyecto con las siguientes variables:

   \`\`\`env
   DATABASE_URL=postgresql://usuario:contraseña@host:puerto/nombre_db
   JWT_SECRET=tu_clave_secreta
   \`\`\`

4. **Generá el cliente de Prisma y migrá la base de datos**

   \`\`\`bash
   npx prisma migrate dev
   \`\`\`

5. **Iniciá el servidor de desarrollo**

   \`\`\`bash
   npm run dev
   \`\`\`

   Abrí [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📜 Scripts disponibles

| Comando | Descripción |
|---|---|
| \`npm run dev\` | Inicia el servidor de desarrollo |
| \`npm run build\` | Compila la aplicación para producción |
| \`npm run start\` | Inicia el servidor en modo producción |
| \`npm run lint\` | Ejecuta el linter (ESLint) |

## 🌐 Internacionalización

El proyecto soporta múltiples idiomas a través de \`react-i18next\`. Los archivos de traducción se encuentran en la carpeta \`locales/\`:

- \`es.json\` — Español estándar
- \`es-coloquial.json\` — Español coloquial rioplatense

## 🗂️ Estructura del proyecto

\`\`\`
truco-counter/
├── app/                  # Rutas y páginas (Next.js App Router)
│   ├── api/              # API Routes
│   ├── login/            # Página de inicio de sesión
│   ├── statistics/       # Página de estadísticas
│   ├── versus/           # Página de versus
│   └── page.tsx          # Página principal (marcador)
├── components/           # Componentes reutilizables de React
├── hooks/                # Custom hooks
├── lib/                  # Utilidades y configuraciones
├── locales/              # Archivos de traducción (i18n)
├── prisma/               # Esquema y migraciones de la base de datos
├── services/             # Lógica de negocio y llamadas a la API
└── types/                # Tipos TypeScript compartidos
\`\`\`

## 🚢 Despliegue

La forma más sencilla de desplegar esta aplicación es con [Vercel](https://vercel.com/):

1. Conectá tu repositorio de GitHub en Vercel.
2. Configurá las variables de entorno (\`DATABASE_URL\`, \`JWT_SECRET\`).
3. Vercel detectará automáticamente que es un proyecto Next.js y lo desplegará.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, creá un branch a partir de \`develop\` y abrí un Pull Request con tus cambios.
