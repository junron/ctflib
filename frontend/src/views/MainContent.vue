<template>
  <v-container>
    <v-row class="my-4 px-3">
      <span v-if='loggedIn' class="text-h5">
        Hello, {{ name }}!
      </span>
      <v-row v-else class="my-4 ma-1">
        <span class="text-h5 ma-auto">
          Welcome to ctflib!
        </span>
        <v-spacer/>
        <v-btn
            color="primary"
            dark
            href="/#/login">
          Sign in
        </v-btn>
      </v-row>
    </v-row>
    <v-row>
      <v-spacer/>
      <v-col cols="auto">
        <v-tabs
            v-model="tab"
        >
          <v-tabs-slider/>
          <v-tab v-for="item in items" :key="item">{{ item[0].toUpperCase() + item.substr(1) }}</v-tab>
        </v-tabs>
      </v-col>
      <v-spacer/>
    </v-row>
    <v-row class="mt-2">
      <v-col>
        <v-text-field
            :height="($vuetify.breakpoint.smAndDown)?'':'80px'"
            :class="['search-field', ($vuetify.breakpoint.smAndDown) ? 'text-h6' : 'text-h5']"
            filled
            outlined
            :label="'Search for '+ items[tab]"
            v-model="query"
        />
      </v-col>
    </v-row>
    <PostListing
        v-if="tab === 0"
        :query="query"
    />
    <WriteupListing
        v-if="tab === 1"
        :query="query"
    />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import CategoryCard from "@/components/CategoryCard.vue";
import {mapGetters} from "vuex";
import {Category} from "@/types/category";
import PostListing from "@/components/PostListing.vue";
import WriteupListing from "@/components/WriteupListing.vue";

@Component({
  name: "MainContent",
  components: {
    WriteupListing,
    PostListing,
    CategoryCard,
  },
  computed: mapGetters(["categories", "loggedIn", "name"]),
})
export default class MainContent extends Vue {
  private query = "";
  private items = ["posts", "writeups", "guides"];
  categories!: Category[];
  loggedIn!: boolean;
  name!: string;
  tab = 0;
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
