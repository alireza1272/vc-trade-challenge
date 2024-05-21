import {IInfo, IUser} from './IUserList';

export interface IUserListState {
    users: IUser[] | null,
    info: IInfo | null,
    isLoading: boolean,
    error: string | null,
    favoriteUsers: any,
    filters: IFilter,
}

export interface IFilter {
    searchQuery: string,
    gender: string,
    onlyFavorites: boolean
}
