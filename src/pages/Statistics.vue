<template>
  <div class="charts-navigation">
    <span :class="{ selected: showChart === 'country' }" @click="selectChart('country')">Users Country</span>
    <span :class="{ selected: showChart === 'gender' }" @click="selectChart('gender')">Users Gender</span>
    <span :class="{ selected: showChart === 'age' }" @click="selectChart('age')">Users Age</span>
    <span :class="{ selected: showChart === 'tags' }" @click="selectChart('tags')">Users Tags</span>
  </div>
  <template v-if="userListStore.users?.length > 0">
    <div class="charts-container">
      <div class="chart" v-show="showChart==='country'">
        <canvas id="barChart"></canvas>
      </div>
      <div class="chart pie-chart" v-show="showChart==='gender'">
        <canvas id="pieChart"></canvas>
      </div>
      <div class="chart" v-show="showChart==='age'">
        <canvas id="ageChart"></canvas>
      </div>
      <div class="chart" v-show="showChart==='tags'">
        <canvas id="tagChart"></canvas>
      </div>
    </div>
  </template>
  <p v-else>No Users Loaded! First Load users
    <router-link to="/"><b>Here</b></router-link>
  </p>
</template>

<script setup lang="ts">
import {Chart, ChartItem, registerables} from 'chart.js';
import {onMounted, ref} from 'vue';
import useUserListStore from '../stores/usersStore';
import {IChartsData} from '../types/IChartsData';

Chart.register(...registerables);

const userListStore = useUserListStore();
const showChart = ref<'country' | 'gender' | 'age' | 'tags'>('country')
const selectChart = (selectedChart: 'country' | 'gender' | 'age' | 'tags') => {
  showChart.value = selectedChart;
}

onMounted(() => {
  if (userListStore.users?.length > 0) {
    const chartData = ref<IChartsData>(userListStore.generateChartsData);
    const barConfig = {
      type: 'bar',
      data: {
        labels: chartData.value.countryChart.map(data => data.country),
        datasets: [
          {
            label: 'Total Users by Country',
            data: chartData.value.countryChart.map(data => data.usersCount),
            backgroundColor: 'rgba(75, 192, 192, 0.32)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
          {
            label: 'Male Users by Country',
            data: chartData.value.countryChart.map(data => data.maleCountCountry),
            backgroundColor: 'rgba(75, 108, 192, 0.32)',
            borderColor: 'rgba(75, 157, 192, 0.75)',
            borderWidth: 1,
          },
          {
            label: 'Female Users by Country',
            data: chartData.value.countryChart.map(data => data.femaleCountCountry),
            backgroundColor: 'rgba(75, 192, 102, 0.32)',
            borderColor: 'rgba(75, 192, 122, 0.75)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'User Distribution by Country',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    } as any;
    const ctx = document.getElementById('barChart') as ChartItem;
    new Chart(ctx, barConfig);

    const pieChartConfig = {
      type: 'pie',
      data: {
        labels: ['Male', 'Female'],
        datasets: [
          {
            data: [chartData.value.genderChart.malesCount, chartData.value.genderChart.femalesCount],
            backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 99, 132, 0.2)'],
            borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Gender Distribution',
          },
        },
      },
    } as any;
    const pieCtx = document.getElementById('pieChart') as ChartItem;
    new Chart(pieCtx, pieChartConfig);

    const scaCtx = document.getElementById('ageChart') as ChartItem;
    const scatterChartConfig = {
      type: 'scatter',
      data: {
        labels: chartData.value.ageChart.map(item => item.range),
        datasets: [
          {
            label: 'Age Distribution',
            data: chartData.value.ageChart.map(item => ({
              x: item.range,
              y: item.usersCount,
            })),
            borderColor: 'blue',
            backgroundColor: 'blue',
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Age Distribution',
          },
        },
        scales: {
          x: {
            type: 'category',
            title: {
              display: true,
              text: 'Age Range',
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Users',
            },
          },
        },
      },
    } as any;
    new Chart(scaCtx, scatterChartConfig);

    const tagCtx = document.getElementById('tagChart') as ChartItem;
    const tagChartConfig = {
      type: 'bar',
      data: {
        labels: chartData.value.tagChart.map(data => data.tag),
        datasets: [
          {
            label: 'User Tags',
            data: chartData.value.tagChart.map(data => data.usersCount),
            backgroundColor: 'rgba(75, 192, 192, 0.32)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'User Distribution by Tags',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    } as any;
    new Chart(tagCtx, tagChartConfig);
  }
});
</script>

<style scoped lang="scss">
@import "../assets/styles/colors";

.charts-navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;

  span {
    font-weight: 500;
    text-decoration: inherit;
    color: $mainOrange;
    background: $mainBackgroundGray;
    padding: 10px;
    border-radius: 20px;
    width: auto;
    cursor: pointer;

    &.selected {
      background: $mainOrange;
      color: $mainBackgroundGray;
    }
  }
}

.charts-container {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-around;

  .chart {
    display: flex;
    width: 100%;
    justify-content: center;

    &.pie-chart {
      height: 400px;
    }
  }
}
</style>
