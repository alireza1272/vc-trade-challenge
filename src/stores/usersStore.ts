import {
    FAVORITE_USERS_KEY,
    PER_PAGE_USERS_COUNT,
    USED_FILTERS_KEY,
    USER_LIST_INFO_KEY,
    USER_LIST_KEY
} from '../utils/constants';
import {IInfo, IUser, IUsersList} from '../types/IUserList';
import {defineStore} from 'pinia';
import {useFetchAPI} from '../composables/useFetch';
import {watch} from 'vue';
import {IChartsData} from '../types/IChartsData';
import {IFilter, IUserListState} from '../types/IUserListState';

const useUserListStore = defineStore('userListStore', {
    state: (): IUserListState => {
        const initialFavorites = JSON.parse(localStorage.getItem(FAVORITE_USERS_KEY));
        const initialFilters = JSON.parse(localStorage.getItem(USED_FILTERS_KEY));
        const initialUsers = JSON.parse(localStorage.getItem(USER_LIST_KEY));
        const initialInfo = JSON.parse(localStorage.getItem(USER_LIST_INFO_KEY));
        return {
            users: initialUsers ?? null,
            info: initialInfo ?? null,
            isLoading: false,
            error: null,
            favoriteUsers: initialFavorites ?? {},
            filters: initialFilters ?? {
                searchQuery: '',
                gender: '',
                onlyFavorites: false,
            },
        };
    },
    getters: {
        filteredUsers(): IUser[] {
            let results = this.users;

            if (this.filters.searchQuery) {
                results = results.filter(user => {
                    const fullNameWithTitle = `${user.name.first.toLowerCase()} ${user.name.last.toLowerCase()} ${user.name.title.toLowerCase()}`;
                    return fullNameWithTitle.includes(this.filters.searchQuery.toLowerCase());
                });
            }

            if (this.filters.gender) {
                results = results.filter(user => user.gender === this.filters.gender);
            }

            if (this.filters.onlyFavorites) {
                results = results.filter(user => this.favoriteUsers[user.email]);
            }

            return results;
        },
        generateChartsData(): IChartsData {
            const countryUsers: { [key: string]: { total: number, male: number, female: number } } = {};
            const ageRanges: { [key: string]: number } = {
                '0-4': 0,
                '5-9': 0,
                '10-14': 0,
                '15-19': 0,
                '20-24': 0,
                '25-29': 0,
                '30-34': 0,
                '35-39': 0,
                '40+': 0,
            };
            const tagCounts: { [key: string]: number } = {};
            let femaleCount = 0;
            let maleCount = 0;

            this.users?.forEach(user => {
                const country = user.nat;
                if (!countryUsers[country]) {
                    countryUsers[country] = {total: 0, male: 0, female: 0};
                }
                countryUsers[country].total++;
                if (user.gender === 'male') {
                    countryUsers[country].male++;
                    maleCount++;
                } else if (user.gender === 'female') {
                    countryUsers[country].female++;
                    femaleCount++;
                }
                const age = user.dob.age;
                let range: string;
                if (age >= 40) {
                    range = '40+';
                } else {
                    const lowerBound = Math.floor(age / 5) * 5;
                    const upperBound = lowerBound + 4;
                    range = `${lowerBound}-${upperBound}`;
                }
                ageRanges[range]++;

                if (user.tags) {
                    user.tags.forEach(tag => {
                        if (!tagCounts[tag]) {
                            tagCounts[tag] = 0;
                        }
                        tagCounts[tag]++;
                    });
                }
            });

            const countryChartData = Object.keys(countryUsers).map(country => ({
                country,
                usersCount: countryUsers[country].total,
                maleCountCountry: countryUsers[country].male,
                femaleCountCountry: countryUsers[country].female,
            }));

            const ageChartData = Object.keys(ageRanges).map(range => ({
                range,
                usersCount: ageRanges[range]
            }));

            const tagChartData = Object.keys(tagCounts).map(tag => ({
                tag,
                usersCount: tagCounts[tag]
            }));

            const genderChartData = {
                femalesCount: femaleCount,
                malesCount: maleCount,
            }

            return {
                countryChart: countryChartData,
                genderChart: genderChartData,
                ageChart: ageChartData,
                tagChart: tagChartData,
            };
        }
    },
    actions: {
        setUsers(users: IUser[]) {
            this.users = users;
            localStorage.setItem(USER_LIST_KEY, JSON.stringify(this.users));
        },
        setInfo(info: IInfo) {
            this.info = info;
            localStorage.setItem(USER_LIST_INFO_KEY, JSON.stringify(this.info));
        },
        setFilters(filters: IFilter) {
            this.filters = filters;
            localStorage.setItem(USED_FILTERS_KEY, JSON.stringify(this.filters));
        },
        toggleFavorite(userEmail: string) {
            this.favoriteUsers[userEmail] = !this.favoriteUsers[userEmail];
            localStorage.setItem(FAVORITE_USERS_KEY, JSON.stringify(this.favoriteUsers));
        },
        setUserTags(tags: string[], userEmail: string) {
            const i = this.users.findIndex(x => x.email === userEmail);
            this.users[i]['tags'] = tags;
            localStorage.setItem(USER_LIST_KEY, JSON.stringify(this.users));
        },
        resetState() {
            this.users = null;
            this.info = null;
            this.isLoading = false;
            this.error = null;
            this.favoriteUsers = {};
            this.filters = {
                searchQuery: '',
                gender: '',
                onlyFavorites: false,
            };
            localStorage.removeItem(USER_LIST_KEY);
            localStorage.removeItem(USER_LIST_INFO_KEY);
            localStorage.removeItem(FAVORITE_USERS_KEY);
            localStorage.removeItem(USED_FILTERS_KEY);
        },
        async fetchData(withSeed?: boolean, nextPage?: boolean) {
            if (!this.users || nextPage) {
                this.isLoading = true;
                let apiUrl = `?results=${PER_PAGE_USERS_COUNT}${withSeed ? '&seed=abc' : ''}`;
                if (nextPage && this.info) {
                    apiUrl += `&page=${this.info.page + 1}&seed=${this.info.seed}`
                }
                const {response, isLoading, error} = useFetchAPI('get', apiUrl);
                watch(response, (newResponse: IUsersList) => {
                    if (newResponse) {
                        this.setUsers(nextPage ? [...this.users, ...newResponse.results] : newResponse.results);
                        this.setInfo(newResponse.info);
                        this.isLoading = isLoading;
                        this.error = error;
                    }
                });
            }
        },
    },
});

export default useUserListStore;
