<template>
  <v-container>
    <v-row class="my-4"><span class="text-h5">Hello, {{ name }}!</span></v-row>
    <v-row class="my-8">
      <v-text-field
          :height="($vuetify.breakpoint.smAndDown)?'':'100px'"
          :class="['search-field', ($vuetify.breakpoint.smAndDown) ? 'text-h5' : 'text-h4']"
          filled
          outlined
          label="What do you want to know?"
      />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {Prop} from "vue-property-decorator";
import Component from "vue-class-component";

@Component
export default class MainContent extends Vue {
  @Prop() private name!: string;
}
</script>


<style lang="scss">

@import '~vuetify/src/styles/settings/_variables';


@media #{map-get($display-breakpoints, 'md-and-up')} {
  #app .search-field .v-label {
    font-size: 1em;
    height: fit-content;
    line-height: unset;
    top: 30%;
  }

  #app .search-field .v-label--active {
    height: fit-content;
    line-height: initial;
    font-size: 1em;
    top: 10px;
  }
}

#app .search-field input {
  margin-top: initial;
  height: fit-content;
  line-height: initial;
  max-height: initial;
}
</style>
