import format from 'date-fns/format';

import { createIdea, editIdea, deleteIdea, DataConfig } from '../api';

const TITLE_LENGTH = 140;
const DESCRIPTION_LENGTH =  140;

type ValidationResult = ValidationSuccess | ValidationFailure;

type ValidationSuccess = {
    tag: 'validationSuccess';
    message?: string;
}

type ValidationFailure = {
    tag: 'validationFailure';
    message: string;
}

export type IdeaContent = {
    title: string;
    description: string;
}

export type IdeaMeta = {
    created: Date;
    updated: Date;
}

export type Idea = NewIdea | SavedIdea;

abstract class SharedIdea {
    protected content: IdeaContent;

    getTitle() {
        return this.content.title;
    }

    getDescription() {
        return this.content.description;
    }

    validateTitle(title: string): ValidationResult {
        if(title.length > TITLE_LENGTH) {
            return { tag: 'validationFailure', message: `Title is longer than ${TITLE_LENGTH}` };
        }

        return { tag: 'validationSuccess' };
    }

    validateDescription(description: string): ValidationResult {
        if(description.length > DESCRIPTION_LENGTH) {
            return { tag: 'validationFailure', message: `Description is longer than ${DESCRIPTION_LENGTH}` };
        }

        return { tag: 'validationSuccess' };
    }

    validate(content: IdeaContent): ValidationResult {
        const {title, description} = content;

        const validateTitle = this.validateTitle(title);
        if(validateTitle.tag === 'validationFailure') {
                return validateTitle;
        }

        const validateDescription = this.validateDescription(description);
        if(validateDescription.tag === 'validationFailure') {
                return validateDescription;
        }

        return { tag: 'validationSuccess' };
    }

    constructor(content: IdeaContent) {
        this.content = content;
    }
}

export class NewIdea extends SharedIdea {
    tag: 'newIdea' = 'newIdea';

    async create(content: IdeaContent, dataConfig: DataConfig) {
        const validation = this.validate(content);

        switch(validation.tag) {
            case 'validationFailure':
                throw new Error(validation.message);
            case 'validationSuccess':
                return await createIdea(content, dataConfig);
        }
    };
 
    constructor() {
        super({
            title: '',
            description: ''
        });
    }
}

export class SavedIdea extends SharedIdea {
    tag: 'savedIdea' = 'savedIdea';
    private id: string;
    private meta: IdeaMeta;

    getId() {
        return this.id;
    }

    getMeta() {
        return this.meta;
    }

    getFormattedDate() {
        return format(this.meta.updated, 'Do MMMM');
    }

    async edit(content: IdeaContent, dataConfig: DataConfig) {
        const validation = this.validate(content);

        switch(validation.tag) {
            case 'validationFailure':
                throw new Error(validation.message);
            case 'validationSuccess':
                return await editIdea(this.id, content, dataConfig);
        }
    };

    async delete(id: string, dataConfig: DataConfig) {
        return await deleteIdea(this.id, dataConfig);
    };

    constructor(id: string, content: IdeaContent, meta: IdeaMeta) {
        super(content);

        this.id = id;
        this.meta = meta;

        const validation = this.validate(this.content);

        switch(validation.tag) {
            case 'validationFailure':
                throw new Error(validation.message);
            case 'validationSuccess':
                return;
        }
    }
}

