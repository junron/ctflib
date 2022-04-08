<template>
  <v-container fluid>
    <v-card class="my-4 align-center align-content-center mx-auto" max-width="500px">
      <v-row justify="center">
        <v-img src="/flag.svg" max-height="250" max-width="150"/>
      </v-row>
      <v-row justify="center">
        <v-card-title>
          CTFlib
        </v-card-title>
      </v-row>

    </v-card>

    <v-card
        class="my-4 align-center mx-auto" max-width="500px">
      <v-spacer/>
      <v-card-title>
        <v-tabs
            @change="reset"
            fixed-tabs
            v-model="tab"
        >
          <v-tabs-slider/>
          <v-tab key="login"> Login</v-tab>
          <v-tab key="register"> Register</v-tab>
        </v-tabs>
      </v-card-title>
      <v-card-text>
        <v-form
            v-model="valid"
        >
          <v-text-field
              v-model="name"
              label="Name"
              @input="nameError = ''"
              :error-messages="nameError"
              :rules="[v => !!v || 'Name is required']"
          />
          <v-text-field
              type="password"
              v-model="password"
              label="Password"
              @input="passwordError = ''"
              :error-messages="passwordError"
              :rules="[v => !!v || 'Password is required']"
          />
          <v-text-field
              v-if="tab"
              v-model="email"
              label="Email"
              :error-messages="emailError"
              :rules="[v => !!v || 'Email is required', v=> /^\S+@\S+$/.test(v) || 'Email is invalid']"
          />
          <v-text-field
              v-if="tab"
              v-model="githubUsername"
              label="GitHub username"
              @input="githubUsernameError = ''"
              :error-messages="githubUsernameError"
              :rules="[v => !!v || 'GitHub username is required']"
          />
          <v-text-field
              v-if="tab"
              type="password"
              v-model="secret"
              label="Registration flag"
              @input="secretError = ''"
              :error-messages="secretError"
              :rules="[v => !!v || 'Registration flag is required']"
          />
          <v-btn
              color="success"
              @click="()=>(tab ? register : login)()"
              :disabled="!valid">
            {{ tab ? 'Register' : 'Login' }}!
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>

</template>


<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {login, register} from "@/api/auth";

@Component({
  name: "Login",
})
export default class Login extends Vue {
  valid = false
  name = ""
  nameError = ""
  password = ""
  passwordError = ""
  email = ""
  emailError = ""
  githubUsername = ""
  githubUsernameError = ""
  secret = ""
  secretError = ""
  tab = null

  login(): void {
    login(this.name, this.password).then((response) => {
      if (response.success) {
        this.$store.dispatch("login", response.data.username);
        this.$router.push("/");
      } else {
        if (response.field == "name") {
          this.nameError = response.message;
        } else {
          this.passwordError = response.message;
        }
      }
    });
  }

  register(): void {
    register(this.name, this.password, this.email, this.githubUsername, this.secret).then(response => {
      if (response.success) {
        login(this.name, this.password).then((response) => {
          if (response.success) {
            this.$store.dispatch("login", response.data.username);
            this.$router.push("/");
          }
        });
      } else {
        if (response.field == "secret") {
          this.secretError = response.message;
        }
        if (response.field == "name") {
          this.nameError = response.message;
        }
      }
    });
  }

  reset(): void {
    this.name = "";
    this.password = "";
    this.email = "";
    this.githubUsername = "";
    this.secretError = "";
    this.nameError = "";
    this.passwordError = "";
    this.emailError = "";
    this.githubUsernameError = "";
    this.secretError = "";

  }
}
</script>
