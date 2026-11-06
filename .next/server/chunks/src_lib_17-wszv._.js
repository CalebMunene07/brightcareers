module.exports=[1018,67741,e=>{"use strict";e.i(66680);var a=e.i(81531);e.i(66486);var l=e.i(59776);async function i(){let e=await (0,l.getSettings)();return e.r2AccountId&&e.r2AccessKeyId&&e.r2SecretAccessKey&&e.r2PrivateBucket?{client:new a.S3Client({region:"auto",endpoint:`https://${e.r2AccountId}.r2.cloudflarestorage.com`,credentials:{accessKeyId:e.r2AccessKeyId,secretAccessKey:e.r2SecretAccessKey}}),bucket:e.r2PrivateBucket}:null}async function t(e){if("r2"===e.storage){let l=await i();if(!l)return null;let t=await l.client.send(new a.GetObjectCommand({Bucket:l.bucket,Key:e.key}));return t.Body?Buffer.from(await t.Body.transformToByteArray()):null}return e.data?Buffer.from(e.data.buffer):null}async function n(e){if(e?.storage!=="r2")return;let l=await i();l&&await l.client.send(new a.DeleteObjectCommand({Bucket:l.bucket,Key:e.key}))}e.s(["deleteCv",0,n,"readCv",0,t],1018);var o=e.i(43793);let r={AF:"Africa",AS:"Asia",EU:"Europe",NA:"North America",SA:"South America",OC:"Oceania"},s=`Afghanistan|93|AS
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
Zimbabwe|263|AF`.split("\n").map(e=>{let[a,l,i]=e.split("|");return{name:a,dial:`+${l}`,continent:r[i]}});s.map(e=>e.name),s.map(e=>[e.name,e]),s.map(e=>({value:e.name,label:`${e.name} (${e.dial})`}));let c=[{key:"applications",label:"Job applications",singular:"Application",collection:o.collections.applications,columns:[{field:"name",label:"Name"},{field:"job",label:"Job"},{field:"email",label:"Email"}],detail:[{field:"name",label:"Name"},{field:"email",label:"Email"},{field:"phone",label:"Phone"},{field:"location",label:"Location"},{field:"job",label:"Job"},{field:"message",label:"Cover note",long:!0},{field:"applicationFee",label:"Application fee"},{field:"paymentStatus",label:"Payment status"},{field:"paymentAmount",label:"Amount charged"},{field:"paymentPaidAt",label:"Paid at"},{field:"paymentReference",label:"Payment reference"}],files:[{path:"cv",label:"CV"}]},{key:"visa",label:"Visa applications",singular:"Visa application",collection:o.collections.visaApplications,columns:[{field:"name",label:"Name"},{field:"country",label:"Destination"},{field:"job",label:"Role"}],detail:[{field:"name",label:"Full name"},{field:"email",label:"Email"},{field:"phone",label:"Phone"},{field:"birthDate",label:"Date of birth"},{field:"gender",label:"Gender"},{field:"nationality",label:"Nationality"},{field:"passport",label:"Passport number"},{field:"issueDate",label:"Passport issued"},{field:"expiryDate",label:"Passport expires"},{field:"issuePlace",label:"Place of issue"},{field:"authority",label:"Issuing authority"},{field:"address",label:"Current address",long:!0},{field:"employment",label:"Employment status"},{field:"occupation",label:"Occupation"},{field:"employer",label:"Employer"},{field:"income",label:"Monthly income (USD)"},{field:"originCountry",label:"Departure country"},{field:"country",label:"Destination"},{field:"job",label:"Role"},{field:"visaType",label:"Visa type"},{field:"startDate",label:"Preferred start date"},{field:"applicants",label:"Number of applicants"},{field:"fees",label:"Fees quoted",long:!0},{field:"paymentMethod",label:"Preferred payment method"},{field:"paymentStatus",label:"Payment status"},{field:"paymentAmount",label:"Amount charged"},{field:"paymentPaidAt",label:"Paid at"},{field:"paymentReference",label:"Paystack reference"}],files:[{key:"passport",label:"Passport bio page",required:!0},{key:"cv",label:"Curriculum vitae / resume",required:!0},{key:"certificates",label:"Relevant certificates",required:!1},{key:"photo",label:"Passport-sized photograph",required:!0}].map(e=>({path:`documents.${e.key}`,label:e.label}))},{key:"tickets",label:"Air ticket requests",singular:"Air ticket request",collection:o.collections.ticketRequests,columns:[{field:"email",label:"Email"},{field:"route",label:"Route"},{field:"departDate",label:"Departure"}],detail:[{field:"email",label:"Email"},{field:"from",label:"Departure country"},{field:"to",label:"Destination"},{field:"departDate",label:"Departure date"},{field:"returnDate",label:"Return date"},{field:"passengers",label:"Passengers"},{field:"travelClass",label:"Travel class"},{field:"bookingFee",label:"Booking fee quoted"},{field:"notes",label:"Additional notes",long:!0}],files:[{path:"documents.passport",label:"Travelling passport"}]},{key:"forms",label:"Other applications",singular:"Application",collection:o.collections.formSubmissions,columns:[{field:"name",label:"Name"},{field:"formTitle",label:"Form"},{field:"email",label:"Email"}],detail:[{field:"formTitle",label:"Form"},{field:"name",label:"Full name"},{field:"email",label:"Email"},{field:"fees",label:"Fees quoted",long:!0},{field:"paymentMethod",label:"Preferred payment method"},{field:"paymentStatus",label:"Payment status"},{field:"paymentAmount",label:"Amount charged"},{field:"paymentPaidAt",label:"Paid at"},{field:"paymentReference",label:"Paystack reference"}]},{key:"requests",label:"Staff requests",singular:"Staff request",collection:o.collections.staffRequests,columns:[{field:"company",label:"Company"},{field:"role",label:"Role"},{field:"name",label:"Contact"}],detail:[{field:"name",label:"Name"},{field:"company",label:"Company"},{field:"email",label:"Email"},{field:"phone",label:"Phone"},{field:"service",label:"Service"},{field:"industry",label:"Industry"},{field:"role",label:"Role(s)"},{field:"headcount",label:"Number of people"},{field:"start",label:"Start date"},{field:"details",label:"Details",long:!0}]},{key:"messages",label:"Contact messages",singular:"Message",collection:o.collections.contacts,columns:[{field:"name",label:"Name"},{field:"topic",label:"Topic"},{field:"country",label:"Country"}],detail:[{field:"name",label:"Name"},{field:"email",label:"Email"},{field:"phone",label:"Phone"},{field:"country",label:"Country"},{field:"topic",label:"Topic"},{field:"message",label:"Message",long:!0}]},{key:"cvs",label:"CVs from CV maker",singular:"CV",collection:o.collections.cvs,columns:[{field:"name",label:"Name"},{field:"email",label:"Email"}],detail:[{field:"name",label:"Name"},{field:"email",label:"Email"}]},{key:"cv-downloads",label:"CV download purchases",singular:"CV download purchase",collection:o.collections.cvDownloads,columns:[{field:"name",label:"Name"},{field:"email",label:"Email"},{field:"paymentMethod",label:"Payment"}],detail:[{field:"name",label:"Name"},{field:"email",label:"Email"},{field:"paymentMethod",label:"Preferred payment method"},{field:"fee",label:"Amount to collect"},{field:"paymentStatus",label:"Payment status"},{field:"paymentAmount",label:"Amount charged"},{field:"paymentPaidAt",label:"Paid at"},{field:"paymentReference",label:"Paystack reference"},{field:"unlockCode",label:"Unlock code (send only after payment)"},{field:"redeemedAt",label:"First unlocked"}]},{key:"subscribers",label:"Newsletter subscribers",singular:"Subscriber",collection:o.collections.newsletter,columns:[{field:"email",label:"Email"}],detail:[{field:"email",label:"Email"}]}];function d(e,a){return a.split(".").reduce((e,a)=>e&&"object"==typeof e?e[a]:void 0,e)}function u(e){return Array.isArray(e.extraFiles)?e.extraFiles:[]}e.s(["customFiles",0,u,"getInboxType",0,function(e){return c.find(a=>a.key===e)},"getPath",0,d,"storedFiles",0,function(e,a){return a?[...(e.files??[]).map(e=>d(a,e.path)),...u(a).map(e=>e.file)].filter(e=>!!e):[]},"withoutFileData",0,function(e){return{...Object.fromEntries((e.files??[]).map(e=>[`${e.path}.data`,0])),"extraFiles.file.data":0}}],67741)},34622,e=>{"use strict";e.i(66680);var a=e.i(1018),l=e.i(43793),i=e.i(67741),t=e.i(41104);let n=[{key:"applications",label:"Job applications",collection:l.collections.applications,retention:"applicationsMonths"},{key:"cvs",label:"CVs from the CV maker",collection:l.collections.cvs,retention:"cvsMonths"},{key:"cv-downloads",label:"CV download purchases",collection:l.collections.cvDownloads,retention:"cvsMonths"},{key:"messages",label:"Contact messages",collection:l.collections.contacts,retention:"messagesMonths"},{key:"requests",label:"Staff requests",collection:l.collections.staffRequests,retention:"requestsMonths"},{key:"visa",label:"Visa applications",collection:l.collections.visaApplications,retention:"visaMonths"},{key:"tickets",label:"Air ticket requests",collection:l.collections.ticketRequests,retention:"ticketsMonths"},{key:"forms",label:"Other applications",collection:l.collections.formSubmissions,retention:"formsMonths"},{key:"subscribers",label:"Newsletter",collection:l.collections.newsletter,retention:null}];async function o(e,l){let t=(0,i.getInboxType)(e);if(t?.files)for(let e of l)for(let l of(0,i.storedFiles)(t,e))await (0,a.deleteCv)(l)}async function r(e){let a=await (0,l.getDb)();return Promise.all(n.map(async l=>{let t,n=await a.collection(l.collection).find((t=e.trim().replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),{email:{$regex:`^${t}$`,$options:"i"}}),{projection:(0,i.withoutFileData)((0,i.getInboxType)(l.key)??{})}).sort({createdAt:-1}).toArray();return{...l,docs:n}}))}async function s(e){let a=await r(e);return{email:e,exportedAt:new Date().toISOString(),data:Object.fromEntries(a.map(e=>[e.key,e.docs.map(({_id:e,...a})=>({id:e.toString(),...a}))]))}}async function c(e="scheduled"){let a=await (0,t.getContent)("retention"),i=await (0,l.getDb)(),r={};for(let e of n){if(!e.retention)continue;let l=Number(a[e.retention]);if(!Number.isFinite(l)||l<=0)continue;let t=new Date;t.setMonth(t.getMonth()-l);let n=i.collection(e.collection),s={createdAt:{$lt:t}};await o(e.key,await n.find(s).toArray()),r[e.key]=(await n.deleteMany(s)).deletedCount}return await i.collection(l.collections.privacyLog).insertOne({action:"retention",result:r,by:e,at:new Date}),r}e.s(["exportByEmail",0,s,"runRetention",0,c])}];

//# sourceMappingURL=src_lib_17-wszv._.js.map