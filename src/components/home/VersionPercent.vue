<template>
  <div id="bugVersionPercent">
    <div ref="myChat" style="width: 100%; height: 300px"></div>
  </div>
</template>
<script>
import * as bugApi from '@/api/bug'
export default {
  name: 'BugVersionPercent',
  props: {},
  data() {
    return {
      allBugs:[]
    }
  },
  async mounted() {
    //获取数据
    let versionBugCounts = await this.getVersionBugCount()

    //绘制图表
    this.draw(versionBugCounts)
  },
  methods: {
    //根据所有Bug记录生成版本分组的汇总Bug数量
    async getVersionBugCount() {
      //1、同步获取所有Bug数据
      await bugApi
        .queryAll()
        .then((response) => {
          let responseData = response.data
          if (responseData.code == 0) {
            this.allBugs = responseData.data
          } else {
            this.$message({
              message: responseData.message,
              type: 'warning',
            })
          }
        })

      //2、生成版本分组汇总Bug数量
      //2.1、获取所有版本，并去重
      let versions = []
      this.allBugs.forEach((item) => {
        versions = versions.concat(item.versions) //concat，用于连接两个数组
      })

      versions = Array.from(new Set(versions))
      //2.2、遍历版本数组，获取汇总Bug数量，并组成新的对象数组
      let versionBugCounts = []
      versions.forEach((item) => {
        let currentVersionBugs = this.allBugs.filter(
          (entity) => entity.versions.indexOf(item) >= 0
        )
        let count = 0
        if (currentVersionBugs && currentVersionBugs.length > 0) {
          count = currentVersionBugs.length
        }

        let versionBugCount = { name: item, value: count } //这里的格式要跟饼图里要求的json数组格式的属性保持一致，即是name和value
        versionBugCounts.push(versionBugCount)
      })

      return versionBugCounts
    },
    //绘制图表
    draw(data) {
      let myChart = this.$echarts.init(this.$refs.myChat)
      let option = {
        title: {
          text: 'BUG版本分布情况',
          subtext: '',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            name: '',
            type: 'pie', //图表类型为饼图
            radius: '50%',
            data: data, //图表数据
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      }
      option && myChart.setOption(option)
    },
  },
}
</script>