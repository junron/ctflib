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
               :lg="important ? 6 : 12"
               class="pa-0">
          <v-divider :key="index"/>
          <v-list-item :key="post.title">
            <v-list-item-content>
              <v-list-item-title class="py-2">
                {{ post.title }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-wrap">
                <MarkdownRenderer :content="post.body"/>
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
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import {Resource} from "@/types/posts/resource";
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";

@Component({
  name: "CategoryCard",
  components: {MarkdownRenderer},
})
export default class CategoryCard extends Vue {
  @Prop() name!: string
  @Prop() color!: string
  @Prop() icon!: string
  @Prop() important!: boolean
  @Prop() posts!: Resource[]
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
