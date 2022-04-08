<template>
  <v-card class="ma-4">
    <v-row class="pa-2 pt-4">
      <v-card-title>Contact
      </v-card-title>
      <v-spacer/>
      <v-btn-toggle
          v-model="selectedOption"
          class="mx-8">
        <v-tooltip bottom v-for="(option, index) in options" :key="option">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                @click="contactMethodChange(option)"
                text v-bind="attrs" v-on="on">
              <v-icon class="px-2">{{ optionIcons[index] }}</v-icon>
            </v-btn>
          </template>
          {{ option }}
        </v-tooltip>
      </v-btn-toggle>
    </v-row>
    <v-card-text>
      <validation-observer
          ref="observer"
          v-slot="{ invalid }"
      >
        <v-form>
          <v-text-field
              v-model="name"
              label="Name"
              :rules="[v => !!v || 'Name is required']"
          />
          <validation-provider
              v-slot="{ errors }"
              name="email"
              rules="required|email"
          >
            <v-text-field
                v-model="email"
                :error-messages="errors"
                label="Email"
                required
            ></v-text-field>
          </validation-provider>
          <v-textarea
              v-model="message"
              label="Message"
              :rules="[v => !!v || 'Message is required']"/>
          <v-btn
              color="success"
              @click="contact"
              :disabled="!name || !email || !message || invalid">
            Submit!
          </v-btn>
        </v-form>
      </validation-observer>
    </v-card-text>
  </v-card>

</template>


<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {email, required} from "vee-validate/dist/rules";
import {extend, setInteractionMode, ValidationObserver, ValidationProvider} from "vee-validate";

setInteractionMode("eager");

extend("email", {
  ...email,
  message: "Email must be valid",
});

extend("required", {
  ...required,
  message: "{_field_} can not be empty",
});

@Component({
  name: "Contact",
  components: {
    ValidationObserver,
    ValidationProvider,
  },
})
export default class Contact extends Vue {
  name = ""
  email = ""
  message = ""

  options = ["Website", "Email", "Discord", "GitHub"]
  optionIcons = ["mdi-earth", "mdi-email", "mdi-discord", "mdi-github"]
  selectedOption = 0

  contact(): void {
    console.log("Contact");
  }

  contactMethodChange(method: string): void {
    if (method == "GitHub") {
      window.open("https://github.com/junron", "_blank");
    }
  }
}
</script>
