// web/pages/productos/[slug].js
import { urlFor, client } from "../../lib/sanity";

export async function getStaticPaths() {
  const slugs = await client.fetch(`*[_type=="furniture" && defined(slug.current)].slug.current`);
  return {
    paths: slugs.map((s) => ({ params: { slug: s } })),
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const query = `*[_type=="furniture" && slug.current == $slug][0]{title, slug, description, ambiente, measurements, material, price, images}`;
  const item = await client.fetch(query, { slug: params.slug });
  if (!item) return { notFound: true };
  return { props: { item }, revalidate: 60 };
}

export default function Product({ item }) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50">
      <main className="mx-auto max-w-3xl px-6 py-12">
        <a href="/" className="text-sm text-zinc-600 hover:underline">← Volver al catálogo</a>
        <h1 className="mt-4 text-3xl font-semibold">{item.title}</h1>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            {item.images?.map((img, i) => (
              <img
                key={i}
                src={urlFor(img.asset).width(1600).auto("format").url()}
                alt={img.alt || item.title}
                className="mb-4 w-full rounded-lg object-cover"
                loading="lazy"
              />
            ))}
          </div>
          <div>
            <p className="mb-4 text-zinc-700 dark:text-zinc-300">{item.description}</p>
            <ul className="mb-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li><strong>Ambiente:</strong> {item.ambiente}</li>
              <li><strong>Material:</strong> {item.material}</li>
              <li><strong>Medidas:</strong> {item.measurements?.alto} x {item.measurements?.ancho} x {item.measurements?.profundidad} {item.measurements?.unidad}</li>
              {item.price && <li><strong>Precio:</strong> AR$ {item.price}</li>}
            </ul>
            <a
              href={`https://wa.me/549XXXXXXXXX?text=${encodeURIComponent("Hola Panchi, quiero consultar por: " + item.title)}`}
              className="inline-block rounded bg-green-600 px-4 py-2 text-white"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
