import {DeepModel, deepModel} from '../lib/deep-model';
import {DefaultUserProfile, TagManager, TagNormal, UserProfile} from './data.spec';

describe('DeepSignal with toDeepSignal', () => {
    let userProfileSignal: DeepModel<UserProfile>;

    beforeEach(() => {
        userProfileSignal = deepModel(DefaultUserProfile);
    });

    it('should get and set the entire UserProfile object', () => {
        expect(userProfileSignal()).toEqual(DefaultUserProfile);
        userProfileSignal.set({
            name: 'Jiro',
            address: {
                street: 'Maple Street',
                city: 'Kyoto',
            },
            tags: [TagNormal],
            keywords: ["keyword2"]
        });
        expect(userProfileSignal()).toEqual({
            name: 'Jiro',
            address: {
                street: 'Maple Street',
                city: 'Kyoto',
            },
            tags: [TagNormal],
            keywords: ["keyword2"]
        });
    });

    it('should get and set the address property', () => {
        expect(userProfileSignal.address()).toEqual({
            street: 'Sakura Street',
            city: 'Tokyo',
        });
        userProfileSignal.address.set({
            street: 'Pine Street',
            city: 'Nagoya',
        });
        expect(userProfileSignal.address()).toEqual({
            street: 'Pine Street',
            city: 'Nagoya',
        });
    });

    it('should get and set nested address properties', () => {
        expect(userProfileSignal.address.street()).toBe('Sakura Street');
        userProfileSignal.address.street.set('Cherry Street');
        expect(userProfileSignal.address.street()).toBe('Cherry Street');
    });

    it('should get and set the tags property', () => {
        expect(userProfileSignal.tags()).toEqual([TagManager]);
        userProfileSignal.tags.set([TagNormal]);
        expect(userProfileSignal.tags()).toEqual([TagNormal]);
    });
});

