import type { Metadata } from 'next'
import { LegalPage, type LegalSection } from '@/components/legal/LegalPage'

export const metadata: Metadata = {
  title: 'Términos y condiciones',
  description:
    'Condiciones generales de contratación que rigen las compras, reservas e inscripciones realizadas a través de serlabnatura.com.',
}

const SECTIONS: LegalSection[] = [
  {
    heading: 'Objeto',
    body: (
      <p>
        Las presentes condiciones generales regulan la relación entre
        Serlab Natura y los usuarios que adquieran productos, reserven
        servicios o se inscriban a clases a través del sitio web
        serlabnatura.com. La realización de cualquier compra o reserva
        implica la aceptación expresa de estas condiciones.
      </p>
    ),
  },
  {
    heading: 'Registro y cuenta de usuario',
    body: (
      <>
        <p>
          Para realizar compras o reservas online es necesario crear una
          cuenta facilitando datos veraces. El usuario es responsable de
          la confidencialidad de su contraseña y de todas las
          actividades realizadas desde su cuenta.
        </p>
        <p>
          Serlab Natura podrá suspender cuentas que infrinjan estas
          condiciones, faciliten información falsa o realicen un uso
          fraudulento del sitio.
        </p>
      </>
    ),
  },
  {
    heading: 'Productos: precio, disponibilidad y envío',
    body: (
      <>
        <p>
          Los precios mostrados en la tienda incluyen IVA. Los gastos de
          envío se calculan en el proceso de compra:
        </p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>Envíos a la Península: 4,99€ — gratis a partir de 50€.</li>
          <li>Plazo de entrega estimado: 2 a 5 días laborables.</li>
        </ul>
        <p>
          La disponibilidad de los productos puede variar en tiempo
          real. En caso de rotura de stock posterior a la confirmación
          del pedido, contactaremos contigo para ofrecerte una
          alternativa o el reembolso íntegro.
        </p>
      </>
    ),
  },
  {
    heading: 'Métodos de pago',
    body: (
      <>
        <p>Aceptamos los siguientes métodos:</p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>Tarjeta de débito o crédito (Visa, Mastercard, AMEX).</li>
          <li>Bizum.</li>
          <li>Transferencia bancaria (plazo de proceso: 24-48h).</li>
        </ul>
      </>
    ),
  },
  {
    heading: 'Derecho de desistimiento y devoluciones',
    body: (
      <>
        <p>
          Conforme al Real Decreto Legislativo 1/2007, dispones de{' '}
          <strong>14 días naturales</strong> desde la recepción del
          pedido para desistir de la compra sin necesidad de
          justificación. Adicionalmente, ofrecemos un periodo ampliado
          de <strong>30 días</strong> en condiciones comerciales.
        </p>
        <p>
          Quedan excluidos del derecho de desistimiento los productos
          precintados que no sean aptos para devolverse por razones de
          salud o higiene una vez desprecintados (alimentación,
          cosmética abierta).
        </p>
        <p>
          Para iniciar una devolución, escribe a info@serlabnatura.com
          indicando tu número de pedido y el motivo. Te facilitaremos
          las instrucciones de envío y procederemos al reembolso en un
          máximo de 14 días desde la recepción del producto.
        </p>
      </>
    ),
  },
  {
    heading: 'Reservas de terapias y consultas',
    body: (
      <>
        <p>
          Las reservas realizadas a través del sitio web requieren
          confirmación por nuestro equipo. Recibirás un email cuando la
          cita pase a estado confirmada.
        </p>
        <p>
          Las cancelaciones realizadas con más de 24 horas de antelación
          no tienen coste. Las cancelaciones tardías o no
          presentaciones (no-show) pueden suponer la pérdida del importe
          en caso de tratamientos prepagados.
        </p>
      </>
    ),
  },
  {
    heading: 'Inscripción a clases grupales',
    body: (
      <>
        <p>
          Las inscripciones a clases pueden ser por sesión suelta, bono
          mensual o bono trimestral. Las cuotas se cobran por
          adelantado y no son reembolsables salvo causa justificada.
        </p>
        <p>
          Las plazas son limitadas. Para garantizar la calidad de la
          clase, el centro se reserva el derecho de cancelar sesiones
          puntuales por falta de inscritos avisando con al menos 4
          horas de antelación.
        </p>
      </>
    ),
  },
  {
    heading: 'Garantía y responsabilidad',
    body: (
      <>
        <p>
          Todos los productos cuentan con la garantía legal aplicable.
          Los complementos alimenticios y productos cosméticos no son
          medicamentos y no sustituyen al consejo de un profesional
          sanitario.
        </p>
        <p>
          Serlab Natura no se hace responsable del uso incorrecto de
          los productos ni de reacciones derivadas de la
          automedicación. En caso de dudas, consulta siempre con un
          profesional.
        </p>
      </>
    ),
  },
  {
    heading: 'Modificaciones y legislación aplicable',
    body: (
      <p>
        Serlab Natura se reserva el derecho a modificar estas
        condiciones en cualquier momento. Los cambios entrarán en vigor
        a partir de su publicación. Las presentes condiciones se rigen
        por la legislación española. Para la resolución de cualquier
        controversia, las partes se someten a los Juzgados y Tribunales
        de Córdoba, salvo en el caso de consumidores, en cuyo caso será
        competente la jurisdicción que corresponda según la normativa
        aplicable.
      </p>
    ),
  },
]

export default function TerminosPage() {
  return (
    <LegalPage
      eyebrow="Términos y condiciones"
      title="Las reglas del juego."
      intro="Estas son las condiciones generales que rigen las compras, reservas e inscripciones que realices a través del sitio web."
      sections={SECTIONS}
      lastUpdate="Mayo de 2026"
    />
  )
}
