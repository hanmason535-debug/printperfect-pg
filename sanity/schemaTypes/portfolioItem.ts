import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'portfolioItem',
  title: 'Portfolio Item',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'description', type: 'text'}),
    defineField({name: 'image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'link', type: 'url'}),
    defineField({name: 'category', type: 'string'}),
    defineField({name: 'priority', type: 'number', validation: (r) => r.required()}),
    defineField({name: 'categorySlugs', type: 'array', of: [{type: 'string'}], initialValue: []}),
    defineField({name: 'hoverId', type: 'string'}),
  ],
})
