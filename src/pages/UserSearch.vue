<template>
  <div class="loading" v-if="!userListStore.users">
    <div class="loading">
      <ProgressSpinner/>
    </div>
  </div>

  <template v-else>
    <div class="page-container">
      <div class="users-list-container">
        <search-bar @update:filtersChange="userListStore.setFilters"></search-bar>
        <ul class="users-list">
          <UserCard v-for="user of userListStore.filteredUsers"
                    :key="user.email"
                    :user="user as IUser"
                    :is-selected="!!(selectedUser && user.email===selectedUser?.email)"
                    @click="onUserClick(user as IUser)"
                    @toggle-favorite="handleToggleFavorite"
          />
        </ul>
        <button class="load-more" @click="loadMore()" v-if="!userListStore.isLoading">
          Load More ..
        </button>
        <div class="loading" v-else>
          <ProgressSpinner/>
        </div>
        <button class="fresh-list" @click="getFreshList()">Get fresh list!</button>
        <button class="fresh-list" @click="getFreshList(true)">Get specific seed!</button>
      </div>
      <div class="user-details" v-if="selectedUser">
        <img :src="selectedUser.picture.thumbnail" alt="Thumbnail" class="user-picture"/>
        <div class="info">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
               fill="#405059"
               class="close"
               @click="closeSelectedUSer()">
            <path
                d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
          </svg>
          <div class="each-info">
            <div class="title">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                   fill="#ffffff">
                <path
                    d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/>
              </svg>
              <span>User ID</span>
            </div>
            <span class="value">
              {{ selectedUser.id.name && selectedUser.id.name !== '' ? selectedUser.id.name : '-' }}
            </span>
          </div>
          <div class="each-info">
            <div class="title">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                   fill="#ffffff">
                <path
                    d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67ZM241-600Zm358 358Z"/>
              </svg>
              <span>Phone</span>
            </div>
            <span class="value">
              {{ selectedUser.phone }}
            </span>
          </div>
          <div class="each-info">
            <div class="title">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                   fill="#ffffff">
                <path
                    d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/>
              </svg>
              <span>Location</span>
            </div>
            <span class="value">
              {{
                `${selectedUser.location.country}-${selectedUser.location.city}-${selectedUser.location.street.name} ${selectedUser.location.street.number}`
              }}
            </span>
          </div>
        </div>
        <div class="user-tags">
          <h4>User Tags</h4>
          <PMultiSelect
              v-model="userTag"
              :options="tagStore.tags"
              :optionValue="null"
              :option-label="null"
              :display="'chip'"
              :placeholder="'Select tag to add'"
              @change="setUserTag($event)"/>
        </div>
      </div>
    </div>
  </template>
  <div class="error" v-if="userListStore.error">
    Error Occurred !
    <p>{{ userListStore.error }}</p>
  </div>
</template>
<script setup lang="ts">
import UserCard from '../components/UserCard.vue';
import {IUser} from '../types/IUserList';
import SearchBar from '../components/SearchBar.vue';
import {onMounted, ref} from 'vue';
import useUserListStore from '../stores/usersStore';
import useTagsStore from '../stores/tagsStore';
import {SELECTED_USER_KEY} from '../utils/constants';

const userListStore = useUserListStore();
const tagStore = useTagsStore();
const selectedUser = ref<IUser | null>(JSON.parse(localStorage.getItem(SELECTED_USER_KEY)) ?? null);
const userTag = ref<string[] | null>(null);

const onUserClick = (user: IUser) => {
  selectedUser.value = user;
  userTag.value = selectedUser.value.tags;
  localStorage.setItem(SELECTED_USER_KEY, JSON.stringify(user));
}

const closeSelectedUSer = () => {
  selectedUser.value = null;
  localStorage.removeItem(SELECTED_USER_KEY);
}

const handleToggleFavorite = (data) => {
  userListStore.toggleFavorite(data);
}

const setUserTag = (event) => {
  userListStore.setUserTags(event.value as string[], selectedUser.value.email);
  selectedUser['tags'] = event.value;
}

onMounted(async () => {
  await userListStore.fetchData();
});

const loadMore = async () => {
  await userListStore.fetchData(true, true);
}

const getFreshList = async (withSeed?: boolean) => {
  userListStore.resetState();
  await userListStore.fetchData(withSeed);
}

</script>
<style lang="scss">
@import "../assets/styles/colors";

.page-container {
  display: flex;
  gap: 16px;
  max-width: 100%;
  height: calc(100% - 40px);

  .users-list-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
    width: 380px;
    overflow: scroll;
    padding: 4px 16px 4px 4px;

    .users-list {
      width: 100%;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .loading {
      display: flex;
      width: 40px;
    }
  }

  .user-details {
    width: calc(100% - 400px);
    height: fit-content;
    display: flex;
    flex-wrap: wrap;
    gap: 32px;
    padding: 24px;
    box-shadow: 0 0 5px #0d2e4157;
    border-radius: 20px;
    position: sticky;
    top: 56px;

    .close {
      position: absolute;
      right: 16px;
      top: 16px;
      cursor: pointer;
    }

    .user-picture {
      width: 80px;
      height: 80px;
      border-radius: 50px;
      filter: drop-shadow(2px 4px 6px #bababa);
    }

    .info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      height: auto;
      font-size: 13px;
      max-width: calc(100% - 112px);

      .each-info {
        display: flex;
        gap: 8px;
        align-items: center;

        .title {
          display: flex;
          align-items: center;
          gap: 2px;
          background: $primaryTextColor;
          padding: 8px;
          border-radius: 50px;
          color: white;
          width: 90px;
          justify-content: center;
        }

        .value {
          font-weight: 500;
        }
      }
    }

    .user-tags {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      border-top: 1px solid $mainBackgroundGray;
      gap: 12px;

      h4 {
        margin-bottom: 0;
      }

      .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        row-gap: 4px;

        .each-tag {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px;
          background: $mainBackgroundGray;
          border-radius: 50px;
          min-width: 40px;
          gap: 4px
        }
      }
    }
  }

  .fresh-list {
    display: flex;
    justify-content: center;
    height: 40px;
    background: $mainOrange;
    color: white;
  }
}

@media (max-width: 1024px) {
  .page-container {
    flex-direction: column;
    align-items: center;

    .users-list-container {
      width: 100%;
    }

    .user-details {
      width: 100%;
      max-width: 600px;
    }
  }
}

@media (max-width: 768px) {
  .page-container {
    padding: 0 8px;

    .users-list-container {
      padding: 0 8px;
    }

    .user-details {
      padding: 16px;
      gap: 16px;
    }

    .info .each-info .title {
      width: auto;
      padding: 4px 8px;
    }

    .info {
      font-size: 12px;
    }
  }
}

@media (max-width: 480px) {
  .page-container {
    .user-details {
      padding: 8px;
      gap: 8px;
      position: absolute;
      top: 56px;
      z-index: 10;
      background: white;
      margin: 8px;
      width: 80%;
    }

    .info {
      font-size: 11px;
    }

    .info .each-info .title {
      font-size: 10px;
      padding: 2px 4px;
    }
  }
}
</style>
