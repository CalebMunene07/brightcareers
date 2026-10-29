module.exports=[88326,a=>{"use strict";var b=a.i(87924),c=a.i(72131);let d="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";function e({title:a,text:c}){return(0,b.jsxs)("div",{className:"border-b border-slate-200 pb-2 pt-3 sm:col-span-2",children:[(0,b.jsx)("h3",{className:"text-lg font-bold text-brand-dark",children:a}),c&&(0,b.jsx)("p",{className:"mt-1 text-sm text-slate-600",children:c})]})}a.s(["Form",0,function({action:a,fields:f,submitLabel:g,hidden:h,ui:i={submitted:"Submitted",sending:"Sending…",select:"Select…"}}){let[j,k,l]=(0,c.useActionState)(a,{ok:!1,message:""});return j.ok?(0,b.jsxs)("div",{role:"status",className:"rounded-2xl bg-emerald-50 p-8 text-emerald-900 ring-1 ring-emerald-200",children:[(0,b.jsx)("p",{className:"text-lg font-semibold",children:i.submitted}),(0,b.jsx)("p",{className:"mt-2",children:j.message})]}):(0,b.jsxs)("form",{action:k,className:"grid gap-5 sm:grid-cols-2",noValidate:!0,children:[h&&Object.entries(h).map(([a,c])=>(0,b.jsx)("input",{type:"hidden",name:a,value:c},a)),f.map(a=>{if("section"===a.type)return(0,b.jsx)(e,{title:a.label,text:a.hint},a.name);let c=`f-${a.name}`,f=j.errors?.[a.name],g={id:c,name:a.name,required:a.required,placeholder:a.placeholder,defaultValue:a.defaultValue,"aria-invalid":!!f||void 0,"aria-describedby":f?`${c}-error`:a.hint?`${c}-hint`:void 0,className:`${d} ${f?"border-red-500":""}`};return(0,b.jsxs)("div",{className:a.full||"textarea"===a.type?"sm:col-span-2":"",children:[(0,b.jsxs)("label",{htmlFor:c,className:"text-sm font-medium text-slate-800",children:[a.label,a.required&&(0,b.jsx)("span",{className:"text-red-600",children:" *"})]}),"textarea"===a.type?(0,b.jsx)("textarea",{rows:5,...g}):"select"===a.type?(0,b.jsxs)("select",{...g,children:[(0,b.jsx)("option",{value:"",children:i.select}),a.options?.map(a=>{let c="string"==typeof a?{value:a,label:a}:a;return(0,b.jsx)("option",{value:c.value,children:c.label},c.value)})]}):"file"===a.type?(0,b.jsx)("input",{...g,defaultValue:void 0,type:"file",accept:a.accept,className:`${g.className} file:mr-3 file:rounded-md file:border-0 file:bg-brand/10 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-brand`}):(0,b.jsx)("input",{type:a.type??"text",...g}),a.hint&&!f&&(0,b.jsx)("p",{id:`${c}-hint`,className:"mt-1.5 text-xs text-slate-500",children:a.hint}),f&&(0,b.jsx)("p",{id:`${c}-error`,className:"mt-1.5 text-sm text-red-600",children:f})]},a.name)}),(0,b.jsxs)("div",{className:"sm:col-span-2",children:[j.message&&!j.ok&&(0,b.jsx)("p",{role:"alert",className:"mb-4 text-sm font-medium text-red-600",children:j.message}),(0,b.jsx)("button",{type:"submit",disabled:l,className:"w-full rounded-full bg-brand px-8 py-3 font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60 sm:w-auto",children:l?i.sending:g})]})]})},"SectionHeading",0,e,"inputClass",0,d])},30014,46372,a=>{"use strict";var b=a.i(87924),c=a.i(88326),d=a.i(27824),e=a.i(3434);function f({id:a,label:c,required:d,error:e,hint:g,className:h="",children:i}){return(0,b.jsxs)("div",{className:h,children:[(0,b.jsxs)("label",{htmlFor:a,className:"text-sm font-medium text-slate-800",children:[c,d&&(0,b.jsx)("span",{className:"text-brand",children:" *"})]}),i,g&&!e&&(0,b.jsx)("p",{className:"mt-1.5 text-xs text-slate-500",children:g}),e&&(0,b.jsx)("p",{id:`${a}-error`,className:"mt-1.5 text-sm text-red-600",children:e})]})}function g(a,b){return{id:a,name:a,"aria-invalid":!!b||void 0,"aria-describedby":b?`${a}-error`:void 0,className:`${c.inputClass} ${b?"border-red-500":""}`}}function h({type:a="text",placeholder:c,autoComplete:d,min:e,max:f,...i}){return(0,b.jsx)("input",{...g(i.id,i.error),type:a,value:i.value,placeholder:c,autoComplete:d,min:e,max:f,onChange:a=>i.onChange(a.target.value)})}function i({options:a,placeholder:c,...d}){return(0,b.jsxs)("select",{...g(d.id,d.error),value:d.value,onChange:a=>d.onChange(a.target.value),children:[void 0!==c&&(0,b.jsx)("option",{value:"",children:c}),a.map(a=>{let c="string"==typeof a?{value:a,label:a}:a;return(0,b.jsx)("option",{value:c.value,children:c.label},c.value)})]})}function j(a){return(0,b.jsx)("textarea",{...g(a.id,a.error),rows:4,value:a.value,placeholder:a.placeholder,onChange:b=>a.onChange(b.target.value)})}async function k(a,b=2e3,c=.85){if(!a.type.startsWith("image/")||a.size<614400)return a;try{let d=await createImageBitmap(a),e=Math.min(1,b/Math.max(d.width,d.height)),f=document.createElement("canvas");f.width=Math.round(d.width*e),f.height=Math.round(d.height*e),f.getContext("2d")?.drawImage(d,0,0,f.width,f.height);let g=await new Promise(a=>f.toBlob(a,"image/jpeg",c));if(!g||g.size>=a.size)return a;return new File([g],a.name.replace(/\.\w+$/,"")+".jpg",{type:"image/jpeg"})}catch{return a}}function l(a){return a>1048576?`${(a/1024/1024).toFixed(1)} MB`:`${Math.max(1,Math.round(a/1024))} KB`}function m({id:a,label:c,required:e,file:f,error:g,hint:h,accept:i,onPick:j,L:k}){return(0,b.jsxs)("div",{className:"sm:col-span-2",children:[(0,b.jsxs)("p",{className:"text-sm font-medium text-slate-800",children:[c,e&&(0,b.jsx)("span",{className:"text-brand",children:" *"})]}),(0,b.jsxs)("div",{className:`mt-1.5 flex flex-wrap items-center gap-3 rounded-xl border-2 border-dashed p-4 ${g?"border-red-300 bg-red-50/40":f?"border-brand/40 bg-brand/5":"border-slate-200"}`,children:[(0,b.jsx)(d.Icon,{name:f?"check":"file",className:`h-6 w-6 shrink-0 ${f?"text-brand":"text-slate-400"}`}),(0,b.jsx)("p",{className:"min-w-0 flex-1 truncate text-sm text-slate-600",children:f?`${f.name} \xb7 ${l(f.size)}`:h||k("PDF, JPG or PNG")}),f&&!e&&(0,b.jsx)("button",{type:"button",onClick:()=>j(void 0),className:"rounded-lg px-3 py-2 text-sm text-slate-600 hover:text-red-600",children:k("Remove")}),(0,b.jsxs)("label",{htmlFor:a,className:"cursor-pointer rounded-lg bg-white px-3.5 py-2 text-sm font-semibold text-brand ring-1 ring-brand/40 focus-within:ring-2 focus-within:ring-brand hover:bg-brand/5",children:[k(f?"Replace file":"Choose file"),(0,b.jsx)("input",{id:a,type:"file",accept:i,className:"sr-only","aria-invalid":!!g||void 0,"aria-describedby":g?`${a}-error`:void 0,onChange:a=>{j(a.target.files?.[0]),a.target.value=""}})]})]}),g&&(0,b.jsx)("p",{id:`${a}-error`,className:"mt-1.5 text-sm text-red-600",children:g})]})}a.s(["CardHeading",0,function({icon:a,title:c,text:d}){return(0,b.jsxs)("div",{className:"flex items-start gap-4 border-b border-slate-100 pb-5",children:[(0,b.jsx)("span",{className:"flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand",children:a}),(0,b.jsxs)("div",{children:[(0,b.jsx)("h2",{className:"text-xl font-bold text-brand-dark",children:c}),d&&(0,b.jsx)("p",{className:"mt-1 text-sm text-slate-600",children:d})]})]})},"CustomFields",0,function({fields:a,values:d,onChange:g,files:k,onFile:l,errors:n,L:o}){return 0===a.length?null:(0,b.jsx)("div",{className:"grid gap-4 sm:grid-cols-2",children:a.map(a=>{let p=a.hint?o(a.hint):void 0;if("section"===a.type)return(0,b.jsx)(c.SectionHeading,{title:o(a.label),text:p},a.key);if("file"===a.type)return(0,b.jsx)(m,{id:a.key,label:o(a.label),required:a.required,file:k[a.key],error:n[a.key],hint:p,accept:e.CUSTOM_FILE_ACCEPT,onPick:b=>l(a.key,b),L:o},a.key);let q={id:a.key,value:d[a.key]??"",onChange:g(a.key),error:n[a.key]};return(0,b.jsx)(f,{id:a.key,label:o(a.label),required:a.required,error:n[a.key],hint:p,className:"textarea"===a.type?"sm:col-span-2":"",children:"select"===a.type?(0,b.jsx)(i,{...q,placeholder:o("Select…"),options:a.options.map(a=>({value:a,label:o(a)}))}):"textarea"===a.type?(0,b.jsx)(j,{...q}):(0,b.jsx)(h,{...q,type:a.type})},a.key)})})},"Field",0,f,"FileBox",0,m,"PaymentInstructions",0,function({text:a,L:c}){return a.trim()?(0,b.jsxs)("div",{className:"rounded-xl p-4 ring-1 ring-slate-200",children:[(0,b.jsx)("p",{className:"text-sm font-bold text-brand-dark",children:c("Payment instructions")}),(0,b.jsx)("p",{className:"mt-1 whitespace-pre-line text-sm text-slate-700",children:c(a)})]}):null},"Select",0,i,"SummaryRow",0,function({label:a,value:c,strong:d}){return(0,b.jsxs)("div",{className:"flex items-baseline justify-between gap-4 py-2 text-sm",children:[(0,b.jsx)("dt",{className:"text-slate-500",children:a}),(0,b.jsx)("dd",{className:`text-right ${d?"text-base font-bold text-brand-dark":"font-semibold text-slate-800"}`,children:c})]})},"TextArea",0,j,"TextInput",0,h,"formatBytes",0,l,"makeL",0,function(a){return(b,c)=>{let d=a[b]??b;return c?d.replace(/\{(\w+)\}/g,(a,b)=>b in c?String(c[b]):a):d}},"shrinkImage",0,k],30014),a.i(66916);let n={Canada:["Caregiving","Welding","CNA","Nursing","Cleaning","Farm work","Receptionist","Supermarket attendant","Cruise ship jobs"],"United States":["Caregiving","Welding","CNA","Nursing","Cleaning","Farm work","Receptionist","Supermarket attendant","Cruise ship jobs"],"United Kingdom":["Caregiving","Welding","CNA","Nursing","Cleaning","Farm work","Receptionist","Supermarket attendant","Cruise ship jobs"],Germany:["Au pair","Cleaning","Housekeeping","Waiter/waitress","Farm work","Nursing"],Luxembourg:["Caregiving","Cleaning","Welding","Driving","Nursing","Housekeeping","Waiter/waitress"],Netherlands:["Au pair","Cleaning","Housekeeping","Waiter/waitress","Farm work","Nursing"],Finland:["Caregiving","Cleaning","Housekeeping","Nursing","Farm work","Welding"],Turkey:["Nanny","Cleaning","Housekeeping","Farm work","Driving","Riders","Factory work","Welding"],Australia:["Farming","Teaching","Caregiving","Nursing","Driving","Construction","Clinical medicine"],"New Zealand":["Farming","Teaching","Caregiving","Nursing","Driving","Construction","Hospitality"]},o=Object.keys(n),p="Student visa";a.s(["DOC_ACCEPT",0,".pdf,.jpg,.jpeg,.png,.webp","DOC_TYPES",0,["application/pdf","image/jpeg","image/png","image/webp"],"MAX_UPLOAD_BYTES",0,4194304,"applicantCounts",0,["1","2","3","4+"],"asksEmployment",0,a=>a!==p,"destinationNames",0,o,"destinations",0,n,"employmentFields",0,["employment","occupation","employer","income"],"employmentStatuses",0,["Employed","Self-employed","Student","Between roles","Retired"],"genders",0,["Female","Male","Non-binary","Prefer not to say"],"travelClasses",0,["Economy","Premium economy","Business"],"visaDocuments",0,[{key:"passport",label:"Passport bio page",required:!0},{key:"cv",label:"Curriculum vitae / resume",required:!0},{key:"certificates",label:"Relevant certificates",required:!1},{key:"photo",label:"Passport-sized photograph",required:!0}],"visaTypes",0,["Work visa","Skilled worker visa","Seasonal work visa","Care visa",p]],46372)},3434,a=>{"use strict";let b=[{id:"visa",title:"Visa application",description:"The five-step application at /visa-application.",page:"/visa-application",inbox:"visa",sections:[{id:"personal",label:"Step 1 · Personal information"},{id:"travel",label:"Step 2 · Travel information"},{id:"documents",label:"Step 3 · Supporting documents"}],fields:[{key:"firstName",label:"First name",required:!0,section:"personal"},{key:"middleName",label:"Middle name",required:!1,section:"personal"},{key:"lastName",label:"Last name",required:!0,section:"personal"},{key:"birthDate",label:"Date of birth",required:!0,section:"personal"},{key:"gender",label:"Gender",required:!0,section:"personal"},{key:"nationality",label:"Nationality",required:!0,section:"personal"},{key:"passport",label:"Passport number",required:!0,section:"personal"},{key:"issueDate",label:"Date of issue",required:!0,section:"personal"},{key:"expiryDate",label:"Date of expiry",required:!0,section:"personal"},{key:"issuePlace",label:"Place of issue",required:!0,section:"personal"},{key:"authority",label:"Issuing authority",required:!0,section:"personal"},{key:"email",label:"Email address",required:!0,section:"personal"},{key:"phone",label:"Phone number (with country code)",required:!0,section:"personal"},{key:"address1",label:"Address line 1",required:!0,section:"personal"},{key:"address2",label:"Address line 2",required:!1,section:"personal"},{key:"city",label:"City",required:!0,section:"personal"},{key:"province",label:"State / Province",required:!0,section:"personal"},{key:"postal",label:"Postal / Zip code",required:!0,section:"personal"},{key:"homeCountry",label:"Country (address)",required:!0,section:"personal"},{key:"originCountry",label:"Departure country",required:!0,section:"travel"},{key:"country",label:"Destination country",required:!0,core:!0,section:"travel"},{key:"job",label:"Available job role",required:!0,core:!0,section:"travel"},{key:"visaType",label:"Visa type",required:!0,core:!0,section:"travel"},{key:"startDate",label:"Preferred start date",required:!1,section:"travel"},{key:"applicants",label:"Number of applicants",required:!0,section:"travel"},{key:"employment",label:"Current employment status (not asked for student visas)",required:!0,section:"travel"},{key:"occupation",label:"Occupation (not asked for student visas)",required:!0,section:"travel"},{key:"employer",label:"Employer / Company name (not asked for student visas)",required:!1,section:"travel"},{key:"income",label:"Monthly income (not asked for student visas)",required:!1,section:"travel"},{key:"doc_passport",label:"Passport bio page",required:!0,section:"documents"},{key:"doc_cv",label:"Curriculum vitae / resume",required:!0,section:"documents"},{key:"doc_certificates",label:"Relevant certificates",required:!1,section:"documents"},{key:"doc_photo",label:"Passport-sized photograph",required:!0,section:"documents"},{key:"paymentMethod",label:"Payment method",required:!0,core:!0}]},{id:"ticket",title:"Air ticket booking",description:"The booking request at /air-ticket-booking.",page:"/air-ticket-booking",inbox:"tickets",fields:[{key:"from",label:"Departure country",required:!0,core:!0},{key:"to",label:"Destination",required:!0,core:!0},{key:"departDate",label:"Departure date",required:!0},{key:"returnDate",label:"Return date",required:!1},{key:"passengers",label:"Passengers",required:!0},{key:"travelClass",label:"Travel class",required:!0},{key:"email",label:"Email address",required:!0},{key:"passportFile",label:"Travelling passport (bio page)",required:!0},{key:"notes",label:"Additional notes",required:!1}]},{id:"application",title:"Job application",description:"The “Apply for this job” form on every job page.",page:"/jobs",inbox:"applications",fields:[{key:"name",label:"Full name",required:!0},{key:"email",label:"Email",required:!0},{key:"phone",label:"Phone",required:!0},{key:"location",label:"Current location",required:!1},{key:"cv",label:"CV (PDF or Word, max 4 MB)",required:!0},{key:"message",label:"Cover note",required:!1}]},{id:"contact",title:"Contact us",description:"The message form at /contact-us.",page:"/contact-us",inbox:"messages",fields:[{key:"name",label:"Full name",required:!0},{key:"email",label:"Email",required:!0},{key:"phone",label:"Phone",required:!1},{key:"country",label:"Country",required:!1},{key:"topic",label:"I am…",required:!1},{key:"message",label:"Message",required:!0}]},{id:"staff",title:"Request staff",description:"The employer form at /employers/request-staff.",page:"/employers/request-staff",inbox:"requests",fields:[{key:"name",label:"Your name",required:!0},{key:"company",label:"Company",required:!0},{key:"email",label:"Work email",required:!0},{key:"phone",label:"Phone",required:!1},{key:"service",label:"Service",required:!1},{key:"industry",label:"Industry",required:!1},{key:"role",label:"Role(s) you're hiring for",required:!0},{key:"headcount",label:"Number of people",required:!1},{key:"start",label:"Ideal start date",required:!1},{key:"details",label:"Tell us more",required:!0}]}];a.s(["CUSTOM_FILE_ACCEPT",0,".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx","CUSTOM_FILE_TYPES",0,["application/pdf","image/jpeg","image/png","image/webp","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"],"contactFields",0,["email","name","firstName","lastName"],"customFieldTypes",0,[{id:"text",label:"Short text"},{id:"textarea",label:"Long text"},{id:"email",label:"Email"},{id:"tel",label:"Phone"},{id:"number",label:"Number"},{id:"date",label:"Date"},{id:"select",label:"Dropdown"},{id:"file",label:"File upload"},{id:"section",label:"Section heading"}],"customIn",0,function(a,b){return void 0===b?a.custom:a.custom.filter(a=>a.section===b)},"getFormDef",0,function(a){return b.find(b=>b.id===a)},"isRequired",0,function(a,b){let c=a.fields[b];return c?c.shown&&c.required:a.custom.some(a=>a.key===b&&a.required)},"resolveLayout",0,function(a,b){let c={};for(let d of a.fields){let a=b.fields[d.key]??{};c[d.key]={shown:d.core||!a.hidden,required:a.required??d.required}}return{fields:c,custom:b.custom}},"shown",0,function(a,b){return a.fields[b]?.shown??!0}])},66916,98186,a=>{"use strict";let b={AF:"Africa",AS:"Asia",EU:"Europe",NA:"North America",SA:"South America",OC:"Oceania"},c=`Afghanistan|93|AS
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

//# sourceMappingURL=src_0dkaukj._.js.map