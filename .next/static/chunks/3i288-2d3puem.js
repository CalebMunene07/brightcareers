(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,60690,e=>{"use strict";var a=e.i(43476),t=e.i(71645);let r="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";function i({title:e,text:t}){return(0,a.jsxs)("div",{className:"border-b border-slate-200 pb-2 pt-3 sm:col-span-2",children:[(0,a.jsx)("h3",{className:"text-lg font-bold text-brand-dark",children:e}),t&&(0,a.jsx)("p",{className:"mt-1 text-sm text-slate-600",children:t})]})}e.s(["Form",0,function({action:e,fields:s,submitLabel:n,hidden:l,ui:o={submitted:"Submitted",sending:"Sending…",select:"Select…"}}){let[d,u,c]=(0,t.useActionState)(e,{ok:!1,message:""});return d.ok?(0,a.jsxs)("div",{role:"status",className:"rounded-2xl bg-emerald-50 p-8 text-emerald-900 ring-1 ring-emerald-200",children:[(0,a.jsx)("p",{className:"text-lg font-semibold",children:o.submitted}),(0,a.jsx)("p",{className:"mt-2",children:d.message})]}):(0,a.jsxs)("form",{action:u,className:"grid gap-5 sm:grid-cols-2",noValidate:!0,children:[l&&Object.entries(l).map(([e,t])=>(0,a.jsx)("input",{type:"hidden",name:e,value:t},e)),s.map(e=>{if("section"===e.type)return(0,a.jsx)(i,{title:e.label,text:e.hint},e.name);let t=`f-${e.name}`,s=d.errors?.[e.name],n={id:t,name:e.name,required:e.required,placeholder:e.placeholder,defaultValue:e.defaultValue,"aria-invalid":!!s||void 0,"aria-describedby":s?`${t}-error`:e.hint?`${t}-hint`:void 0,className:`${r} ${s?"border-red-500":""}`};return(0,a.jsxs)("div",{className:e.full||"textarea"===e.type?"sm:col-span-2":"",children:[(0,a.jsxs)("label",{htmlFor:t,className:"text-sm font-medium text-slate-800",children:[e.label,e.required&&(0,a.jsx)("span",{className:"text-red-600",children:" *"})]}),"textarea"===e.type?(0,a.jsx)("textarea",{rows:5,...n}):"select"===e.type?(0,a.jsxs)("select",{...n,children:[(0,a.jsx)("option",{value:"",children:o.select}),e.options?.map(e=>{let t="string"==typeof e?{value:e,label:e}:e;return(0,a.jsx)("option",{value:t.value,children:t.label},t.value)})]}):"file"===e.type?(0,a.jsx)("input",{...n,defaultValue:void 0,type:"file",accept:e.accept,className:`${n.className} file:mr-3 file:rounded-md file:border-0 file:bg-brand/10 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-brand`}):(0,a.jsx)("input",{type:e.type??"text",...n}),e.hint&&!s&&(0,a.jsx)("p",{id:`${t}-hint`,className:"mt-1.5 text-xs text-slate-500",children:e.hint}),s&&(0,a.jsx)("p",{id:`${t}-error`,className:"mt-1.5 text-sm text-red-600",children:s})]},e.name)}),(0,a.jsxs)("div",{className:"sm:col-span-2",children:[d.message&&!d.ok&&(0,a.jsx)("p",{role:"alert",className:"mb-4 text-sm font-medium text-red-600",children:d.message}),(0,a.jsx)("button",{type:"submit",disabled:c,className:"w-full rounded-full bg-brand px-8 py-3 font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60 sm:w-auto",children:c?o.sending:n})]})]})},"SectionHeading",0,i,"inputClass",0,r])},59825,77675,e=>{"use strict";var a=e.i(43476),t=e.i(60690),r=e.i(88915),i=e.i(19463);function s({id:e,label:t,required:r,error:i,hint:n,className:l="",children:o}){return(0,a.jsxs)("div",{className:l,children:[(0,a.jsxs)("label",{htmlFor:e,className:"text-sm font-medium text-slate-800",children:[t,r&&(0,a.jsx)("span",{className:"text-brand",children:" *"})]}),o,n&&!i&&(0,a.jsx)("p",{className:"mt-1.5 text-xs text-slate-500",children:n}),i&&(0,a.jsx)("p",{id:`${e}-error`,className:"mt-1.5 text-sm text-red-600",children:i})]})}function n(e,a){return{id:e,name:e,"aria-invalid":!!a||void 0,"aria-describedby":a?`${e}-error`:void 0,className:`${t.inputClass} ${a?"border-red-500":""}`}}function l({type:e="text",placeholder:t,autoComplete:r,min:i,max:s,...o}){return(0,a.jsx)("input",{...n(o.id,o.error),type:e,value:o.value,placeholder:t,autoComplete:r,min:i,max:s,onChange:e=>o.onChange(e.target.value)})}function o({options:e,placeholder:t,...r}){return(0,a.jsxs)("select",{...n(r.id,r.error),value:r.value,onChange:e=>r.onChange(e.target.value),children:[void 0!==t&&(0,a.jsx)("option",{value:"",children:t}),e.map(e=>{let t="string"==typeof e?{value:e,label:e}:e;return(0,a.jsx)("option",{value:t.value,children:t.label},t.value)})]})}function d(e){return(0,a.jsx)("textarea",{...n(e.id,e.error),rows:4,value:e.value,placeholder:e.placeholder,onChange:a=>e.onChange(a.target.value)})}async function u(e,a=2e3,t=.85){if(!e.type.startsWith("image/")||e.size<614400)return e;try{let r=await createImageBitmap(e),i=Math.min(1,a/Math.max(r.width,r.height)),s=document.createElement("canvas");s.width=Math.round(r.width*i),s.height=Math.round(r.height*i),s.getContext("2d")?.drawImage(r,0,0,s.width,s.height);let n=await new Promise(e=>s.toBlob(e,"image/jpeg",t));if(!n||n.size>=e.size)return e;return new File([n],e.name.replace(/\.\w+$/,"")+".jpg",{type:"image/jpeg"})}catch{return e}}function c(e){return e>1048576?`${(e/1024/1024).toFixed(1)} MB`:`${Math.max(1,Math.round(e/1024))} KB`}function m({id:e,label:t,required:i,file:s,error:n,hint:l,accept:o,onPick:d,L:u}){return(0,a.jsxs)("div",{className:"sm:col-span-2",children:[(0,a.jsxs)("p",{className:"text-sm font-medium text-slate-800",children:[t,i&&(0,a.jsx)("span",{className:"text-brand",children:" *"})]}),(0,a.jsxs)("div",{className:`mt-1.5 flex flex-wrap items-center gap-3 rounded-xl border-2 border-dashed p-4 ${n?"border-red-300 bg-red-50/40":s?"border-brand/40 bg-brand/5":"border-slate-200"}`,children:[(0,a.jsx)(r.Icon,{name:s?"check":"file",className:`h-6 w-6 shrink-0 ${s?"text-brand":"text-slate-400"}`}),(0,a.jsx)("p",{className:"min-w-0 flex-1 truncate text-sm text-slate-600",children:s?`${s.name} \xb7 ${c(s.size)}`:l||u("PDF, JPG or PNG")}),s&&!i&&(0,a.jsx)("button",{type:"button",onClick:()=>d(void 0),className:"rounded-lg px-3 py-2 text-sm text-slate-600 hover:text-red-600",children:u("Remove")}),(0,a.jsxs)("label",{htmlFor:e,className:"cursor-pointer rounded-lg bg-white px-3.5 py-2 text-sm font-semibold text-brand ring-1 ring-brand/40 focus-within:ring-2 focus-within:ring-brand hover:bg-brand/5",children:[u(s?"Replace file":"Choose file"),(0,a.jsx)("input",{id:e,type:"file",accept:o,className:"sr-only","aria-invalid":!!n||void 0,"aria-describedby":n?`${e}-error`:void 0,onChange:e=>{d(e.target.files?.[0]),e.target.value=""}})]})]}),n&&(0,a.jsx)("p",{id:`${e}-error`,className:"mt-1.5 text-sm text-red-600",children:n})]})}e.s(["CardHeading",0,function({icon:e,title:t,text:r}){return(0,a.jsxs)("div",{className:"flex items-start gap-4 border-b border-slate-100 pb-5",children:[(0,a.jsx)("span",{className:"flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand",children:e}),(0,a.jsxs)("div",{children:[(0,a.jsx)("h2",{className:"text-xl font-bold text-brand-dark",children:t}),r&&(0,a.jsx)("p",{className:"mt-1 text-sm text-slate-600",children:r})]})]})},"CustomFields",0,function({fields:e,values:r,onChange:n,files:u,onFile:c,errors:p,L:b}){return 0===e.length?null:(0,a.jsx)("div",{className:"grid gap-4 sm:grid-cols-2",children:e.map(e=>{let g=e.hint?b(e.hint):void 0;if("section"===e.type)return(0,a.jsx)(t.SectionHeading,{title:b(e.label),text:g},e.key);if("file"===e.type)return(0,a.jsx)(m,{id:e.key,label:b(e.label),required:e.required,file:u[e.key],error:p[e.key],hint:g,accept:i.CUSTOM_FILE_ACCEPT,onPick:a=>c(e.key,a),L:b},e.key);let h={id:e.key,value:r[e.key]??"",onChange:n(e.key),error:p[e.key]};return(0,a.jsx)(s,{id:e.key,label:b(e.label),required:e.required,error:p[e.key],hint:g,className:"textarea"===e.type?"sm:col-span-2":"",children:"select"===e.type?(0,a.jsx)(o,{...h,placeholder:b("Select…"),options:e.options.map(e=>({value:e,label:b(e)}))}):"textarea"===e.type?(0,a.jsx)(d,{...h}):(0,a.jsx)(l,{...h,type:e.type})},e.key)})})},"Field",0,s,"FileBox",0,m,"PaymentInstructions",0,function({text:e,L:t}){return e.trim()?(0,a.jsxs)("div",{className:"rounded-xl p-4 ring-1 ring-slate-200",children:[(0,a.jsx)("p",{className:"text-sm font-bold text-brand-dark",children:t("Payment instructions")}),(0,a.jsx)("p",{className:"mt-1 whitespace-pre-line text-sm text-slate-700",children:t(e)})]}):null},"Select",0,o,"SummaryRow",0,function({label:e,value:t,strong:r}){return(0,a.jsxs)("div",{className:"flex items-baseline justify-between gap-4 py-2 text-sm",children:[(0,a.jsx)("dt",{className:"text-slate-500",children:e}),(0,a.jsx)("dd",{className:`text-right ${r?"text-base font-bold text-brand-dark":"font-semibold text-slate-800"}`,children:t})]})},"TextArea",0,d,"TextInput",0,l,"formatBytes",0,c,"makeL",0,function(e){return(a,t)=>{let r=e[a]??a;return t?r.replace(/\{(\w+)\}/g,(e,a)=>a in t?String(t[a]):e):r}},"shrinkImage",0,u],59825),e.i(25599);let p={Canada:["Caregiving","Welding","CNA","Nursing","Cleaning","Farm work","Receptionist","Supermarket attendant","Cruise ship jobs"],"United States":["Caregiving","Welding","CNA","Nursing","Cleaning","Farm work","Receptionist","Supermarket attendant","Cruise ship jobs"],"United Kingdom":["Caregiving","Welding","CNA","Nursing","Cleaning","Farm work","Receptionist","Supermarket attendant","Cruise ship jobs"],Germany:["Au pair","Cleaning","Housekeeping","Waiter/waitress","Farm work","Nursing"],Luxembourg:["Caregiving","Cleaning","Welding","Driving","Nursing","Housekeeping","Waiter/waitress"],Netherlands:["Au pair","Cleaning","Housekeeping","Waiter/waitress","Farm work","Nursing"],Finland:["Caregiving","Cleaning","Housekeeping","Nursing","Farm work","Welding"],Turkey:["Nanny","Cleaning","Housekeeping","Farm work","Driving","Riders","Factory work","Welding"],Australia:["Farming","Teaching","Caregiving","Nursing","Driving","Construction","Clinical medicine"],"New Zealand":["Farming","Teaching","Caregiving","Nursing","Driving","Construction","Hospitality"]},b=Object.keys(p),g="Student visa";e.s(["DOC_ACCEPT",0,".pdf,.jpg,.jpeg,.png,.webp","DOC_TYPES",0,["application/pdf","image/jpeg","image/png","image/webp"],"MAX_UPLOAD_BYTES",0,4194304,"applicantCounts",0,["1","2","3","4+"],"asksEmployment",0,e=>e!==g,"destinationNames",0,b,"destinations",0,p,"employmentFields",0,["employment","occupation","employer","income"],"employmentStatuses",0,["Employed","Self-employed","Student","Between roles","Retired"],"genders",0,["Female","Male","Non-binary","Prefer not to say"],"travelClasses",0,["Economy","Premium economy","Business"],"visaDocuments",0,[{key:"passport",label:"Passport bio page",required:!0},{key:"cv",label:"Curriculum vitae / resume",required:!0},{key:"certificates",label:"Relevant certificates",required:!1},{key:"photo",label:"Passport-sized photograph",required:!0}],"visaTypes",0,["Work visa","Skilled worker visa","Seasonal work visa","Care visa",g]],77675)},7868,e=>{"use strict";var a=e.i(43476),t=e.i(71645),r=e.i(95187);let i=(0,r.createServerReference)("605b0f452e54238f6730d2b789363f0f8903b2db49",r.callServer,void 0,r.findSourceMapURL,"submitTicketRequest");var s=e.i(88915),n=e.i(59825),l=e.i(5696),o=e.i(19463),d=e.i(25599),u=e.i(77675);let c=()=>new Date().toISOString().slice(0,10);e.s(["TicketForm",0,function({labels:e,layout:r,pricing:m}){let p=(0,n.makeL)(e),[b,g,h]=(0,t.useActionState)(i,{ok:!1,message:""}),[x,y]=(0,t.useState)(()=>({from:"",to:"",departDate:"",returnDate:"",passengers:"1",travelClass:u.travelClasses[0],email:"",notes:"",...Object.fromEntries(r.custom.map(e=>[e.key,""]))})),[f,A]=(0,t.useState)({}),[v,k]=(0,t.useState)({}),S=e=>a=>y(t=>({...t,[e]:a})),N={...b.errors,...v},j=e=>(0,o.shown)(r,e),C=e=>(0,o.isRequired)(r,e);async function F(e,a,t,r){if(k(a=>{let t={...a};return delete t[e],t}),!a)return A(a=>({...a,[e]:void 0}));if(!t.includes(a.type))return k(a=>({...a,[e]:p(r)}));let i=await (0,n.shrinkImage)(a);if(i.size>u.MAX_UPLOAD_BYTES)return k(a=>({...a,[e]:p("Please upload a file under 4 MB.")}));A(a=>({...a,[e]:i}))}let q=(0,d.routeFee)(m.routeFees,x.from,x.to),w=l.countryNames.map(e=>({value:e,label:p(e)}));return b.ok?(0,a.jsxs)("div",{role:"status",className:"rounded-2xl bg-white p-8 text-center ring-1 ring-slate-200 sm:p-12",children:[(0,a.jsx)("span",{className:"mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600",children:(0,a.jsx)(s.Icon,{name:"check",className:"h-8 w-8"})}),(0,a.jsx)("h2",{className:"mt-5 text-2xl font-bold text-brand-dark",children:p("Request received")}),(0,a.jsx)("p",{className:"mt-3 text-slate-600",children:b.message})]}):(0,a.jsxs)("div",{className:"grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start",children:[(0,a.jsxs)("form",{onSubmit:function(e){e.preventDefault();let a={};for(let e of(C("passportFile")&&!f.passportFile&&(a.passportFile=p("Please upload this document.")),r.custom))"file"===e.type&&e.required&&!f[e.key]&&(a[e.key]=p("Please upload this document."));let i=Object.values(f).reduce((e,a)=>e+(a?.size??0),0),s=Object.keys(a)[0];if(s){k(e=>({...e,...a})),document.getElementById(s)?.focus();return}if(i>u.MAX_UPLOAD_BYTES){let e=Object.keys(f).find(e=>f[e])??"passportFile";k(a=>({...a,[e]:p("Your files are too large together. Please upload files under 4 MB in total.")}));return}let n=new FormData(e.currentTarget);for(let[e,a]of Object.entries(f))a&&n.set(e,a);(0,t.startTransition)(()=>g(n))},noValidate:!0,className:"min-w-0 rounded-2xl bg-white p-5 ring-1 ring-slate-200 sm:p-8",children:[(0,a.jsx)(n.CardHeading,{icon:(0,a.jsx)(s.Icon,{name:"plane",className:"h-5 w-5"}),title:p("Tell us about your journey"),text:p("We will use these details to prepare a booking request.")}),(0,a.jsxs)("div",{className:"mt-6 grid gap-4 sm:grid-cols-2",children:[(0,a.jsx)(n.Field,{id:"from",label:p("Departure country"),required:C("from"),error:N.from,children:(0,a.jsx)(n.Select,{id:"from",value:x.from,onChange:S("from"),error:N.from,placeholder:p("Select departure country"),options:w})}),(0,a.jsx)(n.Field,{id:"to",label:p("Destination"),required:C("to"),error:N.to,children:(0,a.jsx)(n.Select,{id:"to",value:x.to,onChange:S("to"),error:N.to,placeholder:p("Select destination"),options:w})}),j("departDate")&&(0,a.jsx)(n.Field,{id:"departDate",label:p("Departure date"),required:C("departDate"),error:N.departDate,children:(0,a.jsx)(n.TextInput,{id:"departDate",type:"date",min:c(),value:x.departDate,onChange:S("departDate"),error:N.departDate})}),j("returnDate")&&(0,a.jsx)(n.Field,{id:"returnDate",label:p("Return date"),required:C("returnDate"),error:N.returnDate,hint:C("returnDate")?void 0:p("Leave empty for a one-way ticket."),children:(0,a.jsx)(n.TextInput,{id:"returnDate",type:"date",min:x.departDate||c(),value:x.returnDate,onChange:S("returnDate"),error:N.returnDate})}),j("passengers")&&(0,a.jsx)(n.Field,{id:"passengers",label:p("Passengers"),required:C("passengers"),error:N.passengers,children:(0,a.jsx)(n.Select,{id:"passengers",value:x.passengers,onChange:S("passengers"),error:N.passengers,options:["1","2","3","4","5","6","7","8","9"]})}),j("travelClass")&&(0,a.jsx)(n.Field,{id:"travelClass",label:p("Travel class"),required:C("travelClass"),error:N.travelClass,children:(0,a.jsx)(n.Select,{id:"travelClass",value:x.travelClass,onChange:S("travelClass"),error:N.travelClass,options:u.travelClasses.map(e=>({value:e,label:p(e)}))})}),j("email")&&(0,a.jsx)(n.Field,{id:"email",label:p("Email address"),required:C("email"),error:N.email,className:"sm:col-span-2",children:(0,a.jsx)(n.TextInput,{id:"email",type:"email",value:x.email,onChange:S("email"),error:N.email,placeholder:"name@example.com",autoComplete:"email"})}),j("passportFile")&&(0,a.jsx)(n.FileBox,{id:"passportFile",label:p("Travelling passport (bio page)"),required:C("passportFile"),file:f.passportFile,error:N.passportFile,accept:u.DOC_ACCEPT,onPick:e=>void F("passportFile",e,u.DOC_TYPES,"Upload a PDF, JPG, PNG or WebP file."),L:p}),j("notes")&&(0,a.jsx)(n.Field,{id:"notes",label:p("Additional notes"),required:C("notes"),error:N.notes,className:"sm:col-span-2",children:(0,a.jsx)(n.TextArea,{id:"notes",value:x.notes,onChange:S("notes"),placeholder:p("Preferred airlines, flexible dates, baggage needs…")})})]}),r.custom.length>0&&(0,a.jsx)("div",{className:"mt-4",children:(0,a.jsx)(n.CustomFields,{fields:r.custom,values:x,onChange:S,files:f,onFile:(e,a)=>void F(e,a,o.CUSTOM_FILE_TYPES,"Upload a PDF, Word, JPG, PNG or WebP file."),errors:N,L:p})}),b.message&&!b.ok&&(0,a.jsx)("p",{role:"alert",className:"mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700",children:b.message}),(0,a.jsx)("div",{className:"mt-8 border-t border-slate-100 pt-6",children:(0,a.jsxs)("button",{type:"submit",disabled:h,className:"w-full rounded-full bg-brand px-8 py-3 font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60 sm:w-auto",children:[h?p("Sending…"):p("Request flight options")," →"]})})]}),(0,a.jsxs)("aside",{className:"space-y-4 lg:sticky lg:top-28",children:[(0,a.jsxs)("div",{className:"rounded-2xl border-t-4 border-brand bg-white p-6 ring-1 ring-slate-200",children:[(0,a.jsxs)("h2",{className:"flex items-center gap-2 font-bold text-brand-dark",children:[(0,a.jsx)(s.Icon,{name:"search",className:"h-5 w-5 text-brand"}),p("Booking estimate")]}),(0,a.jsxs)("div",{className:"mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-y border-slate-100 py-4",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("p",{className:"text-xs font-semibold uppercase tracking-wider text-slate-500",children:p("From")}),(0,a.jsx)("p",{className:"mt-1 font-semibold text-brand-dark",children:x.from?p(x.from):p("Select origin")})]}),(0,a.jsx)("span",{"aria-hidden":"true",className:"text-slate-400",children:"→"}),(0,a.jsxs)("div",{className:"text-right",children:[(0,a.jsx)("p",{className:"text-xs font-semibold uppercase tracking-wider text-slate-500",children:p("To")}),(0,a.jsx)("p",{className:"mt-1 font-semibold text-brand-dark",children:x.to?p(x.to):p("Select destination")})]})]}),(0,a.jsxs)("dl",{className:"mt-2 divide-y divide-slate-100",children:[j("passengers")&&(0,a.jsx)(n.SummaryRow,{label:p("Passengers"),value:x.passengers}),j("travelClass")&&(0,a.jsx)(n.SummaryRow,{label:p("Travel class"),value:p(x.travelClass)}),j("returnDate")&&(0,a.jsx)(n.SummaryRow,{label:p("Trip"),value:x.returnDate?p("Return"):p("One way")}),(0,a.jsx)(n.SummaryRow,{label:p("Booking service fee"),value:q?(0,d.usd)(q):"—",strong:!0})]}),(0,a.jsx)("p",{className:"mt-4 text-xs text-slate-500",children:p("Airline fare, taxes, baggage, seat charges and any applicable booking fees will be quoted after we review your route and travel preferences.")})]}),m.paymentInstructions.trim()&&(0,a.jsx)("div",{className:"rounded-2xl bg-white ring-1 ring-slate-200 [&>div]:ring-0",children:(0,a.jsx)(n.PaymentInstructions,{text:m.paymentInstructions,L:p})}),(0,a.jsxs)("div",{className:"rounded-2xl bg-brand-dark p-6 text-white",children:[(0,a.jsx)("h2",{className:"font-bold",children:p("What happens next?")}),(0,a.jsx)("p",{className:"mt-1 text-sm text-white/80",children:p("We review your request, compare available options and contact you before any ticket purchase is made.")})]})]})]})}],7868)},19463,e=>{"use strict";let a=[{id:"visa",title:"Visa application",description:"The five-step application at /visa-application.",page:"/visa-application",inbox:"visa",sections:[{id:"personal",label:"Step 1 · Personal information"},{id:"travel",label:"Step 2 · Travel information"},{id:"documents",label:"Step 3 · Supporting documents"}],fields:[{key:"firstName",label:"First name",required:!0,section:"personal"},{key:"middleName",label:"Middle name",required:!1,section:"personal"},{key:"lastName",label:"Last name",required:!0,section:"personal"},{key:"birthDate",label:"Date of birth",required:!0,section:"personal"},{key:"gender",label:"Gender",required:!0,section:"personal"},{key:"nationality",label:"Nationality",required:!0,section:"personal"},{key:"passport",label:"Passport number",required:!0,section:"personal"},{key:"issueDate",label:"Date of issue",required:!0,section:"personal"},{key:"expiryDate",label:"Date of expiry",required:!0,section:"personal"},{key:"issuePlace",label:"Place of issue",required:!0,section:"personal"},{key:"authority",label:"Issuing authority",required:!0,section:"personal"},{key:"email",label:"Email address",required:!0,section:"personal"},{key:"phone",label:"Phone number (with country code)",required:!0,section:"personal"},{key:"address1",label:"Address line 1",required:!0,section:"personal"},{key:"address2",label:"Address line 2",required:!1,section:"personal"},{key:"city",label:"City",required:!0,section:"personal"},{key:"province",label:"State / Province",required:!0,section:"personal"},{key:"postal",label:"Postal / Zip code",required:!0,section:"personal"},{key:"homeCountry",label:"Country (address)",required:!0,section:"personal"},{key:"originCountry",label:"Departure country",required:!0,section:"travel"},{key:"country",label:"Destination country",required:!0,core:!0,section:"travel"},{key:"job",label:"Available job role",required:!0,core:!0,section:"travel"},{key:"visaType",label:"Visa type",required:!0,core:!0,section:"travel"},{key:"startDate",label:"Preferred start date",required:!1,section:"travel"},{key:"applicants",label:"Number of applicants",required:!0,section:"travel"},{key:"employment",label:"Current employment status (not asked for student visas)",required:!0,section:"travel"},{key:"occupation",label:"Occupation (not asked for student visas)",required:!0,section:"travel"},{key:"employer",label:"Employer / Company name (not asked for student visas)",required:!1,section:"travel"},{key:"income",label:"Monthly income (not asked for student visas)",required:!1,section:"travel"},{key:"doc_passport",label:"Passport bio page",required:!0,section:"documents"},{key:"doc_cv",label:"Curriculum vitae / resume",required:!0,section:"documents"},{key:"doc_certificates",label:"Relevant certificates",required:!1,section:"documents"},{key:"doc_photo",label:"Passport-sized photograph",required:!0,section:"documents"},{key:"paymentMethod",label:"Payment method",required:!0,core:!0}]},{id:"ticket",title:"Air ticket booking",description:"The booking request at /air-ticket-booking.",page:"/air-ticket-booking",inbox:"tickets",fields:[{key:"from",label:"Departure country",required:!0,core:!0},{key:"to",label:"Destination",required:!0,core:!0},{key:"departDate",label:"Departure date",required:!0},{key:"returnDate",label:"Return date",required:!1},{key:"passengers",label:"Passengers",required:!0},{key:"travelClass",label:"Travel class",required:!0},{key:"email",label:"Email address",required:!0},{key:"passportFile",label:"Travelling passport (bio page)",required:!0},{key:"notes",label:"Additional notes",required:!1}]},{id:"application",title:"Job application",description:"The “Apply for this job” form on every job page.",page:"/jobs",inbox:"applications",fields:[{key:"name",label:"Full name",required:!0},{key:"email",label:"Email",required:!0},{key:"phone",label:"Phone",required:!0},{key:"location",label:"Current location",required:!1},{key:"cv",label:"CV (PDF or Word, max 4 MB)",required:!0},{key:"message",label:"Cover note",required:!1}]},{id:"contact",title:"Contact us",description:"The message form at /contact-us.",page:"/contact-us",inbox:"messages",fields:[{key:"name",label:"Full name",required:!0},{key:"email",label:"Email",required:!0},{key:"phone",label:"Phone",required:!1},{key:"country",label:"Country",required:!1},{key:"topic",label:"I am…",required:!1},{key:"message",label:"Message",required:!0}]},{id:"staff",title:"Request staff",description:"The employer form at /employers/request-staff.",page:"/employers/request-staff",inbox:"requests",fields:[{key:"name",label:"Your name",required:!0},{key:"company",label:"Company",required:!0},{key:"email",label:"Work email",required:!0},{key:"phone",label:"Phone",required:!1},{key:"service",label:"Service",required:!1},{key:"industry",label:"Industry",required:!1},{key:"role",label:"Role(s) you're hiring for",required:!0},{key:"headcount",label:"Number of people",required:!1},{key:"start",label:"Ideal start date",required:!1},{key:"details",label:"Tell us more",required:!0}]}];e.s(["CUSTOM_FILE_ACCEPT",0,".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx","CUSTOM_FILE_TYPES",0,["application/pdf","image/jpeg","image/png","image/webp","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"],"contactFields",0,["email","name","firstName","lastName"],"customFieldTypes",0,[{id:"text",label:"Short text"},{id:"textarea",label:"Long text"},{id:"email",label:"Email"},{id:"tel",label:"Phone"},{id:"number",label:"Number"},{id:"date",label:"Date"},{id:"select",label:"Dropdown"},{id:"file",label:"File upload"},{id:"section",label:"Section heading"}],"customIn",0,function(e,a){return void 0===a?e.custom:e.custom.filter(e=>e.section===a)},"getFormDef",0,function(e){return a.find(a=>a.id===e)},"isRequired",0,function(e,a){let t=e.fields[a];return t?t.shown&&t.required:e.custom.some(e=>e.key===a&&e.required)},"resolveLayout",0,function(e,a){let t={};for(let r of e.fields){let e=a.fields[r.key]??{};t[r.key]={shown:r.core||!e.hidden,required:e.required??r.required}}return{fields:t,custom:a.custom}},"shown",0,function(e,a){return e.fields[a]?.shown??!0}])},25599,5696,e=>{"use strict";let a={AF:"Africa",AS:"Asia",EU:"Europe",NA:"North America",SA:"South America",OC:"Oceania"},t=`Afghanistan|93|AS
Albania|355|EU
Algeria|213|AF
Andorra|376|EU
Angola|244|AF
Antigua and Barbuda|1 268|NA
Argentina|54|SA
Armenia|374|AS
Australia|61|OC
Austria|43|EU
Azerbaijan|994|AS
Bahamas|1 242|NA
Bahrain|973|AS
Bangladesh|880|AS
Barbados|1 246|NA
Belarus|375|EU
Belgium|32|EU
Belize|501|NA
Benin|229|AF
Bhutan|975|AS
Bolivia|591|SA
Bosnia and Herzegovina|387|EU
Botswana|267|AF
Brazil|55|SA
Brunei|673|AS
Bulgaria|359|EU
Burkina Faso|226|AF
Burundi|257|AF
Cambodia|855|AS
Cameroon|237|AF
Canada|1|NA
Cape Verde|238|AF
Central African Republic|236|AF
Chad|235|AF
Chile|56|SA
China|86|AS
Colombia|57|SA
Comoros|269|AF
Congo|242|AF
Costa Rica|506|NA
C\xf4te d’Ivoire|225|AF
Croatia|385|EU
Cuba|53|NA
Cyprus|357|EU
Czechia|420|EU
Democratic Republic of the Congo|243|AF
Denmark|45|EU
Djibouti|253|AF
Dominica|1 767|NA
Dominican Republic|1 809|NA
Ecuador|593|SA
Egypt|20|AF
El Salvador|503|NA
Equatorial Guinea|240|AF
Eritrea|291|AF
Estonia|372|EU
Eswatini|268|AF
Ethiopia|251|AF
Fiji|679|OC
Finland|358|EU
France|33|EU
Gabon|241|AF
Gambia|220|AF
Georgia|995|AS
Germany|49|EU
Ghana|233|AF
Greece|30|EU
Grenada|1 473|NA
Guatemala|502|NA
Guinea|224|AF
Guinea-Bissau|245|AF
Guyana|592|SA
Haiti|509|NA
Honduras|504|NA
Hong Kong|852|AS
Hungary|36|EU
Iceland|354|EU
India|91|AS
Indonesia|62|AS
Iran|98|AS
Iraq|964|AS
Ireland|353|EU
Israel|972|AS
Italy|39|EU
Jamaica|1 876|NA
Japan|81|AS
Jordan|962|AS
Kazakhstan|7|AS
Kenya|254|AF
Kiribati|686|OC
Kosovo|383|EU
Kuwait|965|AS
Kyrgyzstan|996|AS
Laos|856|AS
Latvia|371|EU
Lebanon|961|AS
Lesotho|266|AF
Liberia|231|AF
Libya|218|AF
Liechtenstein|423|EU
Lithuania|370|EU
Luxembourg|352|EU
Madagascar|261|AF
Malawi|265|AF
Malaysia|60|AS
Maldives|960|AS
Mali|223|AF
Malta|356|EU
Marshall Islands|692|OC
Mauritania|222|AF
Mauritius|230|AF
Mexico|52|NA
Micronesia|691|OC
Moldova|373|EU
Monaco|377|EU
Mongolia|976|AS
Montenegro|382|EU
Morocco|212|AF
Mozambique|258|AF
Myanmar|95|AS
Namibia|264|AF
Nauru|674|OC
Nepal|977|AS
Netherlands|31|EU
New Zealand|64|OC
Nicaragua|505|NA
Niger|227|AF
Nigeria|234|AF
North Korea|850|AS
North Macedonia|389|EU
Norway|47|EU
Oman|968|AS
Pakistan|92|AS
Palau|680|OC
Palestine|970|AS
Panama|507|NA
Papua New Guinea|675|OC
Paraguay|595|SA
Peru|51|SA
Philippines|63|AS
Poland|48|EU
Portugal|351|EU
Qatar|974|AS
Romania|40|EU
Russia|7|EU
Rwanda|250|AF
Saint Kitts and Nevis|1 869|NA
Saint Lucia|1 758|NA
Saint Vincent and the Grenadines|1 784|NA
Samoa|685|OC
San Marino|378|EU
S\xe3o Tom\xe9 and Pr\xedncipe|239|AF
Saudi Arabia|966|AS
Senegal|221|AF
Serbia|381|EU
Seychelles|248|AF
Sierra Leone|232|AF
Singapore|65|AS
Slovakia|421|EU
Slovenia|386|EU
Solomon Islands|677|OC
Somalia|252|AF
South Africa|27|AF
South Korea|82|AS
South Sudan|211|AF
Spain|34|EU
Sri Lanka|94|AS
Sudan|249|AF
Suriname|597|SA
Sweden|46|EU
Switzerland|41|EU
Syria|963|AS
Taiwan|886|AS
Tajikistan|992|AS
Tanzania|255|AF
Thailand|66|AS
Timor-Leste|670|AS
Togo|228|AF
Tonga|676|OC
Trinidad and Tobago|1 868|NA
Tunisia|216|AF
Turkey|90|EU
Turkmenistan|993|AS
Tuvalu|688|OC
Uganda|256|AF
Ukraine|380|EU
United Arab Emirates|971|AS
United Kingdom|44|EU
United States|1|NA
Uruguay|598|SA
Uzbekistan|998|AS
Vanuatu|678|OC
Vatican City|379|EU
Venezuela|58|SA
Vietnam|84|AS
Yemen|967|AS
Zambia|260|AF
Zimbabwe|263|AF`.split("\n").map(e=>{let[t,r,i]=e.split("|");return{name:t,dial:`+${r}`,continent:a[i]}}),r=t.map(e=>e.name),i=new Map(t.map(e=>[e.name,e]));function s(e){return i.get(e)}let n=t.map(e=>({value:e.name,label:`${e.name} (${e.dial})`}));e.s(["countryNames",0,r,"dialOptions",0,n,"findCountry",0,s],5696),e.s(["ROUTE_FEES_NOTE",0,"{same} within one country · {continent} within one continent · {euna} between Europe and North America · {other} other international routes","feesTotal",0,function(e){return e.reduce((e,a)=>e+a.amount,0)},"routeFee",0,function(e,a,t){if(!a||!t)return 0;if(a===t)return e.sameCountry;let r=s(a)?.continent,i=s(t)?.continent;return r&&r===i?e.sameContinent:"Europe"===r&&"North America"===i||"North America"===r&&"Europe"===i?e.europeNorthAmerica:e.other},"routeFeesVars",0,function(e){let a=e=>`USD ${Number.isInteger(e)?e:e.toFixed(2)}`;return{same:a(e.sameCountry),continent:a(e.sameContinent),euna:a(e.europeNorthAmerica),other:a(e.other)}},"usd",0,function(e){return`USD ${e.toFixed(2)}`}],25599)}]);