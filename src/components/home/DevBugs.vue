<template>
  <div id="devBugRankingList">
    <div ref="chtRankingList" style="width: 100%; height: 300px"></div>
  </div>
</template>
<script>
import * as bugApi from '@/api/bug'
export default {
  name: 'DevBugRankingList',
  props: {},
  data() {
    return {
      allBugs: [],
    }
  },
  //Echarts图标绘制，是在已有的HTML标签渲染完后，动态生成canvas标签呈现图表，所以需要在mouted方法中调用绘图的draw方法
  async mounted() {
    //获取数据
    let developUserBugCounts = await this.getDevelopUserBugCount()

    //分别取开发人员、汇总的数量
    let developUsers = developUserBugCounts.map((item) => {
      return item.developerName
    })
    let developUserCounts = developUserBugCounts.map((item) => {
      return item.count
    })

    //绘制图表
    this.draw(developUsers, developUserCounts)
  },
  methods: {
    //根据所有Bug记录生成开发人员分组的汇总Bug数量
    async getDevelopUserBugCount() {
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

      //2、生成开发人员分组汇总Bug数量
      //2.1、获取所有开发人员，并去重
      let developUsers = this.allBugs.map((item) => {
        return item.developerName
      })
      developUsers = Array.from(new Set(developUsers))
      //2.2、遍历开发人员数组，获取汇总Bug数量，并组成新的对象数组
      let developUserBugCounts = []
      developUsers.forEach((item) => {
        let currentDevelopUserBugs = this.allBugs.filter(
          (entity) => entity.developerName == item
        )
        let count = 0
        if (currentDevelopUserBugs && currentDevelopUserBugs.length > 0) {
          count = currentDevelopUserBugs.length
        }

        let developUserBugCount = { developerName: item, count: count }
        developUserBugCounts.push(developUserBugCount)
      })
      //2.3、排序，按Bug数量降序，使用一个匿名函数进行排序，函数返回1表示比较的前面的数>后面的数，否则，返回-1；一般会使用插入排序或快速排序
      developUserBugCounts.sort((x, y) => {
        if (x.count > y.count) {
          return 1
        } else {
          return -1
        }
      })

      return developUserBugCounts
    },
    //绘制图表
    draw(category, data) {
      let myChart = this.$echarts.init(this.$refs.chtRankingList)
      let option = {
        color: ['#EE6666'],
        title: {
          text: '开发人员产生BUG排行榜',
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
          data: category,  //Y轴，显示开发人员名称
        },
        series: [
          {
            name: 'BUG数',
            type: 'bar',   //图表类型为柱状图
            data: data,  //数据，显示按开发人员分组的汇总数据
          },
        ],
      }
      option && myChart.setOption(option)
    },
  },
}
</script>