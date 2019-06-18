import { SavedIdea, IdeaContent, IdeaMeta } from '../domain';
import * as db from './fakeDatabase';

export type DataOrder = 'alphabetical' | 'created';

export type DataConfig = {
  order: DataOrder;
}

export type IdeaData = {id: string, content: IdeaContent, meta: IdeaMeta};

export type IdeaList = IdeaData[];

function translateIdeas(ideas: IdeaList) {
    return ideas.map((idea) => new SavedIdea(idea.id, idea.content, idea.meta));
}

export const fetchIdeas = async (dataConfig: DataConfig) => {
  const result = await db.fetchIdeas(dataConfig);
  return translateIdeas(result);
}

export const createIdea = async (content: IdeaContent, dataConfig: DataConfig) => {
  const result = await db.createIdea(content, dataConfig);
  return translateIdeas(result);
}

export const editIdea = async (id: string, content: IdeaContent, dataConfig: DataConfig) => {
  const result = await db.editIdea(id, content, dataConfig);
  return translateIdeas(result);
}

export const deleteIdea = async (id: string, dataConfig: DataConfig) => {
  const result = await db.deleteIdea(id, dataConfig);
  return translateIdeas(result);
}
