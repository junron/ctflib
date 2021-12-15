<template>
  <v-container>
    <main-content v-if="loggedIn" :name="name"/>
    <v-container v-else
                 class="ma-4"
    >
      Please
      <router-link to="/login">log in</router-link>
      to see the content.
    </v-container>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import MainContent from "@/views/MainContent.vue";
import {mapGetters} from "vuex";

@Component({
  name: "Home",
  components: {
    MainContent,
  },
  computed: mapGetters(["name", "loggedIn"]),
})
export default class Home extends Vue {
  name!: string
  loggedIn!: boolean
}
</script>
