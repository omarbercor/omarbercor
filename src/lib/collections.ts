import { getCollection, type CollectionEntry } from 'astro:content';

export type ProjectItem = CollectionEntry<'work'>['data'] & { slug: string };
export type ExperimentItem = CollectionEntry<'lab'>['data'] & { slug: string };
export type ArticleItem = CollectionEntry<'writing'>['data'] & {
  slug: string;
  entry: CollectionEntry<'writing'>;
};

export async function getSortedProjects(): Promise<ProjectItem[]> {
  const entries = await getCollection('work');
  return entries
    .sort((a, b) => a.data.order - b.data.order)
    .map((entry) => ({ slug: entry.id, ...entry.data }));
}

export async function getSortedArticles(): Promise<ArticleItem[]> {
  const entries = await getCollection('writing');
  return entries
    .sort((a, b) => a.data.order - b.data.order)
    .map((entry) => ({ slug: entry.id, entry, ...entry.data }));
}

export async function getSortedExperiments(): Promise<ExperimentItem[]> {
  const entries = await getCollection('lab');
  return entries
    .sort((a, b) => a.data.order - b.data.order)
    .map((entry) => ({ slug: entry.id, ...entry.data }));
}

