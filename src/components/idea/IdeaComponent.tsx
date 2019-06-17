import React from 'react';
import { Idea, IdeaContent } from '../../domain';
import TextField from '../TextField';
import TextArea from '../TextArea';

import './idea.scss';

type Props = {
    idea: Idea;
    onSave: (idea: Idea, content: IdeaContent) => void;
    onCancel: (idea: Idea, content: IdeaContent) => void;
    onDelete?: (idea: Idea, content: IdeaContent) => void;
}

type State = {
    title: string;
    description: string;
    isChanged: boolean;
}

class IdeaComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            title: this.props.idea.getTitle(), // this wouldn't work if title changes on the server
            description: this.props.idea.getDescription(),
            isChanged: false
        }
    }

    handleTitleChange = ({value, error}: {value: string, error: boolean}) => {
        this.setState({ title: value });
    }

    handleDescriptionChange = ({value, error}: {value: string, error: boolean}) => {
        this.setState({ description: value });
    }

    handleSave = async (evt: any) => {
        evt.preventDefault();
        this.props.onSave(this.props.idea, { title: this.state.title, description: this.state.description });
    }

    handleCancel = (evt: any) => {
        evt.preventDefault();
        this.setState({
            title: this.props.idea.getTitle(),
            description: this.props.idea.getDescription(),
            isChanged: false
        });

        this.props.onCancel(this.props.idea, { title: this.props.idea.getTitle(), description: this.props.idea.getDescription() });
    }

    handleDelete = async (evt: any) => {
        evt.preventDefault();
        if(this.props.onDelete) {
            this.props.onDelete(this.props.idea, { title: this.state.title, description: this.state.description });
        }
    }

    isChanged() {
        return this.state.title !== this.props.idea.getTitle() || this.state.description !== this.props.idea.getDescription();
    }

    render() {
        return (
            <div className="idea">
                {this.props.idea.tag === 'savedIdea' && <p className="idea__date">{this.props.idea.getFormattedDate()}</p>}
                <form>
                    <div>
                        <TextField
                            focus={this.props.idea.tag === 'newIdea'}
                            placeholder='Title'
                            label="Title"
                            value={this.state.title}
                            onChange={this.handleTitleChange}
                        />
                    </div>
                    <div><TextArea placeholder='Description' label="Description" value={this.state.description} onChange={this.handleDescriptionChange} /></div>
                    {this.isChanged() && (
                        <>
                            <button onClick={this.handleSave}>Save</button>
                            <button onClick={this.handleCancel}>Cancel</button>
                        </>
                    ) }
                    {this.props.onDelete && <button onClick={this.handleDelete}>Delete</button>}
                </form>
            </div>
        )  
    }
}

export default IdeaComponent;