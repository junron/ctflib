<template>
  <v-container>
    <hello-world v-if="loggedIn" :msg="name"/>
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
import HelloWorld from "@/components/HelloWorld.vue";
import {mapGetters} from "vuex";

@Component({
  name: "Home",
  components: {
    HelloWorld,
  },
  computed: mapGetters(["name", "loggedIn"]),
})
export default class Home extends Vue {
  name!: string
  loggedIn!: boolean
}
</script>
