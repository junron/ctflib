<template>
  <c-t-f-event-card
      :ctf-event="ctftimeEvent">
    <template v-slot:default>
      <v-row
          class="my-6"
          align="center"
          justify="center">
        <v-col class="mx-2">
          <v-row
              class="font-weight-bold"
              style="font-size: 1.5em"
              align="center"
              justify="center">
            {{ formatRank(ctftimeEvent.ranking) }}
          </v-row>
          <v-row>
            <v-divider class="my-1" style="border-bottom-width: 1px"/>
          </v-row>
          <v-row align="center"
                 justify="center">
            {{ ctftimeEvent.num_teams }} teams
          </v-row>
        </v-col>
        <v-col class="mx-2">
          <v-row
              class="font-weight-bold"
              style="font-size: 1.5em"
              align="center"
              justify="center">
            {{ ctftimeEvent.rating_points.toFixed(2) }}
          </v-row>
          <v-row>
            <v-divider class="my-1" style="border-bottom-width: 1px"/>
          </v-row>
          <v-row align="center"
                 justify="center">
            CTFTime points
          </v-row>
        </v-col>
      </v-row>
      <v-img
          class="my-4"
          contain :src="ctftimeEvent.image_url"/>
    </template>
    <template v-slot:actions>
      <v-row class="py-1">
        <v-col align="center"
               justify="center">
          <a class="title-link"
             :href="`https://ctftime.org/event/${ctftimeEvent.ctftime_id}`" target="_blank">
            CTFTime <sup>
            <v-icon style="font-size: 0.8em">mdi-open-in-new</v-icon>
          </sup>
          </a>
        </v-col>
        <v-divider vertical/>
        <v-col align="center"
               justify="center">
          <a class="title-link"
             :href="'#/ctfs/'+ctftimeEvent.event_id">
            Challenges
          </a>
        </v-col>
      </v-row>
    </template>
  </c-t-f-event-card>
</template>

<script lang="ts">
import formatRank from "@/util";
import Vue from "vue";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import CTFEventCard from "@/components/CTFEventCard.vue";
import {CTFTimeEvent} from "@/types/ctfs/CTFTimeEvent";

@Component({
  name: "CTFTimeEventCard",
  components: {CTFEventCard},
})
export default class CTFTimeEventCard extends Vue {
  @Prop() ctftimeEvent!: CTFTimeEvent

  private formatRank = formatRank
}
</script>
