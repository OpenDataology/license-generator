<script setup lang="ts">
import {ref, onMounted, Ref, reactive, toRefs} from "vue";
import {getLicenseDataAll} from "../../../config/api.env"
import {ElMessage} from "element-plus";
// import axios from "axios";
// import VueAxios from "vue-axios";

const responseData = reactive({
  data:[],
})

// let license_data:any[];
const license_data = ref([])

// License 指标
let license_indicators = ref([
  "data_access_rights",
  "data_modification_rights",
  "data_network_rights",
  "data_represent_rights",
  "data_tagging_rights",
  "model_publish_rights",
]);
// Life cycles
onMounted(async() => {
  getLicense();
});



let temp_license_data:any;
const origin_license_data: Ref<any[]> = ref(temp_license_data);

async function getLicense() {
  const data = {
    pageSize:20,
    pageNum:1,
  }
  const response = await getLicenseDataAll(data)
  console.log("response",response)
  responseData.data = reactive(response.data);
}

</script>

<template>
  <div class="container parent">
    <div>
      <h6 style="text-align: center">
        Number of all Licenses: {{ responseData.data.length }}
      </h6>
      <el-empty v-if="responseData.data.length == 0"
          description="No Data ..."
      >
      </el-empty>
      <div v-if="responseData.data.length != 0" class="c-w">
        <!-- length/col  = row -->
        <el-row v-for="(v,index) in responseData.data.length/5" :key="v" type="flex" justify="space-evenly"
            style="flex-wrap:wrap; flex-direction: row; margin: 0 auto;margin-top: 15px;">
            <el-col :md="4" :xs="20" v-for="(o, index) in 5" :key="o" :offset="index%77 != 0 ? 1 : 0"
                style="margin-top: 30px;">
                <el-card>
                    <!-- operate -->
                    <div slot="header" class="clearfix" style="height:30px">
                        <span style="color:#003261">{{responseData.data[(v-1)*5 + (o-1)]["license_name"]}}</span>
                        <el-button style="float:right;padding-left: 3px 0;" type="text">Select</el-button>
                    </div>
                    <el-divider />
                    <!-- Indicators -->
                    <div v-for="i in license_indicators" :key="i" class="text item">
                        <p>
                            {{ i + ": " + responseData.data[(v-1)*5 + (o-1)][i] }}
                        </p>
                    </div>
                </el-card>
            </el-col>
        </el-row>
      </div>
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
</style>
