<template>
  <v-card outlined>
    <v-card-title class="text-h5">{{ name }}
      <v-spacer/>
      <v-icon :class="color">mdi-{{ icon }}</v-icon>
    </v-card-title>
    <v-card-text>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";

@Component({
  name: "CategoryCard",
})
export default class CategoryCard extends Vue {
  @Prop() name!: string
  @Prop() color!: string
  @Prop() icon!: string
}
</script>
