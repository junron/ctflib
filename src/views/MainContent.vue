<template>
  <v-container>
    <v-row class="my-4 px-3"><span class="text-h5">Hello, {{ name }}!</span></v-row>
    <v-row class="my-8 px-3">
      <v-text-field
          :height="($vuetify.breakpoint.smAndDown)?'':'100px'"
          :class="['search-field', ($vuetify.breakpoint.smAndDown) ? 'text-h5' : 'text-h4']"
          filled
          outlined
          label="What do you want to know?"
      />
    </v-row>
    <v-row>
      <v-col
          cols="12"
          sm="6"
          lg="3"
          xl="2"
          v-for="category in categories" :key="category.name">
        <category-card
            :name="category.name"
            :icon="category.icon"
            :color="category.color"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {Prop} from "vue-property-decorator";
import Component from "vue-class-component";
import CategoryCard from "@/components/CategoryCard.vue";

@Component({
  name: "MainContent",
  components: {
    CategoryCard,
  },
})
export default class MainContent extends Vue {
  @Prop() private name!: string;
  private categories = [{
    name: "Pwn",
    icon: "matrix",
    color: "amber--text",
  }, {
    name: "Web",
    icon: "web",
    color: "light-blue--text",
  }, {
    name: "Misc",
    icon: "help",
  }, {
    name: "Forensics",
    icon: "magnify",
    color: "green--text",
  }, {
    name: "Rev",
    icon: "application-braces-outline",
    color: "red--text",
  }, {
    name: "Crypto",
    icon: "function",
    color: "purple--text text--lighten-2",
  }];
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
