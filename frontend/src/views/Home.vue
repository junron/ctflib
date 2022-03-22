<template>
  <v-container>
    <main-content v-if="loggedInOrAnonymous" :name="name"/>
    <v-container v-else
                 class="ma-4"
    >
      Please
      <router-link to="/login">log in or register</router-link>
      to see the content.<br>
      Or
      <span @click="loginAnonymously"> <router-link to="/">browse anonymously</router-link> </span>.
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
  computed: mapGetters(["name", "loggedInOrAnonymous"]),
})
export default class Home extends Vue {
  name!: string
  loggedInOrAnonymous!: boolean

  loginAnonymously(): void {
    console.log("sus");
    this.$store.dispatch("loginAnonymously");
  }
}
</script>
