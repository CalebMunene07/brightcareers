(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,50323,e=>{"use strict";var a=e.i(43476),t=e.i(19463);let i="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20",r="rounded-md px-2 py-1 text-sm text-slate-500 hover:bg-slate-100 hover:text-brand-dark disabled:opacity-30";e.s(["FieldsEditor",0,function({fields:e,onChange:n,sections:s}){let l=(a,t)=>n(e.map(e=>e.key===a?{...e,...t}:e));function o(a,t){let i=[...e];[i[a],i[a+t]]=[i[a+t],i[a]],n(i)}function d(a="text"){n([...e,{key:`custom_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,label:"",type:a,required:!1,options:[],hint:"",section:s?.[0]?.id??""}])}return(0,a.jsxs)("div",{className:"space-y-3",children:[0===e.length&&(0,a.jsx)("p",{className:"text-sm text-slate-500",children:"No custom fields yet."}),e.map((d,c)=>(0,a.jsxs)("div",{className:`rounded-xl p-4 ring-1 ${"section"===d.type?"border-l-4 border-brand bg-brand/5 ring-brand/20":"bg-slate-50 ring-slate-200"}`,children:[(0,a.jsxs)("div",{className:"grid gap-3 sm:grid-cols-[1fr_160px]",children:[(0,a.jsxs)("label",{className:"text-xs font-medium text-slate-600",children:["section"===d.type?"Heading":"Label",(0,a.jsx)("input",{value:d.label,onChange:e=>l(d.key,{label:e.target.value}),placeholder:"section"===d.type?"e.g. Travel details":"e.g. Purpose of visit",className:`${i} mt-1 ${"section"===d.type?"font-semibold":""}`})]}),(0,a.jsxs)("label",{className:"text-xs font-medium text-slate-600",children:["Type",(0,a.jsx)("select",{value:d.type,onChange:e=>l(d.key,{type:e.target.value}),className:`${i} mt-1`,children:t.customFieldTypes.map(e=>(0,a.jsx)("option",{value:e.id,children:e.label},e.id))})]}),"select"===d.type&&(0,a.jsxs)("label",{className:"text-xs font-medium text-slate-600 sm:col-span-2",children:["Choices (one per line)",(0,a.jsx)("textarea",{rows:3,value:d.options.join("\n"),onChange:e=>l(d.key,{options:e.target.value.split("\n")}),placeholder:"Tourism\nVisiting family\nBusiness",className:`${i} mt-1`})]}),(0,a.jsxs)("label",{className:"text-xs font-medium text-slate-600",children:["section"===d.type?"Description (optional)":"Help text (optional)",(0,a.jsx)("input",{value:d.hint,onChange:e=>l(d.key,{hint:e.target.value}),placeholder:"section"===d.type?"Shown under the heading":"Shown under the field",className:`${i} mt-1`})]}),s&&(0,a.jsxs)("label",{className:"text-xs font-medium text-slate-600",children:["Place in",(0,a.jsx)("select",{value:d.section,onChange:e=>l(d.key,{section:e.target.value}),className:`${i} mt-1`,children:s.map(e=>(0,a.jsx)("option",{value:e.id,children:e.label},e.id))})]})]}),(0,a.jsxs)("div",{className:"mt-3 flex flex-wrap items-center gap-2",children:["section"===d.type?(0,a.jsx)("span",{className:"mr-auto text-xs text-slate-500",children:"Groups the fields below it under this heading."}):(0,a.jsxs)("label",{className:"mr-auto inline-flex items-center gap-2 text-sm text-slate-700",children:[(0,a.jsx)("input",{type:"checkbox",checked:d.required,onChange:e=>l(d.key,{required:e.target.checked}),className:"h-4 w-4 accent-[var(--brand)]"}),"Required"]}),(0,a.jsx)("button",{type:"button",onClick:()=>o(c,-1),disabled:0===c,className:r,"aria-label":"Move up",children:"↑"}),(0,a.jsx)("button",{type:"button",onClick:()=>o(c,1),disabled:c===e.length-1,className:r,"aria-label":"Move down",children:"↓"}),(0,a.jsx)("button",{type:"button",onClick:()=>n(e.filter(e=>e.key!==d.key)),className:"rounded-md px-2 py-1 text-sm font-medium text-red-600 hover:bg-red-50",children:"Delete"})]})]},d.key)),(0,a.jsxs)("div",{className:"grid gap-2 sm:grid-cols-2",children:[(0,a.jsx)("button",{type:"button",onClick:()=>d(),className:"rounded-xl border-2 border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-600 hover:border-brand hover:text-brand",children:"+ Add field"}),(0,a.jsx)("button",{type:"button",onClick:()=>d("section"),className:"rounded-xl border-2 border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-600 hover:border-brand hover:text-brand",children:"+ Add section"})]})]})},"Status",0,function({state:e}){return e.message?(0,a.jsx)("p",{role:"status",className:`text-sm font-medium ${e.ok?"text-emerald-700":"text-red-600"}`,children:e.message}):null},"input",0,i])},87055,e=>{"use strict";var a=e.i(43476),t=e.i(71645),i=e.i(95187);let r=(0,i.createServerReference)("60da61531831c8dd7ac1648b5c021a4fae56afc09d",i.callServer,void 0,i.findSourceMapURL,"savePricingAction");var n=e.i(25599),s=e.i(50323);let l=0,o=e=>({...e,row:l++}),d=[{key:"sameCountry",label:"Within one country"},{key:"sameContinent",label:"Within one continent"},{key:"europeNorthAmerica",label:"Between Europe and North America"},{key:"other",label:"Any other international route"}];e.s(["PricingEditor",0,function({pricing:e}){let[i,l,c]=(0,t.useActionState)(r,{ok:!1,message:""}),[u,m]=(0,t.useState)(()=>e.visaFees.map(e=>o({label:e.label,amount:String(e.amount)}))),[p,b]=(0,t.useState)(()=>Object.fromEntries(d.map(a=>[a.key,String(e.routeFees[a.key])]))),[h,y]=(0,t.useState)(String(e.cvDownloadFee)),[x,g]=(0,t.useState)(e.processingTime),[A,f]=(0,t.useState)(()=>e.paymentMethods.map(o)),[k,v]=(0,t.useState)(e.paymentInstructions),S=e=>i.errors?.[e]?(0,a.jsx)("p",{className:"mt-2 text-xs text-red-600",children:i.errors[e]}):null,N=JSON.stringify({visaFees:u.map(({label:e,amount:a})=>({label:e,amount:a})),routeFees:p,cvDownloadFee:h,processingTime:x,paymentMethods:A.map(({id:e,label:a,note:t,mark:i})=>({id:e,label:a,note:t,mark:i})),paymentInstructions:k}),C=(0,n.feesTotal)(u.map(e=>({label:e.label,amount:Number(e.amount)||0})));return(0,a.jsxs)("form",{action:l,className:"space-y-6",children:[(0,a.jsx)("input",{type:"hidden",name:"pricing",value:N}),(0,a.jsxs)("section",{className:"rounded-2xl bg-white p-6 ring-1 ring-slate-200",children:[(0,a.jsx)("h2",{className:"font-bold text-brand-dark",children:"Visa application fees"}),(0,a.jsx)("p",{className:"mt-1 text-sm text-slate-500",children:"Fixed fees in USD on every visa application. The air ticket booking fee for the route is added on top."}),(0,a.jsxs)("div",{className:"mt-4 space-y-2",children:[u.map(e=>(0,a.jsxs)("div",{className:"flex gap-2",children:[(0,a.jsx)("input",{"aria-label":"Fee name",value:e.label,onChange:a=>m(t=>t.map(t=>t.row===e.row?{...t,label:a.target.value}:t)),placeholder:"e.g. Processing fee",className:s.input}),(0,a.jsx)("input",{"aria-label":"Amount in USD",type:"number",min:"0",step:"0.01",value:e.amount,onChange:a=>m(t=>t.map(t=>t.row===e.row?{...t,amount:a.target.value}:t)),placeholder:"USD",className:`${s.input} w-32 shrink-0`}),(0,a.jsx)("button",{type:"button",onClick:()=>m(a=>a.filter(a=>a.row!==e.row)),className:"shrink-0 rounded-md px-2 text-sm font-medium text-red-600 hover:bg-red-50",children:"Remove"})]},e.row)),(0,a.jsxs)("div",{className:"flex flex-wrap items-center justify-between gap-3 pt-1",children:[(0,a.jsx)("button",{type:"button",onClick:()=>m(e=>[...e,o({label:"",amount:""})]),className:"rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand ring-1 ring-brand hover:bg-brand hover:text-white",children:"+ Add fee"}),(0,a.jsxs)("p",{className:"text-sm font-semibold text-brand-dark",children:["Visa fees total: USD ",C.toFixed(2)]})]}),S("visaFees")]}),(0,a.jsxs)("label",{className:"mt-5 block text-sm font-medium",children:["Typical processing time",(0,a.jsx)("input",{value:x,onChange:e=>g(e.target.value),placeholder:"e.g. 15 – 20 business days",className:`${s.input} mt-1`})]})]}),(0,a.jsxs)("section",{className:"rounded-2xl bg-white p-6 ring-1 ring-slate-200",children:[(0,a.jsx)("h2",{className:"font-bold text-brand-dark",children:"Air ticket booking fees"}),(0,a.jsx)("p",{className:"mt-1 text-sm text-slate-500",children:"Service fee in USD by route, quoted on the air ticket form and added to visa applications. The airline fare is quoted separately."}),(0,a.jsx)("div",{className:"mt-4 grid gap-3 sm:grid-cols-2",children:d.map(e=>(0,a.jsxs)("label",{className:"text-sm font-medium",children:[e.label,(0,a.jsx)("input",{type:"number",min:"0",step:"0.01",value:p[e.key],onChange:a=>b(t=>({...t,[e.key]:a.target.value})),className:`${s.input} mt-1`})]},e.key))}),S("routeFees")]}),(0,a.jsxs)("section",{className:"rounded-2xl bg-white p-6 ring-1 ring-slate-200",children:[(0,a.jsx)("h2",{className:"font-bold text-brand-dark",children:"CV maker"}),(0,a.jsxs)("label",{className:"mt-3 block max-w-xs text-sm font-medium",children:["PDF download price (USD)",(0,a.jsx)("input",{type:"number",min:"0",step:"0.01",value:h,onChange:e=>y(e.target.value),className:`${s.input} mt-1`})]}),S("cvDownloadFee")]}),(0,a.jsxs)("section",{className:"rounded-2xl bg-white p-6 ring-1 ring-slate-200",children:[(0,a.jsx)("h2",{className:"font-bold text-brand-dark",children:"Payment methods"}),(0,a.jsx)("p",{className:"mt-1 text-sm text-slate-500",children:"The choices applicants pick from on the visa form, CV download and your own forms."}),(0,a.jsxs)("div",{className:"mt-4 space-y-2",children:[A.map(e=>(0,a.jsxs)("div",{className:"grid gap-2 sm:grid-cols-[1fr_1fr_160px_auto]",children:[(0,a.jsx)("input",{"aria-label":"Name",value:e.label,onChange:a=>f(t=>t.map(t=>t.row===e.row?{...t,label:a.target.value}:t)),placeholder:"Name, e.g. Bank transfer",className:s.input}),(0,a.jsx)("input",{"aria-label":"Note",value:e.note,onChange:a=>f(t=>t.map(t=>t.row===e.row?{...t,note:a.target.value}:t)),placeholder:"Note (optional)",className:s.input}),(0,a.jsx)("input",{"aria-label":"Badge",value:e.mark,onChange:a=>f(t=>t.map(t=>t.row===e.row?{...t,mark:a.target.value}:t)),placeholder:"Badge, e.g. SWIFT",className:s.input}),(0,a.jsx)("button",{type:"button",onClick:()=>f(a=>a.filter(a=>a.row!==e.row)),className:"rounded-md px-2 text-sm font-medium text-red-600 hover:bg-red-50",children:"Remove"})]},e.row)),(0,a.jsx)("button",{type:"button",onClick:()=>f(e=>[...e,o({id:"",label:"",note:"",mark:""})]),className:"rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand ring-1 ring-brand hover:bg-brand hover:text-white",children:"+ Add payment method"}),S("paymentMethods")]})]}),(0,a.jsxs)("section",{className:"rounded-2xl bg-white p-6 ring-1 ring-slate-200",children:[(0,a.jsx)("h2",{className:"font-bold text-brand-dark",children:"Payment instructions"}),(0,a.jsx)("p",{className:"mt-1 text-sm text-slate-500",children:"Shown on the visa payment step, the air ticket form, the CV download and your own forms (unless a form has its own). For example bank details or how payment links work. Leave empty to hide."}),(0,a.jsx)("textarea",{rows:6,value:k,onChange:e=>v(e.target.value),placeholder:"After we review your application we'll email you a secure payment link.\nBank transfer: Bridge Careers Global, account 0000000, reference = your full name.",className:`${s.input} mt-3`})]}),(0,a.jsxs)("div",{className:"flex items-center gap-4",children:[(0,a.jsx)("button",{type:"submit",disabled:c,className:"rounded-full bg-brand px-8 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-60",children:c?"Saving…":"Save pricing"}),(0,a.jsx)(s.Status,{state:i})]})]})}],87055)},19463,e=>{"use strict";let a=[{id:"visa",title:"Visa application",description:"The five-step application at /visa-application.",page:"/visa-application",inbox:"visa",sections:[{id:"personal",label:"Step 1 · Personal information"},{id:"travel",label:"Step 2 · Travel information"},{id:"documents",label:"Step 3 · Supporting documents"}],fields:[{key:"firstName",label:"First name",required:!0,section:"personal"},{key:"middleName",label:"Middle name",required:!1,section:"personal"},{key:"lastName",label:"Last name",required:!0,section:"personal"},{key:"birthDate",label:"Date of birth",required:!0,section:"personal"},{key:"gender",label:"Gender",required:!0,section:"personal"},{key:"nationality",label:"Nationality",required:!0,section:"personal"},{key:"passport",label:"Passport number",required:!0,section:"personal"},{key:"issueDate",label:"Date of issue",required:!0,section:"personal"},{key:"expiryDate",label:"Date of expiry",required:!0,section:"personal"},{key:"issuePlace",label:"Place of issue",required:!0,section:"personal"},{key:"authority",label:"Issuing authority",required:!0,section:"personal"},{key:"email",label:"Email address",required:!0,section:"personal"},{key:"phone",label:"Phone number (with country code)",required:!0,section:"personal"},{key:"address1",label:"Address line 1",required:!0,section:"personal"},{key:"address2",label:"Address line 2",required:!1,section:"personal"},{key:"city",label:"City",required:!0,section:"personal"},{key:"province",label:"State / Province",required:!0,section:"personal"},{key:"postal",label:"Postal / Zip code",required:!0,section:"personal"},{key:"homeCountry",label:"Country (address)",required:!0,section:"personal"},{key:"originCountry",label:"Departure country",required:!0,section:"travel"},{key:"country",label:"Destination country",required:!0,core:!0,section:"travel"},{key:"job",label:"Available job role",required:!0,core:!0,section:"travel"},{key:"visaType",label:"Visa type",required:!0,core:!0,section:"travel"},{key:"startDate",label:"Preferred start date",required:!1,section:"travel"},{key:"applicants",label:"Number of applicants",required:!0,section:"travel"},{key:"employment",label:"Current employment status (not asked for student visas)",required:!0,section:"travel"},{key:"occupation",label:"Occupation (not asked for student visas)",required:!0,section:"travel"},{key:"employer",label:"Employer / Company name (not asked for student visas)",required:!1,section:"travel"},{key:"income",label:"Monthly income (not asked for student visas)",required:!1,section:"travel"},{key:"doc_passport",label:"Passport bio page",required:!0,section:"documents"},{key:"doc_cv",label:"Curriculum vitae / resume",required:!0,section:"documents"},{key:"doc_certificates",label:"Relevant certificates",required:!1,section:"documents"},{key:"doc_photo",label:"Passport-sized photograph",required:!0,section:"documents"},{key:"paymentMethod",label:"Payment method",required:!0,core:!0}]},{id:"ticket",title:"Air ticket booking",description:"The booking request at /air-ticket-booking.",page:"/air-ticket-booking",inbox:"tickets",fields:[{key:"from",label:"Departure country",required:!0,core:!0},{key:"to",label:"Destination",required:!0,core:!0},{key:"departDate",label:"Departure date",required:!0},{key:"returnDate",label:"Return date",required:!1},{key:"passengers",label:"Passengers",required:!0},{key:"travelClass",label:"Travel class",required:!0},{key:"email",label:"Email address",required:!0},{key:"passportFile",label:"Travelling passport (bio page)",required:!0},{key:"notes",label:"Additional notes",required:!1}]},{id:"application",title:"Job application",description:"The “Apply for this job” form on every job page.",page:"/jobs",inbox:"applications",fields:[{key:"name",label:"Full name",required:!0},{key:"email",label:"Email",required:!0},{key:"phone",label:"Phone",required:!0},{key:"location",label:"Current location",required:!1},{key:"cv",label:"CV (PDF or Word, max 4 MB)",required:!0},{key:"message",label:"Cover note",required:!1}]},{id:"contact",title:"Contact us",description:"The message form at /contact-us.",page:"/contact-us",inbox:"messages",fields:[{key:"name",label:"Full name",required:!0},{key:"email",label:"Email",required:!0},{key:"phone",label:"Phone",required:!1},{key:"country",label:"Country",required:!1},{key:"topic",label:"I am…",required:!1},{key:"message",label:"Message",required:!0}]},{id:"staff",title:"Request staff",description:"The employer form at /employers/request-staff.",page:"/employers/request-staff",inbox:"requests",fields:[{key:"name",label:"Your name",required:!0},{key:"company",label:"Company",required:!0},{key:"email",label:"Work email",required:!0},{key:"phone",label:"Phone",required:!1},{key:"service",label:"Service",required:!1},{key:"industry",label:"Industry",required:!1},{key:"role",label:"Role(s) you're hiring for",required:!0},{key:"headcount",label:"Number of people",required:!1},{key:"start",label:"Ideal start date",required:!1},{key:"details",label:"Tell us more",required:!0}]}];e.s(["CUSTOM_FILE_ACCEPT",0,".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx","CUSTOM_FILE_TYPES",0,["application/pdf","image/jpeg","image/png","image/webp","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"],"contactFields",0,["email","name","firstName","lastName"],"customFieldTypes",0,[{id:"text",label:"Short text"},{id:"textarea",label:"Long text"},{id:"email",label:"Email"},{id:"tel",label:"Phone"},{id:"number",label:"Number"},{id:"date",label:"Date"},{id:"select",label:"Dropdown"},{id:"file",label:"File upload"},{id:"section",label:"Section heading"}],"customIn",0,function(e,a){return void 0===a?e.custom:e.custom.filter(e=>e.section===a)},"getFormDef",0,function(e){return a.find(a=>a.id===e)},"isRequired",0,function(e,a){let t=e.fields[a];return t?t.shown&&t.required:e.custom.some(e=>e.key===a&&e.required)},"resolveLayout",0,function(e,a){let t={};for(let i of e.fields){let e=a.fields[i.key]??{};t[i.key]={shown:i.core||!e.hidden,required:e.required??i.required}}return{fields:t,custom:a.custom}},"shown",0,function(e,a){return e.fields[a]?.shown??!0}])},25599,5696,e=>{"use strict";let a={AF:"Africa",AS:"Asia",EU:"Europe",NA:"North America",SA:"South America",OC:"Oceania"},t=`Afghanistan|93|AS
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
Zimbabwe|263|AF`.split("\n").map(e=>{let[t,i,r]=e.split("|");return{name:t,dial:`+${i}`,continent:a[r]}}),i=t.map(e=>e.name),r=new Map(t.map(e=>[e.name,e]));function n(e){return r.get(e)}let s=t.map(e=>({value:e.name,label:`${e.name} (${e.dial})`}));e.s(["countryNames",0,i,"dialOptions",0,s,"findCountry",0,n],5696),e.s(["ROUTE_FEES_NOTE",0,"{same} within one country · {continent} within one continent · {euna} between Europe and North America · {other} other international routes","feesTotal",0,function(e){return e.reduce((e,a)=>e+a.amount,0)},"routeFee",0,function(e,a,t){if(!a||!t)return 0;if(a===t)return e.sameCountry;let i=n(a)?.continent,r=n(t)?.continent;return i&&i===r?e.sameContinent:"Europe"===i&&"North America"===r||"North America"===i&&"Europe"===r?e.europeNorthAmerica:e.other},"routeFeesVars",0,function(e){let a=e=>`USD ${Number.isInteger(e)?e:e.toFixed(2)}`;return{same:a(e.sameCountry),continent:a(e.sameContinent),euna:a(e.europeNorthAmerica),other:a(e.other)}},"usd",0,function(e){return`USD ${e.toFixed(2)}`}],25599)}]);