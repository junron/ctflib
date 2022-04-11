<template>
  <v-container :style="tab!==2 ? {'max-width': '960px'} : null">
    <v-card elevation="8" class="my-8">
      <v-row class="mx-lg-10 mx-2 py-4">
        <v-col class="ma-auto" v-if="writeup" cols="1">
          <v-icon :class="effectiveColor(categories.find(c=>c.name === challenge.category_name))">
            mdi-{{ categories.find(c => c.name === challenge.category_name).icon }}
          </v-icon>
        </v-col>
        <v-col cols="8">
          <v-card-title v-if="challenge" class="py-0">
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
            {{ challenge.name }}
          </v-card-title>
          <v-card-title v-else>
            That challenge does not exist.
          </v-card-title>
        </v-col>
        <v-spacer/>
        <v-col
            class="ma-auto"
            align="end"
            cols="3"
            v-if="!newWriteup()"
        >
          <v-btn icon small
                 v-if="loggedIn"
                 :disabled="editingWriteup"
                 @click="editingWriteup = true; content= writeup.body"
          >
            <v-icon color="blue">mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon small
                 v-if="loggedIn"
                 :disabled="editingWriteup"
                 @click="deleteWriteup()"
          >
            <v-icon color="red">mdi-delete</v-icon>
          </v-btn>
          <v-btn icon
                 @click="share()"
          >
            <v-icon>mdi-share-variant</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row class="mx-lg-6">
        <v-col>
          <v-card-subtitle v-if="challenge">
            By {{ ctf.organizer }} in
            <a :href="'/#/ctfs/'+ctf.event_id">
              {{ ctf.ctf_name }} {{ ctf.start_date.getFullYear() }}
            </a>,
            {{ challenge.points }} points
          </v-card-subtitle>
        </v-col>
      </v-row>
      <v-row class="mx-lg-6">
        <v-col>
          <v-card-text v-if="challenge">
            <markdown-renderer
                style="font-size: 1em"
                max-width="100%"
                :content="challenge.description"
            />
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
    <v-card elevation="8" v-if="challenge">
      <div class="pa-lg-12 pa-4" style="line-height: 2">
        <v-switch
            v-if="newWriteup() || editingWriteup"
            v-model="is_private"
            label="Make this writeup private"
        />
        <markdown-editor
            @changeTab="t=>this.tab = t"
            enable-split="true"
            v-if="newWriteup() || editingWriteup"
            :content.sync="content"
            max-width="100%"
            label="Writeup"
        />
        <markdown-renderer
            v-if="writeup && !editingWriteup"
            max-width="100%"
            :content="writeup.body"
        />
        <v-btn v-if="newWriteup()"
               color="success"
               @click="createWriteup()"
               :disabled="content.length === 0">
          Create writeup!
        </v-btn>
        <v-btn v-if="editingWriteup"
               color="primary"
               @click="editWriteup()"
               :disabled="content.length === 0">
          Save writeup!
        </v-btn>
      </div>
    </v-card>
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
import {createWriteup, deleteWriteup, editWriteup, getWriteupsForChallenge} from "@/api/writeup";
import {apiRoot} from "@/api";
import MarkdownEditor from "@/components/MarkdownEditor.vue";
import Confirmation from "@/components/Confirmation.vue";

@Component({
  name: "WriteupDisplay",
  components: {MarkdownEditor, MarkdownRenderer, Confirmation},
  computed: mapGetters(["categories", "loggedIn"]),
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

  private content = "";
  private is_private = false;
  private editingWriteup = false;
  private loggedIn!: boolean;

  private tab = 0;

  $refs!: {
    confirmation: Confirmation
  }

  newWriteup(): boolean {
    return this.$route.name !== "View writeup";
  }

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
        `${apiRoot}/share/writeup/${this.slugify(this.$data.challenge.name)}-${this.getWriteupId()}`)
        .then(() => {
          this.snackbar = true;
        });
  }

  createWriteup(): void {
    const challenge = this.challenge;
    if (challenge == null) return;
    createWriteup({
      body: this.content,
      is_private: this.is_private,
      challenge_id: challenge.challenge_id,
      // Will be overwritten by the server
      poster_username: "Imposter",
      writeup_id: 1,
    }).then((writeup: Writeup) => {
      this.$router.push(`/writeups/${this.getCTFId()}/${this.getChallengeId()}/${writeup.writeup_id}`);
      location.reload();
    });
  }

  deleteWriteup(): void {
    const id = this.writeup?.writeup_id;
    if (!id) return;
    this.$refs.confirmation.open("Delete writeup",
        `Are you sure you want to delete this writeup?`,
        "red").then((confirmed) => {
      if (confirmed) {
        deleteWriteup(id).then(() => {
          this.$router.push({path: `/ctfs/${this.getCTFId()}`});
        });
      }
    });
  }

  editWriteup(): void {
    const writeup = this.writeup;
    if (writeup == null) return;
    writeup.body = this.content;
    editWriteup(writeup).then(() => {
      this.editingWriteup = false;
      this.tab = 0;
    });
  }

  effectiveColor(category: Category): string {
    return effectiveColor(category, this.$vuetify.theme.dark);
  }
}
</script>

