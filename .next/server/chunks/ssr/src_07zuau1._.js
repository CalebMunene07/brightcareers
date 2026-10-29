module.exports=[83893,a=>{"use strict";var b=a.i(87924),c=a.i(3434);let d="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20",e="rounded-md px-2 py-1 text-sm text-slate-500 hover:bg-slate-100 hover:text-brand-dark disabled:opacity-30";a.s(["FieldsEditor",0,function({fields:a,onChange:f,sections:g}){let h=(b,c)=>f(a.map(a=>a.key===b?{...a,...c}:a));function i(b,c){let d=[...a];[d[b],d[b+c]]=[d[b+c],d[b]],f(d)}function j(b="text"){f([...a,{key:`custom_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,label:"",type:b,required:!1,options:[],hint:"",section:g?.[0]?.id??""}])}return(0,b.jsxs)("div",{className:"space-y-3",children:[0===a.length&&(0,b.jsx)("p",{className:"text-sm text-slate-500",children:"No custom fields yet."}),a.map((j,k)=>(0,b.jsxs)("div",{className:`rounded-xl p-4 ring-1 ${"section"===j.type?"border-l-4 border-brand bg-brand/5 ring-brand/20":"bg-slate-50 ring-slate-200"}`,children:[(0,b.jsxs)("div",{className:"grid gap-3 sm:grid-cols-[1fr_160px]",children:[(0,b.jsxs)("label",{className:"text-xs font-medium text-slate-600",children:["section"===j.type?"Heading":"Label",(0,b.jsx)("input",{value:j.label,onChange:a=>h(j.key,{label:a.target.value}),placeholder:"section"===j.type?"e.g. Travel details":"e.g. Purpose of visit",className:`${d} mt-1 ${"section"===j.type?"font-semibold":""}`})]}),(0,b.jsxs)("label",{className:"text-xs font-medium text-slate-600",children:["Type",(0,b.jsx)("select",{value:j.type,onChange:a=>h(j.key,{type:a.target.value}),className:`${d} mt-1`,children:c.customFieldTypes.map(a=>(0,b.jsx)("option",{value:a.id,children:a.label},a.id))})]}),"select"===j.type&&(0,b.jsxs)("label",{className:"text-xs font-medium text-slate-600 sm:col-span-2",children:["Choices (one per line)",(0,b.jsx)("textarea",{rows:3,value:j.options.join("\n"),onChange:a=>h(j.key,{options:a.target.value.split("\n")}),placeholder:"Tourism\nVisiting family\nBusiness",className:`${d} mt-1`})]}),(0,b.jsxs)("label",{className:"text-xs font-medium text-slate-600",children:["section"===j.type?"Description (optional)":"Help text (optional)",(0,b.jsx)("input",{value:j.hint,onChange:a=>h(j.key,{hint:a.target.value}),placeholder:"section"===j.type?"Shown under the heading":"Shown under the field",className:`${d} mt-1`})]}),g&&(0,b.jsxs)("label",{className:"text-xs font-medium text-slate-600",children:["Place in",(0,b.jsx)("select",{value:j.section,onChange:a=>h(j.key,{section:a.target.value}),className:`${d} mt-1`,children:g.map(a=>(0,b.jsx)("option",{value:a.id,children:a.label},a.id))})]})]}),(0,b.jsxs)("div",{className:"mt-3 flex flex-wrap items-center gap-2",children:["section"===j.type?(0,b.jsx)("span",{className:"mr-auto text-xs text-slate-500",children:"Groups the fields below it under this heading."}):(0,b.jsxs)("label",{className:"mr-auto inline-flex items-center gap-2 text-sm text-slate-700",children:[(0,b.jsx)("input",{type:"checkbox",checked:j.required,onChange:a=>h(j.key,{required:a.target.checked}),className:"h-4 w-4 accent-[var(--brand)]"}),"Required"]}),(0,b.jsx)("button",{type:"button",onClick:()=>i(k,-1),disabled:0===k,className:e,"aria-label":"Move up",children:"↑"}),(0,b.jsx)("button",{type:"button",onClick:()=>i(k,1),disabled:k===a.length-1,className:e,"aria-label":"Move down",children:"↓"}),(0,b.jsx)("button",{type:"button",onClick:()=>f(a.filter(a=>a.key!==j.key)),className:"rounded-md px-2 py-1 text-sm font-medium text-red-600 hover:bg-red-50",children:"Delete"})]})]},j.key)),(0,b.jsxs)("div",{className:"grid gap-2 sm:grid-cols-2",children:[(0,b.jsx)("button",{type:"button",onClick:()=>j(),className:"rounded-xl border-2 border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-600 hover:border-brand hover:text-brand",children:"+ Add field"}),(0,b.jsx)("button",{type:"button",onClick:()=>j("section"),className:"rounded-xl border-2 border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-600 hover:border-brand hover:text-brand",children:"+ Add section"})]})]})},"Status",0,function({state:a}){return a.message?(0,b.jsx)("p",{role:"status",className:`text-sm font-medium ${a.ok?"text-emerald-700":"text-red-600"}`,children:a.message}):null},"input",0,d])},47482,a=>{"use strict";var b=a.i(87924),c=a.i(72131),d=a.i(5050);let e=(0,d.createServerReference)("60da61531831c8dd7ac1648b5c021a4fae56afc09d",d.callServer,void 0,d.findSourceMapURL,"savePricingAction");var f=a.i(66916),g=a.i(83893);let h=0,i=a=>({...a,row:h++}),j=[{key:"sameCountry",label:"Within one country"},{key:"sameContinent",label:"Within one continent"},{key:"europeNorthAmerica",label:"Between Europe and North America"},{key:"other",label:"Any other international route"}];a.s(["PricingEditor",0,function({pricing:a}){let[d,h,k]=(0,c.useActionState)(e,{ok:!1,message:""}),[l,m]=(0,c.useState)(()=>a.visaFees.map(a=>i({label:a.label,amount:String(a.amount)}))),[n,o]=(0,c.useState)(()=>Object.fromEntries(j.map(b=>[b.key,String(a.routeFees[b.key])]))),[p,q]=(0,c.useState)(String(a.cvDownloadFee)),[r,s]=(0,c.useState)(a.processingTime),[t,u]=(0,c.useState)(()=>a.paymentMethods.map(i)),[v,w]=(0,c.useState)(a.paymentInstructions),x=a=>d.errors?.[a]?(0,b.jsx)("p",{className:"mt-2 text-xs text-red-600",children:d.errors[a]}):null,y=JSON.stringify({visaFees:l.map(({label:a,amount:b})=>({label:a,amount:b})),routeFees:n,cvDownloadFee:p,processingTime:r,paymentMethods:t.map(({id:a,label:b,note:c,mark:d})=>({id:a,label:b,note:c,mark:d})),paymentInstructions:v}),z=(0,f.feesTotal)(l.map(a=>({label:a.label,amount:Number(a.amount)||0})));return(0,b.jsxs)("form",{action:h,className:"space-y-6",children:[(0,b.jsx)("input",{type:"hidden",name:"pricing",value:y}),(0,b.jsxs)("section",{className:"rounded-2xl bg-white p-6 ring-1 ring-slate-200",children:[(0,b.jsx)("h2",{className:"font-bold text-brand-dark",children:"Visa application fees"}),(0,b.jsx)("p",{className:"mt-1 text-sm text-slate-500",children:"Fixed fees in USD on every visa application. The air ticket booking fee for the route is added on top."}),(0,b.jsxs)("div",{className:"mt-4 space-y-2",children:[l.map(a=>(0,b.jsxs)("div",{className:"flex gap-2",children:[(0,b.jsx)("input",{"aria-label":"Fee name",value:a.label,onChange:b=>m(c=>c.map(c=>c.row===a.row?{...c,label:b.target.value}:c)),placeholder:"e.g. Processing fee",className:g.input}),(0,b.jsx)("input",{"aria-label":"Amount in USD",type:"number",min:"0",step:"0.01",value:a.amount,onChange:b=>m(c=>c.map(c=>c.row===a.row?{...c,amount:b.target.value}:c)),placeholder:"USD",className:`${g.input} w-32 shrink-0`}),(0,b.jsx)("button",{type:"button",onClick:()=>m(b=>b.filter(b=>b.row!==a.row)),className:"shrink-0 rounded-md px-2 text-sm font-medium text-red-600 hover:bg-red-50",children:"Remove"})]},a.row)),(0,b.jsxs)("div",{className:"flex flex-wrap items-center justify-between gap-3 pt-1",children:[(0,b.jsx)("button",{type:"button",onClick:()=>m(a=>[...a,i({label:"",amount:""})]),className:"rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand ring-1 ring-brand hover:bg-brand hover:text-white",children:"+ Add fee"}),(0,b.jsxs)("p",{className:"text-sm font-semibold text-brand-dark",children:["Visa fees total: USD ",z.toFixed(2)]})]}),x("visaFees")]}),(0,b.jsxs)("label",{className:"mt-5 block text-sm font-medium",children:["Typical processing time",(0,b.jsx)("input",{value:r,onChange:a=>s(a.target.value),placeholder:"e.g. 15 – 20 business days",className:`${g.input} mt-1`})]})]}),(0,b.jsxs)("section",{className:"rounded-2xl bg-white p-6 ring-1 ring-slate-200",children:[(0,b.jsx)("h2",{className:"font-bold text-brand-dark",children:"Air ticket booking fees"}),(0,b.jsx)("p",{className:"mt-1 text-sm text-slate-500",children:"Service fee in USD by route, quoted on the air ticket form and added to visa applications. The airline fare is quoted separately."}),(0,b.jsx)("div",{className:"mt-4 grid gap-3 sm:grid-cols-2",children:j.map(a=>(0,b.jsxs)("label",{className:"text-sm font-medium",children:[a.label,(0,b.jsx)("input",{type:"number",min:"0",step:"0.01",value:n[a.key],onChange:b=>o(c=>({...c,[a.key]:b.target.value})),className:`${g.input} mt-1`})]},a.key))}),x("routeFees")]}),(0,b.jsxs)("section",{className:"rounded-2xl bg-white p-6 ring-1 ring-slate-200",children:[(0,b.jsx)("h2",{className:"font-bold text-brand-dark",children:"CV maker"}),(0,b.jsxs)("label",{className:"mt-3 block max-w-xs text-sm font-medium",children:["PDF download price (USD)",(0,b.jsx)("input",{type:"number",min:"0",step:"0.01",value:p,onChange:a=>q(a.target.value),className:`${g.input} mt-1`})]}),x("cvDownloadFee")]}),(0,b.jsxs)("section",{className:"rounded-2xl bg-white p-6 ring-1 ring-slate-200",children:[(0,b.jsx)("h2",{className:"font-bold text-brand-dark",children:"Payment methods"}),(0,b.jsx)("p",{className:"mt-1 text-sm text-slate-500",children:"The choices applicants pick from on the visa form, CV download and your own forms."}),(0,b.jsxs)("div",{className:"mt-4 space-y-2",children:[t.map(a=>(0,b.jsxs)("div",{className:"grid gap-2 sm:grid-cols-[1fr_1fr_160px_auto]",children:[(0,b.jsx)("input",{"aria-label":"Name",value:a.label,onChange:b=>u(c=>c.map(c=>c.row===a.row?{...c,label:b.target.value}:c)),placeholder:"Name, e.g. Bank transfer",className:g.input}),(0,b.jsx)("input",{"aria-label":"Note",value:a.note,onChange:b=>u(c=>c.map(c=>c.row===a.row?{...c,note:b.target.value}:c)),placeholder:"Note (optional)",className:g.input}),(0,b.jsx)("input",{"aria-label":"Badge",value:a.mark,onChange:b=>u(c=>c.map(c=>c.row===a.row?{...c,mark:b.target.value}:c)),placeholder:"Badge, e.g. SWIFT",className:g.input}),(0,b.jsx)("button",{type:"button",onClick:()=>u(b=>b.filter(b=>b.row!==a.row)),className:"rounded-md px-2 text-sm font-medium text-red-600 hover:bg-red-50",children:"Remove"})]},a.row)),(0,b.jsx)("button",{type:"button",onClick:()=>u(a=>[...a,i({id:"",label:"",note:"",mark:""})]),className:"rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand ring-1 ring-brand hover:bg-brand hover:text-white",children:"+ Add payment method"}),x("paymentMethods")]})]}),(0,b.jsxs)("section",{className:"rounded-2xl bg-white p-6 ring-1 ring-slate-200",children:[(0,b.jsx)("h2",{className:"font-bold text-brand-dark",children:"Payment instructions"}),(0,b.jsx)("p",{className:"mt-1 text-sm text-slate-500",children:"Shown on the visa payment step, the air ticket form, the CV download and your own forms (unless a form has its own). For example bank details or how payment links work. Leave empty to hide."}),(0,b.jsx)("textarea",{rows:6,value:v,onChange:a=>w(a.target.value),placeholder:"After we review your application we'll email you a secure payment link.\nBank transfer: Bridge Careers Global, account 0000000, reference = your full name.",className:`${g.input} mt-3`})]}),(0,b.jsxs)("div",{className:"flex items-center gap-4",children:[(0,b.jsx)("button",{type:"submit",disabled:k,className:"rounded-full bg-brand px-8 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-60",children:k?"Saving…":"Save pricing"}),(0,b.jsx)(g.Status,{state:d})]})]})}],47482)},3434,a=>{"use strict";let b=[{id:"visa",title:"Visa application",description:"The five-step application at /visa-application.",page:"/visa-application",inbox:"visa",sections:[{id:"personal",label:"Step 1 · Personal information"},{id:"travel",label:"Step 2 · Travel information"},{id:"documents",label:"Step 3 · Supporting documents"}],fields:[{key:"firstName",label:"First name",required:!0,section:"personal"},{key:"middleName",label:"Middle name",required:!1,section:"personal"},{key:"lastName",label:"Last name",required:!0,section:"personal"},{key:"birthDate",label:"Date of birth",required:!0,section:"personal"},{key:"gender",label:"Gender",required:!0,section:"personal"},{key:"nationality",label:"Nationality",required:!0,section:"personal"},{key:"passport",label:"Passport number",required:!0,section:"personal"},{key:"issueDate",label:"Date of issue",required:!0,section:"personal"},{key:"expiryDate",label:"Date of expiry",required:!0,section:"personal"},{key:"issuePlace",label:"Place of issue",required:!0,section:"personal"},{key:"authority",label:"Issuing authority",required:!0,section:"personal"},{key:"email",label:"Email address",required:!0,section:"personal"},{key:"phone",label:"Phone number (with country code)",required:!0,section:"personal"},{key:"address1",label:"Address line 1",required:!0,section:"personal"},{key:"address2",label:"Address line 2",required:!1,section:"personal"},{key:"city",label:"City",required:!0,section:"personal"},{key:"province",label:"State / Province",required:!0,section:"personal"},{key:"postal",label:"Postal / Zip code",required:!0,section:"personal"},{key:"homeCountry",label:"Country (address)",required:!0,section:"personal"},{key:"originCountry",label:"Departure country",required:!0,section:"travel"},{key:"country",label:"Destination country",required:!0,core:!0,section:"travel"},{key:"job",label:"Available job role",required:!0,core:!0,section:"travel"},{key:"visaType",label:"Visa type",required:!0,core:!0,section:"travel"},{key:"startDate",label:"Preferred start date",required:!1,section:"travel"},{key:"applicants",label:"Number of applicants",required:!0,section:"travel"},{key:"employment",label:"Current employment status (not asked for student visas)",required:!0,section:"travel"},{key:"occupation",label:"Occupation (not asked for student visas)",required:!0,section:"travel"},{key:"employer",label:"Employer / Company name (not asked for student visas)",required:!1,section:"travel"},{key:"income",label:"Monthly income (not asked for student visas)",required:!1,section:"travel"},{key:"doc_passport",label:"Passport bio page",required:!0,section:"documents"},{key:"doc_cv",label:"Curriculum vitae / resume",required:!0,section:"documents"},{key:"doc_certificates",label:"Relevant certificates",required:!1,section:"documents"},{key:"doc_photo",label:"Passport-sized photograph",required:!0,section:"documents"},{key:"paymentMethod",label:"Payment method",required:!0,core:!0}]},{id:"ticket",title:"Air ticket booking",description:"The booking request at /air-ticket-booking.",page:"/air-ticket-booking",inbox:"tickets",fields:[{key:"from",label:"Departure country",required:!0,core:!0},{key:"to",label:"Destination",required:!0,core:!0},{key:"departDate",label:"Departure date",required:!0},{key:"returnDate",label:"Return date",required:!1},{key:"passengers",label:"Passengers",required:!0},{key:"travelClass",label:"Travel class",required:!0},{key:"email",label:"Email address",required:!0},{key:"passportFile",label:"Travelling passport (bio page)",required:!0},{key:"notes",label:"Additional notes",required:!1}]},{id:"application",title:"Job application",description:"The “Apply for this job” form on every job page.",page:"/jobs",inbox:"applications",fields:[{key:"name",label:"Full name",required:!0},{key:"email",label:"Email",required:!0},{key:"phone",label:"Phone",required:!0},{key:"location",label:"Current location",required:!1},{key:"cv",label:"CV (PDF or Word, max 4 MB)",required:!0},{key:"message",label:"Cover note",required:!1}]},{id:"contact",title:"Contact us",description:"The message form at /contact-us.",page:"/contact-us",inbox:"messages",fields:[{key:"name",label:"Full name",required:!0},{key:"email",label:"Email",required:!0},{key:"phone",label:"Phone",required:!1},{key:"country",label:"Country",required:!1},{key:"topic",label:"I am…",required:!1},{key:"message",label:"Message",required:!0}]},{id:"staff",title:"Request staff",description:"The employer form at /employers/request-staff.",page:"/employers/request-staff",inbox:"requests",fields:[{key:"name",label:"Your name",required:!0},{key:"company",label:"Company",required:!0},{key:"email",label:"Work email",required:!0},{key:"phone",label:"Phone",required:!1},{key:"service",label:"Service",required:!1},{key:"industry",label:"Industry",required:!1},{key:"role",label:"Role(s) you're hiring for",required:!0},{key:"headcount",label:"Number of people",required:!1},{key:"start",label:"Ideal start date",required:!1},{key:"details",label:"Tell us more",required:!0}]}];a.s(["CUSTOM_FILE_ACCEPT",0,".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx","CUSTOM_FILE_TYPES",0,["application/pdf","image/jpeg","image/png","image/webp","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"],"contactFields",0,["email","name","firstName","lastName"],"customFieldTypes",0,[{id:"text",label:"Short text"},{id:"textarea",label:"Long text"},{id:"email",label:"Email"},{id:"tel",label:"Phone"},{id:"number",label:"Number"},{id:"date",label:"Date"},{id:"select",label:"Dropdown"},{id:"file",label:"File upload"},{id:"section",label:"Section heading"}],"customIn",0,function(a,b){return void 0===b?a.custom:a.custom.filter(a=>a.section===b)},"getFormDef",0,function(a){return b.find(b=>b.id===a)},"isRequired",0,function(a,b){let c=a.fields[b];return c?c.shown&&c.required:a.custom.some(a=>a.key===b&&a.required)},"resolveLayout",0,function(a,b){let c={};for(let d of a.fields){let a=b.fields[d.key]??{};c[d.key]={shown:d.core||!a.hidden,required:a.required??d.required}}return{fields:c,custom:b.custom}},"shown",0,function(a,b){return a.fields[b]?.shown??!0}])},66916,98186,a=>{"use strict";let b={AF:"Africa",AS:"Asia",EU:"Europe",NA:"North America",SA:"South America",OC:"Oceania"},c=`Afghanistan|93|AS
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
Zimbabwe|263|AF`.split("\n").map(a=>{let[c,d,e]=a.split("|");return{name:c,dial:`+${d}`,continent:b[e]}}),d=c.map(a=>a.name),e=new Map(c.map(a=>[a.name,a]));function f(a){return e.get(a)}let g=c.map(a=>({value:a.name,label:`${a.name} (${a.dial})`}));a.s(["countryNames",0,d,"dialOptions",0,g,"findCountry",0,f],98186),a.s(["ROUTE_FEES_NOTE",0,"{same} within one country · {continent} within one continent · {euna} between Europe and North America · {other} other international routes","feesTotal",0,function(a){return a.reduce((a,b)=>a+b.amount,0)},"routeFee",0,function(a,b,c){if(!b||!c)return 0;if(b===c)return a.sameCountry;let d=f(b)?.continent,e=f(c)?.continent;return d&&d===e?a.sameContinent:"Europe"===d&&"North America"===e||"North America"===d&&"Europe"===e?a.europeNorthAmerica:a.other},"routeFeesVars",0,function(a){let b=a=>`USD ${Number.isInteger(a)?a:a.toFixed(2)}`;return{same:b(a.sameCountry),continent:b(a.sameContinent),euna:b(a.europeNorthAmerica),other:b(a.other)}},"usd",0,function(a){return`USD ${a.toFixed(2)}`}],66916)}];

//# sourceMappingURL=src_07zuau1._.js.map