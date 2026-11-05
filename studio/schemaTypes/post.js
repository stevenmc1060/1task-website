import {defineArrayMember, defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title', maxLength: 96}, validation: (rule) => rule.required()}),
    defineField({name: 'author', title: 'Author', type: 'reference', to: [{type: 'author'}]}),
    defineField({name: 'publishedAt', title: 'Published at', type: 'datetime', initialValue: () => new Date().toISOString(), validation: (rule) => rule.required()}),
    defineField({name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3, validation: (rule) => rule.max(240)}),
    defineField({name: 'mainImage', title: 'Main image', type: 'image', options: {hotspot: true}, fields: [defineField({name: 'alt', title: 'Alternative text', type: 'string'})]}),
    defineField({
      name: 'podcastAudio',
      title: 'Podcast Audio',
      type: 'file',
      description: 'Optional MP3 audio version of this article.',
      options: {accept: '.mp3,audio/mpeg'},
      validation: (rule) => rule.custom((file) => {
        if (!file?.asset?._ref) return true
        return file.asset._ref.endsWith('-mp3') || 'Podcast Audio must be an MP3 file.'
      }),
    }),
    defineField({name: 'audioTitle', title: 'Audio title', type: 'string', description: 'Optional title shown above the audio player.'}),
    defineField({name: 'audioDescription', title: 'Audio description', type: 'text', rows: 3, description: 'Optional summary or listening note.'}),
    defineField({
      name: 'audioDuration',
      title: 'Audio duration',
      type: 'string',
      description: 'Optional display duration, for example 12:34 or 1:02:18.',
      validation: (rule) => rule.regex(/^(?:\d+:)?[0-5]?\d:[0-5]\d$/, {name: 'duration'}).warning('Use a duration such as 12:34 or 1:02:18.'),
    }),
    defineField({
      name: 'body', title: 'Body', type: 'array',
      of: [
        defineArrayMember({type: 'block', styles: [{title: 'Normal', value: 'normal'}, {title: 'Heading 2', value: 'h2'}, {title: 'Heading 3', value: 'h3'}, {title: 'Quote', value: 'blockquote'}]}),
        defineArrayMember({type: 'image', options: {hotspot: true}, fields: [defineField({name: 'alt', title: 'Alternative text', type: 'string'})]}),
      ],
    }),
  ],
  orderings: [{title: 'Published, newest', name: 'publishedAtDesc', by: [{field: 'publishedAt', direction: 'desc'}]}],
  preview: {select: {title: 'title', author: 'author.name', media: 'mainImage'}, prepare: ({title, author, media}) => ({title, subtitle: author && `by ${author}`, media})},
})
