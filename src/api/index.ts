import { v4 } from 'node-uuid';
import { SavedIdea, IdeaContent, IdeaMeta } from '../domain';
import findIndex from 'lodash/findIndex';

// This is a fake in-memory implementation of something
// that would be implemented by calling a REST server.

type IdeaList = {id: string, content: IdeaContent, meta: IdeaMeta}[];

const fakeDatabase: { ideas: IdeaList} = {
  ideas: [{
    id: v4(),
    content: {
        title: 'Card A',
        description: 'Eos ad liber congue neglegentur, vix te justo diceret vis.',
    },
    meta: {
        created: new Date(),
        updated: new Date()
    }
  }, {
    id: v4(),
    content: {
        title: 'Card B',
        description: 'Lorem ipsum dolor sit amet, an lorem debet erroribus eam.',
    },
    meta: {
        created: new Date(),
        updated: new Date()
    }
  }, {
    id: v4(),
    content: {
        title: 'Card C',
        description: 'Lorem ipsum dolor sit amet, pro eripuit numquam interpretaris no.',
    },
    meta: {
        created: new Date(),
        updated: new Date()
    }
  }],
};

const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

function translateIdeas() {
    return fakeDatabase.ideas.map((idea) => new SavedIdea(idea.id, idea.content, idea.meta));
}

export const fetchIdeas = () =>
  delay(500).then(() => {
    return translateIdeas();
    }
  );

export const createIdea = (content: IdeaContent) =>
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
    return translateIdeas();
  });

  export const editIdea = (id: string, content: IdeaContent) =>
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
        return translateIdeas();
  });

  export const deleteIdea = (id: string) =>
    delay(500).then(() => {
        const index = findIndex(fakeDatabase.ideas, (idea) => idea.id === id)

        if (!index) {
            throw Error('Missing Idea');
        }

        fakeDatabase.ideas.splice(index, 1);
        return translateIdeas();
  });
