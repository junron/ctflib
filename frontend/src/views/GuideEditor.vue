<template>
  <v-container :style="tab!==2 ? {'max-width': '960px'} : null">
    <v-card elevation="8" class="my-8">
      <v-row>
        <v-col class="mx-8">
          <v-card-title v-if="getGuideId()">
            Edit guide
          </v-card-title>
          <v-card-title v-else>
            Create guide
          </v-card-title>
        </v-col>
        <v-spacer/>
        <v-col
            class="mx-6 my-4" cols="auto"
        >
          <v-btn
              v-if="getGuideId()"
              icon
              @click="share()"
          >
            <v-icon>mdi-share-variant</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-card-text>
        <v-form
            class="mx-8"
            ref="form"
            v-model="valid"
        >
          <v-row>
            <v-col>
              <v-text-field
                  v-model="guide.title"
                  label="Title"
                  @input="errors['title'] = ''"
                  :error-messages="errors['title']"
                  :rules="[v => !!v || 'Title is required']"
              />
            </v-col>
            <v-col cols="auto" class="ma-auto">
              <v-switch
                  v-model="guide.is_private"
                  label="Private"
              />
            </v-col>
          </v-row>
          <MarkdownEditor
              max-width="500px"
              :content.sync="guide.description"
              label="Description"
              :error="errors['description']"
          />
          <v-row>
            <v-col>
              <CategoryPicker
                  :category.sync="guide.post_category"/>
            </v-col>
            <v-col>
              <TagPicker
                  :category="guide.post_category"
                  :tags.sync="guide.tags"/>
            </v-col>
            <v-col>
              <v-combobox
                  v-model="selectedSeries"
                  label="Series"
                  :items="series.map(a=>({text:a.title, value: a.series_id}))"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
    <v-card elevation="8">
      <v-card-title class="px-12 py-8">
        Your guide
      </v-card-title>
      <div class="px-12" style="line-height: 2">
        <markdown-editor
            label="Body"
            max-width="100%"
            @changeTab="t=>this.tab = t"
            enable-split="true"
            :content.sync="guide.body"
        />
      </div>
      <v-row class="mx-8">
        <!-- Button for creating guide  -->
        <v-col v-if="!getGuideId()" cols="auto">
          <v-btn

              color="success"
              @click="createGuide()"
              :disabled="!valid || !guide.post_category.length || !guide.body.trim().length">
            Submit
          </v-btn>
        </v-col>
        <!-- Button for saving edited post -->
        <v-col v-else cols="auto">
          <v-btn
              color="blue"
              @click="editGuide()"
              :disabled="!valid || !guide.post_category.length || !guide.body.trim().length">
            Save changes
          </v-btn>
        </v-col>
        <!--    Button for cancelling -->
        <v-col cols="auto">
          <v-btn
              class="mx-4"
              @click="back">
            Cancel
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
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
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {apiRoot} from "@/api";
import {Guide, Series} from "@/types/posts/guide";
import {getGuide, getSeries, createGuide} from "@/api/posts/guide";
import MarkdownEditor from "@/components/MarkdownEditor.vue";
import CategoryPicker from "@/components/CategoryPicker.vue";
import TagPicker from "@/components/TagPicker.vue";

@Component({
  name: "GuideEditor",
  components: {MarkdownEditor, CategoryPicker, TagPicker},
  mounted() {
    (this as GuideEditor).loadGuide();
    getSeries().then(series => {
      (this as GuideEditor).series = series;
    });
  },
  watch: {
    $route: {
      handler() {
        (this as GuideEditor).loadGuide();
      },
      immediate: true,
    },
  },
})
export default class GuideEditor extends Vue {
  private guide: Guide | null = null;
  private series: Series[] = [];
  private selectedSeries: { value: number, text: string } | string | null = null;

  private snackbar = false;
  private valid = false;
  private errors = {};
  private tab = 0;

  getGuideId(): number {
    return parseInt(this.$route.params.id);
  }

  loadGuide(): void {
    const guideId = this.getGuideId();
    if (!guideId) {
      this.guide = {
        description: "",
        poster_username: "",
        series_id: null,
        series_name: null,
        post_id: -1,
        title: "",
        body: "",
        is_private: false,
        post_category: "",
        tags: [],
        prev: null,
        next: null,
      };
      return;
    }
    getGuide(guideId).then(guide => {
      if (guide.success) {
        (this as GuideEditor).guide = guide.data;
        if (guide.data.series_id && guide.data.series_name) {
          (this as GuideEditor).selectedSeries = {
            text: guide.data.series_name,
            value: guide.data.series_id,
          };
        } else {
          (this as GuideEditor).selectedSeries = null;
        }
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

  createGuide(): void {
    if (!this.guide) return;
    if (this.selectedSeries) {
      if (typeof this.selectedSeries === "string") {
        this.guide.series_id = null;
        this.guide.series_name = this.selectedSeries;
      } else {
        this.guide.series_id = this.selectedSeries.value;
        this.guide.series_name = this.selectedSeries.text;
      }
    }
    createGuide(this.guide).then((guide) => {
      this.$router.push(`/guides/${guide.data.post_id}`);
    });
  }

  editGuide(): void {
    // editResource(this.guide).then(response => {
    //   this.success = response.success;
    //   this.back();
    // });
  }

  back(): void {
    this.$router.replace({name: "Home"});
  }

  reset(): void {
    (this.$refs.form as HTMLFormElement).reset();
  }
}
</script>

