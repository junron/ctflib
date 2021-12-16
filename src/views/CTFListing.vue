<template>
  <v-container>
    <v-row class="my-4 px-3"><span class="text-h4">
      NUSHmallows is ranked {{ formatRank(localRank) }} in Singapore, and {{ formatRank(globalRank) }} in the world.
    </span></v-row>

    <v-row>
      <v-col
          cols="12"
          sm="6"
          lg="3"
          xl="2"
          v-for="(event,index) in events" :key="event.id">
        <event-card class="fill-height"
                    :name="event.name"
                    :rank="event.place"
                    :rating="event.ratingPoints"
                    :image="images[index]"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {getEventInfo, getEvents, getRank} from "@/api/ctftime";
import EventCard from "@/components/EventCard.vue";
import formatRank from "@/util";
import {CTFEvent} from "@/types/ctftime/CTFEvent";

@Component({
  name: "CtfListing",
  components: {
    EventCard,
  },
  mounted() {
    getRank().then(response => {
      this.$data.globalRank = response.rank;
      this.$data.localRank = response.localRank;
    });
    getEvents().then(response => {
      const currentYear = new Date().getFullYear().toString();
      this.$data.events = response.sort((a: CTFEvent, b: CTFEvent) => {
        return -(a.ratingPoints - b.ratingPoints);
      }).slice(0, 10).map(event => {
        return {
          id: event.id,
          name: event.name.replaceAll(currentYear, ""),
          place: event.place,
          ratingPoints: event.ratingPoints,
        };
      });
      Promise.all(this.$data.events.map((event: CTFEvent) => getEventInfo(event.id))).then(images => {
        this.$data.images = images.map((image: any) => image.logo);
      });
    });
  },
})
export default class CTFListing extends Vue {
  private globalRank = 0;
  private localRank = 0;
  private events: CTFEvent[] = [];
  private images: string[] = [];

  private formatRank = formatRank
}
</script>

