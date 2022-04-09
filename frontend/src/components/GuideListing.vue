<template>
  <v-list>
    <div v-for="(guide, index) in guides" :key="guide.post_id">
      <v-list-item>
        <v-list-item-content>
          <v-row class="my-2" @click="openGuide(guide)">
            <v-col cols="auto" class="ma-auto">
              <v-icon :class="effectiveColor(guide.post_category) + ' mr-4' ">
                mdi-{{ categories.find(c => c.name === guide.post_category).icon }}
              </v-icon>
            </v-col>
            <v-col class="ma-auto">
              <v-row>
                <v-list-item-title>
                  {{ guide.title }}
                </v-list-item-title>
              </v-row>
              <v-row>
                <v-list-item-subtitle>
                  By {{ guide.poster_username }}
                  <span v-if="guide.series_id">
                    in {{ guide.series_name }}
                  </span>
                </v-list-item-subtitle>
              </v-row>
            </v-col>
            <v-spacer/>
            <v-col cols="auto">
              <v-chip-group>
                <v-chip
                    label
                    v-for="tag in guide.tags" :key="tag" :color="effectiveColor(guide.post_category)">{{ tag }}
                </v-chip>
              </v-chip-group>
            </v-col>
          </v-row>
        </v-list-item-content>
      </v-list-item>
      <v-divider v-if="index !== guides.length-1"/>
    </div>
  </v-list>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {mapGetters} from "vuex";
import {Category} from "@/types/category";
import {effectiveColor} from "@/util";
import {Prop} from "vue-property-decorator";
import {Guide} from "@/types/posts/guide";
import {searchGuides} from "@/api/posts/guide";

@Component({
  name: "GuideListing",
  computed: mapGetters(["categories"]),
  mounted() {
    (this as GuideListing).loadGuides();
  },
  watch: {
    query() {
      (this as GuideListing).loadGuides();
    },
  },
})
export default class GuideListing extends Vue {

  @Prop() query!: string;

  private categories!: Category[]

  guides: Guide[] = [];
  lastUpdate = 0;

  effectiveColor(category_name: string): string {
    const category = this.categories.find(c => c.name === category_name);
    if (!category) {
      return "";
    }
    return effectiveColor(category, this.$vuetify.theme.dark);
  }

  loadGuides(): void {
    searchGuides(this.query).then(guides => {
      if (this.lastUpdate > new Date().getTime()) return;
      this.guides = guides;
      this.lastUpdate = new Date().getTime();
    });
  }

  openGuide(guide: Guide): void {
    this.$router.push({
      path: "/guides/" + guide.post_id,
    });
  }
}
</script>

