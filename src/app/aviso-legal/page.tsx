import type { Metadata } from 'next'
import { LegalPage, type LegalSection } from '@/components/legal/LegalPage'

export const metadata: Metadata = {
  title: 'Aviso legal',
  description:
    'Información legal sobre el titular del sitio web serlabnatura.com, condiciones de uso y propiedad intelectual.',
}

const SECTIONS: LegalSection[] = [
  {
    heading: 'Titular del sitio',
    body: (
      <>
        <p>
          En cumplimiento de la Ley 34/2002 de Servicios de la Sociedad de
          la Información y de Comercio Electrónico (LSSI-CE), se informa de
          los siguientes datos del titular:
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
          <li>
            <strong>Teléfonos:</strong> 957 92 33 47 / 604 23 04 56
          </li>
        </ul>
      </>
    ),
  },
  {
    heading: 'Objeto y ámbito de aplicación',
    body: (
      <p>
        El presente aviso legal regula el uso del sitio web
        serlabnatura.com (en adelante, &laquo;el sitio&raquo;), del que
        Serlab Natura es titular. La navegación por el sitio atribuye la
        condición de usuario e implica la aceptación plena y sin reservas
        de todas las disposiciones incluidas en este aviso legal en la
        versión publicada en el momento de acceso.
      </p>
    ),
  },
  {
    heading: 'Condiciones de uso',
    body: (
      <>
        <p>
          El usuario se compromete a hacer un uso adecuado de los
          contenidos y servicios ofrecidos en el sitio y a no emplearlos
          para incurrir en actividades ilícitas, lesivas de derechos e
          intereses de terceros, o que de cualquier forma puedan dañar,
          inutilizar, sobrecargar o deteriorar el sitio.
        </p>
        <p>
          Serlab Natura se reserva el derecho a modificar el contenido del
          sitio sin previo aviso, así como a interrumpir temporalmente el
          acceso por motivos técnicos o de mantenimiento.
        </p>
      </>
    ),
  },
  {
    heading: 'Propiedad intelectual e industrial',
    body: (
      <p>
        Todos los contenidos del sitio (textos, fotografías, gráficos,
        logotipos, iconos, software, nombres comerciales, marcas y
        diseños) son propiedad de Serlab Natura o de terceros que han
        autorizado su uso. Queda expresamente prohibida su reproducción,
        distribución o comunicación pública sin autorización previa por
        escrito.
      </p>
    ),
  },
  {
    heading: 'Limitación de responsabilidad',
    body: (
      <p>
        La información contenida en el sitio tiene carácter divulgativo y
        no sustituye en ningún caso el consejo médico profesional. Serlab
        Natura no será responsable de los perjuicios derivados del uso
        incorrecto de los productos o servicios ofrecidos. Ante cualquier
        síntoma o dolencia, consulte siempre a un profesional sanitario
        cualificado.
      </p>
    ),
  },
  {
    heading: 'Legislación aplicable y jurisdicción',
    body: (
      <p>
        El presente aviso legal se rige por la legislación española. Para
        la resolución de cualquier controversia, las partes se someten a
        los Juzgados y Tribunales de Córdoba, salvo que la normativa de
        consumidores y usuarios atribuya competencia a otra jurisdicción.
      </p>
    ),
  },
]

export default function AvisoLegalPage() {
  return (
    <LegalPage
      eyebrow="Aviso legal"
      title="Información legal del sitio."
      intro="Este documento recoge los datos identificativos del titular del sitio y las condiciones que regulan el uso de serlabnatura.com."
      sections={SECTIONS}
      lastUpdate="Mayo de 2026"
    />
  )
}
