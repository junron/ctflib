<template>
  <v-container style="max-width: 960px">
    <v-card elevation="8" class="my-8">
      <v-row class="mx-lg-10 mx-2 py-4">
        <v-col class="ma-auto" v-if="guide" cols="1">
          <v-icon :class="effectiveColor(categories.find(c=>c.name === guide.post_category))">
            mdi-{{ categories.find(c => c.name === guide.post_category).icon }}
          </v-icon>
        </v-col>
        <v-col cols="8">
          <v-card-title v-if="guide" class="py-0">
            <v-snackbar
                v-model="snackbar"
                :timeout="1500"
            >
              Link copied!
              <template v-slot:action="{ attrs }">
                <v-btn
                    color="primary"
                    text
                    v-bind="attrs"
                    @click="snackbar = false"
                >
                  Close
                </v-btn>
              </template>
            </v-snackbar>
            &nbsp;
            <span class="text-wrap">
              {{ guide.title }}
            </span>
          </v-card-title>
          <v-card-title v-else>
            That guide does not exist.
          </v-card-title>
        </v-col>
        <v-spacer/>
        <v-col
            class="ma-auto"
            align="end"
            cols="3"
            v-if="guide"
        >
          <v-btn icon small
                 v-if="loggedIn"
                 @click="$router.push(`/guides/${guide.post_id}/edit`)"
          >
            <v-icon color="blue">mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon
                 v-if="guide"
                 @click="share()"
          >
            <v-icon>mdi-share-variant</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row class="mx-lg-6">
        <v-col>
          <v-card-subtitle v-if="guide">
            By {{ guide.poster_username }}
            <span v-if="guide.series_id"> in {{ guide.series_name }}</span>
          </v-card-subtitle>
        </v-col>
      </v-row>
      <v-row class="mx-lg-6">
        <v-col>
          <v-card-text v-if="guide">
            <markdown-renderer
                style="font-size: 1em"
                max-width="100%"
                :content="guide.description"
            />
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
    <v-card elevation="8" v-if="guide">
      <v-row class="px-lg-12 px-4 py-4">
        <v-col cols="3">
          <v-btn
              color="primary"
              :disabled="!guide.prev"
              @click="navigateGuide(guide.prev)"
          >
            Prev
          </v-btn>
        </v-col>
        <v-col class="ma-auto text-h6 text-wrap" cols="6" align="center">
          {{ guide.series_name }}
        </v-col>
        <v-col cols="3" align="end">
          <v-btn
              color="primary"
              :disabled="!guide.next"
              @click="navigateGuide(guide.next)"
          >
            Next
          </v-btn>
        </v-col>
      </v-row>
      <div class="px-lg-12 px-4" style="line-height: 2">
        <markdown-renderer
            max-width="100%"
            :content="guide.body"
        />
      </div>
      <v-row class="px-lg-12 px-4 py-4">
        <v-col cols="3">
          <v-btn
              color="primary"
              :disabled="!guide.prev"
              @click="navigateGuide(guide.prev)"
          >
            Prev
          </v-btn>
        </v-col>
        <v-col class="ma-auto text-h6 text-wrap" cols="6" align="center">
          {{ guide.series_name }}
        </v-col>
        <v-col cols="3" align="end">
          <v-btn
              color="primary"
              :disabled="!guide.next"
              @click="navigateGuide(guide.next)"
          >
            Next
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {mapGetters} from "vuex";
import {Category} from "@/types/category";
import {effectiveColor} from "@/util";
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";
import {apiRoot} from "@/api";
import {Guide} from "@/types/posts/guide";
import {getGuide} from "@/api/posts/guide";

@Component({
  name: "GuideDisplay",
  components: {MarkdownRenderer},
  computed: mapGetters(["categories", "loggedIn"]),
  mounted() {
    (this as GuideDisplay).loadGuide();
  },
  watch: {
    $route: {
      handler() {
        (this as GuideDisplay).loadGuide();
      },
      immediate: true,
    },
  },
})
export default class GuideDisplay extends Vue {
  private categories!: Category[]
  private guide: Guide | null = null;
  private snackbar = false;

  private loggedIn!: boolean;

  getGuideId(): number {
    return parseInt(this.$route.params.id);
  }

  loadGuide(): void {
    getGuide((this as GuideDisplay).getGuideId()).then(guide => {
      if (guide.success) {
        (this as GuideDisplay).guide = guide.data;
      }
    });
  }

  slugify(str: string): string {
    return str.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
  }

  share(): void {
    navigator.clipboard.writeText(
        `${apiRoot}/share/guide/${this.slugify(this.$data.guide.title)}-${this.getGuideId()}`)
        .then(() => {
          this.snackbar = true;
        });
  }

  effectiveColor(category: Category): string {
    return effectiveColor(category, this.$vuetify.theme.dark);
  }

  navigateGuide(guideID: number): void {
    this.$router.push(`/guides/${guideID}`);
    window.scrollTo(0, 0);
  }
}
</script>

