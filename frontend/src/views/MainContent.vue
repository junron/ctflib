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
    <v-row class="my-8 px-3">
      <v-autocomplete
          :height="($vuetify.breakpoint.smAndDown)?'':'100px'"
          :class="['search-field', ($vuetify.breakpoint.smAndDown) ? 'text-h5' : 'text-h4']"
          filled
          outlined
          label="What do you want to know?"
          :items="[]"
          :search-input.sync="query"

          no-data-text="No posts found :("
      >
        <template v-slot:item="{ item}">
          <v-list-item-icon>
            <v-icon
                :class="effectiveColor(item.category)"
            >mdi-{{ item.category.icon }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content @click="()=>openPage(item.url)">
            <v-list-item-title>{{ item.text }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.description }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-spacer v-if="$vuetify.breakpoint.mdAndUp"/>
          <v-chip-group v-if="$vuetify.breakpoint.mdAndUp">
            <v-chip v-for="tag in item.tags" :key="tag" :color="effectiveColor(item.category)">
              {{ tag }}
            </v-chip>
          </v-chip-group>
        </template>
      </v-autocomplete>
    </v-row>
    <!-- Major categories   -->
    <v-row>
      <v-col
          cols="12"
          sm="6"
          v-for="category in categories.filter(category=>category.is_major)" :key="category.name">
        <v-row>
          <v-col>
            <category-card
                :name="category.name"
                :icon="category.icon"
                :color="effectiveColor(category)"
                :posts="resources.filter(resource=>resource.post_category===category.name)"
                :important="true"
                @reload="loadResources"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <!--    Not important categories -->
    <v-row>
      <v-col
          cols="12"
          sm="6"
          lg="4"
          xl="3"
          v-for="category in categories.filter(category=>!category.is_major)" :key="category.name">
        <category-card
            :name="category.name"
            :icon="category.icon"
            :color="effectiveColor(category)"
            :posts="resources.filter(resource=>resource.post_category===category.name)"
            @reload="loadResources"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import CategoryCard from "@/components/CategoryCard.vue";
import {mapGetters} from "vuex";
import {Category} from "@/types/category";
import {Resource} from "@/types/posts/resource";
import {getResources} from "@/api/posts/resource";
import {effectiveColor} from "@/util";

@Component({
  name: "MainContent",
  components: {
    CategoryCard,
  },
  computed: mapGetters(["categories", "loggedIn", "name"]),
  mounted() {
    (this as MainContent).loadResources();
  },
})
export default class MainContent extends Vue {
  private query = "";
  categories!: Category[];
  loggedIn!: boolean;
  name!: string;
  resources: Resource[] = [];

  effectiveColor(category: Category): string {
    return effectiveColor(category, this.$vuetify.theme.dark);
  }

  loadResources(): void {
    getResources().then(resources => {
      this.$data.resources = resources;
    });
  }

  openPage(url: string): void {
    window.open(url, "_blank");
  }

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
