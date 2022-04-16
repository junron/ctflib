<template>
  <div>
    <v-row>
      <v-col>
        <v-text-field
            :label="label"
            v-model="localDatetime"
            :rules="[v => !!v || label + ' is required', validDate, temporalConstraints]"
        />
      </v-col>
      <v-col cols="auto" class="ma-auto"
             @click="dialog=true">
        <v-icon>mdi-calendar-clock</v-icon>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" width="fit-content" persistent @keydown.esc="dialog=false; reset()">
      <v-card>
        <v-toolbar dark dense flat>
          <v-toolbar-title class="white--text">{{ label }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text class="pa-4">
          <v-form
              v-model="valid"
              ref="form"
          >
            <v-row>
              <v-spacer/>
              <v-col>
                <v-date-picker
                    :min="getDateTimeStrings(after)[0]"
                    :max="getDateTimeStrings(before)[0]"
                    v-model="localDateString"/>
              </v-col>
              <v-col class="ma-auto">
                <v-time-picker
                    v-model="localTimeString"
                    ampm-in-title
                    :min="localDateString===getDateTimeStrings(after)[0] ? getDateTimeStrings(after)[1]: null"
                    :max="localDateString===getDateTimeStrings(before)[0] ? getDateTimeStrings(before)[1]: null"
                />
              </v-col>
              <v-spacer/>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer/>
          <v-btn :disabled="!(localDateString && localTimeString)" color="primary" text @click="saveNew()">Confirm
          </v-btn>
          <v-btn color="grey" text @click="dialog=false; reset()">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";

@Component({
  name: "DateTimePicker",
  watch: {
    datetime: {
      immediate: true,
      handler(newDatetime: Date | null) {
        if (!newDatetime) {
          return;
        }
        const t = this as DateTimePicker;
        this.$data.localDatetime = t.dateString(newDatetime) + " " + t.timeString(newDatetime);
        const dateTimeStrings = t.getDateTimeStrings(newDatetime);
        this.$data.localDateString = dateTimeStrings[0];
        this.$data.localTimeString = dateTimeStrings[1];
      },
    },
  },
})
export default class DateTimePicker extends Vue {
  @Prop() public label!: string;
  @Prop() public datetime!: Date | null;
  @Prop() public after!: Date | null;
  @Prop() public before!: Date | null;

  private localDatetime = !this.datetime ? "" : (this.dateString(this.datetime) + " " + this.timeString(this.datetime));
  private localDateString = this.getDateTimeStrings(this.datetime)[0];
  private localTimeString = this.getDateTimeStrings(this.datetime)[1];
  private valid = false;
  private dialog = false;

  dateString(date: Date | null): string {
    if (!date) return "";
    return date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, "0") + "-"
        + date.getDate().toString().padStart(2, "0");
  }

  timeString(date: Date | null): string {
    if (!date) return "";
    return date.getHours().toString().padStart(2, "0") + ":" + date.getMinutes().toString().padStart(2, "0") + ":00";
  }

  validDate(): string | true {
    if (new Date(this.localDatetime).toString() === "Invalid Date") {
      return "Invalid date";
    }
    this.localDateString = this.getDateTimeStrings(new Date(this.localDatetime))[0];
    this.localTimeString = this.getDateTimeStrings(new Date(this.localDatetime))[1];
    return true;
  }

  temporalConstraints(): string | true {
    const date = new Date(this.localDatetime);
    if (this.before && date.getTime() > this.before.getTime()) {
      return "Date must be before " + this.before.toLocaleString();
    }
    if (this.after && date.getTime() < this.after.getTime()) {
      return "Date must be after " + this.after.toLocaleString();
    }
    return true;
  }


  saveNew(): void {
    const newDatetime = new Date(`${this.localDateString} ${this.localTimeString}`);
    this.$data.localDatetime = this.dateString(newDatetime) + " " + this.timeString(newDatetime);
    this.$emit("update:datetime", newDatetime);
    this.dialog = false;
  }

  reset(): void {
    this.localDateString = this.getDateTimeStrings(this.datetime)[0];
    this.localTimeString = this.getDateTimeStrings(this.datetime)[1];
  }


  getDateTimeStrings(date: Date | null): [string, string] {
    if (!date) {
      return ["", ""];
    }
    const dateString = date.toLocaleString("sv", {timeZoneName: "short"});
    return [dateString.substr(0, dateString.indexOf(" ")), dateString.substr(dateString.indexOf(" ") + 1, 8)];
  }

}
</script>
