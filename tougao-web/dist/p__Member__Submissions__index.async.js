"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[299],{43907:function(j,n,t){t.r(n);var h=t(5574),u=t.n(h),_=t(67294),i=t(68872),a=t(23323),m=t(71971),D=t(73318),P=t(53061),y=t(68795),e=t(85893),l=[{key:"1",title:"\u8BBA\u6587\u4E00",authors:"\u5F20\u4E09, \u674E\u56DB",status:"\u5F85\u5BA1\u6838"},{key:"2",title:"\u8BBA\u6587\u4E8C",authors:"\u738B\u4E94, \u8D75\u516D",status:"\u5DF2\u5BA1\u6838"},{key:"3",title:"\u8BBA\u6587\u4E09",authors:"\u5218\u4E03, \u9648\u516B",status:"\u5F85\u5BA1\u6838"},{key:"4",title:"\u8BBA\u6587\u56DB",authors:"\u674E\u4E5D, \u5B59\u5341",status:"\u5DF2\u5BA1\u6838"}],v=function(){var c=(0,_.useState)(""),r=u()(c,2),M=r[0],O=r[1],x=(0,_.useState)(l),o=u()(x,2),C=o[0],f=o[1],g=function(s){var d=s.title;if(!d){i.ZP.warning("\u8BF7\u8F93\u5165\u8BBA\u6587\u540D\u79F0\u8FDB\u884C\u67E5\u8BE2");return}var E=l.filter(function(T){return T.title.toLowerCase().includes(d.toLowerCase())});E.length===0&&i.ZP.info("\u6CA1\u6709\u627E\u5230\u7B26\u5408\u6761\u4EF6\u7684\u8BBA\u6587"),f(E)},B=[{title:"\u8BBA\u6587\u6807\u9898",dataIndex:"title",key:"title"},{title:"\u4F5C\u8005",dataIndex:"authors",key:"authors"},{title:"\u72B6\u6001",dataIndex:"status",key:"status"}];return(0,e.jsxs)("div",{style:{padding:"30px"},children:[(0,e.jsx)("h2",{children:"\u67E5\u8BE2\u7A3F\u4EF6"}),(0,e.jsxs)(a.Z,{onFinish:g,layout:"inline",style:{marginBottom:"20px"},children:[(0,e.jsx)(a.Z.Item,{name:"title",rules:[{required:!0,message:"\u8BF7\u8F93\u5165\u8BBA\u6587\u540D\u79F0"}],children:(0,e.jsx)(m.Z,{placeholder:"\u8F93\u5165\u8BBA\u6587\u6807\u9898",style:{width:"250px"},onChange:function(s){return O(s.target.value)},value:M})}),(0,e.jsx)(a.Z.Item,{children:(0,e.jsx)(D.ZP,{type:"primary",htmlType:"submit",icon:(0,e.jsx)(y.Z,{}),children:"\u67E5\u8BE2"})})]}),(0,e.jsx)(P.Z,{columns:B,dataSource:C,rowKey:"key",pagination:{pageSize:5}})]})};n.default=v}}]);
