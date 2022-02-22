<template>
  <div v-html="html"></div>
</template>


<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import MarkdownIt, {Options} from "markdown-it/lib";
import Renderer from "markdown-it/lib/renderer";
import Token from "markdown-it/lib/token";

@Component({
  name: "MarkdownRender",
  computed: {
    html() {
      const md = new MarkdownIt({
        linkify: true,
        breaks: true,
      });
      const defaultRender = md.renderer.rules.link_open || function (tokens: Token[], idx: number, options: Options,
                                                                     env: unknown,
                                                                     self: Renderer) {
        return self.renderToken(tokens, idx, options);
      };

      md.renderer.rules.link_open = function (tokens: Token[], idx: number, options: Options,
                                              env: unknown,
                                              self: Renderer) {
        // If you are sure other plugins can't add `target` - drop check below
        const aIndex = tokens[idx].attrIndex("target");

        if (aIndex < 0) {
          tokens[idx].attrPush(["target", "_blank"]); // add new attribute
        } else {
          const tokenAttrs = tokens[idx].attrs;
          if(tokenAttrs == null) throw new Error("tokenAttrs is null");
          tokenAttrs[aIndex][1] = "_blank";    // replace value of existing attr
        }

        // pass token to default renderer.
        return defaultRender(tokens, idx, options, env, self);
      };
      return md.render(this.$props.content);
    },
  },
})
export default class MarkdownRenderer extends Vue {
  @Prop() public content!: string;
}
</script>
