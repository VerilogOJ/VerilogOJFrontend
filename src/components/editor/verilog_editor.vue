<template>
    <div>
        <codemirror v-model="codeInner" @changes="onCmCodeChange" :options="cmOptions" ref="mymir" 
            :style="{'--cmHeight':cmHeight}">
        </codemirror>
        <br>
        <el-popover
          placement="right"
          width="400"
          trigger="click">
              <span class="demonstration">高度</span>
              <el-slider v-model="editorHeight" :min="100" :max="700" :show-tooltip="false" @change="onSliderChange"> </el-slider>
          <el-button slot="reference">编辑器设置</el-button>
        </el-popover>
        <el-row :gutter="20">
            <el-col :span="6" :offset="15">
                <div class="block">
                  
                    
                 </div>
            <div class="grid-content bg-purple"></div></el-col>
        </el-row>
    </div>
</template>


<script>
import { codemirror } from "vue-codemirror";
// import statusmini from "@/components/utils/statusmini";
// import prostatistice from "@/components/utils/prostatistice";
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/5/LICENSE

require("codemirror/lib/codemirror.css");
require("codemirror/theme/base16-light.css");
require("codemirror/theme/base16-dark.css");
require("codemirror/addon/hint/show-hint.css");
require("codemirror/mode/verilog/verilog");
require("codemirror/mode/sql/sql");
require("codemirror/addon/hint/show-hint");
//require("codemirror/addon/hint/anyword-hint");
require("./verilog_hint");
require("codemirror/addon/edit/matchbrackets");


export default {
  name: 'verilog_editor',
  props: 
    ["code_"],
  components: {
      codemirror,
  },
  data() {
    return {    
      codeInner: this.code_,
      editorHeight: 400,
      cmHeight: "400px",
      cmOptions: {
        tabSize: 4,
        indentUnit: 4,
        mode: "verilog",
        theme: "base16-light",
        lineNumbers: true,
        matchBrackets: true,
      },
    }
  },
  watch: {
    code_: {
      handler(val) {
        this.codeInner = val;
      }
    }
  },
  methods: {
    onCmCodeChange(istance, obj) {
      //console.log(this.message);
      var re = /^[A-Za-z0-9]*$/;
      var cursor = this.$refs.mymir.codemirror.getCursor();
      //console.log(typeof (cursor));
      var line = this.$refs.mymir.codemirror.getLine(cursor.line);
      //console.log(cursor);
      var c;
      if (line.length > 0) {
        c = line[cursor.ch - 1];
      } else {
        c = ' ';
      }
      if (re.test(c) && this.$refs.mymir.codemirror.state.focused &&
        !this.$refs.mymir.codemirror.state.completionActive)
        this.$refs.mymir.codemirror.showHint({ completeSingle: false });
      this.$emit("codechange", this.codeInner);
    },
    onSliderChange(msg, event) {
      this.cmHeight = msg+'px';
    }
  }
}
</script>

<style scope>
.CodeMirror {
  text-align: left;
  height: var(--cmHeight);
}

</style>
