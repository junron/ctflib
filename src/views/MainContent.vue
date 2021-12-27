<template>
  <v-container>
    <v-row class="my-4 px-3"><span class="text-h5">Hello, {{ name }}!</span></v-row>
    <v-row class="my-8 px-3">
      <v-autocomplete
          :height="($vuetify.breakpoint.smAndDown)?'':'100px'"
          :class="['search-field', ($vuetify.breakpoint.smAndDown) ? 'text-h5' : 'text-h4']"
          filled
          outlined
          label="What do you want to know?"
          :items="searchItems"
          :filter="filterItems"
          no-data-text="No posts found :("
      >
        <template v-slot:item="{ item}">
          <v-list-item-icon>
            <v-icon
                :class="effectiveColor(item.category)"
            >mdi-{{ item.category.icon }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content
              @click="()=>openPage(item.url)"
          >
            <v-list-item-title>{{ item.text }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.description }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-spacer/>
          <v-chip-group>
            <v-chip v-for="tag in item.tags" :key="tag" :color="effectiveColor(item.category)">
              {{ tag }}
            </v-chip>
          </v-chip-group>
        </template>
      </v-autocomplete>
    </v-row>
    <!-- Important categories   -->
    <v-row>
      <v-col
          cols="12"
          sm="6"
          v-for="category in categories.slice(0,2)" :key="category.name">
        <v-row>
          <v-col>
            <category-card
                :name="category.name"
                :icon="category.icon"
                :color="effectiveColor(category)"
                :posts="category.posts"
                :important="true"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <!--    Not important categories -->
    <v-row>
      <v-col
          cols="12"
          sm="6"
          lg="4"
          xl="3"
          v-for="category in categories.slice(2,10)" :key="category.name">
        <category-card
            :name="category.name"
            :icon="category.icon"
            :color="effectiveColor(category)"
            :posts="category.posts"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {Prop} from "vue-property-decorator";
import Component from "vue-class-component";
import CategoryCard from "@/components/CategoryCard.vue";

@Component({
  name: "MainContent",
  components: {
    CategoryCard,
  },
})
export default class MainContent extends Vue {
  @Prop() private name!: string;
  private categories = [{
    name: "Pwn",
    icon: "matrix",
    color: "amber--text text--darken-4",
    darkColor: "amber--text",
    posts: [{
      title: "Baby heap",
      url: "https://github.com/junron/writeups/blob/master/2021/backdoor-ctf/babyheap.md",
      description: "UAF via integer overflow",
      tags: ["heap", "uaf", "backdoor-ctf"],
    }, {
      title: "Malloc",
      url: "https://github.com/junron/writeups/blob/master/2021/sieberrsec/malloc.md",
      description: "Malloc returning NULL leads to arbitrary write",
      tags: ["malloc", "sieberrsec-ctf"],
    }, {
      title: "TurboCrypto2",
      url: "https://github.com/junron/writeups/blob/master/2021/sieberrsec/turbocrypto2.md",
      description: "OOB write in cpython extension leads to RCE",
      tags: ["cpython-extension", "OOB", "sieberrsec-ctf"],
    }, {
      title: "Warmup",
      url: "https://github.com/junron/writeups/blob/master/2021/sieberrsec/warmup.md",
      description: "strcmp bypass via buffer overflow",
      tags: ["strcmp", "bof", "sieberrsec-ctf"],
    }, {
      title: "Coffee Shop",
      url: "https://github.com/junron/writeups/blob/master/2021/idek/coffeeshop.md",
      description: "A simple heap exploitation challenge",
      tags: ["heap", "uaf", "idek-ctf"],
    }, {
      title: "Gradebook",
      url: "https://github.com/junron/writeups/blob/master/2021/kernelctf/gradebook.md",
      description: "Heap overflow leads to RCE",
      tags: ["heap", "tcache", "k3rn3l-ctf"],
    }],
  }, {
    name: "Web",
    icon: "web",
    color: "light-blue--text text--lighten-2",
    posts: [{
      title: "phpme",
      url: "https://github.com/junron/writeups/blob/master/2021/corctf/phpme.md",
      description: "SOP bypass using HTML form",
      tags: ["csrf", "php", "cor-ctf"],
    }, {
      title: "Completely Secure Publishing",
      url: "https://github.com/junron/writeups/blob/master/2021/bcactf/csp.md",
      description: "CSP bypass using header injection",
      tags: ["xss", "csp", "bca-ctf"],
    }],
  }, {
    name: "Misc",
    icon: "help",
    posts: [{
      title: "Bad seed",
      url: "https://github.com/junron/writeups/blob/master/2021/kernelctf/badseed.md",
      description: "Predicting time seeded PRNG",
      tags: ["k3rn3l-ctf"],
    }, {
      title: "SCAndal",
      url: "https://github.com/junron/writeups/blob/master/2021/backdoor-ctf/SCAndal.md",
      description: "Timing attack on binary search",
      tags: ["backdoor-ctf"],
    }],
  }, {
    name: "Rev",
    icon: "application-braces-outline",
    color: "red--text",
  }, {
    name: "Forensics",
    icon: "magnify",
    color: "green--text",
  }, {
    name: "Crypto",
    icon: "function",
    color: "purple--text text--lighten-2",
  }];
  private searchItems = this.categories.map((category) => {
    return category.posts?.map(post => {
      return {
        text: post.title,
        value: post.title,
        url: post.url,
        description: post.description,
        tags: post.tags,
        category,
      };
    }) ?? [];
  }).flat();


  // TODO: Create type for item
  filterItems(item: any, query: string, itemText: string): boolean {
    if (item.tags.some((tag: string) => {
      return query.toLowerCase().includes(tag.toLowerCase()) || tag.toLowerCase().includes(query.toLowerCase());
    })) {
      return true;
    }
    return itemText.toLowerCase().includes(query.toLowerCase());
  }

  // TODO: Create types
  effectiveColor(category: any): string {
    return this.$vuetify.theme.dark ? (category.darkColor || category.color) : category.color;
  }

  openPage(url: string): void {
    window.open(url, "_blank");
  }

}
</script>


<style lang="scss">

@import '~vuetify/src/styles/settings/_variables';


@media #{map-get($display-breakpoints, 'md-and-up')} {
  #app .search-field .v-label {
    font-size: 1em;
    height: fit-content;
    line-height: unset;
    top: 30%;
  }

  #app .search-field .v-label--active {
    height: fit-content;
    line-height: initial;
    font-size: 1em;
    top: 10px;
  }
}

#app .search-field input {
  margin-top: initial;
  height: fit-content;
  line-height: initial;
  max-height: initial;
}
</style>
