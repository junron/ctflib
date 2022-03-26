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
            ref="form"
            v-model="valid"
        >
          <v-row class="mx-1">
            <v-text-field
                class="mr-8 my-4"
                v-model="localResource.title"
                label="Title"
                @input="errors['title'] = ''; success = false"
                :error-messages="errors['title']"
                :rules="[v => !!v || 'Title is required']"
            />
            <v-switch
                v-model="localResource.is_private"
                label="Private"
            />
          </v-row>
          <MarkdownEditor
              max-width="500px"
              :content.sync="localResource.body"
              label="Your post"
              :error="errors['body']"
          />
          <CategoryPicker
              :category.sync="localResource.post_category"/>
          <TagPicker
              :category="localResource.post_category"
              :tags.sync="localResource.tags"/>
          <div v-if="success" class="green--text mb-4">
            <v-icon>mdi-check</v-icon>
            Your post has been created!
            <v-btn class="ml-4"
                   color="success"
                   @click="reset()">
              Post another!
            </v-btn>
          </div>
          <!--          Button for creating post  -->
          <v-btn v-else-if="!resource"
                 color="success"
                 @click="createResource()"
                 :disabled="!valid || !localResource.post_category.length || success">
            Submit
          </v-btn>
          <!--    Button for saving exited post -->
          <v-btn v-else
                 color="blue"
                 @click="editResource()"
                 :disabled="!valid || !localResource.post_category.length || success">
            Save changes
          </v-btn>
          <!--    Button for saving exited post -->
          <v-btn
              class="mx-4"
              @click="back"
              v-if="!success">
            Cancel
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
import {createResource, editResource} from "@/api/posts/resource";
import {Prop} from "vue-property-decorator";
import {Resource} from "@/types/posts/resource";

@Component({
  name: "NewPost",
  components: {TagPicker, CategoryPicker, MarkdownEditor},
})
export default class NewPost extends Vue {
  valid = false
  success = false
  errors = {}

  // Passed in as a string because vue router
  @Prop() public resource!: string | null;

  private localResource:  Resource = this.$props.resource ? JSON.parse(this.$props.resource) : {
    title: "",
    body: "",
    post_category: "",
    tags: [],
    is_private: true,
  }

  createResource(): void {
    createResource(this.localResource).then(response => {
      this.success = response.success;
    });
  }

  editResource(): void {
    editResource(this.localResource).then(response => {
      this.success = response.success;
      this.back();
    });
  }

  back(): void {
    this.$router.replace({name: "Home"});
  }

  reset(): void {
    (this.$refs.form as HTMLFormElement).reset();
  }
}
</script>
