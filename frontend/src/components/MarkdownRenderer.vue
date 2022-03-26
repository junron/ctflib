<template>
  <div :style="{'max-width': maxWidth ? maxWidth : '468px'}" v-html="html"></div>
</template>


<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import MarkdownIt, {Options} from "markdown-it/lib";
import Renderer from "markdown-it/lib/renderer";
import Token from "markdown-it/lib/token";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark-dimmed.css";

@Component({
  name: "MarkdownRender",
  computed: {
    html() {
      const md = new MarkdownIt({
        linkify: true,
        breaks: true,
        // https://github.com/markdown-it/markdown-it#syntax-highlighting
        highlight: function (str, lang) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return hljs.highlight(str, {language: lang}).value;
            } catch (__) {
              // Pass
            }
          }
          return ""; // use external default escaping
        },
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
          if (tokenAttrs == null) throw new Error("tokenAttrs is null");
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
  @Prop() public maxWidth?: string;
}
</script>

<style lang="scss">
// Enable wrapping even in code blocks
// Other visual improvements
.v-application pre code {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: unset;
  display: block;
  padding: 8px;
  margin: 8px 0 8px 0;
}

img {
  object-fit: scale-down;
  max-width: 100%;
}
</style>
