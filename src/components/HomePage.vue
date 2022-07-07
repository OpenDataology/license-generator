<script setup lang="ts">
import {ref, onMounted, Ref} from "vue";
import {ElMessage} from "element-plus";
import axios from "axios";
import VueAxios from "vue-axios";

import emiter from "~/utils/bus";

const count = ref(0);

interface Question {
  question:string,
  description:string,
  indicators:string,
  value:boolean
}

// Life cycles
onMounted(() => {
});

const sendMitt = ()=>{
  emiter.emit('getCondition',conditions);
}
const goToUpload = ()=>{
  let url = "http://www.opendataology.com:30800/#/uploadLicense";
  let data = "?data=";
  questions.value.forEach(function(val,index){
    data += val.value?"1":"0";
  });
  window.location.href= url+data;
}



const checkoutValueForTest = ref(false)

let temp_license_data: any[];
let origin_license_data: any[];
// License indicators
let license_indicators = [
  "data_access_rights",
  "data_modification_rights",
  "data_network_rights",
  "data_represent_rights",
  "data_tagging_rights",
  "model_publish_rights",
];
let currentSelect = "";
let conditions = new Map();
const my_questions: Question[] = [
  {
    question:
        "1.1 Can users themselves make the Data available to other third parties?",
    description:
        'Answering "Yes" gives the right to distribute the data, i.e. to make all or part of the Data available to Third Parties under the same terms as those you will choose.',
    indicators: "data_access_rights",
    value: false,
  },
  {
    question:
        "1.2 Can users create labels, tags or create subsets of the Data?",
    description:
        'Answering "Yes" gives the right to create Labelled Data, meaning the creation of associated metadata and informational content derived from Data which identify, comment or otherwise derive information from Data, such as tags and labels.',
    indicators: "data_tagging_rights",
    value: false,
  },
  {
    question: "1.3 Can users create a Representation based on the Data?",
    description:
        "A Representation means a Model existing in a different form, format or model that mimics the effects of the Data, but that does not contain any individual data points or allow third parties to infer individual data points with currently existing technology.",
    indicators: "data_represent_rights",
    value: false,
  },
  {
    question: "2.1 Can the Data be used in conjunction with Models?",
    description:
        'Answering "No" means that the Data is made available for viewing and evaluation only, without any further right to use it in conjunction with Models.',
    indicators: "model_benchmark_rights",
    value: false,
  },
  {
    question: "2.2 Can users perform Research?",
    description:
        '"Research" means to access the Data, use the Data to create or improve Models, but without the right to use the Output or resulting Trained Model for any purpose other than evaluating the Model Research under the same terms. Note that the next question pertains to making the results of the Research available (i.e. publishing them).',
    indicators: "model_research_rights",
    value: false,
  },
  {
    question: "2.3 Can the Research be published?",
    description:
        "This means the right to make available to Third Parties the Models resulting from Research, provided however that third parties accessing such Trained Models have the right to use them for Research or Publication only. Note that there are additional rights that can be granted through the following questions.",
    indicators: "model_publish_rights",
    value: false,
  },
  {
    question: "2.4 Can the Trained Models be used for Internal Purposes?",
    description:
        "The Output can be used internally for any purpose, but not necessarily made available to Third Parties or for their benefit. Note that the ability to make available to third Parties or use for their benefit can be restricted in later questions, but if you do not grant the right to use for Internal Purposes, then the other subsequent rights are not granted either.",
    indicators: "model_internal_rights",
    value: false,
  },
  {
    question: "2.5 Can users commercialize the Output?",
    description:
        "Output means the results of operating a Trained Model. Commercialization means to make the Output available to third parties or for their benefit (but does not include the right to make the Trained Model available).",
    indicators: "model_output_com_rights",
    value: false,
  },
  {
    question: "2.6 Can users commercialize the Trained Models?",
    description:
        'Answering "Yes" means allowing the right to make the Trained Model itself available to a third party, or embodying the Trained Model in a product or service that is distributed, with or without direct access to the Output for such third party.',
    indicators: "model_com_rights",
    value: false,
  },
];

const questions:Ref<Question[]> = ref(my_questions)

let result_keys = [
  "Distribute",
  "Label, tag or create subsets",
  "Re-represent",
  "Benchmark",
  "Research",
  "Publish",
  "Internal use",
  "Output commercialization",
  "Model commercialization",
];

