import type { Metadata } from 'next'
import { LegalPage, type LegalSection } from '@/components/legal/LegalPage'

export const metadata: Metadata = {
  title: 'Política de privacidad',
  description:
    'Cómo Serlab Natura recoge, trata y protege los datos personales que nos confías, conforme al RGPD y la LOPDGDD.',
}

const SECTIONS: LegalSection[] = [
  {
    heading: 'Responsable del tratamiento',
    body: (
      <>
        <p>
          El responsable del tratamiento de los datos personales recogidos
          a través de este sitio es:
        </p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>
            <strong>Denominación:</strong> Serlab Natura
          </li>
          <li>
            <strong>Domicilio:</strong> Av. Llanos del Pretorio, 1, Local — 14006 Córdoba
          </li>
          <li>
            <strong>Email de contacto:</strong> info@serlabnatura.com
          </li>
        </ul>
      </>
    ),
  },
  {
    heading: 'Datos que recogemos',
    body: (
      <>
        <p>
          Recogemos únicamente los datos que tú mismo nos proporcionas al
          interactuar con el sitio:
        </p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>
            <strong>Cuenta de usuario:</strong> nombre, apellidos, email,
            teléfono y contraseña (cifrada).
          </li>
          <li>
            <strong>Pedidos y reservas:</strong> dirección de envío y datos
            necesarios para procesar la compra o cita.
          </li>
          <li>
            <strong>Formulario de contacto:</strong> nombre, email y
            mensaje.
          </li>
          <li>
            <strong>Newsletter:</strong> email (opcional).
          </li>
          <li>
            <strong>Navegación:</strong> datos técnicos anónimos
            (dirección IP, navegador, páginas visitadas).
          </li>
        </ul>
      </>
    ),
  },
  {
    heading: 'Finalidad y base legal',
    body: (
      <>
        <p>
          Tratamos tus datos para las siguientes finalidades, basándonos
          en las correspondientes bases legales:
        </p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>
            <strong>Gestión de la cuenta, pedidos y reservas</strong> —
            ejecución del contrato.
          </li>
          <li>
            <strong>Atención a consultas</strong> — consentimiento del
            interesado.
          </li>
          <li>
            <strong>Envío de newsletter</strong> — consentimiento expreso,
            revocable en cualquier momento.
          </li>
          <li>
            <strong>Obligaciones legales</strong> — facturación, fiscales
            y contables.
          </li>
        </ul>
      </>
    ),
  },
  {
    heading: 'Conservación de los datos',
    body: (
      <p>
        Conservamos tus datos durante el tiempo necesario para cumplir
        con las finalidades para las que fueron recabados y, en su caso,
        durante los plazos legalmente exigidos (mínimo 6 años para datos
        contables y fiscales). Pasado ese plazo, se eliminan de forma
        segura.
      </p>
    ),
  },
  {
    heading: 'Destinatarios y cesiones',
    body: (
      <>
        <p>
          Tus datos no se ceden a terceros salvo obligación legal o para
          la prestación del servicio. Trabajamos con encargados de
          tratamiento (proveedores) que cumplen con el RGPD, entre ellos:
        </p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>Pasarela de pago.</li>
          <li>Empresa de mensajería para los envíos.</li>
          <li>Proveedor de alojamiento web y base de datos.</li>
          <li>Servicios de email transaccional.</li>
        </ul>
      </>
    ),
  },
  {
    heading: 'Tus derechos',
    body: (
      <>
        <p>
          En cualquier momento puedes ejercer los siguientes derechos
          sobre tus datos:
        </p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>Acceso, rectificación y supresión.</li>
          <li>Oposición y limitación del tratamiento.</li>
          <li>Portabilidad.</li>
          <li>
            Revocación del consentimiento sin efectos retroactivos.
          </li>
          <li>
            Reclamación ante la Agencia Española de Protección de Datos
            (aepd.es).
          </li>
        </ul>
        <p>
          Para ejercer cualquiera de estos derechos, escribe a{' '}
          <a
            href="mailto:info@serlabnatura.com"
            className="underline transition-colors hover:text-[oklch(0.668_0.063_64)]"
          >
            info@serlabnatura.com
          </a>{' '}
          adjuntando copia de un documento identificativo.
        </p>
      </>
    ),
  },
  {
    heading: 'Seguridad',
    body: (
      <p>
        Aplicamos medidas técnicas y organizativas razonables para
        proteger tus datos frente a accesos no autorizados, alteración,
        pérdida o destrucción. Las contraseñas se almacenan con cifrado
        seguro y la transmisión de datos sensibles se realiza siempre
        sobre HTTPS.
      </p>
    ),
  },
]

export default function PrivacidadPage() {
  return (
    <LegalPage
      eyebrow="Política de privacidad"
      title="Cómo tratamos tus datos."
      intro="En Serlab Natura nos tomamos en serio tu privacidad. Aquí te explicamos qué datos recogemos, con qué finalidad y cuáles son tus derechos como usuario."
      sections={SECTIONS}
      lastUpdate="Mayo de 2026"
    />
  )
}
