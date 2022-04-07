<template>
  <v-list>
    <div v-for="(writeup, index) in writeups" :key="writeup.writeup_id">
      <v-list-item>
        <v-list-item-content>
          <v-row class="my-2" @click="openWriteup(writeup)">
            <v-col cols="auto" class="ma-auto">
              <v-icon :class="effectiveColor(writeup.category_name) + ' mr-4' ">
                mdi-{{ categories.find(c => c.name === writeup.category_name).icon }}
              </v-icon>
            </v-col>
            <v-col class="ma-auto">
              <v-row>
                <v-list-item-title>
                  {{ writeup.name }}
                </v-list-item-title>
              </v-row>
              <v-row>
                <v-list-item-subtitle>
                  By {{ writeup.poster_username }}
                </v-list-item-subtitle>
              </v-row>
            </v-col>
            <v-spacer/>
            <v-col cols="auto">
              <v-chip-group>
                <v-chip
                    label
                    v-for="tag in writeup.tags" :key="tag" :color="effectiveColor(writeup.category_name)">{{ tag }}
                </v-chip>
              </v-chip-group>
            </v-col>
          </v-row>
        </v-list-item-content>
      </v-list-item>
      <v-divider v-if="index !== writeups.length-1"/>
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
import {WriteupSearchResult} from "@/types/writeup";
import {searchWriteups} from "@/api/writeup";

@Component({
  name: "WriteupListing",
  computed: mapGetters(["categories"]),
  mounted() {
    (this as WriteupListing).loadWriteups();
  },
  watch: {
    query() {
      (this as WriteupListing).loadWriteups();
    },
  },
})
export default class WriteupListing extends Vue {

  @Prop() query!: string;

  private categories!: Category[]

  writeups: WriteupSearchResult[] = [];
  lastUpdate = 0;

  effectiveColor(category_name: string): string {
    const category = this.categories.find(c => c.name === category_name);
    if (!category) {
      return "";
    }
    return effectiveColor(category, this.$vuetify.theme.dark);
  }

  loadWriteups(): void {
    searchWriteups(this.query).then(writeups => {
      if (this.lastUpdate > new Date().getTime()) return;
      this.writeups = writeups;
      this.lastUpdate = new Date().getTime();
    });
  }

  openWriteup(writeup: WriteupSearchResult): void {
    this.$router.push({
      path: "/writeups/" + writeup.event_id + "/" + writeup.challenge_id + "/" + writeup.writeup_id,
    });
  }
}
</script>

