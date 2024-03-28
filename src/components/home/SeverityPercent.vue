<template>
  <div id="bugSeverityPercent">
    <div ref="myChat" style="width: 100%; height: 300px"></div>
  </div>
</template>
<script>
import * as bugApi from '@/api/bug'
export default {
  name: 'BugSeverityPercent',
  props: {},
  data() {
    return {
      allBugs:[]
    }
  },
  //Echarts图标绘制，是在已有的HTML标签渲染完后，动态生成canvas标签呈现图表，所以需要在mouted方法中调用绘图的draw方法
  async mounted() {
    //获取数据
    let severityBugCounts = await this.getSeverityBugCount()

    //绘制图表
    this.draw(severityBugCounts)
  },
  methods: {
    //根据所有Bug记录生成严重程度分组的汇总Bug数量
    async getSeverityBugCount() {
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

      //2、生成严重程度分组汇总Bug数量
      //2.1、获取所有严重程度，并去重
      let severities = this.allBugs.map((item) => {
        return item.severity
      })
      severities = Array.from(new Set(severities))
      //2.2、遍历严重程度数组，获取汇总Bug数量，并组成新的对象数组
      let severityBugCounts = []
      severities.forEach((item) => {
        let currentSeverityBugs = this.allBugs.filter(
          (entity) => entity.severity == item
        )
        let count = 0
        if (currentSeverityBugs && currentSeverityBugs.length > 0) {
          count = currentSeverityBugs.length
        }

        let severityBugCount = { name: item, value: count }   //这里的格式要跟饼图里要求的json数组格式的属性保持一致，即是name和value
        severityBugCounts.push(severityBugCount)
      })

      severityBugCounts = JSON.parse(JSON.stringify(severityBugCounts).replaceAll('Critical','致命').replaceAll('Major','严重').replaceAll('Normal','一般').replaceAll('Trivial','轻微'))

      return severityBugCounts
    },
    //绘制图表
    draw(data) {
      let myChart = this.$echarts.init(this.$refs.myChat)
      let option = {
        title: {
          text: 'BUG严重程度分布情况',
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