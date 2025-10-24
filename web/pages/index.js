// web/pages/index.js

import { useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { client, urlFor } from "../lib/sanity";
import {
  FaWhatsapp,
  FaMapMarkerAlt,
  FaClock,
  FaRulerCombined,
} from "react-icons/fa";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export async function getStaticProps() {
  const query = `*[_type=="furniture" && defined(slug.current)] | order(publishedAt desc){
    _id, title, slug, description, ambiente, measurements, material, price, images
  }`;
  const items = await client.fetch(query);
  return { props: { items }, revalidate: 60 };
}

// Componente pequeño para mostrar las medidas de forma limpia
const MeasurementsDisplay = ({ measurements }) => {
  if (!measurements) return null;
  const { alto, ancho, profundidad, unidad = "cm" } = measurements;
  if (!alto && !ancho && !profundidad) return null;

  return (
    // Cambiamos zinc por stone para unificar
    <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
      <FaRulerCombined />
      <span>
        {alto || "-"} x {ancho || "-"} x {profundidad || "-"} {unidad}
      </span>
    </div>
  );
};

export default function Home({ items }) {
  useEffect(() => {
    // console.log("items", items);
  }, [items]);

  return (
    // 1. CAMBIO DE PALETA:
    // Fondo principal: bg-orange-50 (un tono crema/beige muy claro)
    // Dark mode: dark:bg-stone-900 (mantenemos el gris oscuro que funciona bien)
    <div
      className={`min-h-screen bg-orange-50 dark:bg-stone-900 ${poppins.className}`}
    >
      <Head>
        <title>Carpintería Panchi - Muebles a Medida</title>
        <meta
          name="description"
          content="Catálogo de muebles de madera hechos a medida. Calidad y diseño para tu hogar."
        />
      </Head>

      {/* Header con la nueva paleta */}
      <header className="sticky top-0 z-50 border-b border-orange-200/50 bg-orange-50/80 px-6 py-4 backdrop-blur-sm dark:border-stone-700/50 dark:bg-stone-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1
              // 2. MÁS CONTRASTE:
              // Texto principal en 'stone-900' (casi negro) para legibilidad
              className={`text-2xl font-bold text-stone-900 dark:text-stone-50`}
            >
              Carpintería Panchi
            </h1>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              Muebles a medida
            </p>
          </div>
          <a
            href="#contact"
            className="group hidden items-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-green-700 hover:shadow-lg hover:-translate-y-0.5 sm:inline-flex"
          >
            <FaWhatsapp className="h-4 w-4" />
            Contacto
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        {/* Sección de Catálogo */}
        <section className="mb-24">
          <h2
            className={`mb-12 text-center text-3xl font-bold text-stone-900 dark:text-stone-100 sm:text-4xl`}
          >
            Nuestro Catálogo
          </h2>

          {items.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-orange-300 p-12 text-center text-orange-600 dark:border-stone-700 dark:text-stone-500">
              <p className="text-lg">No hay muebles publicados todavía.</p>
              <p className="text-sm">Vuelve a visitarnos pronto.</p>
            </div>
          ) : (
            <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <a
                  key={item._id}
                  href={`/productos/${item.slug?.current}`}
                  // 3. TARJETAS:
                  // Fondo blanco (bg-white) resalta sobre el fondo crema (bg-orange-50)
                  // Borde: border-orange-200
                  className="group block overflow-hidden rounded-xl border border-orange-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl dark:border-stone-700 dark:bg-stone-800"
                >
                  <div className="relative h-72">
                    {item.images?.[0] ? (
                      <Image
                        src={urlFor(item.images[0].asset)
                          .width(800)
                          .height(800)
                          .auto("format")
                          .url()}
                        alt={item.images[0].alt || item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                      />
                    ) : (
                      // Fondo de 'Sin imagen' también usa la nueva paleta
                      <div className="flex h-full items-center justify-center bg-orange-100 text-orange-500 dark:bg-stone-700 dark:text-stone-400">
                        Sin imagen
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3
                      className={`mb-1.5 text-xl font-semibold text-stone-900 dark:text-stone-100`}
                    >
                      {item.title}
                    </h3>
                    <p className="mb-4 text-sm font-medium text-green-700 dark:text-green-500">
                      {item.ambiente || "Mueble general"}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-stone-900 dark:text-stone-50">
                        {item.price ? `AR$ ${item.price}` : "Consultar"}
                      </span>
                      <MeasurementsDisplay measurements={item.measurements} />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>

        {/* 6. Sección "Quiénes Somos" */}
        {/* Fondo de acento: bg-orange-100 (un crema más subido) */}
        <section className="mb-24 rounded-lg bg-orange-100 p-12 text-center dark:bg-stone-800 sm:p-16">
          <h2
            className={`mb-6 text-3xl font-bold text-stone-900 dark:text-stone-100`}
          >
            Sobre Nosotros
          </h2>
          <p className="mx-auto max-w-2xl text-base font-light text-stone-700 dark:text-stone-300 sm:text-lg">
            En Carpintería Panchi, combinamos la tradición artesanal con
            diseños modernos. Cada mueble es una pieza única, creada con
            pasión, maderas seleccionadas y un compromiso total con la
            calidad. Creemos en crear muebles que duren generaciones.
          </p>
        </section>

        {/* 7. Detalles de Contacto (Footer) */}
        <footer
          id="contact"
          className="rounded-lg border border-orange-200 bg-white p-12 dark:border-stone-700 dark:bg-stone-800"
        >
          <div className="mx-auto max-w-4xl">
            <h2
              className={`mb-8 text-center text-3xl font-bold text-stone-900 dark:text-stone-100`}
            >
              Contactanos
            </h2>
            <p className="mb-10 text-center text-stone-600 dark:text-stone-300">
              ¿Tenés una idea o querés un presupuesto? Hablemos.
            </p>

            {/* Grilla de detalles de contacto */}
            <div className="mb-10 grid gap-8 text-center sm:grid-cols-2">
              <div className="flex flex-col items-center">
                <FaMapMarkerAlt className="mb-3 h-8 w-8 text-green-600" />
                <h4 className="font-semibold text-stone-900 dark:text-stone-100">
                  Nuestro Taller
                </h4>
                <p className="text-sm text-stone-600 dark:text-stone-300">
                  Calle Falsa 123, Springfield
                </p>
                <p className="text-sm text-stone-600 dark:text-stone-300">
                  (Solo con cita previa)
                </p>
              </div>

              <div className="flex flex-col items-center">
                <FaClock className="mb-3 h-8 w-8 text-green-600" />
                <h4 className="font-semibold text-stone-900 dark:text-stone-100">
                  Horarios de Atención
                </h4>
                <p className="text-sm text-stone-600 dark:text-stone-300">
                  Lunes a Viernes: 17:00 - 21:00
                </p>
                <p className="text-sm text-stone-600 dark:text-stone-300">
                  Sábados: 9:00 - 13:00
                </p>
              </div>
            </div>

            {/* Botón de WhatsApp prominente */}
            <div className="text-center">
              <a
                href={`https://wa.me/549XXXXXXXXX?text=${encodeURIComponent(
                  "Hola Panchi, quiero consultar por un mueble."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-full bg-green-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-green-700 hover:shadow-xl hover:-translate-y-1" // 3. Animación
              >
                <FaWhatsapp className="h-6 w-6" />
                Iniciar Chat por WhatsApp
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}