/*! For license information please see JSONViewer.bundle.js.LICENSE.txt */
(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{237:function(n,t,o){"use strict";o.r(t),function(n){o.d(t,"default",(function(){return i}));var e=o(285),s=o.n(e);o(286);class i extends n.Component{componentDidMount(){this.jsoneditor=new s.a(this.container,{mode:"view",search:!1,mainMenuBar:!1,navigationBar:!1,statusBar:!1,colorPicker:!1}),this.jsoneditor.set(this.props.json),this.jsoneditor.expandAll()}componentWillUnmount(){this.jsoneditor&&this.jsoneditor.destroy()}componentDidUpdate(){this.jsoneditor.update(this.props.json)}render(){return n.createElement("div",{className:"jsoneditor-react-container",ref:n=>this.container=n})}}}.call(this,o(0))}}]);
//# sourceMappingURL=JSONViewer.bundle.js.map