import {AVAILABLE_TAGS_KEY} from '../utils/constants';
import {IUser} from '../types/IUserList';
import {defineStore} from 'pinia';

interface ITagsState {
    tags: string[],
}

const useTagsStore = defineStore('tagsStore', {
    state: (): ITagsState => {
        const availableTags = JSON.parse(localStorage.getItem(AVAILABLE_TAGS_KEY));
        return {
            tags: availableTags ?? [],
        };
    },
    getters: {
        favoriteUsersList(): IUser[] {
            return this.users?.filter((j: any) => j.id < 20);
        },
    },
    actions: {
        setTags(tags: string[]) {
            this.tags = tags;
            localStorage.setItem(AVAILABLE_TAGS_KEY, JSON.stringify(tags));
        },
        addTag(tag: string) {
            this.tags.unshift(tag);
            localStorage.setItem(AVAILABLE_TAGS_KEY, JSON.stringify(this.tags));
        },
        deleteTag(index: number) {
            this.tags.splice(index, 1);
            localStorage.setItem(AVAILABLE_TAGS_KEY, JSON.stringify(this.tags));
        },
        editTag(index: number, newTag: string) {
            this.tags[index] = newTag;
            localStorage.setItem(AVAILABLE_TAGS_KEY, JSON.stringify(this.tags));
        }
    },
});

export default useTagsStore;
