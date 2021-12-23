<template>
  <v-card outlined>
    <v-card-title class="text-h5">{{ name }}
      <v-spacer/>
      <v-icon :class="color">mdi-{{ icon }}</v-icon>
    </v-card-title>
    <v-list three-line>
      <template v-for="(post, index) in posts">
        <v-divider
            :key="index"
        ></v-divider>
        <v-list-item :key="post.title">
          <v-list-item-content>
            <v-list-item-title class="py-4">
              <a :href="post.url" class="post-link"> {{ post.title }}</a>
            </v-list-item-title>
            <v-list-item-subtitle>{{ post.description }}</v-list-item-subtitle>
            <v-chip-group column>
              <v-chip
                  label
                  v-for="tag in post.tags" :key="tag" :color="color">{{ tag }}
              </v-chip>
            </v-chip-group>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import {Post} from "@/types/post";

@Component({
  name: "CategoryCard",
})
export default class CategoryCard extends Vue {
  @Prop() name!: string
  @Prop() color!: string
  @Prop() icon!: string
  @Prop() posts!: Post[]
}
</script>


<style lang="scss">
a.post-link, a.post-link:visited {
  color: unset;
  text-decoration: none;
}

a.post-link:hover {
  color: unset;
  text-decoration: underline;
}
</style>
