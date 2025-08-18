import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
  elements: {
    line: {
      tension: 0.4,
    },
  },
}

const generateData = () => {
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  const data = labels.map(() => Math.floor(Math.random() * 100))
  
  return {
    labels,
    datasets: [
      {
        label: 'Successful Predictions',
        data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
      },
    ],
  }
}

export default function PredictionChart() {
  return (
    <div className="h-64">
      <Line options={options} data={generateData()} />
    </div>
  )
}
