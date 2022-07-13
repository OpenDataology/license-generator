<script setup lang="ts">
import {ref, onMounted,onBeforeMount, Ref, reactive, toRefs, computed} from "vue";
import {getLicenseDataAll,getLicenseCondition} from "../../../config/api.env"
import emiter from "../../utils/bus"
import {toRaw} from '@vue/reactivity'

let responseData = reactive({
  data:[],
})

const rowNumber = computed(()=>{
  return Math.ceil(responseData.data.length/3)
})

// let license_data:any[];
let license_data = ref([])

// License indicators
let license_indicators = ref([
  "data_access_rights",
  "data_modification_rights",
  "data_network_rights",
  "data_represent_rights",
  "data_tagging_rights",
  "model_publish_rights",
]);
let conditions:any = ref({});
// Life cycles
onMounted(() => {
  // emiter receive function
  emiter.on("getCondition",(res:any) =>{
    conditions.value = res;
    getFilteredLicense(conditions);
  })
  // initial data
  getFilteredLicense(conditions);
});
onBeforeMount(()=>{
  emiter.off("getCondition")
})

let temp_license_data:any;
const origin_license_data: Ref<any[]> = ref(temp_license_data);

async function getFilteredLicense(conditions:any) {
  const data = {
    pageSize:20,
    pageNum:1,
    conditions: toRaw(conditions.value)
  }
  const response = await getLicenseCondition(data);
  responseData.data = response.data;
  license_data.value = response.data;
}

const test = () => {
  console.log("license_data:",license_data.value.length/6   )
  console.log("response",toRaw(responseData.data));
};
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
      <div class="list container c-w">
        <div v-for="item in responseData.data" class="l-item">
          <el-card>
              <!-- operate -->
              <div slot="header" class="clearfix" style="height:30px">
                  <a :href="'http://www.opendataology.com:30800/#/licenseInfo?id=' + item['id']" target="_blank" style="color:#003261">
                      {{item["license_name"]}}
                  </a>
                  <el-button style="float:right;padding-left: 3px 0;" type="text">Select</el-button>
              </div>
              <el-divider />
              <!-- Indicators -->
              <div v-for="i in license_indicators" :key="i" class="text item">
                  <p>
                      {{ i + ": " + item[i] }}
                  </p>
              </div>
          </el-card>
        </div>
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
.list {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 60px;
}
.l-item{
  height: 400px;
}
.l-item .el-card{
  height: 100%;
}

@media only screen and (max-width: 720px) {
    .list {
        display: grid;
        grid-template-columns: 1fr;
        height: 100px;
        gap: 10px;
        padding: 0 10%;
    }
}
</style>
