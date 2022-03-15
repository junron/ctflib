<template>
  <v-card outlined class="d-flex flex-column">
    <v-card-title class="text-h6">
      <a :href="ctfEvent.website" class="title-link" target="_blank">
        {{ ctfEvent.ctf_name }} {{ ctfEvent.start_date.getFullYear() }}
      </a>
    </v-card-title>
    <v-card-subtitle>
      By {{ ctfEvent.organizer }}
    </v-card-subtitle>
    <v-card-text>
      <v-row>
        <v-col>
          <v-icon>mdi-calendar</v-icon>
          {{ ctfEvent.start_date.toLocaleDateString() }} - {{ ctfEvent.end_date.toLocaleDateString() }}
        </v-col>
      </v-row>
      <v-row>
        <slot name="default"/>
      </v-row>
    </v-card-text>
    <v-spacer/>
    <v-divider/>
    <v-card-actions class="mx-3">
      <slot name="actions">
        <v-col align="center"
               justify="center">
          <!--  TODO -->
          <a class="title-link"
             href="https://github.com" target="_blank">
            Challenges
          </a>
        </v-col>
      </slot>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import {CTFEvent} from "@/types/ctfs/CTFEvent";

@Component({
  name: "EventCard",
})
export default class CTFEventCard extends Vue {
  @Prop() ctfEvent!: CTFEvent;
}
</script>

<!-- TODO: move to global scss file -->

<style lang="scss">
.v-application a.title-link, a.title-link:visited {
  color: unset;
  text-decoration: none;
}

a.title-link:hover {
  color: unset;
  text-decoration: underline;
}
</style>
