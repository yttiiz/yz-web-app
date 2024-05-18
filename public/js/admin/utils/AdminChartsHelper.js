import { PageBuilder } from "../../pages/Builder.js";

export class AdminChartsHelper {
  static #builder = new PageBuilder();

  static setCharts = ({
    dataChartOne,
    dataChartTwo,
  }) => {
    const container = document.querySelector(".analytics-details");

    if (window.ApexCharts && container) {
      const [
        chartCard1,
        chartCard2,
      ] = AdminChartsHelper.#builder.createHTMLElements("div", "div");

      AdminChartsHelper.#builder.insertChildren(
        container,
        chartCard1,
        chartCard2,
      );

      AdminChartsHelper.#buildChart({
        data: dataChartOne,
        name: "Utilisateurs",
        title: "Utilisateurs",
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
        element: chartCard1,
      });
      AdminChartsHelper.#buildChart({
        data: dataChartTwo,
        name: "Réservations",
        title: "Réservations",
        categories: [2020, 2021, 2022, 2023, 2024],
        element: chartCard2,
      });

      container.classList.add("expanded");
    }
  };

  static #buildChart = ({
    element,
    name,
    categories,
    title,
    data,
  }) => {
    const opts = {
      chart: {
        type: "line",
        toolbar: {
          show: false,
        },
      },
      stroke: {
        curve: "smooth",
      },
      series: [{
        name,
        data,
      }],
      title: {
        text: title,
        align: "left",
        margin: 10,
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize: "14px",
          fontWeight: "bold",
          fontFamily: "'Jost', sans-serif",
          color: "#263238",
        },
      },
      xaxis: {
        categories,
      },
    };

    const chart = new ApexCharts(
      element,
      opts,
    );

    chart.render();
  };
}
