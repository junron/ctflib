<template>
  <v-dialog v-model="dialog" :max-width="maxWidth" persistent @keydown.esc="cancel">
    <v-card>
      <v-toolbar dark dense flat>
        <v-toolbar-title class="white--text">Writeup for '{{ challengeTitle }}'</v-toolbar-title>
      </v-toolbar>
      <v-card-text class="pa-4">
        <v-form
            v-model="valid"
            ref="form"
        >
          <v-text-field
              v-model="url"
              label="Writeup URL"
              :rules="[v=>!!v || 'Writeup URL is required', validateUrl]"
          />
        </v-form>
      </v-card-text>
      <v-card-actions class="pt-0">
        <v-spacer/>
        <v-btn :disabled="!valid" color="primary" text @click="agree">Submit</v-btn>
        <v-btn color="grey" text @click="cancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";

@Component({
  name: "ExternalWriteupInput",
})
export default class ExternalWriteupInput extends Vue {
  @Prop() public maxWidth!: string;

  private dialog = false;
  private challengeTitle: string | null = null;

  private url: string | null = null;
  private valid = false;

  private resolve: ((value: string|null) => void) | null = null;

  $refs!: {
    form: HTMLFormElement;
  }

  validateUrl(url: string): boolean | string {
    if (/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})/.test(url)) {
      return true;
    }
    return "Invalid URL";
  }

  open(challengeTitle: string): Promise<string|null> {
    this.dialog = true;
    this.challengeTitle = challengeTitle;
    this.url = null;
    if(this.$refs.form){
      this.$refs.form.reset();
    }
    return new Promise<string|null>((resolve) => {
      this.resolve = resolve;
    });
  }

  agree(): void {
    this.resolve && this.resolve(this.url);
    this.dialog = false;
  }

  cancel(): void {
    this.resolve && this.resolve(null);
    this.dialog = false;
  }

}
</script>
