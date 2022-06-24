import Vue from 'vue'
import App from './App.vue'
import Ripple from "./voyo-components/voyo-ripple/voyo-ripple.vue";
import Line from "./voyo-components/voyo-line/voyo-line.vue";
import Button from "./voyo-components/voyo-button/voyo-button.vue";
import ButtonIcon from "./voyo-components/voyo-button-icon/voyo-button-icon.vue";
import Select from "./voyo-components/voyo-select/voyo-select.vue";
import SelectTeleport from "./voyo-components/voyo-select/voyo-select-teleport.vue";
import Cell from "./voyo-components/voyo-cell/voyo-cell.vue";
import Panel from "./voyo-components/voyo-panel/voyo-panel.vue";
import CheckBox from "./voyo-components/voyo-checkbox/voyo-checkbox.vue";
import Radio from "./voyo-components/voyo-radio/voyo-radio.vue";
import RippleRadio from "./voyo-components/voyo-ripple-radio/voyo-ripple-radio.vue";
import SearchInput from "./voyo-components/voyo-search-input/voyo-search-input.vue";

Vue.config.productionTip = false
// const VConsole = require("vconsole");
// new VConsole();
Vue.component("voyo-ripple",Ripple);
Vue.component("voyo-button",Button);
Vue.component("voyo-button-icon",ButtonIcon);
Vue.component("voyo-select",Select);
Vue.component("voyo-select-teleport",SelectTeleport);
Vue.component("voyo-line",Line);
Vue.component("voyo-cell",Cell);
Vue.component("voyo-panel",Panel);
Vue.component("voyo-checkbox",CheckBox);
Vue.component("voyo-radio",Radio);
Vue.component("voyo-ripple-radio",RippleRadio);
Vue.component("voyo-search-input",SearchInput);
new App().$mount()
