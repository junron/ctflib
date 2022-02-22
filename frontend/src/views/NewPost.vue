<template>
  <v-container fluid>
    <v-card class="my-4 align-center align-content-center mx-auto" max-width="500px">
      <v-row justify="center">
        <v-card-title>
          What did you find out?
        </v-card-title>
      </v-row>
    </v-card>

    <v-card
        class="my-4 align-center mx-auto" max-width="500px">
      <v-card-text>
        <v-form
            v-model="valid"
        >
          <v-row class="mx-1">
            <v-text-field
                class="mr-8"
                v-model="title"
                label="Title"
                @input="errors['title'] = ''; success = false"
                :error-messages="errors['title']"
                :rules="[v => !!v || 'Title is required']"
            />
            <v-switch
                v-model="is_private"
                label="Private"
            />
          </v-row>
          <MarkdownEditor
              :content.sync="body"
              label="Your post"
              :error="errors['body']"
          />
          <CategoryPicker
              :category.sync="category"/>
          <TagPicker
              :tags.sync="tags"/>
          <div v-if="success" class="green--text mb-4">
            <v-icon>mdi-check</v-icon>
            Your post has been created!
          </div>
          <v-btn
              color="success"
              @click="createResource()"
              :disabled="!valid || !category.length || success">
            Submit
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>

</template>


<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import MarkdownEditor from "@/components/MarkdownEditor.vue";
import CategoryPicker from "@/components/CategoryPicker.vue";
import TagPicker from "@/components/TagPicker.vue";
import {createResource} from "@/api/posts/resource";

@Component({
  name: "NewPost",
  components: {TagPicker, CategoryPicker, MarkdownEditor},
})
export default class NewPost extends Vue {
  valid = false
  title = ""
  category = ""
  body = ""
  tags = []
  is_private = false
  success = false
  errors = {}

  createResource(): void {
    createResource({
      title: this.title,
      body: this.body,
      category: this.category,
      tags: this.tags,
      is_private: this.is_private,
    }).then(response => {
      this.success = response.success;
    });
  }
}
</script>
