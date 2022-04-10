<template>
  <v-container>
    <v-row class="my-4">
      <v-col>
        <span class="text-h4">
          NUSHmallows participates in a variety of CTF events.
        </span>
      </v-col>
      <v-col v-if="loggedIn" cols="auto">
        <v-btn
            color="primary"
            dark
            href="/#/ctfs/new"
        >
          Add new CTF event
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="my-4 pt-6 px-3"><span class="text-h5">
      CTFTime events
    </span></v-row>

    <v-row>
      <v-col
          cols="12"
          sm="6"
          lg="3"
          xl="2"
          v-for="(event) in ctfTimeEvents" :key="event.event_id">
        <c-t-f-time-event-card class="fill-height" :ctftime-event="event"/>
      </v-col>
    </v-row>

    <v-row class="my-4 pt-6 px-3"><span class="text-h5">
      Other events
    </span></v-row>

    <v-row>
      <v-col
          cols="12"
          sm="6"
          lg="3"
          xl="2"
          v-for="(event) in ctfEvents" :key="event.event_id">
        <c-t-f-event-card class="fill-height" :ctf-event="event"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {CTFTimeEvent} from "@/types/ctfs/CTFTimeEvent";
import {CTFEvent} from "@/types/ctfs/CTFEvent";
import {getCTFs} from "@/api/ctf/ctf";
import CTFTimeEventCard from "@/components/CTFTimeEventCard.vue";
import CTFEventCard from "@/components/CTFEventCard.vue";
import {getCTFTimeEvents} from "@/api/ctf/ctftime";
import {mapGetters} from "vuex";

@Component({
  name: "CtfListing",
  components: {
    CTFTimeEventCard,
    CTFEventCard,
  },
  computed: mapGetters(["loggedIn"]),
  mounted() {
    getCTFTimeEvents().then(events => {
      this.$data.ctfTimeEvents = events.sort((a: CTFTimeEvent, b: CTFTimeEvent) => {
        const ratingA = a.rating_points ?? 0;
        const ratingB = b.rating_points ?? 0;
        return ratingB - ratingA;
      });
    });
    getCTFs().then(ctfs => {
      this.$data.ctfEvents = ctfs;
    });
  },
})
export default class CTFListing extends Vue {
  private ctfTimeEvents: CTFTimeEvent[] = [];
  private ctfEvents: CTFEvent[] = [];
  private loggedIn!: boolean;
}
</script>

