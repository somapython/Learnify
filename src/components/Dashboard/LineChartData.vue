<template>
    <div>
      <canvas ref="lineChartCanvas"></canvas>
    </div>
  </template>
  
  <script>
  import {
    Chart as ChartJS,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    CategoryScale,
  } from "chart.js";
  
  ChartJS.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    CategoryScale
  );
  
  export default {
    name: "LineChart",
    props: {
      data: {
        type: Array,
        required: true,
      },
    },
    mounted() {
      this.createLineChart();
    },
    methods: {
      createLineChart() {
        const ctx = this.$refs.lineChartCanvas.getContext("2d");
  
        const labels = this.data.map((item) => item.label);
        const scores = this.data.map((item) => item.score);
        const averages = this.data.map((item) => item.avg);
  
        new ChartJS(ctx, {
          type: "line",
          data: {
            labels,
            datasets: [
              {
                label: "Your Score",
                data: scores,
                borderColor: "#4CAF50",
                backgroundColor: "rgba(76, 175, 80, 0.2)",
                tension: 0.4,
                fill: true,
              },
              {
                label: "Average Student Score",
                data: averages,
                borderColor: "#2196F3",
                backgroundColor: "rgba(33, 150, 243, 0.2)",
                tension: 0.4,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
              },
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => {
                    return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                  },
                },
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
              },
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 10,
                },
              },
            },
          },
        });
      },
    },
  };
  </script>
  
  <style scoped>
  canvas {
    max-width: 100%;
    height: 300px;
  }
  </style>
  