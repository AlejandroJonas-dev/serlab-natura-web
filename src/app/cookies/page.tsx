import type { Metadata } from 'next'
import { LegalPage, type LegalSection } from '@/components/legal/LegalPage'

export const metadata: Metadata = {
  title: 'Política de cookies',
  description:
    'Información sobre las cookies que utiliza serlabnatura.com y cómo puedes gestionarlas en tu navegador.',
}

const SECTIONS: LegalSection[] = [
  {
    heading: '¿Qué es una cookie?',
    body: (
      <p>
        Una cookie es un pequeño fichero de texto que un sitio web guarda
        en tu navegador cuando lo visitas. Las cookies permiten al sitio
        recordar información sobre tu visita (idioma, sesión, productos en
        el carrito, etc.) para que la experiencia sea más cómoda y
        personalizada.
      </p>
    ),
  },
  {
    heading: 'Cookies que utilizamos',
    body: (
      <>
        <p>
          En serlabnatura.com utilizamos únicamente cookies estrictamente
          necesarias para el funcionamiento del sitio. No usamos cookies
          publicitarias ni de seguimiento de terceros.
        </p>
        <ul className="list-disc pl-6 space-y-2.5">
          <li>
            <strong>Sesión de usuario:</strong> mantiene tu sesión iniciada
            mientras navegas y cierra automáticamente al expirar.
          </li>
          <li>
            <strong>Carrito de la compra:</strong> guarda los productos
            que añades al carrito incluso si cierras el navegador, hasta
            que finalices el pedido.
          </li>
          <li>
            <strong>Preferencias técnicas:</strong> recuerda ajustes de
            interfaz para la próxima visita.
          </li>
        </ul>
      </>
    ),
  },
  {
    heading: 'Cookies de terceros',
    body: (
      <>
        <p>
          Determinadas funcionalidades del sitio cargan recursos de
          terceros que pueden establecer sus propias cookies, sobre las
          que solo el proveedor tiene control:
        </p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>
            <strong>Google Maps</strong> — para mostrar el mapa de la
            ubicación física del centro.
          </li>
          <li>
            <strong>Cloudinary</strong> — para servir las imágenes de
            productos y servicios.
          </li>
        </ul>
        <p>
          Recomendamos consultar las políticas de privacidad de estos
          proveedores si tienes dudas sobre el tratamiento que hacen de
          sus cookies.
        </p>
      </>
    ),
  },
  {
    heading: 'Cómo gestionar las cookies',
    body: (
      <>
        <p>
          Puedes aceptar, bloquear o eliminar las cookies instaladas en
          tu equipo mediante la configuración de tu navegador. A
          continuación encontrarás los enlaces a la documentación oficial
          de los navegadores más utilizados:
        </p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>
            <a
              href="https://support.google.com/chrome/answer/95647"
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-colors hover:text-[oklch(0.668_0.063_64)]"
            >
              Google Chrome
            </a>
          </li>
          <li>
            <a
              href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias"
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-colors hover:text-[oklch(0.668_0.063_64)]"
            >
              Mozilla Firefox
            </a>
          </li>
          <li>
            <a
              href="https://support.apple.com/es-es/guide/safari/sfri11471/mac"
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-colors hover:text-[oklch(0.668_0.063_64)]"
            >
              Apple Safari
            </a>
          </li>
          <li>
            <a
              href="https://support.microsoft.com/es-es/microsoft-edge"
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-colors hover:text-[oklch(0.668_0.063_64)]"
            >
              Microsoft Edge
            </a>
          </li>
        </ul>
        <p>
          Ten en cuenta que deshabilitar las cookies puede afectar al
          correcto funcionamiento de algunas secciones del sitio
          (especialmente el carrito y la sesión de usuario).
        </p>
      </>
    ),
  },
]

export default function CookiesPage() {
  return (
    <LegalPage
      eyebrow="Política de cookies"
      title="Las cookies que usamos."
      intro="En serlabnatura.com utilizamos solo las cookies estrictamente necesarias para que el sitio funcione. Sin publicidad y sin seguimiento."
      sections={SECTIONS}
      lastUpdate="Mayo de 2026"
    />
  )
}
