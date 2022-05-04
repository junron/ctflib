<template>
  <v-container fluid>
    <v-card
        class="my-4 align-center mx-auto" max-width="500px">
      <v-card-text>
        <v-form
            ref="form"
            v-model="valid"
        >
          <v-row>
            <v-col>
              <v-combobox
                  v-model="localCTF.ctf_name"
                  :items="ctfNames.map(ctf => ctf.name)"
                  label="CTF name"
                  @input="errors['name'] = ''; setOrganizer()"
                  :error-messages="errors['name']"
                  :rules="[v => !!v || 'CTF name is required']"
                  :disabled="getEventId() > 0"
              />
            </v-col>
            <v-col cols="auto">
              <v-switch
                  v-model="hasCTFTimeEvent"
                  :disabled="getEventId() > 0"
                  label="Ctftime"
              />
            </v-col>
          </v-row>

          <v-text-field
              :disabled="lockOrganizer"
              v-model="localCTF.organizer"
              label="Organizer"
              @input="errors['organizer'] = ''"
              :error-messages="errors['organizer']"
              :rules="[v => !!v || 'Organizer is required']"
          />

          <v-text-field
              v-model="localCTF.website"
              label="Website"
              @input="errors['website'] = ''"
              :error-messages="errors['website']"
              :rules="[v => !!v || 'Website is required', validateUrl]"
          />
          <date-time-picker
              label="Start date"
              :before="end_date"
              :datetime.sync="start_date"
          />
          <date-time-picker
              label="End date"
              :after="start_date"
              :datetime.sync="end_date"
          />
          <div v-if="hasCTFTimeEvent">
            <v-row>
              <v-col>
                <v-text-field
                    v-model="localCTFTimeEvent.ctftime_id"
                    :disabled="getEventId() > 0"
                    type="number"
                    label="CTFtime ID"
                    @input="errors['ctftime_id'] = ''"
                    :error-messages="errors['ctftime_id']"
                    :rules="[v=> !!v || 'CTFtime ID is required', v=> v>0 || 'CTFtime ID must be positive']"
                    append-icon="mdi-reload"
                    @click:append="scrapeCTFTimeEvent"
                />
              </v-col>
              <v-col>
                <v-text-field
                    v-model="localCTFTimeEvent.weight"
                    type="number"
                    label="Event weight"
                    @input="errors['weight'] = ''"
                    :error-messages="errors['weight']"
                    :rules="[validateNullableNumber]"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                    v-model="localCTFTimeEvent.ranking"
                    type="number"
                    label="Ranking"
                    @input="errors['ranking'] = ''"
                    :error-messages="errors['ranking']"
                    :rules="[validateNullableNumber]"
                />
              </v-col>
              <v-col>
                <v-text-field
                    v-model="localCTFTimeEvent.num_teams"
                    type="number"
                    label="Number of teams"
                    @input="errors['num_teams'] = ''"
                    :error-messages="errors['num_teams']"
                    :rules="[validateNullableNumber]"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                    v-model="localCTFTimeEvent.score"
                    type="number"
                    label="Score"
                    @input="errors['score'] = ''"
                    :error-messages="errors['score']"
                    :rules="[validateNullableNumber]"
                />
              </v-col>
              <v-col>
                <v-text-field
                    v-model="localCTFTimeEvent.winner_score"
                    type="number"
                    label="Winner score"
                    @input="errors['winner_score'] = ''"
                    :error-messages="errors['winner_score']"
                    :rules="[validateNullableNumber]"
                />
              </v-col>
            </v-row>
            <v-text-field
                v-model="localCTFTimeEvent.image_url"
                label="Image URL"
                @input="errors['image_url'] = ''"
                :error-messages="errors['image_url']"
                :rules="[v => !!v || 'Image URL is required', validateUrl]"
            />
            <v-row class="mb-2">
              <v-col> CTFTime rating points: {{ ctfTimePoints }}</v-col>
            </v-row>
          </div>
          <!-- Button for saving edited CTF -->
          <v-btn
              v-if="getEventId()>0"
              color="blue"
              @click="editCTF()"
              :disabled="!valid">
            Save changes
          </v-btn>
          <!-- Button for creating CTF  -->
          <v-btn
              v-else
              color="success"
              @click="createCTF()"
              :disabled="!valid ">
            Submit
          </v-btn>
          <!-- Button for cancelling -->
          <v-btn
              class="mx-4"
              @click="back">
            Cancel
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>

</template>


<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {CTFEvent} from "@/types/ctfs/CTFEvent";
import {createCTF, CTFSeries, editCTF, getCTF, getCTFNames} from "@/api/ctf/ctf";
import DateTimePicker from "@/components/DateTimePicker.vue";
import {createCTFTimeEvent, editCTFTimeEvent, getCTFTimeEvent, scrapeCTFTimeEvent} from "@/api/ctf/ctftime";
import {CTFTimeEvent} from "@/types/ctfs/CTFTimeEvent";

