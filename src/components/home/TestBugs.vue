<template>
  <div id="testBugRecordRankingList">
    <div ref="chtRankingList" style="width: 100%; height: 300px"></div>
  </div>
</template>
<script>
import * as bugApi from '@/api/bug'
export default {
  name: 'TestBugRecordRankingList',
  props: {},
  data() {
    return {
      allBugs:[]
    }
  },
  async mounted() {
    //获取数据
    let testUserBugCounts = await this.getTestUserBugCount()

    //分别取测试人员、汇总的数量
    let testUsers = testUserBugCounts.map((item) => {
      return item.develop_user
    })
    let testUserCounts = testUserBugCounts.map((item) => {
      return item.count
    })

    //绘制图表
    this.draw(testUsers, testUserCounts)
  },
  methods: {
    //根据所有Bug记录生成测试人员分组的汇总Bug数量
    async getTestUserBugCount() {
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

      //2、生成测试人员分组汇总Bug数量
      //2.1、获取所有测试人员，并去重
      let testUsers = this.allBugs.map((item) => {
        return item.createByName
      })
      testUsers = Array.from(new Set(testUsers))
      //2.2、遍历测试人员数组，获取汇总Bug数量，并组成新的对象数组
      let testUserBugCounts = []
      testUsers.forEach((item) => {
        let currentTestUserBugs = this.allBugs.filter(
          (entity) => entity.createByName == item
        )
        let count = 0
        if (currentTestUserBugs && currentTestUserBugs.length > 0) {
          count = currentTestUserBugs.length
        }

        let testUserBugCount = { develop_user: item, count: count }
        testUserBugCounts.push(testUserBugCount)
      })
      //2.3、排序，按Bug数量降序，使用一个匿名函数进行排序，函数返回1表示比较的前面的数>后面的数，否则，返回-1；一般会使用插入排序或快速排序
      testUserBugCounts.sort((x, y) => {
        if (x.count > y.count) {
          return 1
        } else {
          return -1
        }
      })

      return testUserBugCounts
    },
    //绘制图表
    draw(category, data) {
      let myChart = this.$echarts.init(this.$refs.chtRankingList)
      let option = {
        color: ['#91CC75'],
        title: {
          text: '测试人员提交BUG排行榜',
          subtext: '',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          data: [''],
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 1],
        },
        yAxis: {
          type: 'category',
          data: category, //Y轴，显示开发人员名称
        },
        series: [
          {
            name: 'BUG数',
            type: 'bar',    //图表类型为柱状图
            data: data, //数据，显示按开发人员分组的汇总数据
          },
        ],
      }
      option && myChart.setOption(option)
    },
  },
}
</script>