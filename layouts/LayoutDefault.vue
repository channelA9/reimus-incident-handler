<template>
  <div class="flex flex-row max-w-screen font-sans bg-black">
    <Navbar>
      <Logo />
      <Link href="/"> Home </Link>
      <Link href="/reimus-incident-handler"> 1 </Link>
    </Navbar>
    <Content><slot /></Content>
  </div>
</template>

<script lang="ts" setup>
  import Content from "../components/Content.vue";
  import Link from "../components/Link.vue";
  import Logo from "../components/Logo.vue";
  import Navbar from "../components/Navbar.vue";
</script>

<style>
  /* see https://stackoverflow.com/questions/55206901/how-to-import-css-files-in-vue-3-child-components */
  @import "./tailwind.css";

  body {
    margin: 0;
    font-family: sans-serif;
  }
  * {
    box-sizing: border-box;
  }
  a {
    text-decoration: none;
  }
</style>

<style scoped>
  #page-content {
    opacity: 1;
    transition: opacity 0.3s ease-in-out;
  }
  body.page-is-transitioning #page-content {
    opacity: 0;
  }
</style>
