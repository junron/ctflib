<template>
  <v-container>
    <v-card class="my-8 px-4">
      <v-row>
        <v-col>
          <v-card-title v-if="ctf">
            <v-row>
              <v-col cols="10" class="text-wrap">
                {{ ctf.ctf_name }} {{ ctf.start_date.getFullYear() }}
              </v-col>
              <v-spacer/>
              <v-col cols="2" class="ma-auto" align="end">
                <v-btn icon small
                       v-if="loggedIn"
                       @click="startCTFEdit(ctf)"
                >
                  <v-icon color="blue">mdi-pencil</v-icon>
                </v-btn>
              </v-col>
            </v-row>
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
      </v-row>
    </v-card>
    <v-card class="mt-8 mb-6 px-4" v-if="ctf">
      <v-card-text>
        <v-row>
          <v-col
              class="ma-auto"
              cols="auto"
              v-for="category in sortedCategories()"
              :key="category.name">
            {{ challenges.filter(challenge => challenge.category_name === category.name).length }}
            <v-icon :class="effectiveColor(category)">mdi-{{ category.icon }}</v-icon>
          </v-col>
          <v-spacer/>
          <v-col cols="auto">
            <v-btn
                link
                :href="`#/ctfs/${ctf.event_id}/challenges/new`"
                color="primary" v-if="loggedIn">
              <v-icon>mdi-plus</v-icon>&nbsp; Add challenge
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card
        class="px-4"
        v-for="category in sortedCategoriesWithChallenges()" :key="category.name">
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
                        <span class="ma-auto">
                          <v-btn icon small
                                 v-if="loggedIn"
                                 @click="startChallengeEdit(challenge)"
                          >
                            <v-icon color="blue">mdi-pencil</v-icon>
                          </v-btn>
                          <v-btn icon small
                                 v-if="loggedIn"
                                 @click="deleteChallenge(challenge)"
                          >
                            <v-icon color="red">mdi-delete</v-icon>
                          </v-btn>
                        </span>
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
              <v-row class="ma-4">
                <markdown-renderer
                    max-width="100%"
                    :content="challenge.description"
                />
              </v-row>
              <v-row class="ma-4" v-if="challenge.files.length > 0">
                <v-col>
                  Files:
                  <span v-for="file in challenge.files" :key="file.file_id">
                    <a :href="fileURL(file.file_id)">
                      {{ file.file_name }}
                    </a>
                    &nbsp;
                  </span>
                </v-col>
              </v-row>
              <v-divider/>
              <v-row class="ma-4">
                <!-- Internal writeups -->
                <v-chip-group column>
                  <v-chip
                      label
                      dark
                      v-for="writeup in getChallengeWriteups(challenge).filter(w=>!w.url)"
                      color="deep-purple darken-3"
                      :key="writeup.writeup_id"
                      link
                      :href="`/#/writeups/${challenge.event_id}/${challenge.challenge_id}/${writeup.writeup_id}`"
                  >
                    Writeup by {{ writeup.poster_username }}
                  </v-chip>
                  <v-chip
                      label
                      dark
                      v-if="loggedIn"
                      color="deep-purple darken-3"
                      link
                      :href="`/#/ctfs/${challenge.event_id}/challenges/${challenge.challenge_id}/writeup/new`">
                    <v-icon>mdi-plus</v-icon>
                    Add writeup
                  </v-chip>
                  <!-- External writeups -->
                  <v-chip
                      label
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
                  <v-chip
                      label
                      dark
                      v-if="loggedIn"
                      color="pink darken-3"
                      @click="newExtWriteup(challenge)">
                    <v-icon>mdi-plus</v-icon>
                    Add external writeup
                  </v-chip>
                </v-chip-group>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
    <ExternalWriteupInput
        ref="extWriteupInput"
        max-width="498px"
    />
    <confirmation
        ref="confirmation"
        :max-width="'500px'"
    />
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
import {createWriteup, getWriteupsForChallenge} from "@/api/writeup";
import {apiRoot} from "@/api";
import ExternalWriteupInput from "@/components/ExternalWriteupInput.vue";
import {deleteChallenge} from "@/api/ctf/challenge";
import Confirmation from "@/components/Confirmation.vue";

@Component({
  name: "ChallengeListing",
  components: {ExternalWriteupInput, MarkdownRenderer, Confirmation},
  computed: mapGetters(["categories", "loggedIn"]),
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
  private loggedIn!: boolean
  private ctf: CTFEvent | null = null;
  private challenges: Challenge[] = [];
  private writeups: Writeup[] = [];

  $refs!: {
    extWriteupInput: ExternalWriteupInput,
    confirmation: Confirmation,
  }

  newExtWriteup(challenge: Challenge): void {
    this.$refs.extWriteupInput.open(challenge.name).then((url) => {
      if (url) {
        const writeup: Writeup = {
          writeup_id: -1,
          challenge_id: challenge.challenge_id,
          url: url,
          poster_username: "User",
          is_private: false,
        };
        createWriteup(writeup).then((createdWriteup) => {
          this.writeups.push(createdWriteup);
        });
      }
    });
  }

  getCTFId(): number {
    return parseInt(this.$route.params.id);
  }

  fetchChallengeWriteups(challenge: Challenge): void {
    if (this.getChallengeWriteups(challenge).length > 0) {
      return;
    }
    getWriteupsForChallenge(challenge).then((writeups) => {
      writeups.forEach(writeup => this.writeups.push(writeup));
    });
  }

  getChallengeWriteups(challenge: Challenge): Writeup[] {
    const challengeWriteups = this.writeups.filter(writeup => writeup.challenge_id === challenge.challenge_id);
    if (!challengeWriteups) {
      return [];
    }
    return challengeWriteups;
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

  startChallengeEdit(challenge: Challenge): void {
    this.$router.push({
      name: "Edit challenge",
      params: {
        eventID: this.getCTFId().toString(),
        challenge: JSON.stringify(challenge),
      },
    });
  }

  startCTFEdit(ctf: CTFEvent): void {
    this.$router.push(`/ctfs/${ctf.event_id}/edit`);
  }

  deleteChallenge(challenge: Challenge): void {
    this.$refs.confirmation.open("Delete challenge",
        `Are you sure you want to delete "${challenge.name}"?`,
        "red").then((confirmed) => {
      if (confirmed) {
        deleteChallenge(this.getCTFId(), challenge.challenge_id).then(() => {
          this.challenges = this.challenges.filter(c => c.challenge_id !== challenge.challenge_id);
        });
      }
    });
  }

  fileURL(id: number): string {
    return apiRoot + "/files/" + id;
  }
}
</script>