@Component({
  name: "CTFEditor",
  components: {
    DateTimePicker,
  },
  watch: {
    localCTFTimeEvent: {
      handler(newValue, oldValue) {
        const pc = newValue.score / newValue.winner_score;
        const ratingPoints = ((pc + 1 / newValue.ranking) * newValue.weight) / (1 / (1 + newValue.ranking / newValue.num_teams));
        (this as CTFEditor).ctfTimePoints = ratingPoints;
      },
      deep: true,
    },
  },
  mounted() {
    getCTFNames().then(res => {
      this.$data.ctfNames = res;
    });
    const t = (this as CTFEditor);
    if (t.getEventId()) {
      getCTF(t.getEventId()).then(ctf => {
        t.localCTF = ctf;
        t.start_date = ctf.start_date;
        t.end_date = ctf.end_date;
        t.lockOrganizer = true;
      });
      getCTFTimeEvent(t.getEventId()).then(ctf => {
        if (ctf) {
          t.hasCTFTimeEvent = true;
          t.localCTFTimeEvent = ctf;
        } else {
          t.hasCTFTimeEvent = false;
        }
      });
    }
  },
})
export default class CTFEditor extends Vue {
  valid = false
  lockOrganizer = false
  errors: { [key: string]: string } = {
    name: "",
    organizer: "",
    website: "",
    ctftime_id: "",
  }

  ctfNames: CTFSeries[] = []

  start_date: Date | null = null;
  end_date: Date | null = null;

  hasCTFTimeEvent = false;
  ctfTimePoints = 0

  getEventId(): number {
    return parseInt(this.$route.params.id);
  }


  $refs!: {
    form: HTMLFormElement,
  }

  private localCTF: CTFEvent = {
    event_id: -1,
    ctf_name: "",
    organizer: "",
    start_date: new Date(),
    end_date: new Date(),
    website: "",
  }

  private localCTFTimeEvent: CTFTimeEvent = {
    ctftime_id: null,
    winner_score: null,
    num_teams: null,
    score: null,
    ranking: null,
    weight: null,
    rating_points: null,
    image_url: "",
    ...this.localCTF,
  }

  setOrganizer(): void {
    const ctf = this.ctfNames.filter(ctf => ctf.name === this.localCTF.ctf_name);
    if (ctf.length > 0) {
      this.localCTF.organizer = ctf[0].organizer;
      this.lockOrganizer = true;
    } else {
      this.localCTF.organizer = "";
      this.lockOrganizer = false;
    }
  }

  validateUrl(url: string): boolean | string {
    if (/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})/.test(url)) {
      return true;
    }
    return "Invalid URL";
  }

  validateNullableNumber(value: string | null): boolean | string {
    if (value === null || value === "") {
      return true;
    }
    const parsed = parseFloat(value);
    if (isNaN(parsed)) {
      return "Invalid number";
    }
    if (parsed <= 0) {
      return "Number must be positive";
    }
    return true;
  }

  parseOrUndefined(value: string | number | null): number | undefined {
    if (typeof value == "number") return value;
    if (value === null || value === "") {
      return undefined;
    }
    return parseFloat(value);
  }

  makeCTFTimeEvent(): Partial<CTFTimeEvent> {
    return {
      ctftime_id: this.parseOrUndefined(this.localCTFTimeEvent.ctftime_id),
      winner_score: this.parseOrUndefined(this.localCTFTimeEvent.winner_score),
      num_teams: this.parseOrUndefined(this.localCTFTimeEvent.num_teams),
      score: this.parseOrUndefined(this.localCTFTimeEvent.score),
      ranking: this.parseOrUndefined(this.localCTFTimeEvent.ranking),
      weight: this.parseOrUndefined(this.localCTFTimeEvent.weight),
      image_url: this.localCTFTimeEvent.image_url,
      ...this.localCTF,
    };
  }

  scrapeCTFTimeEvent(): void {
    const id = this.localCTFTimeEvent.ctftime_id;
    if (id == null) return;
    scrapeCTFTimeEvent(id).then(response => {
      if (response.success) {
        this.localCTFTimeEvent = response.data;
        this.localCTF.ctf_name = response.data.ctf_name;
        this.localCTF.organizer = response.data.organizer;
        this.localCTF.website = response.data.website;
        this.start_date = new Date(response.data.start_date);
        this.end_date = new Date(response.data.end_date);
      } else {
        console.log(response);
      }
    });
  }

  createCTF(): void {
    if (!this.start_date || !this.end_date) return;
    this.localCTF.start_date = this.start_date;
    this.localCTF.end_date = this.end_date;
    if (this.hasCTFTimeEvent) {
      createCTFTimeEvent(this.makeCTFTimeEvent()).then((res) => {
        if (res.success) {
          this.back();
        } else if (res.field) {
          this.errors[res.field] = res.message;
        }
      });
    } else {
      createCTF(this.localCTF).then(res => {
        if (res.success) {
          this.back();
        } else if (res.field) {
          this.errors[res.field] = res.message;
        }
      });
    }
  }

  editCTF(): void {
    if (!this.start_date || !this.end_date) return;
    this.localCTF.start_date = this.start_date;
    this.localCTF.end_date = this.end_date;
    if (this.hasCTFTimeEvent) {
      editCTFTimeEvent(this.makeCTFTimeEvent()).then((res) => {
        if (res.success) {
          this.back();
        } else if (res.field) {
          this.errors[res.field] = res.message;
        }
      });
    } else {
      editCTF(this.localCTF).then(res => {
        if (res.success) {
          this.back();
        } else if (res.field) {
          this.errors[res.field] = res.message;
        }
      });
    }
  }

  back(): void {
    this.$router.replace({path: "/ctfs"});
  }

  reset(): void {
    (this.$refs.form as HTMLFormElement).reset();
  }
}
</script>
