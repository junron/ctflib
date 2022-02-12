<template>
  <v-card outlined>
    <v-card-title class="text-h6">{{ name }}
      <v-spacer/>
    </v-card-title>
    <v-card-text>
      <v-img contain :src="image"/>
      Rank: {{ formatRank(rank) }}<br>
      Rating points: {{ rating }}<br>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import formatRank from "@/util";
import Vue from "vue";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";

@Component({
  name: "EventCard",
})
export default class EventCard extends Vue {
  @Prop() name!: string
  @Prop() image!: string
  @Prop() rank!: number
  @Prop() rating!: number

  private formatRank = formatRank
}
</script>
