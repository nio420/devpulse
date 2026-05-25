import { createRequire } from 'module';
    const require = createRequire(import.meta.url);
import y from"express";var v=(r,s,e,t)=>{e.status(500).json({success:!1,message:r.message||"Internal Server Error",errors:r})},A=v;import{Router as k}from"express";var F=(r,s)=>{r.status(s.statusCode).json({success:s.success,message:s.message,data:s.data})},a=F;import H from"dotenv";H.config();var M={databaseUrl:process.env.DATABASE_URL,port:process.env.PORT,jwtSecretKey:process.env.JWT_SECRET_KEY,clientUrl:process.env.CLIENT_URL},c=M;import{Pool as B}from"pg";var n=new B({connectionString:c.databaseUrl}),S=async()=>{try{await n.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'contributor',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `),await n.query(`
      CREATE TABLE IF NOT EXISTS issues (
        id SERIAL PRIMARY KEY,
        reporter_id INTEGER NOT NULL,
        title VARCHAR(150) NOT NULL,
        description TEXT NOT NULL,
        type VARCHAR(20) NOT NULL,
        status VARCHAR(20) DEFAULT 'open',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `),console.log("Database initialized successfully!")}catch(r){console.error("DATABASE ERROR:",r.message)}};import h from"bcrypt";import W from"jsonwebtoken";var P=async r=>{let{name:s,email:e,password:t,role:o}=r;if((await n.query(`
        SELECT * FROM users WHERE email = $1;
        `,[e])).rows.length>0)throw new Error("User already exists");let u=o||"contributor",i=await h.hash(t,10),R=(await n.query("INSERT INTO users (name, email, password, role) VALUES($1, $2, $3, $4) RETURNING *",[s,e,i,u])).rows[0];return delete R.password,R},j=async r=>{let{email:s,password:e}=r,t=await n.query(`
        SELECT * FROM users WHERE email = $1;
    `,[s]);if(t.rows.length===0)throw new Error("User not found");let o=t.rows[0];if(!await h.compare(e,o.password))throw new Error("Invalid Credentials!");delete o.password;let u={id:o.id,email:o.email,role:o.role};return{token:W.sign(u,c.jwtSecretKey,{expiresIn:"20d"}),user:o}},g={signUpUserDB:P,loginUserDB:j};var U=async(r,s)=>{try{let e=await g.signUpUserDB(r.body);a(s,{statusCode:201,success:!0,message:"User registered successfully",data:e})}catch(e){let t="Signup failed";e instanceof Error&&(t=e.message),a(s,{statusCode:400,success:!1,message:t,error:e})}},C=async(r,s)=>{try{let e=await g.loginUserDB(r.body);a(s,{statusCode:200,success:!0,message:"Login successful",data:e})}catch(e){let t="Login failed";e instanceof Error&&(t=e.message),a(s,{statusCode:400,success:!1,message:t,error:e})}};var I=k();I.post("/signup",U);I.post("/login",C);var L=I;import{Router as Q}from"express";var V=async(r,s)=>{let{title:e,description:t,type:o}=r;if((await n.query(`
        SELECT * FROM users WHERE id = $1
        `,[s])).rows.length===0)throw new Error("User not found.");return await n.query(`
            INSERT INTO issues (reporter_id, title, description, type ) VALUES ($1, $2, $3, $4) RETURNING *
        `,[s,e,t,o])},Y=async r=>{let{sort:s,type:e,status:t}=r,o=["newest","oldest"],p=["bug","feature_request"],u=["open","in_progress","resolved"];if(s&&!o.includes(s))throw new Error("Invalid sort value");if(e&&!p.includes(e))throw new Error("Invalid type value");if(t&&!u.includes(t))throw new Error("Invalid status value");let i="SELECT * FROM issues WHERE 1=1";e&&(i+=` AND type = '${e}'`),t&&(i+=` AND status = '${t}'`),s==="oldest"?i+=" ORDER BY created_at ASC":i+=" ORDER BY created_at DESC";let T=await n.query(i),R=[];for(let d of T.rows){let $=(await n.query("SELECT id, name, role FROM users WHERE id = $1",[d.reporter_id])).rows[0];R.push({id:d.id,title:d.title,description:d.description,type:d.type,status:d.status,reporter:$,created_at:d.created_at,updated_at:d.updated_at})}return R},K=async r=>{let s=await n.query(`
        SELECT * FROM issues WHERE id = $1
        `,[r]);if(s.rows.length===0)throw new Error("Issue not found.");let e=s.rows[0],o=(await n.query("SELECT id, name, role FROM users WHERE id = $1",[e.reporter_id])).rows[0];return{id:e.id,title:e.title,description:e.description,type:e.type,status:e.status,reporter:o,created_at:e.created_at,updated_at:e.updated_at}},G=async(r,s,e)=>{let t=await n.query("SELECT * FROM issues WHERE id = $1",[r]);if(t.rows.length===0)throw new Error("Issue not found.");let o=t.rows[0],u=(await n.query("SELECT id, role FROM users WHERE id = $1",[e.id])).rows[0];if(u.role==="contributor"){if(o.reporter_id!==u.id)throw new Error("You can only update your own issue");if(o.status!=="open")throw new Error("You can only update open issues")}return await n.query(`
            UPDATE issues SET title =COALESCE($1, title), description = COALESCE($2, description), type = COALESCE($3, type), updated_at = NOW() WHERE id = $4
        `,[s.title,s.description,s.type,r])},J=async r=>{if((await n.query(`
        SELECT * FROM issues WHERE id = $1
    `,[r])).rows.length===0)throw new Error("Issue not found.");return await n.query(`
        DELETE FROM issues WHERE id = $1
    `,[r])},m={createIssueDB:V,getAllIssuesDB:Y,getSingleIssueDB:K,updateIssueDB:G,deleteIssueDB:J};var N=async(r,s)=>{try{let e=r.user.id,t=await m.createIssueDB(r.body,e);a(s,{statusCode:201,success:!0,message:"Issue created successfully",data:t.rows[0]})}catch(e){let t="Issue creation failed";e instanceof Error&&(t=e.message),a(s,{statusCode:500,success:!1,message:t,error:e})}},x=async(r,s)=>{try{let e=await m.getAllIssuesDB(r.query);a(s,{statusCode:200,success:!0,message:"Issues retrived successfully",data:e})}catch(e){let t="Issue fetching failed";e instanceof Error&&(t=e.message),a(s,{statusCode:500,success:!1,message:t,error:e})}},D=async(r,s)=>{try{let{id:e}=r.params,t=await m.getSingleIssueDB(Number(e));a(s,{statusCode:200,success:!0,message:"Issues retrived successfully",data:t})}catch(e){let t="Issue fetching failed";e instanceof Error&&(t=e.message),a(s,{statusCode:500,success:!1,message:t,error:e})}},O=async(r,s)=>{try{let{id:e}=r.params,t=r.user,o=await m.updateIssueDB(Number(e),r.body,t);a(s,{statusCode:200,success:!0,message:"Issue updated successfully",data:o.rows[0]})}catch(e){let t="Issue update failed";e instanceof Error&&(t=e.message),a(s,{statusCode:500,success:!1,message:t,error:e})}},q=async(r,s)=>{try{let{id:e}=r.params,t=await m.deleteIssueDB(Number(e));a(s,{statusCode:200,success:!0,message:"Issue deleted successfully",data:t.rows[0]})}catch(e){let t="Issue delete failed";e instanceof Error&&(t=e.message),a(s,{statusCode:500,success:!1,message:t,error:e})}};import z from"jsonwebtoken";var X=(...r)=>async(s,e,t)=>{try{let o=s.headers.authorization;if(!o)return e.status(401).json({success:!1,message:"Unauthorized Access!"});let p=z.verify(o,c.jwtSecretKey),u=await n.query("SELECT * FROM users WHERE id = $1",[p.id]);if(u.rows.length===0)return e.status(404).json({success:!1,message:"User not found!"});let i=u.rows[0];if(r.length&&!r.includes(i.role))return e.status(404).json({success:!1,message:"User not authorized!"});s.user=p,t()}catch(o){return e.status(401).json({success:!1,message:"Invalid or expired token",error:o})}},w=X;var f={contributor:"contributor",maintainer:"maintainer"};var E=Q();E.post("/",w(f.contributor,f.maintainer),N);E.get("/",x);E.get("/:id",D);E.patch("/:id",w(f.contributor,f.maintainer),O);E.delete("/:id",w(f.maintainer),q);var b=E;import Z from"cors";var l=y();l.use(Z({origin:c.clientUrl,credentials:!0}));l.use(y.json());l.use(y.text());l.use(y.urlencoded({extended:!0}));l.use("/api/auth",L);l.use("/api/issues",b);l.get("/",(r,s)=>{s.status(200).json({message:"Hello Developers!",author:"Omit"})});l.use(A);var _=l;var ee=()=>{S(),_.listen(c.port,()=>{console.log(`Server is running on port ${c.port}`)})};ee();
//# sourceMappingURL=server.js.map