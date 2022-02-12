<template>
  <v-card class="ma-4">
    <v-card-title>Login</v-card-title>
    <v-card-text>
      <v-form>
        <v-text-field
            v-model="name"
            label="Name"
            :rules="[v => !!v || 'Name is required']"
        />
        <v-text-field
            v-model="password"
            label="Password"
            :rules="[v => !!v || 'Password is required']"
        />
        <v-btn
            color="success"
            @click="login"
            :disabled="!name || !password">Login!</v-btn>
      </v-form>
    </v-card-text>
  </v-card>

</template>


<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  name: "Login",
})
export default class Login extends Vue {
  name = ""
  password = ""

  login(): void {
    this.$store.dispatch("login", this.name);
    this.$router.push("/");
  }
}
</script>
