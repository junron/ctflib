<template>
  <div>
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
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {mapGetters} from "vuex";
import {Category} from "@/types/category";
import {effectiveColor} from "@/util";
import {Resource} from "@/types/posts/resource";
import {searchResources} from "@/api/posts/resource";
import CategoryCard from "@/components/CategoryCard.vue";
import {Prop} from "vue-property-decorator";

@Component({
  name: "PostListing",
  components: {CategoryCard},
  computed: mapGetters(["categories", "loggedIn"]),
  mounted() {
    (this as PostListing).loadResources();
  },
  watch: {
    query() {
      (this as PostListing).loadResources();
    },
  },
})
export default class PostListing extends Vue {

  @Prop() query!: string;

  private categories!: Category[]
  resources: Resource[] = [];
  lastUpdate = 0;

  effectiveColor(category: Category): string {
    return effectiveColor(category, this.$vuetify.theme.dark);
  }

  loadResources(): void {
    searchResources(this.query).then(resources => {
      if (this.lastUpdate > new Date().getTime()) return;
      this.resources = resources;
      this.lastUpdate = new Date().getTime();
    });
  }
}
</script>

