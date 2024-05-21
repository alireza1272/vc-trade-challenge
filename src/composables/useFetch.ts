import {ref} from 'vue';
import axiosAPI from '../API';

export function useFetchAPI(method: 'post' | 'get', apiUrl: string, toSendData?: any) {
    const response = ref<any|null>(null)
    const error = ref<string|null>(null)
    const isLoading = ref<boolean>(false)

    const doFetch = async () => {
        isLoading.value = true
        await axiosAPI[method](apiUrl, toSendData)
            .then((res) => {
                response.value = res.data;
                console.log('the res in the composable is : ', response.value)
            })
            .catch((err) => (error.value = err))
            .finally(() => isLoading.value = false)
    }

    doFetch();

    return {response, isLoading, error}
}
