<template v-if="tagsStore.tags">
  <div class="add-section">
    <input v-model="newTag" placeholder="Add new tag" @keydown.enter="addTag"/>
    <button @click="addTag">
      <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#ffffff">
        <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
      </svg>
    </button>
  </div>
  <ul class="tags-list">
    <li v-for="(tag, index) in tagsStore.tags" :key="index" class="each-tag">
      <input v-model="editableTags[index]" @blur="editTag(index, editableTags[index])"/>
      <div class="actions">
        <!--        <div class="edit-tag">-->
        <!--          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#405059">-->
        <!--            <path-->
        <!--                d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>-->
        <!--          </svg>-->
        <!--        </div>-->
        <div class="delete-tag" @click="deleteTag(index)">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#405059">
            <path
                d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
          </svg>
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import useTagsStore from '../stores/tagsStore';

const tagsStore = useTagsStore();
const newTag = ref('');
const editableTags = ref([...tagsStore.tags]);

const addTag = () => {
  if (newTag.value.trim()) {
    tagsStore.addTag(newTag.value.trim());
    newTag.value = '';
    editableTags.value = [...tagsStore.tags];
  }
};

const deleteTag = (index: number) => {
  tagsStore.deleteTag(index);
  editableTags.value = [...tagsStore.tags];
};

const editTag = (index: number, newTag: string) => {
  if (newTag.trim()) {
    tagsStore.editTag(index, newTag.trim());
    editableTags.value = [...tagsStore.tags];
  }
};
</script>

<style scoped lang="scss">
@import "../assets/styles/colors";

.add-section {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  gap: 24px;
  background: $mainBackgroundGray;
  border-radius: 50px;
  margin-bottom: 16px;

  button {
    background: $mainOrange;
    height: 100%;
    border-radius: 0 50px 50px 0;
    cursor: pointer;
  }
}


input {
  width: 100%;
  height: 100%;
  border: none;
  margin: 0;
  background: transparent;
  padding: 16px;

  &:focus-visible {
    outline: none;
  }
}

.tags-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;

  .each-tag {
    width: fit-content;
    height: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: $mainBackgroundGray;
    border-radius: 50px;
    margin-bottom: 8px;
    padding: 12px;
    box-sizing: border-box;

    &:last-child {
      margin-bottom: 0;
    }

    .tag-name {
      font-weight: bold;
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 16px;
      cursor: pointer;
    }
  }
}
</style>
