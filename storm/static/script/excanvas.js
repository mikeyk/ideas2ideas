if(!window.CanvasRenderingContext2D){(function(){var e=Math,p=e.round,b=e.sin,a=e.cos,n=10,l=n/2,U={init:function(E){var A=E||document;if(/MSIE/.test(navigator.userAgent)&&!window.opera){var F=this;A.attachEvent("onreadystatechange",function(){F.r(A)})}},r:function(E){if(E.readyState=="complete"){if(!E.namespaces.s){E.namespaces.add("g_vml_","urn:schemas-microsoft-com:vml")}var A=E.createStyleSheet();A.cssText="canvas{display:inline-block;overflow:hidden;text-align:left;width:300px;height:150px}g_vml_\\:*{behavior:url(#default#VML)}";var G=E.getElementsByTagName("canvas");for(var F=0;F<G.length;F++){if(!G[F].getContext){this.initElement(G[F])}}}},q:function(E){var A=E.outerHTML,H=E.ownerDocument.createElement(A);if(A.slice(-2)!="/>"){var G="/"+E.tagName,F;while((F=E.nextSibling)&&F.tagName!=G){F.removeNode()}if(F){F.removeNode()}}E.parentNode.replaceChild(H,E);return H},initElement:function(E){E=this.q(E);E.getContext=function(){if(this.l){return this.l}return this.l=new c(this)};E.attachEvent("onpropertychange",C);E.attachEvent("onresize",B);var A=E.attributes;if(A.width&&A.width.specified){E.style.width=A.width.nodeValue+"px"}else{E.width=E.clientWidth}if(A.height&&A.height.specified){E.style.height=A.height.nodeValue+"px"}else{E.height=E.clientHeight}return E}};function C(E){var A=E.srcElement;switch(E.propertyName){case"width":A.style.width=A.attributes.width.nodeValue+"px";A.getContext().clearRect();break;case"height":A.style.height=A.attributes.height.nodeValue+"px";A.getContext().clearRect();break}}function B(E){var A=E.srcElement;if(A.firstChild){A.firstChild.style.width=A.clientWidth+"px";A.firstChild.style.height=A.clientHeight+"px"}}U.init();var T=[];for(var k=0;k<16;k++){for(var h=0;h<16;h++){T[k*16+h]=k.toString(16)+h.toString(16)}}function d(){return[[1,0,0],[0,1,0],[0,0,1]]}function g(E,A){var J=d();for(var I=0;I<3;I++){for(var H=0;H<3;H++){var G=0;for(var F=0;F<3;F++){G+=E[I][F]*A[F][H]}J[I][H]=G}}return J}function Z(E,A){A.fillStyle=E.fillStyle;A.lineCap=E.lineCap;A.lineJoin=E.lineJoin;A.lineWidth=E.lineWidth;A.miterLimit=E.miterLimit;A.shadowBlur=E.shadowBlur;A.shadowColor=E.shadowColor;A.shadowOffsetX=E.shadowOffsetX;A.shadowOffsetY=E.shadowOffsetY;A.strokeStyle=E.strokeStyle;A.d=E.d;A.e=E.e}function Y(E){var A,J=1;E=String(E);if(E.substring(0,3)=="rgb"){var I=E.indexOf("(",3),H=E.indexOf(")",I+1),G=E.substring(I+1,H).split(",");A="#";for(var F=0;F<3;F++){A+=T[Number(G[F])]}if(G.length==4&&E.substr(3,1)=="a"){J=G[3]}}else{A=E}return[A,J]}function D(A){switch(A){case"butt":return"flat";case"round":return"round";case"square":default:return"square"}}function c(E){this.a=d();this.m=[];this.k=[];this.c=[];this.strokeStyle="#000";this.fillStyle="#000";this.lineWidth=1;this.lineJoin="miter";this.lineCap="butt";this.miterLimit=n*1;this.globalAlpha=1;this.canvas=E;var A=E.ownerDocument.createElement("div");A.style.width=E.clientWidth+"px";A.style.height=E.clientHeight+"px";A.style.overflow="hidden";A.style.position="absolute";E.appendChild(A);this.j=A;this.d=1;this.e=1}var o=c.prototype;o.clearRect=function(){this.j.innerHTML="";this.c=[]};o.beginPath=function(){this.c=[]};o.moveTo=function(E,A){this.c.push({type:"moveTo",x:E,y:A});this.f=E;this.g=A};o.lineTo=function(E,A){this.c.push({type:"lineTo",x:E,y:A});this.f=E;this.g=A};o.bezierCurveTo=function(E,A,I,H,G,F){this.c.push({type:"bezierCurveTo",cp1x:E,cp1y:A,cp2x:I,cp2y:H,x:G,y:F});this.f=G;this.g=F};o.quadraticCurveTo=function(F,A,K,J){var I=this.f+0.6666666666666666*(F-this.f),H=this.g+0.6666666666666666*(A-this.g),G=I+(K-this.f)/3,E=H+(J-this.g)/3;this.bezierCurveTo(I,H,G,E,K,J)};o.arc=function(N,M,L,K,J,H){L*=n;var G=H?"at":"wa",F=N+a(K)*L-l,E=M+b(K)*L-l,A=N+a(J)*L-l,I=M+b(J)*L-l;if(F==A&&!H){F+=0.125}this.c.push({type:G,x:N,y:M,radius:L,xStart:F,yStart:E,xEnd:A,yEnd:I})};o.rect=function(E,A,G,F){this.moveTo(E,A);this.lineTo(E+G,A);this.lineTo(E+G,A+F);this.lineTo(E,A+F);this.closePath()};o.strokeRect=function(E,A,G,F){this.beginPath();this.moveTo(E,A);this.lineTo(E+G,A);this.lineTo(E+G,A+F);this.lineTo(E,A+F);this.closePath();this.stroke()};o.fillRect=function(E,A,G,F){this.beginPath();this.moveTo(E,A);this.lineTo(E+G,A);this.lineTo(E+G,A+F);this.lineTo(E,A+F);this.closePath();this.fill()};o.createLinearGradient=function(E,A,H,G){var F=new f("gradient");return F};o.createRadialGradient=function(E,A,J,I,H,G){var F=new f("gradientradial");F.n=J;F.o=G;F.i.x=E;F.i.y=A;return F};o.drawImage=function(AA,u){var m,j,i,V,S,Q,P,O,W=AA.runtimeStyle.width,R=AA.runtimeStyle.height;AA.runtimeStyle.width="auto";AA.runtimeStyle.height="auto";var M=AA.width,K=AA.height;AA.runtimeStyle.width=W;AA.runtimeStyle.height=R;if(arguments.length==3){m=arguments[1];j=arguments[2];S=(Q=0);P=(i=M);O=(V=K)}else{if(arguments.length==5){m=arguments[1];j=arguments[2];i=arguments[3];V=arguments[4];S=(Q=0);P=M;O=K}else{if(arguments.length==9){S=arguments[1];Q=arguments[2];P=arguments[3];O=arguments[4];m=arguments[5];j=arguments[6];i=arguments[7];V=arguments[8]}else{throw"Invalid number of arguments"}}}var J=this.b(m,j),I=[],H=10,G=10;I.push(" <g_vml_:group",' coordsize="',n*H,",",n*G,'"',' coordorigin="0,0"',' style="width:',H,";height:",G,";position:absolute;");if(this.a[0][0]!=1||this.a[0][1]){var F=[];F.push("M11='",this.a[0][0],"',","M12='",this.a[1][0],"',","M21='",this.a[0][1],"',","M22='",this.a[1][1],"',","Dx='",p(J.x/n),"',","Dy='",p(J.y/n),"'");var N=J,E=this.b(m+i,j),A=this.b(m,j+V),L=this.b(m+i,j+V);N.x=Math.max(N.x,E.x,A.x,L.x);N.y=Math.max(N.y,E.y,A.y,L.y);I.push("padding:0 ",p(N.x/n),"px ",p(N.y/n),"px 0;filter:progid:DXImageTransform.Microsoft.Matrix(",F.join(""),", sizingmethod='clip');")}else{I.push("top:",p(J.y/n),"px;left:",p(J.x/n),"px;")}I.push(' ">','<g_vml_:image src="',AA.src,'"',' style="width:',n*i,";"," height:",n*V,';"',' cropleft="',S/M,'"',' croptop="',Q/K,'"',' cropright="',(M-S-P)/M,'"',' cropbottom="',(K-Q-O)/K,'"'," />","</g_vml_:group>");this.j.insertAdjacentHTML("BeforeEnd",I.join(""))};o.stroke=function(AE){var AD=[],AC=Y(AE?this.fillStyle:this.strokeStyle),AB=AC[0],AA=AC[1]*this.globalAlpha,j=10,i=10;AD.push("<g_vml_:shape",' fillcolor="',AB,'"',' filled="',Boolean(AE),'"',' style="position:absolute;width:',j,";height:",i,';"',' coordorigin="0 0" coordsize="',n*j," ",n*i,'"',' stroked="',!AE,'"',' strokeweight="',this.lineWidth,'"',' strokecolor="',AB,'"',' path="');var V={x:null,y:null},S={x:null,y:null};for(var R=0;R<this.c.length;R++){var m=this.c[R];if(m.type=="moveTo"){AD.push(" m ");var W=this.b(m.x,m.y);AD.push(p(W.x),",",p(W.y))}else{if(m.type=="lineTo"){AD.push(" l ");var W=this.b(m.x,m.y);AD.push(p(W.x),",",p(W.y))}else{if(m.type=="close"){AD.push(" x ")}else{if(m.type=="bezierCurveTo"){AD.push(" c ");var W=this.b(m.x,m.y),P=this.b(m.cp1x,m.cp1y),N=this.b(m.cp2x,m.cp2y);AD.push(p(P.x),",",p(P.y),",",p(N.x),",",p(N.y),",",p(W.x),",",p(W.y))}else{if(m.type=="at"||m.type=="wa"){AD.push(" ",m.type," ");var W=this.b(m.x,m.y),L=this.b(m.xStart,m.yStart),J=this.b(m.xEnd,m.yEnd);AD.push(p(W.x-this.d*m.radius),",",p(W.y-this.e*m.radius)," ",p(W.x+this.d*m.radius),",",p(W.y+this.e*m.radius)," ",p(L.x),",",p(L.y)," ",p(J.x),",",p(J.y))}}}}}if(W){if(V.x==null||W.x<V.x){V.x=W.x}if(S.x==null||W.x>S.x){S.x=W.x}if(V.y==null||W.y<V.y){V.y=W.y}if(S.y==null||W.y>S.y){S.y=W.y}}}AD.push(' ">');if(typeof this.fillStyle=="object"){var H={x:"50%",y:"50%"},G=S.x-V.x,F=S.y-V.y,Q=G>F?G:F;H.x=p(this.fillStyle.i.x/G*100+50)+"%";H.y=p(this.fillStyle.i.y/F*100+50)+"%";var E=[];if(this.fillStyle.p=="gradientradial"){var A=this.fillStyle.n/Q*100,O=this.fillStyle.o/Q*100-A}else{var A=0,O=100}var M={offset:null,color:null},K={offset:null,color:null};this.fillStyle.h.sort(function(r,q){return r.offset-q.offset});for(var R=0;R<this.fillStyle.h.length;R++){var I=this.fillStyle.h[R];E.push(I.offset*O+A,"% ",I.color,",");if(I.offset>M.offset||M.offset==null){M.offset=I.offset;M.color=I.color}if(I.offset<K.offset||K.offset==null){K.offset=I.offset;K.color=I.color}}E.pop();AD.push("<g_vml_:fill",' color="',K.color,'"',' color2="',M.color,'"',' type="',this.fillStyle.p,'"',' focusposition="',H.x,", ",H.y,'"',' colors="',E.join(""),'"',' opacity="',AA,'" />')}else{if(AE){AD.push('<g_vml_:fill color="',AB,'" opacity="',AA,'" />')}else{AD.push("<g_vml_:stroke",' opacity="',AA,'"',' joinstyle="',this.lineJoin,'"',' miterlimit="',this.miterLimit,'"',' endcap="',D(this.lineCap),'"',' weight="',this.lineWidth,'px"',' color="',AB,'" />')}}AD.push("</g_vml_:shape>");this.j.insertAdjacentHTML("beforeEnd",AD.join(""));this.c=[]};o.fill=function(){this.stroke(true)};o.closePath=function(){this.c.push({type:"close"})};o.b=function(E,A){return{x:n*(E*this.a[0][0]+A*this.a[1][0]+this.a[2][0])-l,y:n*(E*this.a[0][1]+A*this.a[1][1]+this.a[2][1])-l}};o.save=function(){var A={};Z(this,A);this.k.push(A);this.m.push(this.a);this.a=g(d(),this.a)};o.restore=function(){Z(this.k.pop(),this);this.a=this.m.pop()};o.translate=function(E,A){var F=[[1,0,0],[0,1,0],[E,A,1]];this.a=g(F,this.a)};o.rotate=function(E){var A=a(E),G=b(E),F=[[A,G,0],[-G,A,0],[0,0,1]];this.a=g(F,this.a)};o.scale=function(E,A){this.d*=E;this.e*=A;var F=[[E,0,0],[0,A,0],[0,0,1]];this.a=g(F,this.a)};o.clip=function(){};o.arcTo=function(){};o.createPattern=function(){return new X};function f(A){this.p=A;this.n=0;this.o=0;this.h=[];this.i={x:0,y:0}}f.prototype.addColorStop=function(E,A){A=Y(A);this.h.push({offset:1-E,color:A})};function X(){}G_vmlCanvasManager=U;CanvasRenderingContext2D=c;CanvasGradient=f;CanvasPattern=X})()};