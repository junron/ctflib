<template>
  <v-card outlined>
    <v-card-title class="text-h5">{{ name }}
      <v-spacer/>
      <v-icon :class="color">mdi-{{ icon }}</v-icon>
    </v-card-title>
    <v-list>
      <v-row class="px-3">
        <v-col v-for="(post, index) in posts" :key="index"
               cols="12"
               :lg="(important&&posts.length>1) ? 6 : 12"
               class="pa-0">
          <v-divider :key="index"/>
          <v-list-item :key="post.title">
            <v-list-item-content>
              <v-list-item-title class="py-2">
                <v-row>
                  <v-col v-if="post.is_private" cols="1" class="my-auto">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small color="yellow accent-4" v-bind="attrs"
                                v-on="on">mdi-shield-lock
                        </v-icon>
                      </template>
                      <span>Private</span>
                    </v-tooltip>

                  </v-col>
                  <v-col class="my-auto text-wrap" :cols="loggedIn? (post.is_private?8:9): 'auto'">
                    {{ post.title }}
                  </v-col>
                  <v-col align="end" v-if="loggedIn" class="mx-auto" cols="3">
                    <v-btn icon small
                           @click="editResource(post)"
                    >
                      <v-icon color="blue">mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon small
                           @click="deleteResource(post)"
                    >
                      <v-icon color="red">mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-list-item-title>
              <v-list-item-subtitle class="text-wrap">
                <MarkdownRenderer :content="post.body" max-width="100%"/>
              </v-list-item-subtitle>
              <v-chip-group column>
                <v-chip
                    label
                    v-for="tag in post.tags" :key="tag" :color="color">{{ tag }}
                </v-chip>
              </v-chip-group>
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </v-row>
    </v-list>
    <confirmation
        ref="confirmation"
        :max-width="'500px'"
    />
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import {Resource} from "@/types/posts/resource";
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";
import {deleteResource} from "@/api/posts/resource";
import Confirmation from "@/components/Confirmation.vue";
import {mapGetters} from "vuex";

@Component({
  name: "CategoryCard",
  components: {Confirmation, MarkdownRenderer},
  computed: mapGetters(["loggedIn"]),
})
export default class CategoryCard extends Vue {
  @Prop() name!: string
  @Prop() color!: string
  @Prop() icon!: string
  @Prop() important!: boolean
  @Prop() posts!: Resource[]

  private loggedIn!: boolean

  $refs!: {
    confirmation: Confirmation
  }

  deleteResource(post: Resource): void {
    this.$refs.confirmation.open("Delete resource",
        `Are you sure you want to delete "${post.title}"?`,
        "red").then((confirmed) => {
      if (confirmed) {
        deleteResource(post.post_id).then(() => {
          this.$emit("reload");
        });
      }
    });
  }

  editResource(post: Resource): void {
    this.$router.push({name: "Edit Post", params: {resource: JSON.stringify(post)}});
  }
}
</script>
