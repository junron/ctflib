<template>
  <v-container>
    Hello, {{ msg }}
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import {Prop} from "vue-property-decorator";
import Component from "vue-class-component";

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;
}
</script>
