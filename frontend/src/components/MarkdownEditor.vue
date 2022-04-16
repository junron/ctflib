<template>
  <v-container>
    <v-row>
      <v-tabs
          v-model="tab"
          @change="$emit('changeTab', tab)"
      >
        <v-tabs-slider/>
        <v-tab key="write">Write</v-tab>
        <v-tab key="preview">Preview</v-tab>
        <v-tab key="split" v-if="enableSplit">Split</v-tab>
      </v-tabs>
    </v-row>
    <v-row class="mt-8">
      <v-col v-show="tab === 0 || tab === 2" class="pa-0 ma-0" :cols="tab===2?5:12">
        <v-textarea
            class="v-textarea--auto-grow"
            no-resize
            ref="textarea"
            v-model="localContent"
            :label="label"
            :error-messages="localError"
            :rules="[v => !!v || label + ' is required']"
            @drop="onDrop"
            @paste="onPaste"
            @input="resizeInput"
        />
        <v-textarea
            auto-grow
            class="pa-3"
            ref="textareaHidden"
            style="visibility: hidden;position: absolute; width: 100%; height: 0; overflow: hidden"
            v-model="localContent"
        />
      </v-col>
      <v-col cols="1"
             v-if="tab === 2"
             class="mx-4"
      />
      <v-col v-if="tab === 1 || tab === 2" class="pa-0 ma-0" :cols="tab===2?5:12">
        <MarkdownRenderer
            :max-width="maxWidth"
            :content="localContent"/>
      </v-col>
    </v-row>
  </v-container>

</template>


<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";
import {VTextarea} from "vuetify/lib/components";
import {upload} from "@/api/upload";

@Component({
  name: "MarkdownEditor",
  components: {MarkdownRenderer},
  watch: {
    content: function (val: string) {
      this.$data.localContent = val;
    },
    localContent: {
      handler: function (val: string) {
        const t = this as MarkdownEditor;
        t.localError = "";
        t.$emit("update:content", val);
        t.resizeInput();
      },
      immediate: true,
    },
  },
  mounted() {
    setTimeout(() => {
      const t = this as MarkdownEditor;
      t.resizeInput();
    }, 1000);
  },
})
export default class MarkdownEditor extends Vue {
  @Prop() public content!: string;
  @Prop() public label!: string;
  @Prop() public error!: string | null;
  @Prop() public maxWidth?: string;
  @Prop() public enableSplit?: boolean;

  tab = null;

  localContent = this.content;
  localError = this.error ?? null;

  $refs!: {
    textarea: InstanceType<typeof VTextarea>;
    textareaHidden: InstanceType<typeof VTextarea>;
  }

  onDrop(event: DragEvent): void {
    const files = event.dataTransfer?.files;
    if (!files || files.length != 1) return;
    this.handleAddFile(files[0]);
    event.preventDefault();
  }

  onPaste(event: ClipboardEvent): void {
    const files = event.clipboardData?.files;
    if (!files || files.length != 1) return;
    this.handleAddFile(files[0]);
    event.preventDefault();
  }

  handleAddFile(file: File): void {
    const textarea = this.$refs.textarea.$refs.input as HTMLTextAreaElement;
    if (!textarea) return;
    const selection = textarea.selectionStart;
    this.localContent = this.localContent.slice(0, selection) + `\n![${file.name}](Uploading to imgur...)\n` + this.localContent.slice(selection);
    upload(file).then(url => {
      if (url.success) {
        this.localContent = this.localContent.replace(
            `![${file.name}](Uploading to imgur...)`, `![${file.name}](${url.data})`);
      } else {
        this.localContent = this.localContent.replace(
            `\n![${file.name}](Uploading to imgur...)\n`, "");
      }
    });
  }

  resizeInput(): void {
    // Autogrowing textarea
    const t1 = this.$refs.textarea;
    const t2 = this.$refs.textareaHidden;
    if (t1 && t2) {
      const t1input = this.$refs.textarea.$refs.input as HTMLTextAreaElement;
      const t2input = this.$refs.textareaHidden.$refs.input as HTMLTextAreaElement;
      if (t1input && t2input) {
        t1input.style.height = (t2input.scrollHeight + 100) + "px";
      }
    }
  }
}
</script>
