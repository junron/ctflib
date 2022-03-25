<template>
  <v-container>
    <v-card elevation="8" class="my-8">
      <v-row>
        <v-col>
          <v-card-title v-if="ctf">
            {{ ctf.ctf_name }} {{ ctf.start_date.getFullYear() }}
          </v-card-title>
          <v-card-title v-else>
            That CTF does not exist.
          </v-card-title>
          <v-card-subtitle v-if="ctf">
            By {{ ctf.organizer }}
          </v-card-subtitle>
          <v-card-text v-if="ctf">
            <v-row>
              <v-col>
                <v-icon>mdi-calendar</v-icon>
                {{ ctf.start_date.toLocaleDateString() }} - {{ ctf.end_date.toLocaleDateString() }}
              </v-col>
            </v-row>
          </v-card-text>
        </v-col>
        <v-spacer/>
        <v-col>
          <v-card-text>
            <v-row v-for="idx in 2" :key="idx">
              <v-col v-for="category in sortedCategories().slice(
                  Math.floor(categories.length/2) * (idx-1),
                  Math.floor(categories.length/2) * idx)"
                     :key="category.name">
                {{ challenges.filter(challenge => challenge.category_name === category.name).length }}
                &nbsp;
                <v-icon :class="effectiveColor(category)">mdi-{{ category.icon }}</v-icon>

              </v-col>
            </v-row>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
    <v-card v-for="category in sortedCategoriesWithChallenges()" :key="category.name">
      <v-card-title>
        <v-icon :class="effectiveColor(category) + ' mr-4' ">mdi-{{ category.icon }}</v-icon>
        {{ category.name }}
      </v-card-title>
      <v-card-text>
        <v-expansion-panels focusable>
          <v-expansion-panel
              v-for="challenge in challenges.filter(challenge => challenge.category_name === category.name)"
              :key="challenge.challenge_id"
              @click="fetchChallengeWriteups(challenge)"
          >
            <v-expansion-panel-header>
              <v-list-item>
                <v-list-item-content>
                  <v-row>
                    <v-col class="ma-auto">
                      <v-list-item-title>
                        {{ challenge.name }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ challenge.points }} points
                      </v-list-item-subtitle>
                    </v-col>
                    <v-spacer/>
                    <v-col cols="auto">
                      <v-chip-group>
                        <v-chip
                            label
                            v-for="tag in challenge.tags" :key="tag" :color="effectiveColor(category)">{{ tag }}
                        </v-chip>
                      </v-chip-group>
                    </v-col>
                  </v-row>
                </v-list-item-content>
              </v-list-item>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <markdown-renderer
                  max-width="'100%'"
                  :content="challenge.description"
                  class="ma-4"/>
              <v-divider/>
              <v-row class="ma-4" v-if="getChallengeWriteups(challenge).length">
                <!-- Internal writeups -->
                <v-chip-group column>
                  <v-chip
                      label
                      input-value="111"
                      dark
                      v-for="writeup in getChallengeWriteups(challenge).filter(w=>!w.url)"
                      color="deep-purple darken-3"
                      :key="writeup.writeup_id"
                      link
                      :href="`/#/writeups/${challenge.event_id}/${challenge.challenge_id}/${writeup.writeup_id}`"
                  >
                    Writeup by {{ writeup.poster_username }}
                  </v-chip>
                  <!-- External writeups -->
                  <v-chip
                      label
                      input-value="111"
                      dark
                      v-for="writeup in getChallengeWriteups(challenge).filter(w=>w.url)"
                      color="pink darken-3"
                      :key="writeup.writeup_id"
                      link
                      :href="writeup.url"
                      target="_blank"
                  >
                    External writeup
                  </v-chip>
                </v-chip-group>

              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {CTFEvent} from "@/types/ctfs/CTFEvent";
import {getChallenges, getCTFs} from "@/api/ctf/ctf";
import {Challenge} from "@/types/challenges/challenge";
import {mapGetters} from "vuex";
import {Category} from "@/types/category";
import {effectiveColor} from "@/util";
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";
import {Writeup} from "@/types/writeup";
import {getWriteupsForChallenge} from "@/api/writeup";

@Component({
  name: "ChallengeListing",
  components: {MarkdownRenderer},
  computed: mapGetters(["categories"]),
  mounted() {
    getCTFs(true).then((ctfs) => {
      this.$data.ctf = ctfs.filter(ctf => ctf.event_id == (this as ChallengeListing).getCTFId())[0];
    });
    getChallenges((this as ChallengeListing).getCTFId()).then((challenges) => {
      this.$data.challenges = challenges;
    });
  },
})
export default class ChallengeListing extends Vue {
  private categories!: Category[]
  private ctf: CTFEvent | null = null;
  private challenges: Challenge[] = [];
  private writeups: { challengeID: number, writeups: Writeup[] }[] = [];

  getCTFId(): number {
    return parseInt(this.$route.params.id);
  }

  fetchChallengeWriteups(challenge: Challenge) : void{
    if (this.getChallengeWriteups(challenge).length > 0) {
      return;
    }
    getWriteupsForChallenge(challenge).then((writeups) => {
      this.writeups.push({
        challengeID: challenge.challenge_id,
        writeups: writeups,
      });
    });
  }

  getChallengeWriteups(challenge: Challenge): Writeup[] {
    const challengeWriteups = this.writeups.find(chal => chal.challengeID === challenge.challenge_id);
    if (!challengeWriteups) {
      return [];
    }
    return challengeWriteups.writeups;
  }

  sortedCategories(): Category[] {
    return this.categories.concat([]).sort((a, b) => {
      if (a.is_major && !b.is_major) {
        return -1;
      }
      if (!a.is_major && b.is_major) {
        return 1;
      }
      return a.name.localeCompare(b.name);
    });
  }

  sortedCategoriesWithChallenges(): Category[] {
    return this.sortedCategories().filter(category => {
      return this.challenges.filter(challenge => challenge.category_name === category.name).length > 0;
    });
  }

  effectiveColor(category: Category): string {
    return effectiveColor(category, this.$vuetify.theme.dark);
  }
}
</script>

