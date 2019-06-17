import React, { useState, useEffect } from 'react';
import { fetchIdeas } from '../../api';
import { Idea, NewIdea, SavedIdea, IdeaContent } from '../../domain';

import IdeaComponent from '../idea/IdeaComponent';

import './ideas.scss';

const Ideas = () => {
    const [ideas, setIdeas] = useState<SavedIdea[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddIdea, setShowAddIdea] = useState(false);
  
    useEffect(() => {
      let ignore = false;
  
      async function fetchData() {
        const result = await fetchIdeas();
        if (!ignore) {
            setIdeas(result);
            setLoading(false);
        };
      }
  
      fetchData();
      return () => { ignore = true; }
    });

    if (loading) {
        return <div>Loading</div>;
    }

    if (!ideas.length) {
        return <div>No results</div>;
    }

    async function handleSave(idea: Idea, content: IdeaContent) {
        switch(idea.tag) {
            case 'newIdea':
                setShowAddIdea(false);
                setLoading(true); // should be on individual idea
                const createResult = await idea.create(content);
                setIdeas(createResult);
                setLoading(false);
                break;
            case 'savedIdea':
                setLoading(true); // should be on individual idea
                const editResult = await idea.edit(content);
                setIdeas(editResult);
                setLoading(false);
                break;
        }   
    }

    function handleCancel(idea: Idea, content: IdeaContent) {
        switch(idea.tag) {
            case 'newIdea':
                setShowAddIdea(false);
                break;
            case 'savedIdea':
                break;
        } 
    }

    async function handleDelete(idea: Idea, content: IdeaContent) {
        switch(idea.tag) {
            case 'newIdea':
                setShowAddIdea(false);
                break;
            case 'savedIdea':
                setLoading(true); // should be on individual idea
                const deleteResult = await idea.delete(idea.getId());
                setIdeas(deleteResult);
                setLoading(false);
                break;
        } 
    }

    return (
        <>
            {!showAddIdea && <button onClick={() => setShowAddIdea(true)}>Add</button>}
            <ul className="ideas__list">
                {showAddIdea && <li key="newIdea"><IdeaComponent idea={new NewIdea()} onSave={handleSave} onCancel={handleCancel} /></li>}
                {ideas.map((idea: SavedIdea) => {
                    return <li className="ideas__list-item" key={idea.getId()}><IdeaComponent idea={idea} onSave={handleSave} onCancel={handleCancel} onDelete={handleDelete} /></li>
                })}
            </ul>
        </>
    );
}

export default Ideas;