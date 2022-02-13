<template>
  <v-card class="ma-4">
    <v-card-title>Login</v-card-title>
    <v-card-text>
      <v-form>
        <v-text-field
            v-model="name"
            label="Name"
            @input="nameError = ''"
            :error-messages="nameError"
            :rules="[v => !!v || 'Name is required']"
        />
        <v-text-field
            v-model="password"
            label="Password"
            @input="passwordError = ''"
            :error-messages="passwordError"
            :rules="[v => !!v || 'Password is required']"
        />
        <v-btn
            color="success"
            @click="login"
            :disabled="!name || !password">Login!
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>

</template>


<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {login} from "@/api/auth";

@Component({
  name: "Login",
})
export default class Login extends Vue {
  name = ""
  nameError = ""
  password = ""
  passwordError = ""

  login(): void {
    login(this.name, this.password).then((response) => {
      if (response.success) {
        this.$store.dispatch("login", response.data.username);
        this.$router.push("/");
      } else {
        if (response.message.includes("User")) {
          this.nameError = response.message;
        } else {
          this.passwordError = response.message;
        }
      }
    });
  }
}
</script>
