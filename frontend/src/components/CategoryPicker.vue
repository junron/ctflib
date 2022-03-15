<template>
  <v-select
      :items="[...categories].sort((a,b)=>(a.is_major === b.is_major) ? a.name.localeCompare(b.name) : (a.is_major ? -1 : 1))"
      item-text="name"
      item-value="name"
      v-model="localCategory"
      @input="()=>$emit('update:category', localCategory)"
      label="Category"
  >
    <template v-slot:item="{item}">
      <v-list-item-icon>
        <v-icon :class="effectiveColor(item)">mdi-{{ item.icon }}</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title :class="effectiveColor(item)">
          {{ item.name }}
        </v-list-item-title>
      </v-list-item-content>
    </template>
  </v-select>
</template>


<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {mapGetters} from "vuex";
import {Category} from "@/types/category";
import {effectiveColor} from "@/util";
import {Prop} from "vue-property-decorator";

@Component({
  name: "CategoryPicker",
  computed: mapGetters(["categories"]),
  watch: {
    category: {
      immediate: true,
      handler(newCategory: string) {
        this.$data.localCategory = newCategory;
      },
    },
  },
})
export default class CategoryPicker extends Vue {
  public categories!: Category[]
  @Prop() public category!: string

  localCategory = this.category;

  effectiveColor(category: Category): string {
    return effectiveColor(category, this.$vuetify.theme.dark);
  }
}
</script>
