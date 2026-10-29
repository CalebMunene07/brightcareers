module.exports=[81531,(e,a,l)=>{a.exports=e.x("@aws-sdk/client-s3-ecbef8e33fd0b8f0",()=>require("@aws-sdk/client-s3-ecbef8e33fd0b8f0"))},54799,(e,a,l)=>{a.exports=e.x("crypto",()=>require("crypto"))},66486,(e,a,l)=>{a.exports=e.x("mongodb-438b504308ffa4be",()=>require("mongodb-438b504308ffa4be"))},70406,(e,a,l)=>{a.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},18622,(e,a,l)=>{a.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},20635,(e,a,l)=>{a.exports=e.x("next/dist/server/app-render/action-async-storage.external.js",()=>require("next/dist/server/app-render/action-async-storage.external.js"))},24725,(e,a,l)=>{a.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},56704,(e,a,l)=>{a.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,a,l)=>{a.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},59043,(e,a,l)=>{a.exports=e.x("next/dist/server/runtime-reacts.external.js",()=>require("next/dist/server/runtime-reacts.external.js"))},93695,(e,a,l)=>{a.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},66680,(e,a,l)=>{a.exports=e.x("node:crypto",()=>require("node:crypto"))},81111,(e,a,l)=>{a.exports=e.x("node:stream",()=>require("node:stream"))},12057,(e,a,l)=>{a.exports=e.x("node:util",()=>require("node:util"))},14747,(e,a,l)=>{a.exports=e.x("path",()=>require("path"))},1018,67741,e=>{"use strict";e.i(66680);var a=e.i(81531);e.i(66486);var l=e.i(59776);async function t(){let e=await (0,l.getSettings)();return e.r2AccountId&&e.r2AccessKeyId&&e.r2SecretAccessKey&&e.r2PrivateBucket?{client:new a.S3Client({region:"auto",endpoint:`https://${e.r2AccountId}.r2.cloudflarestorage.com`,credentials:{accessKeyId:e.r2AccessKeyId,secretAccessKey:e.r2SecretAccessKey}}),bucket:e.r2PrivateBucket}:null}async function i(e){if("r2"===e.storage){let l=await t();if(!l)return null;let i=await l.client.send(new a.GetObjectCommand({Bucket:l.bucket,Key:e.key}));return i.Body?Buffer.from(await i.Body.transformToByteArray()):null}return e.data?Buffer.from(e.data.buffer):null}async function r(e){if(e?.storage!=="r2")return;let l=await t();l&&await l.client.send(new a.DeleteObjectCommand({Bucket:l.bucket,Key:e.key}))}e.s(["deleteCv",0,r,"readCv",0,i],1018);var n=e.i(43793);let o={AF:"Africa",AS:"Asia",EU:"Europe",NA:"North America",SA:"South America",OC:"Oceania"},s=`Afghanistan|93|AS
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
Zimbabwe|263|AF`.split("\n").map(e=>{let[a,l,t]=e.split("|");return{name:a,dial:`+${l}`,continent:o[t]}});s.map(e=>e.name),s.map(e=>[e.name,e]),s.map(e=>({value:e.name,label:`${e.name} (${e.dial})`}));let c=[{key:"applications",label:"Job applications",singular:"Application",collection:n.collections.applications,columns:[{field:"name",label:"Name"},{field:"job",label:"Job"},{field:"email",label:"Email"}],detail:[{field:"name",label:"Name"},{field:"email",label:"Email"},{field:"phone",label:"Phone"},{field:"location",label:"Location"},{field:"job",label:"Job"},{field:"message",label:"Cover note",long:!0}],files:[{path:"cv",label:"CV"}]},{key:"visa",label:"Visa applications",singular:"Visa application",collection:n.collections.visaApplications,columns:[{field:"name",label:"Name"},{field:"country",label:"Destination"},{field:"job",label:"Role"}],detail:[{field:"name",label:"Full name"},{field:"email",label:"Email"},{field:"phone",label:"Phone"},{field:"birthDate",label:"Date of birth"},{field:"gender",label:"Gender"},{field:"nationality",label:"Nationality"},{field:"passport",label:"Passport number"},{field:"issueDate",label:"Passport issued"},{field:"expiryDate",label:"Passport expires"},{field:"issuePlace",label:"Place of issue"},{field:"authority",label:"Issuing authority"},{field:"address",label:"Current address",long:!0},{field:"employment",label:"Employment status"},{field:"occupation",label:"Occupation"},{field:"employer",label:"Employer"},{field:"income",label:"Monthly income (USD)"},{field:"originCountry",label:"Departure country"},{field:"country",label:"Destination"},{field:"job",label:"Role"},{field:"visaType",label:"Visa type"},{field:"startDate",label:"Preferred start date"},{field:"applicants",label:"Number of applicants"},{field:"fees",label:"Fees quoted",long:!0},{field:"paymentMethod",label:"Preferred payment method"}],files:[{key:"passport",label:"Passport bio page",required:!0},{key:"cv",label:"Curriculum vitae / resume",required:!0},{key:"certificates",label:"Relevant certificates",required:!1},{key:"photo",label:"Passport-sized photograph",required:!0}].map(e=>({path:`documents.${e.key}`,label:e.label}))},{key:"tickets",label:"Air ticket requests",singular:"Air ticket request",collection:n.collections.ticketRequests,columns:[{field:"email",label:"Email"},{field:"route",label:"Route"},{field:"departDate",label:"Departure"}],detail:[{field:"email",label:"Email"},{field:"from",label:"Departure country"},{field:"to",label:"Destination"},{field:"departDate",label:"Departure date"},{field:"returnDate",label:"Return date"},{field:"passengers",label:"Passengers"},{field:"travelClass",label:"Travel class"},{field:"bookingFee",label:"Booking fee quoted"},{field:"notes",label:"Additional notes",long:!0}],files:[{path:"documents.passport",label:"Travelling passport"}]},{key:"forms",label:"Other applications",singular:"Application",collection:n.collections.formSubmissions,columns:[{field:"name",label:"Name"},{field:"formTitle",label:"Form"},{field:"email",label:"Email"}],detail:[{field:"formTitle",label:"Form"},{field:"name",label:"Full name"},{field:"email",label:"Email"},{field:"fees",label:"Fees quoted",long:!0},{field:"paymentMethod",label:"Preferred payment method"}]},{key:"requests",label:"Staff requests",singular:"Staff request",collection:n.collections.staffRequests,columns:[{field:"company",label:"Company"},{field:"role",label:"Role"},{field:"name",label:"Contact"}],detail:[{field:"name",label:"Name"},{field:"company",label:"Company"},{field:"email",label:"Email"},{field:"phone",label:"Phone"},{field:"service",label:"Service"},{field:"industry",label:"Industry"},{field:"role",label:"Role(s)"},{field:"headcount",label:"Number of people"},{field:"start",label:"Start date"},{field:"details",label:"Details",long:!0}]},{key:"messages",label:"Contact messages",singular:"Message",collection:n.collections.contacts,columns:[{field:"name",label:"Name"},{field:"topic",label:"Topic"},{field:"country",label:"Country"}],detail:[{field:"name",label:"Name"},{field:"email",label:"Email"},{field:"phone",label:"Phone"},{field:"country",label:"Country"},{field:"topic",label:"Topic"},{field:"message",label:"Message",long:!0}]},{key:"cvs",label:"CVs from CV maker",singular:"CV",collection:n.collections.cvs,columns:[{field:"name",label:"Name"},{field:"email",label:"Email"}],detail:[{field:"name",label:"Name"},{field:"email",label:"Email"}]},{key:"cv-downloads",label:"CV download purchases",singular:"CV download purchase",collection:n.collections.cvDownloads,columns:[{field:"name",label:"Name"},{field:"email",label:"Email"},{field:"paymentMethod",label:"Payment"}],detail:[{field:"name",label:"Name"},{field:"email",label:"Email"},{field:"paymentMethod",label:"Preferred payment method"},{field:"fee",label:"Amount to collect"},{field:"unlockCode",label:"Unlock code (send only after payment)"},{field:"redeemedAt",label:"First unlocked"}]},{key:"subscribers",label:"Newsletter subscribers",singular:"Subscriber",collection:n.collections.newsletter,columns:[{field:"email",label:"Email"}],detail:[{field:"email",label:"Email"}]}];function d(e,a){return a.split(".").reduce((e,a)=>e&&"object"==typeof e?e[a]:void 0,e)}function u(e){return Array.isArray(e.extraFiles)?e.extraFiles:[]}e.s(["customFiles",0,u,"getInboxType",0,function(e){return c.find(a=>a.key===e)},"getPath",0,d,"storedFiles",0,function(e,a){return a?[...(e.files??[]).map(e=>d(a,e.path)),...u(a).map(e=>e.file)].filter(e=>!!e):[]},"withoutFileData",0,function(e){return{...Object.fromEntries((e.files??[]).map(e=>[`${e.path}.data`,0])),"extraFiles.file.data":0}}],67741)},43793,e=>{"use strict";var a=e.i(66486);let l=globalThis;class t extends Error{constructor(){super("MONGODB_URI is not set")}}async function i(){let e=process.env.MONGODB_URI;if(!e)throw new t;return l.mongoClient??=new a.MongoClient(e).connect(),(await l.mongoClient).db(process.env.MONGODB_DB??"bridgecareers")}e.s(["DatabaseNotConfiguredError",0,t,"collections",0,{jobs:"jobs",content:"content",articles:"articles",solutions:"solutions",industries:"industries",media:"media",admins:"admins",loginAttempts:"loginAttempts",applications:"applications",staffRequests:"staffRequests",contacts:"contacts",cvs:"cvs",cvDownloads:"cvDownloads",newsletter:"newsletter",visaApplications:"visaApplications",ticketRequests:"ticketRequests",customForms:"customForms",formSubmissions:"formSubmissions",aiUsage:"aiUsage",privacyLog:"privacyLog",translations:"translations",settings:"settings"},"getDb",0,i])},59776,e=>{"use strict";var a=e.i(43793),l=e.i(66680);let t=[{id:"branding",title:"Brand colours",description:"The colours used across the website and admin: headers, buttons, links and highlights.",fields:[{key:"brandColor",label:"Main colour",env:"THEME_BRAND",color:!0,placeholder:"#da291c",help:"Buttons, links and section backgrounds."},{key:"brandDarkColor",label:"Dark colour",env:"THEME_BRAND_DARK",color:!0,placeholder:"#7a0d12",help:"Hero banners, footer and headings."},{key:"accentColor",label:"Accent colour",env:"THEME_ACCENT",color:!0,placeholder:"#ffc133",help:"Highlights and call-to-action buttons."}]},{id:"email",title:"Email (SMTP)",description:"Used to email your team when new applications, requests, messages and CVs arrive. Works with any provider.",fields:[{key:"smtpHost",label:"SMTP host",env:"SMTP_HOST",placeholder:"smtp.gmail.com"},{key:"smtpPort",label:"Port",env:"SMTP_PORT",placeholder:"587",help:"587 (STARTTLS) or 465 (SSL)."},{key:"smtpUser",label:"Username",env:"SMTP_USER"},{key:"smtpPass",label:"Password / app password",env:"SMTP_PASS",secret:!0},{key:"smtpFrom",label:"From address",env:"SMTP_FROM",placeholder:"Bridge Careers Global <no-reply@yourdomain.com>"},{key:"siteUrl",label:"Website address",env:"SITE_URL",placeholder:"https://www.yourdomain.com",help:"Used for links in emails."}]},{id:"storage",title:"Cloudflare R2 storage",description:"Image uploads (public bucket) and uploaded CVs (private bucket). Create an R2 API token with Object Read & Write.",fields:[{key:"r2AccountId",label:"Account ID",env:"R2_ACCOUNT_ID"},{key:"r2AccessKeyId",label:"Access key ID",env:"R2_ACCESS_KEY_ID"},{key:"r2SecretAccessKey",label:"Secret access key",env:"R2_SECRET_ACCESS_KEY",secret:!0},{key:"r2Bucket",label:"Public bucket (images)",env:"R2_BUCKET"},{key:"r2PublicUrl",label:"Public bucket URL",env:"R2_PUBLIC_URL",placeholder:"https://pub-xxxx.r2.dev"},{key:"r2PrivateBucket",label:"Private bucket (CVs)",env:"R2_PRIVATE_BUCKET",help:"Must NOT have public access. Leave empty to keep CVs in MongoDB."}]},{id:"translation",title:"Translation",description:"Machine translation for French, Portuguese and Swahili. Without one, translate by hand in Admin → Translations.",fields:[{key:"translator",label:"Service",env:"TRANSLATOR",options:[{value:"",label:"Automatic (first one with a key)"},{value:"azure",label:"Microsoft Azure Translator"},{value:"google",label:"Google Cloud Translation"},{value:"ai",label:"AI (AI Gateway)"}]},{key:"azureTranslatorKey",label:"Azure Translator key",env:"AZURE_TRANSLATOR_KEY",secret:!0,help:"Free tier F0: 2 million characters a month."},{key:"azureTranslatorRegion",label:"Azure region",env:"AZURE_TRANSLATOR_REGION",placeholder:"southafricanorth"},{key:"googleTranslateApiKey",label:"Google Translate API key",env:"GOOGLE_TRANSLATE_API_KEY",secret:!0}]},{id:"ai",title:"AI (Vercel AI Gateway)",description:"Powers the CV maker's writing help and the optional AI translator. Leave the key empty to turn AI features off.",fields:[{key:"aiGatewayApiKey",label:"AI Gateway API key",env:"AI_GATEWAY_API_KEY",secret:!0},{key:"cvAiModel",label:"CV help model",env:"CV_AI_MODEL",placeholder:"anthropic/claude-haiku-4.5"},{key:"translateAiModel",label:"AI translation model",env:"TRANSLATE_AI_MODEL",placeholder:"anthropic/claude-haiku-4.5"}]},{id:"security",title:"Scheduled jobs",description:"Secret your scheduler sends to /api/cron/retention as “Authorization: Bearer <secret>”.",fields:[{key:"cronSecret",label:"Cron secret",env:"CRON_SECRET",secret:!0,help:"Use a long random string."}]}].flatMap(e=>e.fields),i=null;async function r(){return(await (0,a.getDb)()).collection(a.collections.settings)}async function n(){if(i&&Date.now()-i.at<15e3)return i.values;let e={};try{e=(await (await r()).findOne({_id:"app"}))?.values??{}}catch(e){if(!(e instanceof a.DatabaseNotConfiguredError))throw e}return i={at:Date.now(),values:e},e}async function o(){let e=await n(),a={};for(let i of t){let t=e[i.key],r=t?t.sealed?function(e){let[a,t,i,r]=e.split(":");if("v1"!==a||!t||!i||!r)return null;try{let e=(0,l.createDecipheriv)("aes-256-gcm",function(){let e=process.env.AUTH_SECRET;if(!e||e.length<32)throw Error("AUTH_SECRET must be set to at least 32 characters");return Buffer.from((0,l.hkdfSync)("sha256",e,"bridgecareers-settings","settings-encryption-v1",32))}(),Buffer.from(t,"base64url"));return e.setAuthTag(Buffer.from(i,"base64url")),Buffer.concat([e.update(Buffer.from(r,"base64url")),e.final()]).toString("utf8")}catch{return null}}(t.value):t.value:null;a[i.key]=(r??process.env[i.env]??"").trim()}return a}async function s(e){return(await o())[e]??""}e.s(["getSettings",0,o,"setting",0,s],59776)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__1rmdi3p._.js.map