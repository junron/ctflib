<template>
  <v-dialog v-model="dialog" :max-width="maxWidth" persistent @keydown.esc="cancel" >
    <v-card>
      <v-toolbar dark  dense flat>
        <v-toolbar-title class="white--text">{{ title }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text v-show="!!message" class="pa-4">{{ message }}</v-card-text>
      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="agree">Yes</v-btn>
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
  name: "Confirmation",
})
export default class Confirmation extends Vue {
  @Prop() public maxWidth!: string;

  private dialog = false;
  private title: string | null = null;
  private message: string | null = null;
  private color: string | null = null;

  private resolve: ((value: boolean) => void) | null = null;

  open(title: string, message: string, color: string): Promise<boolean> {
    this.dialog = true;
    this.title = title;
    this.message = message;
    this.color = color;
    return new Promise<boolean>((resolve) => {
      this.resolve = resolve;
    });
  }

  agree(): void {
    this.resolve && this.resolve(true);
    this.dialog = false;
  }

  cancel(): void {
    this.resolve && this.resolve(false);
    this.dialog = false;
  }

}
</script>
