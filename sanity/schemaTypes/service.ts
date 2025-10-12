import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'description', type: 'text'}),
    defineField({name: 'image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'priority', type: 'number', validation: (r) => r.required()}),
    defineField({name: 'filters', type: 'array', of: [{type: 'string'}], initialValue: []}),
    defineField({name: 'hoverId', type: 'string'}),
  ],
})
