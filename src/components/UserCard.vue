<script setup lang="ts">
import {computed, toRefs} from 'vue';
import {IUser} from '../types/IUserList.ts';
import {capitalize} from '../utils/sharedService';
import useUserListStore from '../stores/usersStore';

const props = defineProps<{
  user: IUser;
  isSelected: boolean,
}>();
const emits = defineEmits(['toggle-favorite']);
const {user, isSelected} = toRefs(props);
const userListStore = useUserListStore();
const formattedName = computed(() => {
  return `${user.value.name.title}.${capitalize(user.value.name.first)} ${capitalize(user.value.name.last)}`;
});

const toggleFavorite = (event) => {
  event.stopPropagation();
  emits('toggle-favorite', user.value.email);
};
</script>

<template>
  <div class="user-card card" :class="{ selected: isSelected }" v-if="user">
    <img :src="user.picture.thumbnail" alt="Thumbnail" class="user-picture"/>
    <div class="user-info">
      <span class="user-name">{{ formattedName }}</span>
      <div class="user-email">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#707070FF">
          <path
              d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/>
        </svg>
        <span>
          {{ user.email }}
        </span>
      </div>
    </div>
    <div class="favorite-button" @click="toggleFavorite($event)">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#707070"
           v-show="userListStore.favoriteUsers && !userListStore.favoriteUsers[user.email]">
        <path
            d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/>
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#cf0202"
           v-show="userListStore.favoriteUsers && userListStore.favoriteUsers[user.email]">
        <path d="M0 0h24v24H0V0z" fill="none"/>
        <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    </div>
  </div>
</template>


<style lang="scss" scoped>
@import "../assets/styles/colors";

.user-card {
  align-items: flex-start;
  gap: 0;
  border: none;

  &.selected {
    border: 2px solid $mainOrange;
  }

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    box-shadow: 0 0 4px rgb(41 31 31 / 81%);
    cursor: pointer;
  }


  .user-picture {
    width: 48px;
    height: 48px;
    border-radius: 50px;
    filter: drop-shadow(2px 4px 4px #bababa);
    margin-right: 12px;
  }

  .user-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
    height: 100%;
    width: calc(100% - 108px);
    overflow: hidden;

    .user-name {
      font-size: 16px;
      font-weight: bold;
    }


    .user-email {
      display: flex;
      gap: 4px;
      align-items: center;
      color: $secondaryTextColor
    }
  }

  .favorite-button {
    display: flex;
    align-items: center;
    justify-content: center;
    justify-self: flex-end;
    margin-left: auto;
  }
}
</style>
