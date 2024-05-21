export interface IChartsData {
    countryChart: { country: string, usersCount: number, maleCountCountry: number, femaleCountCountry: number }[],
    genderChart: { femalesCount: number, malesCount: number },
    ageChart: { range: string, usersCount: number }[],
    tagChart: { tag: string, usersCount: number }[],
}
