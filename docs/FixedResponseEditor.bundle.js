/*! For license information please see FixedResponseEditor.bundle.js.LICENSE.txt */
(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{236:function(t,n,e){"use strict";e.r(n),function(t){e.d(n,"default",(function(){return r}));var o=e(285),s=e.n(o);e(286);class r extends t.Component{componentDidMount(){const t={mode:"code",search:!1,mainMenuBar:!1,navigationBar:!1,statusBar:!1,colorPicker:!1,onChange:()=>this.handleChange()};this.jsoneditor=new s.a(this.container,t),this.jsoneditor.set(this.props.json),this.jsoneditor.focus()}handleChange(){const t=this.tryGetCurrentJson();t&&this.props.onChange(t)}componentWillUnmount(){this.jsoneditor&&this.jsoneditor.destroy()}shouldComponentUpdate(t){return JSON.stringify(t.json)!==JSON.stringify(this.tryGetCurrentJson())}componentDidUpdate(){this.jsoneditor.update(this.props.json)}render(){return t.createElement("div",{id:"fixed-response-editor",className:"jsoneditor-react-container",ref:t=>this.container=t})}tryGetCurrentJson(){try{return this.jsoneditor.get()}catch(t){}}}}.call(this,e(0))}}]);
//# sourceMappingURL=FixedResponseEditor.bundle.js.map