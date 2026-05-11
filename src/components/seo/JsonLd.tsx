/**
 * Inyecta un fragmento JSON-LD (Schema.org) en el head/body.
 * El "as string" + JSON.stringify es el patrón estándar; React no
 * sanitiza `<script type="application/ld+json">`, así que el contenido
 * debe ser un objeto serializable controlado por nosotros.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
