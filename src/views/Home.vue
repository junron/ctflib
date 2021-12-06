<template>
  <hello-world :msg="name"/>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import HelloWorld from "@/components/HelloWorld.vue";
import {mapGetters} from "vuex";

@Component({
  name: "Home",
  components: {
    HelloWorld
  },
  computed: mapGetters(["name"])
})
export default class Home extends Vue {
}
</script>
