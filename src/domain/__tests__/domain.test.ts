import {NewIdea, SavedIdea} from '../index';
import { createIdea, editIdea, deleteIdea, DataConfig } from '../../api';

jest.mock('../../api');

const descriptionOver140 = 'Duis imperdiet eu diam sit amet faucibus. Sed vel laoreet. Duis imperdiet eu diam sit amet faucibus. Sed vel laoreet. Duis imperdiet eu diam sit amet faucibus. Sed vel laoreet.';

const validContent = { title: 'A title', description: 'A description'};
const invalidContentDescriptionOver140 = { title: 'A title', description: descriptionOver140};
const validConfig = { order: 'alphabetical' };
const validMeta = { created: new Date(2019, 4, 1), updated: new Date(2019, 4, 1)};

describe('domain', () => {
    describe('Test variable descriptionOver140 is over 140 length', () => {
        expect(descriptionOver140.length).toBeGreaterThan(140);
    });

    describe('New idea', () => {
        let newIdea: any;

        beforeEach(() => {
            newIdea = new NewIdea();
        });

        it('should have an empty title', () => {
            expect(newIdea.getTitle()).toBe("");
        });

        it('should have an empty description', () => {
            expect(newIdea.getDescription()).toBe("");
        });

        it('should not have an id', () => {
            expect(newIdea.getId).toBe(undefined);
        });

        it('should not have meta', () => {
            expect(newIdea.getMeta).toBe(undefined);
        });

        it('should not have edit', () => {
            expect(newIdea.edit).toBe(undefined);
        });

        it('should not have delete', () => {
            expect(newIdea.delete).toBe(undefined);
        });

        describe('create()', () => {
            it('should call api.createIdea', async () => {
                await newIdea.create(validContent, validConfig);
    
                expect(createIdea.mock.calls.length).toBe(1);
            });

            it('should error if title is over 140 characters', async () => {
                await expect(newIdea.create(invalidContentDescriptionOver140, validConfig))
                    .rejects.toMatchObject({ message: 'Description is longer than 140' });
            });
        })
    });

    describe('Saved idea', () => {
        let savedIdea: any;

        it('should error if instantiated with title over 140 characters', () => {
            expect(() => { new SavedIdea('1234', invalidContentDescriptionOver140, validMeta) }).toThrow();
        });

        describe('Valid saved idea', () => {
            beforeEach(() => {
                savedIdea = new SavedIdea('1234', validContent, validMeta);
            });

            it('should have a title', () => {
                expect(savedIdea.getTitle()).toBe(validContent.title);
            });
    
            it('should have an empty description', () => {
                expect(savedIdea.getDescription()).toBe(validContent.description);
            });
    
            it('should have an id', () => {
                expect(savedIdea.getId()).toBe('1234');
            });
    
            it('should have meta', () => {
                expect(savedIdea.getMeta()).toBe(validMeta);
            });

            it('should not have create', () => {
                expect(savedIdea.create).toBe(undefined);
            });

            describe('edit()', () => {
                it('should call api.editIdea', async () => {
                    await savedIdea.edit(validContent, validConfig);
        
                    expect(editIdea.mock.calls.length).toBe(1);
                });
    
                it('should error if title is over 140 characters', async () => {
                    await expect(savedIdea.edit(invalidContentDescriptionOver140, validConfig))
                        .rejects.toMatchObject({ message: 'Description is longer than 140' });
                });
            })

            describe('delete()', () => {
                it('should call api.deleteIdea', async () => {
                    await savedIdea.delete('1234', validConfig);
        
                    expect(deleteIdea.mock.calls.length).toBe(1);
                });
            })
        });
    });
});