module.exports=[12057,(a,b,c)=>{b.exports=a.x("node:util",()=>require("node:util"))},13095,(a,b,c)=>{"use strict";function d(a){for(let b=0;b<a.length;b++){let c=a[b];if("function"!=typeof c)throw Object.defineProperty(Error(`A "use server" file can only export async functions, found ${typeof c}.
Read more: https://nextjs.org/docs/messages/invalid-use-server-value`),"__NEXT_ERROR_CODE",{value:"E352",enumerable:!1,configurable:!0})}}Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"ensureServerEntryExports",{enumerable:!0,get:function(){return d}})},37936,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"registerServerReference",{enumerable:!0,get:function(){return d.registerServerReference}});let d=a.r(11857)},83424,a=>{"use strict";let b={AF:"Africa",AS:"Asia",EU:"Europe",NA:"North America",SA:"South America",OC:"Oceania"},c=`Afghanistan|93|AS
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
Zimbabwe|263|AF`.split("\n").map(a=>{let[c,d,e]=a.split("|");return{name:c,dial:`+${d}`,continent:b[e]}}),d=c.map(a=>a.name),e=new Map(c.map(a=>[a.name,a]));c.map(a=>({value:a.name,label:`${a.name} (${a.dial})`})),a.s(["countryNames",0,d,"findCountry",0,function(a){return e.get(a)}])},98451,a=>{"use strict";var b=a.i(66680),c=a.i(81531),d=a.i(66486),e=a.i(16648);let f={"application/pdf":"pdf","application/msword":"doc","application/vnd.openxmlformats-officedocument.wordprocessingml.document":"docx","image/jpeg":"jpg","image/png":"png","image/webp":"webp"};async function g(){let a=await (0,e.getSettings)();return a.r2AccountId&&a.r2AccessKeyId&&a.r2SecretAccessKey&&a.r2PrivateBucket?{client:new c.S3Client({region:"auto",endpoint:`https://${a.r2AccountId}.r2.cloudflarestorage.com`,credentials:{accessKeyId:a.r2AccessKeyId,secretAccessKey:a.r2SecretAccessKey}}),bucket:a.r2PrivateBucket}:null}async function h(a){return i(a,"cvs")}async function i(a,e){let h=Buffer.from(await a.arrayBuffer()),i={name:a.name.slice(0,200),type:a.type,size:a.size},j=await g();if(!j)return{...i,storage:"mongo",data:new d.Binary(h)};let k=`${e}/${new Date().toISOString().slice(0,7)}/${(0,b.randomUUID)()}.${f[a.type]??"bin"}`;return await j.client.send(new c.PutObjectCommand({Bucket:j.bucket,Key:k,Body:h,ContentType:a.type,CacheControl:"private, no-store"})),{...i,storage:"r2",key:k}}async function j(a){if(a?.storage!=="r2")return;let b=await g();b&&await b.client.send(new c.DeleteObjectCommand({Bucket:b.bucket,Key:a.key}))}a.s(["deleteCv",0,j,"storeCv",0,h,"storeFile",0,i])},28741,a=>{"use strict";var b=a.i(61469),c=a.i(74982);function d(a){return{slug:a.slug,title:a.title,company:a.company,location:a.location,country:a.country||void 0,city:a.city||void 0,type:a.type,industry:a.industry,salary:a.salary,posted:a.posted,closes:a.closes||void 0,summary:a.summary,responsibilities:a.responsibilities??[],requirements:a.requirements??[],published:a.published??!0}}async function e(){return(await (0,b.getDb)()).collection(b.collections.jobs)}async function f(){let a=(0,c.todayIso)();try{return(await (await e()).find({published:{$ne:!1},$or:[{closes:{$exists:!1}},{closes:null},{closes:""},{closes:{$gte:a}}]}).sort({posted:-1}).toArray()).map(d)}catch(d){if(d instanceof b.DatabaseNotConfiguredError)return c.sampleJobs.filter(b=>(0,c.isOpen)(b,a));throw d}}async function g(a){return(await f()).find(b=>b.slug===a)}async function h(a){try{let b=await (await e()).findOne({slug:a,published:{$ne:!1}});return b?d(b):void 0}catch(d){if(d instanceof b.DatabaseNotConfiguredError)return c.sampleJobs.find(b=>b.slug===a);throw d}}async function i(){return(await (await e()).find().sort({posted:-1}).toArray()).map(d)}async function j(a){let b=await (await e()).findOne({slug:a});return b?d(b):void 0}async function k(a,b){let c=await e(),d=new Date;await c.updateOne({slug:b??a.slug},{$set:{...a,updatedAt:d},$setOnInsert:{createdAt:d}},{upsert:!0})}async function l(a){await (await e()).deleteOne({slug:a})}async function m(a){return await (await e()).countDocuments({slug:a},{limit:1})>0}async function n(a,b){for(let c=1;;c++){let d=1===c?a:`${a}-${c}`;if(d===b||!await m(d))return d}}async function o(){let a=await e(),b=0;for(let d of c.sampleJobs)b+=(await a.updateOne({slug:d.slug},{$setOnInsert:{...d,published:!0,createdAt:new Date}},{upsert:!0})).upsertedCount;return b}a.s(["deleteJob",0,l,"getAllJobs",0,i,"getJobBySlug",0,j,"getJobForPage",0,h,"getPublishedJob",0,g,"getPublishedJobs",0,f,"importSampleJobs",0,o,"saveJob",0,k,"slugExists",0,m,"uniqueSlug",0,n])},74982,a=>{"use strict";var b=a.i(21269);function c(a){if(a.country)return a.country;let b=a.location.split(",").map(a=>a.trim()).filter(Boolean);return b[b.length-1]??""}let d=process.env.SITE_TIMEZONE||"Africa/Lusaka";function e(a=new Date){try{return new Intl.DateTimeFormat("en-CA",{timeZone:d,year:"numeric",month:"2-digit",day:"2-digit"}).format(a)}catch{return a.toISOString().slice(0,10)}}let f={en:"en-GB",fr:"fr-FR",pt:"pt-PT",sw:"sw-KE"};a.s(["daysUntilClose",0,function(a,b=e()){return a.closes?Math.round((Date.parse(a.closes)-Date.parse(b))/864e5):null},"formatLocation",0,function(a,b){return a&&"Remote"!==b?`${a}, ${b}`:b},"formatPosted",0,function(a,b="en"){return new Date(a).toLocaleDateString(f[b]??"en-GB",{day:"numeric",month:"short",year:"numeric"})},"isOpen",0,function(a,b=e()){return!a.closes||a.closes>=b},"jobCountry",0,c,"jobSlug",0,function(a,c,d){return(0,b.slugify)(`${a} ${"Remote"===d?"remote":c||d}`)},"jobTypes",0,["Permanent","Temporary","Contract"],"sampleJobs",0,[{slug:"registered-nurse-lusaka",title:"Registered Nurse",company:"Private hospital group",location:"Lusaka, Zambia",type:"Permanent",industry:"healthcare",salary:"Competitive + benefits",posted:"2026-09-29",summary:"Join a growing private hospital providing high-quality inpatient and outpatient care.",responsibilities:["Deliver safe, patient-centred nursing care on a medical ward","Administer medication and monitor patient progress","Work closely with doctors and allied health professionals","Maintain accurate clinical records"],requirements:["Registered with the national nursing council","At least 2 years' post-qualification experience","Strong communication and teamwork skills"]},{slug:"software-engineer-remote",title:"Full-Stack Software Engineer",company:"Fintech scale-up",location:"Remote",type:"Permanent",industry:"technology",salary:"$45,000 – $65,000",posted:"2026-09-30",summary:"Build customer-facing payment products used by thousands of small businesses.",responsibilities:["Design and ship features across the web app and APIs","Write tests and review teammates' code","Work with product and design to shape the roadmap"],requirements:["3+ years with TypeScript, React and Node.js","Experience with relational databases","Comfortable working in a remote, async team"]},{slug:"warehouse-operative-johannesburg",title:"Warehouse Operative",company:"National distribution centre",location:"Johannesburg, South Africa",type:"Temporary",industry:"logistics",salary:"Hourly rate + overtime",posted:"2026-10-01",summary:"Immediate starts for picking, packing and dispatch during the peak season.",responsibilities:["Pick and pack orders accurately using handheld scanners","Load and unload deliveries safely","Keep work areas clean and organised"],requirements:["Able to work shifts including weekends","Previous warehouse experience is a plus","Good attention to detail"]},{slug:"accountant-london",title:"Management Accountant",company:"Professional services firm",location:"London, United Kingdom",type:"Permanent",industry:"finance",salary:"£50,000 – £58,000",posted:"2026-09-24",summary:"Own month-end reporting and support budgeting for a growing advisory business.",responsibilities:["Prepare monthly management accounts and variance analysis","Support annual budgeting and quarterly forecasts","Improve reporting processes and controls"],requirements:["ACCA, CIMA or ACA qualified (or finalist)","Strong Excel skills","Experience in a services business preferred"]},{slug:"civil-engineer-contract",title:"Civil Engineer",company:"Infrastructure contractor",location:"Ndola, Zambia",type:"Contract",industry:"engineering",salary:"Day rate negotiable",posted:"2026-09-20",summary:"12-month contract on a regional road rehabilitation project.",responsibilities:["Supervise site works against design and specification","Coordinate subcontractors and materials","Produce progress and quality reports"],requirements:["Degree in civil engineering","5+ years on roads or infrastructure projects","Registered with the engineering institution"]},{slug:"sous-chef-cape-town",title:"Sous Chef",company:"Boutique hotel",location:"Cape Town, South Africa",type:"Permanent",industry:"hospitality",salary:"Competitive + meals",posted:"2026-09-27",summary:"Help lead a small, creative kitchen team in a well-reviewed hotel restaurant.",responsibilities:["Run the pass and lead service in the head chef's absence","Train and mentor junior chefs","Manage stock, ordering and food safety records"],requirements:["Previous sous chef or senior CDP experience","Food safety certification","Calm under pressure"]},{slug:"site-manager-construction",title:"Site Manager",company:"Residential developer",location:"Lusaka, Zambia",type:"Contract",industry:"construction",salary:"Competitive",posted:"2026-09-18",summary:"Lead day-to-day delivery of a 60-unit residential development.",responsibilities:["Manage site teams and subcontractors","Ensure health and safety compliance","Track programme and report to the project manager"],requirements:["Proven site management experience","Health and safety qualification","Strong planning skills"]},{slug:"machine-operator-temp",title:"Machine Operator",company:"Food manufacturer",location:"Kitwe, Zambia",type:"Temporary",industry:"manufacturing",salary:"Hourly rate",posted:"2026-10-02",summary:"Operate packaging lines in a modern food production facility.",responsibilities:["Set up and run packaging machinery","Carry out quality checks during production","Report faults and support maintenance"],requirements:["Experience in a production environment","Willing to work rotating shifts","Good hygiene and safety awareness"]},{slug:"store-manager-retail",title:"Store Manager",company:"Fashion retailer",location:"Johannesburg, South Africa",type:"Permanent",industry:"retail",salary:"Base + performance bonus",posted:"2026-09-22",summary:"Lead a high-footfall store and a team of 20 sales associates.",responsibilities:["Hit sales and margin targets","Recruit, coach and schedule the store team","Keep visual standards and stock levels on point"],requirements:["2+ years managing a retail store","Commercial mindset","Strong people leadership"]},{slug:"maths-teacher",title:"Secondary Maths Teacher",company:"International school",location:"Lusaka, Zambia",type:"Permanent",industry:"education",salary:"Competitive + housing allowance",posted:"2026-09-15",summary:"Teach IGCSE and A-level mathematics in a supportive international school.",responsibilities:["Plan and deliver engaging maths lessons","Assess and report on student progress","Contribute to extracurricular activities"],requirements:["Teaching qualification and maths degree","Experience with IGCSE or A-level curricula","Passion for student development"]},{slug:"solar-technician",title:"Solar PV Technician",company:"Renewable energy installer",location:"Livingstone, Zambia",type:"Contract",industry:"energy",salary:"Monthly rate",posted:"2026-09-28",summary:"Install and commission solar systems for commercial and residential clients.",responsibilities:["Install PV panels, inverters and batteries","Test and commission systems","Diagnose and repair faults"],requirements:["Electrical trade qualification","Hands-on solar installation experience","Valid driver's licence"]},{slug:"office-administrator",title:"Office Administrator",company:"Logistics company",location:"London, United Kingdom",type:"Temporary",industry:"office",salary:"£14 – £16 per hour",posted:"2026-10-01",summary:"Three-month cover supporting a busy operations office.",responsibilities:["Manage the reception desk and incoming calls","Process invoices and update spreadsheets","Coordinate meetings and diaries"],requirements:["Previous office or admin experience","Confident with Microsoft Office","Friendly and organised"]}],"searchJobs",0,function(a,b){let d=b.q?.trim().toLowerCase(),e=b.location?.trim().toLowerCase();return a.filter(a=>(!d||!!`${a.title} ${a.summary} ${a.company}`.toLowerCase().includes(d))&&(!e||c(a).toLowerCase()===e||!!a.location.toLowerCase().includes(e))&&(!b.type||a.type===b.type)&&(!b.industry||a.industry===b.industry)).sort((a,b)=>b.posted.localeCompare(a.posted))},"todayIso",0,e])},71554,a=>{"use strict";var b=a.i(83424);a.s(["ROUTE_FEES_NOTE",0,"{same} within one country · {continent} within one continent · {euna} between Europe and North America · {other} other international routes","defaultPricing",0,{visaFees:[{label:"Processing fee",amount:50}],routeFees:{sameCountry:15,sameContinent:25,europeNorthAmerica:45,other:60},processingTime:"15 – 20 business days",cvDownloadFee:50,paymentMethods:[{id:"Card",label:"Visa card",note:"Credit / Debit",mark:"VISA · MC · AMEX"},{id:"Skrill",label:"Skrill",note:"",mark:"SKRILL"},{id:"Neteller",label:"Neteller",note:"",mark:"NETELLER"}],paymentInstructions:""},"feesTotal",0,function(a){return a.reduce((a,b)=>a+b.amount,0)},"pricingStrings",0,function(a){return[...a.visaFees.map(a=>a.label),a.processingTime,...a.paymentMethods.flatMap(a=>[a.label,a.note]),a.paymentInstructions].filter(Boolean)},"routeFee",0,function(a,c,d){if(!c||!d)return 0;if(c===d)return a.sameCountry;let e=(0,b.findCountry)(c)?.continent,f=(0,b.findCountry)(d)?.continent;return e&&e===f?a.sameContinent:"Europe"===e&&"North America"===f||"North America"===e&&"Europe"===f?a.europeNorthAmerica:a.other},"usd",0,function(a){return`USD ${a.toFixed(2)}`}])},21269,a=>{"use strict";a.s(["isSafeHref",0,function(a){return/^\/(?!\/)[^\s]*$/.test(a)||/^https?:\/\/[^\s]+$/.test(a)},"lines",0,function(a){return String(a??"").split("\n").map(a=>a.trim()).filter(Boolean)},"slugify",0,function(a){return a.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,80)}])},44470,a=>{"use strict";a.i(71554);let b={Canada:["Caregiving","Welding","CNA","Nursing","Cleaning","Farm work","Receptionist","Supermarket attendant","Cruise ship jobs"],"United States":["Caregiving","Welding","CNA","Nursing","Cleaning","Farm work","Receptionist","Supermarket attendant","Cruise ship jobs"],"United Kingdom":["Caregiving","Welding","CNA","Nursing","Cleaning","Farm work","Receptionist","Supermarket attendant","Cruise ship jobs"],Germany:["Au pair","Cleaning","Housekeeping","Waiter/waitress","Farm work","Nursing"],Luxembourg:["Caregiving","Cleaning","Welding","Driving","Nursing","Housekeeping","Waiter/waitress"],Netherlands:["Au pair","Cleaning","Housekeeping","Waiter/waitress","Farm work","Nursing"],Finland:["Caregiving","Cleaning","Housekeeping","Nursing","Farm work","Welding"],Turkey:["Nanny","Cleaning","Housekeeping","Farm work","Driving","Riders","Factory work","Welding"],Australia:["Farming","Teaching","Caregiving","Nursing","Driving","Construction","Clinical medicine"],"New Zealand":["Farming","Teaching","Caregiving","Nursing","Driving","Construction","Hospitality"]};Object.keys(b);let c="Student visa";a.s(["DOC_TYPES",0,["application/pdf","image/jpeg","image/png","image/webp"],"MAX_UPLOAD_BYTES",0,4194304,"applicantCounts",0,["1","2","3","4+"],"asksEmployment",0,a=>a!==c,"destinations",0,b,"employmentFields",0,["employment","occupation","employer","income"],"employmentStatuses",0,["Employed","Self-employed","Student","Between roles","Retired"],"genders",0,["Female","Male","Non-binary","Prefer not to say"],"travelClasses",0,["Economy","Premium economy","Business"],"visaDocuments",0,[{key:"passport",label:"Passport bio page",required:!0},{key:"cv",label:"Curriculum vitae / resume",required:!0},{key:"certificates",label:"Relevant certificates",required:!1},{key:"photo",label:"Passport-sized photograph",required:!0}],"visaTypes",0,["Work visa","Skilled worker visa","Seasonal work visa","Care visa",c]])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__1e47i29._.js.map