import React, { useState, useEffect } from 'react';
import { fetchIdeas, DataConfig, DataOrder } from '../../api';
import { Idea, NewIdea, SavedIdea, IdeaContent } from '../../domain';

import IdeaComponent from '../idea/IdeaComponent';
import OrderButton from './OrderButton'

import './ideas.scss';
import './order-button.scss';

const Ideas = () => {
    const [ideas, setIdeas] = useState<SavedIdea[]>([]);
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState<DataOrder>('created');
    const [showAddIdea, setShowAddIdea] = useState(false);
  
    useEffect(() => {
      let ignore = false;
  
      async function fetchData(dataConfig: DataConfig) {
        const result = await fetchIdeas(dataConfig);

        if (!ignore) {
            setIdeas(result);
            setLoading(false);
        };
      }
  
      fetchData({ order });
      return () => { ignore = true; }
    }, [order]);

    async function handleSave(idea: Idea, content: IdeaContent) {
        switch(idea.tag) {
            case 'newIdea':
                setShowAddIdea(false);
                setLoading(true); // should be on individual idea
                const createResult = await idea.create(content, { order });
                setIdeas(createResult);
                setLoading(false);
                break;
            case 'savedIdea':
                setLoading(true); // should be on individual idea
                const editResult = await idea.edit(content, { order });
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
                const deleteResult = await idea.delete(idea.getId(), { order });
                setIdeas(deleteResult);
                setLoading(false);
                break;
        } 
    }

    return (
        <>
            <div className="ideas__head">
                <div>
                    <OrderButton onClick={() => setOrder('alphabetical')} text='Alphabetical' active={order === 'alphabetical'} /> |{` `}
                    <OrderButton onClick={() => setOrder('created')} text='Created' active={order === 'created'} />
                </div>
                {!showAddIdea && <button onClick={() => setShowAddIdea(true)}>Add</button>}
            </div>
            <ul className="ideas__list">
                {showAddIdea && <li key="newIdea"><IdeaComponent idea={new NewIdea()} onSave={handleSave} onCancel={handleCancel} /></li>}
                {ideas.map((idea: SavedIdea) => {
                    return <li className="ideas__list-item" key={idea.getId()}><IdeaComponent idea={idea} onSave={handleSave} onCancel={handleCancel} onDelete={handleDelete} /></li>
                })}
            </ul>
            <div>
                {loading && <div>Loading</div>}
                {(!loading && !ideas.length && !showAddIdea) && <div>No results</div>}
            </div>
        </>
    );
}

export default Ideas;