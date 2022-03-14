<template>
  <v-combobox
      label="Tag"
      v-model="localTags"
      :items="suggestedTags"
      @input="$emit('update:tags', localTags)"
      multiple
      small-chips
  />
</template>


<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import {getTags} from "@/api/tags";

@Component({
  name: "TagPicker",
  watch: {
    category: function (val: string|null) {
      if(val){
        getTags(val).then((tags) => {
          this.$data.suggestedTags = tags;
        });
      }
    },
  },
})
export default class TagPicker extends Vue {
  @Prop() tags!: string[];
  @Prop() category!: string | null;

  localTags: string[] = this.tags;
  suggestedTags: string[] = [];
}
</script>
