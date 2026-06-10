<template>
  <v-app theme="light">
    <v-app-bar color="blue-darken-4" elevation="2">
      <v-toolbar-title class="font-weight-bold ms-4">Studentski Poslovi Sustav</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn to="/" variant="text" prepend-icon="mdi-home">Početna</v-btn>
      <v-btn to="/tvrtke" variant="text" prepend-icon="mdi-domain">Tvrtke</v-btn>
      <v-btn to="/kategorije" variant="text" prepend-icon="mdi-tag">Kategorije</v-btn>
      <v-btn to="/oglasi" variant="text" prepend-icon="mdi-briefcase-variant">Oglasi</v-btn>
      <v-btn to="/prijave" variant="text" prepend-icon="mdi-account-card-text">Prijave</v-btn>
    </v-app-bar>

    <v-main class="bg-grey-lighten-4">
      <v-container class="pa-6">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>

</script>
