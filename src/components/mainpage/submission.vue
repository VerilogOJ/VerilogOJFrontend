<template>
  <div>
    <el-row> &nbsp; </el-row>
    <el-row>
      <el-col :xs="0" :sm="2" :md="4" :lg="6" :xl="6" class="placeholder">
        <!-- placeholder only -->
        &nbsp;
      </el-col>
      <el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="12">
        <el-row class="main-title">
          <i class="el-icon-info"></i>
          提交结果
        </el-row>
        
        <el-row>
          <el-card shadow="never">
            <el-row>
              <el-col :span="12">
                <p class="left-aligned">
                  {{ passed_testcase }} / {{ num_testcase }} 个通过测试用例，获
                  {{ score }} / {{ total_score }} 分
                </p>
              </el-col>

              <el-col :span="12">
                <p v-if="status=='Accepted'" class="right-aligned">
                  状态：{{ status }}
                
                </p>
                <p v-else>
                    

                </p>
                <p class="right-aligned">提交时间：{{ submitTimePretty }}</p>
              </el-col>
            </el-row>
          </el-card>
        </el-row>
        <el-row v-if="!loggedIn">
          <el-alert type="info" show-icon title="登录以查看代码！"></el-alert>
        </el-row>
        <el-row v-else-if="!hasPermission">
          <el-alert
            type="warning"
            show-icon
            title="您只能查看和下载自己的代码！"
          ></el-alert>
        </el-row>
        <el-row v-else>
          <!-- 代码显示 -->
          <el-alert title="Code：" type="info" :closable="false">
            <el-button
              size="mini"
              v-clipboard:copy="code"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
              >复制</el-button
            >
            <el-button size="mini" @click="downloadFile(submissionid, code)"
              >下载代码</el-button
            >
          </el-alert>

          <codemirror
            id="mycode"
            v-model="code"
            :options="cmOptions"
          ></codemirror>
        </el-row>
          
        <el-divider></el-divider>

        <el-tabs v-if="status[0]=='A'" type="border-card" @tab-click="handleClick">
            <el-tab-pane :label="info['name']" :name="index.toString()" :key="index"  v-for="(info, index) in circuit_info"></el-tab-pane>
            <el-row>
              <el-col :span="12">
                  <div align="middle" style="font-size: 14px">电路图 </div>
                  
              </el-col>
              <el-col :span="12">
                  <div align="middle" v-if="current_select!=0" style="height: 20px; font-size:14px">
                       资源占用情况
                  </div>
              </el-col>
            </el-row>
            
            <el-row>
              <el-col :span="12">
                  <el-image style="height: 200px; width:90%" v-loading="loading" @mouseenter="imgMouseEnter" :error="onloaderror" :fit="tab_fit" :src="current_circuit_img_fullsize" :preview-src-list="[current_circuit_img_fullsize]"  ref="viewer">
                  </el-image>
              </el-col>
              <el-col :span="12">
                  <p style="white-space: pre-line; overflow-y:auto; height: 200px; font-size:12px">
                      {{ current_utiliztion}}
                  </p>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                  <div align="middle" style="color:#409EFF; font-size:12px">
                    点击图片以放大
                  </div>
              </el-col>
              <el-col :span="12"></el-col>
            </el-row>
        </el-tabs>

        <el-row v-if="!loggedIn">
          <el-alert
            type="info"
            show-icon
            title="登录以查看波形和测试结果！"
          ></el-alert>
        </el-row>
        <el-row v-else-if="!hasPermission">
          <el-alert
            type="warning"
            show-icon
            title="您只能查看自己的波形和测试结果！"
          ></el-alert>
        </el-row>
        <el-row v-else>
          <!-- 测试点结果 -->
          <el-collapse>
            <el-collapse-item :key="index" v-for="(result, index) in results">
              <template slot="title">
                <el-col :span="12">
                  <div style="margin-left: 15px">
                    测试用例 {{ index }} ： {{ result.result }}
                    
                  </div>
                </el-col>
                <el-col :span="12">
                  <div style="text-align: right">
                    {{ result.grade }} / {{ related_testcases[index].grade }} 分
                  </div>
                </el-col>
              </template>
              <el-card shadow="never">
                <h3>波形</h3>
                <wavedrom
                  :waveId="String(10 + index)"
                  :parentText="result.wave_json"
                  errorMessage="Sorry, no waveform available."
                ></wavedrom>
                <h3>日志</h3>
                <p
                  style="
                    height: 300px;
                    overflow-y: auto;
                    margin-left: 15px;
                    word-wrap: break-word;
                    word-break: normal;
                    white-space: pre-line;
                  "
                > 
                  {{ result.log }}
                  
                </p>
              </el-card>
            </el-collapse-item>
          </el-collapse>
        </el-row>
        

        
      </el-col>
    </el-row>
  </div>
