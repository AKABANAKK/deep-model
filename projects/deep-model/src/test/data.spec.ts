export interface Tag {
    name: string | null;
}

export const TagManager: Tag = {name: 'manager'};
export const TagNormal: Tag = {name: 'normal'};

export interface Address {
    street: string | null;
    city: string;
}

export interface UserProfile {
    name: string;
    address: Address | null;
    tags: Tag[] | null;
    keywords: string[] | null;
}

export const DefaultUserProfile: UserProfile = {
    name: 'Taro',
    address: {
        street: 'Sakura Street',
        city: 'Tokyo',
    },
    tags: [TagManager],
    keywords: ['keyword1']
};

