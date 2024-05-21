export interface IUsersList {
    results: (IUser)[] | null;
    info: IInfo;
}
export interface IUser {
    gender: string;
    name: IUserName;
    location: IUserLocation;
    email: string;
    login: IUserLogin;
    dob: IDate;
    registered: IDate;
    phone: string;
    cell: string;
    id: IUserId;
    picture: IUserPicture;
    nat: string;
    tags?: string[] | null;
}
export interface IUserName {
    title: string;
    first: string;
    last: string;
}
export interface IUserLocation {
    street: IUserStreet;
    city: string;
    state: string;
    country: string;
    postcode: number;
    coordinates: ICoordinates;
    timezone: ITimezone;
}
export interface IUserStreet {
    number: number;
    name: string;
}
export interface ICoordinates {
    latitude: string;
    longitude: string;
}
export interface ITimezone {
    offset: string;
    description: string;
}
export interface IUserLogin {
    uuid: string;
    username: string;
    password: string;
    salt: string;
    md5: string;
    sha1: string;
    sha256: string;
}
export interface IDate {
    date: string;
    age: number;
}
export interface IUserId {
    name: string;
    value?: null;
}
export interface IUserPicture {
    large: string;
    medium: string;
    thumbnail: string;
}
export interface IInfo {
    seed: string;
    results: number;
    page: number;
    version: string;
}
