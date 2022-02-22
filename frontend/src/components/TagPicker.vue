<template>
  <v-combobox
      label="Tag"
      v-model="localTags"
      @input="$emit('update:tags', localTags)"
      multiple
      small-chips
  />
</template>


<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";

@Component({
  name: "TagPicker",
})
export default class TagPicker extends Vue {
  @Prop() tags!: string[];

  localTags: string[] = this.tags;
}
</script>
