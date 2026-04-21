const SEED_USERS = [
  { id:"u1", name:"Aisha Khan", school:"MIT", year:"Junior · CS", bio:"Loves teaching code over coffee. Patient and detail-oriented.", category:"Tech", rating:4.9, sessions:23, teach:["Python","Data Structures","Algorithms"], learn:["Spanish","Public Speaking"] },
  { id:"u2", name:"Marco Silva", school:"Berklee", year:"Sophomore · Music", bio:"Music student & part-time tutor. Will teach scales for sandwiches.", category:"Music", rating:4.8, sessions:17, teach:["Guitar","Music Theory","Songwriting"], learn:["Public Speaking","French"] },
  { id:"u3", name:"Lina Park", school:"RISD", year:"Senior · Design", bio:"Design major obsessed with type and grids.", category:"Design", rating:5.0, sessions:31, teach:["Figma","UI Design","Typography"], learn:["Photography","Python"] },
  { id:"u4", name:"Diego Romero", school:"NYU", year:"Junior · Lit", bio:"Bilingual and patient. Loves essay structure.", category:"Languages", rating:4.7, sessions:14, teach:["Spanish","Essay Writing"], learn:["Calculus","Figma"] },
  { id:"u5", name:"Priya Nair", school:"Stanford", year:"Senior · Physics", bio:"Math nerd, future engineer. Tutored 50+ students.", category:"Academic", rating:4.9, sessions:42, teach:["Calculus","Physics","Linear Algebra"], learn:["Figma","Photography"] },
  { id:"u6", name:"Tom Becker", school:"Yale", year:"Junior · Art", bio:"Photographer and bookworm.", category:"Creative", rating:4.6, sessions:11, teach:["Photography","Lightroom","Composition"], learn:["Guitar","Python"] },
  { id:"u7", name:"Yuki Tanaka", school:"UCLA", year:"Sophomore · Linguistics", bio:"Speaks 3 languages, learning a 4th.", category:"Languages", rating:4.8, sessions:19, teach:["Japanese","Translation","Mandarin"], learn:["Python","Music Theory"] },
  { id:"u8", name:"Sam O'Connor", school:"Oxford", year:"Senior · PPE", bio:"Toastmaster club president. Helps with stage fright.",  category:"Soft Skills", rating:4.9, sessions:27, teach:["Public Speaking","Debate","Interview Prep"], learn:["Japanese","Guitar"] },
  { id:"u9", name:"Maya Patel", school:"CMU", year:"Junior · ML", bio:"AI researcher in training. Loves explaining hard things simply.", category:"Tech", rating:5.0, sessions:33, teach:["Machine Learning","Python","Statistics"], learn:["UI Design","Public Speaking"] },
  { id:"u10", name:"Felix Wagner", school:"ETH Zürich", year:"Senior · Eng", bio:"Robotics nerd with a knack for whiteboards.", category:"Tech", rating:4.7, sessions:15, teach:["C++","Robotics","Math"], learn:["Spanish","Songwriting"] },
];

const CATEGORIES = [
  { key:"Tech", emoji:"💻", desc:"Code, AI, web" },
  { key:"Design", emoji:"🎨", desc:"UI, type, brand" },
  { key:"Music", emoji:"🎸", desc:"Theory, instruments" },
  { key:"Languages", emoji:"🗣️", desc:"Speak fluently" },
  { key:"Academic", emoji:"📐", desc:"Math, science" },
  { key:"Creative", emoji:"📸", desc:"Photo, video, art" },
  { key:"Soft Skills", emoji:"🎤", desc:"Speaking, debate" },
];
