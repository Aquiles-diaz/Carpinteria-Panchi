// schemaTypes/furniture.js
export default {
  name: 'furniture',
  title: 'Mueble',
  type: 'document',
  fields: [
    { name: 'title', title: 'Título', type: 'string', validation: Rule => Rule.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 } },
    { name: 'description', title: 'Descripción', type: 'text' },
    {
      name: 'ambiente',
      title: 'Ambiente',
      type: 'string',
      options: {
        list: [
          { title: 'Comedor', value: 'comedor' },
          { title: 'Dormitorio', value: 'dormitorio' },
          { title: 'Oficina', value: 'oficina' },
          { title: 'Baño', value: 'bano' },
          { title: 'Exterior', value: 'exterior' },
          { title: 'Otro', value: 'otro' }
        ]
      }
    },
    {
      name: 'measurements',
      title: 'Medidas (cm)',
      type: 'object',
      fields: [
        { name: 'alto', title: 'Alto', type: 'number' },
        { name: 'ancho', title: 'Ancho', type: 'number' },
        { name: 'profundidad', title: 'Profundidad', type: 'number' },
        { name: 'unidad', title: 'Unidad', type: 'string', initialValue: 'cm' }
      ]
    },
    { name: 'material', title: 'Material', type: 'string' },
    { name: 'price', title: 'Precio', type: 'number' },
    {
      name: 'images',
      title: 'Imágenes',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Alt text', type: 'string' }] }]
    },
    { name: 'publishedAt', title: 'Publicado', type: 'datetime' }
  ]
}
