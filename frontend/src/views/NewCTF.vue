<template>
  <v-container fluid>
    <v-card
        class="my-4 align-center mx-auto" max-width="500px">
      <v-card-text>
        <v-form
            ref="form"
            v-model="valid"
        >
          <v-combobox
              v-model="localCTF.ctf_name"
              :items="ctfNames.map(ctf => ctf.name)"
              label="CTF name"
              @input="errors['title'] = ''; setOrganizer()"
              :error-messages="errors['title']"
              :rules="[v => !!v || 'CTF name is required']"
          />
          <v-text-field
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
          <!-- Button for creating CTF  -->
          <v-btn color="success"
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
import {createCTF, CTFSeries, getCTFNames} from "@/api/ctf/ctf";
import DateTimePicker from "@/components/DateTimePicker.vue";

@Component({
  name: "NewCTF",
  components: {
    DateTimePicker,
  },
  mounted() {
    getCTFNames().then(res => {
      this.$data.ctfNames = res;
    });
  },
})
export default class NewCTF extends Vue {
  valid = false
  errors = {}

  ctfNames: CTFSeries[] = []

  start_date: Date | null = null;
  end_date: Date | null = null;

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

  setOrganizer(): void {
    const ctf = this.ctfNames.filter(ctf => ctf.name === this.localCTF.ctf_name);
    if (ctf.length > 0) {
      this.localCTF.organizer = ctf[0].organizer;
    } else {
      this.localCTF.organizer = "";
    }
  }

  validateUrl(url: string): boolean | string {
    if (/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})/.test(url)) {
      return true;
    }
    return "Invalid URL";
  }

  createCTF(): void {
    if (!this.start_date || !this.end_date) return;
    this.localCTF.start_date = this.start_date;
    this.localCTF.end_date = this.end_date;
    createCTF(this.localCTF).then(_ => {
      this.back();
    });
  }

  back(): void {
    this.$router.replace({path: "/ctfs"});
  }

  reset(): void {
    (this.$refs.form as HTMLFormElement).reset();
  }
}
</script>
