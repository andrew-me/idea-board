import { v4 } from 'node-uuid';
import { IdeaContent, IdeaMeta } from '../domain';
import findIndex from 'lodash/findIndex';
import { IdeaList, DataConfig, IdeaData } from './index';


// This is a fake in-memory implementation of something
// that would be implemented by calling a REST server.

const fakeDatabase: { ideas: IdeaList} = {
  ideas: [{
    id: v4(),
    content: {
        title: 'Card A',
        description: 'Eos ad liber congue neglegentur, vix te justo diceret vis.',
    },
    meta: {
        created: new Date(2019, 5, 1),
        updated: new Date(2019, 5, 1)
    }
  }, {
    id: v4(),
    content: {
        title: 'SCard B',
        description: 'Lorem ipsum dolor sit amet, an lorem debet erroribus eam.',
    },
    meta: {
        created: new Date(2019, 5, 3),
        updated: new Date(2019, 5, 3)
    }
  }, {
    id: v4(),
    content: {
        title: 'Card C',
        description: 'Lorem ipsum dolor sit amet, pro eripuit numquam interpretaris no.',
    },
    meta: {
        created: new Date(2019, 5, 2),
        updated: new Date(2019, 5, 2)
    }
  }],
};

const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

function orderIdeas(dataConfig: DataConfig) {
  function orderAlpha(a: IdeaData, b: IdeaData) {
    const titleA = a.content.title.toUpperCase();
    const titleB = b.content.title.toUpperCase();

    if (titleA < titleB) {
      return -1;
    }
    if (titleA > titleB) {
      return 1;
    }
  
    // titles must be equal
    return 0;
  }

  function orderCreated(a: IdeaData, b: IdeaData) {
    return b.meta.created.getTime() - a.meta.created.getTime();
  }

  return fakeDatabase.ideas.sort(dataConfig.order === 'alphabetical' ? orderAlpha : orderCreated);
}

function processIdeas(dataConfig: DataConfig) {
  return orderIdeas(dataConfig);
}

export const fetchIdeas = (dataConfig: DataConfig) =>
  delay(500).then(() => {
    return processIdeas(dataConfig);
    }
  );

export const createIdea = (content: IdeaContent, dataConfig: DataConfig) =>
  delay(500).then(() => {
    const idea = {
      id: v4(),
      content,
      meta: {
        created: new Date(),
        updated: new Date()
    }
    };
    fakeDatabase.ideas.push(idea);
    return processIdeas(dataConfig);
  });

  export const editIdea = (id: string, content: IdeaContent, dataConfig: DataConfig) =>
    delay(500).then(() => {
        const index = findIndex(fakeDatabase.ideas, (idea) => idea.id === id)

        if (index === -1) {
            throw Error('Missing Idea');
        }

        const initialIdea = fakeDatabase.ideas[index];
        const idea = {
            ...initialIdea,
            content,
            meta: {
            created: initialIdea.meta.created,
            updated: new Date()
        }
        };
        fakeDatabase.ideas[index] = idea;
        return processIdeas(dataConfig);
  });

  export const deleteIdea = (id: string, dataConfig: DataConfig) =>
    delay(500).then(() => {
        const index = findIndex(fakeDatabase.ideas, (idea) => idea.id === id)

        if (index === -1) {
            throw Error('Missing Idea');
        }

        fakeDatabase.ideas.splice(index, 1);
        return processIdeas(dataConfig);
  });
