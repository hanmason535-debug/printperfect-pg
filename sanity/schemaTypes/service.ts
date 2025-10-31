import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      description: 'SEO-friendly URL identifier (auto-generated from title)',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .slice(0, 96),
      },
      validation: (r) => r.required(),
    }),
    defineField({name: 'description', type: 'text'}),
    defineField({
      name: 'seo',
      title: 'SEO Metadata',
      type: 'object',
      description: 'Search engine optimization metadata',
      fields: [
        {name: 'metaTitle', title: 'Meta Title', type: 'string', description: 'Custom title for search engines (default: title)'},
        {name: 'metaDescription', title: 'Meta Description', type: 'text', description: 'Description shown in search results (160 chars max)', validation: (r: any) => r.max(160)},
        {name: 'keywords', title: 'Keywords', type: 'array', of: [{type: 'string'}], description: 'SEO keywords for this service'},
        {name: 'ogImage', title: 'Social Share Image', type: 'image', description: 'Image shown when shared on social media (optional, defaults to service image)'},
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
    defineField({name: 'image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'priority', type: 'number', validation: (r) => r.required()}),
    defineField({name: 'filters', type: 'array', of: [{type: 'string'}], initialValue: []}),
    defineField({name: 'hoverId', type: 'string'}),
  ],
})
