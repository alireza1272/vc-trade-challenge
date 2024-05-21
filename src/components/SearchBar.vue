<template>
  <div class="search-bar">
    <input
        id="search"
        type="text"
        placeholder="Type to Search..."
        class="card search-input"
        v-model="searchQuery"
        @input="generateFilters"
    >
    <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#405059">
      <path d="M400-240v-80h160v80H400ZM240-440v-80h480v80H240ZM120-640v-80h720v80H120Z"/>
    </svg>
    <select
        v-model="selectedGender"
        @change="generateFilters"
        class="card select-input"
    >
      <option value="">All Genders</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
    </select>
    <label class="card checkbox-label">
      <input
          type="checkbox"
          v-model="onlyFavorites"
          @change="generateFilters"
          class="checkbox-input"
      />
      Only Favorites
    </label>
    <button class="reset-button" @click="resetFilters">Reset Filters</button>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue';
import useUserListStore from '../stores/usersStore';

const emit = defineEmits(['update:filtersChange']);

const userListStore = useUserListStore();
const searchQuery = ref<string>(userListStore.filters.searchQuery ?? '');
const selectedGender = ref<string>(userListStore.filters.gender ?? '');
const onlyFavorites = ref<boolean>(!!userListStore.filters.onlyFavorites);

const generateFilters = () => {
  emit('update:filtersChange', {
    searchQuery: searchQuery.value,
    gender: selectedGender.value,
    onlyFavorites: onlyFavorites.value,
  });
}
const resetFilters = () => {
  searchQuery.value = '';
  selectedGender.value = '';
  onlyFavorites.value = false;
}
watch([searchQuery, selectedGender, onlyFavorites], generateFilters);

</script>

<style scoped lang="scss">
.search-bar {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  row-gap: 8px;
  border-bottom: 2px solid #f9f9f9;
  padding-bottom: 12px;
  gap: 8px;

  .search-input {
    border: none;
    width: 100%;
  }

  .select-input {
    width: auto;
    padding: 8px 16px;
    border-radius: 20px;
    border: none;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.29);
    background-color: white;
    cursor: pointer;
    margin: 0;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    border-radius: 20px;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.29);
    cursor: pointer;
    gap: 8px;
    margin: 0;
    max-height: 40px;
    flex-wrap: wrap;

    .checkbox-input {
      margin-right: 8px;
    }
  }
}

</style>
