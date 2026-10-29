import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    order: z.number().int().positive(),
    title: z.string(),
    subtitle: z.string().optional(),
    excerpt: z.string(),
    date: z.string(),
    readTime: z.string(),
    category: z.string(),
    tags: z.array(z.string()),
    coverImage: z.string().optional(),
  }),
});

const work = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/work' }),
  schema: z.object({
    order: z.number().int().positive(),
    title: z.string(),
    client: z.string(),
    role: z.string(),
    period: z.string(),
    category: z.string(),
    tagline: z.string(),
    impactHighlight: z.string(),
    metrics: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    ),
    stack: z.array(z.string()),
    overview: z.string(),
    problem: z.string(),
    solution: z.string(),
    challenges: z.array(z.string()).optional(),
    results: z.array(z.string()).optional(),
    architectureNotes: z.array(z.string()),
    businessValue: z.string(),
    keyArtifacts: z.array(z.string()),
    liveUrl: z.string().optional(),
    repoUrl: z.string().optional(),
    youtubeUrl: z.string().optional(),
    heroImage: z.string().optional(),
    gallery: z
      .array(
        z.object({
          url: z.string(),
          caption: z.string(),
        })
      )
      .optional(),
  }),
});

const lab = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/lab' }),
  schema: z.object({
    order: z.number().int().positive(),
    title: z.string(),
    tagline: z.string(),
    category: z.enum(['3d-webgl', 'automation-ai', 'creative-ui', 'systems-infra']),
    categoryLabel: z.string(),
    status: z.enum(['Live Interactive', 'Prototype', 'In Progress', 'Archived']),
    techStack: z.array(z.string()),
    description: z.string(),
    interactiveDetails: z.string(),
    highlightMetricOrFeature: z.string(),
    githubUrl: z.string().optional(),
    liveDemoUrl: z.string().optional(),
    embedUrl: z.string().optional(),
    codepenUrl: z.string().optional(),
    videoUrl: z.string().optional(),
    date: z.string(),
  }),
});

export const collections = { writing, work, lab };

