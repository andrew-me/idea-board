import {NewIdea, SavedIdea} from '../index';
import { createIdea, editIdea, deleteIdea, DataConfig } from '../../api';

jest.mock('../../api');

const validContent = { title: 'A title', description: 'A description'};
const validConfig = { order: 'alphabetical' };
const descriptionOver140 = 'Duis imperdiet eu diam sit amet faucibus. Sed vel laoreet. Duis imperdiet eu diam sit amet faucibus. Sed vel laoreet. Duis imperdiet eu diam sit amet faucibus. Sed vel laoreet.';

describe('domain', () => {
    describe('Test variable descriptionOver140 is over 140 length', () => {
        expect(descriptionOver140.length).toBeGreaterThan(140);
    });

    describe('New idea', () => {
        describe('create()', () => {
            let newIdea: any;

            beforeEach(() => {
                newIdea = new NewIdea();
            });

            it('should call api.createIdea', async () => {
                await newIdea.create(validContent, validConfig);
    
                expect(createIdea.mock.calls.length).toBe(1);
            });

            it('should error if title is over 140 characters', async () => {
                await expect(newIdea.create({...validContent, description: descriptionOver140}, validConfig))
                    .rejects.toMatchObject({ message: 'Description is longer than 140' });
            });

        })
    });
});