<template>
  <v-app>
    <v-navigation-drawer v-model="navDrawerShown" temporary app>
      <v-list dense nav>
        <v-list-item v-for="route in $router.options.routes" :key="route.path">
          <v-list-item-title>
            <router-link v-if="canDisplayRoute(route)"
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
        color="primary"
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
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from "vue-class-component";
import {mapGetters} from "vuex";
import {Route} from "@/router";

@Component({
  name: 'App',
  computed: mapGetters(["loggedIn"])
})
export default class App extends Vue {
  navDrawerShown = false
  loggedIn!: boolean

  canDisplayRoute(route: Route): boolean {
    if (this.loggedIn) {
      return route.path !== "/login";
    }
    return !route.requiresAuth;
  }

  toggleTheme(): void {
    this.$vuetify.theme.dark = !this.$vuetify.theme.dark
  }
}
</script>
