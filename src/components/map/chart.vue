<template>
  <fusioncharts
    :type="type"
    :width="width"
    :height="height"
    :dataFormat="dataFormat"
    :dataSource="dataSource"
  ></fusioncharts>
</template>
<script>
import Vue from "vue";
import VueFusionChartsComponent from "vue-fusioncharts/component";
import FusionCharts from "fusioncharts";
import FusionMaps from "fusioncharts/fusioncharts.maps";
import USA from "fusioncharts/maps/fusioncharts.usa";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
const vueFusionCharts = VueFusionChartsComponent(
  FusionCharts,
  FusionMaps,
  USA,
  FusionTheme
);
Vue.component("fusioncharts", vueFusionCharts);
export default {
  props: {
    processingForm: { type: Boolean, required: true },
    selectedstates: { type: Array },
    searchCaption: { type: String },
    _states: { type: Array, required: true },
    mode: { type: Number, required: true },
    _type: { type: Number, required: true },
    _response: { type: Array }
  },
  data: () => ({
    type: "usa",
    width: "500",
    height: "550",
    dataFormat: "json"
  }),
  computed: {
    dataSource() {
      return {
        chart: {
          caption: this.computedCaption,
          subcaption: this.computedSubcaption,
          numberprefix: "#",
          showlabels: "1",
          exportEnabled: this.computedcanExport,
          theme: "fusion",
          entitytooltext:
            "<div style='font-size:14px; text-align:center; padding: 2px 4px 2px 4px; color:black;'>$lName</div><div style='font-size:12px; color:black;'>Total Audience: <b>$value</b></div>",
          tooltipbgcolor: "#FFFFFF",
          tooltipbordercolor: "#CCCCCC",
          showentitytooltip: "0",
          showentityhovereffect: "0",
          showlabels: "0",
          entityfillhovercolor: "#FFF9C4",
          nullentitycolor: "#D0DFA3"
        },
        colorrange: {
          gradient: "0",
          color: [
            {
              minvalue: "1",
              maxvalue: "500",
              displayvalue: "#1  - #500",
              code: "#42A5F5"
            },
            {
              minvalue: "500",
              maxvalue: "1000",
              displayvalue: "#500 - #1000",
              code: "#1E88E5"
            },
            {
              minvalue: "1000",
              maxvalue: "1500",
              displayvalue: "#1000 - #1500",
              code: "#1976D2"
            },
            {
              minvalue: "1501",
              displayvalue: " greater than #1500",
              code: "#1F65C0"
            },
            {
              minvalue: "0",
              maxvalue: "0",
              displayvalue: "#0",
              code: "#BBDEFB"
            }
          ]
        },
        data: this.computedData
      };
    },
    computedCaption() {
      return this.searchCaption.length != 0
        ? `${this.searchCaption}`
        : `Data Visualization Widget`;
    },
    computedSubcaption() {
      var d = new Date();
      var months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      return `Updated on ${months[d.getMonth()]} , ${d.getFullYear()}`;
    },
    computedData() {
      // edit mode and nationwide
      if (this.mode === 0 && this._type == 1) {
        return this._states.map(state => {
          return {
            id: state.abv,
            value: "0",
            showlabel: "1",
            alpha: "100",
            fontbold: "1",
            usehovercolor: "1",
            showtooltip: "1",
            tooltext:
              "<div style='font-size:14px; text-align:center; padding: 2px 4px 2px 4px; color:black;'>$lName</div><div style='font-size:12px; color:black;'>click the analyze button</div>"
          };
        }, 0);
      }
      // edit mode and state
      if (this.mode == 0 && this._type == 0) {
        return this.selectedstates.map(state => {
          return {
            id: state,
            value: "0",
            showlabel: "1",
            alpha: "100",
            fontbold: "0",
            usehovercolor: "1",
            showtooltip: "1",
            tooltext:
              "<div style='font-size:14px; text-align:center; padding: 2px 4px 2px 4px; color:black;'>$lName</div><div style='font-size:12px; color:black;'>click the analyze button</div>"
          };
        }, 0);
      }if(this.mode===1){
          return this.computedRes.map(res=>{
        let count = res.count.toString();
        return{
            id: res.abv,
            value: count,
            showlabel: "1",
            alpha: "100",
            fontbold: "1",
            usehovercolor: "1",
            showtooltip: "1",
          };},0);
      } 
      else {
        return [];
      }
    },
    computedcanExport(){
      if (this.mode == 0 && this._type == 0) {
        return "0";
      }
      if (this.mode == 0 && this._type == 1) {
        return "0";
      }
      if (this.mode == 1) {
        return "1";
      }
    },
    computedRes() {
      if (this._response.length === 0) {
        return [];
      }

      var result = Array.from(new Set(this._response.map(s => s.count))).map(
        count => {
          return {
            count: count,
            map: this._response.find(s => s.count === count).map
          };
        }
      );
      return result.map((mark, index) => {
        return {
          count: mark.count,
          abv: mark.map.abv
        };
      }, 0);
    }
  }
};
</script>