// web/pages/productos/[slug].js

import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { urlFor, client } from "../../lib/sanity";

// Íconos que SÍ usamos en esta página
import {
  FaWhatsapp,
  FaBox,
  FaTree,
  FaRulerCombined,
} from "react-icons/fa";
import { HiArrowLeft } from "react-icons/hi"; // Un ícono de flecha más limpio

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// --- Data Fetching (Tu código original) ---
export async function getStaticPaths() {
  const slugs = await client.fetch(
    `*[_type=="furniture" && defined(slug.current)].slug.current`
  );
  return {
    paths: slugs.map((s) => ({ params: { slug: s } })),
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const query = `*[_type=="furniture" && slug.current == $slug][0]{
    _id, title, slug, description, ambiente, measurements, material, price, images
  }`;
  const item = await client.fetch(query, { slug: params.slug });
  if (!item) return { notFound: true };
  return { props: { item }, revalidate: 60 };
}
// --- Fin del Data Fetching ---

export default function Product({ item }) {
  // 1. Estado para la galería de imágenes
  const [selectedImage, setSelectedImage] = useState(
    item.images ? item.images[0] : null
  );

  // 2. Asegurarnos de que la imagen seleccionada existe
  useEffect(() => {
    if (item.images && item.images.length > 0) {
      setSelectedImage(item.images[0]);
    }
  }, [item.images]);

  // URLs y Alts seguros para la imagen principal
  const mainImageUrl = selectedImage
    ? urlFor(selectedImage.asset).width(1600).auto("format").url()
    : "https://via.placeholder.com/1200x1200.png?text=Sin+imagen";

  const mainImageAlt = selectedImage
    ? selectedImage.alt || item.title
    : item.title;

  return (
    // 3. Usamos la paleta "crema" (orange-50) del index
    <div
      className={`min-h-screen bg-orange-50 dark:bg-stone-900 ${poppins.className}`}
    >
      <Head>
        {/* SEO Específico del Producto */}
        <title>{item.title} | Carpintería Panchi</title>
        <meta
          name="description"
          content={
            item.description ||
            `Mueble a medida: ${item.title} fabricado por Carpintería Panchi.`
          }
        />
        {/* Open Graph para WhatsApp/Redes Sociales */}
        <meta property="og:title" content={`${item.title} | Carpintería Panchi`} />
        <meta
          property="og:description"
          content={item.description || "Mueble a medida de alta calidad."}
        />
        <meta property="og:image" content={mainImageUrl} />
        <meta
          property="og:url"
          content={`https://www.tu-sitio.com/productos/${item.slug.current}`} // Reemplaza con tu URL
        />
      </Head>

      {/* 4. Layout "MUY GRANDE" -> max-w-6xl */}
      {/* ELIMINÉ EL <Header /> 
      */}
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Botón de volver mejorado */}
        <a
          href="/"
          className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition-colors hover:text-green-700 dark:text-stone-300"
        >
          <HiArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Volver al catálogo
        </a>

        {/* 5. Layout GRANDE: 2 columnas en desktop, 1 en mobile */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          
          {/* --- COLUMNA DE IMÁGENES --- */}
          <div className="w-full">
            {/* Imagen Principal (Usando next/image) */}
            <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl bg-white shadow-lg dark:bg-stone-800">
              {selectedImage ? (
                <Image
                  key={selectedImage._key || selectedImage.asset._ref} // Forzar re-render
                  src={urlFor(selectedImage.asset)
                    .width(1200)
                    .height(1200)
                    .auto("format")
                    .url()}
                  alt={mainImageAlt}
                  fill
                  className="animate-fade-in object-cover" // Animación sutil
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority // Cargar esta imagen primero (LCP)
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-orange-100 text-orange-500">
                  Sin imagen
                </div>
              )}
            </div>

            {/* Thumbnails (Galería seleccionable) */}
            {item.images && item.images.length > 1 && (
              // 6. MEJORA MOBILE: Scroll horizontal de thumbnails
              <div className="flex w-full space-x-2 overflow-x-auto p-1">
                {item.images.map((img) => (
                  <button
                    key={img._key || img.asset._ref}
                    onClick={() => setSelectedImage(img)}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200 hover:opacity-100
                      ${
                        selectedImage.asset._ref === img.asset._ref
                          ? "border-green-600 opacity-100" // Activo
                          : "border-transparent opacity-60" // Inactivo
                      }`}
                  >
                    <Image
                      src={urlFor(img.asset)
                        .width(100)
                        .height(100)
                        .auto("format")
                        .url()}
                      alt={img.alt || item.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* --- COLUMNA DE DETALLES --- */}
          {/* 7. Sticky en Desktop para que no se pierda con el scroll */}
          <div className="flex flex-col md:sticky md:top-24 h-fit">
            <p className="mb-2 text-sm font-medium text-green-700 dark:text-green-500">
              {item.ambiente || "Mueble general"}
            </p>

            <h1 className="text-4xl font-bold text-stone-900 dark:text-stone-50 sm:text-5xl">
              {item.title}
            </h1>

            {item.price && (
              <span className="mt-4 text-3xl font-semibold text-stone-900 dark:text-stone-50">
                AR$ {item.price}
              </span>
            )}

            <p className="mt-6 text-base text-stone-700 dark:text-stone-300">
              {item.description ||
                "Consulta por más detalles sobre este producto."}
            </p>

            {/* 8. Detalles "Vistosos" con íconos y colores madera (amber) */}
            <ul className="mt-8 space-y-4">
              {item.material && (
                <li className="flex items-center gap-3">
                  <FaTree className="h-5 w-5 flex-shrink-0 text-amber-700" />
                  <span className="text-sm text-stone-600 dark:text-stone-300">
                    <strong>Material:</strong> {item.material}
                  </span>
                </li>
              )}
              {item.measurements && (
                <li className="flex items-center gap-3">
                  <FaRulerCombined className="h-5 w-5 flex-shrink-0 text-amber-700" />
                  <span className="text-sm text-stone-600 dark:text-stone-300">
                    <strong>Medidas:</strong>{" "}
                    {item.measurements.alto || "-"} x{" "}
                    {item.measurements.ancho || "-"} x{" "}
                    {item.measurements.profundidad || "-"} {" "}
                    {item.measurements.unidad || "cm"}
                  </span>
                </li>
              )}
              <li className="flex items-center gap-3">
                <FaBox className="h-5 w-5 flex-shrink-0 text-amber-700" />
                <span className="text-sm text-stone-600 dark:text-stone-300">
                  <strong>Ambiente:</strong> {item.ambiente || "Varios"}
                </span>
              </li>
            </ul>

            {/* 9. CTA "Vistoso" y Grande (animación hover incluida) */}
            <a
              href={`https://wa.me/549XXXXXXXXX?text=${encodeURIComponent(
                "Hola Panchi, quiero consultar por: " + item.title
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-10 inline-flex w-full items-center justify-center gap-3 rounded-full bg-green-600 px-10 py-5 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-green-700 hover:shadow-xl hover:-translate-y-1 sm:w-auto"
            >
              <FaWhatsapp className="h-6 w-6" />
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </main>
      
      {/* ELIMINÉ EL <ContactFooter /> 
      */}

    </div>
  );
}