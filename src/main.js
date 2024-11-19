import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import ejs from "ejs";

// Function to format a URL as a valid filename
function formatUrlToFilename(url) {
  return url
    .replace(/https?:\/\//, "") // Remove protocol (http:// or https://)
    .replace(/[\/:?#&]/g, "_") // Replace invalid filename characters with '_'
    .replace(/\s+/g, "_"); // Replace spaces with underscores
}

function formatFileToFilename(filePath) {
  const baseName = path.basename(filePath, path.extname(filePath)); // Get the file name without extension
  return baseName.replace(/\s+/g, "_"); // Replace spaces with underscores
}

async function printPDF(url) {
  // Launch Puppeteer
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Navigate to the desired URL
  await page.goto(url, { waitUntil: "networkidle0" });

  // Create the PDF and return it as a buffer (in-memory)
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  // Close the browser instance
  await browser.close();

  return pdfBuffer;
}

async function generatePDFs(urls) {
  for (const url of urls) {
    try {
      const pdfBuffer = await printPDF(url);
      const filename = formatUrlToFilename(url) + ".pdf";
      const outputPath = filename;

      // Save the buffer to a file
      fs.writeFileSync(outputPath, pdfBuffer);
      console.log(`PDF saved successfully as ${filename}`);
    } catch (error) {
      console.error(`Error generating PDF for ${url}:`, error);
    }
  }
}

// List of URLs to create PDFs for
const urls = [
  "https://blog.risingstack.com",
  "https://www.amazon.com/",
  "https://www.yahoo.com",
];

// generatePDFs(urls);

async function printPDFFromFile(filePath) {
  // Launch Puppeteer
  const browser = await puppeteer.launch({ headless: true });

  const page = await browser.newPage();

  // Load the local HTML file
  const fileUrl = `file://${path.resolve(filePath)}`;
  await page.goto(fileUrl, { waitUntil: "networkidle0" });

  // Create the PDF and return it as a buffer (in-memory)
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    deviceScaleFactor: 2,
    scale: 1,
    margin: {
      top: "20mm",
      right: "20mm",
      bottom: "20mm",
      left: "20mm",
    },
  });

  // Close the browser instance
  await browser.close();

  return pdfBuffer;
}

async function printPDFFromTemplate(templatePath) {
  const htmlContent = await ejs.renderFile(templatePath, {
    fname: "TESTING FNAME",
    date: "2023-06-30",
    pages: "0",
    skills: [
      {
        name: "Digital Dexterity",
        score: {
          prev: 3,
          target: 5,
          current: 4,
        },
        requirements:
          "Understanding and utilizing modern digital tools and technologies.",
        courses: [
          {
            name: "Introduction to Digital Tools",
            url: "https://www.example.com/course1",
          },
          {
            name: "Advanced Digital Skills for Professionals",
            url: "https://www.example.com/course2",
          },
        ],
      },
      {
        name: "Legal Project Management",
        score: {
          prev: 4,
          target: 6,
          current: 5,
        },
        requirements:
          "Effective management of legal projects, teams, and resources.",
        courses: [
          {
            name: "Legal Project Management Fundamentals",
            url: "https://www.example.com/course3",
          },
          {
            name: "Managing Legal Risks",
            url: "https://www.example.com/course4",
          },
        ],
      },
      {
        name: "Business Development",
        score: {
          prev: 2,
          target: 4,
          current: 3,
        },
        requirements:
          "Understanding of market trends and ability to develop strategies to grow business.",
        courses: [
          {
            name: "Market Analysis and Business Strategies",
            url: "https://www.example.com/course5",
          },
          {
            name: "Advanced Business Development Techniques",
            url: "https://www.example.com/course6",
          },
        ],
      },
    ],
    competencies: [
      {
        name: "Collaboration & Teamwork",
        score: {
          prev: 5,
          target: 6,
          current: 5,
        },
        requirements:
          "Ability to work effectively with others to achieve common goals.",
        courses: [
          {
            name: "Team Collaboration in the Workplace",
            url: "https://www.example.com/course7",
          },
          {
            name: "Effective Communication in Teams",
            url: "https://www.example.com/course8",
          },
        ],
      },
      {
        name: "Leadership",
        score: {
          prev: 4,
          target: 7,
          current: 6,
        },
        requirements:
          "Inspiring and leading teams towards success, with focus on decision-making and management.",
        courses: [
          {
            name: "Leadership Essentials",
            url: "https://www.example.com/course9",
          },
          {
            name: "Strategic Leadership Skills",
            url: "https://www.example.com/course10",
          },
        ],
      },
      {
        name: "Networking",
        score: {
          prev: 3,
          target: 5,
          current: 4,
        },
        requirements:
          "Building and maintaining professional relationships that benefit career growth.",
        courses: [
          {
            name: "Networking Strategies for Career Growth",
            url: "https://www.example.com/course11",
          },
          {
            name: "Mastering Professional Networking",
            url: "https://www.example.com/course12",
          },
        ],
      },
    ],
    skillChart: {
      dataset: [
        [1, 2, 3, 1, 2, 2, 3],
        [3, 4, 5, 4, 5, 5, 4],
        [4, 5, 5, 5, 5, 5, 4],
      ],
      labels: [
        "Digital Dexterity",
        "Legal Project Management",
        "Commercial Risk Assessment for Clients",
        "Business Development",
        "Business Partnering",
        "Process Improvement",
        "Design Thinking & Legal Design",
      ],
    },
    competenciesChart: {
      dataset: [
        [1, 2, 3, 1, 2, 2, 3],
        [3, 4, 5, 4, 5, 5, 4],
        [4, 5, 5, 5, 5, 5, 4],
      ],
      labels: [
        "Digital Dexterity",
        "Legal Project Management",
        "Commercial Risk Assessment for Clients",
        "Business Development",
        "Business Partnering",
        "Process Improvement",
        "Design Thinking & Legal Design",
      ],
    },
    bandingSkills: [
      {
        name: "Digital Dexterity",
        score: {
          current: 3,
          prev: 2,
          target: 5,
        },
        bandings: {
          1: {
            requirements:
              "Basic awareness of digital tools and technologies, with an ability to use them for simple tasks.",
          },
          2: {
            requirements:
              "Ability to effectively use digital tools for routine tasks, with some understanding of their functionalities and integration.",
          },
          3: {
            requirements:
              "Proficient in using digital tools to optimize daily tasks; familiar with multiple tools and how they integrate in a digital workspace.",
          },
          4: {
            requirements:
              "Advanced proficiency in utilizing digital tools for complex tasks, with an understanding of automation and integration across platforms.",
          },
          5: {
            requirements:
              "Expert in integrating and managing multiple digital tools, utilizing them for strategic decision-making and workflow optimization.",
          },
          6: {
            requirements:
              "Thought leader in digital technologies; able to guide and train others, driving innovation and transformation in the digital workspace.",
          },
        },
      },
      {
        name: "Communication Skills",
        score: {
          current: 4,
          prev: 3,
          target: 6,
        },
        bandings: {
          1: {
            requirements:
              "Able to clearly communicate basic ideas in written and verbal formats, with some awareness of audience and context.",
          },
          2: {
            requirements:
              "Able to convey ideas and information clearly in both written and verbal formats, understanding the importance of tone and clarity for different audiences.",
          },
          3: {
            requirements:
              "Skilled in communicating complex ideas effectively; adjusts communication style to suit the audience and context.",
          },
          4: {
            requirements:
              "Expert communicator, able to engage diverse audiences and effectively manage difficult conversations or negotiations.",
          },
          5: {
            requirements:
              "Able to lead communication strategies, influencing key stakeholders and guiding teams through complex projects and discussions.",
          },
          6: {
            requirements:
              "A recognized thought leader in communication, shaping organizational strategies, culture, and aligning teams through effective communication.",
          },
        },
      },
      {
        name: "Problem Solving",
        score: {
          current: 5,
          prev: 4,
          target: 6,
        },
        bandings: {
          1: {
            requirements:
              "Able to approach simple problems with standard solutions, using basic critical thinking skills.",
          },
          2: {
            requirements:
              "Able to identify problems and propose logical solutions, using basic analysis and reasoning.",
          },
          3: {
            requirements:
              "Able to tackle complex problems by breaking them down into smaller components and applying structured problem-solving techniques.",
          },
          4: {
            requirements:
              "Proficient at addressing complex and ambiguous problems, with an ability to synthesize information and propose innovative solutions.",
          },
          5: {
            requirements:
              "Able to solve high-impact problems that influence strategic decisions, leveraging advanced problem-solving frameworks and techniques.",
          },
          6: {
            requirements:
              "Recognized as an expert in problem solving, able to guide teams through the most challenging and ambiguous issues, driving organizational change.",
          },
        },
      },
      {
        name: "Leadership",
        score: {
          current: 6,
          prev: 5,
          target: 6,
        },
        bandings: {
          1: {
            requirements:
              "Demonstrates basic leadership qualities, including the ability to manage small teams and make decisions for routine tasks.",
          },
          2: {
            requirements:
              "Able to lead teams for more complex projects, taking responsibility for decisions and providing guidance for others.",
          },
          3: {
            requirements:
              "Skilled in leading teams of varying sizes, ensuring alignment to organizational goals and adapting leadership style to meet team needs.",
          },
          4: {
            requirements:
              "Able to lead cross-functional teams, aligning multiple stakeholders and fostering collaboration to drive major initiatives and strategic outcomes.",
          },
          5: {
            requirements:
              "A strong strategic leader, able to lead large teams or departments, develop organizational strategies, and manage complex change initiatives.",
          },
          6: {
            requirements:
              "Visionary leader, able to inspire and drive transformation at an organizational level, influencing culture, and shaping the future direction of the company.",
          },
        },
      },
      {
        name: "Project Management",
        score: {
          current: 5,
          prev: 3,
          target: 5,
        },
        bandings: {
          1: {
            requirements:
              "Able to manage basic projects with clear goals, deadlines, and deliverables, using basic project management tools.",
          },
          2: {
            requirements:
              "Capable of managing more complex projects, ensuring deliverables are met within scope, time, and budget constraints.",
          },
          3: {
            requirements:
              "Experienced in managing projects with multiple stakeholders, risks, and changing requirements, while maintaining focus on outcomes.",
          },
          4: {
            requirements:
              "Able to lead large, cross-functional projects, managing project teams, resources, and timelines to deliver strategic business results.",
          },
          5: {
            requirements:
              "Skilled in overseeing a portfolio of projects, with an ability to optimize resource allocation, manage interdependencies, and mitigate risks.",
          },
          6: {
            requirements:
              "A recognized expert in project management, capable of leading large-scale, transformative initiatives and guiding others in advanced project management methodologies.",
          },
        },
      },
    ],
    bandingCompetencies: [
      {
        name: "Digital Dexterity",
        score: {
          current: 3,
          prev: 2,
          target: 5,
        },
        bandings: {
          1: {
            requirements:
              "Basic awareness of digital tools and technologies, with an ability to use them for simple tasks.",
          },
          2: {
            requirements:
              "Ability to effectively use digital tools for routine tasks, with some understanding of their functionalities and integration.",
          },
          3: {
            requirements:
              "Proficient in using digital tools to optimize daily tasks; familiar with multiple tools and how they integrate in a digital workspace.",
          },
          4: {
            requirements:
              "Advanced proficiency in utilizing digital tools for complex tasks, with an understanding of automation and integration across platforms.",
          },
          5: {
            requirements:
              "Expert in integrating and managing multiple digital tools, utilizing them for strategic decision-making and workflow optimization.",
          },
          6: {
            requirements:
              "Thought leader in digital technologies; able to guide and train others, driving innovation and transformation in the digital workspace.",
          },
        },
      },
      {
        name: "Communication Skills",
        score: {
          current: 4,
          prev: 3,
          target: 6,
        },
        bandings: {
          1: {
            requirements:
              "Able to clearly communicate basic ideas in written and verbal formats, with some awareness of audience and context.",
          },
          2: {
            requirements:
              "Able to convey ideas and information clearly in both written and verbal formats, understanding the importance of tone and clarity for different audiences.",
          },
          3: {
            requirements:
              "Skilled in communicating complex ideas effectively; adjusts communication style to suit the audience and context.",
          },
          4: {
            requirements:
              "Expert communicator, able to engage diverse audiences and effectively manage difficult conversations or negotiations.",
          },
          5: {
            requirements:
              "Able to lead communication strategies, influencing key stakeholders and guiding teams through complex projects and discussions.",
          },
          6: {
            requirements:
              "A recognized thought leader in communication, shaping organizational strategies, culture, and aligning teams through effective communication.",
          },
        },
      },
      {
        name: "Problem Solving",
        score: {
          current: 5,
          prev: 4,
          target: 6,
        },
        bandings: {
          1: {
            requirements:
              "Able to approach simple problems with standard solutions, using basic critical thinking skills.",
          },
          2: {
            requirements:
              "Able to identify problems and propose logical solutions, using basic analysis and reasoning.",
          },
          3: {
            requirements:
              "Able to tackle complex problems by breaking them down into smaller components and applying structured problem-solving techniques.",
          },
          4: {
            requirements:
              "Proficient at addressing complex and ambiguous problems, with an ability to synthesize information and propose innovative solutions.",
          },
          5: {
            requirements:
              "Able to solve high-impact problems that influence strategic decisions, leveraging advanced problem-solving frameworks and techniques.",
          },
          6: {
            requirements:
              "Recognized as an expert in problem solving, able to guide teams through the most challenging and ambiguous issues, driving organizational change.",
          },
        },
      },
      {
        name: "Leadership",
        score: {
          current: 6,
          prev: 5,
          target: 6,
        },
        bandings: {
          1: {
            requirements:
              "Demonstrates basic leadership qualities, including the ability to manage small teams and make decisions for routine tasks.",
          },
          2: {
            requirements:
              "Able to lead teams for more complex projects, taking responsibility for decisions and providing guidance for others.",
          },
          3: {
            requirements:
              "Skilled in leading teams of varying sizes, ensuring alignment to organizational goals and adapting leadership style to meet team needs.",
          },
          4: {
            requirements:
              "Able to lead cross-functional teams, aligning multiple stakeholders and fostering collaboration to drive major initiatives and strategic outcomes.",
          },
          5: {
            requirements:
              "A strong strategic leader, able to lead large teams or departments, develop organizational strategies, and manage complex change initiatives.",
          },
          6: {
            requirements:
              "Visionary leader, able to inspire and drive transformation at an organizational level, influencing culture, and shaping the future direction of the company.",
          },
        },
      },
      {
        name: "Project Management",
        score: {
          current: 5,
          prev: 3,
          target: 5,
        },
        bandings: {
          1: {
            requirements:
              "Able to manage basic projects with clear goals, deadlines, and deliverables, using basic project management tools.",
          },
          2: {
            requirements:
              "Capable of managing more complex projects, ensuring deliverables are met within scope, time, and budget constraints.",
          },
          3: {
            requirements:
              "Experienced in managing projects with multiple stakeholders, risks, and changing requirements, while maintaining focus on outcomes.",
          },
          4: {
            requirements:
              "Able to lead large, cross-functional projects, managing project teams, resources, and timelines to deliver strategic business results.",
          },
          5: {
            requirements:
              "Skilled in overseeing a portfolio of projects, with an ability to optimize resource allocation, manage interdependencies, and mitigate risks.",
          },
          6: {
            requirements:
              "A recognized expert in project management, capable of leading large-scale, transformative initiatives and guiding others in advanced project management methodologies.",
          },
        },
      },
    ]
  });

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  console.log(htmlContent);

  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    scale: 1,
    margin: {
      top: "0mm",
      right: "0mm",
      bottom: "0mm",
      left: "0mm",
    },
  });

  await browser.close();
  return pdfBuffer;
}

async function generatePDFsFromFile(filePaths) {
  for (const filePath of filePaths) {
    try {
      const pdfBuffer = await printPDFFromTemplate(filePath);
      const filename = formatFileToFilename(filePath) + ".pdf";
      const outputPath = path.join(path.dirname(filePath), filename);

      // Save the buffer to a file
      fs.writeFileSync(outputPath, pdfBuffer);
      console.log(`PDF saved successfully as ${filename}`);
    } catch (error) {
      console.error(`Error generating PDF for ${filePath}:`, error);
    }
  }
}

const filePaths = [
  // 'test.html',
  "src/index.html",
];

// Run the function to generate PDFs for each URL
generatePDFsFromFile(filePaths);
