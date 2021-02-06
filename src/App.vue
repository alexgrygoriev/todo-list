<template>
  <v-app>
    <v-app-bar
        app
        color="blue darken-4"
        dark
        src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
    >
      <div class="d-flex align-center">
        <v-img
            alt="Vuetify Logo"
            class="shrink mr-2"
            contain
            src="@/assets/logo.svg"
            transition="scale-transition"
            width="120"
        />
      </div>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-card
            class="mx-auto"
            max-width="900"
        >
          <listForm />
          <listComponent />
        </v-card>
      </v-container>
    </v-main>

    <v-footer
        dark
        padless
    >
      <v-card
          flat
          tile
          class="indigo lighten-1 white--text text-center"
      >
        <v-card-text class="white--text pt-3">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text class="white--text">
          {{ new Date().getFullYear() }} — <strong>For xbAV</strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>

import listForm from './components/listForm'
import listComponent from "@/components/listComponent"

export default {
  name: 'App',
  components: {
    listComponent,
    listForm,
  }
};
</script>