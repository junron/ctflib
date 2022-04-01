<template>
  <v-container fluid>
    <v-card
        class="my-4 align-center mx-auto" max-width="500px">
      <v-card-text>
        <v-form
            ref="form"
            v-model="valid"
        >
          <v-row>
            <v-col>
              <v-text-field
                  v-model="localChallenge.name"
                  label="Challenge name"
                  @input="errors['title'] = ''"
                  :error-messages="errors['title']"
                  :rules="[v => !!v || 'Challenge name is required']"
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="localChallenge.points"
                  type="number"
                  label="Points"
                  @input="errors['points'] = ''"
                  :error-messages="errors['points']"
                  :rules="[v => v>0 || 'Points must be positive']"
              />
            </v-col>
          </v-row>
          <MarkdownEditor
              max-width="500px"
              :content.sync="localChallenge.description"
              label="Description"
              :error="errors['body']"
          />
          <CategoryPicker
              :category.sync="localChallenge.category_name"/>
          <TagPicker
              :category="localChallenge.category_name"
              :tags.sync="localChallenge.tags"/>
          <div @drop="onDrop"
               @dragover.prevent>
            <v-file-input
                v-model="files"
                counter
                multiple
                show-size
                label="Upload files"/>
          </div>
          <!--          Button for creating challenge  -->
          <v-btn v-if="!challenge"
                 color="success"
                 @click="createChallenge()"
                 :disabled="!valid || !localChallenge.category_name.length">
            Submit
          </v-btn>
          <!--    Button for saving edited challenge -->
          <v-btn v-else
                 color="blue"
                 @click="editChallenge()"
                 :disabled="!valid || !localChallenge.category_name.length">
            Save changes
          </v-btn>
          <v-btn
              class="mx-4"
              @click="back">
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
import {Prop} from "vue-property-decorator";
import {Challenge} from "@/types/challenges/challenge";
import {createChallenge} from "@/api/ctf/ctf";

@Component({
  name: "NewChallenge",
  components: {TagPicker, CategoryPicker, MarkdownEditor},
})
export default class NewChallenge extends Vue {
  valid = false
  files: File[] = []
  errors = {}

  getCTFId(): number {
    return parseInt(this.$route.params.eventID);
  }

  // Passed in as a string because vue router
  @Prop() public challenge!: string | null;

  private localChallenge: Challenge = this.$props.resource ? JSON.parse(this.$props.challenge) : {
    name: "",
    description: "",
    category_name: "",
    points: null,
    tags: [],
    files: [],
  }

  createChallenge(): void {
    createChallenge(this.getCTFId(), this.localChallenge, this.files).then(response => {
      if (response.success) {
        this.back();
      }
    });
  }

  onDrop(event: DragEvent): void {
    const files = event.dataTransfer?.files;
    if (!files || files.length != 1) return;
    for (let i = 0, file = files[i]; i < files.length; i++) {
      this.files.push(file);
    }
    event.preventDefault();
  }

  editChallenge(): void {
    // TODO
  }

  back(): void {
    this.$router.replace({path: "/ctfs/" + this.getCTFId()});
  }

  reset(): void {
    (this.$refs.form as HTMLFormElement).reset();
  }
}
</script>
