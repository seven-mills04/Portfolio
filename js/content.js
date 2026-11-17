/*
  EVERYTHING ON THE SITE COMES FROM THIS FILE.
  Change the text between the quotes, save, refresh the page.
  Anything left as "" (empty) is simply hidden on the site.
*/
window.PORTFOLIO = {
  name: "Krishna Navneet Kumar",
  firstLine: "Krishna",
  secondLine: "Navneet Kumar",
  role: "Java backend developer",
  status: "Open to software engineering roles",
  location: "Ghaziabad, India",
  intro:
    "Final-year B.Tech CSE student at IMSEC, Ghaziabad. I build full-stack web apps with Java, Spring Boot and React, and I like the part you don't see most: APIs, databases and the checks that keep them safe.",

  photo: "assets/krishna.jpg",
  resume: "assets/krishna-resume.pdf",

  email: "knavneetkumar768@gmail.com",
  github: "https://github.com/seven-mills04",
  linkedin: "https://www.linkedin.com/in/krishnanavneetkumar/",

  /* The "ask this page" box in the hero. Each question shows the SQL and the answer. */
  questions: [
    {
      ask: "Who is Krishna?",
      sql: "SELECT name, role, based_in\nFROM people\nWHERE id = 'krishna';",
      columns: ["name", "role", "based_in"],
      rows: [["Krishna Navneet Kumar", "Java backend developer", "Ghaziabad, India"]]
    },
    {
      ask: "Where has he worked?",
      sql: "SELECT company, role, period\nFROM experience\nORDER BY started DESC;",
      columns: ["company", "role", "period"],
      rows: [["BSES Yamuna Power Ltd.", "Software Development Intern", "Jun – Jul 2026"]]
    },
    {
      ask: "What has he built?",
      sql: "SELECT project, what_it_does\nFROM work\nORDER BY started DESC;",
      columns: ["project", "what_it_does"],
      rows: [
        ["AskDB", "Ask a database questions in plain English"],
        ["Electricity Billing System", "Meter readings in, bills and payments out"]
      ]
    },
    {
      ask: "What does he build with?",
      sql: "SELECT tool, used_for\nFROM stack\nORDER BY hours_spent DESC\nLIMIT 5;",
      columns: ["tool", "used_for"],
      rows: [
        ["Java", "Core language"],
        ["Spring Boot", "REST APIs and security"],
        ["MySQL, PostgreSQL", "Data"],
        ["React", "Front end"],
        ["Docker", "Running and shipping"]
      ]
    },
    {
      ask: "How do I reach him?",
      sql: "SELECT channel, address\nFROM contact;",
      columns: ["channel", "address"],
      rows: [
        ["Email", "knavneetkumar768@gmail.com"],
        ["LinkedIn", "krishnanavneetkumar"],
        ["GitHub", "seven-mills04"]
      ]
    }
  ],

  /* Projects, shown in this order. Add more by copying a block. */
  projects: [
    {
      name: "AskDB",
      year: "2026",
      tagline: "Ask a database questions in plain English.",
      summary:
        "Connect a PostgreSQL or MySQL database, type a question the way you'd say it out loud, and AskDB writes the SQL, runs it and charts the answer. Every generated query is parsed and checked before it touches the database.",
      steps: [
        { title: "You ask", text: "A plain-English question goes to the Spring Boot API." },
        { title: "It writes SQL", text: "Groq turns the question into SQL; JSqlParser checks the query before it runs." },
        { title: "You get the answer", text: "Rows come back as a table and a Recharts chart." }
      ],
      details: [
        "Sign-in with Spring Security and JWT",
        "Saved database passwords are AES-encrypted",
        "Tests run on every push with GitHub Actions",
        "Runs anywhere with Docker Compose"
      ],
      stack: ["Java 21", "Spring Boot 3", "Spring Data JPA", "PostgreSQL", "MySQL", "React", "Vite", "MUI", "Recharts", "Docker"],
      links: [
        { label: "Open AskDB", url: "https://askdb-sigma.vercel.app/" },
        { label: "Read the code", url: "https://github.com/seven-mills04/askdb" }
      ]
    },
    {
      name: "Electricity Billing System",
      year: "2026",
      tagline: "Built during my internship at BSES Yamuna Power Ltd.",
      summary:
        "A full-stack billing app covering five modules: consumer management, connection provisioning, meter readings, tariff-based billing and payments. Bills are generated automatically instead of being worked out by hand.",
      steps: [],
      details: [
        "15+ REST API endpoints, documented with Swagger/OpenAPI",
        "5-slab tariff engine turns meter readings into units and charges",
        "JWT sign-in with separate Admin and Consumer dashboards",
        "Containerized with Docker"
      ],
      stack: ["Java", "Spring Boot", "Spring Security", "JWT", "MySQL", "React", "Swagger", "Docker"],
      links: [
        { label: "Backend code", url: "https://github.com/seven-mills04/Electricity-Billing-System" },
        { label: "Frontend code", url: "https://github.com/seven-mills04/electricity-billing-ui" }
      ]
    }
  ],

  /* What I work with, grouped. */
  stack: [
    { group: "Backend", items: ["Java", "Spring Boot", "Spring MVC", "Spring Security + JWT", "Hibernate, Spring Data JPA", "REST API design"] },
    { group: "Data", items: ["MySQL", "PostgreSQL", "SQL", "JDBC"] },
    { group: "Front end", items: ["React", "JavaScript", "JSP"] },
    { group: "Shipping", items: ["Docker", "Jenkins (CI/CD)", "GitHub Actions", "Oracle Cloud (OCI)", "Git, Maven", "Postman, Swagger"] }
  ],

  /* Timeline, newest first. It shows on the site once there are 2 or more entries. */
  path: [
    { when: "Nov 2026", title: "Built and launched AskDB", note: "Plain-English-to-SQL tool: Spring Boot backend first, then the React front end." },
    { when: "Jul 2026", title: "AMD Developer Hackathon: ACT II", note: "lablab.ai. Built and submitted a solution on AMD Developer Cloud and Hugging Face Spaces." },
    { when: "Jun – Jul 2026", title: "Software Development Intern, BSES Yamuna Power Ltd.", note: "New Delhi. Built the Electricity Billing System end to end." },
    { when: "Jan 2024 – Jan 2026", title: "Member, Runtime Hacker Society", note: "IMSEC. Organized 3+ campus coding competitions with 80+ participants each, led a REST API workshop, and ran bi-weekly Java OOP and system design sessions for 30+ members." },
    { when: "2023 – 2027", title: "B.Tech, Computer Science & Engineering", note: "IMS Engineering College (IMSEC), Ghaziabad, AKTU. Graduating July 2027." }
  ],

  /* Shown as a short list under the timeline. */
  certificates: [
    "Oracle Cloud Infrastructure (OCI) Foundations Associate, Oracle",
    "McKinsey Forward Program, McKinsey & Company",
    "AMD Developer Hackathon: ACT II, Certificate of Completion"
  ]
};
