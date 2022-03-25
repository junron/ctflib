<template>
  <v-container>
    <v-card elevation="8" class="my-8">
      <v-row>
        <v-col class="mx-8">
          <v-card-title v-if="challenge">
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
            <v-icon :class="effectiveColor(categories.find(c=>c.name === challenge.category_name))">
              mdi-{{ categories.find(c => c.name === challenge.category_name).icon }}
            </v-icon>
            &nbsp;
            {{ challenge.name }}
          </v-card-title>
          <v-card-title v-else>
            That challenge does not exist.
          </v-card-title>
          <v-card-subtitle v-if="challenge">
            By {{ ctf.organizer }}, {{ challenge.points }} points
          </v-card-subtitle>
          <v-card-text v-if="challenge">
            <markdown-renderer
                style="font-size: 1em"
                max-width="100%"
                :content="challenge.description"
            />
          </v-card-text>
        </v-col>
        <v-spacer/>
        <v-col class="mx-6 my-4" cols="auto"
               @click="share()"
        >
          <v-btn icon>
            <v-icon>mdi-share-variant</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
    <v-card elevation="8" class="my-8" v-if="challenge && writeup">
      <v-card-text>
        <markdown-renderer
            class="ma-8"
            max-width="100%"
            :content="writeup.body"
        />
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
  name: "WriteupDisplay",
  components: {MarkdownRenderer},
  computed: mapGetters(["categories"]),
  mounted() {
    getCTFs(true).then((ctfs) => {
      this.$data.ctf = ctfs.filter(ctf => ctf.event_id == (this as WriteupDisplay).getCTFId())[0];
    });
    getChallenges((this as WriteupDisplay).getCTFId()).then((challenges) => {
      this.$data.challenge = challenges.filter(
          challenge => challenge.challenge_id == (this as WriteupDisplay).getChallengeId())[0];
      if (this.$data.challenge) {
        getWriteupsForChallenge(this.$data.challenge).then((writeups) => {
          this.$data.writeup = writeups.filter(writeup => writeup.writeup_id == (this as WriteupDisplay).getWriteupId())[0];
        });
      }
    });

  },
})
export default class WriteupDisplay extends Vue {
  private categories!: Category[]
  private ctf: CTFEvent | null = null;
  private challenge: Challenge | null = null;
  private writeup: Writeup | null = null;
  private snackbar = false;

  getCTFId(): number {
    return parseInt(this.$route.params.eventID);
  }

  getChallengeId(): number {
    return parseInt(this.$route.params.challengeID);
  }

  getWriteupId(): number {
    return parseInt(this.$route.params.writeupID);
  }

  slugify(str: string): string {
    return str.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
  }

  share(): void {
    navigator.clipboard.writeText(
        `${window.location.origin}/share/writeup/${this.slugify(this.$data.challenge.name)}-${this.getWriteupId()}`)
        .then(() => {
          this.snackbar = true;
        });
  }

  effectiveColor(category: Category): string {
    return effectiveColor(category, this.$vuetify.theme.dark);
  }
}
</script>

