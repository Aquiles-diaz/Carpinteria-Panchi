// web/pages/index.js
import { useEffect } from "react";
import { client, urlFor } from "../lib/sanity";

export async function getStaticProps() {
  const query = `*[_type=="furniture" && defined(slug.current)] | order(publishedAt desc){
    _id, title, slug, description, ambiente, measurements, material, price, images
  }`;
  const items = await client.fetch(query);
  return { props: { items }, revalidate: 60 };
}

export default function Home({ items }) {
  useEffect(() => {
    // solo para desarrollo: comprobar que el array llega
    // console.log("items", items);
  }, [items]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50">
      <main className="mx-auto max-w-5xl px-6 py-16">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Carpintería Panchi</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Catálogo de muebles — hechos a medida</p>
          </div>
          <a
            className="rounded-full bg-foreground px-4 py-2 text-sm text-background hover:opacity-90"
            href="#contact"
          >
            Contacto / WhatsApp
          </a>
        </header>

        <section className="mb-8">
          <h2 className="mb-4 text-xl font-medium">Todos los muebles</h2>

          {items.length === 0 ? (
            <div className="rounded border border-dashed p-8 text-center text-zinc-500">
              No hay muebles publicados todavía. Subí uno desde el Studio de Sanity.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <a
                  key={item._id}
                  href={`/productos/${item.slug?.current}`}
                  className="group block overflow-hidden rounded-xl border bg-white p-0 shadow-sm transition hover:shadow-md dark:bg-[#0b0b0b]"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                    {item.images?.[0] ? (
                      // usamos <img> por simplicidad y compatibilidad
                      <img
                        src={urlFor(item.images[0].asset).width(1200).auto("format").url()}
                        alt={item.images[0].alt || item.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-zinc-400">Sin imagen</div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="mb-1 text-lg font-semibold">{item.title}</h3>
                    <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">{item.ambiente || "Ambiente no especificado"}</p>
                    <div className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-300">
                      <span>
                        {item.price ? `AR$ ${item.price}` : "Consultar precio"}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {item.measurements ? `${item.measurements.alto || '-'} x ${item.measurements.ancho || '-'} x ${item.measurements.profundidad || '-'} ${item.measurements.unidad || 'cm'}` : ''}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>

        <footer id="contact" className="mt-12 rounded-lg border p-6 text-center">
          <p className="mb-4">¿Querés consultar por un mueble? Contactá por WhatsApp:</p>
          <a
            href={`https://wa.me/549XXXXXXXXX?text=${encodeURIComponent("Hola Panchi, quiero consultar por un mueble.")}`}
            className="inline-block rounded-md bg-green-600 px-4 py-2 text-white"
          >
            Abrir WhatsApp
          </a>
        </footer>
      </main>
    </div>
  );
}
