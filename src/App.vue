<script setup>
</script>

<template>
  <nav class="header">
    <router-link to="/">Users</router-link>
    |
    <router-link to="/statistics">Statistics</router-link>
    |
    <router-link to="/tag-management">Tags</router-link>
  </nav>
  <div class="main-container">
    <router-view/>
  </div>
</template>

<style scoped lang="scss">
@import "assets/styles/colors";

.header {
  height: 40px;
  margin-right: -16px;
  margin-left: -16px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  margin-bottom: 16px;
  padding: 8px;
  border-radius: 0 0 16px 16px;
  background: $mainOrange;
  color: white !important;
  text-decoration: none;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.29);
  gap: 32px;
  position: sticky;
  top: 0;
  z-index: 1;

  a {
    font-weight: 500;
    color: white;
    text-decoration: inherit;
    width: 100px;

    &.router-link-exact-active {
      color: $mainOrange;
      background: white;
      padding: 4px;
      border-radius: 20px;
      width: 100px;
    }
  }
}
.main-container {
  width: 100%;
  height: 100%;
  max-height: calc(100% - 56px);
}
</style>

