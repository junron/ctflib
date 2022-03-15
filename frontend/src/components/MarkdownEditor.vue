<template>
  <v-container>
    <v-row>
      <v-tabs
          v-model="tab"
      >
        <v-tabs-slider/>
        <v-tab key="write">Write</v-tab>
        <v-tab key="preview">Preview</v-tab>
      </v-tabs>
    </v-row>
    <v-row class="my-8">
      <v-textarea
          v-if="tab === 0"
          v-model="localContent"
          :label="label"
          @input="onInput"
          :error-messages="localError"
          :rules="[v => !!v || label + ' is required']"
      />
      <MarkdownRenderer
          v-else
          :content="localContent"/>
    </v-row>
  </v-container>

</template>


<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";

@Component({
  name: "MarkdownEditor",
  components: {MarkdownRenderer},
  watch: {
    content: function (val: string) {
      this.$data.localContent = val;
    },
  },
})
export default class MarkdownEditor extends Vue {
  @Prop() public content!: string;
  @Prop() public label!: string;
  @Prop() public error!: string | null;

  tab = null;

  localContent = this.content;
  localError = this.error ?? null;

  onInput(): void {
    this.localError = "";
    this.$emit("update:content", this.localContent);
  }
}
</script>
