<template>
  <v-app>
    <v-navigation-drawer v-model="navDrawerShown" temporary app>
      <v-list dense nav>
        <v-list-item v-for="route in displayableRoutes" :key="route.path">
          <v-list-item-title>
            <router-link
                @click="navDrawerShown = false"
                style="text-decoration: none; color: inherit;"
                :to="route.path">{{ route.name }}
            </router-link>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
        app
        color="indigo darken-3"
        dark
    >
      <v-app-bar-nav-icon @click="navDrawerShown = !navDrawerShown"/>
      <v-app-bar-title>
        CTFlib
      </v-app-bar-title>
      <v-spacer/>
      <v-btn icon @click="toggleTheme">
        <v-icon>mdi-brightness-6</v-icon>
      </v-btn>
      <v-btn v-if="loggedIn" icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <link v-if="!darkMode" rel="stylesheet" href="/github.css">


    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {mapGetters} from "vuex";
import {RouteConfig} from "vue-router";
import {logout, me} from "@/api/auth";
import {getCategories} from "@/api/category";

@Component<App>({
  name: "App",
  computed: mapGetters(["loggedIn", "darkMode"]),
  mounted() {
    this.$vuetify.theme.dark = this.darkMode;
    me().then(response => {
      console.log(response);
      if (response.success) {
        this.$store.dispatch("login", response.data.username);
      } else {
        this.$store.dispatch("logout");
        // Already logged out
        if (response.message === "No token provided") return;
        this.logout();
      }
    });
    getCategories().then(categories => {
      this.$store.dispatch("setCategories", categories);
    });
  },
})
export default class App extends Vue {
  navDrawerShown = false
  loggedIn!: boolean
  darkMode!: boolean

  get displayableRoutes(): RouteConfig[] {
    return this.$router.options.routes?.filter(route => {
      if (route.meta && route.meta.show == false) {
        return false;
      }
      if (this.loggedIn) {
        return route.path !== "/login";
      }
      return route.meta?.requiresAuth != true;
    }) ?? [];
  }

  toggleTheme(): void {
    this.$store.dispatch("toggleDarkMode");
    this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
  }

  logout(): void {
    this.$store.dispatch("logout");
    logout().then(() => {
      location.reload();
    });
  }
}
</script>

<style lang="scss">
@import "src/styles/font.scss";

.v-app-bar-title__content {
  width: fit-content !important;
}
</style>