const step = ref(0);  // current step
const chapter = ref(0); // current chapter
const question_visibility = ref(step.value < 8)
const doYes = () => {
  // remember the choice
  questions.value[step.value].value = true;
  // add condition
  conditions.set(questions.value[step.value]["indicators"],questions.value[step.value]["value"] == true?"Yes":"No");
  sendMitt()
  // forward,update step value
  step.value++;
  if (step.value == 3 || step.value == 9) {
    chapter.value++;
  }
};
const doNo = () => {
  // remember the choice
  questions.value[step.value].value = false;
  // add condition
  conditions.set(questions.value[step.value]["indicators"],questions.value[step.value]["value"] == true?"Yes":"No");
  sendMitt()
  // forward,update step value
  step.value++;
  if (step.value == 3 || step.value == 9) {
    chapter.value++;
  }
};
// Restart
const restart = () => {
  chapter.value = 0;
  step.value = 0;
}
// Before
const before = () => {
  if (chapter.value-- <= 0) chapter.value = 0;
};
// Next
const next = () => {
  if (chapter.value++ > 2) chapter.value = 0;
};
// modify condition
const boxOnChange=(value:any)=>{
  conditions.set(value["indicators"],value["value"] == true?"Yes":"No");
  sendMitt()
}
</script>

<template>
  <div class="container parent">
    <!-- Tittle -->
    <div style="text-align: center">
      <h1>License-Generator</h1>
      <p>An easy-to-use license assistant.</p>
    </div>

    <div class="screening-progress c-w">
      <el-row
          type="flex"
          class="row-bg screening-progress"
          justify="center"
          style="margin-top: 30px"
      >
        <el-col :span="20">
          <div class="grid-content bg-purple">
            <h4 style="text-align: center">
              Answer all the questions in the 3 steps to get your custom data
              license.
            </h4>
            <el-steps
                :active="chapter"
                align-center
                finish-status="success"
                style="margin-top: 20px"
            >
              <el-step title="For Data itself"></el-step>
              <el-step title="For Model"></el-step>
              <!-- <el-step title="Finish!"></el-step> -->
            </el-steps>

            <div v-if="step <= 8" class="questions-space" >
              <!-- question -->
              <p>Question : {{ questions[step].question }}</p>
              <!-- description -->
              <p style="color: #606266">
                Description : {{ questions[step].description }}
              </p>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row
          v-if="step <= 8"
          type="flex"
          class="row-bg screening-progress"
          justify="center"
          style="padding:0 5%"
      >
        <el-col :span="20" :xs="20">
          <!-- <el-button style="margin-top: 12px" @click="before"
            >Previous</el-button
          >
          <el-button style="margin-top: 12px" @click="next">Next</el-button> -->
          <el-button style="margin-top: 12px" @click="doYes()"
          >Yes
          </el-button
          >
          <el-button style="margin-top: 12px" @click="doNo()">No</el-button>
        </el-col>
      </el-row>
      <el-row
          v-if="!(step <= 8)"
          type="flex"
          class="row-bg screening-progress c-w"
          justify="center"
      >
        <el-col :span="5" :xs="20">
          <div class="c">
            <h4>For data itself</h4>
            <!-- <h6>For data itself</h6> -->

            <el-checkbox
                v-for="(value, index) in questions.slice(0, 3)"
                v-model="value.value"
                label="1"
                size="large"
                style="display: block"
                @change="boxOnChange(value)"
            >
              {{ result_keys[index] }}
            </el-checkbox>
          </div>
        </el-col>
        <el-col :span="3" :xs="20">
          <div class="c">
            <h4>For Model</h4>
            <!-- <h6>For Model</h6> -->
                <el-checkbox
                  v-for="(value, index) in questions.slice(3, 9)"
                    v-model="value.value"
                    label="1"
                    size="large"
                    style="display: block"
                    @change="boxOnChange(value)"
                >
                {{ result_keys[index + 3] }}
              </el-checkbox>
          </div>
        </el-col>
      </el-row>
      <el-row
          v-if="!(step <= 8)"
          type="flex"
          class="row-bg screening-progress"
          justify="center"
      >
        <el-col :span="7" :xs="20" class="el-col el-col-auto">
          <el-button @click="restart">Restart</el-button>
          <span class="go-to-upload" @click="goToUpload">Generate a new license >> </span>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style>
.el-button {
  margin: 4px;
}

.parent {
  text-align: left;
}
.questions-space{
  min-height:200px;
  padding: 0 5%;
}
.go-to-upload{
  font-size: 12px;
  margin-left: 20px;
  color: #070707;
}
@media screen and (min-width:1200px) {
  .c-w{
    width: 1200px;
  }
  .c-h{
    height: 170px;
  }
}
@media screen and (min-width:922px) and (max-width:1199px) {
  .c-w{
    width: 933px;
  }
  .c-h{
    height: 210px;
  }
}
@media screen and( max-width:768px) {
  .c-w{
    width: 400px;
  }
  .c-h{
    height: 210px;
  }
}

</style>
