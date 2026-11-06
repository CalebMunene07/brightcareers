module.exports=[81531,(e,a,t)=>{a.exports=e.x("@aws-sdk/client-s3-ecbef8e33fd0b8f0",()=>require("@aws-sdk/client-s3-ecbef8e33fd0b8f0"))},66486,(e,a,t)=>{a.exports=e.x("mongodb-438b504308ffa4be",()=>require("mongodb-438b504308ffa4be"))},66680,(e,a,t)=>{a.exports=e.x("node:crypto",()=>require("node:crypto"))},12714,(e,a,t)=>{a.exports=e.x("node:fs/promises",()=>require("node:fs/promises"))},50227,(e,a,t)=>{a.exports=e.x("node:path",()=>require("node:path"))},1018,67741,e=>{"use strict";e.i(66680);var a=e.i(81531);e.i(66486);var t=e.i(59776);async function l(){let e=await (0,t.getSettings)();return e.r2AccountId&&e.r2AccessKeyId&&e.r2SecretAccessKey&&e.r2PrivateBucket?{client:new a.S3Client({region:"auto",endpoint:`https://${e.r2AccountId}.r2.cloudflarestorage.com`,credentials:{accessKeyId:e.r2AccessKeyId,secretAccessKey:e.r2SecretAccessKey}}),bucket:e.r2PrivateBucket}:null}async function o(e){if("r2"===e.storage){let t=await l();if(!t)return null;let o=await t.client.send(new a.GetObjectCommand({Bucket:t.bucket,Key:e.key}));return o.Body?Buffer.from(await o.Body.transformToByteArray()):null}return e.data?Buffer.from(e.data.buffer):null}async function i(e){if(e?.storage!=="r2")return;let t=await l();t&&await t.client.send(new a.DeleteObjectCommand({Bucket:t.bucket,Key:e.key}))}e.s(["deleteCv",0,i,"readCv",0,o],1018);var n=e.i(43793);let s={AF:"Africa",AS:"Asia",EU:"Europe",NA:"North America",SA:"South America",OC:"Oceania"},r=`Afghanistan|93|AS
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
Zimbabwe|263|AF`.split("\n").map(e=>{let[a,t,l]=e.split("|");return{name:a,dial:`+${t}`,continent:s[l]}});r.map(e=>e.name),r.map(e=>[e.name,e]),r.map(e=>({value:e.name,label:`${e.name} (${e.dial})`}));let d=[{key:"applications",label:"Job applications",singular:"Application",collection:n.collections.applications,columns:[{field:"name",label:"Name"},{field:"job",label:"Job"},{field:"email",label:"Email"}],detail:[{field:"name",label:"Name"},{field:"email",label:"Email"},{field:"phone",label:"Phone"},{field:"location",label:"Location"},{field:"job",label:"Job"},{field:"message",label:"Cover note",long:!0},{field:"applicationFee",label:"Application fee"},{field:"paymentStatus",label:"Payment status"},{field:"paymentAmount",label:"Amount charged"},{field:"paymentPaidAt",label:"Paid at"},{field:"paymentReference",label:"Payment reference"}],files:[{path:"cv",label:"CV"}]},{key:"visa",label:"Visa applications",singular:"Visa application",collection:n.collections.visaApplications,columns:[{field:"name",label:"Name"},{field:"country",label:"Destination"},{field:"job",label:"Role"}],detail:[{field:"name",label:"Full name"},{field:"email",label:"Email"},{field:"phone",label:"Phone"},{field:"birthDate",label:"Date of birth"},{field:"gender",label:"Gender"},{field:"nationality",label:"Nationality"},{field:"passport",label:"Passport number"},{field:"issueDate",label:"Passport issued"},{field:"expiryDate",label:"Passport expires"},{field:"issuePlace",label:"Place of issue"},{field:"authority",label:"Issuing authority"},{field:"address",label:"Current address",long:!0},{field:"employment",label:"Employment status"},{field:"occupation",label:"Occupation"},{field:"employer",label:"Employer"},{field:"income",label:"Monthly income (USD)"},{field:"originCountry",label:"Departure country"},{field:"country",label:"Destination"},{field:"job",label:"Role"},{field:"visaType",label:"Visa type"},{field:"startDate",label:"Preferred start date"},{field:"applicants",label:"Number of applicants"},{field:"fees",label:"Fees quoted",long:!0},{field:"paymentMethod",label:"Preferred payment method"},{field:"paymentStatus",label:"Payment status"},{field:"paymentAmount",label:"Amount charged"},{field:"paymentPaidAt",label:"Paid at"},{field:"paymentReference",label:"Paystack reference"}],files:[{key:"passport",label:"Passport bio page",required:!0},{key:"cv",label:"Curriculum vitae / resume",required:!0},{key:"certificates",label:"Relevant certificates",required:!1},{key:"photo",label:"Passport-sized photograph",required:!0}].map(e=>({path:`documents.${e.key}`,label:e.label}))},{key:"tickets",label:"Air ticket requests",singular:"Air ticket request",collection:n.collections.ticketRequests,columns:[{field:"email",label:"Email"},{field:"route",label:"Route"},{field:"departDate",label:"Departure"}],detail:[{field:"email",label:"Email"},{field:"from",label:"Departure country"},{field:"to",label:"Destination"},{field:"departDate",label:"Departure date"},{field:"returnDate",label:"Return date"},{field:"passengers",label:"Passengers"},{field:"travelClass",label:"Travel class"},{field:"bookingFee",label:"Booking fee quoted"},{field:"notes",label:"Additional notes",long:!0}],files:[{path:"documents.passport",label:"Travelling passport"}]},{key:"forms",label:"Other applications",singular:"Application",collection:n.collections.formSubmissions,columns:[{field:"name",label:"Name"},{field:"formTitle",label:"Form"},{field:"email",label:"Email"}],detail:[{field:"formTitle",label:"Form"},{field:"name",label:"Full name"},{field:"email",label:"Email"},{field:"fees",label:"Fees quoted",long:!0},{field:"paymentMethod",label:"Preferred payment method"},{field:"paymentStatus",label:"Payment status"},{field:"paymentAmount",label:"Amount charged"},{field:"paymentPaidAt",label:"Paid at"},{field:"paymentReference",label:"Paystack reference"}]},{key:"requests",label:"Staff requests",singular:"Staff request",collection:n.collections.staffRequests,columns:[{field:"company",label:"Company"},{field:"role",label:"Role"},{field:"name",label:"Contact"}],detail:[{field:"name",label:"Name"},{field:"company",label:"Company"},{field:"email",label:"Email"},{field:"phone",label:"Phone"},{field:"service",label:"Service"},{field:"industry",label:"Industry"},{field:"role",label:"Role(s)"},{field:"headcount",label:"Number of people"},{field:"start",label:"Start date"},{field:"details",label:"Details",long:!0}]},{key:"messages",label:"Contact messages",singular:"Message",collection:n.collections.contacts,columns:[{field:"name",label:"Name"},{field:"topic",label:"Topic"},{field:"country",label:"Country"}],detail:[{field:"name",label:"Name"},{field:"email",label:"Email"},{field:"phone",label:"Phone"},{field:"country",label:"Country"},{field:"topic",label:"Topic"},{field:"message",label:"Message",long:!0}]},{key:"cvs",label:"CVs from CV maker",singular:"CV",collection:n.collections.cvs,columns:[{field:"name",label:"Name"},{field:"email",label:"Email"}],detail:[{field:"name",label:"Name"},{field:"email",label:"Email"}]},{key:"cv-downloads",label:"CV download purchases",singular:"CV download purchase",collection:n.collections.cvDownloads,columns:[{field:"name",label:"Name"},{field:"email",label:"Email"},{field:"paymentMethod",label:"Payment"}],detail:[{field:"name",label:"Name"},{field:"email",label:"Email"},{field:"paymentMethod",label:"Preferred payment method"},{field:"fee",label:"Amount to collect"},{field:"paymentStatus",label:"Payment status"},{field:"paymentAmount",label:"Amount charged"},{field:"paymentPaidAt",label:"Paid at"},{field:"paymentReference",label:"Paystack reference"},{field:"unlockCode",label:"Unlock code (send only after payment)"},{field:"redeemedAt",label:"First unlocked"}]},{key:"subscribers",label:"Newsletter subscribers",singular:"Subscriber",collection:n.collections.newsletter,columns:[{field:"email",label:"Email"}],detail:[{field:"email",label:"Email"}]}];function c(e,a){return a.split(".").reduce((e,a)=>e&&"object"==typeof e?e[a]:void 0,e)}function u(e){return Array.isArray(e.extraFiles)?e.extraFiles:[]}e.s(["customFiles",0,u,"getInboxType",0,function(e){return d.find(a=>a.key===e)},"getPath",0,c,"storedFiles",0,function(e,a){return a?[...(e.files??[]).map(e=>c(a,e.path)),...u(a).map(e=>e.file)].filter(e=>!!e):[]},"withoutFileData",0,function(e){return{...Object.fromEntries((e.files??[]).map(e=>[`${e.path}.data`,0])),"extraFiles.file.data":0}}],67741)},34622,e=>{"use strict";e.i(66680);var a=e.i(1018),t=e.i(43793),l=e.i(67741),o=e.i(41104);let i=[{key:"applications",label:"Job applications",collection:t.collections.applications,retention:"applicationsMonths"},{key:"cvs",label:"CVs from the CV maker",collection:t.collections.cvs,retention:"cvsMonths"},{key:"cv-downloads",label:"CV download purchases",collection:t.collections.cvDownloads,retention:"cvsMonths"},{key:"messages",label:"Contact messages",collection:t.collections.contacts,retention:"messagesMonths"},{key:"requests",label:"Staff requests",collection:t.collections.staffRequests,retention:"requestsMonths"},{key:"visa",label:"Visa applications",collection:t.collections.visaApplications,retention:"visaMonths"},{key:"tickets",label:"Air ticket requests",collection:t.collections.ticketRequests,retention:"ticketsMonths"},{key:"forms",label:"Other applications",collection:t.collections.formSubmissions,retention:"formsMonths"},{key:"subscribers",label:"Newsletter",collection:t.collections.newsletter,retention:null}];async function n(e,t){let o=(0,l.getInboxType)(e);if(o?.files)for(let e of t)for(let t of(0,l.storedFiles)(o,e))await (0,a.deleteCv)(t)}async function s(e){let a=await (0,t.getDb)();return Promise.all(i.map(async t=>{let o,i=await a.collection(t.collection).find((o=e.trim().replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),{email:{$regex:`^${o}$`,$options:"i"}}),{projection:(0,l.withoutFileData)((0,l.getInboxType)(t.key)??{})}).sort({createdAt:-1}).toArray();return{...t,docs:i}}))}async function r(e){let a=await s(e);return{email:e,exportedAt:new Date().toISOString(),data:Object.fromEntries(a.map(e=>[e.key,e.docs.map(({_id:e,...a})=>({id:e.toString(),...a}))]))}}async function d(e="scheduled"){let a=await (0,o.getContent)("retention"),l=await (0,t.getDb)(),s={};for(let e of i){if(!e.retention)continue;let t=Number(a[e.retention]);if(!Number.isFinite(t)||t<=0)continue;let o=new Date;o.setMonth(o.getMonth()-t);let i=l.collection(e.collection),r={createdAt:{$lt:o}};await n(e.key,await i.find(r).toArray()),s[e.key]=(await i.deleteMany(r)).deletedCount}return await l.collection(t.collections.privacyLog).insertOne({action:"retention",result:s,by:e,at:new Date}),s}e.s(["exportByEmail",0,r,"runRetention",0,d])},41104,e=>{"use strict";var a=e.i(47540),t=e.i(43793),l=e.i(50531);e.i(66680),e.i(12714),e.i(50227),e.i(81531),e.i(66486),e.i(59776);let o=[{name:"icon",label:"Icon",type:"icon"},{name:"title",label:"Title"},{name:"text",label:"Text",type:"textarea"}],i={retention:{label:"Data retention",description:"How many months to keep submissions before they're deleted automatically. Leave empty or 0 to keep them.",kind:"object",fields:[{name:"applicationsMonths",label:"Job applications (months)",placeholder:"24"},{name:"cvsMonths",label:"CVs from the CV maker (months)",placeholder:"24"},{name:"messagesMonths",label:"Contact messages (months)",placeholder:"12"},{name:"requestsMonths",label:"Staff requests (months)",placeholder:"36"},{name:"visaMonths",label:"Visa applications (months)",placeholder:"24"},{name:"ticketsMonths",label:"Air ticket requests (months)",placeholder:"12"},{name:"formsMonths",label:"Other applications from Admin → Forms (months)",placeholder:"24"}],default:{applicationsMonths:"24",cvsMonths:"24",messagesMonths:"12",requestsMonths:"36",visaMonths:"24",ticketsMonths:"12",formsMonths:"24"},usedOn:[],group:"Settings"},notifications:{label:"Email notifications",description:"Who receives an email when a new application, staff request, message or CV arrives.",kind:"object",fields:[{name:"recipients",label:"Recipient emails (comma-separated)",placeholder:"recruitment@yourdomain.com, ops@yourdomain.com"}],default:{recipients:""},usedOn:[],group:"Settings"},stats:{label:"Company figures",description:"The four headline numbers shown on the homepage, employer and who-we-are pages.",kind:"list",itemLabel:"Figure",fields:[{name:"value",label:"Number",placeholder:"1,200+"},{name:"label",label:"Label",placeholder:"Candidates placed every year"}],default:l.stats,usedOn:["/","/employers","/employers/who-we-are"],group:"Company"},company:{label:"Contact details",description:"General contact email shown on the contact page.",kind:"object",fields:[{name:"contactEmail",label:"Contact email"}],default:{contactEmail:l.contactEmail},usedOn:["/contact-us"],group:"Company"},offices:{label:"Offices",description:"Office cards on the contact page.",kind:"list",itemLabel:"Office",fields:[{name:"city",label:"City"},{name:"address",label:"Address"},{name:"phone",label:"Phone"}],default:l.offices,usedOn:["/contact-us"],group:"Company"},milestones:{label:"Company story",description:"Timeline on the who-we-are page.",kind:"list",itemLabel:"Milestone",fields:[{name:"period",label:"Title or year",placeholder:"2019"},{name:"text",label:"Text",type:"textarea"}],default:l.milestones,usedOn:["/employers/who-we-are"],group:"Company"},divisions:{label:"Divisions",description:"Group brands on the who-we-are page.",kind:"list",itemLabel:"Division",fields:[{name:"name",label:"Name"},{name:"text",label:"Description",type:"textarea"},{name:"href",label:"Link",placeholder:"/employers/solutions/training"}],default:l.divisions,usedOn:["/employers/who-we-are"],group:"Company"},jobSeekerFaq:{label:"Job seeker FAQ",description:"Questions and answers on the job seeker FAQ page.",kind:"list",itemLabel:"Question",fields:[{name:"q",label:"Question"},{name:"a",label:"Answer",type:"textarea"}],default:[{q:"What does a recruitment agency do?",a:"We match people looking for work with employers who need staff. We find the roles, help you prepare, put you forward to employers and support you once you start. Our service is free for job seekers."},{q:"Do I have to pay to use Bridge Careers Global?",a:"No. Employers pay for our services. We will never ask a candidate for money to apply for a job, register with us or start an assignment."},{q:"How do I apply for a job?",a:"Search our open roles, choose a job and complete the short application form with your CV. If nothing fits right now, send us your CV through the contact page and a consultant will be in touch when a suitable role comes up."},{q:"Do you offer training?",a:"Yes. Through Bridge Academy we offer courses and certifications for many of the roles we recruit for, from health and safety to digital skills. Ask your consultant what's available in your area."},{q:"How and when will I be paid on a temporary assignment?",a:"When you work through Bridge on a temporary assignment, we pay you directly into your bank account on a regular schedule agreed at the start. Your consultant will explain timesheets and pay dates before your first day."},{q:"Can a temporary job become permanent?",a:"Often, yes. Many employers use temporary assignments to find permanent hires. If you'd like a permanent role, tell your consultant so they can look for opportunities with that potential."},{q:"What happens when my assignment ends?",a:"Your consultant will check in before your assignment finishes and look for your next role, so you can move straight on to new work wherever possible."},{q:"How is my personal data used?",a:"We only use your information to help you find work and to meet our legal obligations. You can read the details, and how to ask us to delete your data, in our privacy policy."}],usedOn:["/faq"],group:"Help & FAQ"},employerFaq:{label:"Employer FAQ",description:"Questions and answers on the employer FAQ page.",kind:"list",itemLabel:"Question",fields:[{name:"q",label:"Question"},{name:"a",label:"Answer",type:"textarea"}],default:[{q:"How quickly can you supply staff?",a:"For many temporary roles we can place pre-screened people within a few days. Permanent and specialist roles typically take one to three weeks to shortlist, depending on the role."},{q:"How are your fees structured?",a:"Temporary staff are charged at an hourly or daily rate that covers pay, statutory costs and our margin. Permanent placements are usually a one-off fee based on the starting salary. We'll give you a clear quote before any work starts."},{q:"Who employs the temporary workers?",a:"For temporary assignments, workers are employed by Bridge. We handle contracts, payroll, statutory deductions and compliance, so you receive a single invoice."},{q:"How do you screen candidates?",a:"Every candidate is interviewed and has their identity, right to work and references checked. Depending on the role we also run skills tests, certification checks and background checks."},{q:"What if a placement doesn't work out?",a:"Tell your consultant straight away. For temporary roles we'll arrange a replacement as quickly as possible. Permanent placements include a replacement guarantee period."},{q:"Can I hire a temporary worker permanently?",a:"Yes. Temp-to-perm is a great way to reduce hiring risk. The terms for transferring a worker to your payroll are set out in our agreement."},{q:"Do you recruit outside our country?",a:"Yes. We recruit across several countries and can support cross-border hiring, including the documentation needed for international candidates."},{q:"How do I get started?",a:"Send us a staff request with a few details about the role and timing. A consultant will call you within one working day to discuss your needs."}],usedOn:["/employers/faq"],group:"Help & FAQ"},applyTips:{label:"Application tips",description:"Expandable tips on the working-with-Bridge page.",kind:"list",itemLabel:"Tip",fields:[{name:"title",label:"Title"},{name:"points",label:"Tips (one per line)",type:"lines"}],default:[{title:"Writing your CV",points:["Keep it to two pages and put your most relevant experience first.","Use the same keywords as the job advert so your skills are easy to spot.","Show results with numbers where you can: targets met, people managed, money saved.","Check spelling and contact details carefully before you send it."]},{title:"Online assessments",points:["Find a quiet place with a reliable internet connection.","Read each instruction carefully and keep an eye on the timer.","Practise with free example tests beforehand so the format feels familiar.","Answer personality questions honestly rather than guessing what's wanted."]},{title:"Interview preparation",points:["Research the employer: what they do, their customers and recent news.","Prepare examples using the situation, task, action, result approach.","Plan your journey or test your video call set-up in advance.","Have two or three questions ready to ask at the end."]}],usedOn:["/working-with-bridge"],group:"Help & FAQ"},bridgeDifference:{label:"The Bridge difference",description:"Image-and-text section below the stats on the employers page.",kind:"object",fields:[{name:"title",label:"Heading"},{name:"text",label:"Text",type:"textarea"},{name:"points",label:"Bullet points (one per line)",type:"lines"},{name:"image",label:"Image",type:"image"}],default:{title:"The Bridge difference",text:"We pair specialist recruiters who understand your sector with the reach of a multi-country network. That means faster shortlists, better-matched candidates and one partner who can support you across temporary, permanent and outsourced hiring.",points:["Consultants who specialise in your industry","Compliance, payroll and contracts handled for you","Clear service levels and regular reporting"],image:"/images/meeting-table.jpg"},usedOn:["/employers"],group:"Page sections"},workModels:{label:"Ways of working",description:"The delivery models on the how-we-work page.",kind:"list",itemLabel:"Model",fields:[{name:"title",label:"Title"},{name:"text",label:"Text",type:"textarea"},{name:"points",label:"Bullet points (one per line)",type:"lines"},{name:"image",label:"Image",type:"image"},{name:"href",label:"More-information link (optional)",placeholder:"/employers/solutions/outsourcing"}],default:l.workModels.map(e=>({...e,href:e.href??""})),usedOn:["/employers/how-we-work"],group:"Page sections"},technology:{label:"Powered by technology",description:"Six-item grid on employer, solution and who-we-are pages.",kind:"list",itemLabel:"Item",fields:o,default:l.technology,usedOn:["/employers","/employers/solutions","/employers/who-we-are"],group:"Page sections"},advantages:{label:"The Bridge advantage",description:"Four-item band on employer, solution and industry pages.",kind:"list",itemLabel:"Advantage",fields:o,default:l.advantages,usedOn:["/employers","/employers/solutions","/employers/industries"],group:"Page sections"},whyBridge:{label:"Why employers choose Bridge",description:"Feature grid on each service and industry page.",kind:"list",itemLabel:"Reason",fields:o,default:l.whyBridge,usedOn:["/employers/solutions/flexible-staffing","/employers/industries/healthcare"],group:"Page sections"},hiringSteps:{label:"Our hiring process",description:"Numbered steps on each service page.",kind:"list",itemLabel:"Step",fields:o,default:l.hiringSteps,usedOn:["/employers/solutions/flexible-staffing"],group:"Page sections"},candidateJourney:{label:"Your journey with Bridge",description:"Numbered steps on the working-with-Bridge page.",kind:"list",itemLabel:"Step",fields:o,default:[{icon:"search",title:"Find a role",text:"Search our jobs or browse by country and industry."},{icon:"send",title:"Apply",text:"Send your application and CV in a couple of minutes."},{icon:"chat",title:"Talk to a consultant",text:"We call to learn about your skills, goals and availability."},{icon:"check",title:"Get prepared",text:"We help with your CV, assessments and interview practice."},{icon:"handshake",title:"Meet the employer",text:"We arrange interviews and pass on feedback either way."},{icon:"rocket",title:"Start your new job",text:"We sort paperwork and stay in touch after you begin."}],usedOn:["/working-with-bridge"],group:"Page sections"},refugeeHelp:{label:"Refugees: how we can help",description:"Feature grid on the jobs-for-refugees page.",kind:"list",itemLabel:"Item",fields:o,default:[{icon:"chat",title:"One-to-one advice",text:"A consultant who listens, explains how work and hiring work locally, and answers your questions."},{icon:"cv",title:"CV and interview help",text:"We help you show your skills and experience in a way local employers understand."},{icon:"academic",title:"Training and certificates",text:"Courses through Bridge Academy to update skills or gain local certifications."},{icon:"handshake",title:"Inclusive employers",text:"We work with employers who are committed to giving refugees a fair chance."}],usedOn:["/jobs-for-refugees"],group:"Page sections"},refugeeSteps:{label:"Refugees: getting started",description:"Numbered steps on the jobs-for-refugees page.",kind:"list",itemLabel:"Step",fields:o,default:[{icon:"phone",title:"Get in touch",text:"Contact us online or visit one of our offices. You can bring someone to help translate."},{icon:"shield",title:"Check your documents",text:"Together we check what you need to be allowed to work and how to get it."},{icon:"search",title:"Find the right role",text:"We match your skills and goals with suitable jobs, training or both."},{icon:"rocket",title:"Start and grow",text:"We stay in touch after you start and help you plan your next step."}],usedOn:["/jobs-for-refugees"],group:"Page sections"},refugeeFaq:{label:"Refugees: common questions",description:"Questions and answers on the jobs-for-refugees page.",kind:"list",itemLabel:"Question",fields:[{name:"q",label:"Question"},{name:"a",label:"Answer",type:"textarea"}],default:[{q:"Do I have to pay for your help?",a:"No. Our service is always free for job seekers, including refugees and displaced people. Never pay anyone who asks for money to get you a job."},{q:"What documents do I need?",a:"This depends on the country. Usually you need proof of identity and proof that you are allowed to work, such as a residence permit or a work permit. If you are not sure what you have or what you need, talk to us and we will help you find out."},{q:"My qualifications are from another country. Can I still use them?",a:"Often, yes. Many qualifications can be recognised or compared. We can point you to the right recognition body and suggest roles where your experience counts while you wait."},{q:"I don't speak the local language well yet. Can I still apply?",a:"Yes. Some roles need only basic language skills to start, and we can tell you about language courses. Tell your consultant which languages you speak; they can be an advantage."}],usedOn:["/jobs-for-refugees"],group:"Help & FAQ"}};async function n(){return(await (0,t.getDb)()).collection(t.collections.content)}let s=(0,a.cache)(async e=>{try{let a=await (await n()).findOne({key:e});return a?.value??i[e].default}catch(a){if(a instanceof t.DatabaseNotConfiguredError)return i[e].default;throw a}});e.s(["getContent",0,s],41104)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__01gs-l4._.js.map