</template>

<style scope>
.el-tag {
  text-align: center;
  font-weight: bold;
}

.main-title {
  font-size: 20px;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}



.left-aligned {
  text-align: left;
}

.right-aligned {
  text-align: right;
}

.el-tabs {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  height: 380px;
}
</style>



<script>
import moment from "moment";
import { codemirror } from "vue-codemirror";
require("codemirror/lib/codemirror.css");
require("codemirror/theme/base16-light.css");

require("codemirror/mode/verilog/verilog");
//import languageselect from "@/components/utils/languageselect";
import wavedrom from "@/components/utils/wavedrom";
import { mapState } from "vuex";
import { ignoreCase } from "uc.micro/categories/P/regex";
import image from "markdown-it/lib/rules_inline/image";

export default {
  name: "submission",
  components: {
    codemirror,
    //languageselect,
    wavedrom,
  },
  watch: {
    
  },
  methods: {
    onCopy(e) {
      this.$message.success("复制成功！");
    },
    // 复制失败
    imgMouseEnter(e) {
      
    },
    onloaderror(e) {
      console.log('123');
    },
    onError(e) {
      this.$message.error("复制失败：" + e);
    },
    imgmodify(type) {
      this.image.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(this.circuit_info[type]['svg'])));
      var that = this;
      this.loading = true;

      
      this.image.onload = function () {
        that.canvas_.height = that.image.height;
        that.canvas_.width = that.image.width;

        var scale = 1;
        if (that.canvas_.height > 200)
          scale = 200 / that.canvas_.height;

        var ctx = that.canvas_.getContext("2d");
        var image = that.image;
        ctx.fillStyle = "white";
        ctx.clearRect(0, 0, that.canvas_.width, that.canvas_.height);
        ctx.fillRect(0, 0, that.canvas_.width, that.canvas_.height);
        ctx.drawImage(image, 0, 0, that.image.width, that.image.height);
        that.current_circuit_img_fullsize = that.canvas_.toDataURL('image/jpg');
        setTimeout(function () { that.$refs.viewer.loadImage(); }, 500);
        
        that.loading = false;
      };
      
      //img.children[0].src = this.current_circuit_img;
      //img.children[1].src = this.current_circuit_img;
      //console.log(this.$refs);
      //console.log('!!!!!!!!!!!!');
    }, 
    handleClick(tab, e) {
      this.current_select = tab.name;
      this.imgmodify(tab.name);
      this.current_utiliztion = this.circuit_info[tab.name]['report'];
    },
    downloadFile(codeid, content) {
      // var filename = "temp";
      // this.$axios.get("/files/")
      //   .then((response) => {
      //      console.log(response.data);
      //   }).catch()
      var aLink = document.createElement("a");
      var blob = new Blob([content], { type: "data:text/plain" });
      var downloadElement = document.createElement("a");
      var href = window.URL.createObjectURL(blob); //创建下载的链接
      downloadElement.href = href;
      downloadElement.download = "submit" + codeid + ".v"; //下载后文件名
      document.body.appendChild(downloadElement);
      downloadElement.click(); //点击下载
      document.body.removeChild(downloadElement); //下载完成移除元素
      window.URL.revokeObjectURL(href); //释放掉blob对象
    },


    updateStatus() {
      this.$axios
        .get("/submissions/" + this.submissionid + "/")
        .then((response) => {
          console.log(response.data);
          this.results = response.data.results;
          this.status = response.data.result;
          this.score = response.data.total_grade;
          this.total_score = response.data.problem_belong.total_grade;
          this.num_testcase = this.results.length;
          this.related_testcases = response.data.problem_belong.testcases;
          this.submit_time = new Date(response.data.submit_time);
          // console.log(this.submit_time.toISOString());
          this.subm_userid = response.data.user;
          
          // this.logic_circuit_data = response.data.results[0].logic_circuit_data;
          // this.logic_circuit_possible_error = response.data.results[0].logic_circuit_possible_error;
          // this.yosys_cmos_result = response.data.results[0].yosys_cmos_result;
          // this.google_130nm_result = response.data.results[0].google_130nm_result;
          // this.xilinx_fpga_result = response.data.results[0].xilinx_fpga_result


          var res = response.data.results[0];

          if (this.status[0] == 'A') {
            this.circuit_info.push({ 'name': '逻辑', 'svg': res.logic_circuit_data, 'report': "" })
            this.circuit_info.push({ 'name': 'Yosys CMOS', 'svg': res.library_mapping_yosys_cmos.circuit_svg, 'report': res.library_mapping_yosys_cmos.resources_report })
            this.circuit_info.push({ 'name': 'Google 130nm', 'svg': res.library_mapping_google_130nm.circuit_svg, 'report': res.library_mapping_google_130nm.resources_report })
            this.circuit_info.push({ 'name': 'Xilinx FPGA', 'svg': res.library_mapping_xilinx_fpga.circuit_svg, 'report': res.library_mapping_xilinx_fpga.resources_report })
            this.imgmodify(0);
          }
          

          let passed = 0;
          for (let i = 0; i < this.results.length; i++) {
            // console.log(this.results[i]);
            if (this.results[i].result == "Accepted") {
              passed++;
            }
          }
          this.passed_testcase = passed;
          if (this.loggedIn && this.hasPermission) {
            // TODO: support for multiple files
            // console.log(response.data)
            this.$axios.get("/files/"+response.data.submit_file)
              .then((response) => {

                //console.log(response.data);
                this.code = response.data;
              })
              .catch();
          }
        })
        .catch()
        .then(() => {
          if (!this.needRefresh && this.autoRefresh) {
            this.autoRefresh = false;
            clearInterval(this.timer);
          }
          if (this.needRefresh && !this.autoRefresh) {
            this.autoRefresh = true;
            this.timer = setInterval(this.updateStatus, 2000);
          }
        });
    },
    prettyType(type) {
      if (type == "SIM") {
        return "行为级仿真";
      } else if (type == "SYNTHSIM") {
        return "门级仿真";
      } else {
        return type;
      }
    },
  },
  data() {
    return {
      cmOptions: {
        tabSize: 4,
        mode: "verilog",
        theme: "base16-light",
        lineNumbers: true,
        readOnly: true,
        viewportMargin: Infinity,
        lineWrapping: true,
      },
      code: "",
      canvas_: "",
      tab_fit: "scale-down",
      loading: true,
      image: null, 
      canvas: null,
      current_utiliztion: "",
      submissionid: null,
      status: "",
      results: [],
      score: 0,
      total_score: 0,
      num_testcase: 0,
      passed_testcase: 0,
      submit_time: new Date(),
      related_testcases: [],
      subm_userid: "",
      circuit_arr: [],
      current_circuit_img_fullsize: "",
      circuit_info: [],
      current_select: 0,
      autoRefresh: false,
    };
  },
  computed: {
    submitTimePretty: function () {
      let tm = this.submit_time;
      let duration = moment(tm).locale("zh-CN").fromNow();
      return duration;
    },
    ...mapState(["loggedIn", "userID", "username", "isSuperUser"]),
    needRefresh: function () {
      return this.results[0].status != "DONE";
    },
    hasPermission: function () {
      return this.subm_userid == this.userID || this.isSuperUser;
    },
  },
  mounted() {
    
  },
  destroyed() {},
  created() {
    // console.log(this.needRefresh);
    this.submissionid = this.$route.params.submissionid;
    this.updateStatus();
    this.canvas_ = document.createElement("canvas");
    this.image = new Image();
    
  },
  beforeDestroy() {
    if (this.autoRefresh) {
      clearInterval(this.timer);
    }
  },
};
</script>
